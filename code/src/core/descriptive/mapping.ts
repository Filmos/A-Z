function D(...tags: any): any {}

type TypeMap = {type: string, subtype?: TypeMap[], tags?: string[]}
type DescriptiveMap = {[property: string]: TypeMap & {inner?: DescriptiveMap}}
type rawClass = { new (...args: any[]): {}, _descriptiveMap?: (subtype?: TypeMap[]) => DescriptiveMap}


let overloadedDescriptiveMaps = {
    Array: (subtype: TypeMap[]) => {return {"*": subtype[0]}}
}


function getDescriptiveMap(target: rawClass | string, subtype?: TypeMap[]): DescriptiveMap {
    if(typeof target == "string") {
        if(window[target]?._descriptiveMap) return window[target]._descriptiveMap(subtype)
        if(overloadedDescriptiveMaps[target]) return overloadedDescriptiveMaps[target](subtype)
        return
    }
    if(target._descriptiveMap) return target._descriptiveMap(subtype)
}