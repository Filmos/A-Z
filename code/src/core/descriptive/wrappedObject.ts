class WrappedObject<T> {
    private readonly object: T
    private readonly map: IntentionMap

    constructor(object: T, map: IntentionMap) {
        this.object = object
        this.map = map
    }


    public get(path: string): {[path: string]: any} {
        return this.runOverPath(path,
            (object, map, fullPath) => {let ret = {}; ret[fullPath] = object; return ret},
            (a, b) => {return {...a, ...b}}
        )
    }
    public getPaths(path: string): string[] {
        return this.runOverPath(path,
            (object, map, fullPath) => [fullPath],
            (a, b) => a.concat(b)
        )
    }


    private runOverPath(path: string, leafFunc: (object: any, map: IntentionMap, fullPath: string)=>any, joinFunc: (a: any, b: any)=>any): any {
        return WrappedObject.runOverPath(this.object, this.map, path.split("/"),"", leafFunc, joinFunc)
    }
    private static runOverPath(object: any, map: IntentionMap, path: string[], fullPath: string,
                       leafFunc: (object: any, map: IntentionMap, fullPath: string)=>any, joinFunc: (a: any, b: any)=>any): {[path: string]: any} {


        if(path.length == 0) return leafFunc(object, map, fullPath)
        let subPath = path[0]
        path = path.slice(1)

        let nextLevel = this.traverseSubpath(object, map, subPath)
        if(!nextLevel) return null


        let fullReturn = null
        for(let obj in nextLevel.objects) {
            let innerReturn = this.runOverPath(nextLevel.objects[obj], nextLevel.map, path, (fullPath ? fullPath + "/" : "") + obj, leafFunc, joinFunc)
            if(!fullReturn) fullReturn = innerReturn
            else if(innerReturn) fullReturn = joinFunc(fullReturn, innerReturn)
        }

        return fullReturn
    }
    private static traverseSubpath(object: any, map: IntentionMap, subPath: string): {objects: {[index: string]: any}, map: IntentionMap} {
        if(!object) return null
        let objectMap = {}
        objectMap[subPath] = object[subPath]


        let subMap = map[subPath]
        if(subMap) {
            if(subMap.accessor)
                objectMap = subMap.accessor(object)
        } else {
            for(let potentialPath in map) if(map.hasOwnProperty(potentialPath)) {
                if(map[potentialPath].accessor && map[potentialPath].accessor(object)[subPath]) {
                    subMap = map[potentialPath]
                    break
                }
            }
        }
        if(!subMap) return null


        for(let obj in objectMap)
            if(isFunction(objectMap[obj])) objectMap[obj] = objectMap[obj].bind(object)()

        return {objects: objectMap, map: subMap.inner}
    }
}