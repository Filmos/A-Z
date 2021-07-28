class GeneticScope {
    private readonly map: IntentionMap
    private readonly example: WrappedObject<any>
    private readonly scorer: GeneticScorer

    constructor(map: IntentionMap, example: WrappedObject<any>) {
        this.map = map
        this.example = example
        this.scorer = new GeneticScorer(map, example)
    }

    public train(): GraphicalChromosome {
        let bestChrom : GraphicalChromosome
        let bestScore = 0

        for(let i=0;i<20000;i++) {
            let chrom = new GraphicalChromosome(this.map)
            chrom.randomize()
            let score = this.scorer.score(chrom)

            if(score > bestScore) {
                bestChrom = chrom
                bestScore = score
            }
        }
        console.log(bestScore)
        return bestChrom
    }
    public static train(map: IntentionMap, example: any): GraphicalChromosome {
        let scope = new GeneticScope(map, example)
        return scope.train()
    }
}