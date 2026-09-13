export class Node {
    constructor(id, pa, ch, val){
        this.id = id
        this.pa = pa
        this.ch = ch
        this.val = val

        this.parents = []
        this.children = []
    }
}

export class Graph {
    constructor(nodes){
        this.nodes = new Map(nodes.map(n => [n.id, n]))

        // resolve parent and child references
        for (const node of this.nodes.values()) {
            const parentIds = node.pa;
            const childIds = node.ch;

            // node says X is its parent
            for (const parentId of parentIds) {
                const parent = this.nodeFromId(parentId);

                if (!node.parents.includes(parent)) {
                node.parents.push(parent);
                }

                if (!parent.children.includes(node)) {
                parent.children.push(node);
                }
            }

            // node says X is its child
            for (const childId of childIds) {
                const child = this.nodeFromId(childId);

                if (!node.children.includes(child)) {
                node.children.push(child);
                }

                if (!child.parents.includes(node)) {
                child.parents.push(node);
                }
            }
        }
    }

    nodeFromId(id) {
        return this.nodes.get(id)
    }

}

export class LayoutNode {
    constructor(node) {
        this.node = node
        this.connected = []
    }

    addConnection(c){
        this.connected.push(c)
    }
}

export class LayoutGraph {
    constructor(graph, root) {
        this.layers = new Map()

        const rootNode = graph.nodeFromId(root)
        const visited = new Map()

        const traverse = (node, layer) => {
            if (visited.has(node)) {
                return
            }
            
            if (!this.layers.has(layer)) {
                this.layers.set(layer, [])
            }
            
            const ln = new LayoutNode(node)
            
            this.layers.get(layer).push(ln)
            
            visited.set(node, {layer, ind: this.layers.get(layer).length - 1})

            for (const child of node.children) {
                traverse(child, layer + 1)

                ln.addConnection(visited.get(child))
            }

            for (const parent of node.parents) {
                traverse(parent, layer - 1)

                ln.addConnection(visited.get(parent))
            }
        }
        traverse(rootNode, 0)
    }
}

export class DrawNode {
    constructor(layoutNode, x, y, width, height) {
        this.layoutNode = layoutNode
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}

export class DrawConnection {
    constructor(fromNode, toNode) {
        this.fromNode = fromNode
        this.toNode = toNode
    }
}

export class DrawGraph {
    constructor(layoutGraph, nodeWidth, nodeHeight, layerSpacing, nodeSpacing) {
        this.nodes = []
        this.connections = []

        const layers = Array.from(layoutGraph.layers.entries()).sort((a, b) => a[0] - b[0])

        let y = 0
        for (const [layerIndex, layerNodes] of layers) {
            let x = 0
            for (const layoutNode of layerNodes) {
                const drawNode = new DrawNode(layoutNode, x, y, nodeWidth, nodeHeight)
                this.nodes.push(drawNode)

                x += nodeWidth + nodeSpacing
            }
            y += nodeHeight + layerSpacing
        }

        for (const drawNode of this.nodes) {
            for (const connection of drawNode.layoutNode.connected) {
                const toDrawNode = this.nodes.find(n => n.layoutNode === layoutGraph.layers.get(connection.layer)[connection.ind])
                if (toDrawNode) {
                    this.connections.push(new DrawConnection(drawNode, toDrawNode))
                }
            }
        }
    }
}