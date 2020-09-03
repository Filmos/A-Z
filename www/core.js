// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function loadModule(text) {
  console.log(text)
  console.log(document.currentScript)
}

function onDeviceReady() {
  let importModule = function(name) {
    var script = document.createElement("script")
    script.src = 'modules/'+name+'/entry.js'
    document.head.appendChild(script)
  }
  importModule('clock')
}
