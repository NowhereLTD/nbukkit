const World = require("./World.class.js");
const Vec3 = require("vec3");
const Block = require("../block/Block.class.js");

module.exports = class WorldManager {

    constructor() {
        this.worlds = [];
    }

    defaultWorld() {
        this.createWorld("world");
    }

    createWorld(worldName) {
        console.log("Start default world creation...");
        let world = new World();
        world.createSpawnChunks();
        let block = new Block();
        block.type = 11;
        world.setBlock(new Vec3(1000, 55, 1000), block);
        this.worlds[worldName] = world;
        console.log("Default world creation finished!");
    }

    getWorld(worldName) {
        return this.worlds[worldName];
    }

};
