class Task {
    @D("Identifier") public readonly title: string;
    @D public readonly estimatedCompletionTime: number;

    @D public deadline: Date;

    constructor(title: string, estimatedCompletionTime: number) {
        TaskBoard.registerTask(this)
        this.title = title
        this.estimatedCompletionTime = estimatedCompletionTime
    }


    public static fromJson(json: any): Task {
        let task = new Task(json.title, parseInt(json.estimatedCompletionTime))
        if(json.deadline) task.deadline = new Date(parseInt(json.deadline))
        return task
    }
    public toJson(): any {
        return {
            title: this.title,
            estimatedCompletionTime: this.estimatedCompletionTime,
            deadline: this.deadline?.getTime()
        }
    }

}
// LiveLine.addCommand("+", ["string", "duration"], (title: string, duration: number) => {
//     console.log(title, duration)
// })

class TaskBoard {
    private static allTasks: Task[] = [];
    private static initLoad = false;
    public static registerTask(task: Task) {
        this.allTasks.push(task)
        if(!this.initLoad)
            this.updateGUI()
    }
    public static updateGUI() {
        console.log(this.allTasks)
    }
    public static save() {
        FileStorage.write("tasks", this.allTasks.map(t => t.toJson()))
    }
    public static load() {
        return new Promise<void>((resolve) => {
            this.allTasks = []
            FileStorage.load("tasks").then((storedData: any[]) => {
                this.initLoad = true
                if(storedData && storedData.forEach)
                    storedData.forEach(t => Task.fromJson(t))
                this.initLoad = false
                resolve()
            })
        });
    }

    public buildGUI(): Node {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttributeNS(null, "viewBox", "0 0 100 120")
        svg.classList.add("task-monument")

        let tasks = TaskBoard.allTasks.sort((a, b)=> {
            if(!a.deadline && !b.deadline) return b.estimatedCompletionTime-a.estimatedCompletionTime
            if(!a.deadline) return 1
            if(!b.deadline) return -1
            if(a.deadline.getTime() != b.deadline.getTime()) return a.deadline.getTime()-b.deadline.getTime()
            return b.estimatedCompletionTime-a.estimatedCompletionTime
        })

        let top = 120
        let calcMargin = (task: Task) => {
            let base = 500
            if(task.deadline) base = (task.deadline.getTime()-Date.now())/3600000-task.estimatedCompletionTime/60
            if(base > 454) return 45
            if(base <= 4) return 0
            return Math.round((-0.8+0.2*base-0.00022*base**2)*100)/100
        }
        let precalcMargin = calcMargin(tasks[0])
        for(let t = 0; t<tasks.length; t++) {
            let group = document.createElementNS("http://www.w3.org/2000/svg", "g")
            let brick = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
            group.appendChild(brick)

            let brickHeight = 4.5+tasks[t].estimatedCompletionTime/20
            let nextMargin = (t+1>=tasks.length?50:calcMargin(tasks[t+1]))
            let topMargin = (nextMargin>=50?50:Math.min(precalcMargin+brickHeight*(nextMargin-precalcMargin)/(brickHeight+1.3), precalcMargin+brickHeight*0.7))

            brick.setAttributeNS(null, "points", `${precalcMargin},${top} ${topMargin},${top-brickHeight} ${100-topMargin},${top-brickHeight} ${100-precalcMargin},${top}`)
            group.appendChild(TaskBoard.generateTaskTitleElement(top-brickHeight/2, tasks[t].title))

            top -= brickHeight+1.3
            precalcMargin = nextMargin
            svg.appendChild(group)
        }
        return (svg as Node)
    }

    private static generateTaskTitleElement(pozY: number, text: string): SVGTextElement {
        let title = document.createElementNS("http://www.w3.org/2000/svg", "text")
        title.setAttributeNS(null, "x", "50")
        title.setAttributeNS(null, "y", pozY+"")
        title.setAttributeNS(null, "dominant-baseline", "middle")
        title.setAttributeNS(null, "text-anchor", "middle")
        title.style.fontSize = "4px"
        title.style.fill = "orange"
        title.innerHTML = text
        return title
    }
}