// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function loadModule(text) {
  console.log(text)
  console.log(document.currentScript)
}


var chan = new Proxy({}, {
  get: function(target, name) {
    let buildIn = {
      addListener: (chanId, listener) => {
        if(chanId in buildIn) chan.debug('Tried creating channel with a reserved name "'+chanId+'"', "error")
        if(!(chanId in target)) target[chanId] = []
        target[chanId].push(listener)
      },
      exists: (chanId) => {
        return chanId in target
      }
    }
    
    if(name in buildIn) return buildIn[name]
    if(name in target) return function() {
      for(f of target[name]) f(...arguments)
    }
    return function(data, type) {
      let mes = "["+name+(type?"\\"+type:"")+"] "+data
      if(!chan.exists("debug")) console.error(mes)
      else chan.debug(mes, "warn")
    }
  }
})


function onDeviceReady() {
  let importModule = function(name) {
    var script = document.createElement("script")
    script.src = 'modules/'+name+'.js'
    document.head.appendChild(script)
  }
  importModule('chanDebug')
}
