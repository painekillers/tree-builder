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
    <text x="100" y="105"
        text-anchor="middle"
        font-family="sans-serif"
        font-size="20"
        fill="#b0b0b5">
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

    draw(ctx, p, s){
        let pos = p || this.pos
        let size = s || this.size

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

    draw(ctx) {
        ctx.save()

        ctx.lineCap = "round"

        // Soft edge and shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.12)"
        ctx.shadowBlur = 4
        ctx.shadowOffsetY = 1

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
        ctx.strokeStyle = "#999"
        ctx.stroke()

        ctx.restore()
    }
}

export class NodeInstance extends ImageInstance {
    #node
    #hovered = false
    #scale = 1
    #animation = null

    constructor(world, x, y, width, height, node, image) {
        super(world, x, y, width, height)

        this.#node = node
        this.image = image
    }

    #animate() {
        if(this.#animation) return

        const target = this.#hovered ? 1.04 : 1

        const animate = () => {
            const difference = target - this.#scale

            if(Math.abs(difference) < 0.001) {
                this.#scale = target
                this.#animation = null
                this.world.update()
                return
            }

            this.#scale += difference * 0.18

            this.world.update()

            this.#animation = requestAnimationFrame(animate)
        }

        this.#animation = requestAnimationFrame(animate)
    }

    draw(ctx) {
        let pos = this.pos
        let size = this.size

        let width = size.width * this.#scale
        let height = size.height * this.#scale

        let x = pos.x - width / 2
        let y = pos.y - height / 2

        let radius = 10

        ctx.save()

        // Soft depth
        ctx.shadowColor = "rgba(0, 0, 0, 0.14)"
        ctx.shadowBlur = this.#hovered ? 16 : 8
        ctx.shadowOffsetY = this.#hovered ? 4 : 2

        // Surface
        ctx.fillStyle = "#f8f8f8"

        ctx.beginPath()
        ctx.roundRect(
            x,
            y,
            width,
            height,
            radius
        )
        ctx.fill()

        ctx.shadowColor = "transparent"

        // Image
        ctx.save()

        ctx.beginPath()
        ctx.roundRect(
            x,
            y,
            width,
            height,
            radius
        )
        ctx.clip()

        ctx.globalAlpha = this.#hovered ? 1 : 0.92

        super.draw(ctx)

        ctx.restore()

        // Subtle edge
        ctx.beginPath()
        ctx.roundRect(
            x,
            y,
            width,
            height,
            radius
        )

        ctx.lineWidth = 1
        ctx.strokeStyle = "rgba(0, 0, 0, 0.08)"
        ctx.stroke()

        ctx.restore()
    }

    mouseEnter() {
        this.#hovered = true
        this.#animate()
    }

    mouseLeave() {
        this.#hovered = false
        this.#animate()
    }

    click() {
        console.log("clicked node:", this.#node.val)
    }
}