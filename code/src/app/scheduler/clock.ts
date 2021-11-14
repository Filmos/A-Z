class Clock {
    private static clocks : Clock[] = []
    private static countdownStart : Date
    private static interval: NodeJS.Timeout

    public static countdownFrom(start: Date) {
        this.stopCountdown()
        this.countdownStart = start

        let updateFunc = ()=>{
            let time = Math.floor((Date.now()-Clock.countdownStart.getTime())/1000)
            let sec = time%60
            time = Math.floor(time/60)
            let min = time%60
            let hour = Math.floor(time/60)

            Clock.setAll(("0"+hour).slice(-2)+":"+("0"+min).slice(-2)+":"+("0"+sec).slice(-2))
        }
        this.interval = setInterval(updateFunc, 1000)
        updateFunc()

    }
    public static stopCountdown() {
        if(this.interval) clearInterval(this.interval)
        this.countdownStart = null
        this.setAll("")
    }
    private static setAll(text: string) {
        this.clocks.forEach(c => c.setValue(text))
    }


    private clockText: SVGTextElement
    public constructor() {
        Clock.clocks.push(this)
    }
    public buildGUI(): SVGElement {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttributeNS(null, "viewBox", "0 0 80 16")
        svg.classList.add("the-clock")
        svg.innerHTML = `<filter id="glow" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"></feGaussianBlur>
          <feMerge>
            <feMergeNode in="blur"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>`

        let backdrop = document.createElementNS("http://www.w3.org/2000/svg", "text")
        backdrop.setAttributeNS(null, "dominant-baseline", "middle")
        backdrop.setAttributeNS(null, "text-anchor", "middle")
        backdrop.setAttributeNS(null, "x", "40")
        backdrop.setAttributeNS(null, "y", "9")
        backdrop.innerHTML = "88:88:88"
        svg.appendChild(backdrop)

        let text = document.createElementNS("http://www.w3.org/2000/svg", "text")
        text.setAttributeNS(null, "dominant-baseline", "middle")
        text.setAttributeNS(null, "text-anchor", "middle")
        text.setAttributeNS(null, "x", "40")
        text.setAttributeNS(null, "y", "9")
        this.clockText = text
        svg.appendChild(text)

        return svg
    }
    private setValue(text: string) {
        if(!this.clockText) return
        this.clockText.innerHTML = text
    }
}