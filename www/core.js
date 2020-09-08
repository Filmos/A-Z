// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

var module = {
  data: {},
  buildQueue: {},
  postponed: false,
  cells: {},
  load: function(init) {
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
    
    this.data[mod] = data
    if(data.css) insertCSS(parseCSS(`*[class*=' m-${mod}'] {${data.css}}`))
    if(this.buildQueue[mod]) {
      this.buildQueue[mod].forEach(e => this.forceBuild(e, mod))
      this.buildQueue[mod] = null
    }
    if(this.postponed !== false && this.postponed[0] == mod) {
      chan.debug('Releasing module loading lock...')
      let postCopy = this.postponed
      this.postponed = false
      for(let i=1;i<postCopy.length;i++) this.import(...postCopy[i])
    }
  },
  import: function(mod, tag) {
    var injectJS = function(path) {
      var script = document.createElement("script")
      script.src = path
      document.head.appendChild(script)
    }
    
    if(this.postponed===false) {
      injectJS('modules/'+mod+'.js')
      if(tag=="l1") {
        chan.debug('Module "'+mod+'" requested a level 1 loading lock')
        this.postponed = [mod]
      }
    } else this.postponed.push([mod, tag])
  },
  build: function(el, mod, tag) {
    if(!this.data[mod]) {
      if(this.buildQueue[mod]) {this.buildQueue[mod].push(el); return}
      this.buildQueue[mod] = [el]
      this.import(mod, tag)
    } else this.forceBuild(el, mod)
  },
  forceBuild: function(el, mod) {
    if(!this.data[mod]) {chan.debug('Force build requested for an unloaded module "'+mod+'"', "error"); return}
    if(!this.data[mod].build) {chan.debug('Cell requested an unbuildable module "'+mod+'"', "error"); return}
    chan.debug('Building a cell for the "'+mod+'" module...')
    el.style.background = "transparent"
    try {
      this.data[mod].build(el)
      if(!this.cells[mod]) this.cells[mod] = []
      this.cells[mod].push(el)
    } catch(e) {chan.debug("Error while building a cell for the \""+mod+"\" module: "+e, "error")}
  }
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
  for(let el of document.body.children) {
    for(let cl of el.classList) {
      if(cl.indexOf("m-")!=0) continue
      let reqData = cl.split("-")
      module.build(el, reqData[1], reqData[2])
      break
    }
  }
}
