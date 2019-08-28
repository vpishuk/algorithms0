class Edge {
    constructor(vertexA, vertexB, cost) {
        this.vertexA = parseInt(vertexA, 10);
        this.vertexB = parseInt(vertexB, 10);
        this.cost = parseInt(cost, 10);
        this.originalCost = 0
    }

    getHead() {
        return this.vertexA
    }

    getTail() {
        return this.vertexB
    }

    getCost() {
        return this.cost;
    }

    getOriginalCost() {
        return this.originalCost
    }

    setCost(cost) {
        this.originalCost = this.cost;
        this.cost = parseInt(cost, 10);
    }

    valueOf() {
        return this.cost;
    }
}

class Vertex {
    constructor(label, weight, edges) {
        this.label = parseInt(label || 0, 10);
        this.weight = weight === undefined ? Infinity : parseInt(weight, 10);
        this.edges = edges || []
        this.meta = {}
    }

    setMetadta(meta) {
        this.meta = Object.assign(this.meta, meta || {})
    }

    getMetadta(key) {
        return this.meta[key]
    }

    setLabel(label) {
        this.label =  parseInt(label || 0, 10);
    }

    getLabel() {
        return this.label;
    }

    setWeight(weight) {
        this.weight =  parseInt(weight, 10);
    }

    getWeight() {
        return this.weight;
    }

    addEdge(edge) {
        this.edges.push(edge)
    }

    getEdges() {
        return this.edges;
    }

    valueOf() {
        return this.weight;
    }
}

module.exports = {
    Edge,
    Vertex,
}