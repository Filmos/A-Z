import {Specific, AsProxy} from '../base/specifics';

class ListDisplay extends Specific {
    constructor(dataTarget: string) {
        super();
    }

    public with(specific: Specific): ListDisplay {
        return this;
    }
    public childWith(specific: Specific): ListDisplay {
        return this;
    }
}
export default AsProxy(ListDisplay);