export default class World {
    /** @type {HTMLCanvasElement} */
    #canvas
    #ctx

    #camera

    updateRate = 1/60

    #needUpdate = false
    #debounce = false

    #objects = []

    constructor(canvas) {
        this.#canvas = canvas
        this.#ctx = canvas.getContext("2d")
    }

    set camera(cam) {
        this.#camera = cam
        this.update()
    }

    addObject(obj) {
        let index = this.#objects.findIndex(e => e.z > obj.z);// $ is dis slow

        if (index === -1) {
            this.#objects.push(obj);
        } else {
            this.#objects.splice(index, 0, obj);
        }

        this.update()
    }

    removeObject(obj) {
         const index = this.#objects.indexOf(obj); // $ is dis slow

        if (index !== -1) {
            this.#objects[index] = this.#objects[this.#objects.length - 1];
            this.#objects.pop();
        }

        this.update()
    }

    clear() {
        this.#objects = []

        this.update()
    }

    get objects() {
        return this.#objects
    }

    update() {
        if (this.#debounce) {
            this.#needUpdate = true
            return
        }
        this.#debounce = true
        this.#needUpdate = false

        //Update Logic
        this.#ctx.restore()
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
        
        let cpos = this.#camera.pos
        this.#ctx.translate(this.#canvas.width / 2, this.#canvas.height / 2)
        this.#ctx.scale(this.#camera.zoom, this.#camera.zoom);
        this.#ctx.translate(-cpos.x, -cpos.y);

        this.#objects.forEach(e => e.draw(this.#ctx))

        //Update Logic Ends
        setTimeout(() => {
            this.#debounce = false
            if (this.#needUpdate) {this.update()}
        }, this.updateRate)
    }

    resize(width, height) {
        this.#canvas.width = width
        this.#canvas.height = height

        this.#camera.viewport = [width, height]
    }
}
