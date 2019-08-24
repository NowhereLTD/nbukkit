const events = require("events");

class Packet {
    constructor(player, data, meta) {
        this.player = player;
        this.data = data;
        this.meta = meta;
    }

    trigger(){
        this.player.events.emit(this.meta.name, this.data, this.meta);
        console.log("trigger");
    }
}
