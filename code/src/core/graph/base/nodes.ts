import {ScopeSpecific, Specific} from './specifics';

export class Parameter {
    private static uid = 0;
    readonly uid = Parameter.uid++;
    constructor() {
        
    }
}

export class ParameterMapping {
    isValid: boolean = true;
    mapping: { [key: string]: string } = {};
    
    constructor(key?: string, value?: string) {
        if (key && value) {
            this.mapping[key] = value;
        }
    }
    setInvalid() {
        this.isValid = false;
        return this;
    }

    fits(key: string, value: string): boolean {
        return !!this.mapping[key] && this.mapping[key] !== value;
    }
    set(key: string, value: string) {
        if (this.fits(key, value)) {
            this.setInvalid();
        } else {
            this.mapping[key] = value;
        }
        return this;
    }
    clone(): ParameterMapping {
        const clone = new ParameterMapping();
        clone.mapping = {...this.mapping};
        return clone;
    }
    combine(other: ParameterMapping) {
        const clone = this.clone();
        if (!clone.isValid || !other.isValid) {
            clone.setInvalid();
            return clone;
        }
        for (const key in other.mapping) {
            clone.set(key, other.mapping[key]);
        }
        return clone;
    }
}
const InvalidParameterMapping = new ParameterMapping().setInvalid();
export {InvalidParameterMapping};




export class GraphNodeDefinition {
    static list: GraphNodeDefinition[] = [];

    private provides: Specific;
    constructor(...provides: Specific[]) {
        this.provides = ScopeSpecific();
        for (const specific of provides) {
            this.provides.with(specific);
        }
        GraphNodeDefinition.list.push(this);
    }

    getNode(): GraphNode {
        return new GraphNode(this);
    }

    // TODO: add logic for parameter matching
    matches(requirements: Specific[]): boolean {
        for (const requirement of requirements) {
            if (!requirement.getParameterMapping(this.provides, -1)) {
                return false;
            }
        }
        return true;
    }
}
export class GraphNode {
    private static uid = 0;
    readonly uid = GraphNode.uid++;
    private readonly definition: GraphNodeDefinition;
    constructor(definition: GraphNodeDefinition) {
        this.definition = definition;
    }
}