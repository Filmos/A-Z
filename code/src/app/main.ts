let EV = new TaskList()
EV.addTask("Clean up bathroom", 2,"07.04.2021", 45)
EV.addTask("Clean up room", 8,"07.01.2021", 120)
EV.addTask("Rework website", 30, "09.01.2021", 60*8*4)
EV.addTask("Finish the bermuda project", 40, "07.02.2021", 120)
EV.addTask("Rework prototype", 20, "07.14.2021", 60*6)
EV.addTask("Record next devlog", 20, "07.29.2021", 60*4)
EV.addTask("Prepare for stream", 10, "07.02.2021", 45)



let mapMulti = new IntentionMap(["tasks/*/currentPriority"], TaskList)

let savedChrom: ChromosomeSave[] = []
let j = 0

function generateGUI() {
    let chromMulti = new GraphicalChromosome(mapMulti)
    chromMulti.randomize()
    let builtElement = chromMulti.build(EV)
    document.querySelector("body").appendChild(builtElement.html)

    let styleElement = document.createElement("style")
    styleElement.id = "dynamicStyle"
    styleElement.innerHTML = builtElement.css
    document.querySelector("body").appendChild(styleElement)

    savedChrom.push(chromMulti.getAsSaveable())
    for(let i=0;i<2;i++) {
        let chrom = new GraphicalChromosome(mapMulti)
        chrom.randomize()
        savedChrom.push(chrom.getAsSaveable())
    }
}

function transformGUI() {
    let chromMulti = new GraphicalChromosome(mapMulti)
    chromMulti.loadFromSave(savedChrom[j])
    j = (j+1)%savedChrom.length
    let builtElement = chromMulti.build(EV)

    console.log(chromMulti.getAsSaveable())

    document.querySelectorAll("body ._ *").forEach((el) => {if(el instanceof HTMLElement) el.style.transitionDuration = Math.floor(Math.random()*70+30)/100+"s"})

    // @ts-ignore
    document.querySelector("#dynamicStyle").innerHTML = "* {transition: all}\n"+builtElement.css
}

generateGUI()
setInterval(transformGUI, 5000)