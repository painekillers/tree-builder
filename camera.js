export default class Camera {
    #world

    #x = 0
    #y = 0
    #zoom = 1

    constructor(world) {
        this.#world = world
    }

    set x(val) {
        this.#x = val
        this.#world.update()
    }

    set y(val) {
        this.#y = val
        this.#world.update()
    }

    set zoom(val) {
        this.#zoom = val
        this.#world.update()
    }

    get x(){
        return this.#x
    }
    
    get y(){
        return this.#y
    }
    
    get zoom(){
        return this.#zoom
    }
    
}