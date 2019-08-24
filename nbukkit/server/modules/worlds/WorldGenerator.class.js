const SimplexNoise = require("simplex-noise");

class WorldGenerator{
    constructor(server, seed = Math.floor(Math.random()*100000)){
        this.server = server;
        this.seed = Math.floor(Math.sin(this.seed));
        this.simplex = new SimplexNoise(this.seed);
    }

    generateChunk(chunkX, chunkZ){

        for(let x=0; x<16; x++){
            this.server.data[x] = [];
            for(let z=0; z<16; z++){
                let test = this.simplex.noise2D((x/16-0.5), (z/16-0.5));
                this.server.data[x][z] = Math.round(test*10)+100;
            }
        }
    }
}

module.exports = WorldGenerator;
