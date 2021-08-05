class GUI {
    private static initialized = false

    public static gen(intention: Intention | string[], source: rawClass, content: any) {
        return this.generate(new IntentionMap(intention, source), content)
    }
    public static generate(map: IntentionMap, content: any) {
        let wrappedContent = new WrappedObject(content, map)
        let chrom = GeneticScope.train(map, wrappedContent)
        let builtElement = chrom.build(wrappedContent)
        this.insert(builtElement.html, builtElement.css)
    }

    public static insert(html: HTMLElement, css: string) {
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
    public static clear() {
        document.querySelector("#dynamicStyle").remove()
        document.querySelector("._").remove()
        this.initialized = false
    }
}