import { LayoutGraph, DrawGraph } from "./graph.js"
import { NodeInstance, Line } from "./objects.js"
import World from "./world.js"

export default class Bridge {
    constructor(graph, world) {
        this.graph = graph
        this.world = world

        this.layout = null
        this.draw = null
        this.obj = null
        this.toObj = null
        this.toNode = null
    }

    #cleanWorld() {
        if(this.obj) {
            this.world.bulkRemove(obj => this.obj.includes(obj))

            this.obj = null
            this.toObj = null
            this.toNode = null
        }
    }

    calculateLayout(root, recurse){ // Real maxdepth, since we cant actually make it infinite
        this.layout = new LayoutGraph(this.graph, root, recurse)
        // Since JS is goofy like this ill just have recurse be a number when we want recursive

        // Invalidate everything else
        this.draw = null
        this.#cleanWorld()
    }

    calculateDraw(width, height, padX, padY){
        if(!this.layout){
            console.warn("calculateLayout must be called prior to this")
            return
        }

        this.draw = new DrawGraph(this.layout, width, height, padX, padY)
        this.#cleanWorld()
    }

    createObjects(maxDepth){
        if(!this.draw){
            console.warn("calculateDraw must be called prior to this")
            return
        }

        this.obj = []
        this.toObj = new Map()
        this.toNode = new Map()

        // Add edges first so nodes render on top
        for (const connection of this.draw.connections) {
            if(Math.abs(connection.fromNode.layoutNode.layer) > maxDepth || Math.abs(connection.toNode.layoutNode.layer) > maxDepth){ continue }

            let obj = new Line(
                    this.world,
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

            this.obj.push(obj)
            this.world.addObject(obj)
        }
        
        
        // Add nodes
        for (const drawNode of this.draw.nodes) {
            if(Math.abs(drawNode.layoutNode.layer) > maxDepth){ continue }

            let obj = new NodeInstance(
                    this.world,
                    drawNode.x,
                    drawNode.y,
                    drawNode.width,
                    drawNode.height,
                    drawNode.layoutNode.node
                    //Remember to add the actual image here!!!
                )

            this.obj.push(obj)
            this.toNode.set(obj, drawNode.layoutNode.node)
            this.toObj.set(drawNode.layoutNode.node, obj)
            this.world.addObject(obj)
        }

    }
}