class WrappedObject<T> {
    private readonly object: T
    private readonly map: IntentionMap

    constructor(object: T, map: IntentionMap) {
        this.object = object
        this.map = map
    }

    public getPaths(path: string): string[] {
        return WrappedObject.getPaths(this.object, this.map, path.split("/"))
    }
    private static getPaths(object: any, map: IntentionMap, path: string[]): string[] {
        if(path.length == 0) return [""]
        let subPath = path[0]
        path = path.slice(1)


        let iterateOver = {}
        iterateOver[subPath] = object[subPath]

        let subMap = map[subPath]
        if(subMap) {
            if(subMap.accessor)
                iterateOver = subMap.accessor(object)
        } else {
            for(let potentialPath in map) if(map.hasOwnProperty(potentialPath)) {
                if(map[potentialPath].accessor && map[potentialPath].accessor(object)[subPath]) {
                    subMap = map[potentialPath]
                    break
                }
            }
        }
        if(!subMap) return []


        let fullInnerReturn : string[] = []
        for(let key in iterateOver) {
            let innerReturn = this.getPaths(iterateOver[key], subMap.inner, path)
            fullInnerReturn = fullInnerReturn.concat(innerReturn.map(p => (p ? key + "/" + p : key)))
        }


        return fullInnerReturn
    }
}