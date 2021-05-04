let fields : {[key: string]: any} = {}

abstract class DescriptiveField {
    private representations : {[key: string]: () => any} = {}

    protected constructor(...value : any) {
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
                    this.addRepresentation(id, obj[e])
                }
            });
        } while (obj = Object.getPrototypeOf(obj));
    }
    private addRepresentation(name: string, func: () => any) {
        this.representations[name] = func
    }

    getRepresentations() : string[] {
        return Object.keys(this.representations)
    }
    as(representationName: string) : any {
        if(!this.representations[representationName]) return null
        return this.representations[representationName]()
    }
}

fields["title"] = class title extends DescriptiveField {
    private value : string;

    setValue(value : string) : void {
        this.value = value;
    }
    getValue(): string {
        return this.value
    }

    $asString(): string {
        return this.value;
    }
}

fields["time_period"] = class time_period extends DescriptiveField {
    private value : string;

    setValue(value : string) : void {
        this.value = value;
    }
    getValue(): string {
        return this.value
    }
}