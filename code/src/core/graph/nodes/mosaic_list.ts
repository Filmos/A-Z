import {GraphNodeDefinition, Parameter} from '../base/nodes';
import ListDisplay from '../specifics/list_display';
import LooseSorting from '../specifics/loose_sorting';
import VisualComparison from '../specifics/visual_comparison';
import DiamondShape from '../specifics/diamond_shape';

const dataKey = new Parameter();
const dataField = new Parameter();

new GraphNodeDefinition(
    ListDisplay(dataKey)
        .with(LooseSorting(dataField))
        .with(VisualComparison(dataField)),
    DiamondShape()
)