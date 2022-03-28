//title: user handler
//autor: shagor
// date: today

//module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'This is a user url',
    });
};

module.exports = handler;