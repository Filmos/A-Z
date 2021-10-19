// new TaskGoal("Rework website", "Filmos")
//     .addTask(new Task("Change to dual view (Anti-void and Deltarift)", 60*3))
//     .addTask(new Task("Update how subpages work", 60*2))
//     .addTask(new Task("Upgrade encounter download system", 60*2))
//     .addTask(new Task("Google presence", 45))
//
// new TaskGoal("Make A-Z an active desktop task planner", "Aurin")
//     .addTask(new Task("Auto-start on system launch and Wallpaper Engine connection", 60*1.4))
//     .addTask(new Task("Some sort of storage and input method", 60*3))
//     .addTask(new Task("Working timers, deadlines and scheduled reminders", 60*3))
//     .addTask(new Task("Quick notes field and planned review time", 60*2))
//
// new TaskGoal("Make A-Z a mobile task planner", "Aurin")
//     .addTask(new Task("GUI generation for mobile devices", 60*12))
//     .addTask(new Task("GUI generation for smartwatches", 60*12))
//
// new TaskGoal("Improve A-Z automatically generated interface", "Aurin")
//     .addTask(new Task("Change scoring to a tree traversal system", 60*7))
//     .addTask(new Task("Fully implement genetic algorithm", 60*2.5))
//     .addTask(new Task("Chromosome storage and loading", 60*1))
//     .addTask(new Task("Automatic on-start improvement attempt", 60*1.5))
//
// new TaskGoal("Implement task recommendation system for A-Z", "Aurin")
//     .addTask(new Task("Contractor-variance priority system", 60*4))
//     .addTask(new Task("Tasks with minimum daily requirements", 45))
//     .addTask(new Task("Minimum daily work time, overtime tracker and projected goal completion", 60*3))
//     .addTask(new Task("Task preference marking", 60*2))
//
// new TaskGoal("Anti-void: First checkpoint", "Filmos")
//     .addTask(new Task("Basic map generation and transformations", 60*3*4))
//     .addTask(new Task("Base for modular item and attack system", 60*3*4))
//     .addTask(new Task("Prepare concepts for enemy attack patterns", 60*6))
//
// new TaskGoal("Deltarift: chapter 2", "Filmos")
//     .addTask(new Task("Lore research on deltarune chapter 2", 60*7))
//     .addTask(new Task("Lore planning", 60*3*6))
//     .addTask(new Task("Coding", 60*6*6))
//     .addTask(new Task("Recording videos and publishing", 60*3))


// let EV = new TaskBoard()
// GUI.gen([
//         "goals/*/contractor",
//         "goals/*/tasks/*/estimatedCompletionTime"
//     ], TaskBoard, EV)

document.addEventListener('deviceready',() => {
    FileStorage.load("tasks").then((storedData) => {
        console.log(storedData)
        let newVal = Math.floor(Math.random() * 100) + ""
        console.log("> " + newVal)
        FileStorage.write("tasks", newVal)
    })
})