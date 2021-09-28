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
                let range = document.createRange()
                range.selectNodeContents(node)

                return Math.sqrt(range.getBoundingClientRect().height)
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
            if(isNaN(t)) {console.warn("NaN in weighted sum"); continue}
            sum += t
            max = Math.max(max, t)
        }

        return max*0.8+sum*0.2
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
        let style = window.getComputedStyle(element)
        if(!style.hasOwnProperty("fontVariationSettings")) return {}
        // @ts-ignore
        let rawSettings = window.getComputedStyle(element).fontVariationSettings.split(/,?\s*"\s*/).filter(a=>a)

        let parsedSettings = {}
        for(let i=0;i<rawSettings.length;i+=2)
            parsedSettings[rawSettings[i]] = parseFloat(rawSettings[i+1])

        return parsedSettings
    }

}