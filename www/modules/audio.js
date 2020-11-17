module.load(function(name) {
  
  chan.addListener("sound", function (data, type="dynamic") {
    
    chan.debug('<'+data+'>', "warn")
  })
  
  return {
    css: ``
  }
})