let EV = new TaskList()
EV.addTask("Clean up bathroom", 2,"07.04.2021", 45)
EV.addTask("Clean up room", 8,"07.01.2021", 120)
EV.addTask("Rework website", 30, "09.01.2021", 60*8*4)
EV.addTask("Finish the bermuda project", 40, "07.02.2021", 120)
EV.addTask("Rework prototype", 20, "07.14.2021", 60*6)
EV.addTask("Record next devlog", 20, "07.29.2021", 60*4)
EV.addTask("Prepare for stream", 10, "07.02.2021", 45)

let EVE = EV.tasks[0]

let mapMulti = new IntentionMap(["tasks/*/currentPriority"], TaskList)
let chromMulti = new GraphicalChromosome(mapMulti)
let builtElement = chromMulti.build(EV)
document.querySelector("body").appendChild(builtElement.html)

let styleElement = document.createElement("style")
styleElement.innerText = builtElement.css
document.querySelector("body").appendChild(styleElement)
