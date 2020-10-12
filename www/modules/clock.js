var svg = {
  animCache: {},
  circleFragments: function(cols, radius = 45) {
    var svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svgElem.setAttribute("viewBox", "0 0 100 100")
    
    maxI = cols.length
    overlap = 0.01
    for(let i=0; i<maxI; i++) {
      let v = document.createElementNS(svgElem.namespaceURI, "path")
      
      let startY = 50+radius*Math.cos(Math.PI - Math.PI*2/maxI*i + Math.PI*overlap)
      let startX = 50+radius*Math.sin(Math.PI - Math.PI*2/maxI*i + Math.PI*overlap)
      let endY = 50+radius*Math.cos(Math.PI - Math.PI*2/maxI*(i+1))
      let endX = 50+radius*Math.sin(Math.PI - Math.PI*2/maxI*(i+1))
      
      v.setAttribute("d", `M${startX} ${startY} A${radius} ${radius} 0 0 1 ${endX} ${endY}`)
      v.setAttribute("stroke", "rgb(0, 255, 255)")
      
      v.setAttribute("stroke", cols[i%cols.length])
      svgElem.appendChild(v)
    }
    return svgElem
  },
  build: function(def) {
    let partConfig = {
      line: ["x1", "y1", "x2", "y2"],
      rect: ["width", "height", "x", "y"],
      polygon: ["points"]
    }
    
    let svgCount = Object.entries(def.parts).length
    if(svgCount == 0) chan.debug('Building an empty svg...')
    else chan.debug('Building '+svgCount+' svg element'+(svgCount>1?"s":"")+'...')
    
    var svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svgElem.setAttribute("viewBox", "0 0 100 100")
    
    for(let p in def.parts) {
      let part = def.parts[p].split(";")
      let v = document.createElementNS(svgElem.namespaceURI, part[0])
      v.setAttribute("class", p)
      if(!partConfig[part[0]]) {chan.debug('Tried building svg part for an unconfigured element "'+part[0]+'"', "error")}
      else for(let i = 1; i<part.length;i++) {
        if(!partConfig[part[0]][i-1]) {chan.debug('Part config exceded svg build definition for element "'+p+'": '+def.parts[p]); break}
        v.setAttribute(partConfig[part[0]][i-1], part[i])
      }
      
      svgElem.appendChild(v)
    }
    return svgElem;
  },
  animate: function(svgElem, config, unit, time, trans=0.2) {
    chan.debug("Animating svg group...")
    if(time===undefined) time = unit
    let delay = -(unit-(time%unit))%unit+"ms"
    
    for(let v of svgElem.childNodes) {
      if(v.tagName === "svg") continue
      let anim = " {\n"
      let p = v.classList[0]      
      
      let state = ""
      if(config[0][p]) {
        if(config[0][p]!==true) state = config[0][p]
        anim += "   0% {visibility: visible;"+state+"}\n"
      } else anim += "   0% {visibility: hidden;}\n"
      for(let i=1;i<config.length;i++) {
        let con = config[i][p]
        if(!con) continue
        
        let addFrames = function(active, inactive, unset) {
          anim += "   "+(100/(config.length-1)*(i-trans*1.1))+"% {"+unset+"}\n"
          anim += "   "+(100/(config.length-1)*(i-trans))+"% {"+state+(con.type[0]==='-'?active:inactive)+"visibility: "+(con.type[0]==='-'?"visible":"hidden")+";}\n"
          anim += "   "+(100/(config.length-1)*i)+"% {"+(con.type[0]==='-'?inactive:active)+"}\n"
          anim += "   "+(100/(config.length-1)*(i+trans*0.1))+"% {"+(con.type[0]==='-'?inactive:active)+"visibility: "+(con.type[0]==='-'?"hidden":"visible")+";}\n"
          anim += "   "+(100/(config.length-1)*(i+trans*0.100001))+"% {"+(con.jump?con.jump:state+unset)+"}\n"
        }
        
        if(Array.isArray(con)) {
          con = {
            type: con[0],
            data: con[1]
          }
        } else if(typeof con === 'string' || con instanceof String) {
          con = {
            type: con
          }
        }
        
        switch(con.type) {
          case ":t":
          
            anim += "   "+(100/(config.length-1)*(i-trans))+"% {"+state+"}\n"
            state = con.data
            anim += "   "+(100/(config.length-1)*i)+"% {"+state+"}\n"
            anim += "   "+(100/(config.length-1)*(i+trans*0.1))+"% {"+state+"}\n"
            if(con.jump) anim += "   "+(100/(config.length-1)*(i+trans*0.100001))+"% {"+con.jump+"}\n"
            break
            
          case "-t":
            
            addFrames(``, `stroke-dasharray: ${Math.sqrt((v.getAttribute("y2")-v.getAttribute("y1"))**2+(v.getAttribute("x2")-v.getAttribute("x1"))**2)} 0; stroke-dashoffset: 0; transform: none;`, ``)
            break
          
          case "-lo": case "+lo":
            
            let dist = Math.sqrt((v.getAttribute("y2")-v.getAttribute("y1"))**2+(v.getAttribute("x2")-v.getAttribute("x1"))**2)
            addFrames(`stroke-dasharray: ${dist} 0; stroke-dashoffset: ${dist/2};`, `stroke-dasharray: ${dist} ${dist}; stroke-dashoffset: ${dist};`, `stroke-dasharray: unset; stroke-dashoffset: unset;`)
            break
            
          case "-lm": case "+lm":
          case "-le": case "+le":
          case "-lb": case "+lb":
            
            let ang = Math.atan2(v.getAttribute("y2")-v.getAttribute("y1"), v.getAttribute("x2")-v.getAttribute("x1"))
            ang = "transform-origin: "+(v.getAttribute("x2")*(con.type[2]==='b'?0:1)+v.getAttribute("x1")*(con.type[2]==='e'?0:1))/(con.type[2]==='m'?2:1)+"px "+(v.getAttribute("y2")*(con.type[2]==='b'?0:1)+v.getAttribute("y1")*(con.type[2]==='e'?0:1))/(con.type[2]==='m'?2:1)+"px; transform: rotate3d("+Math.sin(ang)+", "+(-Math.cos(ang))+", 0, "
            addFrames(ang+"0deg);", ang+"90deg);", "transform: unset;")
            break
            
          default:
            addFrames("opacity:1;", "opacity:0;", "opacity: unset;")
        }
        
        if(con.jump) state = con.jump
      }
      anim +="   100% {"+state+"visibility: hidden;}\n}"
      
      v.style.animationDuration = unit+"ms"
      v.style.animationDelay = delay
      v.style.animationIterationCount = Math.ceil(time/unit)
      
      let animHash = Math.abs(hash(anim.replace(/\s+/g,"")))
      if(!this.animCache[animHash]) {
        anim = "@keyframes svg-anim-"+animHash+anim
        css.inject(anim)
        this.animCache[animHash] = true
      }
      v.style.animationName = "svg-anim-"+animHash
    }
  }
}

// stroke-dasharray: <line length> 0;
module.load(function(name) {
  return {
    css: `
      overflow: hidden;
      
      @keyframes clockColor {
        0% {stroke: #de7834; fill: #de7834;}
        40% {stroke: #f7da2f; fill: #f7da2f;}
        60% {stroke: #c4ee42; fill: #c4ee42;}
        70% {stroke: #73e264; fill: #73e264;}
        80% {stroke: #27c8c6; fill: #27c8c6;}
        90% {stroke: #2e68e0; fill: #2e68e0;}
        100% {stroke: #a22edb; fill: #a22edb;}
      }
      
      svg {
        stroke-width: 4px;
        stroke: palegreen;
      }
    `,
    build: (cell)=>{
      let colsGreen = ["#99ff99", "#53ff1a", "#00b300", "#006633"]
      let colsBlue = ["#a4e0f4", "#00cccc", "#3366ff", "#0000cc", "#270066"]
      let colsMagenta = ["#ff99e6", "#ff66d9", "#e60073", "#800040", "#400000", "#663300"]
      let colsYellow = ["#ffff99", "#ffc21a", "#806000", "#332600"]
      
      let target = new Date();
      
      let blank = "black"
      let cols = [blank, blank]
      
      let min = Math.round(target.getMinutes()/5).toString(4)
      cols.push(colsGreen[parseInt(min[0])])
      cols.push(colsGreen[parseInt(min[1])])
      
      let hour = target.getHours().toString(5)
      cols.push(colsBlue[parseInt(hour[0])])
      cols.push(colsBlue[parseInt(hour[1])])
      
      let day = target.getDate().toString(6)
      cols.push(colsMagenta[parseInt(day[0])])
      cols.push(colsMagenta[parseInt(day[1])])
      
      let month = (target.getMonth()+1).toString(4)
      cols.push(colsYellow[parseInt(month[0])])
      cols.push(colsYellow[parseInt(month[1])])
      
      cols.push(blank)
      cols.push(blank)
      cell.appendChild(svg.circleFragments(cols, 48))
    }
  }
})