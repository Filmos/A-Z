class LiveLine {
    private currentInput: LiveLine.Input = null

    public static runCommand(command: LiveLine.Input): boolean {
        // command.display()
        return false
    }

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
            LiveLine.runCommand(this.currentInput)
            this.currentInput = null
        })

        return wrapper
    }

}


namespace LiveLine {
    export class Input {
        private readonly commands: { [c: string]: {[p: string]: string} }

        constructor(commands: { [c: string]: { [p: string]: string } }) {
            this.commands = commands;
        }
        public static parse(input: string): LiveLine.Input {
            let commands = {}
            commands[input[0]] = input.substr(1)
                .split(";")
                .map(p => p.trim())
                .reduce((map, obj, ind) => {map[ind] = obj; return map}, {})
            return new LiveLine.Input(commands)
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
        private static generateCommandPreview(commandName: string, parameters: { [p: string]: string }): HTMLElement {
            let outer = document.createElement("li")
            let inner = document.createElement("ul")
            outer.innerText = commandName
            outer.append(inner)

            for(let p in parameters) inner.append(this.generateParameterPreview(p, parameters[p]))
            return outer
        }
        private static generateParameterPreview(parameterName: string, parameterValue: string): HTMLElement {
            let el = document.createElement("li")
            el.innerText = parameterName + " - " + parameterValue
            return el
        }
    }
}