var hash = function(inp) {
  if(inp === null) return 0
  
  if(typeof inp === 'object') {
    const ordered = {};
    Object.keys(inp).sort().forEach(function(key) {
      ordered[key] = inp[key];
    });
    inp = JSON.stringify(ordered);
  }
  
  var hash = 0, i, chr;
  for (i = 0; i < inp.length; i++) {
    chr   = inp.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
var css = {
  animCache: {},
  parse: function(css) {
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
          let pref = "", suf = "", flag = -1
          for(let si in scope) {
            s = scope[si]
            if(s.indexOf("@")==0 && si==content.length-1) {
              pref = s
              suf = ""
              continue
            }
            if(s.indexOf("@")==0) {
              pref = ""
              suf = ""
              flag = si
              continue
            }
            if(flag!==-1) {
              pref += s+" { "
              suf += "}"
              continue
            }
            pref += s+" "
          }
          if(flag==-1) parsed += pref+" {\n"+content[content.length-1]+suf+"}\n\n"
          else content[flag] += pref+"\n"+content[content.length-1]+suf+"\n"
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
        content[content.length-1] += "   "+frag+";\n"
        continue
      }
      
      chan.debug('Error while parsing css, unrecognized fragment: "'+frag+'"', "error", css)
    }
    return parsed
  },
  inject: function(css) {
    chan.debug('Inserting a css fragment...', 'info', css)
    var sheet = document.createElement("style")
    sheet.type = "text/css"
    sheet.innerText = css
    document.head.appendChild(sheet)
  },
  injectAnimation: function(anim) {
    let animHash = Math.abs(hash(anim.replace(/\s+/g,"")))
    if(!this.animCache[animHash]) {
      anim = "@keyframes anim-"+animHash+anim
      this.inject(anim)
      this.animCache[animHash] = true
    }
    return "anim-"+animHash
  }
}

var module = {
  // Meta-data about loaded modules
  data: {},
  // A module:array queue with actions awaiting for a module to be loaded. Each actions should have:
  //   postInit() - function which is executed after a module is laoded
  buildQueue: {},
  postponed: false,
  cells: {},
  load: function(par1, par2) {
    let mod = document.currentScript.src.match(/\/([^/]+?)\.js/i)
    if(!mod) {chan.debug("Tried loading invalid module \""+mod+"\"", "error"); return}
    mod = mod[1]
    chan.debug('Pre-loading "'+mod+'" module...')
    
    dependencies = []
    let parseDependencies = (p) => {
      if(!p) return
      if(Array.isArray(p)) {dependencies = p; return}
      if(typeof p === 'string' || p instanceof String) {dependencies = [p]; return}
      chan.debug("Module \""+mod+"\" has an invalid dependency parameter", "warn");
    }
    
    init = ()=>{}
    if (typeof par1 === "function") {init = par1; parseDependencies(par2)}
    else if (typeof par2 === "function") {init = par2; parseDependencies(par1)}
    else {chan.debug("Tried loading module \""+mod+"\", which is lacking an initializer", "error"); return}
    
    let dependencyCount = dependencies.length
    dependencies = dependencies.filter(m => !this.data[m] && this.buildQueue[m]===undefined)
    if(dependencies.length==0) {this.innerLoad(mod, init); return}
    
    chan.debug("Module \""+mod+"\" requested "+dependencyCount+" "+(dependencyCount==1?"dependency":"dependencies")+", out of which "+dependencies.length+" "+(dependencies.length==1?"requires":"require")+" activation.");
    let moduleQueuer = {
      toLoad: dependencies.length,
      initFunction: init,
      moduleName: mod,
      postInit: function() {
        this.toLoad--
        if(this.toLoad<0) {chan.debug("Module queuer for \""+this.moduleName+"\" was pinged more times than the amount of dependencies", "warn"); return}
        if(this.toLoad==0) module.innerLoad(this.moduleName, this.initFunction)
      }
    }
    for(let dm of dependencies) this.addToBuildQueue(moduleQueuer, dm)
  },
  innerLoad: function(mod, init) {
    if(this.data[mod]) {chan.debug("Tried loading an already loaded module \""+mod+"\"", "warn"); return}
    chan.debug('Loading "'+mod+'" module...', 'important')
    
    let data = {}
    try {data = init(mod)}
    catch(e) {
      chan.debug("Couldn't initialize \""+mod+"\" module: "+e, "error")
      return
    }
    chan.debug('Successfully initialized "'+mod+'" module')
    
    this.data[mod] = data
    if(data.css) css.inject(css.parse(`*[class*=' m-${mod}'] {${data.css}}`))
    if(this.buildQueue[mod]) {
      this.buildQueue[mod].forEach(e => e.postInit())
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
      chan.debug('Requesting "'+mod+'" module...', "important")
      injectJS('modules/'+mod+'.js')
      if(tag=="l1") {
        chan.debug('Module "'+mod+'" requested a level 1 loading lock')
        this.postponed = [mod]
      }
    } else this.postponed.push([mod, tag])
  },
  addToBuildQueue: function(el, mod, tag) {
    if(this.data[mod]) {el.postInit(); return}
    if(this.buildQueue[mod]) {this.buildQueue[mod].push(el); return}
    this.buildQueue[mod] = [el]
    this.import(mod, tag)
  },
  build: function(el, mod, tag) {
    let elf = {
      elementToBuild: el,
      moduleName: mod,
      postInit: function() {module.forceBuild(this.elementToBuild, this.moduleName)}
    }
    this.addToBuildQueue(elf, mod, tag)
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


document.addEventListener('deviceready', onDeviceReady, false);
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
