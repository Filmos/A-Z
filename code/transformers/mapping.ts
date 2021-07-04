//TODO add subtype comments
import * as ts from 'typescript';
let factory = ts.factory

export default function(program: ts.Program, pluginOptions: any) {
    return (ctx: ts.TransformationContext) => {
        return (sourceFile: ts.SourceFile) => {
            function visitor(node: ts.Node): ts.Node {
                let mapVariableName = "_descriptiveMap"
                let mapValues = []
                let membersCopy = []
                // Enter class level
                if (ts.isClassDeclaration(node)) {
                    // Enter property level
                    for(let subnode of node.members) {
                        // @ts-ignore
                        if(subnode.name && subnode.name.escapedText == mapVariableName) {
                            mapValues = null
                            break
                        }

                        let isDescriptive : boolean = false
                        let nonDescriptiveDecorators = []
                        if(subnode.decorators) {
                            for(let decorator of subnode.decorators) {
                                // @ts-ignore
                                if(decorator.expression.escapedText == "D") isDescriptive = true
                                else nonDescriptiveDecorators.push(decorator)
                            }
                        }
                        if(!isDescriptive) {membersCopy.push(subnode); continue}

                        mapValues.push(
                            factory.createPropertyAssignment(
                                // @ts-ignore
                                subnode.name.escapedText,
                                // @ts-ignore
                                getTypeDefinition(subnode.type)
                            )
                        )
                        membersCopy.push(replaceDecorators(subnode, nonDescriptiveDecorators))
                    }

                    if(mapValues) {
                        let mapProperty = factory.createPropertyDeclaration(undefined, [ts.createModifier(ts.SyntaxKind.StaticKeyword)], mapVariableName, undefined, undefined, factory.createObjectLiteralExpression(mapValues))
                        // @ts-ignore
                        return factory.updateClassDeclaration(node, node.decorators, node.modifiers, node.name.escapedText, node.typeParameters, node.heritageClauses, [mapProperty, ...membersCopy])
                    }
                }
                return ts.visitEachChild(node, visitor, ctx);
            }
            return ts.visitEachChild(sourceFile, visitor, ctx);
        };
    };
}

function getTypeDefinition(type) {
    let tokenTranslation = {
        131: "booolean",
        144: "number",
        147: "string",
        178: "Array"
    }
    let propertyType = tokenTranslation[type.kind] || type.kind
    if(type.typeName) propertyType = type.typeName.escapedText
    propertyType = [factory.createStringLiteral(""+propertyType)]

    if(type.elementType) propertyType.push(getTypeDefinition(type.elementType))
    if(type.typeArguments)
        for(let arg of type.typeArguments) propertyType.push(getTypeDefinition(arg))

    return factory.createArrayLiteralExpression(propertyType)
}

function replaceDecorators(node, newDecorators) {
    if(newDecorators.length == 0) newDecorators = undefined

    if(ts.isPropertyDeclaration(node))
        return factory.updatePropertyDeclaration(node, newDecorators, node.modifiers, node.name, node.questionToken || node.exclamationToken, node.type, node.initializer)
    if(ts.isMethodDeclaration(node))
        return factory.updateMethodDeclaration(node, newDecorators, node.modifiers, node.asteriskToken, node.name, node.questionToken, node.typeParameters, node.parameters, node.type, node.body)
    if(ts.isGetAccessorDeclaration(node))
        return factory.updateGetAccessorDeclaration(node, newDecorators, node.modifiers, node.name, node.parameters, node.type, node.body)

    return node
}
