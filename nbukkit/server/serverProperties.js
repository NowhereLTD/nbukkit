const fs = require("fs");

module.exports = class Properties{
    constructor(){
        this.data = {};
        this.path = "";
    }
    load(path){
        this.path = path;
        if(this.path){
            this.data = fs.readFileSync(path);
        }
        return this.data;
    }
}
