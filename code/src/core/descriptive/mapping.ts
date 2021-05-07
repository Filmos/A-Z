class DescriptiveMap<KEY_TYPE> extends Clusterable {
    protected keys : {[key: string] : KEY_TYPE} = {}

    addKey(key : KEY_TYPE, name? : string) : string {
        if(!name) name = Object.keys(this.keys).length.toString()
        this.keys[name] = key
        return name
    }
    getKeys() : {[key: string] : KEY_TYPE} {
        return this.keys
    }
}


abstract class DescriptiveField extends DescriptiveMap<() => any> {
    protected constructor(...value : any) {
        super("field")
        this.setValue(...value)
        this.addRepresentationsFromClass()
    }
    abstract setValue(...value : any) : void
    abstract getValue() : any



    private addRepresentationsFromClass() {
        let obj: any = this;
        do {
            Object.getOwnPropertyNames(obj).forEach((e, i, arr) => {
                if (e!=arr[i+1] && e.indexOf("$as") != -1 && typeof obj[e] == 'function') {
                    let id : string = e.slice(3, 4).toLowerCase() + e.slice(4)
                    this.addKey(obj[e], id)
                }
            });
        } while (obj = Object.getPrototypeOf(obj));
    }

    getRepresentations() : string[] {
        return Object.keys(this.keys)
    }
    as(representationName: string) : any {
        if(!this.keys[representationName]) return null
        return this.keys[representationName]()
    }
}



abstract class DescriptiveObject extends DescriptiveMap<DescriptiveField> {
    protected constructor() {
        super("object");
    }

    protected registerField(name: string, field: DescriptiveField) : void {
        this.addKey(field, name)
    }

    get(key: string) : any {
        if(!this.keys[key]) return null
        return this.keys[key].getValue()
    }
    set(key: string, value: any) : void {
        if(!this.keys[key]) return
        this.keys[key].setValue(value)
    }
}