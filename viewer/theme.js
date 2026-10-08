const loadTheme = async path =>
    (await import(path)).default

const merge = (base, theme) => {
    const result = {...base}

    for (const [key, value] of Object.entries(theme)) {
        if (
            value &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            value.constructor === Object &&
            base[key]?.constructor === Object
        ) {
            result[key] = merge(
                base[key],
                value
            )
        } else {
            result[key] = value
        }
    }

    return result
}

const defaultTheme =
    await loadTheme("../core/themes/default.js")

export class ThemeContainer {
    #themes = {
        Default: defaultTheme
    }

    async load(name, path) {
        this.#themes[name] = merge(
            defaultTheme,
            await loadTheme(path)
        )
    }

    get(name) {
        return this.#themes[name]
    }

    get themes() {
        return this.#themes
    }
}

export class ThemeApplier {
    #container
    #shadow

    #current

    #defaultCSS
    #css

    #subscription = []

    constructor(container, shadow) {
        this.#container = container
        this.#shadow = shadow

        this.#defaultCSS =
            document.createElement("link")

        this.#defaultCSS.rel = "stylesheet"
        this.#defaultCSS.href =
            "./core/themes/default.css"

        this.#css =
            document.createElement("link")

        this.#css.rel = "stylesheet"
        this.#css.href =
            "./core/themes/default.css"

        this.#shadow.append(
            this.#defaultCSS,
            this.#css
        )

        this.#current =
            this.#container.get("Default")
    }

    async apply(name) {
        const theme =
            this.#container.get(name)

        if (!theme) {
            console.warn(
                `Could not find theme with name ${name}`
            )

            return
        }

        this.#current = theme

        this.#css.href =
            `../core/themes/${name.toLowerCase()}.css`

        for (const func of this.#subscription) {
            func()
        }
    }

    get current() {
        return this.#current
    }

    get container() {
        return this.#container
    }

    subscribe(func) {
        this.#subscription.push(func)
    }
}