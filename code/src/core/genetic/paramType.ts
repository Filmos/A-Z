type ParamType<T, U> = {
    random: (def: U) => T,
    mix: (def: U, a: T, b:T) => T
}
let ParamTypes: {[property: string]: ParamType<any, any>} = {}

ParamTypes["int"] = {
    random: (def: {range: [number, number]}) => {return Math.floor(Math.random() * (def.range[1] - def.range[0] + 1)) + def.range[0]},
    mix: (def: {range: [number, number]}, a: number, b: number) => {
        let floatValue = ((a||0)+(b||0))/2
        return Math.random()>0.5?Math.floor(floatValue):Math.ceil(floatValue)
    }
}