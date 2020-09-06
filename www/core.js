// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

var moduleData = {}
var buildQueue = {}
var buildCells = {}
function buildModule(el, mod) {
  if(!moduleData[mod].build) {chan.debug('Cell requested an unbuildable module "'+mod+'"', "error"); return}
  chan.debug('Building a cell for the "'+mod+'" module...')
  el.style.background = "transparent"
  try {
    moduleData[mod].build(el)
    if(!buildCells[mod]) buildCells[mod] = []
    buildCells[mod].push(el)
  } catch(e) {chan.debug("Error while building a cell for the \""+mod+"\" module: "+e, "error")}
}
function loadModule(init) {
  let parseCSS = function(css) {
    let parsing = css.split(/([{;}])/).map(s => s.trim()).filter(s => s)
    let parsed = ""
    let scope = []
    let content = []
    
    for(let i in parsing) {
      let frag = parsing[i]
      if(frag==="{"||frag===";") continue
      if(frag==="}") {
        if(scope.length < 1) chan.debug("Error while parsing css, scope is empty", "error", css)
        else if(content.length < 1) chan.debug("Error while parsing css, content is empty", "error", css)
        else if(content[content.length-1]) {
          parsed += scope.join(" ")+" {\n"+content[content.length-1]+"}\n\n"
        }
        if(scope.length > 0) scope.pop()
        if(content.length > 0) content.pop()
        continue        
      }
    
      if(i == parsing.length-1) break
      let next = parsing[i*1+1]
      if(next==="{") {
        scope.push(frag)
        content.push("")
        continue
      }
      if(next===";") {
        content[content.length-1] = "   "+content[content.length-1]+frag+";\n"
        continue
      }
      
      chan.debug('Error while parsing css, unrecognized fragment: "'+frag+'"', "error", css)
    }
    return parsed
  }
  let insertCSS = function(css) {
    chan.debug('Inserting a css fragment...', 'info', css)
    var sheet = document.createElement("style")
    sheet.type = "text/css"
    sheet.innerText = css
    document.head.appendChild(sheet)
  }
  
  let mod = document.currentScript.src.match(/\/([^/]+?)\.js/i)
  if(!mod) {chan.debug("Tried loading invalid module: "+document.currentScript.src, "error"); return}
  mod = mod[1]
  chan.debug('Loading "'+mod+'" module...')
  
  let data = {}
  try {data = init(mod)}
  catch(e) {
    chan.debug("Couldn't initialize \""+mod+"\" module: "+e, "error")
    return
  }
  chan.debug('Successfully initialized "'+mod+'" module')
  
  moduleData[mod] = data
  if(buildQueue[mod]) {
    buildQueue[mod].forEach(e => buildModule(e, mod))
    buildQueue[mod] = null
  }
  if(data.css) insertCSS(parseCSS(`.m-${mod} {${data.css}}`))
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
      if(!chan.exists("debug")) console.warn(mes)
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
  
  for(let el of document.body.children) {
    for(let cl of el.classList) {
      if(cl.indexOf("m-")!=0) continue
      let mod = cl.substring(2)
      if(!moduleData[mod]) {
        if(buildQueue[mod]) {buildQueue[mod].push(el); break}
        buildQueue[mod] = [el]
        importModule(mod)
        break
      }
      buildModule(el, mod)
      break
    }
  }
}
