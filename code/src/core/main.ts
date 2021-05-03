class TimeBlock extends DynamicallyDescriptiveObject {

  constructor(name: string, timeslot: string) {
    super();
    this.registerField("name", "string", 1)
    this.registerField("timeslot", "time_period", 0.8)
    this.set("name", name)
    this.set("timeslot", timeslot)
  }
}

let block = new TimeBlock("Hello", "there")
let block2 = new TimeBlock("fellow", "human")

console.log(block.getDisplayFields())
console.log(block2.getDisplayFields())