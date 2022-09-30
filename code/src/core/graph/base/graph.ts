import { GraphNodeDefinition } from "./nodes";
import { Specific } from "./specifics";
import { definedViews } from "./views";

export default function buildDefaultGraph() {
    return buildGraph(definedViews, GraphNodeDefinition.list);
}

function buildGraph(requirements: Specific[], providers: GraphNodeDefinition[]) {
    for (const provider of providers) {
        console.log(provider.matches(requirements));
    }
}