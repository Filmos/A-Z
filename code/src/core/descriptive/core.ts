abstract class Clusterable {
    protected cluster : string

    constructor(cluster : string) {
        this.cluster = cluster
    }
    getCluster() : string {
        return this.cluster
    }
}