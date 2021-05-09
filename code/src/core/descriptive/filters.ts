class DescriptiveFilter extends Clusterable {
    private pattern : {value : (DescriptiveFilter|string), min : number, max : number}[] = []
    private isSorted : boolean = true
    private minSum : number = 0
    private maxSum : number = 0

    addPattern(value : DescriptiveFilter|string, min : number, max : number) {
        if(max < min) throw "Invalid descriptive pattern - max value is smaller than min value"
        if(typeof(value) == "string" && min > 1) throw "Invalid descriptive pattern - string queries can't have min value higher than one"

        this.pattern.push({value: value, min: min, max: max})
        this.isSorted = false

        this.minSum += min
        this.maxSum += max
    }
    
    matches(map : DescriptiveMap<any>) : boolean {
        if(this.getCluster() != map.getCluster()) return false
        this.sortPattern()

        let keys : {[key: string] : any} = Object.assign({}, map.getKeys())
        if(this.minSum > Object.keys(keys).length || this.maxSum < Object.keys(keys).length) return false

        let leftPattern : {[key: number] : {value: DescriptiveFilter, count: number}} = {}
        let starFields = 0
        for(let pat of this.pattern) {
            if(pat.value == "*") {
                starFields += pat.max
                continue
            }

            if(typeof(pat.value) == "string") {
                if(!keys[pat.value] && pat.min > 0) return false
                if(keys[pat.value]) delete keys[pat.value]
                continue
            }

            let count = 0
            for(let k in keys) {
                if(count >= pat.min) break
                if(!pat.value.matches(keys[k])) continue

                count += 1
                delete keys[k]
            }
            if(count < pat.min) return false

            if(count >= pat.max) continue
            leftPattern[Object.keys(leftPattern).length] = {value: pat.value, count: pat.max-count}
        }

        if(Object.keys(keys).length <= starFields) return true
        for(let k in keys) {
            for(let p in leftPattern) {
                if(!leftPattern[p].value.matches(keys[k])) continue

                delete keys[k]
                leftPattern[p].count -= 1
                if(leftPattern[p].count <= 0) delete leftPattern[p]
                break
            }
        }

        return Object.keys(keys).length <= starFields
    }
    private sortPattern() : void {
        if(this.isSorted) return
        this.pattern = this.pattern.sort((a, b) => {
            if(a.min==b.min) return b.max-a.max
            if(a.min==0 && b.min!=0) return 1
            if(a.min!=0 && b.min==0) return -1
            return a.min-b.min
        })

        this.isSorted = true
    }
}

class FilterFactory {
    static field(type: string) : DescriptiveFilter {
        let filter = new DescriptiveFilter("field")
        filter.addPattern(type, 1, 1)
        filter.addPattern("*", 0, Infinity)
        return filter
    }
    static object(type: string) : DescriptiveFilter {
        let filter = new DescriptiveFilter("object")

        let fieldQueries : string[] = type.split(",")
        for(let query of fieldQueries) {
            let min : number = 1
            let max : number = 1

            switch (query.slice(-1)) {
                case "?":
                    min = 0
                    max = 1
                    query = query.slice(0,-1)
                    break
                case "*":
                    min = 0
                    max = Infinity
                    query = query.slice(0,-1)
                    break
                case "+":
                    min = 1
                    max = Infinity
                    query = query.slice(0,-1)
                    break
            }

            filter.addPattern(this.field(query), min, max)
        }

        return filter
    }
}