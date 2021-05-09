class DescriptiveFormer {
    private readonly score : number;
    private readonly formingFunction : ((map: DescriptiveMap<any>) => HTMLElement);

    constructor(score : number, formingFunction : ((map: DescriptiveMap<any>) => HTMLElement)) {
        this.score = score
        this.formingFunction = formingFunction
    }

    form(map: DescriptiveMap<any>) : HTMLElement {
        return this.formingFunction(map)
    }
    getScore() : number {
        return this.score
    }

}

class DescriptiveFormMaker {
    private readonly formMakingFunction : ((map: DescriptiveMap<any>) => DescriptiveFormer)
    private readonly pattern : DescriptiveFilter

    constructor(pattern : DescriptiveFilter, formMakingFunction : ((map: DescriptiveMap<any>) => DescriptiveFormer)) {
        this.pattern = pattern
        this.formMakingFunction = formMakingFunction
    }

    makeForm(map: DescriptiveMap<any>) : DescriptiveFormer {
        return this.formMakingFunction(map)
    }
    matches(map: DescriptiveMap<any>) : boolean {
        return this.pattern.matches(map)
    }
}

abstract class DescriptiveUI {
    private static formMakers : DescriptiveFormMaker[] = []

    static getFormer(map : DescriptiveMap<any>) : DescriptiveFormer {
        let maxFormer : DescriptiveFormer

        for(let formMaker of this.formMakers) {
            if(!formMaker.matches(map)) continue
            let former = formMaker.makeForm(map)
            if(!maxFormer || maxFormer.getScore()<former.getScore())
                maxFormer = former
        }
        return maxFormer
    }
    static singleForm(map : DescriptiveMap<any>) : HTMLElement {
        let former : DescriptiveFormer = this.getFormer(map)
        if(!former) return
        return former.form(map)
    }

    static registerFormer(formMaker: DescriptiveFormMaker) : void {
        this.formMakers.push(formMaker)
    }
}

DescriptiveUI.registerFormer(new DescriptiveFormMaker(
    FilterFactory.field("string"),
    function(map) {
        return new DescriptiveFormer(0, (map) => {
            let div : HTMLElement = document.createElement('div')
            div.innerText = (<DescriptiveField>map).as("string")
            return div
        })
    }
))
DescriptiveUI.registerFormer(new DescriptiveFormMaker(
    FilterFactory.object("string+"),
    function(map) {
        return new DescriptiveFormer(0, (map) => {
            let div : HTMLElement = document.createElement('div')
            div.classList.add("card")
            div.classList.add("mx-3")
            div.classList.add("my-1")

            let innerDiv : HTMLElement = document.createElement('div')
            innerDiv.classList.add("card-body")
            div.appendChild(innerDiv)

            let fields = map.getKeys()
            for(let f in fields) {
                let element : HTMLElement = DescriptiveUI.singleForm(fields[f])
                if(element) innerDiv.appendChild(element)
            }

            return div
        })
    }
))

