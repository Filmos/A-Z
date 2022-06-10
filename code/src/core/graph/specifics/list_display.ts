import {Specific, AsProxy, ParameterLike} from '../base/specifics';

class ListDisplay extends Specific {
    constructor(dataTarget: ParameterLike) {
        super();
    }
}
export default AsProxy(ListDisplay);