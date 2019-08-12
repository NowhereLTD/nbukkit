const Player = require('./Player.class.js');
const Vec3 = require('vec3');

module.exports = class EntityManager {

    constructor(server) {
        this.server = server;
        this.entitys = [];
        this.players = [];
    }

    spawnEntity(entity) {

    }

    createPlayer(connectionPlayer) {
        let player = new Player(this.server, new Vec3(15, 101, 15), connectionPlayer);
        player.connection.setPlayer(player);
        this.players.push(player);
        player.connection.handle();
        this.spawnPlayer(player);
    }

    destroyPlayer(player) {
        this.despawnPlayer(player);
        this.players = this.players.filter(p => p.uuid !== player.uuid);
    }

    spawnPlayer(player) {
        player.connection.spawn();
        this.players.forEach((p) => {
            if(player.uuid !== p.uuid) {
                p.connection.spawnOtherPlayer(player);
            }
        });
        this.players.forEach((p) => {
            if(player.uuid !== p.uuid) {
                player.connection.spawnOtherPlayer(p);
            }
        });
    }

    despawnPlayer(player) {
        this.players.forEach((p) => {
           if(p.uuid !== player.uuid) {
               p.connection.despawnOtherPlayer(player);
           }
        });
    }

};
