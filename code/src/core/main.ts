class TimeBlock extends DynamicallyDescriptiveObject {

  constructor(name: string, timeslot: string) {
    super();
    this.registerField("name", new fields["title"](name))
    this.registerField("timeslot", new fields["time_period"](name))
    console.log(this.getDisplayFields())
    this.set("name", name+"%%")
    this.set("timeslot", "?"+timeslot)
    console.log(this.getDisplayFields())
  }
}

let block = new TimeBlock("Hello", "there")
let block2 = new TimeBlock("fellow", "human")
