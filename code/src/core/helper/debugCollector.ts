class DebugCollector {
    private data: {[index: string]: {value: any, inner?: DebugCollector}} = {}

    public add(path: string[] | string, value: any, style:string="raw") {
        if(!Array.isArray(path)) path = [path]

        if(!this.data[path[0]]) this.data[path[0]] = {value: ""}
        if(path.length == 1) this.data[path[0]].value = DebugCollector.styleMessage(path[0], value, style)
        else {
            if(!this.data[path[0]].inner) this.data[path[0]].inner = new DebugCollector()
            this.data[path[0]].inner.add(path.slice(1), value, style)
        }
    }
    public getSub(path: string[] | string): DebugCollector {
        if(!Array.isArray(path)) path = [path]

        if(!this.data[path[0]]) this.data[path[0]] = {value: ""}
        if(!this.data[path[0]].inner) this.data[path[0]].inner = new DebugCollector()

        if(path.length == 1) return this.data[path[0]].inner
        else return this.data[path[0]].inner.getSub(path.slice(1))
    }


    private static styleMessage(path: string, value: any, style:string): string[] {
        switch(style) {
            case "prefixPath":
                return ["%c"+path+":", "font-weight: 900; color: #24383f; font-size: 0.8rem", value]
            default:
                return [value]
        }
    }


    public display() {
        for(let key in this.data) {
            if(!this.data[key].inner || this.data[key].inner.isEmpty()) console.log(...this.data[key].value)
            else {
                console.groupCollapsed(...this.data[key].value)
                this.data[key].inner.display()
                console.groupEnd()
            }
        }
    }
    public isEmpty(): boolean {
        return Object.keys(this.data).length == 0
    }
}

class NullDebugCollector extends DebugCollector {
    public add() {}
    public getSub(): DebugCollector {return undefined}
    public display() {}
    public isEmpty(): boolean {return true}

}