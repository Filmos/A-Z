interface Displayable {
  getDisplayFields(query : string[]): {[key: string]: DescriptiveField};
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

    getDisplayFields(query : string[]) : {[key: string]: DescriptiveField} {
        let result : {[key: string]: DescriptiveField} = {}
        for(let key of query)
            result[key] = this.innerFields[key]

        return result;
    }

}