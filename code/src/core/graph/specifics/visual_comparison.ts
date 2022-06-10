import {Specific, AsProxy, ParameterLike} from '../base/specifics';

class VisualComparison extends Specific {
    constructor(comparisonTarget: ParameterLike) {
        super();
    }
}
export default AsProxy(VisualComparison);