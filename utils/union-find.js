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
            this.map.set(e.getLabel(), cluster)
        })
    }

    getClusterized() {
        const map =new Map();
        //console.log(this.map)
        Array.from(this.map.values()).forEach((cluster) => {
            const leader = cluster.leader ? this.find(cluster.element) : cluster
            if (this.clusterLeaders.has(leader) && leader) {
                const set = map.get(leader) || new Set()
                set.add(cluster.element)
                map.set(leader, set)
            } else {
                //console.log(cluster)
            }
        })
        return Array.from(map.values()).map(v => Array.from(v))
    }

    amountOfClusters() {
        return this.clusterLeaders.size
    }

    compressPath(point, root) {
        let cluster = this.map.get(point.getLabel())
        while (cluster.leader) {
            cluster.leader = root
            root.rank++
            cluster.leader.rank--
            cluster = cluster.leader
        }
    }

    find(point) {
        const cluster = this.map.get(point.getLabel())
        let leader = cluster
        while (leader.leader) {
            leader = leader.leader
        }
        return leader
    }

    union(pointA, pointB) {
        // console.log('-----')
        // console.log('union for', pointA, pointB)
        const parentA = this.find(pointA)
        // console.log('pointA has leader', parentA)
        this.compressPath(pointA, parentA)
        const parentB = this.find(pointB)
        // console.log('pointB has leader', parentB)
        this.compressPath(pointB, parentB)
        if (parentA && parentB && parentA !== parentB) {
            if (parentA.rank > parentB.rank) {
                parentB.leader = parentA
                parentA.rank++
                // console.log('uniaon b under a', parentB)
                this.clusterLeaders.delete(parentB)
            } else {
                parentA.leader = parentB
                parentB.rank++
                // console.log('uniaon a under b', parentA)
                this.clusterLeaders.delete(parentA)
            }
        } else {
            // console.log('point A and point B are in the same cluster')
        }
        //console.log(this.clusterLeaders.size)
    }
}

module.exports = UnionFind;
