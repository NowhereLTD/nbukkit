const fs = require('fs');
const Properties = require("./serverProperties.js");
const Server = require('./server.js');

const serverProperties = new Properties();
serverProperties.load('./etc/server.properties');
const server = new Server(serverProperties);
server.startServer();
