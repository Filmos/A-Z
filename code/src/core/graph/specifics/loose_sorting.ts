import {Specific, AsProxy, ParameterLike} from '../base/specifics';

// TODO: Implement extending specififcs, for example PreciseSorting satisfies LooseSorting condition

class LooseSorting extends Specific {
    constructor(sortBy: ParameterLike) {
        super();
    }
}
export default AsProxy(LooseSorting);