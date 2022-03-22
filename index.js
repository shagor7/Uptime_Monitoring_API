//title: uptime monitoring application
//dependencies
const http = require('http');
const url = require('url');

// app object -  module scaffolding
const app = {};

//configuration
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listent to port ${app.config.port}`);
    });
};

//handle request response
app.handleReqRes = (req, res) => {
    //request handeling
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    console.log(path);
    //response handle
    res.end('Hello User!');
};

//start the server
app.createServer();