class GUI {
    private static initialized = false

    public static generate(map: IntentionMap, content: any) {
        let chrom = GeneticScope.train(map, content)
        let builtElement = chrom.build(content)
        this.insert(builtElement.html, builtElement.css)
    }

    private static insert(html: HTMLElement, css: string) {
        if(this.initialized) return this.update(html, css)

        this.initialized = true
        return this.initialize(html, css)
    }
    private static initialize(html: HTMLElement, css: string) {
        let body = document.querySelector("body")

        let styleElement = document.createElement("style")
        styleElement.id = "dynamicStyle"
        styleElement.innerHTML = css

        body.appendChild(styleElement)
        body.appendChild(html)
    }
    private static update(html: HTMLElement, css: string) {
        document.querySelectorAll("body ._ *").forEach((el) => {if(el instanceof HTMLElement) el.style.transitionDuration = Math.floor(Math.random()*70+30)/100+"s"})
        document.querySelector("#dynamicStyle").innerHTML = "* {transition: all}\n"+css
    }
}