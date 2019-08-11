const mc = require('minecraft-protocol');
const Chunk = require('prismarine-chunk')('1.8');
const Vec3 = require('vec3');

module.export = class Server {

    constructor(properties) {
        this.properties = properties;
    }

    startServer() {
        console.log("Init Server with Port: " + this.properties.serverPort);
        console.log("Server runs in" + this.properties.onlineMode ? "onlineMode" : "offlineMode");
        this.mc = mc.createServer({
            "online-mode": this.properties.onlineMode,
            host: this.properties.serverIp,
            port: this.properties.serverPort,
            version: this.properties.version
        });
        this.defaultListener();
    }

    stopServer() {
        this.mc.close();
    }

    #startWorldGeneration() {
        this.chunk = new Chunk()

        for(let x = 0; x < 16; x++){
          for(let z = 0; z < 16; z++){
            this.chunk.setBlockType(new Vec3(x, 100, z), 2)
            for(let y = 0; y < 256; y++){
              this.chunk.setSkyLight(new Vec3(x, y, z), 15)
            }
          }
        }
    }

    #defaultListener() {
        this.registerListener('login', function (client) {
          client.write('login', {
            entityId: client.id,
            levelType: 'default',
            gameMode: 0,
            dimension: 0,
            difficulty: 2,
            maxPlayers: server.maxPlayers,
            reducedDebugInfo: false
          })
          client.write('map_chunk', {
            x: 0,
            z: 0,
            groundUp: true,
            bitMap: 0xffff,
            chunkData: chunk.dump(),
            blockEntities: []
          })
          client.write('position', {
            x: 15,
            y: 101,
            z: 15,
            yaw: 137,
            pitch: 0,
            flags: 0x00
          })
        })
    }

    registerListener(key, action) {
        this.mc.on(key, action);
    }

}
