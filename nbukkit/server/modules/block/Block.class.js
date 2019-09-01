const Vec3 = require('vec3');

module.exports = class Block{
    constructor(type = 0){
        this.position = new Vec3(0, 0, 0);
        this.type = type;
    }
}
