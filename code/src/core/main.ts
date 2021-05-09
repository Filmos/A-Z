class TimeBlock extends DescriptiveObject {

  constructor(name: string, timeslot: string) {
    super();
    this.registerField("name", new fields["title"](name), name)
    this.registerField("timeslot", new fields["time_period"](timeslot), timeslot)
  }
}

let block = new TimeBlock("Hello", "there")
let block2 = new TimeBlock("fellow", "human")

document.body.appendChild(DescriptiveUI.singleForm(block))
