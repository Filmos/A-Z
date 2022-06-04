export abstract class Specific {

}


interface SpecificClassConstructor<T extends Specific> {
    new (...args: any): T;
}
export function AsProxy<T extends Specific>(specificClass: SpecificClassConstructor<T>): (...args: any)=>T {
    return new Proxy(
        Reflect.construct.bind(null, specificClass),
        {
            get(tar, prop, val) {
                // access static 
                return Reflect.get(specificClass, prop, val);
            },
            set(tar, prop, val) {
                // access static 
                return Reflect.set(specificClass, prop, val);
            },
            apply(target, thisArg, argumentsList) {
                // make the constructor work 
                return target({ ...argumentsList, length: argumentsList.length });
            }
        }
    );
}