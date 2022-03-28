//title: uptime monitoring application
//dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes')
const environement = require('./helpers/environments')
const data = require('./lib/data');
// app object -  module scaffolding
const app = {};

//testing file system
//todo: pore muche dibo ne
/*
data.create('test','newFile', {'name':'bangladesh','language': 'bangla'}, (err) => {
    console.log(`error was`, err);
});
*/
/*
data.read('test','newFile', (err, result) => {
    console.log(err, result);
});
*/
/*
data.update('test', 'newFile', {'name': 'England', 'language': 'English'}, (err) => {
    console.log(err);
});
*/
/*
data.delete('test', 'newFile', (err) => {
    console.log(err);
});
*/
// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environement.port, () => {
        console.log(`listent to port ${environement.port}`);
    });
};

//handle request response
app.handleReqRes = handleReqRes;
//start the server
app.createServer();