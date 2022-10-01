import { defineComponent } from 'vue';
import DataBind from './databind';
export default function AZComponent(component) {
    let overload = {
        inject: ["bind"],
        props: ["bindTo"],
        provide() {
            if(this.bindTo !== undefined) 
                this.bind = new DataBind(this.bindTo);
            return {
                bind: this.bind
            };
        }
    }

    return defineComponent(mergeComponents(component, overload))
}

function mergeComponents(source, overload) {
    if(overload === undefined) return source
    if(source === undefined) return overload

    if(Array.isArray(source) && Array.isArray(overload))
        return source.concat(overload)
    if(typeof overload === 'function' && typeof source === 'function') {
        return function() {
            let overloadResult = overload.apply(this, arguments);
            let sourceResult = source.apply(this, arguments);
            return mergeComponents(sourceResult, overloadResult);
        }
    }

    for (let key in overload)
        source[key] = mergeComponents(source[key], overload[key]);
    return source
}