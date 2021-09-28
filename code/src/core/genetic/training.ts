class GeneticScope {
    private readonly map: IntentionMap
    private readonly example: WrappedObject<any>
    private readonly scorer: GeneticScorer

    constructor(map: IntentionMap, example: WrappedObject<any>) {
        this.map = map
        this.example = example
        this.scorer = new GeneticScorer(map, example)
    }

    public train(noClear: boolean = false): GraphicalChromosome {
        let bestChrom : GraphicalChromosome
        let bestScore = 0

        console.time("Training")
        for(let i=0;i<1;i++) {
            let chrom = new GraphicalChromosome(this.map)
            chrom.randomize()
            let score = this.scorer.score(chrom)

            if(score > bestScore) {
                bestChrom = chrom
                bestScore = score
            }
        }
        console.timeEnd("Training")

        this.scorer.score(bestChrom, true, noClear)
        return bestChrom
    }
    public static train(map: IntentionMap, example: any, noClear: boolean = false): GraphicalChromosome {
        let scope = new GeneticScope(map, example)
        return scope.train(noClear)
    }
}