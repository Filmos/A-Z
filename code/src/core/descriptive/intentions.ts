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
    public shapeToIntention(fullMap: DescriptiveMap): DescriptiveMap {
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

class IntentionMap {
    [property: string]: TypeMap & { inner?: IntentionMap }

    constructor(intention: Intention | string[], source: rawClass, subtype?: TypeMap[]) {
        if(!(intention instanceof Intention)) intention = new Intention(intention)

        let properMap = intention.shapeToIntention(getDescriptiveMap(source, subtype))
        for(let key in properMap) if(properMap.hasOwnProperty(key))
            this[key] = properMap[key]
    }


    static flatten(map: DescriptiveMap, prefix:string=""): DescriptiveMap {
        let flatMap : DescriptiveMap = {}
        for(let path in map) if(map.hasOwnProperty(path)) {
            flatMap[prefix+path] = {...map[path]}
            if(map[path].inner)
                flatMap = {...flatMap, ...IntentionMap.flatten(map[path].inner, prefix+path+"/")}
            delete flatMap[prefix+path].inner
        }
        return flatMap
    }
}
