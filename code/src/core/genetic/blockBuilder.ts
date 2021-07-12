type blockParams = {[param: string]: {type: string, [data: string]: any}}
class GraphicalBlock {
    public static list: GraphicalBlock[] = []
    private readonly name: string
    private readonly params: blockParams
    public readonly func: (params: any)=>string

    constructor(name: string, params: blockParams, func: (params: any)=>string) {
        this.name = name
        this.func = func
        this.params = params
        GraphicalBlock.list.push(this)
    }

    public randomInstance(): GraphicalBlockInstance {
        let randomParams: {[param: string]: any} = {}
        for(let p in this.params) if(this.params.hasOwnProperty(p))
            randomParams[p] = ParamTypes[this.params[p].type].random(this.params[p])

        return new GraphicalBlockInstance(this, randomParams)
    }
}
class GraphicalBlockInstance {
    private readonly origin: GraphicalBlock
    private readonly params: {[param: string]: any}

    constructor(origin: GraphicalBlock, params: {[param: string]: any}) {
        this.origin = origin
        this.params = params
    }

    public apply(): string {
        return this.origin.func(this.params)
    }
}