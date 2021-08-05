class Intention {
    public readonly entries: string[]
    constructor(entries: string[]) {
        this.entries = entries
    }
    public topLevelDict(): {[topLevel: string]: string[]} {
        let returnDict: {[topLevel: string]: string[]} = {}
        for(let e of this.entries) {
            let ePath = e.split("/")
            if(!returnDict[ePath[0]]) returnDict[ePath[0]] = []
            returnDict[ePath[0]].push((ePath.length == 1)
                ?"."
                :ePath.slice(1).join("/")
            )
        }
        return returnDict
    }
    public shapeToIntention(fullMap: DescriptiveMap): IntentionMap {
        let prunedMap: DescriptiveMap = {}
        let topLevelDict = this.topLevelDict()

        for(let prop in fullMap) if(fullMap.hasOwnProperty(prop)) {
            if(topLevelDict[prop] || fullMap[prop].tags?.includes("Identifier")) {
                prunedMap[prop] = fullMap[prop]
                let leftoverIntention = new Intention(topLevelDict[prop]?.filter(a => a!=".") || [])
                let submap = getDescriptiveMap(fullMap[prop].type, fullMap[prop].subtype)
                if(submap) prunedMap[prop].inner = leftoverIntention.shapeToIntention(submap)
            }
        }
        return prunedMap
    }
}

class MetaIntention {
    connectivity?: {targets: string[], weight: number, multiplier: number}[]
    importance?: {[target: string]: number}

    public isEmpty(): boolean {
        return !(
            (this.connectivity && this.connectivity.length > 0)
         || (this.importance && Object.keys(this.importance).length > 0)
        )
    }

    public addConnection(targets: string[], weight: number, multiplier : number = 1) {
        if(!this.connectivity) this.connectivity = []
        this.connectivity.push({targets: targets, weight: weight, multiplier: multiplier})
    }
    public addImportance(target: string, weight: number) {
        if(!this.importance) this.importance = {}
        this.importance[target] = weight
    }
}
class IntentionMap {
    [property: string]: TypeMap & {
        inner?: IntentionMap,
        innerKeys?: string[],
        collapsedFrom?: string[],
        accessor?: (target: any)=>any,
        intention?: MetaIntention
    }

    constructor(intention: Intention | string[], source: rawClass, subtype?: TypeMap[]) {
        if(!(intention instanceof Intention)) intention = new Intention(intention)

        let properMap = intention.shapeToIntention(getDescriptiveMap(source, subtype))
        for(let key in properMap) if(properMap.hasOwnProperty(key))
            this[key] = properMap[key]

        IntentionMap.getMetaIntentions(this)
    }
    private static getMetaIntentions(map: IntentionMap) {
        let returnMeta = new MetaIntention()
        for(let prop in map) if(map.hasOwnProperty(prop)) {
            let innerMap = map[prop].inner
            let innerIntention = this.getMetaIntentions(innerMap)

            if(map[prop].accessor) {
                innerIntention.addConnection(Object.keys(innerMap), 3)
                returnMeta.addConnection([prop], 2)
                for(let subProp in innerMap) if(innerMap.hasOwnProperty(subProp)) {
                    let weight = 1
                    if(innerMap[subProp].tags?.includes("Identifier"))
                        weight = 1.2

                    returnMeta.addConnection([prop+"/"+subProp], weight)
                    returnMeta.addImportance(prop+"/"+subProp, weight)
                }
            }

            if(!innerIntention.isEmpty()) map[prop].intention = innerIntention
        }
        return returnMeta
    }


    static flatten(map: IntentionMap, prefix:string=""): IntentionMap {
        let flatMap : IntentionMap = {}
        for(let path in map) if(map.hasOwnProperty(path)) {
            flatMap[prefix+path] = {...map[path]}
            if(map[path].inner) {
                flatMap = {...flatMap, ...IntentionMap.flatten(map[path].inner, prefix + path + "/")}
                flatMap[prefix + path].innerKeys = Object.keys(map[path].inner)
                delete flatMap[prefix + path].inner
            }
        }
        return flatMap
    }
    static flattenAndCollapse(map: IntentionMap, prefix:string="", collapsedFrom:string[]=[]): IntentionMap {
        let flatMap : IntentionMap = {}
        for(let path in map) if(map.hasOwnProperty(path)) {
            let collapse = (map[path].inner && !map[path].accessor && Object.keys(map[path].inner).length == 1)
            if(!collapse) {
                flatMap[prefix+path] = {...map[path]}
                if(collapsedFrom.length > 0) flatMap[prefix + path].collapsedFrom = collapsedFrom
            }

            if(map[path].inner) {
                let collapseList : string[] = []
                if(collapse) collapseList = [...collapsedFrom, prefix + path]

                flatMap = {...flatMap, ...IntentionMap.flattenAndCollapse(map[path].inner, prefix + path + "/", collapseList)}

                if(!collapse) {
                    flatMap[prefix + path].innerKeys = Object.keys(map[path].inner)
                    delete flatMap[prefix + path].inner
                }
            }
        }
        return flatMap
    }
}
