import { Viewer, ThemeContainer } from "@painekillers/tree-builder-viewer"
import { Graph } from "@painekillers/tree-builder-core"

import nodes from "./nodes.js"

const themes = new ThemeContainer()

await themes.load("Dark")

const renderMenu = (() => {
    let elements;

    const placeholder = new Image();

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
    `);

    return (node, container) => {
        if (!elements) {
            const icon = new Image();
            icon.className = "image";

            const descriptionTitle = document.createElement("div");
            descriptionTitle.className = "title";
            descriptionTitle.textContent = "Description";

            const description = document.createElement("div");
            description.className = "text";

            const codeTitle = document.createElement("div");
            codeTitle.className = "title";
            codeTitle.textContent = "Raw JSON";

            const codebox = document.createElement("div");
            codebox.className = "codebox";
            codebox.style.whiteSpace = "pre";
            codebox.style.fontFamily = "monospace";

            elements = {
                icon,
                descriptionTitle,
                description,
                codeTitle,
                codebox
            };
        }

        const {
            icon,
            descriptionTitle,
            description,
            codeTitle,
            codebox
        } = elements;

        icon.src = node.val?.icon || placeholder.src;
        description.textContent = node.val?.description ?? "";
        codebox.textContent = JSON.stringify(node.val, null, 2);

        if (icon.parentElement !== container) {
            container.replaceChildren(
                icon,
                descriptionTitle,
                description,
                codeTitle,
                codebox
            );
        }
    };
})();

const viewer = new Viewer(
    document.getElementById("tree"),
    themes,
    renderMenu
)

viewer.graph = new Graph(nodes)

viewer.strategy = "Furthest"

viewer.setRoot("A")
viewer.setSize(50, 50, 100, 50)
viewer.draw()

viewer.enable()