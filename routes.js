//title: routes
//description : application routes
//autor shagor
//date: today


//dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');

const routes = {
    'sample': sampleHandler,
};

module.exports = routes;