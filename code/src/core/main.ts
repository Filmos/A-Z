let EV = new TaskList()
EV.addTask("Clean up bathroom", 2,"07.04.2021", 45)
EV.addTask("Clean up room", 8,"07.01.2021", 120)
EV.addTask("Rework website", 30, "09.01.2021", 60*8*4)
EV.addTask("Finish the bermuda project", 40, "07.02.2021", 120)
EV.addTask("Rework prototype", 20, "07.14.2021", 60*6)
EV.addTask("Record next devlog", 20, "07.29.2021", 60*4)
EV.addTask("Prepare for stream", 10, "07.02.2021", 45)

EV.display()

type rawClass = { new (...args: any[]): {}, _descriptiveMap?: any }
class Intention {
  constructor(source: rawClass, intentions: string[]) {
    console.log(source._descriptiveMap)
  }
}

new Intention(TaskEvent, ["tasks/currentPriority"])