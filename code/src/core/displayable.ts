class DescriptiveField {
    readonly id: string;
    readonly type: string;
    importance: number;
    private value: any;

    constructor(id: string, type: string, importance?: number) {
        this.id = id
        this.type = type
        this.importance = importance
    }

    get() : any {
        return this.value
    }
    set(value: any) : void {
        this.value = value
    }
}


interface Displayable {
  getDisplayFields(): DescriptiveField[];
}

abstract class DynamicallyDescriptiveObject implements Displayable {
    private innerFields : {[key: string]: DescriptiveField} = {}

    protected registerField(name: string, type: string, importance?: number) : void {
        this.innerFields[name] = new DescriptiveField(name, type, importance);
    }

    get(key: string) : any {
        if(!this.innerFields[key]) return null
        return this.innerFields[key].get()
    }
    set(key: string, value: any) : void {
        if(!this.innerFields[key]) return
        this.innerFields[key].set(value)
    }

    getDisplayFields() : DescriptiveField[] {
        return Object.values(this.innerFields);
    }

}