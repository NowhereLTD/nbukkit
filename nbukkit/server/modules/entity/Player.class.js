const mc = require('minecraft-protocol');
const Vec3 = require('vec3');
const Inventory = require('../inventory/Inventory.class.js');

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
        this.inventory = new Inventory(36, this);
        this.nearbyPlayer = [];
        this.spawnedPlayer = [];
    }

    async calcNearbyPlayers() {
        this.nearbyPlayer = this.server.entityManager.players.filter((p) => {
            if(p.uuid !== this.uuid) {
                return (p.location.world = this.location.world ? this.inRadius(p) : false);
            } else {
                return false;
            }
        });
        this.removeNotNearbyPlayer();
        if(this.nearbyPlayer.length > 0) {
            this.spawnUnspawnedNearbyPlayer();
        }
    }

    inRadius(p) {
        let deltaX = this.location.x - p.location.x;
        let deltaY = this.location.y - p.location.y;
        let deltaZ = this.location.z - p.location.z;

        let inRadius = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ <= this.server.properties.nearbyPlayerRadius * this.server.properties.nearbyPlayerRadius;

        return inRadius;
    }

    distanceTo(p) {
        let deltaX = this.location.x - p.location.x;
        let deltaY = this.location.y - p.location.y;
        let deltaZ = this.location.z - p.location.z;

        return Math.sqrt(deltaX ^ 2 + deltaY ^ 2 + deltaZ ^ 2);
    }

    removeNotNearbyPlayer() {
        if(this.spawnedPlayer.length > 0) {
            let removePlayer = Object.entries(this.spawnedPlayer).filter((p) => {
                return !this.nearbyPlayer.includes(p);
            });
            this.spawnedPlayer.filter = Object.entries(this.spawnedPlayer).filter((p) => { return !removePlayer.includes(p)});
            this.connection.destroyEntities(removePlayer.map((p) => { return p.entityId; }));
        }
    }

    spawnUnspawnedNearbyPlayer() {
        let unspawned = this.nearbyPlayer.filter((p) => { return !this.spawnedPlayer.includes(p)});
        unspawned.forEach((p) => {
            this.connection.spawnOtherPlayer(p);
            this.spawnedPlayer.push(p);
        });
    }

    updateLocation(x, y, z, yaw, pitch, world, onGround) {
        this.location.x = x;
        this.location.y = y;
        this.location.z = z;
        this.location.yaw = yaw;
        this.location.pitch = pitch;
        this.location.world = world;
        this.location.onGround = onGround;
    }

};
