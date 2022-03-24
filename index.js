//title: uptime monitoring application
//dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes')

// app object -  module scaffolding
const app = {};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listent to port ${app.config.port}`);
    });
};

//handle request response
app.handleReqRes = handleReqRes;
//start the server
app.createServer();