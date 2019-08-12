module.exports = class ConnectionPlayer {

    constructor(client) {
        this.client = client;
    }

    spawn() {
        this.sendPacket('login', {
            entityId: this.player.entityId,
            levelType: 'default',
            gameMode: this.player.server.properties.gamemode,
            dimension: 0,
            difficulty: this.player.server.properties.difficulty,
            maxPlayers: this.player.server.properties.maxPlayers,
            reducedDebugInfo: false
        });
        this.sendPacket('map_chunk', {
            x: 0,
            z: 0,
            groundUp: true,
            bitMap: 0xffff,
            chunkData: this.player.server.chunk.dump(),
            blockEntities: []
        });
        this.sendPacket('position', {
            x: this.player.location.x,
            y: this.player.location.y,
            z: this.player.location.z,
            yaw: 137,
            pitch: 0,
            flags: 0x00
        });
        this.sendPacket('entity_metadata', {
            entityId: this.player.entityId,
            metadata: [
                { type: 0, value: 127, key: 10 }
            ]
        });
        this.sendPacket('player_info', {
            action: 0,
            data: [{
                UUID: this.player.uuid,
                name: this.player.name,
                properties: [{
                    name: 'texture',
                    signature: this.client.profile.properties[0].signature,
                    value: this.client.profile.properties[0].value
                }],
                gamemode: this.player.gamemode,
                ping: this.client.latency,
                displayName: this.player.displayname
            }]
        });
    }

    spawnOtherPlayer(p) {
        this.sendPacket('player_info', {
            action: 0,
            data: [{
                UUID: p.uuid,
                name: p.name,
                properties: [{
                    name: 'texture',
                    value: p.connection.client.profile.properties[0].value,
                    signature: p.connection.client.profile.properties[0].signature
                }],
                gamemode: p.gamemode,
                ping: p.connection.client.latency,
                displayName: p.displayname
            }]
        });
        this.sendPacket('named_entity_spawn', {
            entityId: p.entityId,
            playerUUID: p.uuid,
            x: p.location.x * 32,
            y: p.location.y * 32,
            z: p.location.z * 32,
            yaw: 60,
            pitch: 0,
            metadata: [
                { type: 0, value: 127, key: 10 }
            ]
        });
    }

    despawnOtherPlayer(p) {
        this.sendPacket('player_info', {
            action: 4,
            data: [{
                UUID: p.uuid
            }]
        });
        this.destroyEntities([p.entityId]);
    }

    sendMessage(message) {
        this.sendPacket('chat', {
            message: JSON.stringify(message),
            position: 0
        });
    }

    setPlayer(player) {
        this.player = player;
    }

    handle() {
        this.client.on('packet',  (data, meta) => {
            switch (meta.name) {
                case 'chat':
                    this.receiveMessage(data.message, this.player);
                    break;
                case 'position':
                    break;
                default:
                    break;
            }
        });
        this.client.on('end', () => {
            this.player.server.entityManager.destroyPlayer(this.player);
        });
    }

    destroyEntities(entityIds) {
        this.sendPacket('entity_destroy', {
            'entityIds': entityIds.map(e => e)
        })
    }

    receiveMessage(message, player) {
        this.player.server.chatManager.onMessage(message, player);
    }

    sendPacket(name, data) {
        this.client.write(name, data);
    }

};
