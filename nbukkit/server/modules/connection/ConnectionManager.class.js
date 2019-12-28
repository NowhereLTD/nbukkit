const ConnectionPlayer = require("./ConnectionPlayer.class.js");

module.exports = class ConnectionManager {

    constructor(server) {
        this.server = server;
        this.startListen();
    }

    startListen() {
        this.server.mc.on('login', (client) => {
            this.loginClient(client);
        });
    }

    loginClient(client) {
        let conPlayer = new ConnectionPlayer(client);
        this.server.entityManager.createPlayer(conPlayer);
    }

};
