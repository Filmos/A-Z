function formDescriptiveUI(fields : {[key: string]: DescriptiveField}) {
    for(let f in fields) {
        let field : DescriptiveField = fields[f]
        console.log(field.as("string"))
    }
}