const fs = require('fs');
const Properties = require("./Properties.class.js");
const Server = require('./Server.class.js');

const serverProperties = new Properties();
serverProperties.load('./nbukkit/server/etc/server.properties');

const server = new Server(serverProperties.data);
server.startServer();

module.export = server;
