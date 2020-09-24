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
        let type = config[i][p]
        if(!type) continue
        
        let addFrames = function(active, inactive, unset) {
          anim += "   "+(100/(config.length-1)*(i-trans*1.1))+"% {"+unset+"}\n"
          anim += "   "+(100/(config.length-1)*(i-trans))+"% {"+state+(type[0]==='-'?active:inactive)+"visibility: "+(type[0]==='-'?"visible":"hidden")+";}\n"
          anim += "   "+(100/(config.length-1)*i)+"% {"+(type[0]==='-'?inactive:active)+"}\n"
          anim += "   "+(100/(config.length-1)*(i+trans*0.1))+"% {"+(type[0]==='-'?inactive:active)+"visibility: "+(type[0]==='-'?"hidden":"visible")+";}\n"
          anim += "   "+(100/(config.length-1)*(i+trans*0.2))+"% {"+state+unset+"}\n"
        }
        
        switch(type) {
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

// stroke-dasharray: <line length> 0;
module.load(function(name) {
  return {
    css: `
      overflow: hidden;
      animation: clockColor;
      animation-iteration-count: 1;
      // animation-play-state: paused;
      
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
      
      @keyframes null7 {
        100% {transform: none; stroke-dasharray: 56.5 0; stroke-dashoffset: 0;}
      }
      
      .rotator {
        animation: clockRotation;
        animation-timing-function: cubic-bezier(.61,.02,.85,1);
        animation-play-state: inherit;
        border-radius: 50%;
        width: 100%;
        height: 100%;
        
        svg {
          stroke-width: 5;
          stroke-linecap: round;
          animation-play-state: inherit;
          position: fixed;
          * {
            animation-timing-function: linear;
            animation-play-state: inherit;
            transform-origin: center;
            stroke-linejoin: round;
            visibility: visible;
            fill-opacity: 0.2;
          }
          polygon {
            stroke-width: 1;
          }
          
        }
      }
    `,
    build: (cell)=>{
      let unit = 60000/4
      let time = 60000/4*5
      
      let minuteDef = {
        parts: {
          lineH: "line;10;50;90;50",
          lineV: "line;50;10;50;90",
          line1: "line;50;10;90;50",
          line2: "line;90;50;50;90",
          line3: "line;50;90;10;50",
          line4: "line;10;50;50;10"
        }
      }
      let clock = document.createElement('div')
      clock.className = "rotator"
      cell.appendChild(clock)
      
      let minute = svg.build(minuteDef)
      clock.appendChild(minute)
      
      let delay = -(unit-(time%unit))%unit+"ms"
      cell.style.animationDuration = time+"ms"
      
      clock.style.animationDuration = unit/3+"ms"
      clock.style.animationDelay = delay
      clock.style.animationIterationCount = Math.ceil(time/unit)*3
      
      let minuteAnim = [
        {line1: true, line2: true, line3: true, line4: true},
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
      svg.animate(minute, minuteAnim, unit, time)
      
      
      
      let hourDef = {
        parts: {
          // dot: "line;63;63;63;63",
          hourDot: "line;90;50;50;90",
          // lineM: "line;50;50;63;63",
          hourLineM: "line;90;50;50;90",
          // line1: "line;76.5;63.5;69.5;56.5",
          // line2: "line;63.5;76.5;56.5;69.5",
          hourLine1: "line;70;70;90;50",
          hourLine2: "line;70;70;50;90",
          // lineH: "line;69.5;56.5;56.5;69.5"
          hourLineH: "line;90;50;50;90"
        }
      }
      let hourAnim = [
        {
          hourDot: "transform: translate(-7px, -7px); stroke-dasharray: 0 100; stroke-dashoffset: -28.3;", 
          hourLineM: "transform: rotate(90deg); transform-origin: 70px 70px; stroke-dasharray: 18.6 100; stroke-dashoffset: -38.1;", 
          hourLine1: "transform: rotate(-90deg) translate(6.5px, -13.5px); transform-origin: 80px 60px; stroke-dasharray: 9.9 100;", 
          hourLine2: "transform: rotate(90deg) translate(-13.5px, 6.5px); transform-origin: 60px 80px; stroke-dasharray: 9.9 100;", 
          hourLineH: "transform: translate(-7px, -7px); stroke-dasharray: 18.35 100; stroke-dashoffset: -19.1;"
        },
        {hourLineH: "-t"},
        {hourLine2: "-t", hourLine1: "-t"},
        {hourLineM: "-t"},
        {hourDot: "-t"},
        {}
      ]
      for(let i=0;i<4;i++) {
        let h = svg.build(hourDef)
        h.style.transform = "rotate("+90*i+"deg)"
        svg.animate(h, hourAnim, unit*5, time, 1/12/5)
        clock.appendChild(h)
      }
      
    }
  }
})