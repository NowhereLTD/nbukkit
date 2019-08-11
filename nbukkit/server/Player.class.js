const mc = require('minecraft-protocol');
const Vec3 = require('vec3');

module.exports = class Player {

    constructor(client) {
        this.uuid = client.uuid;
        this.name = client.username;
        this.entityid = client.id;
    }

}
