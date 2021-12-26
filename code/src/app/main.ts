import {LiveLine} from './liveline/base';

document.addEventListener('deviceready',() => {
    let frame = document.createElement("div")
    document.body.append(WallpaperFrame.generateFrame(frame))

    let backlayer = document.createElement("div")
    backlayer.classList.add("layer")
    frame.append(backlayer)
    TaskBoard.load().then(() => {
        backlayer.append(TaskGUI.buildGUI())
    })

    let liveline = new LiveLine()
    frame.append(liveline.buildGUI())

    frame.append((new Clock()).buildGUI())

})
