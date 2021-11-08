class Task {
    @D("Identifier") private readonly title: string;
    @D private readonly estimatedCompletionTime: number;

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
        svg.setAttributeNS(null, "viewBox", "0 0 100 150")
        svg.classList.add("task-monument")
        console.log(TaskBoard.allTasks)
        return (svg as Node)
    }
}