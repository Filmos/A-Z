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

        for(let prop in fullMap) {
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
    constructor(intention: Intention | string[], source: rawClass, subtype?: TypeMap[]) {
        if(!(intention instanceof Intention)) intention = new Intention(intention)
        console.log(intention.shapeToIntention(getDescriptiveMap(source, subtype)))
    }
}
