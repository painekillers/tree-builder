import World from "./world.js"
import Camera from "./camera.js"

import {
    Node,
    Graph,
    LayoutGraph,
    DrawGraph
} from "./graph.js"

import {
    test,
    Line
} from "./objects.js"


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
    new Node("A", [], ["B", "C", "D"], "A"),

    // Layer 1
    new Node("B", ["A"], ["E", "F", "G"], "B"),
    new Node("C", ["A"], ["H", "I", "J", "K"], "C"),
    new Node("D", ["A"], ["L", "M", "N"], "D"),

    // Layer 2
    new Node("E", ["B"], ["O", "P", "Q"], "E"),
    new Node("F", ["B"], ["R", "S"], "F"),
    new Node("G", ["B"], ["T", "U", "V"], "G"),

    new Node("H", ["C"], ["W", "X"], "H"),
    new Node("I", ["C"], ["Y", "Z", "AA"], "I"),
    new Node("J", ["C"], ["AB", "AC"], "J"),
    new Node("K", ["C"], ["AD", "AE", "AF"], "K"),

    new Node("L", ["D"], ["AG", "AH"], "L"),
    new Node("M", ["D"], ["AI", "AJ", "AK"], "M"),
    new Node("N", ["D"], ["AL", "AM"], "N"),

    // Layer 3
    new Node("O", ["E"], ["AN", "AO"], "O"),
    new Node("P", ["E"], ["AP", "AQ", "AR"], "P"),
    new Node("Q", ["E"], ["AS", "AT"], "Q"),

    new Node("R", ["F"], ["AU", "AV", "AW"], "R"),
    new Node("S", ["F"], ["AX", "AY"], "S"),

    new Node("T", ["G"], ["AZ", "BA"], "T"),
    new Node("U", ["G"], ["BB", "BC", "BD"], "U"),
    new Node("V", ["G"], ["BE", "BF"], "V"),

    new Node("W", ["H"], ["BG", "BH"], "W"),
    new Node("X", ["H"], ["BI", "BJ", "BK"], "X"),

    new Node("Y", ["I"], ["BL", "BM"], "Y"),
    new Node("Z", ["I"], ["BN", "BO", "BP"], "Z"),
    new Node("AA", ["I"], ["BQ", "BR"], "AA"),

    new Node("AB", ["J"], ["BS", "BT"], "AB"),
    new Node("AC", ["J"], ["BU", "BV", "BW"], "AC"),

    new Node("AD", ["K"], ["BX", "BY"], "AD"),
    new Node("AE", ["K"], ["BZ", "CA", "CB"], "AE"),
    new Node("AF", ["K"], ["CC", "CD"], "AF"),

    new Node("AG", ["L"], ["CE", "CF"], "AG"),
    new Node("AH", ["L"], ["CG", "CH", "CI"], "AH"),

    new Node("AI", ["M"], ["CJ", "CK"], "AI"),
    new Node("AJ", ["M"], ["CL", "CM", "CN"], "AJ"),
    new Node("AK", ["M"], ["CO", "CP"], "AK"),

    new Node("AL", ["N"], ["CQ", "CR"], "AL"),
    new Node("AM", ["N"], ["CS", "CT", "CU"], "AM"),

    // Layer 4
    new Node("AN", ["O"], ["CV", "CW", "CX"], "AN"),
    new Node("AO", ["O"], ["CY", "CZ"], "AO"),

    new Node("AP", ["P"], ["DA", "DB"], "AP"),
    new Node("AQ", ["P"], ["DC", "DD", "DE"], "AQ"),
    new Node("AR", ["P"], ["DF", "DG"], "AR"),

    new Node("AS", ["Q"], ["DH", "DI"], "AS"),
    new Node("AT", ["Q"], ["DJ", "DK", "DL"], "AT"),

    new Node("AU", ["R"], ["DM", "DN"], "AU"),
    new Node("AV", ["R"], ["DO", "DP", "DQ"], "AV"),
    new Node("AW", ["R"], ["DR", "DS"], "AW"),

    new Node("AX", ["S"], ["DT", "DU"], "AX"),
    new Node("AY", ["S"], ["DV", "DW", "DX"], "AY"),

    new Node("AZ", ["T"], ["DY", "DZ"], "AZ"),
    new Node("BA", ["T"], ["EA", "EB", "EC"], "BA"),

    new Node("BB", ["U"], ["ED", "EE"], "BB"),
    new Node("BC", ["U"], ["EF", "EG", "EH"], "BC"),
    new Node("BD", ["U"], ["EI", "EJ"], "BD"),

    new Node("BE", ["V"], ["EK", "EL"], "BE"),
    new Node("BF", ["V"], ["EM", "EN", "EO"], "BF"),

    new Node("BG", ["W"], ["EP", "EQ"], "BG"),
    new Node("BH", ["W"], ["ER", "ES", "ET"], "BH"),

    new Node("BI", ["X"], ["EU", "EV"], "BI"),
    new Node("BJ", ["X"], ["EW", "EX", "EY"], "BJ"),
    new Node("BK", ["X"], ["EZ", "FA"], "BK"),

    new Node("BL", ["Y"], ["FB", "FC"], "BL"),
    new Node("BM", ["Y"], ["FD", "FE", "FF"], "BM"),

    new Node("BN", ["Z"], ["FG", "FH"], "BN"),
    new Node("BO", ["Z"], ["FI", "FJ", "FK"], "BO"),
    new Node("BP", ["Z"], ["FL", "FM"], "BP"),

    new Node("BQ", ["AA"], ["FN", "FO"], "BQ"),
    new Node("BR", ["AA"], ["FP", "FQ", "FR"], "BR"),

    new Node("BS", ["AB"], ["FS", "FT"], "BS"),
    new Node("BT", ["AB"], ["FU", "FV", "FW"], "BT"),

    new Node("BU", ["AC"], ["FX", "FY"], "BU"),
    new Node("BV", ["AC"], ["FZ", "GA", "GB"], "BV"),
    new Node("BW", ["AC"], ["GC", "GD"], "BW"),

    new Node("BX", ["AD"], ["GE", "GF"], "BX"),
    new Node("BY", ["AD"], ["GG", "GH", "GI"], "BY"),

    new Node("BZ", ["AE"], ["GJ", "GK"], "BZ"),
    new Node("CA", ["AE"], ["GL", "GM", "GN"], "CA"),
    new Node("CB", ["AE"], ["GO", "GP"], "CB"),

    new Node("CC", ["AF"], ["GQ", "GR"], "CC"),
    new Node("CD", ["AF"], ["GS", "GT", "GU"], "CD"),

    new Node("CE", ["AG"], ["GV", "GW"], "CE"),
    new Node("CF", ["AG"], ["GX", "GY", "GZ"], "CF"),

    new Node("CG", ["AH"], ["HA", "HB"], "CG"),
    new Node("CH", ["AH"], ["HC", "HD", "HE"], "CH"),
    new Node("CI", ["AH"], ["HF", "HG"], "CI"),

    new Node("CJ", ["AI"], ["HH", "HI"], "CJ"),
    new Node("CK", ["AI"], ["HJ", "HK", "HL"], "CK"),

    new Node("CL", ["AJ"], ["HM", "HN"], "CL"),
    new Node("CM", ["AJ"], ["HO", "HP", "HQ"], "CM"),
    new Node("CN", ["AJ"], ["HR", "HS"], "CN"),

    new Node("CO", ["AK"], ["HT", "HU"], "CO"),
    new Node("CP", ["AK"], ["HV", "HW", "HX"], "CP"),

    new Node("CQ", ["AL"], ["HY", "HZ"], "CQ"),
    new Node("CR", ["AL"], ["IA", "IB", "IC"], "CR"),

    new Node("CS", ["AM"], ["ID", "IE"], "CS"),
    new Node("CT", ["AM"], ["IF", "IG", "IH"], "CT"),
    new Node("CU", ["AM"], ["II", "IJ"], "CU"),

    // Layer 5
    new Node("CV", ["AN"], [], "CV"),
    new Node("CW", ["AN"], [], "CW"),
    new Node("CX", ["AN"], [], "CX"),

    new Node("CY", ["AO"], [], "CY"),
    new Node("CZ", ["AO"], [], "CZ"),

    new Node("DA", ["AP"], [], "DA"),
    new Node("DB", ["AP"], [], "DB"),

    new Node("DC", ["AQ"], [], "DC"),
    new Node("DD", ["AQ"], [], "DD"),
    new Node("DE", ["AQ"], [], "DE"),

    new Node("DF", ["AR"], [], "DF"),
    new Node("DG", ["AR"], [], "DG"),

    new Node("DH", ["AS"], [], "DH"),
    new Node("DI", ["AS"], [], "DI"),

    new Node("DJ", ["AT"], [], "DJ"),
    new Node("DK", ["AT"], [], "DK"),
    new Node("DL", ["AT"], [], "DL"),

    new Node("DM", ["AU"], [], "DM"),
    new Node("DN", ["AU"], [], "DN"),

    new Node("DO", ["AV"], [], "DO"),
    new Node("DP", ["AV"], [], "DP"),
    new Node("DQ", ["AV"], [], "DQ"),

    new Node("DR", ["AW"], [], "DR"),
    new Node("DS", ["AW"], [], "DS"),

    new Node("DT", ["AX"], [], "DT"),
    new Node("DU", ["AX"], [], "DU"),

    new Node("DV", ["AY"], [], "DV"),
    new Node("DW", ["AY"], [], "DW"),
    new Node("DX", ["AY"], [], "DX"),

    new Node("DY", ["AZ"], [], "DY"),
    new Node("DZ", ["AZ"], [], "DZ"),

    new Node("EA", ["BA"], [], "EA"),
    new Node("EB", ["BA"], [], "EB"),
    new Node("EC", ["BA"], [], "EC"),

    new Node("ED", ["BB"], [], "ED"),
    new Node("EE", ["BB"], [], "EE"),

    new Node("EF", ["BC"], [], "EF"),
    new Node("EG", ["BC"], [], "EG"),
    new Node("EH", ["BC"], [], "EH"),

    new Node("EI", ["BD"], [], "EI"),
    new Node("EJ", ["BD"], [], "EJ"),

    new Node("EK", ["BE"], [], "EK"),
    new Node("EL", ["BE"], [], "EL"),

    new Node("EM", ["BF"], [], "EM"),
    new Node("EN", ["BF"], [], "EN"),
    new Node("EO", ["BF"], [], "EO"),

    new Node("EP", ["BG"], [], "EP"),
    new Node("EQ", ["BG"], [], "EQ"),

    new Node("ER", ["BH"], [], "ER"),
    new Node("ES", ["BH"], [], "ES"),
    new Node("ET", ["BH"], [], "ET"),

    new Node("EU", ["BI"], [], "EU"),
    new Node("EV", ["BI"], [], "EV"),

    new Node("EW", ["BJ"], [], "EW"),
    new Node("EX", ["BJ"], [], "EX"),
    new Node("EY", ["BJ"], [], "EY"),

    new Node("EZ", ["BK"], [], "EZ"),
    new Node("FA", ["BK"], [], "FA"),

    new Node("FB", ["BL"], [], "FB"),
    new Node("FC", ["BL"], [], "FC"),

    new Node("FD", ["BM"], [], "FD"),
    new Node("FE", ["BM"], [], "FE"),
    new Node("FF", ["BM"], [], "FF"),

    new Node("FG", ["BN"], [], "FG"),
    new Node("FH", ["BN"], [], "FH"),

    new Node("FI", ["BO"], [], "FI"),
    new Node("FJ", ["BO"], [], "FJ"),
    new Node("FK", ["BO"], [], "FK"),

    new Node("FL", ["BP"], [], "FL"),
    new Node("FM", ["BP"], [], "FM"),

    new Node("FN", ["BQ"], [], "FN"),
    new Node("FO", ["BQ"], [], "FO"),

    new Node("FP", ["BR"], [], "FP"),
    new Node("FQ", ["BR"], [], "FQ"),
    new Node("FR", ["BR"], [], "FR"),

    new Node("FS", ["BS"], [], "FS"),
    new Node("FT", ["BS"], [], "FT"),

    new Node("FU", ["BT"], [], "FU"),
    new Node("FV", ["BT"], [], "FV"),
    new Node("FW", ["BT"], [], "FW"),

    new Node("FX", ["BU"], [], "FX"),
    new Node("FY", ["BU"], [], "FY"),

    new Node("FZ", ["BV"], [], "FZ"),
    new Node("GA", ["BV"], [], "GA"),
    new Node("GB", ["BV"], [], "GB"),

    new Node("GC", ["BW"], [], "GC"),
    new Node("GD", ["BW"], [], "GD"),

    new Node("GE", ["BX"], [], "GE"),
    new Node("GF", ["BX"], [], "GF"),

    new Node("GG", ["BY"], [], "GG"),
    new Node("GH", ["BY"], [], "GH"),
    new Node("GI", ["BY"], [], "GI"),

    new Node("GJ", ["BZ"], [], "GJ"),
    new Node("GK", ["BZ"], [], "GK"),

    new Node("GL", ["CA"], [], "GL"),
    new Node("GM", ["CA"], [], "GM"),
    new Node("GN", ["CA"], [], "GN"),

    new Node("GO", ["CB"], [], "GO"),
    new Node("GP", ["CB"], [], "GP"),

    new Node("GQ", ["CC"], [], "GQ"),
    new Node("GR", ["CC"], [], "GR"),

    new Node("GS", ["CD"], [], "GS"),
    new Node("GT", ["CD"], [], "GT"),
    new Node("GU", ["CD"], [], "GU"),

    new Node("GV", ["CE"], [], "GV"),
    new Node("GW", ["CE"], [], "GW"),

    new Node("GX", ["CF"], [], "GX"),
    new Node("GY", ["CF"], [], "GY"),
    new Node("GZ", ["CF"], [], "GZ"),

    new Node("HA", ["CG"], [], "HA"),
    new Node("HB", ["CG"], [], "HB"),

    new Node("HC", ["CH"], [], "HC"),
    new Node("HD", ["CH"], [], "HD"),
    new Node("HE", ["CH"], [], "HE"),

    new Node("HF", ["CI"], [], "HF"),
    new Node("HG", ["CI"], [], "HG"),

    new Node("HH", ["CJ"], [], "HH"),
    new Node("HI", ["CJ"], [], "HI"),

    new Node("HJ", ["CK"], [], "HJ"),
    new Node("HK", ["CK"], [], "HK"),
    new Node("HL", ["CK"], [], "HL"),

    new Node("HM", ["CL"], [], "HM"),
    new Node("HN", ["CL"], [], "HN"),

    new Node("HO", ["CM"], [], "HO"),
    new Node("HP", ["CM"], [], "HP"),
    new Node("HQ", ["CM"], [], "HQ"),

    new Node("HR", ["CN"], [], "HR"),
    new Node("HS", ["CN"], [], "HS"),

    new Node("HT", ["CO"], [], "HT"),
    new Node("HU", ["CO"], [], "HU"),

    new Node("HV", ["CP"], [], "HV"),
    new Node("HW", ["CP"], [], "HW"),
    new Node("HX", ["CP"], [], "HX"),

    new Node("HY", ["CQ"], [], "HY"),
    new Node("HZ", ["CQ"], [], "HZ"),

    new Node("IA", ["CR"], [], "IA"),
    new Node("IB", ["CR"], [], "IB"),
    new Node("IC", ["CR"], [], "IC"),

    new Node("ID", ["CS"], [], "ID"),
    new Node("IE", ["CS"], [], "IE"),

    new Node("IF", ["CT"], [], "IF"),
    new Node("IG", ["CT"], [], "IG"),
    new Node("IH", ["CT"], [], "IH"),

    new Node("II", ["CU"], [], "II"),
    new Node("IJ", ["CU"], [], "IJ")
]

const graph = new Graph(nodes)

const layout = new LayoutGraph(
    graph,
    "A"
)

const drawGraph = new DrawGraph(
    layout,
    80,     // node width
    50,     // node height
    100,    // layer spacing
    50      // node spacing
)


// --------------------
// ADD GRAPH TO WORLD
// --------------------

// Add edges first so nodes render on top
for (const connection of drawGraph.connections) {
    world.addObject(
        new Line(
            world,
            {
                x: connection.fromNode.x,
                y: connection.fromNode.y
            },
            {
                x: connection.toNode.x,
                y: connection.toNode.y
            },
            3
        )
    )
}


// Add nodes
for (const drawNode of drawGraph.nodes) {
    world.addObject(
        new test(
            world,
            drawNode.x,
            drawNode.y,
            drawNode.width,
            drawNode.height,
            drawNode.layoutNode.node.id
        )
    )
}


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