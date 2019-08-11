const Block = require("./Block.class.js");

module.exports = class GrasBlock extends Block{
    constructor(){
        super();
        this.type = 2;
    }
}
