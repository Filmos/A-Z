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
        let ordered = this.orderElements(body)
        let scopeCrawler = new BracketCrawler((element: HTMLElement, scopeData: any, crawler) => {
            let rect = element.getBoundingClientRect()
            if(scopeData) {
                let scopeRect = scopeData.getBoundingClientRect()
                if(rect.bottom - scopeRect.bottom > 4) {crawler.stopBracket(); return crawler.repeatElement()}
                else if(rect.right - scopeRect.right > 4 || rect.left - scopeRect.left < -4) {return crawler.skipElement()}
            }

            crawler.startBracket(element)
        })
        if(withDebug) scopeCrawler.parse(ordered).display()

        if(!noClear) GUI.clear()
        dataCollector.display()
        return 5
    }
    private buildScoringEnvironment(chrom: GraphicalChromosome): HTMLElement {
        let builtElement = chrom.build(this.example)
        GUI.insert(builtElement.html, builtElement.css)

        return document.querySelector("#_")
    }

    private getMostVisible(body: HTMLElement): {top: Element, candidates: Element[]} {
        let maxVisibility = -Infinity
        let maxElement: Element = null

        return {
            candidates: Array.from(body.querySelectorAll("*"))
                .map(element => {
                    let visibility = ManualEvaluator.evalVisibility(element)
                    if (visibility > maxVisibility) {
                        maxVisibility = visibility
                        maxElement = element
                    }
                    return {visibility: visibility, element: element}
                })
                .filter(element => element.visibility >= 0.7 * maxVisibility && maxElement != element.element)
                .map(element => element.element),
            top: maxElement
        }
    }

    private orderElements(body: HTMLElement): HTMLElement[] {
        return Array.from(body.querySelectorAll("*"))
            .map((element: HTMLElement) => {
                let el = element
                let depth = 0
                while(el = el.parentElement) depth++

                let rect = element.getBoundingClientRect()
                return {
                    x: Math.round(rect.left/25),
                    y: Math.round(rect.top/25),
                    z: depth,
                    e: element
                }
            })
            .sort((a, b) => {
                if(a.y!=b.y) return a.y-b.y
                if(a.x!=b.x) return a.x-b.x
                return a.z-b.z
            })
            .map(e => e.e)
    }
}