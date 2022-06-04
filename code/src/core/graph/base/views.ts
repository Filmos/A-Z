import {Specific} from './specifics';

const views: Specific[] = [];
export function AddView(view: Specific) {
    views.push(view);
}