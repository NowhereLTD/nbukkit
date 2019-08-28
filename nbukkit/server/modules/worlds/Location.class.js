module.exports = class Location {

    constructor(x, y, z, yaw, pitch, world, onGround) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.yaw = yaw;
        this.pitch = pitch;
        this.world = world;
        this.onGround = onGround;
    }

    calcChunkLocation() {
        this.chunkX = Math.floor(this.x / 16);
        this.chunkZ = Math.floor(this.z / 16)
    }

};
