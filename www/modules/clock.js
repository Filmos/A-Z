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
          animation-timing-function: cubic-bezier(1,0,.86,-0.13);
          animation-iteration-count: infinite;
        }
      }
    `,
    build: (cell)=>{
      let unit = 60000
      
      
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
        ["line3"],
        ["line3","lineV"],
        ["line3","lineV","line1"],
        ["line3","lineV","line4"],
        ["line3","line1","line4"],
        ["line1","line4"],
        ["line1","line4","lineV"],
        ["line1","line4","lineV","lineH"],
        ["line2","line4","lineV","lineH"],
        ["line1","line2","line3","line4","lineV","lineH"],
        ["line1","line2","line3","line4","lineH"],
        ["line1","line2","line3","line4"]
      ]
      
      
      let svgCount = Object.entries(clockDef.parts).length
      if(svgCount == 0) chan.debug('Building an empty svg...')
      else chan.debug('Building '+svgCount+' svg element'+(svgCount>1?"s":"")+'...')
      
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("viewBox", "0 0 100 100")
      svg.style.animationDuration = unit/3+"ms"
      
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
        let anim = "@keyframes anim"+animCount+" {\n"
        animCount++
        for(let i=animConfig.length-1;i>=0;i--) {
          let check = animConfig[i].includes(p)
          anim += "   "+(100/animConfig.length*(animConfig.length-1-i))+"% {opacity: "+(check?1:0)+";}\n"
        }
        anim+="   100% {opacity: 0;}\n}"
        css.inject(anim)
        
        svg.appendChild(v)
      }
      
      
      cell.appendChild(svg)
    }
  }
})