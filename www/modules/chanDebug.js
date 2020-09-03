chan.addListener("debug", (data, type) => {
  console.log("+-+", data)
})

chan.debug("Oh")
chan.debug("Hi!", "warn")
chan.debug("How are you?")
chan.deb("How are you?")
