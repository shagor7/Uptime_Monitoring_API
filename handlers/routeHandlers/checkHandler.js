//title: user handler
//autor: shagor
// date: 7/4/22

//dependencies
const data = require('../../lib/data');

const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

//module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
    
};

handler._check = {};



handler._check.post = (requestProperties, callback) => {
    //validate inputs
    let protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.url : false;

    let url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length  > 0 ? requestProperties.body.protocol : false;

    let method = typeof requestProperties.body.method === 'string' && ['get', 'post', 'put', 'delete'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof requestProperties.body.successCodes === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >=1 && requestProperties.body.timeoutSeconds <=5 ? requestProperties.body.timeoutSeconds : false;

    if(protocol && url && method && successCodes && timeoutSeconds){
        let token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;

        //lookup the user phone by reading the token
        data.read('tokens', token, (err1, tokenData) => {});
        if(!err1 && tokenData) {
            let userPhone = parseJSON(tokenData).phone;
            //lookup the user data
            data.read('users', userPhone, (err2, userData) => {});
            if(!err2 && userData) {
                tokenHandler._token.verify(token, phone, (tokenIsValid) => {
                    if(tokenIsValid) {
                        let userObject = parseJSON(userData);
                        let userChecks = 
                    } else {
                        callback(400, {
                            error: 'authentication e bole valid na!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'user e pay nai bole!',
                });
            }
        } else {
            callback(403, {
                error: 'authentication thik kor',
            });
        }
    } else {
        callback(400, {
            error: 'tor request e shomossha',
        });
    }
};

handler._check.get = (requestProperties, callback) => {
};

handler._check.put = (requestProperties, callback) => {
};

handler._check.delete = (requestProperties, callback) => {
};

module.exports = handler;