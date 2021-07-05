class TaskEvent {
    @D public readonly title: string; // Identifier
    @D public readonly importance: number;
    @D public deadline: Date;
    @D public estimatedCompletionTime: number;

    constructor(title: string, importance: number) {
        this.title = title
        this.importance = importance
    }
    setTimes(deadline: Date, estimatedCompletionTime: number): void {
        this.deadline = deadline
        this.estimatedCompletionTime = estimatedCompletionTime
    }

    @D public currentPriority(dateNow: number = Date.now()): number {
        let urgencyStart = this.deadline.valueOf()-this.estimatedCompletionTime*2.5*1000*60-3*1000*60*60*24
        let urgencyFactor = 1+(urgencyStart-dateNow)/(urgencyStart-this.deadline.valueOf()-this.estimatedCompletionTime*1000*60)
        urgencyFactor = Math.min(2, Math.max(1, urgencyFactor))
        return Math.log2(this.importance)**urgencyFactor/this.estimatedCompletionTime**(2/3)
    }
}

class TaskList {
    private _tasks: TaskEvent[] = [];
    @D("TopGradient") get tasks(): TaskEvent[] {
        return this._tasks.sort((a, b) => b.currentPriority()-a.currentPriority())
    }

    addTask(title: string, importance: number, deadline: string, estimatedCompletionTime: number): void {
        let event = new TaskEvent(title, importance)
        event.setTimes(new Date(deadline), estimatedCompletionTime)
        this.tasks.push(event)
    }

    display(): void {
        let list = document.createElement('ul')
        for(let task of this.tasks) {
            let listItem = document.createElement('li');
            listItem.innerHTML = task.title+" ["+Math.round(task.currentPriority()*1000)/10+"]";
            list.appendChild(listItem);
        }
        document.querySelector("body").appendChild(list)
    }
}