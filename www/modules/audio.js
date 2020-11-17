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
      effect.soundOvertime = config.envelope.attack + config.envelope.decay + config.envelope.release
      effect.freeOn = 0
      
      effect.play = function(time, delay) {
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
  
  chan.addListener("sound", function (sound, params) {
    if(!Array.isArray(params)) params = [params]
    
    let soundPart = sound[0]
    if(!soundPart.type) {chan.debug("Tried playing sound effect without defined type", "warn"); return}
    if(!soundEffects[soundPart.type]) {chan.debug('Tried playing an unkown sound effect "'+soundPart.type+'"', "warn"); return}
    
    let effect = soundEffects[soundPart.type](soundPart)
    if(!effect) {chan.debug('Corrupted sound effect "'+soundPart.type+'": nothing was returned', "warn"); return}
    if(!effect.play) {chan.debug('Corrupted sound effect "'+soundPart.type+'": play function doesn\'t exist', "warn"); return}
    effect.play(...params)
    if(effect.dispose) effect.dispose()
  })
  
  return {
    css: ``
  }
})