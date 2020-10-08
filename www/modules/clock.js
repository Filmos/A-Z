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
      animation: clockColor;
      animation-iteration-count: 1;
      // animation-play-state: paused;
      
      @keyframes clockRotation {
        0% {transform: rotate(0deg) scale(1.175);}
        25% {transform: rotate(90deg) scale(1.175);}
        50% {transform: rotate(180deg) scale(1.175);}
        75% {transform: rotate(270deg) scale(1.175);}
        100% {transform: rotate(360deg) scale(1.175);}
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
      let unit = 60000*60/4/4
      // let time = 60000/2*6*(1+1/36)
      let time = unit*6*(1+1/36/8)
      
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
          hourLine3: "line;90;50;50;90",
          hourLine4: "line;90;50;50;90"
        }
      }
      let hourAnim = [
        {
          hourDot: "transform: translate(-7px, -7px); stroke-dasharray: 0 100; stroke-dashoffset: -28.3;", 
          hourLineM: "transform: rotate(90deg); transform-origin: 70px 70px; stroke-dasharray: 18.5 100; stroke-dashoffset: -38.2;", 
          hourLine1: "transform: rotate(-90deg) translate(6.5px, -13.5px); transform-origin: 80px 60px; stroke-dasharray: 9.9 100;", 
          hourLine2: "transform: rotate(90deg) translate(-13.5px, 6.5px); transform-origin: 60px 80px; stroke-dasharray: 9.9 100;", 
          hourLine3: "transform: translate(-7px, -7px); stroke-dasharray: 9.35 100; stroke-dashoffset: -19.1;",
          hourLine4: "transform: translate(-7px, -7px); stroke-dasharray: 9.35 100; stroke-dashoffset: -28.1;"
        },
        {hourLine4: "-t", hourLine3: [":t", "transform: translate(0.5px, 0.5px) rotate(90deg); transform-origin: 70px 70px; stroke-dasharray: 10 100; stroke-dashoffset: -29;"]},
        {hourLine3: "-t"},
        {hourLine2: "-t", hourLine1: "-t"},
        {hourLineM: "-t"},
        {hourDot: "-t"},
        {}
      ]
      
      let quadDef = {
        parts: {
          quadLine1: "line;79;66;69.5;56.5",
          quadLine2: "line;66;79;56.5;69.5",
          quadLineH: "line;69.5;56.5;56.5;69.5",
          quadLineM: "line;63;63;50;50",
          quadLineO: "line;90;50;50;90",
          quadTemp1: "line;83.5;70.5;70.5;83.5",
          // quadTemp2: "line;76.5;63.5;77;77",
          // quadTemp3: "line;63.5;76.5;77;77",
          // quadTemp4: "line;76.5;63.5;83.5;70.5",
          // quadTemp5: "line;63.5;76.5;70.5;83.5"
        }
      }
      let quadAnim = [
        {
          quadLine1: "transform: translate(7px, 7px) rotate( 42.5deg); transform-origin: 69.5px 56.5px; stroke-dasharray: 14 100; stroke-dashoffset: 0;",
          quadLine2: "transform: translate(7px, 7px) rotate(-42.5deg); transform-origin: 56.5px 69.5px; stroke-dasharray: 14 100; stroke-dashoffset: 0;",
          quadLineH: "transform: translate(14px, 14px); stroke-dasharray: 0 100; stroke-dashoffset: -9.2;",
          quadLineM: "transform: translate(14px, 14px); stroke-dasharray: 0 100;",
          quadLineO: "stroke-dasharray: 0 100; stroke-dashoffset: -28.2; transform: translate(7px, 7px);",
          quadTemp1: "stroke-dasharray: 0 100; stroke-dashoffset: -9.2;"
        },
        // {
        //   quadLine1: "transform: rotate(-90deg) translate(-7px, 7px); transform-origin: 76.5px 63.5px; stroke-dasharray: 6 100;",
        //   quadLine2: "transform: rotate(90deg) translate(7px, -7px); transform-origin: 63.5px 76.5px; stroke-dasharray: 6 100;",
        //   quadLineH: "transform: translate(14px, 14px); stroke-dasharray: 6 100; stroke-dashoffset: -6.2;",
        //   quadLineM: "transform: translate(14px, 14px); stroke-dasharray: 0 100;",
        //   quadLineO: "transform: translate(7px, 7px); stroke-dasharray: 18.4 100; stroke-dashoffset: -19.1;"
        // },
        {
          quadLine1: {type: ":t", data: "transform: none; stroke-dasharray: 10 100; stroke-dashoffset: -3.6;", jump: "transform: rotate(-90deg) translate(-7px, 7px); transform-origin: 76.5px 63.5px; stroke-dasharray: 6 100;"}, 
          quadLine2: {type: ":t", data: "transform: none; stroke-dasharray: 10 100; stroke-dashoffset: -3.6;", jump: "transform: rotate( 90deg) translate(7px, -7px); transform-origin: 63.5px 76.5px; stroke-dasharray: 6 100;"}, 
          quadLineH: {type: "-t", jump: "transform: translate(14px, 14px); stroke-dasharray: 6 100; stroke-dashoffset: -6.2;"}, 
          quadLineM: {type: "-t", jump: "transform: translate(14px, 14px); stroke-dasharray: 0 100;"}, 
          quadLineO: {type: "-t", jump: "transform: translate(7px, 7px); stroke-dasharray: 18.4 100; stroke-dashoffset: -19.1;"}, 
          quadTemp1: "-t"
        },
        {quadLine1: {type: ":t", data: "stroke-dasharray: 10 100; stroke-dashoffset: -3.6; visibility: visible;", jump: "visibility: hidden"}, quadLine2: {type: ":t", data: "stroke-dasharray: 10 100; stroke-dashoffset: -3.6; visibility: visible;", jump: "visibility: hidden"}, quadLineH: "-t", quadLineM: "-t", quadLineO: "-t"},
        {}
      ]
      for(let i=0;i<4;i++) {
        let h = svg.build(hourDef)
        h.style.transform = "rotate("+90*i+"deg)"
        svg.animate(h, hourAnim, unit*6, time, 1/12/5)
        clock.appendChild(h)
        
        let q = svg.build(quadDef)
        q.style.transform = "rotate("+90*i+"deg)"
        svg.animate(q, quadAnim, unit*6*3, time, 1/12/6/5)
        clock.appendChild(q)
      }
      
    }
  }
})