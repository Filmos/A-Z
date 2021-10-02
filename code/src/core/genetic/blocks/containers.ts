new GraphicalBlock("containerBorder",
    {
        borderWidth: {type: "int", range: [1, 3]},
        borderRadius: {type: "int", range: [0, 3]},
        padding: {type: "int", range: [1, 5]}
    },
    (params) => {return {css: `border: solid black ${params.borderWidth}px; border-radius: ${params.borderRadius*0.25}rem; padding: ${params.padding*0.1}rem`}},
    "parent"
)
new GraphicalBlock("displayBlock",
    {},
    () => {return {css: `display: inline-block`}}
)
new GraphicalBlock("displayFlex",
    {
        flexDirection: {type: "int", range: [0, 1]},
        justifyContent: {type: "int", range: [0, 5]}
    },
    (params) => {return {css: `display: flex; flex-direction: ${["column","row"][params.flexDirection]}; align-items: center; justify-content: ${["flex-start","flex-end","space-between","space-around","space-evenly","center"][params.justifyContent]}`}},
    "parent"
)
new GraphicalBlock("backgroundColor",
    {
        saturation: {type: "int", range: [0, 10]},
        lightness: {type: "int", range: [0, 12]}
    },
    (params) => {return {css: `background-color: hsl(208deg, ${params.saturation*10}%, ${100-params.lightness*3}%)`}},
    "parent"
)
new GraphicalBlock("marginBorder",
    {
        size: {type: "int", range: [1, 4]},
        direction: {type: "int", range: [-1, 1]}
    },
    (params) => {return {css: (params.direction>0?``:`margin-bottom: ${params.size*6}px;`)+(params.direction<0?``:`margin-right: ${params.size*6}px;`)}}
)