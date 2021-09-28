class GeneticScorer {
    private readonly map: IntentionMap
    private readonly example: WrappedObject<any>
    private intentionTarget = new MetaIntention()

    constructor(map: IntentionMap, example: WrappedObject<any>) {
        this.map = map
        this.example = example

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
                if(!parsedPaths) continue
                parsedPaths = shuffle(parsedPaths).slice(0,4)

                for(let subPath of parsedPaths) {
                    let parsedTargets = group.targets
                        .map(t => this.example.getPaths(subPath + "/" + t))
                        .reduce((a, b) => a.concat(b))
                    this.intentionTarget.addConnection(shuffle(parsedTargets), group.weight, 1/parsedPaths.length)
                }
            }

            for(let target in intention.importance) if(intention.importance.hasOwnProperty(target)) {
                this.intentionTarget.addImportance(path+"/"+target, intention.importance[target])
            }
        }
    }

    public score(chrom: GraphicalChromosome, withDebug: boolean = false, noClear: boolean = false): number {
        let dataCollector = new DebugCollector()
        if(!withDebug) dataCollector = new NullDebugCollector()

        let body = this.buildScoringEnvironment(chrom)
        let mostVisible = this.getMostVisible(body); dataCollector.add("Most visible",mostVisible, "prefixPath")

        if(!noClear) GUI.clear()
        dataCollector.display()
        return 5
    }
    private buildScoringEnvironment(chrom: GraphicalChromosome): HTMLElement {
        let builtElement = chrom.build(this.example)
        GUI.insert(builtElement.html, builtElement.css)

        return document.querySelector("body")
    }

    private getMostVisible(body: HTMLElement): {top: {visibility: number, element: Element}, candidates: {visibility: number, element: Element}[]} {
        let maxVisibility = -Infinity
        let maxElement: {visibility: number, element: Element} = null

        return {
            candidates: Array.from(body.querySelectorAll("*"))
                .map(element => {
                    let visibility = ManualEvaluator.evalVisibility(element)
                    if (visibility > maxVisibility) {
                        maxVisibility = visibility
                        maxElement = {visibility: visibility, element: element}
                        console.log(maxElement)
                    }
                    return {visibility: visibility, element: element}
                })
                .filter(element => element.visibility >= 0.7 * maxVisibility && maxElement.element != element.element),
            top: maxElement
        }
    }
}