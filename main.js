import World from "./world.js"
import Camera from "./camera.js"

import {
    Node,
    Graph
} from "./graph.js"

import Bridge from "./bridge.js"


const canvas = document.createElement("canvas")

document.body.appendChild(canvas)


const world = new World(canvas)

const cam = new Camera(world)

world.camera = cam

// expose camera to console
window.cam = cam


world.resize(
    window.innerWidth,
    window.innerHeight
)

window.addEventListener("resize", () => {
    world.resize(
        window.innerWidth,
        window.innerHeight
    )
})


// --------------------
// GRAPH
// --------------------

const nodes = [
    new Node("A", [], ["B", "C"], "A"),

    new Node("B", ["A"], ["D", "E"], "B"),
    new Node("C", ["A"], ["F", "G"], "C"),

    new Node("D", ["B"], ["H", "A"], "D"),
    new Node("E", ["B"], ["F", "I"], "E"),

    new Node("F", ["C", "E"], ["G", "J"], "F"),
    new Node("G", ["C", "F"], ["K"], "G"),

    new Node("H", ["D"], ["L"], "H"),
    new Node("I", ["E"], ["J"], "I"),

    new Node("J", ["F", "I"], ["K"], "J"),
    new Node("K", ["G", "J"], ["M"], "K"),

    new Node("L", ["H"], [], "L"),
    new Node("M", ["K"], ["A"], "M")
]

const graph = new Graph(nodes)

const bridge = new Bridge(
    graph,
    world
)


// --------------------
// BUILD GRAPH
// --------------------

bridge.calculateLayout(
    "A",
    false
)

bridge.calculateDraw(
    80,     // node width
    50,     // node height
    100,    // layer spacing
    50      // node spacing
)

bridge.createObjects(10)


// --------------------
// CAMERA CONTROLS
// --------------------

let dragging = false

let lastX = 0
let lastY = 0


// Pan

canvas.addEventListener("mousedown", e => {
    if (e.button !== 0) return

    dragging = true

    lastX = e.clientX
    lastY = e.clientY
})


canvas.addEventListener("mouseup", () => {
    dragging = false
})


canvas.addEventListener("mouseleave", () => {
    dragging = false
})


canvas.addEventListener("mousemove", e => {
    if (!dragging) return

    const dx = e.clientX - lastX
    const dy = e.clientY - lastY

    lastX = e.clientX
    lastY = e.clientY

    const pos = cam.pos

    cam.pos = [
        pos.x - dx / cam.zoom,
        pos.y - dy / cam.zoom
    ]
})


// Zoom toward mouse

canvas.addEventListener("wheel", e => {
    e.preventDefault()

    const rect = canvas.getBoundingClientRect()

    const mouseX =
        e.clientX - rect.left - canvas.width / 2

    const mouseY =
        e.clientY - rect.top - canvas.height / 2

    const oldZoom = cam.zoom

    const pos = cam.pos

    // World position currently underneath mouse
    const worldX = pos.x + mouseX / oldZoom
    const worldY = pos.y + mouseY / oldZoom

    const zoomSpeed = 0.001

    let newZoom =
        oldZoom * (1 - e.deltaY * zoomSpeed)

    newZoom = Math.max(
        0.1,
        Math.min(newZoom, 5)
    )

    cam.zoom = newZoom

    // Keep the same world point underneath the mouse
    cam.pos = [
        worldX - mouseX / newZoom,
        worldY - mouseY / newZoom
    ]
}, { passive: false })