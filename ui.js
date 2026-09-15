const searchButton = document.querySelector("#search-button")
const searchMenu = document.querySelector("#search-menu")
const searchInput = document.querySelector("#search-input")
const searchResults = document.querySelector("#search-results")

searchButton.addEventListener("click", () => {
    if(searchMenu.style.display === "block") {
        searchMenu.style.display = "none"
    } else {
        searchMenu.style.display = "block"
    }
})

function updateSearchResults() {
    const query = searchInput.value

    const results = query
        ? window.search.search(query)
        : window.search.entries.map(entry => ({
            entry,
            score: 1
        }))

    searchResults.replaceChildren()

    for(const result of results) {
        const entry = document.createElement("div")
        entry.className = "search-entry"

        const info = document.createElement("div")

        const name = document.createElement("div")
        name.className = "search-entry-name"
        name.textContent = result.entry.name

        info.append(name)

        if(result.entry.name !== result.entry.value.id) {
            const alias = document.createElement("div")
            alias.className = "search-entry-alias"
            alias.textContent = `(alias of ${result.entry.value.id})`

            info.append(alias)
        }

        const actions = document.createElement("div")
        actions.className = "search-entry-actions"

        const focus = document.createElement("button")
        focus.textContent = "Focus"

        if(!window.bridge.toObj?.has(result.entry.value)) {
            focus.disabled = true
        }

        focus.addEventListener("click", () => {
            window.bridge.focus(result.entry.value)
        })

        const root = document.createElement("button")
        root.textContent = "Set Root"

        focus.addEventListener("click", () => {
            window.bridge.focus(result.entry.value)
        })

        root.addEventListener("click", () => {
            window.bridge.calculateLayout(
                result.entry.value.id,
                window.recurse
            )

            window.bridge.calculateDraw(
                50,     // node width
                50,     // node height
                100,    // layer spacing
                50      // node spacing
            )

            window.bridge.createObjects(window.depth)
        })

        actions.append(focus, root)
        entry.append(info, actions)
        searchResults.append(entry)
    }
}

searchInput.addEventListener("input", updateSearchResults)

updateSearchResults()