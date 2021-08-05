new Task("Clean up bathroom", "Patryk", 1, 45)
new Task("Rework website", "Filmos", 9, 60*4*4)
new Task("Anti-void: Basic map generation and transformations", "Filmos", 3, 60*3*4)
new Task("Anti-void: Base for modular item and attack system", "Filmos", 3, 60*3*4)
new Task("Anti-void: Prepare concepts for enemy attack patterns", "Filmos", 1, 60*6)
new Task("Prepare for statistics exams", "PW", 3, 60*3*14)
new Task("A-Z: Permanent object storage", "Aurin", 1, 60*2)
new Task("A-Z: Working timers, deadlines and scheduled reminders", "Aurin", 1, 60*3)
new Task("A-Z: Chromosome storage, startup loading and auto-start on system launch", "Aurin", 1, 60*1.8)
new Task("A-Z: Quick notes field, planned review time, and task generation from GUI", "Aurin", 1, 60*4)
new Task("A-Z: Fully implement genetic algorithm", "Aurin", 1, 60*2.5)
new Task("A-Z: Automatic background improvement training", "Aurin", 1, 60*3)
new Task("A-Z: GUI generation for mobile devices", "Aurin", 2, 60*12)
new Task("A-Z: GUI generation for smartwatches", "Aurin", 6, 60*12)
new Task("A-Z: Contractor-variance priority system", "Aurin", 1, 60*4)
new Task("A-Z: Tasks with minimum daily requirements", "Aurin", 0.5, 45)
new Task("A-Z: Minimum daily work time, overtime tracker and rewards, current equipment counter", "Aurin", 0.5, 60*2)
new Task("A-Z: Task preference marking", "Aurin", 0.5, 60*2)
new Task("A-Z: Graphical representation of rewards", "Aurin", 0.5, 60*3)


let EV = new TaskBoard()
GUI.gen([
        "tasks/*/contractor",
        "tasks/*/reward",
        "tasks/*/estimatedCompletionTime"
    ], TaskBoard, EV)