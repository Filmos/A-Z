module.load(function(name) {
  var soundEffects = {
    OscAmpEnv: function(config, destination) {
      config.envelope = {
        attack : 0.01,
        decay : 0.1,
        sustain : 0.5,
        release : 1,
        ...config.envelope
      }
      let effect = {}
      
      effect.envelope = new Tone.AmplitudeEnvelope(config.envelope).toDestination();
      effect.oscillator = new Tone.Oscillator(config.oscillator).connect(effect.envelope).start();
      effect.defaultTrigger = config.trigger || "8t"
      effect.defaultDelay = config.delay
      effect.soundOvertime = config.envelope.attack + config.envelope.decay + config.envelope.release
      
      
      effect.freeOn = 0
      effect.play = function(par) {
        par = par || {}
        let time = par.trigger || this.defaultTrigger
        let delay = par.delay || this.defaultDelay
        this.envelope.triggerAttackRelease(time, delay);
        this.freeOn = this.soundOvertime+Tone.Time(time).toSeconds()+Tone.Time(delay).toSeconds()
      }
      effect.dispose = function() {
        setTimeout(() => {
          this.envelope.dispose()
          this.oscillator.dispose()
        }, Math.max(0, this.freeOn-Tone.Time().toSeconds())*1000)
      }
      
      return effect
    }
  }
  var prebuild = {}
  
  chan.addListener("sound", function (sound, params) {
    if(!Array.isArray(sound)) sound = [sound]
    if(!Array.isArray(params)) params = [params]
    
    let soundPart = sound
    for(let s in sound) {
      let soundPart = sound[s]
      let par = null
      if(params.length > s) par = params[s]
      if(typeof par !== 'object' || par === null) par = {delay: par}
      
      if(prebuild[soundPart]) {
        if(!Array.isArray(par)) par = [par]
        for(let e in prebuild[soundPart]) {
          let effect = prebuild[soundPart][e]
          
          let pr = null
          if(par.length > e) pr = par[e]
          if(typeof pr !== 'object' || pr === null) pr = {delay: pr}
          
          if(!effect.play) {chan.debug('Corrupted sound effect "'+soundPart.type+'": play function no longer exists', "error"); continue}
          effect.play(pr)
        }
        continue
      } 
      
      if(!soundPart.type) {chan.debug("Tried playing sound effect without defined type", "error"); continue}
      if(!soundEffects[soundPart.type]) {chan.debug('Tried playing an unknown sound effect "'+soundPart.type+'"', "error"); continue}
      
      let effect = soundEffects[soundPart.type](soundPart)
      if(!effect) {chan.debug('Corrupted sound effect "'+soundPart.type+'": nothing was returned', "error"); continue}
      if(!effect.play) {chan.debug('Corrupted sound effect "'+soundPart.type+'": play function doesn\'t exist', "error"); continue}
      effect.play(par)
      if(effect.dispose) effect.dispose()
    }
  })
  chan.addListener("registerSound", function (name, sound) {
    if(prebuild[name]) chan.debug('Overwriting an already existing sound effect "'+name+'"...', "warn")
    else chan.debug('Registering a new sound effect "'+name+'"...')
    prebuild[name] = []
    if(!Array.isArray(sound)) sound = [sound]
    
    for(let soundPart of sound) {
      if(soundPart === name) {chan.debug("Tried registering recursive sound effect", "error"); continue}
      if(prebuild[soundPart]) {prebuild[name].push({effect: soundPart, play: function(par) {chan.sound(this.effect, par)}}); continue}
      
      if(!soundPart.type) {chan.debug('Tried registering sound effect "'+name+'" without defined type', "error"); continue}
      if(!soundEffects[soundPart.type]) {chan.debug('Tried registering sound effect "'+name+'" with an unknown type "'+soundPart.type+'"', "error"); continue}
      
      let effect = soundEffects[soundPart.type](soundPart)
      if(!effect) {chan.debug('Corrupted sound effect "'+soundPart.type+'": nothing was returned', "error"); continue}
      if(!effect.play) {chan.debug('Corrupted sound effect "'+soundPart.type+'": play function doesn\'t exist', "error"); continue}
      prebuild[name].push(effect)
    }
  })
  
  return {
    css: ``
  }
})