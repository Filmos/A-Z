type blockParams = {[param: string]: {type: string, [data: string]: any}}
type blockResults = {css?: string}
class GraphicalBlock {
    public static list: {[category: string]: GraphicalBlock[]} = {}
    public static registry: {[name: string]: GraphicalBlock} = {}
    public readonly name: string
    private readonly params: blockParams
    public readonly func: (params: any)=>blockResults

    constructor(name: string, params: blockParams, func: (params: any)=>blockResults, category: string="") {
        this.name = name
        this.func = func
        this.params = params

        if(!GraphicalBlock.list[category]) GraphicalBlock.list[category] = []
        GraphicalBlock.list[category].push(this)
        GraphicalBlock.registry[name] = this
    }

    public randomInstance(): GraphicalBlockInstance {
        let randomParams: {[param: string]: any} = {}
        for(let p in this.params) if(this.params.hasOwnProperty(p))
            randomParams[p] = ParamTypes[this.params[p].type].random(this.params[p])

        return this.instance(randomParams)
    }
    public instance(params: {[param: string]: any}): GraphicalBlockInstance {
        return new GraphicalBlockInstance(this, params)
    }
}
class GraphicalBlockInstance {
    private readonly origin: GraphicalBlock
    private readonly params: {[param: string]: any}

    constructor(origin: GraphicalBlock, params: {[param: string]: any}) {
        this.origin = origin
        this.params = params
    }

    public apply(): blockResults {
        return this.origin.func(this.params)
    }

    public getName(): string {
        return this.origin.name
    }
    public getParams(): {[param: string]: any} {
        return this.params
    }
}