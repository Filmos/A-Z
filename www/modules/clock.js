class svgCollection {
  constructor() {
    this.elements = []
  }
  add(el) {
    this.elements.push(el)
    return this
  }
  class(name) {
    for(let e of this.elements) e.classList.add(name)
    return this
  }
  build(svgElem) {
    if(!svgElem) {
      svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svgElem.setAttribute("viewBox", "0 0 100 100")
    }
    for(let e of this.elements) svgElem.appendChild(e)
    return svgElem
  }
}

var svg = {
  circleFragments: function(cols, radius = 45, offset = 0) {
    var svgColl = new svgCollection()
    
    sum = 0
    for(let c in cols) {
      if(!Array.isArray(cols[c])) cols[c] = [1, cols[c]]
      sum += cols[c][0]
    }
    
    overlap = 0.01
    frag = 0
    for(let i=0; i<cols.length; i++) {
      let v = document.createElementNS("http://www.w3.org/2000/svg", "path")
      
      let startY = 50+radius*Math.cos(Math.PI - Math.PI*2/sum*(frag+offset) + Math.PI*overlap)
      let startX = 50+radius*Math.sin(Math.PI - Math.PI*2/sum*(frag+offset) + Math.PI*overlap)
      frag += cols[i][0]
      let endY = 50+radius*Math.cos(Math.PI - Math.PI*2/sum*(frag+offset))
      let endX = 50+radius*Math.sin(Math.PI - Math.PI*2/sum*(frag+offset))
      
      if(cols[i][1] === "NONE") continue
      v.setAttribute("d", `M${startX} ${startY} A${radius} ${radius} 0 ${cols[i][0]>=sum/2?1:0} 1 ${endX} ${endY}`)
      v.setAttribute("pathLength", "100")
      v.setAttribute("stroke", cols[i][1])
      svgColl.add(v)
    }
    return svgColl
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
      v.style.animationName = css.injectAnimation(anim)
    }
  }
}

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
        fill: none;
        * {
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1);
        }
      }
    `,
    build: (cell)=>{
      let colsGreen = ["#99ff99", "#53ff1a", "#00b300", "#006633"]
      let colsBlue = ["#a4e0f4", "#00cccc", "#3366ff", "#0000cc", "#270066"]
      let colsMagenta = ["#ff99e6", "#ff66d9", "#e60073", "#800040", "#400000", "#663300"]
      let colsYellow = ["#ffff99", "#ffc21a", "#806000", "#332600"]
      
      let target = new Date()
      let radius = 48
      let precision = [0, 1]
      let absSize = 0.2
      
      let blankSize = [3, 5, 4, 4]
      let cols = [[100*(1-absSize), "NONE"]]
      
      let addAbsMarker = function(value, colors, prec) {
        if(prec < precision[0]) return
        if(prec > precision[1]) return
        
        let parsed = value.toString(colors.length)
        cols.push([100*absSize/(precision[1]-precision[0]+1)/2, colors[parseInt(parsed[0])]])
        cols.push([100*absSize/(precision[1]-precision[0]+1)/2, colors[parseInt(parsed[1])]])
      }
      addAbsMarker(Math.round(target.getMinutes()/5), colsGreen, 0)      
      addAbsMarker(target.getHours(), colsBlue, 1)      
      addAbsMarker(target.getDate(), colsMagenta, 2)      
      addAbsMarker(target.getMonth()+1, colsYellow, 3)      
      
      let svgHolder = svg.circleFragments(cols, radius, 100*(absSize-1)/2).build()
      cell.appendChild(svgHolder)
      let relAnimLine = svg.circleFragments([[1-absSize, "purple"], [absSize, "NONE"]], radius, (absSize-1)/2).class("clockAnimLine").elements[0]
      let relAnimStripes = svg.circleFragments([[1-absSize, "orange"], [absSize, "NONE"]], radius, (absSize-1)/2).class("clockAnimStripes").elements[0]
      
      let addRelativeAnim = function(step) {
        let r = x => Math.round(x*1000)/1000
        let ticks = Math.ceil(step/2)-1
        let partSize = r(100/(1+5*ticks/3)*2/3)
        let anim = "{\n"
        
        let arcSize = (i) => (100-partSize*i)/(i+(i==ticks && step%2==1 ?0:1))
        for(let i=0;i<ticks+1;i++) {
          state = " 0"
          for(let j=0;j<i;j++) state += " " + r((j==0 && i==ticks && step%2==1 ?0:arcSize(i))) + " " + r(partSize)
          if(i!=ticks) state += " " + r(arcSize(i+1)+partSize/2) + " 0"
          state += " 150"
          for(let j=i*2;j<step-3;j++) {state += " 0"}
          
          anim += 100/(step-1)*i+`% {stroke-dasharray:${state};}\n`
          if(i!=ticks) anim += 100/(step-1)*(i+0.8)+`% {stroke-dasharray:${state};}\n`
        }
        
        arcSize = r(arcSize(ticks))
        for(let i=1;i<step-ticks;i++) {
          state = ""
          if(step%2==1) state += " "+partSize+" 0"
          for(let j=0;j<i;j++) state += " " + r((j==0?0:partSize)+arcSize*(j==step-ticks-2?1.1:1)) + " " + 0
          for(let j=i;j<ticks+1-(step%2);j++) state += " " + partSize + " " + arcSize
          state += " 0 150"
          anim += Math.min(100/(step-1)*(i+ticks), 100)+`% {stroke-dasharray:${state};}\n`
        }
        
        console.log(anim)
        relAnimStripes.style.animationName = css.injectAnimation(anim+"}")
        relAnimStripes.style.animationDuration = "15s"
        // setInterval(() => relAnimStripes.style.stroke = `rgb(${55+Math.floor(Math.random()*200)}, ${55+Math.floor(Math.random()*200)}, ${Math.floor(Math.random()*255)})`, 10000/(step-1))
      }
      addRelativeAnim(12)
      
      
      svgHolder.appendChild(relAnimLine)
      svgHolder.appendChild(relAnimStripes)
    }
  }
})