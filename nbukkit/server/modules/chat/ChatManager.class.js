module.exports = class ChatManager {

    constructor(server) {
        this.server = server;
    }

    onMessage(message, player) {
        if(message[0] === "/") {
            //command
        } else {
            let msg = this.server.properties.messages.chatMessageTemplate.replace(/%p%/g, player.displayname);
            msg = msg.replace(/%message%/g, message);
            console.log(msg);
            this.server.entityManager.players.forEach((p) => {
                p.connection.sendMessage(msg);
            });
        }
    }

    sendMessageToAll(message) {
        this.server.entityManager.players.forEach((p) => {
           p.connection.sendMessage(message);
        });
    }

    sendJoinMessage(joinedPlayer) {
        let msg = this.server.properties.messages.joinMessageTemplate.replace(/%p%/g, joinedPlayer.displayname);
        this.server.entityManager.players.forEach((p) => {
            p.connection.sendMessage(msg);
        });
    }

    sendLeaveMessage(leavedPlayer) {
        let msg = this.server.properties.messages.leaveMessageTemplate.replace(/%p%/g, leavedPlayer.displayname);
        this.server.entityManager.players.forEach((p) => {
            if(p.uuid !== leavedPlayer.uuid) {
                p.connection.sendMessage(msg);
            }
        });
    }

};