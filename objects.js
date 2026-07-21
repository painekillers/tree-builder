class Object{
    #world

    constructor(world){
        this.#world = world
    }

    get world(){
        return this.#world
    }
}

class PSInstance extends Object { //Position Size
    #x
    #y

    #width
    #height

    constructor(world, x, y, width, height){
        super(world)
        this.#x = x
        this.#y = y
        this.#width = width
        this.#height = height
    }

    set pos(p){
        this.#x = p[0]
        this.#y = p[1]
        this.world.update()
    }

    set size(s){
        this.#width = p[0]
        this.#height = p[1]
        this.world.update()
    }

    get pos(){
        return {
            x: this.#x,
            y: this.#y
        }
    }

    get size(){
        return {
            width: this.#width,
            height: this.#height
        }
    }
}

export class test extends PSInstance {
    draw(ctx){
        let pos = this.pos
        let size = this.size

        ctx.fillStyle = "red"
        ctx.fillRect(
            pos.x - size.width / 2,
            pos.y - size.height / 2,
            size.width,
            size.height
        )
    }
}

export class Image extends PSInstance {
    #image

    set image(img){
        this.#image = img
        this.world.update()
    }

    draw(ctx){
        let pos = this.pos
        let size = this.size

        ctx.drawImage(
            this.#image,
            pos.x - size.width / 2,
            pos.y - size.height / 2,
            size.width,
            size.height
        )
    }
}

export class TileMap extends Image{
    #u
    #v

    set uv(uv){
        this.#u = uv[0]
        this.#v = uv[1]
        this.world.update()
    }

    draw(ctx){
        let pos = this.pos
        let size = this.size

        ctx.drawImage(
            this.#image,
            pos.x - size.width / 2,
            pos.y - size.height / 2,
            size.width,
            size.height,
            this.#u,
            this.#v
        )
    }
}