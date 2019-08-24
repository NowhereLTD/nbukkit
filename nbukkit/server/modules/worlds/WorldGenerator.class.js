const SimplexNoise = require("simplex-noise");

class WorldGenerator{
    constructor(server, seed = Math.floor(Math.random()*100000)){
        this.server = server;
        this.seed = Math.floor(Math.sin(this.seed));
        this.simplex = new SimplexNoise(this.seed);
        this.smooth = 0.3;
        this.flatness = 1.5;
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
                let test = this.simplex.noise2D(this.smooth * (absX/16-0.5), this.smooth * (absZ/16-0.5));
                + 0.5 * this.simplex.noise2D((this.smooth*2) * (absX/16-0.5), (this.smooth*2) * (absZ/16-0.5));
                + 0.25 * this.simplex.noise2D((this.smooth*4) * (absX/16-0.5), (this.smooth*4) * (absZ/16-0.5));

                if(test<0){
                    test = -1 * Math.pow(-test, this.flatness);
                }else{
                    test = Math.pow(test, this.flatness);
                }
                this.server.data[chunkX][chunkZ][x][z] = Math.round(test*10)+50;
            }
        }
    }
}

module.exports = WorldGenerator;
