let EV = new TaskList()
EV.addTask("Tgpnm fv ihswmefl", 2,"07.04.2021", 45)
EV.addTask("Finao ga qkmr", 8,"07.01.2021", 120)
EV.addTask("Rxbkxb wejcwhi", 30, "09.01.2021", 60*8*4)
EV.addTask("Kxdxll rsi hpwjdjr xgbelhl", 40, "07.02.2021", 120)
EV.addTask("Oljuun vdhipcexg", 20, "07.14.2021", 60*6)
EV.addTask("Losbdv kewc cnnabf", 20, "07.29.2021", 60*4)
EV.addTask("Eukhfar ewh kmbwfl", 10, "07.02.2021", 45)

// EV.addTask("Clean up bathroom", 2,"07.04.2021", 45)
// EV.addTask("Rework website", 30, "09.01.2021", 60*8*4)
// EV.addTask("Ask about the bermuda project", 40, "07.02.2021", 120)



let mapMulti = new IntentionMap(["tasks/*/currentPriority"], TaskList)

// function nextGUI() {
//     GUI.generate(mapMulti, EV)
// }
//
// nextGUI()
// setInterval(nextGUI, 6000)
GUI.generate(mapMulti, EV)