let fields : {[key: string]: any} = {}

abstract class DescriptiveField {
    asString(): string {
        return null
    }

    abstract setValue(...value : any) : void
    abstract getValue() : any
}

fields["title"] = class title extends DescriptiveField {
    private value : string;

    constructor(value? : string) {
        super();
        this.setValue(value)
    }

    setValue(value : string) : void {
        this.value = value;
    }
    getValue(): string {
        return this.value
    }

    asString(): string {
        return this.value;
    }
}

fields["time_period"] = class time_period extends DescriptiveField {
    private value : string;

    constructor(value? : string) {
        super();
        this.setValue(value)
    }

    setValue(value : string) : void {
        this.value = value;
    }
    getValue(): string {
        return this.value
    }
}