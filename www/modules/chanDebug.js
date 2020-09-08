loadModule(function(name) {
  let config = {
    important: {func: (d)=>{console.log("%c"+d, 'margin-left: 10px; color: #0e53bb; font-weight: 700;')}, color: "#4dd5fe"},
    info: {func: (d)=>{console.log("%c"+d, 'margin-left: 10px;')}, color: "#a2ed68"},
    warn: {func: console.warn, color: "#efe26b"},
    error: {func: console.error, color: "#ff3842"}
  }
  let newP = (data, type="info", details) => {
    var log = document.createElement("p")
    log.className = "debug-type-"+type
    log.innerText = data
    return log
  }
  
  cache = []
  chan.addListener("debug", function (data, type="info", details) {
    let cfg = config[type]
    if(!cfg) {
      if(type!=="warn") {
        chan.debug('Tried sending a debug info with an invalid type "'+type+'"', "warn")
        chan.debug("  "+data, "warn", details)
      } else {console.error("Error in the debug config: warn is a mandatory type")}
      return
    }
    if(cfg.func) cfg.func(data)
    cache.push([...arguments])
    if(!buildCells[name]) return
    
    let log = newP(...arguments)
    for(let cell of buildCells[name]) 
      cell.appendChild(log)
  })
  
  let version = "vantablack"
  try {
    let s = metaStorage
    version = "vaque"
    if(metaStorage.commits) version = "v0."+metaStorage.commits.toString(16)
  } catch(e) {}
  chan.debug("Launching A.Z. "+device.platform+" "+version, "important")
  
  return {
    css: `
    
      p {
        font-size: calc(9px + 0.9vmin);
        margin: 0 0.5em;
        font-family: monospace;
        text-transform: none;
        color: #ffffff;
      }
      
      p:first-child {
        margin-top: 0.5em;
      }
      
      ${Object.keys(config).map(t => {return "p.debug-type-"+t+" {\ncolor: "+(config[t].color||"#e7d4ff")+";\n}\n"}).join("\n")}
    `,
    build: (cell)=>{
      for(let l of cache) cell.appendChild(newP(...l))
    }
  }
})