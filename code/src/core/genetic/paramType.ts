type ParamType<T, U> = {
    random: (def: U) => T,
    mix: (def: U, a: T, b:T) => T
}
let ParamTypes: {[property: string]: ParamType<any, any>} = {}

ParamTypes["int"] = {
    random: (def: {range: [number, number]}) => {return Math.floor(Math.random() * (def.range[1] - def.range[0] + 1)) + def.range[0]},
    mix: (def: {range: [number, number]}, a: number, b: number) => {return Math.round((a+b)/2)}
}