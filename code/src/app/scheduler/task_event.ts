class TaskEvent {
    @D("Identifier") public readonly title: string;
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
        return Math.log2(this.importance)**urgencyFactor/this.estimatedCompletionTime**(2/3)*100
    }
}

class TaskList {
    private _tasks: TaskEvent[] = [];
    @D("TopGradient") public get tasks(): TaskEvent[] {
        return this._tasks.sort((a, b) => b.currentPriority()-a.currentPriority())
    }
    @D public get topTask(): TaskEvent {
        return this.tasks[0]
    }

    addTask(title: string, importance: number, deadline: string, estimatedCompletionTime: number): void {
        let event = new TaskEvent(title, importance)
        event.setTimes(new Date(deadline), estimatedCompletionTime)
        this.tasks.push(event)
    }
}