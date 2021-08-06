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

    private static scoreFunctions = {
        Connectivity: 10,
        Space: 10,
        Importance: 10,
        BackgroundImmersion: 5
    }
    public score(chrom: GraphicalChromosome): number {
        let body = this.buildScoringEnvironment(chrom)
        let score = 0
        let maxScore = 0

        for (let aspect in GeneticScorer.scoreFunctions) {
            let mult = GeneticScorer.scoreFunctions[aspect]
            score += this["score"+aspect](body)*(mult/10)
            maxScore += mult
        }

        GUI.clear()
        return score/maxScore*100
    }
    public detailedScore(chrom: GraphicalChromosome): DebugCollector {
        let body = this.buildScoringEnvironment(chrom)
        let totalScore = 0, maxScore = 0
        let descScore = new DebugCollector()

        for (let aspect in GeneticScorer.scoreFunctions) {
            let mult = GeneticScorer.scoreFunctions[aspect]
            let score = this["score"+aspect](body, descScore.getSub(["",aspect]))*(mult/10)
            descScore.add(["",aspect], Math.round(score*100)/100+"/"+mult, "prefixPath")
            totalScore += score
            maxScore += mult
        }

        descScore.add("", "Total: "+totalScore/maxScore*100)
        return descScore
    }
    private buildScoringEnvironment(chrom: GraphicalChromosome): HTMLElement {
        let builtElement = chrom.build(this.example)
        GUI.insert(builtElement.html, builtElement.css)

        return document.querySelector("body")
    }


    private scoreConnectivity(body: HTMLElement, debug?: DebugCollector): number {
        let alignmentMap = {}
        let alignmentDef = {
            "XL": ((rect: DOMRect) => rect.left),
            "XC": ((rect: DOMRect) => rect.left+rect.width/2),
            "XR": ((rect: DOMRect) => rect.right),
            "YT": ((rect: DOMRect) => rect.top),
            "YC": ((rect: DOMRect) => rect.top+rect.height/2),
            "YB": ((rect: DOMRect) => rect.bottom)
        }
        let densityDef = {
            "X": ((rect: DOMRect) => {return {min: rect.top, max: rect.bottom, size: rect.height}}),
            "Y": ((rect: DOMRect) => {return {min: rect.left, max: rect.right, size: rect.width}})
        }

        body.querySelectorAll("._ *").forEach(el => {
            let rect = ManualEvaluator.getBoundingBox(el)

            for(let code in alignmentDef) {
                let value = alignmentDef[code](rect)
                let roundValue = Math.floor(value/10)

                if(!alignmentMap[code]) alignmentMap[code] = {}
                if(!alignmentMap[code][roundValue]) alignmentMap[code][roundValue] = {}

                alignmentMap[code][roundValue][el.id] = densityDef[code[0]](rect)
            }
        })

        let lastOrderedWeight = -1
        let lastOrderedMinimum = 1
        let thisOrderedMinimum = 1
        let orderedTargets = this.intentionTarget.connectivity.sort((a, b) => b.weight-a.weight)

        let totalScore = 0
        let normalizationFactor = 0
        for(let group of orderedTargets) {
            let result = {}
            for(let code in alignmentDef) {
                let maxRep = 1
                let min = Infinity, max = -Infinity, size = 0, missed = 0
                for(let rep=0;rep<Math.min(maxRep, 3, group.targets.length);rep++) {
                    let el = body.getElementsByClassName(group.targets[rep])[0]
                    let rect = ManualEvaluator.getBoundingBox(el)
                    let value = Math.floor(alignmentDef[code](rect)/10)
                    let groupPath = alignmentMap[code][value]

                    min = Infinity
                    max = -Infinity
                    size = 0
                    missed = 0
                    for(let tar of group.targets) {
                        let val = groupPath[tar]
                        if(!val) {
                            missed++
                            if(missed < group.targets.length*0.2) continue
                            maxRep++
                            break
                        }

                        min = Math.min(min, val.min)
                        max = Math.max(max, val.max)
                        size += val.size
                    }
                }
                if(missed >= group.targets.length*0.2 || size == 0) result[code] = 0
                else result[code] = size/(max-min)*Math.max(0,(1-missed/(group.targets.length*0.2)))
                if(result[code] > 0.96) result[code] = 0.96-(result[code]-0.96)*10
            }
            let thisScore = Math.abs(
                (Math.max(result["XL"], result["XC"], result["XR"])+result["XL"]/4+result["XC"]/4+result["XR"]/4)
                -(Math.max(result["YT"], result["YC"], result["YB"])+result["YT"]/4+result["YC"]/4+result["YB"]/4)
            )/(0.95*1.75)
            if(debug) debug.add(group.targets.slice(0, 2).join(", ")+(group.targets.length>2?" (+"+(group.targets.length-2)+")":""), thisScore, "prefixPath")

            if(group.weight != lastOrderedWeight) {
                lastOrderedWeight = group.weight
                lastOrderedMinimum = thisOrderedMinimum
                thisOrderedMinimum = thisScore
            }

            if(thisScore > lastOrderedMinimum) {
                let overflowRatio = (thisScore-lastOrderedMinimum)/(1.1-lastOrderedMinimum)
                thisScore = (thisScore*(1-overflowRatio**3)+lastOrderedMinimum*(1-overflowRatio**2))/2
            }

            thisOrderedMinimum = Math.min(thisOrderedMinimum, thisScore)
            totalScore += thisScore*group.weight*group.multiplier
            normalizationFactor += group.weight*group.multiplier
        }
        return totalScore/normalizationFactor*10
    }

    private scoreSpace(body: HTMLElement): number {
        let html = body.ownerDocument.documentElement
        let bodyRect : DOMRect = {
            left: 0, top: 0, x: 0, y: 0, toJSON: ()=>"",
            right: Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth),
            bottom: Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
            width: -1, height: -1
        }
        bodyRect = {...bodyRect, width: bodyRect.right, height: bodyRect.bottom}
        let bodyRealRect = ManualEvaluator.getBoundingBox(body)

        let multiplier = 1
        if(bodyRealRect.left < -2) multiplier/=10
        if(bodyRealRect.top < -2) multiplier/=10
        if(bodyRealRect.width > bodyRect.width) multiplier *= 2/3*(bodyRect.width/bodyRealRect.width)**2
        if(bodyRealRect.height > bodyRect.height) multiplier *= 0.9*(bodyRect.height/bodyRealRect.height)


        let score = 0
        let totalWeight = 0
        function calcScore(innerRect: DOMRect, outerRect: DOMRect) {
            let scoreY = 1, scoreX = 1

            if(outerRect.height > 0) {
                let topDiff = Math.abs(innerRect.top - outerRect.top) / outerRect.height; if(topDiff > 0.1) scoreY -= topDiff - 0.1
                let bottomDiff = Math.abs(innerRect.bottom - outerRect.bottom) / outerRect.height; if(bottomDiff > 0.1) scoreY -= (bottomDiff - 0.1) / 2
            }
            if(outerRect.width > 0) {
                let leftDiff = Math.abs(innerRect.left-outerRect.left)/outerRect.width; if(leftDiff > 0.1) scoreX -= (leftDiff-0.1)/2
                let rightDiff = Math.abs(innerRect.right-outerRect.right)/outerRect.width; if(rightDiff > 0.1) scoreX -= (rightDiff-0.1)/2
                scoreX -= Math.abs(leftDiff-rightDiff)/2
            }

            let weight = Math.sqrt(outerRect.height*outerRect.width)
            score += scoreY*scoreX*weight
            totalWeight += weight
        }


        calcScore(bodyRealRect, bodyRect)
        body.querySelectorAll("._, ._ *").forEach(el => {
            let childrenRect = ManualEvaluator.getBoundingBox(el)
            let ownRect = el.getBoundingClientRect()
            calcScore(childrenRect, ownRect)
        })

        return score/totalWeight*multiplier*10
    }

    private scoreImportance(body: HTMLElement, debug: DebugCollector): number {
        let combinedResults : {[index: number]: {sum: number, count: number}} = {}
        for(let path in this.intentionTarget.importance) {
            let importance = this.intentionTarget.importance[path]
            if(!combinedResults[importance]) combinedResults[importance] = {sum: 0, count: 0}

            let pathScore = 0
            let pathElements = Array.from(body.getElementsByClassName(path))
            pathElements.forEach((el) => {
                pathScore += ManualEvaluator.evalImportance(el)
            })
            combinedResults[importance].sum += pathScore
            combinedResults[importance].count += pathElements.length
            if(debug) debug.add(path+" ("+importance+")", pathScore/pathElements.length, "prefixPath")
        }


        let totalScore = 0
        let previousImp : number = null
        let previousScore : number = null
        for(let i of Object.keys(combinedResults).sort()) {
            let imp = parseFloat(i)
            let score = combinedResults[imp].sum/combinedResults[imp].count
            if(debug) debug.add("<"+i+">", score, "prefixPath")

            if(previousImp) {
                let wantedRatio = imp/previousImp
                let actualRatio = score/previousScore

                if(actualRatio > wantedRatio) totalScore += 1
                else if(actualRatio > 1/wantedRatio)
                    totalScore += (wantedRatio-actualRatio+2)*(wantedRatio*actualRatio-1)/2/(wantedRatio**2-1)
            }

            previousImp = imp
            previousScore = score
        }

        return totalScore/(Object.keys(combinedResults).length-1)*10
    }

    private scoreBackgroundImmersion(body: Element): number {
        let borderWeight = ManualEvaluator.evalBorders(body.getElementsByClassName("_")[0])

        if(borderWeight < 0.1) return 10
        return Math.max(0,5-borderWeight*0.6)
    }
}