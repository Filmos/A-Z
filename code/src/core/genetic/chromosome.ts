type GeneSave = {[gene: string]: {[param: string]: any}}
type ChromosomeSave = {[path: string]: GeneSave}
class GraphicalGene {
    private readonly path: string
    private blocks: {[type: string]: GraphicalBlockInstance} = {}
    private tags: string[] = []

    constructor(path: string, tags: string[]) {
        this.path = path
        this.tags = tags
    }



    public buildHTML(children: HTMLElement[], element: any): HTMLElement {
        let outer = document.createElement('div')
        outer.className = this.path || "_"

        for(let child of children) outer.appendChild(child);
        if(children.length == 0) outer.innerText = ""+element

        return outer
    }
    public buildCSS(): string {
        let innerCSS = Object.values(this.blocks).map(block => block.apply().css).filter(c => c)
        if(innerCSS.length==0) return ""
        return "."+CSS.escape(this.path)+" {"+innerCSS.join("; ")+"}"
    }



    public getAsSaveable(): GeneSave {
        let saveableCopy = {}
        for(let block in this.blocks)
            saveableCopy[block] = this.blocks[block].getParams()

        return saveableCopy
    }
    public loadFromSave(save: GeneSave) {
        for(let block in save) if(save.hasOwnProperty(block))
            this.addBlock(GraphicalBlock.registry[block].instance(save[block]))
    }



    public randomize() {
        let list : GraphicalBlock[] = []
        for(let cat in GraphicalBlock.list) {
            if(cat.split(",").filter(c => c).every(elem => this.tags.includes(elem)))
                list = list.concat(GraphicalBlock.list[cat])
        }

        let breakPoint = 0.4+0.04*list.length
        for(let block of shuffle(list)) {
            if(Math.random()>breakPoint) break
            this.addBlock(block.randomInstance())
        }
    }
    public addBlock(block: GraphicalBlockInstance) {
        this.blocks[block.getName()] = block
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
        this.genes[""] = new GraphicalGene("", [])

        for(let path in flatMap) if(flatMap.hasOwnProperty(path)) {
            let tags = []
            if(flatMap[path].innerKeys?.length > 0) tags.push("parent")
            else tags.push("leaf")
            this.genes[path] = new GraphicalGene(path, tags)
            if(flatMap[path].accessor) this.accessors[path] = flatMap[path].accessor
        }
    }
    public randomize() {
        for(let path in this.genes)
            this.genes[path].randomize()
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



    public getAsSaveable(): ChromosomeSave {
        let saveableCopy = {}
        for(let path in this.genes)
            saveableCopy[path] = this.genes[path].getAsSaveable()

        return saveableCopy
    }
    public loadFromSave(save: ChromosomeSave) {
        for(let path in save) if(save.hasOwnProperty(path))
            this.genes[path].loadFromSave(save[path])
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