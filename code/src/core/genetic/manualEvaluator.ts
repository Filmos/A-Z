class ManualEvaluator {
    public static evalImportance(element: Element): number {
        let rect = ManualEvaluator.getBoundingBox(element)
        let score = Math.sqrt(rect.width*rect.height)

        let contrast = this.getBackgroundColor(element).contrast(this.getFontColor(element))
        score *= contrast**0.3

        let weight = this.getFontVariation(element)["wght"]
        if(weight) score *= weight/100*0.157+0.385

        return score
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