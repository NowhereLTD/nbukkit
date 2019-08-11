const mc = require('minecraft-protocol');
const fs = require('fs');

console.log("Starting minecraft server version 1.14.4");


const server = mc.createServer({
    "online-mode": true,
    host: "localhost",
    port: 25565
});
