const Vec3 = require('vec3');

module.exports = class Block{
    constructor(){
        this.position = new Vec3(0, 0, 0);
        this.type = 0;
    }
}
