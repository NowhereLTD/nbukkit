const mc = require('minecraft-protocol');
const Vec3 = require('vec3');

module.exports = class Player {

    constructor(server, location, connectionPlayer) {
        this.server = server;
        this.location = location;
        this.connection = connectionPlayer;
        this.uuid = connectionPlayer.client.uuid;
        this.name = connectionPlayer.client.username;
        this.entityId = connectionPlayer.client.id;
        this.gamemode = 0;
        this.displayname = this.name;
    }

};
