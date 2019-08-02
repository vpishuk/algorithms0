class Cluster {
    constructor(element, leader) {
        this.element = element
        this.leader = leader
        this.rank = 0
    }
}
class UnionFind {
    constructor(elems) {
        this.map = new Map()
        this.clusterLeaders = new Set()
        Array.from(elems).forEach(e => {
            const cluster = new Cluster(e, null)
            this.clusterLeaders.add(cluster)
            this.map.set(e.valueOf(), cluster)
        })
    }

    amountOfClusters() {
        return this.clusterLeaders.size
    }

    compressPath(point, root) {
        while (point.leader) {
            point.leader = root
            root.rank++
            point.leader.rank--
            point = point.leader
        }
    }

    find(point) {
        let leader = point
        while (leader.leader) {
            leader = leader.leader
        }
        return leader
    }

    union(pointA, pointB) {
        const clusterA = this.map.get(pointA.valueOf())
        const clusterB = this.map.get(pointB.valueOf())
        if (clusterA && clusterB) {
            const parentA = this.find(clusterA)
            this.compressPath(clusterA, parentA)
            const parentB = this.find(clusterB)
            this.compressPath(clusterB, parentB)
            if (parentA && parentB && parentA !== parentB) {
                if (parentA.rank > parentB.rank) {
                    console.log('merge b to a')
                    parentB.leader = clusterA
                    this.clusterLeaders.delete(parentB)
                } else {
                    console.log('merge a to b')
                    parentA.leader = clusterB
                    this.clusterLeaders.delete(parentA)
                }
            }
        } else {
            console.log('clusters not found for ', pointA, pointB)
        }
        //console.log(this.clusterLeaders.size)
    }
}

module.exports = UnionFind;