class LiveLine {
    private currentInput: LiveLine.Input = null

    public buildGUI(): Element {
        let wrapper = document.createElement("div")
        wrapper.classList.add("liveline")
        let inputWrapper = document.createElement("div")
        wrapper.append(inputWrapper)
        let input = document.createElement("input")
        input.setAttribute("type", "text")
        inputWrapper.append(input)

        wrapper.addEventListener("DOMNodeInsertedIntoDocument", (e) => {
            (e.target as HTMLElement).setAttribute("animSync", ""+(Date.now()%4000))
        })

        input.addEventListener("input", (e) => {
            this.currentInput = LiveLine.Input.parse((e.target as HTMLInputElement).value)
            this.currentInput.display((e.target as HTMLInputElement).parentElement.parentElement)
        })
        input.addEventListener("keypress", (e) => {
            if(this.currentInput == null || e.key != "Enter") return
            this.currentInput.execute()
            this.currentInput = null;

            let inp = (e.target as HTMLInputElement)
            inp.value = ""
            inp.dispatchEvent(new Event('input'))
        })

        return wrapper
    }

}


namespace LiveLine {
    export class Input {
        private readonly commands: { [c: string]: {[p: string]: { value: any, display: string }} }

        constructor(commands: { [c: string]: { [p: string]: { value: any, display: string } } }) {
            this.commands = commands;
        }
        public static parse(input: string): LiveLine.Input {
            if(!input) return new LiveLine.Input({})

            let commands = {}
            if(input[0] != "+") {
                commands["New note"] = {"": {value: input, display: input}, "Warning": {display: "This doesn't do anything yet"}}
                return new LiveLine.Input(commands)
            }

            let reg = input.substr(1).match(/^(.+?)[ ,.;]*(?:(\d*)(?::(\d\d)|h)?)?[ ,.;]*(?:(next )?(Mon|Tue|Wed|Thu|Fri|Sat|Sun).{0,5})?[ ,.;]*$/i)
            if(!reg) return new LiveLine.Input({})

            commands["New task"] = {
                "Title": {value: reg[1].trim(), display: reg[1].trim()},
                "Duration": {value: 120, display: "2:00 (default)"}
            }
            if(reg[2]) {
                let dur = parseInt(reg[2])*60+(parseInt(reg[3])||0)
                commands["New task"]["Duration"] = {
                    value: dur,
                    display: Math.floor(dur/60)+":"+("0"+dur%60).slice(-2)
                }
            }

            if(reg[5]) {
                let days = {
                    "sun": 0,
                    "mon": 1,
                    "tue": 2,
                    "wed": 3,
                    "thu": 4,
                    "fri": 5,
                    "sat": 6
                }
                let time = (days[reg[5].toLowerCase()]-(new Date()).getDay()+7)%7
                if(time == 0) time+=7
                if(reg[4]) time += 7

                let date = new Date()
                date.setDate(date.getDate()+time)
                date.setHours(12, 0, 0, 0)

                commands["New task"]["Deadline"] = {
                    value: date,
                    display: (time==1?"Tomorrow":("In "+time+" days")) + " ("+date.getDate()+"."+(date.getMonth()+1)+")"
                }
            }

            return new LiveLine.Input(commands)
        }
        public execute(): void {
            for(let c in this.commands) {
                let par = this.commands[c]
                switch (c) {
                    case "New task":
                        let task = new Task(par.Title.value, par.Duration.value)
                        if(par.Deadline) task.deadline = par.Deadline.value
                        break
                }
            }
        }

        public display(liveline: HTMLElement): void {
            liveline.querySelectorAll('.liveline-preview').forEach(function(el) {el.remove()});

            let preview = document.createElement("ul")
            preview.classList.add("liveline-preview")
            preview.addEventListener("DOMNodeInsertedIntoDocument", (e) => {
                let prev = (e.target as HTMLElement)
                prev.style.animationDelay = (parseInt(prev.parentElement.getAttribute("animSync"))-(Date.now()%4000)-4000) + "ms"
            })
            for(let c in this.commands) preview.append(LiveLine.Input.generateCommandPreview(c, this.commands[c]))

            liveline.append(preview)
        }
        private static generateCommandPreview(commandName: string, parameters: { [p: string]: { value: any, display: string } }): HTMLElement {
            let outer = document.createElement("li")
            let inner = document.createElement("ul")
            outer.innerText = commandName
            outer.append(inner)

            for(let p in parameters) inner.append(this.generateParameterPreview(p, parameters[p].display))
            return outer
        }
        private static generateParameterPreview(parameterName: string, parameterValue: string): HTMLElement {
            let el = document.createElement("li")
            if(parameterName) el.innerText = (parameterName + ": ")

            let val = document.createElement("span")
            val.innerText = parameterValue||"---"

            el.append(val)
            return el
        }
    }
}