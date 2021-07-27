class GeneticScorer {
    private readonly map: IntentionMap
    private readonly example: any

    constructor(map: IntentionMap, example: any) {
        this.map = map
        this.example = example
        console.log(map)
    }

    public score(chrom: GraphicalChromosome): number {
        return 0
    }
}