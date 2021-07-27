class GeneticScope {
    private readonly map: IntentionMap
    private readonly example: any

    constructor(map: IntentionMap, example: any) {
        this.map = map
        this.example = example
    }

    public train(): GraphicalChromosome {
        let chrom = new GraphicalChromosome(this.map)
        chrom.randomize()
        return chrom
    }
    public static train(map: IntentionMap, example: any): GraphicalChromosome {
        let scope = new GeneticScope(map, example)
        return scope.train()
    }
}