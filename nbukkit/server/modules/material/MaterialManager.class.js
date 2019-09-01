const fs = require('fs');
const Block = require('./block/Block.class.js');
const BlockState = require('./block/BlockState.class.js');
const Variation = require('./Variation.class.js');


module.exports = class MaterialManager {

    constructor(server) {
        this.server = server;
        this.blockJson = this.readJson("~/nbukkit/server/minecraft-data/1.8/blocks.json");
        this.itemJson;
    }

    getItem() {

    }

    getBlock(id) {
        let data = this.blockJson[id];
        let variations = [];
        data.variations.forEach(variation => variations.push(new Variation(variation.metadata, variation.displayName)));
        let block = new Block(
            data.id,
            data.displayName,
            data.name,
            data.hardness,
            data.stackSize,
            data.diggable,
            data.boundingBox,
            data.material,
            data.harvestTools,
            variations,
            data.drops,
            data.transparent,
            data.emitLight,
            data.filterLight);
        return block;
    }

    readJson(path) {
        return JSON.parse(fs.readFileSync(path));
    }

};
