new GraphicalBlock("fontSize",
    {size: {type: "int", range: [-6, 8]}},
    (params) => {return {css: "font-size: "+(100+params.size*5)+"%"}}
)
new GraphicalBlock("fontWeight",
    {weight: {type: "int", range: [-4, 10]}},
    (params) => {return {css: "font-variation-settings: 'wght' "+(400+params.weight*50)}}
)
// new GraphicalBlock("fontItalic",
//     {angle: {type: "int", range: [1, 2]}},
//     (params) => {return {css: `transform: skew(${params.angle*(-10)}deg, 0deg) translate(${params.angle}px, 0px); margin-right: ${params.angle}px`}},
//     "leaf"
// )
new GraphicalBlock("fontOpacity",
    {transparency: {type: "int", range: [2, 5]}},
    (params) => {return {css: `opacity: ${1-params.transparency/10}`}},
    "leaf"
)