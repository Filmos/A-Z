import {ScopeSpecific, Specific} from './specifics';

export class Parameter {
    constructor() {
        
    }
}

export class GraphNode {
    static list: GraphNode[] = [];

    private provides: Specific;
    constructor(...provides: Specific[]) {
        this.provides = ScopeSpecific();
        for (const specific of provides) {
            this.provides.with(specific);
        }
        GraphNode.list.push(this);
    }

    // TODO: add logic for parameter matching
    matches(requirements: Specific[]): boolean {
        for (const requirement of requirements) {
            if (!requirement.matches(this.provides)) {
                return false;
            }
        }
        return true;
    }
}