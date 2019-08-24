const events = require("events");

class Packet {
    constructor(player, data, meta) {
        this.player = player;
        this.data = data;
        this.meta = meta;
    }

    async triggerBefore() {
        await new Promise(resolve => {this.player.events.emit("before_" + this.meta.name, this)});
    }

    trigger(){
        this.triggerBefore();
        this.player.events.emit(this.meta.name, this.data, this.meta);
    }
}

module.exports = Packet;
