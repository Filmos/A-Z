class GeneticScope {
    private readonly map: IntentionMap
    private readonly example: any
    private readonly scorer: GeneticScorer

    constructor(map: IntentionMap, example: any) {
        this.map = map
        this.example = example
        this.scorer = new GeneticScorer(map, example)
    }

    public train(): GraphicalChromosome {
        let chrom = new GraphicalChromosome(this.map)
        chrom.randomize()
        console.log(this.scorer.score(chrom))
        return chrom
    }
    public static train(map: IntentionMap, example: any): GraphicalChromosome {
        let scope = new GeneticScope(map, example)
        return scope.train()
    }
}