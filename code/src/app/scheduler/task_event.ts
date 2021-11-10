class Task {
    @D("UID") public readonly uid: string;
    @D("Identifier") public readonly title: string;
    @D public readonly estimatedCompletionTime: number;

    @D public deadline: Date;

    constructor(title: string, estimatedCompletionTime: number, uid?: string) {
        this.uid = uid||(""+Date.now())
        TaskBoard.registerTask(this)
        this.title = title
        this.estimatedCompletionTime = estimatedCompletionTime
    }


    public static fromJson(json: any): Task {
        let task = new Task(json.title, parseInt(json.estimatedCompletionTime), json.uid)
        if(json.deadline) task.deadline = new Date(parseInt(json.deadline))
        return task
    }
    public toJson(): any {
        return {
            uid: this.uid,
            title: this.title,
            estimatedCompletionTime: this.estimatedCompletionTime,
            deadline: this.deadline?.getTime()
        }
    }

}

class TaskBoard {
    public static allTasks: { [uid: string]: Task } = {};

    public static registerTask(task: Task) {
        this.allTasks[task.uid] = task
    }

    public static save() {
        FileStorage.write("tasks", Object.values(this.allTasks).map(t => t.toJson()))
        TaskGUI.updateGUI()
    }

    public static load() {
        return new Promise<void>((resolve) => {
            this.allTasks = {}
            FileStorage.load("tasks").then((storedData: any[]) => {
                if (storedData && storedData.forEach)
                    storedData.forEach(t => Task.fromJson(t))
                resolve()
            })
        });
    }

    public static remove(uid: string) {
        if (!this.allTasks[uid]) return

        delete this.allTasks[uid]
        TaskGUI.updateGUI()
        this.save()
    }
}

class TaskGUI {
    private static GUI: SVGElement;
    public static buildGUI(): SVGElement {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttributeNS(null, "viewBox", "0 0 100 120")
        svg.classList.add("task-monument")

        this.GUI = svg
        this.generateGUIHtml(svg)
        return svg
    }
    public static updateGUI() {
        this.GUI.innerHTML = ""
        this.generateGUIHtml(this.GUI)
    }

    private static generateGUIHtml(svg: SVGElement): void {
        let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
        svg.appendChild(defs)
        let mask = document.createElementNS("http://www.w3.org/2000/svg", "mask")
        mask.id = "monument-mask"
        defs.appendChild(mask)
        let fill = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient")
        fill.id = "monument-gradient"
        fill.setAttributeNS(null, "cx", "0")
        fill.setAttributeNS(null, "cy", "0")
        fill.setAttributeNS(null, "r", "1.4")
        fill.innerHTML = `
            <stop offset="30%" stop-color="#51597b"></stop>
            <stop offset="60%" stop-color="#454c6e"></stop>
            <stop offset="90%" stop-color="#3a415f"></stop>`
        defs.appendChild(fill)

        let tasks = Object.values(TaskBoard.allTasks).sort((a, b)=> {
            if(!a.deadline && !b.deadline) return b.estimatedCompletionTime-a.estimatedCompletionTime
            if(!a.deadline) return 1
            if(!b.deadline) return -1
            if(a.deadline.getTime() != b.deadline.getTime()) return a.deadline.getTime()-b.deadline.getTime()
            return b.estimatedCompletionTime-a.estimatedCompletionTime
        })

        this.generateTaskBricks(mask, tasks)
        let gradient = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        gradient.setAttributeNS(null, "width", "100%")
        gradient.setAttributeNS(null, "height", "100%")
        gradient.setAttributeNS(null, "mask", "url(#monument-mask)")
        gradient.setAttributeNS(null, "fill", "url(#monument-gradient)")
        svg.appendChild(gradient)

        this.generateTaskBricks(svg, tasks, (group, task)=>{
            group.children[group.children.length-1].remove()
            group.addEventListener("click", () => {
                TaskBoard.remove(task.uid)
            })
        })
    }
    private static generateTaskBricks(parent: SVGElement, tasks: Task[], transformer?: (group: SVGElement, task: Task)=>void) {
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
            group.appendChild(this.generateTaskTitleElement(top-brickHeight/2, tasks[t].title))
            if(transformer) transformer(group, tasks[t])

            top -= brickHeight+1.3
            precalcMargin = nextMargin
            parent.appendChild(group)
        }
    }
    private static generateTaskTitleElement(pozY: number, text: string): SVGTextElement {
        let title = document.createElementNS("http://www.w3.org/2000/svg", "text")
        title.setAttributeNS(null, "x", "50")
        title.setAttributeNS(null, "y", pozY+"")
        title.setAttributeNS(null, "dominant-baseline", "middle")
        title.setAttributeNS(null, "text-anchor", "middle")
        title.innerHTML = text
        return title
    }
}