class TimeBlock {
  @desc private title: string;
  @desc private timeslot: string;

  constructor(name: string, timeslot: string) {
    this.title = name
    this.timeslot = timeslot
  }

  @desc private realTitle(): string {
    return "#"+this.title
  }
}

let block = new TimeBlock("Hello", "there")
let block2 = new TimeBlock("fellow", "human")

// document.body.appendChild(DescriptiveUI.singleForm(block))

console.log(TimeBlock.prototype)
console.log(block)

type rawClass = { new (...args: any[]): {} }
type RawIntention = {path: string, type: ("Display" | "Compare")}
class Intention {
  constructor(source: rawClass, intentions: RawIntention[]) {

  }
}

new Intention(TimeBlock, [{path: "realTitle", type: "Display"}])