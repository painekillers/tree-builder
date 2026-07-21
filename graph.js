class Node {
    #id 

    #children = []
    #parents = []

    constructor(id, ch, pa){
        this.#id = id
        this.#children = ch
        this.#parents = pa
    }
}

class Graph {
    #nodes = new Map()

    
}