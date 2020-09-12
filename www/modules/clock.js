module.load(function(name) {
  let animCount = 0
  
  return {
    css: `
      overflow: hidden;
      
      @keyframes clockRotation {
        0% {transform: rotate(0deg);}
        25% {transform: rotate(90deg);}
        50% {transform: rotate(180deg);}
        75% {transform: rotate(270deg);}
        100% {transform: rotate(360deg);}
      }
      
      svg {
        stroke: wheat;
        stroke-width: 5;
        stroke-linecap: round;
        animation: clockRotation 1200s infinite cubic-bezier(.61,.02,.85,1);
        * {
          animation-timing-function: inherit;
          animation-iteration-count: infinite;
          animation-play-state: inherit;
          transform-origin: center;
        }
      }
    `,
    build: (cell)=>{
      let unit = 60000*15
      
      
      let partConfig = {
        line: ["x1", "y1", "x2", "y2"]
      }
      let clockDef = {
        parts: {
          lineH: "line,5,50,95,50",
          lineV: "line,50,5,50,95",
          line1: "line,50,5,95,50",
          line2: "line,95,50,50,95",
          line3: "line,50,95,5,50",
          line4: "line,5,50,50,5"
        }
      }
      let animConfig = [
        ["line1","line2","line3","line4"],
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
      
      
      let svgCount = Object.entries(clockDef.parts).length
      if(svgCount == 0) chan.debug('Building an empty svg...')
      else chan.debug('Building '+svgCount+' svg element'+(svgCount>1?"s":"")+'...')
      
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("viewBox", "0 0 100 100")
      svg.style.animationDuration = unit/3+"ms"
      
      let anim = ""
      for(let p in clockDef.parts) {
        let part = clockDef.parts[p].split(",")
        let v = document.createElementNS(svg.namespaceURI, part[0])
        v.setAttribute("class", p)
        if(!partConfig[part[0]]) {chan.debug('Tried building svg part for an unconfigured element "'+part[0]+'"', "error")}
        else for(let i = 1; i<part.length;i++) {
          if(!partConfig[part[0]][i-1]) {chan.debug('Part config exceded svg build definition for element "'+p+'": '+clockDef.parts[p]); break}
          v.setAttribute(partConfig[part[0]][i-1], part[i])
        }
        
        
        
        v.style.animationDuration = unit+"ms"
        v.style.animationName = "anim"+animCount
        anim += "@keyframes anim"+animCount+" {\n"
        animCount++
        
        // let off="opacity: 0;", on="opacity: 1;"
        // switch(part[0]) {
        //   case 'line':
        //     let ang = Math.atan2(v.getAttribute("y2")-v.getAttribute("y1"), v.getAttribute("x2")-v.getAttribute("x1"))
        //     ang = "transform-origin: "+(v.getAttribute("x2")*1+v.getAttribute("x1")*1)/2+"px "+(v.getAttribute("y2")*1+v.getAttribute("y1")*1)/2+"px; transform: rotate3d("+Math.sin(ang)+", "+(-Math.cos(ang))+", 0, "
        //     off=ang+"90deg);"
        //     on=ang+"0deg);"
        //     // off="stroke-dashoffset: 110; stroke-dasharray: 100 100;"
        //     // on="stroke-dasharray: 100 0; stroke-dashoffset: 55;"
        //     // on="stroke-dasharray: 100 0; stroke-dashoffset: 68;"
        // }
        
        if(animConfig[0].includes(p)) anim += "   0% {visibility: visible;}\n"
        else anim += "   0% {visibility: hidden;}\n"
        for(let i=1;i<animConfig.length;i++) {
          let type = animConfig[i][p]
          if(!type) continue
          
          let addFrames = function(active, inactive, unset) {
            anim += "   "+(100/(animConfig.length-1)*(i-0.25))+"% {"+unset+";}\n"
            anim += "   "+(100/(animConfig.length-1)*(i-0.2))+"% {"+(type[0]==='-'?active:inactive)+"visibility: "+(type[0]==='-'?"visible":"hidden")+";}\n"
            anim += "   "+(100/(animConfig.length-1)*i)+"% {"+(type[0]==='-'?inactive:active)+"}\n"
            anim += "   "+(100/(animConfig.length-1)*(i+0.05))+"% {"+(type[0]==='-'?inactive:active)+"visibility: "+(type[0]==='-'?"hidden":"visible")+";}\n"
            anim += "   "+(100/(animConfig.length-1)*(i+0.1))+"% {"+unset+";}\n"
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
          
          
          // let check = false
          // let add = ""
          // if(i!==-1) {for(let a of animConfig[i]) {
          //   if(a===p) {
          //     check = true
          //     break
          //   }
          //   if(a[0]===p) {
          //     if(a[2]) add=a[2]
          //     check = a[1]
          //     break
          //   }
          // }}
          // if(add) console.log(anim)
          // if(flag===check) continue
          // flag = check
          // if(i<animConfig.length-1) anim += "   "+(100/animConfig.length*(animConfig.length-1.2-i))+"% {"+(check?off:on)+add+"}\n"
          // if(add) console.log(anim)
        }
        anim +="   100% {visibility: hidden;}\n}\n\n"
        
        svg.appendChild(v)
      }
      console.log(anim)
      css.inject(anim)
      
      
      cell.appendChild(svg)
    }
  }
})