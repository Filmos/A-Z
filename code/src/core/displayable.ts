

interface Displayable {
  getDisplayFields(): {[key: string]: DescriptiveField};
}

abstract class DynamicallyDescriptiveObject implements Displayable {
    private innerFields : {[key: string]: DescriptiveField} = {}

    protected registerField(name: string, field: DescriptiveField) : void {
        this.innerFields[name] = field;
    }

    get(key: string) : any {
        if(!this.innerFields[key]) return null
        return this.innerFields[key].getValue()
    }
    set(key: string, value: any) : void {
        if(!this.innerFields[key]) return
        this.innerFields[key].setValue(value)
    }

    getDisplayFields() : {[key: string]: DescriptiveField} {
        return this.innerFields;
    }

}