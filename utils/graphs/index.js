class Edge {
    constructor(vertexA, vertexB, cost) {
        this.vertexA = parseInt(vertexA, 10);
        this.vertexB = parseInt(vertexB, 10);
        this.cost = parseInt(cost, 10);
    }

    valueOf() {
        return this.cost;
    }
}

class Vertex {
    constructor(label, weight, edges) {
        this.label = parseInt(label || 0, 10);
        this.weight = weight === undefined ? this.label : parseInt(weight, 10);
        this.edges = edges || []
    }

    setLabel(label) {
        this.label =  parseInt(label || 0, 10);
    }

    setWeight(weight) {
        this.weight =  parseInt(weight, 10);
    }

    addEdge(edge) {
        this.edges.push(edge)
    }

    valueOf() {
        return this.weight;
    }
}

module.exports = {
    Edge,
    Vertex,
}