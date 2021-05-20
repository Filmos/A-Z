class TimeBlock extends DescriptiveObject {

  @_() private _firstName: string;
  @_() private _int: number;
  @_() private _circle: TimeBlock;
  @_() private _class: DescriptiveField;

  constructor(name: string, timeslot: string) {
    super();
    this.registerField("name", new fields["title"](name), name)
    this.registerField("timeslot", new fields["time_period"](timeslot), timeslot)
  }
}

function _() {
  return function (target: any, propertyKey: string) {
    // @ts-ignore
    let R = Reflect.getMetadata("design:type", target, propertyKey)
    target[propertyKey] = 13
    console.log(propertyKey, R.prototype)
  };
}

let block = new TimeBlock("Hello", "there")
let block2 = new TimeBlock("fellow", "human")

document.body.appendChild(DescriptiveUI.singleForm(block))

console.log(TimeBlock.prototype)
console.log(block)