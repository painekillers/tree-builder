import Viewer from "../viewer/viewer.js"
import { ThemeContainer } from "../viewer/theme.js"
import { Graph } from "../core/graph.js"

import nodes from "./nodes.js"

const themes = new ThemeContainer()

await themes.load(
    "Dark",
    "../core/themes/dark.js"
)

const viewer = new Viewer(
    document.getElementById("tree"),
    themes
)

viewer.graph = new Graph(nodes)

viewer.setRoot("A")
viewer.setSize(50, 50, 100, 50)
viewer.draw()

viewer.enable()