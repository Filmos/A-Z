class GraphicalGene {
    private readonly path: string
    private blocks: GraphicalBlockInstance[] = []

    constructor(path: string) {
        this.path = path
    }

    public buildHTML(children: HTMLElement[], element: any): HTMLElement {
        let outer = document.createElement('div')
        outer.className = this.path || "_"

        for(let child of children) outer.appendChild(child);
        if(children.length == 0) outer.innerText = ""+element

        return outer
    }
    public buildCSS(): string {
        let innerCSS = this.blocks.map(block => block.apply().css).filter(c => c)
        if(innerCSS.length==0) return ""
        return "."+CSS.escape(this.path)+" {"+innerCSS.join("; ")+"}"
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

type prebuiltElement = {css?: string, html?: HTMLElement}
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

    public build(target: any): prebuiltElement {
        return {
            html: this.buildHTML({type: "body", inner: this.map}, target, ""),
            css: this.buildCSS()
        }
    }

    private buildHTML(map: TypeMap & {inner?: DescriptiveMap}, target: any, path: string): HTMLElement {
        if(!target) return null

        let children = []
        for(let subpath in map.inner) if(map.inner.hasOwnProperty(subpath)) {
            let subtargets = this.getByAccessor(target, subpath, path)
            for(let subtarget of subtargets)
                children.push(this.buildHTML(map.inner[subpath], subtarget, mergePath(path, subpath)))
        }

        return this.genes[path].buildHTML(children.filter(a => a), target)
    }
    private getByAccessor(target: any, subpath: string, path: string): any[] {
        let accessor = this.accessors[mergePath(path, subpath)]
        if(accessor) return accessor(target)
        return [safeSubpathTraversal(target, subpath)]
    }


    private buildCSS(): string {
        let fullCSS = []
        for(let path in this.genes) {
            if(path == "") continue
            fullCSS.push(this.genes[path].buildCSS())
        }
        return fullCSS.filter(c=>c).join("\n")
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