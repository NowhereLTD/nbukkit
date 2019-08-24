const events = require("events");

class Packet {
    constructor(player, data, meta) {
        this.player = player;
        this.data = data;
        this.meta = meta;
    }

    async triggerBefore() {
        await this.player.event.emit("before_" + this.meta.name, this);
    }

    async trigger(){
        this.triggerBefore();
        this.player.events.emit(this.meta.name, this.data, this.meta);
    }
}

module.exports = Packet;
