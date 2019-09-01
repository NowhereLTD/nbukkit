const Vec3 = require('vec3');

module.exports = class Block{


    constructor(id, displayName, name, hardness, stackSize, diggable, boundingBox, material, harvestTools, variations, states, drops, transparent, emitLight, filterLight, minStateId, maxStateId, blockPosition) {
        this.id = id;
        this.displayName = displayName;
        this.name = name;
        this.hardness = hardness;
        this.stackSize = stackSize;
        this.diggable = diggable;
        this.boundingBox = boundingBox;
        this.material = material;
        this.harvestTools = harvestTools;
        this.variations = variations;
        this.states = states;
        this.drops = drops;
        this.transparent = transparent;
        this.emitLight = emitLight;
        this.filterLight = filterLight;
        this.minStateId = minStateId;
        this.maxStateId = maxStateId;
        this.blockPosition = blockPosition;
    }


};
