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
class animSequence {
  constructor() {
    this.phases = []
  }
  add(el) {
    this.phases.push(el)
    return this
  }
  apply(el) {
    let defaults = {IterationCount: 1}
    let flags = {}
    for(let ph of this.phases) for(let p in ph) flags[p] = []
    for(let ph of this.phases) for(let p in flags) flags[p].push(ph[p] || defaults[p] || "initial")
    chan.debug(`Applying ${this.phases.length}-long animation sequence to an element...`)
    for(let p in flags) el.style["animation"+p] = flags[p].join(", ")
    return this
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
    
    let r = x => Math.round(x*10000)/10000
    overlap = 0.005
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

module.load(["audio"], function(name) {  
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
        }
      }
    `,
    build: (cell)=>{
      let colsGreen = ["#99ff99", "#53ff1a", "#00b300", "#006633"]
      let colsBlue = ["#a4e0f4", "#00cccc", "#3366ff", "#0000cc", "#270066"]
      let colsMagenta = ["#ff99e6", "#ff66d9", "#e60073", "#800040", "#400000", "#663300"]
      let colsYellow = ["#ffff99", "#ffc21a", "#806000", "#332600"]
      
      let target = new Date()
      target.setSeconds(target.getSeconds() + 2);
      // target.setHours(12, 30)
      let radius = 48
      let precision = [0, 1]
      let absSize = 0.2
      let timeScale = 1
      
      let fullTime = (target - (new Date()))/1000/timeScale
      // fullTime = 4
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
      
      let lastColor = "black"
      let stripeAnim = new animSequence()
      let lineAnim = new animSequence()
      
      let addRelativeAnim = function(step, time, color, last = false) {
        time = time/timeScale
        if(fullTime > time/step) {
          let r = x => Math.round(x*1000)/1000
          let ticks = Math.ceil(step/2)-1
          let partSize = r(100/(1+5*ticks/3)*2/3)
          let anim = `{\n0%,100%{stroke:${color};}\n`
          
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
            for(let j=0;j<i;j++) state += " " + r((j==0?0:partSize)+arcSize+(j==step-ticks-2?2:0)) + " " + 0
            for(let j=i;j<ticks+1-(step%2);j++) state += " " + partSize + " " + arcSize
            state += " 0 150"
            anim += Math.min(100/(step-1)*(i+ticks), 100)+`% {stroke-dasharray:${state};}\n`
          }
        
          let delay = fullTime-time
          let animTime = (last?time:time/step*(step-1))
          
          stripeAnim.add({
            Name: css.injectAnimation(anim+"}"), 
            Duration: animTime+"s",
            Delay: delay+"s",
            TimingFunction: "cubic-bezier(0.45, 0, 0.55, 1)"
          })
          lineAnim.add({
            Name: css.injectAnimation(`{0%, 100%{stroke:${lastColor};}}`),
            Duration: animTime+"s",
            Delay: delay+"s"
          })
        }
        lastColor = color
      }
      addRelativeAnim(10, 60*60*24*7*4*12*10, "#f3f9c9") // Years, up to 10
      addRelativeAnim(12, 60*60*24*7*4*12, "#095169") // Months
      addRelativeAnim(4,  60*60*24*7*4, "#f6ae96") // Weeks
      addRelativeAnim(7,  60*60*24*7, "#059b9a") // Days
      addRelativeAnim(4,  60*60*24, "#fa6465") // Hours, by 6
      addRelativeAnim(6,  60*60*6, "#53ba83") // Last 6 hours
      addRelativeAnim(12, 60*60, "#ac457c") // Minutes, by 5
      addRelativeAnim(5,  60*5, "#9fd96b") // Last 5 minutes
      addRelativeAnim(12, 60, "#602694", true) // Seconds
      
      let addOvertimeAnim = function(time, col1, col2) {
        time = time/timeScale
        
        let delay = fullTime
        let offset = 10
        stripeAnim.add({
          Name: css.injectAnimation(`{0% {stroke-dashoffset: ${offset}; stroke-dasharray: 10 100; stroke:${col1};} 50% {stroke:${col1};} 100% {stroke-dashoffset: ${offset-time*5}; stroke-dasharray: 10 5; stroke:${col2};}}`), 
          Duration: time+"s",
          Delay: delay+"s",
          TimingFunction: "linear"
        })
        lineAnim.add({
          Name: css.injectAnimation(`{0%, 100%{stroke:${lastColor};}}`),
          Duration: (time-1)+"s",
          Delay: delay+"s"
        })
        offset -= time*5
        
        delay += time
        lineAnim.add({
          Name: css.injectAnimation(`{0% {stroke:${lastColor};} 100%{stroke:${col1};}}`),
          Duration: "1s",
          Delay: (delay-1)+"s"
        })
        stripeAnim.add({
          Name: css.injectAnimation(`{0% {stroke-dashoffset: ${offset}; stroke-dasharray: 10 5; stroke:${col2};} 100% {stroke-dashoffset: ${offset-Math.floor(time/2)*2*35}; stroke-dasharray: 10 5; stroke:${col2};}}`), 
          Duration: Math.floor(time/2)*2+"s",
          Delay: delay+"s",
          TimingFunction: "linear"
        })
        lineAnim.add({
          Name: css.injectAnimation(`{50% {stroke:${lastColor};} 0%, 100%{stroke:${col1};}}`),
          Duration: "2s",
          Delay: delay+"s",
          IterationCount: Math.floor(time/2)
        })
        offset -= Math.floor(time/2)*2*35
        
        delay += Math.floor(time/2)*2
        stripeAnim.add({
          Name: css.injectAnimation(`{0% {stroke-dashoffset: ${offset}; stroke-dasharray: 10 5; stroke:${col2};} 45%,55% {stroke:${col1}} 100% {stroke-dashoffset: ${offset-15*4}; stroke-dasharray: 10 5; stroke:${col2};}}`), 
          Duration: "2s",
          Delay: delay+"s",
          TimingFunction: "linear",
          IterationCount: "infinite"
        })
        lineAnim.add({
          Name: css.injectAnimation(`{50% {stroke:${col2};} 0%, 100%{stroke:${col1};}}`),
          Duration: "2s",
          Delay: delay+"s",
          IterationCount: "infinite"
        })
        
        
        const reverb = new Tone.Reverb({
        	"wet": 0.5,
        	"decay": 1.5,
        	"preDelay": 0.01
        }).toDestination();
          
        var ampEnv = new Tone.AmplitudeEnvelope({
          attack: 0.02,
          decay: 0.3,
          sustain: 1.0,
          release: 0.02,
        }).connect(reverb);
        var osc = new Tone.Oscillator(470).connect(ampEnv).start(); 
        
        var ampEnv2 = new Tone.AmplitudeEnvelope({
          attack: 0.02,
          decay: 0.3,
          sustain: 1.0,
          release: 0.02,
        }).connect(reverb);
        var osc2 = new Tone.Oscillator(650).connect(ampEnv2).start(); 
        
        var ampEnv3 = new Tone.AmplitudeEnvelope({
          attack: 0.02,
          decay: 0.3,
          sustain: 1.0,
          release: 0.02,
        }).connect(reverb);
        var osc3 = new Tone.Oscillator(820).connect(ampEnv3).start(); 
        
        setTimeout(() => {
        setInterval(() => {
          let td = ((new Date()) - target)/1000
          
          chan.sound([{
            type:"OscAmpEnv",
            oscillator: 470,
            envelope: {
              attack: 0.02,
              decay: 0.3,
              sustain: 1.0,
              release: 0.02,
            }
          }], "8t")
          
          if(td < time) {
            // ampEnv.triggerAttackRelease("8t");
          } else if(td < time+Math.floor(time/2)*2) {
            // ampEnv.triggerAttackRelease("8t");
            // ampEnv2.triggerAttackRelease("8t", "+0.3");
          } else {
            // ampEnv.triggerAttackRelease("8t");
            // ampEnv3.triggerAttackRelease("8t", "+0.25");
            // ampEnv2.triggerAttackRelease("8t", "+0.5");
          }
        }, 2000)}, fullTime*1000)
      }
      // 20 - 50
      // 20*60 - 70
      // addOvertimeAnim(20, "#d2ed48", "#f36235")
      addOvertimeAnim(20, "#ffc185", "#ff2424")
      
      stripeAnim.apply(relAnimStripes)
      lineAnim.apply(relAnimLine)
      
      function playMP3(file, time=0) {
        setTimeout(()=>{
          let src = cordova.file.applicationDirectory + 'www/audio/' + file
          var myMedia =
            new Media(src,
              function () { },
              function (e) { alert('Media Error: ' + JSON.stringify(e)); }
            );
          myMedia.play();
          myMedia.setVolume('0.5');
        }, time)
      }
      
      svgHolder.appendChild(relAnimLine)
      svgHolder.appendChild(relAnimStripes)
    }
  }
})