//TODO add subtype comments
//TODO remove blank decorator leftover
import * as ts from 'typescript';
let factory = ts.factory

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

export default function(program: ts.Program, pluginOptions: any) {
    return (ctx: ts.TransformationContext) => {
        return (sourceFile: ts.SourceFile) => {
            function visitor(node: ts.Node): ts.Node {
                let mapVariableName = "_descriptiveMap"
                let mapValues = []
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
                        if(subnode.decorators) {
                            for(let decorator of subnode.decorators) {
                                // @ts-ignore
                                if(decorator.expression.escapedText == "D") {
                                    isDescriptive = true
                                    break
                                }
                            }
                        }
                        if(!isDescriptive) continue

                        mapValues.push(
                            factory.createPropertyAssignment(
                                // @ts-ignore
                                subnode.name.escapedText,
                                // @ts-ignore
                                getTypeDefinition(subnode.type)
                            )
                        )
                    }

                    if(mapValues) {
                        let mapProperty = factory.createPropertyDeclaration([], [ts.createModifier(ts.SyntaxKind.StaticKeyword)], mapVariableName, undefined, undefined, factory.createObjectLiteralExpression(mapValues))
                        // @ts-ignore
                        return factory.updateClassDeclaration(node, node.decorators, node.modifiers, node.name.escapedText, node.typeParameters, node.heritageClauses, [mapProperty, ...node.members])
                    }
                }
                return ts.visitEachChild(node, visitor, ctx);
            }
            return ts.visitEachChild(sourceFile, visitor, ctx);
        };
    };
}