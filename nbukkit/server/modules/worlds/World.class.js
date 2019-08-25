const WorldGenerator = require("./WorldGenerator.class.js");

module.exports = class World {

    constructor() {
        this.worldProperties = {
            "seed": 4897389578975,
            "seedMultiplier": 1000000000,
            "smooth": 0.3,
            "flatness": 1.5,
            "treeDestiny": 5,
            "treeDistance": 5
        };
        this.worldGenerator = new WorldGenerator(this, this.worldProperties.seed, this.worldProperties.seedMultiplier, this.worldProperties.smooth, this.worldProperties.flatness, this.worldProperties.treeDestiny, this.worldProperties.treeDistance);
        this.spawnChunk = {
            "x": 0,
            "z": 0
        };
        this.data = [];
        this.chunkList = [];
        this.worldObjecs = [];
    }

    createSpawnChunks() {

    }

};