const SimplexNoise = require("simplex-noise");

class WorldGenerator{
    constructor(server, seed = Math.floor(Math.random()*100000)){
        this.server = server;
        this.seed = Math.floor(Math.sin(this.seed));
        this.simplex = new SimplexNoise(this.seed);
        this.smooth = 0.1;
    }

    generateChunk(chunkX, chunkZ){
        if(!this.server.data[chunkX]){
            this.server.data[chunkX] = [];
        }

        if(!this.server.data[chunkX][chunkZ]){
            this.server.data[chunkX][chunkZ] = [];
        }
        for(let x=0; x<16; x++){
            let absX = chunkX * 16 + x;
            this.server.data[chunkX][chunkZ][x] = [];
            for(let z=0; z<16; z++){
                let absZ = chunkZ * 16 + z;
                let test =
                    1 * this.simplex.noise2D(1 * (this.smooth*(absX/16-0.5)), 1 * (this.smooth*(absZ/16-0.5))) +
                    0.5 * this.simplex.noise2D(2 * (this.smooth*(absX/16-0.5)), 2 * (this.smooth*(absZ/16-0.5))) +
                    0.25 * this.simplex.noise2D(4 * (this.smooth*(absX/16-0.5)), 2 * (this.smooth*(absZ/16-0.5)));
                this.server.data[chunkX][chunkZ][x][z] = Math.round(test*10)+50;
            }
        }
    }
}

module.exports = WorldGenerator;
