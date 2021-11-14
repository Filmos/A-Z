class WallpaperFrame {
    static generateFrame(inner: HTMLElement): HTMLElement {
        let outer = document.createElement("div")
        outer.append(inner)

        FileStorage.load("preferredSize").then(size => {inner.style.maxWidth = size+"px"})
        let shrinker = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        shrinker.classList.add("top-shrinker")
        for(let i=0;i<100;i++) {
            let marker = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
            marker.setAttributeNS(null, "points",`${i*30-7},0 ${i*30},12 ${i*30+7},0`)
            marker.addEventListener("click", ()=>{
                inner.style.maxWidth = (30*i)+"px"
                FileStorage.write("preferredSize", i*30)
            })
            shrinker.append(marker)
        }

        inner.id = "wallpaper-frame"
        outer.append(shrinker)
        return outer
    }
}