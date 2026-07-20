import World from "./world.js"
import Camera from "./camera.js"

import {test} from "./objects.js"

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