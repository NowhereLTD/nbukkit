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

};