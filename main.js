let nodes = new Map();
let objects = [];
let x = 0, y = 0;
let zoom = 24;
const baseZoom = zoom;
const zoomScale = 1.05;
let dragging = false;
const nodeSize = 24;
const paddingX = 12, paddingY = 20;
const minZoom = 12, maxZoom = 48;
const world = document.getElementById("world");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function makeObj(X, Y, name) {
  let obj = { X: X, Y: Y, element: document.createElement("div") };
  obj.element.textContent = name;
  obj.element.style.position = "absolute";
  obj.element.style.height = `${50}px`;
  obj.element.style.width = `${50}px`;

  document.body.appendChild(obj.element);
  
  return obj;
}

function render() {
  const vw = window.innerWidth; 
  const vh = window.innerHeight;
  const centerX = vw / 2;
  const centerY = vh / 2;
  
  objects.forEach(obj => {
    const zoomRatio = zoom / baseZoom
    const absSize = nodeSize * zoomRatio;
    const absX = centerX + (x - absSize/2 - obj.X * zoomRatio), absY = centerY + (y - absSize/2 - obj.Y * zoomRatio);
    obj.element.style.transform = `translate(${absX}px, ${absY}px)`;
    obj.element.style.height = `${absSize}px`;
    obj.element.style.width = `${absSize}px`;
  });
}

world.addEventListener("mousedown", () => dragging = true);
document.addEventListener("mouseup", () => dragging = false);

document.addEventListener("mousemove", e => {
  const vw = window.innerWidth; 
  const vh = window.innerHeight;
  const centerX = vw / 2;
  const centerY = vh / 2;
  
  if (!dragging) return;

  x += e.movementX;
  y += e.movementY;

  world.style.backgroundPosition = `${x + centerX}px ${y + centerY}px`;
  render();
});

document.addEventListener("wheel", e => {
  const normalized = e.deltaY > 0 ? 1 : -1;
  const vw = window.innerWidth; 
  const vh = window.innerHeight;
  const centerX = vw / 2;
  const centerY = vh / 2;
  const mouseX = e.clientX - centerX;
  const mouseY = e.clientY - centerY;

  let newZoom = zoom * Math.pow(zoomScale, normalized);
  newZoom = clamp(newZoom, minZoom, maxZoom);

  let ratio = newZoom / zoom;
  x = mouseX - (mouseX - x) * ratio;
  y = mouseY - (mouseY - y) * ratio;
  
  zoom = newZoom;

  world.style.backgroundSize = `${zoom}px ${zoom}px`;
  world.style.backgroundPosition = `${x + centerX}px ${y + centerY}px`;
  render();
});

window.addEventListener("resize", render)

function connectNodes(node1, node2){
  
}

function clearNodes(){
  
}

class Node {
  
  constructor(name, parents, children){
    this.name = name;
    this.parents = parents;
    this.children = children;
    this.element = null;
    nodes[name] = this;
  }

  create(ancestorLimit, descendentLimit, position = [0, 0], allowCyclicalRender = false){
    if (this.element !== null && !allowCyclicalRender) {return this.element;}
    this.element = this.createNode(position);
    this.createParents(ancestorLimit);
    this.createChildren(descendentLimit);

    return this.element;
  }

  createParents(limit, allowCyclicalRender){
    const yPos = this.element.Y + paddingY + nodeSize;
    let xPos = this.element.X - ((paddingX + nodeSize) * (this.parents.length - 1) / 2);
    
    this.parents.forEach(parent => {
      if (limit === 0) {return;}
      let element = parent.create(limit - 1, 0, [xPos, yPos], allowCyclicalRender);
      connectNodes(this.element, element);
      xPos += paddingX + nodeSize;
    })
  }
  createChildren(limit, allowCyclicalRender){
    const yPos = this.element.Y - paddingY - nodeSize;
    let xPos = this.element.X - ((paddingX + nodeSize) * (this.children.length - 1) / 2);
    
    if (limit === 0) {return;}
    this.children.forEach(child => {
      let element = child.create(0, limit - 1, [xPos, yPos], allowCyclicalRender);
      connectNodes(this.element, element);
      xPos += paddingX + nodeSize;
    })
  }
  
  createNode(position){
    let obj = makeObj(position[0], position[1], this.name);
    objects.push(obj);
    return obj;
  }
}

function createNodeWithName(name, ancestorLimit, descendentLimit, position){
  let node = nodes[name];
  if (node === undefined) {
    console.warn(`Node ${name} not found`);
    return;
  }

  node.create(ancestorLimit, descendentLimit, position);
}

let c1 = new Node("child1", ["root"], []);
let c2 = new Node("child2", ["root"], []);
new Node("root", [], [c1, c2]);

console.log(nodes);
createNodeWithName("root", 1, 1, [0, 0]);

render();
