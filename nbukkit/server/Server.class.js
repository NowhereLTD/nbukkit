const mc = require('minecraft-protocol');
const ConnectionManager = require('./modules/connection/ConnectionManager.class.js');
const WorldManager = require('./modules/worlds/WorldManager.class.js');
const EntityManager = require('./modules/entity/EntityManager.class');
const ChatManager = require('./modules/chat/ChatManager.class');

module.exports = class Server {

    constructor(properties) {
        this.properties = properties;
    }

    startServer() {
        console.log("Init Server with Port: " + this.properties.serverPort);
        console.log("Server runs in" + this.properties.onlineMode ? "onlineMode" : "offlineMode");
        console.log("Default Gamemode: " + this.properties.gamemode);
        this.mc = mc.createServer({
            "online-mode": this.properties.onlineMode,
            host: this.properties.serverIp,
            port: this.properties.serverPort,
            version: this.properties.version,
            motd: this.properties.motd
        });

        this.connectionManager = new ConnectionManager(this);
        this.worldManager = new WorldManager(this);
        this.entityManager = new EntityManager(this);
        this.chatManager = new ChatManager(this);

        this.worldManager.defaultWorld();
    }


    stopServer() {
        this.mc.close();
    }

};
