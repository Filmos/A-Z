class Task {
    @D("Identifier") public readonly title: string;
    @D public estimatedCompletionTime: number;

    @D public deadline: Date;

    constructor(title: string, estimatedCompletionTime: number) {
        TaskBoard.registerTask(this)
        this.title = title
        this.estimatedCompletionTime = estimatedCompletionTime
    }


    public static fromJson(json: any): Task {
        let task = new Task(json.title, parseInt(json.estimatedCompletionTime))
        task.deadline = new Date(parseInt(json.deadline))
        return task
    }
    public toJson(): any {
        return {
            title: this.title,
            estimatedCompletionTime: this.estimatedCompletionTime,
            deadline: this.deadline
        }
    }

}
// LiveLine.addCommand("+", ["string", "duration"], (title: string, duration: number) => {
//     console.log(title, duration)
// })

class TaskBoard {
    private static allTasks: Task[] = [];
    public static registerTask(task: Task) {
        this.allTasks.push(task)
    }

}