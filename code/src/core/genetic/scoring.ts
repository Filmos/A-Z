class GeneticScorer {
    private readonly map: IntentionMap
    private readonly example: WrappedObject<any>
    private intentionTarget = new MetaIntention()

    constructor(map: IntentionMap, example: WrappedObject<any>) {
        this.map = map
        this.example = example

        this.parseMetaIntention()
    }
    private parseMetaIntention() {
        let flatMap = IntentionMap.flatten(this.map)
        for(let path in flatMap) if(flatMap.hasOwnProperty(path)) {
            let intention = flatMap[path].intention
            if(!intention) continue

            for(let group of intention.connectivity) {
                let parsedPaths = this.example.getPaths(path)
                parsedPaths = shuffle(parsedPaths).slice(0,4)

                for(let subPath of parsedPaths) {
                    let parsedTargets = group.targets
                        .map(t => this.example.getPaths(subPath + "/" + t))
                        .reduce((a, b) => a.concat(b))
                    this.intentionTarget.addConnection(shuffle(parsedTargets), group.weight, 1/parsedPaths.length)
                }
            }

        }
    }

    public score(chrom: GraphicalChromosome): number {
        let body = this.buildScoringEnvironment(chrom)
        let score = this.scoreConnectivity(body)
                  + this.scoreSpace(body)

        GUI.clear()
        return score
    }
    private buildScoringEnvironment(chrom: GraphicalChromosome): HTMLElement {
        let builtElement = chrom.build(this.example)
        GUI.insert(builtElement.html, builtElement.css)

        return document.querySelector("body")
    }

    private scoreConnectivity(body: HTMLElement): number {
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
            let rect = GeneticScorer.getBoundingBox(el)

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
                    let el = body.ownerDocument.getElementById(group.targets[rep])
                    let rect = GeneticScorer.getBoundingBox(el)
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
    private static getBoundingBox(element: Element): DOMRect {
        let range = document.createRange()
        range.selectNodeContents(element)
        return range.getBoundingClientRect()
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
        let bodyRealRect = GeneticScorer.getBoundingBox(body)

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
            let childrenRect = GeneticScorer.getBoundingBox(el)
            let ownRect = el.getBoundingClientRect()
            calcScore(childrenRect, ownRect)
        })

        return score/totalWeight*multiplier*10
    }
}