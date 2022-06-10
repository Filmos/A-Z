import {Parameter} from './nodes.js';

export abstract class Specific {
    readonly guid: number = -1;
    children: {[key: string]: Specific[]} = {};
    public with(specific: Specific): this {
        if (!this.children[specific.guid]) {
            this.children[specific.guid] = [];
        }
        this.children[specific.guid].push(specific);
        return this;
    }
    // TODO: add logic for parameter matching
    public matches(provider: Specific): boolean {
        if(this.guid != provider.guid) {
            return false;
        }
        for (const key in this.children) {
            if (!provider.children[key]) {
                return false;
            }

            for (const requiredSpecific of this.children[key]) {
                let found = false;
                for (const providedSpecific of provider.children[key]) {
                    if (requiredSpecific.matches(providedSpecific)) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return false;
                }
            }
        }
        return true;
    }
}


interface SpecificClassConstructor<T extends Specific> {
    new (...args: any): T;
}
let GUID = 0;
export function AsProxy<T extends Specific>(specificClass: SpecificClassConstructor<T>): (...args: any)=>T {
    const thisGuid = GUID++;
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
                const specific = target({ ...argumentsList, length: argumentsList.length });
                specific.guid = thisGuid;
                return specific;
            }
        }
    );
}


export type ParameterLike = Parameter | string;


class ScopeSpecificClass extends Specific {}
const ScopeSpecific = AsProxy(ScopeSpecificClass);
export {ScopeSpecific};