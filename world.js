class World {
    #canvas

    #camera

    updateRate = 1/60

    #needUpdate = false
    #debounce = false

    #objects = []

    constructor(canvas) {
        this.#canvas = canvas
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

        // $ do stuff

        setTimeout(() => {
            this.#debounce = false
            if (this.#needUpdate) {this.update()}
        }, this.updateRate)
    }
}

const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");

export default new World(ctx)