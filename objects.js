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
        this.#width = s[0]
        this.#height = s[1]
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
    #value

    constructor(world, x, y, width, height, value) {
        super(world, x, y, width, height)
        this.#value = value
    }

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

        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = "16px sans-serif"
        ctx.fillText(
            this.#value,
            pos.x,
            pos.y
        )
    }
}

const placeholder = new Image()

placeholder.src = "data:image/svg+xml," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <rect width="200" height="200" fill="#ddd"/>
    <text x="100" y="105"
        text-anchor="middle"
        font-family="sans-serif"
        font-size="20">
        No Image
    </text>
</svg>
`)

export class ImageInstance extends PSInstance {
    #image

    set image(img){
        this.#image = img
        this.world.update()
    }

    get image(){
        return this.#image
    }

    draw(ctx){
        let pos = this.pos
        let size = this.size

        ctx.drawImage(
            this.#image ?? placeholder,
            pos.x - size.width / 2,
            pos.y - size.height / 2,
            size.width,
            size.height
        )
    }
}

export class Line extends Object {
    #from
    #to
    #width

    constructor(world, from, to, width = 2) {
        super(world)

        this.#from = from
        this.#to = to
        this.#width = width
    }

    set from(p) {
        this.#from = p
        this.world.update()
    }

    set to(p) {
        this.#to = p
        this.world.update()
    }

    set width(val) {
        this.#width = val
        this.world.update()
    }

    get from() {
        return this.#from
    }

    get to() {
        return this.#to
    }

    get width() {
        return this.#width
    }

    draw(ctx) {
        ctx.beginPath()

        ctx.moveTo(
            this.#from.x,
            this.#from.y
        )

        ctx.lineTo(
            this.#to.x,
            this.#to.y
        )

        ctx.lineWidth = this.#width
        ctx.strokeStyle = "black"
        ctx.stroke()
    }
}

export class NodeInstance extends ImageInstance {
    #node
    #hovered = false

    constructor(world, x, y, width, height, node, image) {
        super(world, x, y, width, height)

        this.#node = node
        this.image = image
    }

    mouseEnter() {
        this.#hovered = true
        this.world.update()
    }

    mouseLeave() {
        this.#hovered = false
        this.world.update()
    }

    click() {
        console.log("clicked node:", this.#node.val)
    }
}