/*title: project initial file
*description: initial file to start the node server and workers
*authir: shagor
*date: 9/4/2022
*/
//dependencies
const server =  require('./lib/server');
const workers = require('./lib/worker');
//const environement = require('./helpers/environments')
//const data = require('./lib/data');
//const { sendTwilioSms } = require('./helpers/notifications');
// app object -  module scaffolding
const app = {};
//eitw pore muche dite hobe
/*
sendTwilioSms('01521217107', 'success', (err) => {
    console.log(`shomossha hoitase giya hoilam`, err);
});
*/
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
app.init = () => {
    //start the server
    server.init()
    //start the workers
    workers.init();
};

app.init();

// export the app
module.exports = app;