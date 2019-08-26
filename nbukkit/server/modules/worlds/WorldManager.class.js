const World = require("./World.class.js");

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

        this.worlds[worldName] = world;
        console.log("Default world creation finished!");
    }

    getWorld(worldName) {
        return this.worlds[worldName];
    }

};
