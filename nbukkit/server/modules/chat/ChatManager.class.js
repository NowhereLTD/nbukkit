module.exports = class ChatManager {

    constructor(server) {
        this.server = server;
    }

    onMessage(message, player) {
        if(message[0] === "/") {
            //command
        } else {
            let msg = this.server.properties.chatMessageTemplate.replace(/%p%/g, player.displayname);
            msg = msg.replace(/%message%/g, message);
            console.log(msg);
            this.server.entityManager.players.forEach((p) => {
                p.connection.sendMessage(msg);
            });
        }
    }

};