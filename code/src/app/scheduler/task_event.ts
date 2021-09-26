class Task {
    @D("Identifier") public readonly title: string;
    @D public estimatedCompletionTime: number;

    @D public deadline: Date;

    constructor(title: string, estimatedCompletionTime: number) {
        this.title = title
        this.estimatedCompletionTime = estimatedCompletionTime
    }
}

class TaskGoal {
    @D("Identifier") public readonly title: string;
    @D public readonly contractor: TaskContractor;
    @D public tasks: Task[] = [];

    constructor(title: string, contractor: TaskContractor|string) {
        this.title = title

        if(typeof contractor == "string") contractor = TaskContractor.get(contractor)
        this.contractor = contractor

        TaskBoard.registerTask(this)
    }

    public addTask(task: Task): TaskGoal {
        this.tasks.push(task)
        return this
    }

    @D public currentPriority(): number {
        return 0
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
    private static allTasks: TaskGoal[] = [];
    public static registerTask(task: TaskGoal) {
        this.allTasks.push(task)
    }

    @D("TopGradient") public get goals(): TaskGoal[] {
        return TaskBoard.allTasks.sort((a, b) => b.currentPriority()-a.currentPriority())
    }
    @D public get topGoals(): TaskGoal {
        return this.goals[0]
    }
}