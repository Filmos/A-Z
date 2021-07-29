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

        let totalScore = 0
        let normalizationFactor = 0
        for(let group of this.intentionTarget.connectivity) {
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
            totalScore += Math.abs(
                (Math.max(result["XL"], result["XC"], result["XR"])+result["XL"]/4+result["XC"]/4+result["XR"]/4)
                -(Math.max(result["YT"], result["YC"], result["YB"])+result["YT"]/4+result["YC"]/4+result["YB"]/4)
            )*group.weight*group.multiplier
            normalizationFactor += group.weight*group.multiplier
        }
        return totalScore/(0.95*1.75)/normalizationFactor*10
    }
    private static getBoundingBox(element: Element): DOMRect {
        let range = document.createRange()
        range.selectNodeContents(element)
        return range.getBoundingClientRect()
    }
}