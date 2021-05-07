class TimeBlock extends DescriptiveObject {

  constructor(name: string, timeslot: string) {
    super();
    this.registerField("name", new fields["title"](name))
    this.registerField("timeslot", new fields["time_period"](timeslot))
  }
}

let block = new TimeBlock("Hello", "there")
let block2 = new TimeBlock("fellow", "human")

console.log(block)
console.log(block.getKeys()["name"])
console.log(block.getKeys()["timeslot"])

let filter1 = FilterFactory.field("string")
let filter2 = FilterFactory.field("linearSpace")
let filter3 = FilterFactory.field("lies")
let filter = new DescriptiveFilter("object")
filter.addPattern(filter1, 1, 1)
filter.addPattern(filter2, 0, 1)

console.log(filter1.matches(block.getKeys()["name"]))
console.log(filter2.matches(block.getKeys()["name"]))
console.log(filter1.matches(block.getKeys()["timeslot"]))
console.log(filter2.matches(block.getKeys()["timeslot"]))
console.log(filter.matches(block))
