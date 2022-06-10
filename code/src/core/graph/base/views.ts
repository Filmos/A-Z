import {Specific, ScopeSpecific} from './specifics';

export const definedViews: Specific[] = [];
export function AddView(...view: Specific[]): void {
    const scope = ScopeSpecific();
    for (const specific of view) {
        scope.with(specific);
    }
    definedViews.push(scope);
}