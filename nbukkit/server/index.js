const mc = require('minecraft-protocol');
const fs = require('fs');
const Chunk = require('prismarine-chunk')('1.8');
const Vec3 = require('vec3');
const Properties = require("./serverProperties.js")


class Server {
    constructor() {
        console.log("Init Server with Port: " + Properties.serverPort);
        this.mc = mc.createServer({
            "online-mode": Properties.onlineMode,
            host: Properties.serverIp,
            port: Properties.serverPort,
            version: Properties.version
        });
    }
}

const server = new Server();

var chunk = new Chunk()

for(let x = 0; x < 16; x++){
  for(let z = 0; z < 16; z++){
    chunk.setBlockType(new Vec3(x, 100, z), 2)
    for(let y = 0; y < 256; y++){
      chunk.setSkyLight(new Vec3(x, y, z), 15)
    }
  }
}

server.mc.on('login', function (client) {
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
