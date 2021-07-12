let EV = new TaskList()
EV.addTask("Clean up bathroom", 2,"07.04.2021", 45)
EV.addTask("Clean up room", 8,"07.01.2021", 120)
EV.addTask("Rework website", 30, "09.01.2021", 60*8*4)
EV.addTask("Finish the bermuda project", 40, "07.02.2021", 120)
EV.addTask("Rework prototype", 20, "07.14.2021", 60*6)
EV.addTask("Record next devlog", 20, "07.29.2021", 60*4)
EV.addTask("Prepare for stream", 10, "07.02.2021", 45)

EV.display()

let EVE = EV.tasks[0]

let mapSingle = new IntentionMap(["currentPriority"], TaskEvent)
let mapMulti = new IntentionMap(["tasks/*/currentPriority"], TaskList)

let chromSingle = new GraphicalChromosome(mapSingle)
let chromMulti = new GraphicalChromosome(mapMulti)
document.querySelector("body").appendChild(chromSingle.build(EVE))
document.querySelector("body").appendChild(chromMulti.build(EV))