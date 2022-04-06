//title: user handler
//autor: shagor
// date: today

//dependencies
const data = require('../../lib/data');

const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities')

//module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
    
};

handler._users = {};



handler._users.post = (requestProperties, callback) => {
    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof requestProperties.body.tosAgreement === 'boolean' && requestProperties.body.tosAgreement > 0 ? requestProperties.body.tosAgreement : false;

    if(firstName && lastName && phone && password && tosAgreement) {
        //make sure the user deosn't already exists
        data.read('users', phone, (err1) => {
            if(err1) {
                //next job
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                }
                //store the user on db
                data.create('users', phone, userObject, (err2) => {
                    if(!err2) {
                        callback(200, {
                            message : 'User was created succesfully!'
                        })
                    } else{
                        callback(500, {error : 'could not create user!'});
                    }
                });
            } else {
                callback(500, {
                    error : 'error in server side',
                })
            }
        });

    } else {
        //console.log(err2)
        callback(400, {
            error: 'you have a problem in your request',
        });
    }
};

handler._users.get = (requestProperties, callback) => {
    //check if the phone number is valid
    const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if(phone) {
        //lookup the user
        data.read('users', phone, (err, us) => {
            const user = {...parseJSON(us)};
            if(!err && user) {
                delete user.password;
                callback(200, user);
            } else {
                callback(404, {
                    error: 'requested user was not found',
                })
            }
        })
    } else {
        callback(404, {
            error: 'requested user was not found',
        });
    }
};

handler._users.put = (requestProperties, callback) => {
    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if(phone) {
        if( firstName || lastName || password) {
            //lookup the user
            data.read('users', phone, (err, usData) => {
                const userData = {...parseJSON(usData)};
                if(!err && userData) {
                    if(firstName) {
                        userData.firstName = firstName;
                    };
                    if(lastName) {
                        userData.lastName = lastName;
                    }
                    if(password) {
                        userData.password = hash(password);
                    }
                    //update database
                    data.update('users', phone, userData, (err2)=> {
                        if(!err2) {
                            callback(200, {
                                message: "user was updated sucesfully",
                            })
                        } else {
                            callback(500, {
                                error: 'there was a problem in server',
                            })
                        }
                    });
                } else {
                    callback(400, {
                        error: 'you have problem in your request',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'you have a problem in your request',
            });
        }
    } else {
        callback(400, {
            error: ' invalid phone number. please try again!',
        });
    }
};

handler._users.delete = (requestProperties, callback) => {
    const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if(phone) {
        //llokup the user
        data.read('users', phone, (err1, userData) => {
            if(!err1 && userData) {
                data.delete('users', phone, (err2) => {
                    if(!err2) {
                        callback(200, {
                            message : 'user was succesfully created! kono error khay nai!',
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

module.exports = handler;