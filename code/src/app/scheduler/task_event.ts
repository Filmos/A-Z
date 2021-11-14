class Task {
    @D("UID") public readonly uid: string;
    @D("Identifier") public readonly title: string;
    @D public readonly estimatedCompletionTime: number;
    @D public deadline: Date;

    @D public timeSpent: number = 0;

    constructor(title: string, estimatedCompletionTime: number, uid?: string) {
        this.uid = uid||(""+Date.now())
        TaskBoard.registerTask(this)
        this.title = title
        this.estimatedCompletionTime = estimatedCompletionTime
    }


    public static fromJson(json: any): Task {
        let task = new Task(json.title, parseInt(json.estimatedCompletionTime), json.uid)
        if(json.deadline) task.deadline = new Date(parseInt(json.deadline))
        task.timeSpent = json.timeSpent || 0
        return task
    }
    public toJson(): any {
        return {
            uid: this.uid,
            title: this.title,
            estimatedCompletionTime: this.estimatedCompletionTime,
            deadline: this.deadline?.getTime(),
            timeSpent: this.timeSpent
        }
    }

}

class TaskBoard {
    public static allTasks: { [uid: string]: Task } = {};
    public static activeTask: string;

    public static registerTask(task: Task) {
        this.allTasks[task.uid] = task
    }

    public static remove(uid: string) {
        if (!this.allTasks[uid]) return

        delete this.allTasks[uid]
        if(this.activeTask == uid) this.unselectTask()
        this.save()
    }

    public static toggleSelectTask(uid: string) {
        if(this.activeTask == uid) this.unselectTask()
        else this.selectTask(uid)
    }
    public static selectTask(uid: string) {
        this.unselectTask()
        let task = this.allTasks[uid]
        if(!task) return
        this.activeTask = uid

        let date = new Date()
        date.setSeconds(date.getSeconds() - task.timeSpent)
        Clock.countdownFrom(date)

        TaskGUI.updateGUI()
    }
    public static unselectTask() {
        if(!this.activeTask) return
        let task = this.allTasks[this.activeTask]
        this.activeTask = ""

        if(task && Clock.getTime()>0) {
            task.timeSpent = Clock.getTime()
            this.save()
        }

        Clock.stopCountdown()
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
}

class TaskGUI {
    private static GUI: SVGElement;
    public static updateGUI() {
        if(!this.GUI) return

        let tasks = Object.values(TaskBoard.allTasks).sort((a, b)=> {
            if(!a.deadline && !b.deadline) return b.estimatedCompletionTime-a.estimatedCompletionTime
            if(!a.deadline) return 1
            if(!b.deadline) return -1
            if(a.deadline.getTime() != b.deadline.getTime()) return a.deadline.getTime()-b.deadline.getTime()
            return b.estimatedCompletionTime-a.estimatedCompletionTime
        })

        let mask = this.GUI.querySelector("#monument-mask") as SVGElement
        this.generateTaskBricks(mask, tasks)
        this.generateTaskBricks(this.GUI, tasks, (group, task)=>{
            group.addEventListener("click", () => {
                TaskBoard.toggleSelectTask(task.uid)
            })
            group.addEventListener("dblclick", () => {
                TaskBoard.remove(task.uid)
            })
        })

    }

    public static buildGUI(): SVGElement {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttributeNS(null, "viewBox", "0 0 100 120")
        svg.classList.add("task-monument")
        svg.innerHTML = SVGFilters.glowFilter()

        let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
        svg.appendChild(defs)
        let introAnim = document.createElementNS("http://www.w3.org/2000/svg", "mask")
        introAnim.id = "monument-intro-anim"
        defs.appendChild(introAnim)
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

        let gradient = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        gradient.setAttributeNS(null, "width", "100%")
        gradient.setAttributeNS(null, "height", "100%")
        gradient.setAttributeNS(null, "mask", "url(#monument-mask)")
        gradient.setAttributeNS(null, "fill", "url(#monument-gradient)")
        svg.appendChild(gradient)

        this.GUI = svg
        this.updateGUI()
        return svg
    }
    private static generateTaskBricks(parent: SVGElement, tasks: Task[], transformer?: (group: SVGElement, task: Task)=>void) {
        if(tasks.length == 0) return

        let flags = {}
        tasks.forEach(t => {flags[t.uid] = true})
        parent.querySelectorAll(":scope > g").forEach((brick)=>{
            let uid = brick.getAttributeNS(null,"uid")
            if(!flags[uid.slice(1)]) brick.remove()
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
            let brickHeight = 4.5+tasks[t].estimatedCompletionTime/20
            let nextMargin = (t+1>=tasks.length?50:calcMargin(tasks[t+1]))
            let topMargin = (nextMargin>=50?50:Math.min(precalcMargin+brickHeight*(nextMargin-precalcMargin)/(brickHeight+1.3), precalcMargin+brickHeight*0.7))
            let brickPoints = `${precalcMargin},${top} ${topMargin},${top-brickHeight} ${100-topMargin},${top-brickHeight} ${100-precalcMargin},${top}`
            let textPos = (top - brickHeight / 2)

            let group = parent.querySelector(":scope > g[uid=t"+tasks[t].uid+"]") as SVGElement
            let brick : SVGElement
            if(!group) {
                group = document.createElementNS("http://www.w3.org/2000/svg", "g")
                brick = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
                brick.setAttributeNS(null, "points", brickPoints)
                group.setAttributeNS(null, "uid", "t"+tasks[t].uid)
                group.appendChild(brick)
                group.appendChild(this.generateTaskTitleElement(top - brickHeight / 2, tasks[t].title))
                parent.appendChild(group)
                if(transformer) transformer(group, tasks[t])

                group.setAttributeNS(null, "mask", "url(#monument-intro-anim)")
                let intro_mask = document.createElementNS("http://www.w3.org/2000/svg", "rect")
                intro_mask.setAttributeNS(null, "width", 100-2*precalcMargin+"")
                intro_mask.setAttributeNS(null, "height", brickHeight+"")
                intro_mask.setAttributeNS(null, "y", top-brickHeight+"")
                intro_mask.setAttributeNS(null, "x", precalcMargin+"")
                intro_mask.style.transformOrigin = `50px ${textPos}px`

                setTimeout(()=>{
                    group.removeAttributeNS(null, "mask")
                    intro_mask.remove()
                }, 600)

                parent.querySelector("#monument-intro-anim")?.appendChild(intro_mask)
            } else {
                brick = group.querySelector("polygon")
                if(!brick) continue
                brick.innerHTML = '<animate attributeName="points" dur="0.7s" fill="freeze" values="'+brick.getAttributeNS(null, "points")+';'+brickPoints+'" restart="always" calcMode="spline" keySplines="0.37,0,0.17,1">'
                // @ts-ignore
                brick.querySelector("animate")?.beginElement()

                let text = group.querySelector("text")
                if(text) {
                    text.style.transform = "rotate(0.03deg) translateY("+(textPos-parseFloat(text.getAttributeNS(null, "y")))+"px)"
                    text.style.transition = "transform 0.7s cubic-bezier(.37,0,.17,1)"
                }

                setTimeout(()=>{
                    brick.setAttributeNS(null, "points", brickPoints)
                    brick.innerHTML = ""
                    if(text) {
                        text.setAttributeNS(null, "y", textPos + "")
                        text.style.transition = ""
                        text.style.transform = "rotate(0.03deg)"
                    }
                }, 700)
            }

            if(TaskBoard.activeTask!=tasks[t].uid) group.classList.remove("selected-task")
            else group.classList.add("selected-task")
            group.style.transform = "translateY(calc(-"+(t*(2.8/tasks.length-0.1)+0.3)+`px * var(--breath) - 0.3px))`

            top -= brickHeight+1.3
            precalcMargin = nextMargin
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