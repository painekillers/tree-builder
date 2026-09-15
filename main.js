import "./setup.js"

window.bridge.calculateLayout(
    "A",
    false
)

window.bridge.calculateDraw(
    50,     // node width
    50,     // node height
    100,    // layer spacing
    50      // node spacing
)

window.bridge.createObjects(10)