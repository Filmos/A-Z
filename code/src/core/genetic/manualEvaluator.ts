class ManualEvaluator {
    public static evalVisibility(element: Element): number {
        return this.weightedSum([
            this.evalVisibilityText(element),
            this.evalVisibilityBackground(element)
        ])
    }

    private static evalVisibilityText(element: Element): number {
        return Array.from(element.childNodes)
            .filter(node => node.nodeType == Node.TEXT_NODE)
            .map(node => {
                return parseFloat(window.getComputedStyle(element)["fontSize"])*3/2
                     * ((this.getFontVariation(element)["wght"]||400)/1000)
                     * (this.getBackgroundColor(element).contrast(this.getFontColor(element))**0.3)
            })
            .reduce((a, b) => a+b, 0)
    }
    private static evalVisibilityBackground(element: Element): number {
        return element.getBoundingClientRect().height
             * this.evalBorders(element)
    }

    private static weightedSum(terms: number[]) {
        let max = 0
        let sum = 0

        for(let t of terms) {
            if(isNaN(t)) {console.warn("NaN in weighted sum", terms); continue}
            sum += t
            max = Math.max(max, t)
        }

        return max*0.8+sum*0.2
    }

    public static compareElements(elementA: Element, elementB: Element) {
        let elementType = ManualEvaluator.getElementType(elementA)
        if(ManualEvaluator.getElementType(elementB) != elementType) return 5
        let overrides: any = {
            text: {display: 0, "padding.*": 0},
            group: {"padding(block|inline)?": 0, "padding.*": 0.14, "font.*": 0, "border.*": 0.09}
        }
        overrides = overrides[elementType] || {}

        let styleA = ManualEvaluator.getExpandedStyle(elementA)
        let styleB = ManualEvaluator.getExpandedStyle(elementB)
        let styleDifference = {}

        for(let prop in styleA) {
            if(prop.search(/origin|width|height/i) != -1) continue
            if(styleA[prop] != styleB[prop]) styleDifference[prop] = {A: styleA[prop], B: styleB[prop]}
        }

        return Object.keys(styleDifference).map(key => {
            let diff = styleDifference[key]
            let ratio = 0.8

            let floatA = parseFloat(diff.A), floatB = parseFloat(diff.B)
            if(!isNaN(floatA) && !isNaN(floatB)) ratio = Math.abs(floatA-floatB)/Math.max(floatA+1, floatB+1)
            else if(diff.A.indexOf("rgb") != -1 && diff.B.indexOf("rgb") != -1) ratio = Color.parse(diff.A).contrast(Color.parse(diff.B))/5

            let overrideMultiplier = Object.keys(overrides)
                  .filter(patt => {return (new RegExp("^"+patt+"$", "i")).test(key)})
                  .map(p => overrides[p])
                  .reduce((a, b)=>a*b, 1)
            ratio = Math.min(1, ratio)*overrideMultiplier
            return ratio*ratio*ratio
        }).reduce((a, b)=>a+b, 0)*20
    }

    public static evalBorders(element: Element): number {
        let score = 0
        let style = window.getComputedStyle(element)
        let ownColor = this.getBackgroundColor(element)
        let backgroundColor = this.getBackgroundColor(element.parentElement)

        let fillScore = Math.min((backgroundColor.contrast(ownColor)-1)/7, 1)
        score += fillScore*2

        for(let side of ["Top", "Left", "Bottom", "Right"]) {
            let width = Math.min(parseFloat(style["border"+side+"Width"])/4, 1)
            let color = Color.parse(style["border"+side+"Color"])
            let sideScore = Math.min((backgroundColor.contrast(color)-1)/7, 1)*width
            score += Math.max(sideScore, fillScore)
        }

        return score/6*10
    }



    public static getBoundingBox(element: Element): DOMRect {
        let range = document.createRange()
        range.selectNodeContents(element)
        return range.getBoundingClientRect()
    }

    public static getBackgroundColor(element: Element): Color {
        let thisColor = Color.parse(window.getComputedStyle(element).backgroundColor)
        if(thisColor.alpha() == 1) return thisColor

        let backColor = this.getBackgroundColor(element.parentElement)
        return thisColor.overlayOn(backColor)
    }
    public static getFontColor(element: Element): Color {
        let style = window.getComputedStyle(element)

        let thisColor = Color.parse(style.color)
        thisColor.a *= parseFloat(style.opacity)

        return thisColor
    }

    public static getFontVariation(element: Element): {[index: string]: number} {
        let defaultValue = {wght: 400}
        let style = window.getComputedStyle(element)
        if(!style.hasOwnProperty("fontVariationSettings") || style["fontVariationSettings"] == "normal") return defaultValue
        let rawSettings = style["fontVariationSettings"].split(/,?\s*"\s*/).filter((a: any)=>a)

        let parsedSettings = {}
        for(let i=0;i<rawSettings.length;i+=2)
            parsedSettings[rawSettings[i]] = parseFloat(rawSettings[i+1])

        return parsedSettings
    }
    public static getExpandedStyle(element: Element): {[index: string]: string|number} {
        let rawStyle = window.getComputedStyle(element)
        let parsedStyle = {}

        for(let prop in rawStyle) {
            if(prop == "fontVariationSettings") continue
            if(prop.search(/webkit|blockSize|inlineSize/i) != -1) continue
            let lRx = "(\\d+\\.?\\d*(px|%))|(rgba?\\(\\d+, \\d+, \\d+(, \\d+)?\\))"
            if(rawStyle[prop] && rawStyle[prop].search && rawStyle[prop].search(new RegExp(`((${lRx}) (${lRx}|([\\w-_]+)))|((${lRx}|([\\w-_]+)) (${lRx}))`, "i")) != -1) continue
            parsedStyle[prop] = rawStyle[prop]
        }

        let fontSettings = ManualEvaluator.getFontVariation(element)
        for(let prop in fontSettings)
            parsedStyle["fontVariationSettings"+prop] = fontSettings[prop]

        return parsedStyle
    }

    public static getElementType(element: Element) {
        if(Array.from(element.childNodes).some(node => node.nodeType == Node.TEXT_NODE)) return "text"
        return "group"
    }
}