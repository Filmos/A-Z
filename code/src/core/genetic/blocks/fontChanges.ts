new GraphicalBlock("fontSize",
    {size: {type: "int", range: [-6, 8]}},
    (params) => {return "font-size: "+(100+params.size*5)+"%"}
)
new GraphicalBlock("fontWeight",
    {weight: {type: "int", range: [-2, 4]}},
    (params) => {return "font-weight: "+(300+params.weight*100)}
)
new GraphicalBlock("fontItalic",
    {},
    () => {return "font-style: italic"}
)