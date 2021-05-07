let fields : {[key: string]: any} = {}

fields["title"] = class title extends DescriptiveField {
    private value : string;

    setValue(value : string) : void {
        this.value = value;
    }
    getValue(): string {
        return this.value
    }

    $asString(): string {
        console.log(this)
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

    $asString(): string {
        console.log(this)
        return "$"+this.value;
    }
    $asLinearSpace(): string {
        console.log(this)
        return "$"+this.value;
    }
}