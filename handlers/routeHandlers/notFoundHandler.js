//title: sample handler
//autor: shagor
// date: today

//module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    console.log('Not Found');
    callback(404, {
        message: 'Your requested url not found!',
    })
};

module.exports = handler;