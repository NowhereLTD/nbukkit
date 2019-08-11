const mc = require('minecraft-protocol');
const Vec3 = require('vec3');

module.exports = class Player {

    constructor(client, server, location) {
        this.client = client;
        this.server = server;
        this.location = location;
        this.uuid = client.uuid;
        this.name = client.username;
        this.entityid = client.id;


        this.start();
    }

    login() {
        this.client.write('login', {
            entityId: client.id,
            levelType: 'default',
            gameMode: this.server.properties.data.gamemode,
            dimension: 0,
            difficulty: this.server.properties.data.difficulty,
            maxPlayers: this.server.properties.data.maxPlayers,
            reducedDebugInfo: false
        });
        this.client.write('map_chunk', {
            x: 0,
            z: 0,
            groundUp: true,
            bitMap: 0xffff,
            chunkData: this.chunk.dump(),
            blockEntities: []
        });
        this.client.write('position', {
            x: this.location.x,
            y: this.location.y,
            z: this.location.z,
            yaw: 137,
            pitch: 0,
            flags: 0x00
        });
    }

}
