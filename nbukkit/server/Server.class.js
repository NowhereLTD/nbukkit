const mc = require('minecraft-protocol');
const Chunk = require('prismarine-chunk')('1.8');
const Vec3 = require('vec3');
const WorldGenerator = require("./modules/worlds/WorldGenerator.class");
const ConnectionManager = require('./modules/connection/ConnectionManager.class.js');
const WorldManager = require('./modules/worlds/WorldManager.class.js');
const EntityManager = require('./modules/entity/EntityManager.class');
const ChatManager = require('./modules/chat/ChatManager.class');

module.exports = class Server {

    constructor(properties) {
        this.properties = properties;
        this.data = [];
        this.chunkList = [];
        let generator = new WorldGenerator(this);
        for(let i1=0; i1<16; i1++){
            for(let i2=0; i2<16; i2++){
                generator.generateChunk(i1, i2);
            }
        }
    }


    startServer() {
        console.log("Init Server with Port: " + this.properties.serverPort);
        console.log("Server runs in" + this.properties.onlineMode ? "onlineMode" : "offlineMode");
        console.log("Default Gamemode: " + this.properties.gamemode);
        this.mc = mc.createServer({
            "online-mode": this.properties.onlineMode,
            host: this.properties.serverIp,
            port: this.properties.serverPort,
            version: this.properties.version,
            motd: this.properties.motd
        });

        this.connectionManager = new ConnectionManager(this);
        this.worldManager = new WorldManager(this);
        this.entityManager = new EntityManager(this);
        this.chatManager = new ChatManager(this);

        this.startWorldGeneration();
        //this.defaultListener();
    }


    stopServer() {
        this.mc.close();
    }


    startWorldGeneration() {

        //console.log(this.data[0])
        console.log("World generation started...");
        for(let chunkX = 0; chunkX<this.data.length; chunkX++){
            if(!this.chunkList[chunkX]){
                this.chunkList[chunkX] = [];
            }
            for(let chunkZ = 0; chunkZ<this.data[chunkX].length; chunkZ++){
                let chunk = new Chunk();

                for (let x = 0; x < 16; x++) {
                    for (let z = 0; z < 16; z++) {
                        for(let y = 0; y <= this.data[chunkX][chunkZ][x][z]; y++) {
                            if(y == this.data[chunkX][chunkZ][x][z]){
                                chunk.setBlockType(new Vec3(x, y, z), 2);
                            }else if(y > this.data[chunkX][chunkZ][x][z] - 4){
                                chunk.setBlockType(new Vec3(x, y, z), 3);
                            }else{
                                chunk.setBlockType(new Vec3(x, y, z), 1);
                            }
                        }

                        for (let y = 0; y < 256; y++) {
                            chunk.setSkyLight(new Vec3(x, y, z), 15)
                        }
                    }
                }

                this.chunkList[chunkX][chunkZ] = chunk;

            }
        }

        console.log("World generation complete!");

    }
/*
    defaultListener() {
        this.registerListener('login', function (client) {
            this.clients.push(new Player(client, this, new Vec3(15, 101, 15)));
        }.bind(this))
    }*/

};
