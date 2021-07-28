class GeneticScorer {
    private readonly map: IntentionMap
    private readonly example: WrappedObject<any>
    private intentionTarget = new MetaIntention()

    constructor(map: IntentionMap, example: WrappedObject<any>) {
        this.map = map
        this.example = example

        console.warn(this.example.getChildrenRawPaths())
        console.warn(this.example.getWrapped("tasks")["tasks"].getWrapped("*"))

        this.parseMetaIntention()
        console.log(this.intentionTarget)
    }
    private parseMetaIntention() {
        let flatMap = IntentionMap.flatten(this.map)
        for(let path in flatMap) if(flatMap.hasOwnProperty(path)) {
            let intention = flatMap[path].intention
            if(!intention) continue

            for(let group of intention.connectivity) {
                let parsedPaths = this.example.getPaths(path)
                parsedPaths = shuffle(parsedPaths).slice(0,3)

                for(let subPath of parsedPaths) {
                    let parsedTargets = group.targets
                        .map(t => this.example.getPaths(subPath + "/" + t))
                        .reduce((a, b) => a.concat(b))
                    this.intentionTarget.addConnection(shuffle(parsedTargets), group.weight)
                }
            }

        }
    }

    public score(chrom: GraphicalChromosome): number {
        return 0
    }
}