//title: user handler
//autor: shagor
// date: 7/4/22

//dependencies
const data = require('../../lib/data');

const {parseJSON, createRandomString} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environments');

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

    let method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof requestProperties.body.successCodes === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >=1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if(protocol && url && method && successCodes && timeoutSeconds){
        let token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;

        //lookup the user phone by reading the token
        data.read('tokens', token, (err1, tokenData) => {
        if(!err1 && tokenData) {
            let userPhone = parseJSON(tokenData).phone;
            //lookup the user data by reading token
            data.read('users', userPhone, (err2, userData) => {
            if(!err2 && userData) {
                tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
                    if(tokenIsValid) {
                        let userObject = parseJSON(userData);
                        let userChecks = typeof userObject.checks === 'object' && userObject.checks instanceof Array ? userObject.checks : [];

                        if(userChecks.length < maxChecks){
                            let checkid = createRandomString(20);
                            let checkObject = {
                                'id': checkid,
                                userPhone,
                                'protocol': protocol,
                                'url': url,
                                'method': method,
                                "succesCodes": successCodes,
                                "timeoutSeconds": timeoutSeconds,
                            };
                            //save the object
                            data.create('checks', checkid, checkObject, (err3) => {
                                if(!err3){
                                    //add check id to user's object
                                    userObject.checks = userChecks;
                                    userObject.checks.push(checkid);

                                    //save the new user data
                                    data.update('users', userPhone, userObject, (err4) => {
                                        if(!err4)
                                        {
                                            //return the data about the new check
                                            callback(200, checkObject);
                                        } else {
                                            callback(500, {
                                                error: 'server e shomossha',
                                            });
                                        }
                                    });
                                } else {
                                    callback(500, {
                                        error:'server e shomossha',
                                    });
                                }
                            });
                        } else {
                            callback(401, {
                                error: 'limit e thak, limit maxed',
                            });
                        }
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
        });
        } else {
            callback(403, {
                error: 'authentication thik kor',
            });
        }
    });
    } else {
        callback(400, {
            error: 'tor request e shomossha',
        });
    }
};

handler._check.get = (requestProperties, callback) => {
    //check if token id is valid
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if(id) {
        //lookup the check
        data.read('checks', id, (err, checkData) => {
            if(!err && checkData){
                //check if token id is valid
                let token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;
                
                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                    if(tokenIsValid){
                        callback(200, parseJSON(checkData));
                    } else {
                        callback(403, {
                            error: 'authentication thik koren mohashoy!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error:'dhuro server e shomossha',
                });
            }
        });
    } else {
        callback(404, {
            error: 'request thik koira de',
        });
    }
};

handler._check.put = (requestProperties, callback) => {
    const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

    let protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.url : false;

    let url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length  > 0 ? requestProperties.body.protocol : false;

    let method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof requestProperties.body.successCodes === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >=1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if(id) {
        if(protocol || url || method || successCodes || timeoutSeconds){
            data.read('checks', id, (err1, checkData) => {
                if(!err1 && checkData){
                    let checkObject = parseJSON(checkData);
                    const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token: false;

                    tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
                        if(tokenIsValid){
                            if(protocol){
                                checkObject.protocol = protocol;
                            }
                            if(url) {
                                checkObject.url = url;
                            }
                            if(method) {
                                checkObject.method = method;
                            }
                            if(successCodes) {
                                checkObject.succesCodes = successCodes;
                            }
                            if(timeoutSeconds) {
                                checkObject.timeoutSeconds = timeoutSeconds;
                            }
                            //store the chek object
                            data.update('checks', id, checkObject, (err2) => {
                                if(!err2) {
                                    callback(200);
                                } else {
                                    callback(500, {
                                        error: 'areh! server e ghapla',
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                error: 'authentication e ghapla ache tor',
                            })
                        }
                    });
                } else{
                    callback(500, {
                    error: 'server e ghpla ache re!',
                    });
                }
            });
        } else {
            callback(500, {
            error: 'ontoto ekta field de update korte chaile!',
            });
        }
    } else {
        callback(400, {
            error:'request e kahini korsos',
        });
    }
};

handler._check.delete = (requestProperties, callback) => {
    //check if token id is valid
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if(id) {
        //lookup the check
        data.read('checks', id, (err1, checkData) => {
            if(!err1 && checkData){
                //check if token id is valid
                let token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;
                
                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                    if(tokenIsValid){
                        //delete the chek data
                        data.delete('checks', id, (err2) => {
                            if(!err2){
                                data.read('users', parseJSON(checkData).userPhone, (err3, userData) => {
                                    let userObject = parseJSON(userData);
                                    if(!err3 && userData) { 
                                        let userChecks = typeof(userObject.checks) === 'oject' && userObject.checks instanceof Array ? userObject.checks : [];
                                        //remove the deleted check id from user's list of checks

                                        let checkPosition = userChecks.indexOf(id);
                                        if(checkPosition > -1){
                                            userChecks.splice(checkPosition, 1);
                                            //update the user data
                                            userObject.checks = userChecks;
                                            data.update('users', userObject.phone, userObject, (err4) =>{
                                                if(!err4) {
                                                    callback(200);
                                                } else{
                                                    callback(500, {
                                                        error: 'server e jhamela',
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'the check id you are trying to remove was not found in the user',
                                            });
                                        }
                                    } else {
                                        callback(500, {
                                            error: 'server e ghapla',
                                        });
                                    }
                                });
                            } else {
                                callback(500, {
                                    error: 'server e ghapla re',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'authentication thik koren mohashoy!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error:'dhuro server e shomossha',
                });
            }
        });
    } else {
        callback(404, {
            error: 'request thik koira de',
        });
    }
};

module.exports = handler;