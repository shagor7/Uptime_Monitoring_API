//title: token handler
//autor: shagor
// date: 7/4/2022

//dependencies
const data = require('../../lib/data');

const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');
const {createRandomString} = require('../../helpers/utilities');
//const { token } = require('../../routes');

//module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
    
};

handler._token = {};



handler._token.post = (requestProperties, callback) => {
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if(phone && password) {
        data.read('users', phone, (err1, userData) => {
            let hashedpassword = hash(password);
            if(hashedpassword === parseJSON(userData).password) {
                let tokenid = createRandomString(20);
                let expires = Date.now() + 24*60*60*1000;
                let tokenObject = {
                    phone,
                    'id': tokenid,
                    expires
                };
                //store the token
                data.create('tokens', tokenid, tokenObject, (err2) => {
                    if(!err2) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'dhur! server e problem',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'password is not valid',
                });
            }
        });
    } else {
        callback(400, {
            error : 'You have a problem in your request',
        });
    }

};

handler._token.get = (requestProperties, callback) => {
        //check if token id is valid
        const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

        if(id) {
            //lookup the token
            data.read('tokens', id, (err, tokenData) => {
                const token = {...parseJSON(tokenData)};
                if(!err && token) {
                    callback(200, token);
                } else {
                    callback(404, {
                        error: 'requested token was not found',
                    })
                }
            })
        } else {
            callback(404, {
                error: 'requested token was not found',
            });
        }
};

handler._token.put = (requestProperties, callback) => {
    const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

    const extend = typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true ? true : false;

    if(id && extend) {
        data.read('tokens', id, (err1, tokenData) => {
            let tokenObject = parseJSON(tokenData);
            if(parseJSON(tokenData).expires > Date.now()) {
                tokenObject.expires = Date.now() + 24*60*60*1000;
                //store the updated token
                data.update('tokens', id, tokenObject, (err2) => {
                    if(!err2) {
                        callback(200);
                    } else {
                        callback(500, {
                            error: 'dhur server er shomossha',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'dhuro! token er meyad sesh',
                });
            }
        });
    } else {
        callback(404, {
            error: 'request thik koira de beta',
        });
    }

};

handler._token.delete = (requestProperties, callback) => {
    //check the token if valid
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
    if(id) {
        //llokup the token
        data.read('tokens', id, (err1, tokenData) => {
            if(!err1 && tokenData) {
                data.delete('tokens', id, (err2) => {
                    if(!err2) {
                        callback(200, {
                            message : 'token was succesfully deleted! kono error khay nai!',
                        });
                    } else {
                        callback(500, {
                            error : " There was a server side error! ekhon bug khuj!",
                        })
                    }
                } );
            } else {
                callback(500, {
                    error: 'there was a problem in server side', 
                })
            }
        });
    } else {
        callback(400, {
            error: 'there was a problem genius!',
        });
    }
};

handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if(!err && tokenData) {
            if(parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;