loadModule({
  css: `
    background: orange;
  
    p {
      margin: 0;
    }
  `
})

chan.addListener("debug", (data, type) => {
  console.log("+-+", data)
})