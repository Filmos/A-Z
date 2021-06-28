class TaskEvent {
    @desc public readonly title: string;
    @desc public readonly importance: number;
    @desc public deadline: Date;
    @desc public estimatedCompletionTime: number;

    constructor(title: string, importance: number) {
        this.title = title
        this.importance = importance
    }
    setTimes(deadline: Date, estimatedCompletionTime: number): void {
        this.deadline = deadline
        this.estimatedCompletionTime = estimatedCompletionTime
    }

    @desc public currentPriority(dateNow: number = Date.now()): number {
        let urgencyStart = this.deadline.valueOf()-this.estimatedCompletionTime*2.5*1000*60-3*1000*60*60*24
        let urgencyFactor = 1+(urgencyStart-dateNow)/(urgencyStart-this.deadline.valueOf()-this.estimatedCompletionTime*1000*60)
        urgencyFactor = Math.min(2, Math.max(1, urgencyFactor))
        return Math.log2(this.importance)**urgencyFactor/this.estimatedCompletionTime
    }
}

class TaskList {
    @desc private tasks: TaskEvent[] = [];

    addTask(title: string, importance: number, deadline: string, estimatedCompletionTime: number): void {
        let event = new TaskEvent(title, importance)
        event.setTimes(new Date(deadline), estimatedCompletionTime)
        this.tasks.push(event)
    }

    getSorted(): TaskEvent[] {
        return this.tasks.sort((a, b) => b.currentPriority()-a.currentPriority())
    }
    display(): void {
        let sortedTasks = this.getSorted()
        let list = document.createElement('ul')
        for(let task of sortedTasks) {
            let listItem = document.createElement('li');
            listItem.innerHTML = task.title+" ["+Math.round(task.currentPriority()*1000)/10+"]";
            list.appendChild(listItem);
        }
        document.querySelector("body").appendChild(list)
    }
}

let EV = new TaskList()
EV.addTask("Install mosquito net", 4,"07.15.2021", 60)
EV.addTask("Clean up room", 8,"07.01.2021", 150)
EV.addTask("Unclog shower", 12, "07.01.2021", 45)
EV.addTask("Contact bermuda", 40, "06.30.2021", 30)
EV.addTask("Rework website", 25, "09.01.2021", 60*8*4)

EV.display()