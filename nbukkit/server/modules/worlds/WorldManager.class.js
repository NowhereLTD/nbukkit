const World = require("./World.class.js");
const Vec3 = require("vec3");
const Block = require("../block/Block.class.js");
const SQLite=require("sqlite3");

module.exports = class WorldManager {

    constructor() {
        this.worlds = [];
        this.db = new SQLite.Database("WorldManager.db");
    }

    defaultWorld() {
        this.createWorld("world");
    }

    createWorld(worldName) {
        console.log("Start create the world '" + worldName + "' ...");

        // Create Table in Database
        //console.log("CREATE TABLE " + worldName + " IF NOT EXISTS;");
        console.log(this.db.prepare("CREATE TABLE IF NOT EXISTS world_" + worldName + " (TEXT data);"));

        let world = new World();
        world.createSpawnChunks();
        this.worlds[worldName] = world;
        console.log("The creation of world '" + worldName + "' finished!");
    }

    getWorld(worldName) {
        return this.worlds[worldName];
    }

};
