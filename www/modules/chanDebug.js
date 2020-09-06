loadModule(function(name) {
  chan.addListener("debug", (data, type, details) => {
    if(!buildCells[name]) {console.warn("[debug\\"+(type||"info")+"] "+data); return}
    
    var log = document.createElement("p")
    log.className = type
    log.innerText = data
    for(let cell of buildCells[name]) 
      cell.appendChild(log)
  })
  chan.debug("Launching A.Z. v0.@", "important")
  
  return {
    css: `
    
      p {
        font-size: calc(9px + 0.9vmin);
        margin: 0 0.5em;
        font-family: monospace;
        text-transform: none;
        color: #00ff00;
      }
      
      p:first-child {
        margin-top: 0.3em;
      }
    `,
    build: ()=>{}
  }
})