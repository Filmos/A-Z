class Task {
    @D("Identifier") public readonly title: string;
    @D public readonly contractor: TaskContractor;
    @D public readonly reward: number;

    @D public estimatedCompletionTime: number;

    @D public deadline: Date;

    constructor(title: string, contractor: string, reward: number, estimatedCompletionTime: number) {
        this.title = title
        this.contractor = TaskContractor.get(contractor)
        this.reward = reward
        this.estimatedCompletionTime = estimatedCompletionTime
        TaskBoard.registerTask(this)
    }

    @D public currentPriority(): number {
        return this.reward/this.estimatedCompletionTime
    }
}

class TaskContractor {
    @D("Identifier") public readonly name: string
    constructor(name: string) {
        this.name = name
        TaskContractor.entries[name] = this
    }

    private static entries: {[name: string]: TaskContractor} = {}
    static get(name: string): TaskContractor {
        if(!this.entries[name]) return new TaskContractor(name)
        return this.entries[name]
    }
}

class TaskBoard {
    private static allTasks: Task[] = [];
    public static registerTask(task: Task) {
        this.allTasks.push(task)
    }

    @D("TopGradient") public get tasks(): Task[] {
        return TaskBoard.allTasks.sort((a, b) => b.currentPriority()-a.currentPriority())
    }
    @D public get topTask(): Task {
        return this.tasks[0]
    }
}