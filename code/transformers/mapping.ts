//TODO: make it work for getters
//TODO: make it work for arrays
//TODO: add subtype comments
import * as ts from 'typescript';
let factory = ts.factory
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

                        // @ts-ignore
                        let type = subnode.type
                        let tokenTranslation = {
                            131: "booolean",
                            144: "number",
                            147: "string"
                        }
                        let propertyType = tokenTranslation[type.kind] || type.kind
                        if(type.typeName) propertyType = type.typeName.escapedText
                        mapValues.push(
                            factory.createPropertyAssignment(
                                subnode.name.escapedText,
                                factory.createStringLiteral(propertyType)
                            )
                        )
                    }

                    if(mapValues) {
                        let mapProperty = factory.createPropertyDeclaration([], [ts.createModifier(ts.SyntaxKind.StaticKeyword)], mapVariableName, undefined, undefined, factory.createObjectLiteralExpression(mapValues))
                        return factory.updateClassDeclaration(node, node.decorators, node.modifiers, node.name.escapedText, node.typeParameters, node.heritageClauses, [mapProperty, ...node.members])
                    }
                }
                return ts.visitEachChild(node, visitor, ctx);
            }
            return ts.visitEachChild(sourceFile, visitor, ctx);
        };
    };
}