class TimeBlock extends DynamicallyDescriptiveObject {

  constructor(name: string, timeslot: string) {
    super();
    this.registerField("name", new fields["title"](name))
    this.registerField("timeslot", new fields["time_period"](timeslot))
  }
}

let block = new TimeBlock("Hello", "there")
let block2 = new TimeBlock("fellow", "human")
console.log(block.getDisplayFields(["name"])["name"].getRepresentations())
console.log(block.getDisplayFields(["timeslot"])["timeslot"].getRepresentations())
console.log(block.getDisplayFields(["name", "timeslot"]))
