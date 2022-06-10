import { GraphNode } from "./nodes";
import { Specific } from "./specifics";
import { definedViews } from "./views";

export default function buildDefaultGraph() {
    return buildGraph(definedViews, GraphNode.list);
}

function buildGraph(requirements: Specific[], providers: GraphNode[]) {
    for (const provider of providers) {
        console.log(provider.matches(requirements));
    }
}