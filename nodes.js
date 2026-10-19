// This script makes our nodes and stuff

import { Node } from "@painekillers/tree-builder-core"

export default [
    new Node("A", [], ["B", "C"], "A"),

    new Node("B", ["A"], ["D"], "B"),
    new Node("C", ["A"], ["E"], "C"),

    new Node("D", ["B", "E"], [], "D"),
    new Node("E", ["C"], ["D"], "E"),
]