import {Specific, AsProxy} from '../base/specifics';

// TODO: Implement extending specififcs, for example PreciseSorting satisfies LooseSorting condition

class LooseSorting extends Specific {
    constructor(sortBy: string) {
        super();
    }
}
export default AsProxy(LooseSorting);