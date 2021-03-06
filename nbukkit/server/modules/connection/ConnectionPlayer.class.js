const Packet = require("../connection/Packet.class.js");

module.exports = class ConnectionPlayer {

    constructor(client) {
        this.client = client;
        this.status = [];
    }

    spawn() {
        this.sendPacket("login", {
            entityId: this.player.entityId,
            levelType: "default",
            gameMode: this.player.server.properties.gamemode,
            dimension: 0,
            difficulty: this.player.server.properties.difficulty,
            maxPlayers: this.player.server.properties.maxPlayers,
            reducedDebugInfo: false
        });

        this.player.location.calcChunkLocation();
        for(let x = (this.player.location.chunkX - 8); x <= (this.player.location.chunkX + 8); x++) {
            for(let z = (this.player.location.chunkZ - 8); z <= (this.player.location.chunkZ + 8); z++) {
                this.player.loadChunk(x, z);
                this.player.loadedChunks.push({"x": x, "z": z});
            }
        }

        this.sendPacket("position", {
            x: this.player.location.x,
            y: this.player.location.y,
            z: this.player.location.z,
            yaw: this.player.location.yaw,
            pitch: this.player.location.pitch,
            flags: 0x00
        });
        this.sendPacket("entity_metadata", {
            entityId: this.player.entityId,
            metadata: [
                { type: 0, value: 127, key: 10 }
            ]
        });
        /*if() Check Online / Offline Mode
        this.sendPacket("player_info", {
            action: 0,
            data: [{
                UUID: this.player.uuid,
                name: this.player.name,
                properties: [{
                    name: "texture",
                    signature: this.client.profile.properties[0].signature,
                    value: this.client.profile.properties[0].value
                }],
                gamemode: this.player.gamemode,
                ping: this.client.latency,
                displayName: this.player.displayname
            }]
        });*/

    }

    sendChunk(chunkX, chunkZ, data, bitmap = 0xffff) {
        this.sendPacket("map_chunk", {
            x: chunkX,
            z: chunkZ,
            groundUp: true,
            bitMap: bitmap,
            chunkData: data,
            blockEntities: []
        });
    }

    addOtherToTabList(p) {
        this.sendPacket("player_info", {
            action: 0,
            data: [{
                UUID: p.uuid,
                name: p.name,
                properties: [{
                    name: p.connection.client.profile.properties[0].name,
                    value: p.connection.client.profile.properties[0].value,
                    signature: p.connection.client.profile.properties[0].signature
                }],
                gamemode: p.gamemode,
                ping: p.connection.client.latency,
                displayName: p.displayname
            }]
        });
    }

    spawnOtherPlayer(p) {
        this.sendPacket("named_entity_spawn", {
            entityId: p.entityId,
            playerUUID: p.uuid,
            x: (p.location.x * 32),
            y: (p.location.y * 32),
            z: (p.location.z * 32),
            yaw: this.convAngle(p.location.yaw),
            pitch: this.convAngle(p.location.pitch),
            metadata: [
                { type: 0, value: 127, key: 10 }
            ]
        });
        this.sendPacket("entity_head_rotation", {
           entityId: p.entityId,
           headYaw: this.convAngle(p.location.yaw)
        });
    }

    removeOtherFromTabList(p) {
        this.sendPacket("player_info", {
            action: 4,
            data: [{
                UUID: p.uuid
            }]
        });
    }

    destroyEntities(entityIds) {
        this.sendPacket("entity_destroy", {
            "entityIds": entityIds.map(e => e)
        })
    }

    sendMessage(message) {
        this.sendPacket("chat", {
            message: JSON.stringify(message),
            position: 0
        });
    }

    setPlayer(player) {
        this.player = player;
        this.addDefaultEvents();
    }

    handle() {
        this.client.on("packet",  (data, meta) => {
            new Packet(this.player, data, meta).trigger();
        });
        this.client.on("end", () => {
            this.player.server.entityManager.destroyPlayer(this.player);
        });
    }

    addDefaultEvents() {
        this.player.events.on('chat', (data) => {
            this.receiveMessage(data.message, this.player);
        });
        this.player.events.on('position', (data) => {
           this.receiveMovement(data, true, false);
        });
        this.player.events.on('look', (data) => {
           this.receiveMovement(data, false, true);
        });
        this.player.events.on('position_look', (data) => {
           this.receiveMovement(data, true, true);
        });
        this.player.events.on('flying', (data) => {
           this.receiveMovement(data, false, false);
        });
        this.player.events.on('keep_alive', () => {
           this.player.calcNearbyPlayers();
        });
        this.player.events.on('entity_action', (data) => {
           this.receiveEntityAction(data);
        });
        this.player.events.on('arm_animation', () => {
            this.player.nearbyPlayer.forEach(p => p.connection.sendPacket("animation", {
                entityId: this.player.entityId,
                animation: 0
            }));
        });
        this.player.events.on('use_entity', (data) => {
           this.interact(data);
        });
    }

    interact(data) {
        let playerTarget = this.player.server.EntityManager.getPlayerByEntityId(data.target);
        let action = data.mouse;
        switch (action) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            default:
                break;
        }
    }

    receiveMovement(data, hasPos, hasLook) {
        let packetName = undefined;
        let packetData = {

        };
        if(hasLook && hasPos) {
            let deltaX = data.x * 32 - this.player.location.x * 32;
            let deltaY = data.y * 32 - this.player.location.y * 32;
            let deltaZ = data.z * 32 - this.player.location.z * 32;
            this.player.updateLocation(
                data.x,
                data.y,
                data.z,
                data.yaw,
                data.pitch,
                this.player.location.world,
                data.onGround);
            packetName = "entity_move_look";
            packetData = {
                entityId: this.player.entityId,
                dX: deltaX,
                dY: deltaY,
                dZ: deltaZ,
                yaw: this.convAngle(data.yaw),
                pitch: this.convAngle(data.pitch),
                onGround: data.onGround
            };
        } else if(hasLook && !hasPos) {
            this.player.updateLocation(
                this.player.location.x,
                this.player.location.y,
                this.player.location.z,
                data.yaw,
                data.pitch,
                this.player.location.world,
                data.onGround);
            packetName = "entity_look";
            packetData = {
                entityId: this.player.entityId,
                yaw: this.convAngle(data.yaw),
                pitch: this.convAngle(data.pitch),
                onGround: data.onGround
            };
        } else if(hasPos && !hasLook) {
            let deltaX = data.x * 32 - this.player.location.x * 32;
            let deltaY = data.y * 32 - this.player.location.y * 32;
            let deltaZ = data.z * 32 - this.player.location.z * 32;
            this.player.updateLocation(data.x,
                data.y,
                data.z,
                this.player.location.yaw,
                this.player.location.pitch,
                this.player.location.world,
                data.onGround);
            packetName = "rel_entity_move";
            packetData = {
                entityId: this.player.entityId,
                dX: deltaX,
                dY: deltaY,
                dZ: deltaZ,
                onGround: data.onGround
            };
        } else {
            this.player.updateLocation(
                this.player.location.x,
                this.player.location.y,
                this.player.location.z,
                this.player.location.yaw,
                this.player.location.pitch,
                this.player.location.world,
                data.onGround
            );
        }

        if(packetName !== undefined) {
            if(packetName === "entity_look" || packetName === "entity_move_look") {
                let rotData = {
                    entityId: this.player.entityId,
                    headYaw: this.convAngle(data.yaw)
                };
                this.player.nearbyPlayer.forEach((p) => {
                    p.connection.sendPacket(packetName, packetData);
                    p.connection.sendPacket("entity_head_rotation", rotData);
                });
            } else {
                this.player.nearbyPlayer.forEach((p) => {
                    p.connection.sendPacket(packetName, packetData);
                });
            }
        }

    }

    receiveMessage(message, player) {
        this.player.server.chatManager.onMessage(message, player);
    }

    receiveEntityAction(data) {
        if(data.actionId === 0 | 1 | 3 | 4) {
            switch(data.actionId) {
                case 0:
                    this.addStatus(0x02);
                    break;
                case 1:
                    this.removeStatus(0x02);
                    break;
                case 3:
                    this.addStatus(0x08);
                    break;
                case 4:
                    this.removeStatus(0x08);
                    break;
            }
            this.updateStatus();
        }
    }

    addStatus(value) {
        this.status.push(value);
    }

    removeStatus(value) {
        this.status = Object.entries(this.status).filter((status) => status !== value);
    }

    updateStatus() {
        let b = 0;
        if(this.status.length > 0) {
            this.status.forEach(value => {
                b |= value;
            });
        }
        let data = {
            entityId: this.player.entityId,
            metadata: [
                { type: 0, value: b, key: 0 }
            ]
        };
        this.sendPacket("entity_metadata", data);
        this.player.nearbyPlayer.forEach(p => {
           p.connection.sendPacket("entity_metadata", data);
        });
    }

    sendPacket(name, data) {
        this.client.write(name, data);
    }

    convAngle(f) {
        let b = Math.floor((f % 360) * 256 / 360);
        if(b < -128) b += 256;
        else if(b > 127) b -= 256;
        return b;
    }

};
