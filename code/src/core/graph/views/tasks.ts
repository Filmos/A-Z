import {AddView} from '../base/views';
import ListDisplay from '../specifics/list_display';
import LooseSorting from '../specifics/loose_sorting';
import VisualComparison from '../specifics/visual_comparison';
// DataModel("tasks")
//     .add(Identifier("title", text))
//     .add(Field("deadline", date))
    
AddView(
    ListDisplay("tasks")
        .with(LooseSorting("deadline"))
        .with(VisualComparison("deadline"))
)

// TODO: clean up the code below
// let schema = {
//     "tasksView": {
//         'listDisplay': {'with': ['looseSorting', 'visualComparison', 'removeElement']},
//     }
// }