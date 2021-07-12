class GraphicalGene {
    private readonly path: string
    private blocks: GraphicalBlockInstance[] = []

    constructor(path: string) {
        this.path = path
    }

    public build(children: HTMLElement[], element: any): HTMLElement {
        let outer = document.createElement('div')
        outer.className = this.path

        outer.setAttribute("style", this.getCombinedStyle())

        for(let child of children) outer.appendChild(child);
        if(children.length == 0) outer.innerText = ""+element

        return outer
    }
    private getCombinedStyle(): string {
        return this.blocks.map(block => block.apply()).join("; ")
    }

    public static generateRandom(path: string): GraphicalGene {
        let gene = new GraphicalGene(path)
        for(let block of shuffle(GraphicalBlock.list)) {
            if(Math.random()>0.5) break
            gene.addBlock(block.randomInstance())
        }

        return gene
    }
    public addBlock(block: GraphicalBlockInstance) {
        this.blocks.push(block)
    }
}
class GraphicalChromosome {
    private readonly map: IntentionMap
    private genes: {[path: string]: GraphicalGene} = {}
    private accessors: {[path: string]: (target: any)=>any} = {}

    constructor(map: IntentionMap) {
        this.map = map

        let flatMap = IntentionMap.flatten(map)
        this.genes[""] = GraphicalGene.generateRandom("")

        for(let path in flatMap) if(flatMap.hasOwnProperty(path)) {
            this.genes[path] = GraphicalGene.generateRandom(path)
            if(flatMap[path].accessor) this.accessors[path] = flatMap[path].accessor
        }
    }

    public build(target: any): HTMLElement {
        return this.innerBuild({type: "body", inner: this.map}, target, "")
    }
    private innerBuild(map: TypeMap & {inner?: DescriptiveMap}, target: any, path: string): HTMLElement {
        if(!target) return null

        let children = []
        for(let subpath in map.inner) if(map.inner.hasOwnProperty(subpath)) {
            let subtargets = this.getByAccessor(target, subpath, path)
            for(let subtarget of subtargets)
                children.push(this.innerBuild(map.inner[subpath], subtarget, mergePath(path, subpath)))
        }

        return this.genes[path].build(children.filter(a => a), target)
    }

    private getByAccessor(target: any, subpath: string, path: string): any[] {
        let accessor = this.accessors[mergePath(path, subpath)]
        if(accessor) return accessor(target)
        return [safeSubpathTraversal(target, subpath)]
    }
}
function isFunction(functionToCheck: any) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
function safeSubpathTraversal(target: any, subpath: string): any {
    if(!target) return null
    let subtarget: any = target[subpath]
    if(isFunction(subtarget)) return target[subpath]()
    return subtarget
}
function mergePath(path: string, subpath: string): string {
    return path+(path==""?"":"/")+subpath
}
function shuffle<T>(array: T[]): T[] {
    let arrayCopy = [...array]
    var currentIndex = arrayCopy.length,  randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [arrayCopy[currentIndex], arrayCopy[randomIndex]] = [
            arrayCopy[randomIndex], arrayCopy[currentIndex]];
    }

    return arrayCopy;
}