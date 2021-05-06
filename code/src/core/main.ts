class TimeBlock extends DescriptiveObject {

  constructor(name: string, timeslot: string) {
    super();
    this.registerField("name", new fields["title"](name))
    this.registerField("timeslot", new fields["time_period"](timeslot))
  }
}

let block = new TimeBlock("Hello", "there")
let block2 = new TimeBlock("fellow", "human")

// formDescriptiveUI(block.getDisplayFields(["name"]))
// formDescriptiveUI(block2.getDisplayFields(["name","timeslot"]))

console.log(block)
console.log(block.getKeys()["name"])

let filter = new DescriptiveFilter("field")
filter.addKey("string")
console.log(filter)

console.log(block.getKeys()["name"].matchesFilter(filter))

// let map = new DescriptiveMap("field")
// map.addKey("string")
// map.addKey("time_period")
// console.log(map)
