var svg = {
  animCache: {},
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
  animate: function(svgElem, config, unit, time) {
    if(time===undefined) time = unit
    let delay = -(unit-(time%unit))%unit+"ms"
    
    for(let v of svgElem.childNodes) {
      let anim = " {\n"
      let p = v.classList[0]      
      
      if(config[0].includes(p)) anim += "   0% {visibility: visible;}\n"
      else anim += "   0% {visibility: hidden;}\n"
      for(let i=1;i<config.length;i++) {
        let type = config[i][p]
        if(!type) continue
        
        let addFrames = function(active, inactive, unset) {
          anim += "   "+(100/(config.length-1)*(i-0.25))+"% {"+unset+";}\n"
          anim += "   "+(100/(config.length-1)*(i-0.2))+"% {"+(type[0]==='-'?active:inactive)+"visibility: "+(type[0]==='-'?"visible":"hidden")+";}\n"
          anim += "   "+(100/(config.length-1)*i)+"% {"+(type[0]==='-'?inactive:active)+"}\n"
          anim += "   "+(100/(config.length-1)*(i+0.05))+"% {"+(type[0]==='-'?inactive:active)+"visibility: "+(type[0]==='-'?"hidden":"visible")+";}\n"
          anim += "   "+(100/(config.length-1)*(i+0.1))+"% {"+unset+";}\n"
        }
        
        switch(type) {
          case "-lo": case "+lo":
            
            let dist = Math.sqrt((v.getAttribute("y2")-v.getAttribute("y1"))**2+(v.getAttribute("x2")-v.getAttribute("x1"))**2)
            addFrames(`stroke-dasharray: ${dist} 0; stroke-dashoffset: ${dist/2};`, `stroke-dasharray: ${dist} ${dist}; stroke-dashoffset: ${dist};`, `stroke-dasharray: unset; stroke-dashoffset: unset;`)
            break
            
          case "-lm": case "+lm":
          case "-le": case "+le":
          case "-lb": case "+lb":
            
            let ang = Math.atan2(v.getAttribute("y2")-v.getAttribute("y1"), v.getAttribute("x2")-v.getAttribute("x1"))
            ang = "transform-origin: "+(v.getAttribute("x2")*(type[2]==='b'?0:1)+v.getAttribute("x1")*(type[2]==='e'?0:1))/(type[2]==='m'?2:1)+"px "+(v.getAttribute("y2")*(type[2]==='b'?0:1)+v.getAttribute("y1")*(type[2]==='e'?0:1))/(type[2]==='m'?2:1)+"px; transform: rotate3d("+Math.sin(ang)+", "+(-Math.cos(ang))+", 0, "
            addFrames(ang+"0deg);", ang+"90deg);", "transform: unset;")
            break
            
          default:
            addFrames("opacity:1;", "opacity:0;", "opacity: unset;")
        }
      }
      anim +="   100% {visibility: hidden;}\n}"
      
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

module.load(function(name) {
  let animCount = 0
  
  return {
    css: `
      overflow: hidden;
      animation: clockColor;
      animation-iteration-count: 1;
      border-radius: 50%;
      border: aliceblue 4px solid;
      
      
      @keyframes clockRotation {
        0% {transform: rotate(0deg);}
        25% {transform: rotate(90deg);}
        50% {transform: rotate(180deg);}
        75% {transform: rotate(270deg);}
        100% {transform: rotate(360deg);}
      }
      
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
        stroke-width: 5;
        stroke-linecap: round;
        animation: clockRotation;
        animation-timing-function: cubic-bezier(.61,.02,.85,1);
        animation-play-state: inherit;
        * {
          animation-timing-function: inherit;
          animation-play-state: inherit;
          transform-origin: center;
          stroke-linejoin: round;
          visibility: hidden;
          fill-opacity: 0.2;
        }
        polygon {
          stroke-width: 1;
        }
      }
    `,
    build: (cell)=>{
      let unit = 60000/6
      let time = 240000/6
      
      let clockDef = {
        parts: {
          lineH: "line;10;50;90;50",
          lineV: "line;50;10;50;90",
          line1: "line;50;10;90;50",
          line2: "line;90;50;50;90",
          line3: "line;50;90;10;50",
          line4: "line;10;50;50;10",
          hour1: "polygon;54.25,62.25 62.25,54.25 70.25,62.25 62.25,70.25",
          hour2: "polygon;54.25,37.75 62.25,45.75 70.25,37.75 62.25,29.75",
          hour3: "polygon;45.75,37.75 37.75,45.75 29.75,37.75 37.75,29.75",
          hour4: "polygon;45.75,62.25 37.75,54.25 29.75,62.25 37.75,70.25"
        }
      }
      let clock = svg.build(clockDef)
      cell.appendChild(clock)
      
      let delay = -(unit-(time%unit))%unit+"ms"
      cell.style.animationDuration = time+"ms"
      
      clock.style.animationDuration = unit/3+"ms"
      clock.style.animationDelay = delay
      clock.style.animationIterationCount = Math.ceil(time/unit)*3
      
      let animConfig = [
        ["line1","line2","line3","line4","hour1","hour2","hour3","hour4"],
        {lineH: "+lo"},
        {lineV: "+lo"},
        {line1: "-lo", line3: "-lo"},
        {line2: "-lo", line1: "+lo"},
        {lineH: "-lm"},
        {lineV: "-lb"},
        {line3: "+le"},
        {line1: "-lb", lineV: "+lo"},
        {line4: "-lo", line1: "+lb"},
        {line1: "-lb"},
        {lineV: "-le"},
        {line3: "-lm"}
      ]
      svg.animate(clock, animConfig, unit, time)
    }
  }
})