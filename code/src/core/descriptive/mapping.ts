type DescriptiveMap = {
    type: string,
    subtype: string,
    inner: any
}
type DescriptiveType
    = "property"
    | "identifier"
    | "list"

function descriptive(type: DescriptiveType, subtype?: string) {
    return function (target: any, propertyKey: string) {
        // @ts-ignore
        let R = Reflect.getMetadata("design:returntype", target, propertyKey)
        // @ts-ignore
        if(!R) R = Reflect.getMetadata("design:type", target, propertyKey)

        if(!target["_descriptiveMap"]) target["_descriptiveMap"] = {}
        target["_descriptiveMap"][propertyKey] = {type: type, subtype: subtype, inner: R}
        console.warn(propertyKey, R)
    };
}

function desc(target: any, propertyKey: string) {
    return descriptive("property")(target, propertyKey)
}
function descId(target: any, propertyKey: string) {
    return descriptive("identifier")(target, propertyKey)
}
function descList(priority: string) {
    return descriptive("list", priority)
}