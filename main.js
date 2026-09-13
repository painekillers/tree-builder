import World from "./world.js"
import Camera from "./camera.js"

import {test} from "./objects.js"

import {Node, Graph, LayoutNode, LayoutGraph, DrawNode, DrawConnection, DrawGraph} from "./graph.js"

const canvas = document.createElement("canvas")

document.body.appendChild(canvas)

const world = new World(canvas)
const cam = new Camera(world)

world.camera = cam

world.resize(window.innerWidth, window.innerHeight)

window.addEventListener("resize", () => {
    world.resize(window.innerWidth, window.innerHeight)
})

world.addObject(new test(world, 0, 0, 50, 100))

//test !!!!!!!!

// --------------------
// GRAPH
// --------------------

const nodes = [
    new Node("A", [], ["B"], "A"),
    new Node("B", ["A"], ["C", "D"], "B"),
    new Node("C", ["B"], [], "C"),
    new Node("D", ["B"], ["E"], "D"),
    new Node("E", ["D"], [], "E"),
]

const graph = new Graph(nodes)

console.log("========== GRAPH ==========")

for (const node of graph.nodes.values()) {
    console.log(
        node.id,
        "parents:",
        node.parents.map(n => n.id),
        "children:",
        node.children.map(n => n.id)
    )
}


// --------------------
// LAYOUT GRAPH
// --------------------

const layout = new LayoutGraph(graph, "A")

console.log("\n========== LAYOUT ==========")

for (const [layer, nodes] of layout.layers) {
    console.log(`Layer ${layer}`)

    for (const [ind, node] of nodes.entries()) {
        console.log(
            `[${ind}]`,
            node.node.id,
            "connections:",
            node.connected
        )
    }
}


// --------------------
// DRAW GRAPH
// --------------------

const drawGraph = new DrawGraph(
    layout,
    80,     // node width
    50,     // node height
    100,    // layer spacing
    50      // node spacing
)

console.log("\n========== DRAW GRAPH ==========")

console.log("\nNODES")

for (const node of drawGraph.nodes) {
    console.log(
        node.layoutNode.node.id,
        `x=${node.x}`,
        `y=${node.y}`,
        `size=${node.width}x${node.height}`
    )
}

console.log("\nCONNECTIONS")

for (const connection of drawGraph.connections) {
    console.log(
        connection.fromNode.layoutNode.node.id,
        "->",
        connection.toNode.layoutNode.node.id
    )
}