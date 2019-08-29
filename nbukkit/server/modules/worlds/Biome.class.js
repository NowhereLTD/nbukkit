
class Biome {
    constructor(smooth = 0, flatness = 0, treeDensity = 0, treeDistance = 0, treeType = "LITLE_OAK", worldLayer = {"gras": {"start": 0, "size": 1, "block": 2}, "sand": {"start": 1, "size": 3, "block": 3}, "stone": {"start": 4, "size": 50, "block": 1}}) {
        this.smooth = smooth;
        this.flatness = flatness;
        this.treeDensity = treeDensity;
        this.treeDistance = treeDistance;
        this.treeType = treeType;
        this.worldLayer = worldLayer;
    }
}

module.exports = Biome;
