let EV = new TaskList()
EV.addTask("Clean up bathroom", 2,"07.04.2021", 45)
EV.addTask("Clean up room", 8,"07.01.2021", 120)
EV.addTask("Rework website", 30, "09.01.2021", 60*8*4)
EV.addTask("Finish the bermuda project", 40, "07.02.2021", 120)
EV.addTask("Rework prototype", 20, "07.14.2021", 60*6)
EV.addTask("Record next devlog", 20, "07.29.2021", 60*4)
EV.addTask("Prepare for stream", 10, "07.02.2021", 45)

EV.display()

type TypeMap = {type: string, subtype?: TypeMap[], tags?: string[]}
type DescriptiveMap = {[property: string]: TypeMap & {inner: DescriptiveMap}}
type rawClass = { new (...args: any[]): {}, _descriptiveMap?: DescriptiveMap}

class Intention {
  public readonly entries: string[]
  constructor(entries: string[]) {
    this.entries = entries
  }
  public topLevelDict(): {[topLevel: string]: string[]} {
    let returnDict: {[topLevel: string]: string[]} = {}
    for(let e of this.entries) {
      let ePath = e.split("/")
      if(!returnDict[ePath[0]]) returnDict[ePath[0]] = []
      returnDict[ePath[0]].push((ePath.length == 1)
          ?"."
          :ePath.slice(1).join("/")
      )
    }
    return returnDict
  }
}
class IntentionMap {
  constructor(source: rawClass, intention: Intention | string[]) {
    if(!(intention instanceof Intention)) intention = new Intention(intention)
    console.log(shapeToIntention(source._descriptiveMap, intention))
  }
}

function shapeToIntention(fullMap: DescriptiveMap, intention: Intention): DescriptiveMap {
  let prunedMap: DescriptiveMap = {}
  let topLevelDict = intention.topLevelDict()

  for(let prop in fullMap) {
    if(topLevelDict[prop] || fullMap[prop].tags?.includes("Identifier")) {
      prunedMap[prop] = fullMap[prop]
      let leftoverIntention = topLevelDict[prop]?.filter(a => a!=".") || []
      let submap = window[fullMap[prop].type]?._descriptiveMap
      if(submap) prunedMap[prop].inner = shapeToIntention(submap, new Intention(leftoverIntention))
    }
  }

  return prunedMap
}

let EVE = EV.tasks[0]

new IntentionMap(TaskList, ["topTask/currentPriority"])
new IntentionMap(TaskList, ["tasks/currentPriority"])