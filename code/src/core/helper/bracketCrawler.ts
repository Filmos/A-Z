class BracketScope {
    subScopes: BracketScope[] = []
    data?: any
    metadata?: any = {}

    constructor(data?: any) {
        this.data = data
    }
    public addSubscope(subScope: BracketScope): void {
        this.subScopes.push(subScope)
    }

    public display() {
        let collector = new DebugCollector()
        this.populateDebugCollector(collector)
        collector.display()
    }
    public populateDebugCollector(collector: DebugCollector) {
        for(let i in this.subScopes) {
            let sub = this.subScopes[i]
            collector.add(i, sub.data)
            sub.populateDebugCollector(collector.getSub(i))
        }
    }
}
class BracketCrawler<T> {
    private readonly crawl: (element: T, scopeData: any, crawler: BracketCrawler<T>)=>void;
    constructor(crawl: (element: T, scopeData: any, crawler: BracketCrawler<T>)=>void) {
        this.crawl = crawl
    }

    private currentI: number;
    private lastElementFlag: number;
    private currentScopePath: BracketScope[];
    get currentScope(): BracketScope {
        return this.currentScopePath[this.currentScopePath.length-1]
    }

    public parse(elements: T[]) {
        this.currentScopePath = [new BracketScope()]
        this.currentI = 0
        let cache = {}

        while(this.currentI < elements.length) {
            let thisElement = elements[this.currentI]
            let hash = this.currentI
            if(cache[hash]) {this.currentI += 1; continue}

            this.lastElementFlag = 0
            this.crawl(thisElement, this.currentScope.data, this)

            if(this.lastElementFlag != 1)
                cache[hash] = true

            this.currentI += 1
        }
        console.log(cache)
        return this.currentScopePath[0]
    }

    public skipElement() {
        this.lastElementFlag = 1
        if(!this.currentScope.metadata.firstSkipped)
            this.currentScope.metadata.firstSkipped = this.currentI
    }
    public repeatElement() {
        this.lastElementFlag = 1
        this.currentI -= 1
    }
    public startBracket(scopeData: any) {
        let newScope: BracketScope = new BracketScope(scopeData)
        this.currentScope.addSubscope(newScope)
        this.currentScopePath.push(newScope)
    }
    public stopBracket() {
        if(this.currentScope.metadata.firstSkipped) {
            this.currentI = this.currentScope.metadata.firstSkipped - 1
            delete this.currentScope.metadata.firstSkipped
        }
        this.currentScopePath.pop()
    }
}