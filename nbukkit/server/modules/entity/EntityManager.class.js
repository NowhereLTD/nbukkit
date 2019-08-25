const Player = require('./Player.class.js');
const Location = require('../worlds/Location.class');

module.exports = class EntityManager {

    constructor(server) {
        this.server = server;
        this.entitys = [];
        this.players = [];
    }

    spawnEntity(entity) {

    }

    createPlayer(connectionPlayer) {
        let player = new Player(this.server, new Location(0, 70, 0, -80, 0, 'world', true), connectionPlayer);
        player.connection.setPlayer(player);
        this.players.push(player);
        this.server.chatManager.sendJoinMessage(player);
        player.connection.handle();
        this.spawnPlayer(player);
    }

    destroyPlayer(player) {
        this.despawnPlayer(player);
        this.players = this.players.filter(p => p.uuid !== player.uuid);
        this.server.chatManager.sendLeaveMessage(player);
    }

    spawnPlayer(player) {
        player.connection.spawn();
        this.players.filter((p) => { return p.uuid !== player.uuid}).forEach((p) => {
            p.connection.addOtherToTabList(player);
            player.connection.addOtherToTabList(p);
        });
        player.calcNearbyPlayers();
        this.players.forEach((p) => p.calcNearbyPlayers());
    }

    despawnPlayer(player) {
        this.players.forEach((p) => {
           if(p.uuid !== player.uuid) {
               p.connection.removeOtherFromTabList(player);
               if(p.nearbyPlayer.includes(player)) {
                   p.connection.destroyEntities([player.entityId]);
                   p.nearbyPlayer = p.nearbyPlayer.filter((pp) => pp.uuid !== player.uuid);
                   p.spawnedPlayer = Object.entries(p.spawnedPlayer).filter((pp) => pp.uuid !== player.uuid);
               }
           }
        });
    }

    getPlayerByUUID(uuid) {}

    getPlayerByEntityId(entityId) {
        return Object.entries(this.players).filter((pp) => pp.entityId === entityId)[0];
    }

};
