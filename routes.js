//title: routes
//description : application routes
//autor shagor
//date: today


//dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler, 
};

module.exports = routes;