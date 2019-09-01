const WorldGenerator = require("./WorldGenerator.class.js");
const Chunk = require('prismarine-chunk')('1.8');
const Vec3 = require("vec3");
const Biome = require("../worlds/Biome.class.js");
const Exception = require("../utils/Exception.class.js");
const Block = require("../block/Block.class.js");

module.exports = class World {

    constructor(worldProperties = {
        "seed": 4897389578975,
        "seedMultiplier": 1000000000,
        "smooth": 0.3,
        "flatness": 1.5,
        "treeDestiny": 5,
        "treeDistance": 5,
        "baseHeight": 50,
        "waterHeight": 53
    }) {
        this.worldProperties = worldProperties;
        this.worldGenerator = new WorldGenerator(this, this.worldProperties.seed, this.worldProperties.seedMultiplier, this.worldProperties.smooth, this.worldProperties.flatness, this.worldProperties.treeDestiny, this.worldProperties.treeDistance);
        this.spawnChunk = {
            "x": 0,
            "z": 0
        };
        this.data = [];
        this.chunkList = [];
        this.worldObjecs = [];
    }

    createSpawnChunks() {
        for(let x = (this.spawnChunk.x - 8); x <= (this.spawnChunk.x + 8); x++) {
            for(let z = (this.spawnChunk.z - 8); z <= (this.spawnChunk.z + 8); z++) {
                this.createChunk(x, z);
            }
        }
    }

    createChunk(chunkX, chunkZ) {
        this.worldGenerator.generateChunk(chunkX, chunkZ);
    }

    setBlock(vec, block){
        let endVec = this.getAbsoluteToRelativePosition(vec);
        if(this.chunkList[endVec.chunkVec.x] && this.chunkList[endVec.chunkVec.x][endVec.chunkVec.z]){
            let chunk = this.chunkList[endVec.chunkVec.x][endVec.chunkVec.z];
            chunk.setBlockType(new Vec3(endVec.relativeChunkVec.x, endVec.relativeChunkVec.y, endVec.relativeChunkVec.z), block.type);
        }else{
            //throw new Exception("ChunkNotFoundException", "Cannot found Chunk X: " + endVec.chunkVec.x + ", Z: " + endVec.chunkVec.z);
        }
    }

    getBlock(vec){
        let endVec = this.getAbsoluteToRelativePosition(vec);
        if(this.chunkList[endVec.chunkVec.x] && this.chunkList[endVec.chunkVec.x][endVec.chunkVec.z]){
            let chunk = this.chunkList[endVec.chunkVec.x][endVec.chunkVec.z];
            return chunk.getBlockType(new Vec3(endVec.relativeChunkVec.x, endVec.relativeChunkVec.y, endVec.relativeChunkVec.z));
        }else{
            //throw new Exception("ChunkNotFoundException", "Cannot found Chunk X: " + endVec.chunkVec.x + ", Z: " + endVec.chunkVec.z);
        }
    }

    getAbsoluteToRelativePosition(vec){
        let x = vec.x;
        let y = vec.y;
        let z = vec.z;
        let chunkX = Math.floor(x/16);
        let chunkZ = Math.floor(z/16);
        x = x%16;
        z = z%16;
        let relativeChunkVec = new Vec3(x, y, z);
        let chunkVec = new Vec3(chunkX, y, chunkZ);
        return {"chunkVec": chunkVec, "relativeChunkVec": relativeChunkVec};
    }

    buildChunk(chunkX, chunkZ, biome = new Biome()) {

        if(!this.chunkList[chunkX])
            this.chunkList[chunkX] = [];

        let chunk = new Chunk();
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++){
                for(let y = 0; y <= this.data[chunkX][chunkZ][x][z]; y++) {
                    for(let layerID in biome.worldLayer){
                        let layer = biome.worldLayer[layerID];
                        if(y <= this.data[chunkX][chunkZ][x][z] - layer.start){
                            if(y >= this.data[chunkX][chunkZ][x][z] - layer.start - layer.size){
                                chunk.setBlockType(new Vec3(x, y, z), layer.block);
                            }
                        }
                    }
                }

                /*for(let y = 0; y <= this.worldProperties.waterHeight; y++) {
                    if(chunk.getBlockType(new Vec3(x, y, z)) == 0){
                        chunk.setBlockType(new Vec3(x, y, z), 9);
                    }
                }*/


                for (let y = 0; y < 256; y++) {
                    chunk.setSkyLight(new Vec3(x, y, z), 15)
                }
            }
        }


        // Add Chunk to Chunk List
        this.chunkList[chunkX][chunkZ] = chunk;


        // Generate all Chunk Overloading Stuff
        for(let objCount=0; objCount<this.worldObjecs[chunkX][chunkZ].length; objCount++){
            let obj = this.worldObjecs[chunkX][chunkZ][objCount];
            let x = (chunkX * 16) + obj.x;
            let z = (chunkZ * 16) + obj.z;
            let y = this.data[chunkX][chunkZ][obj.x][obj.z];

            if(this.getBlock(new Vec3(x, y+1, z)) == 9){
                continue;
            }

            this.setBlock(new Vec3(x, y+1, z), new Block(17));
            this.setBlock(new Vec3(x, y+2, z), new Block(17));
            this.setBlock(new Vec3(x, y+3, z), new Block(17));
            this.setBlock(new Vec3(x, y+4, z), new Block(17));
            this.setBlock(new Vec3(x, y+5, z), new Block(17));

            for(let i=-2; i<=2; i++){
                for(let i1=-2; i1<=2; i1++){
                    for(let i2=0; i2<3; i2++){
                        this.setBlock(new Vec3(x+i, y+4+i2, z+i1), new Block(18));
                    }
                }
            }
        }


    }

};
