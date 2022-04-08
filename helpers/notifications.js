/*
* title: notifications library
*description: important functions to notify users
*author: shagor
*date: 8/4/22
*/

//dependencies
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./environments');

//module scafoolding
const notifications = {};

//send sms to user using twilio api
notifications.sendTwilioSms = (phone, message, callback) => {
    //input validation
    const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;

    const userMessage = typeof message === 'string' && message.trim().length > 0 && message.trim().length <= 1600 ? message.trim() : false;

    if(userPhone && userMessage) {
        // configure the request payload
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMessage,
        };
        //stringify the payload
        const stringifyPayload =  querystring.stringify(payload);
        //configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
    //instantiate the request object
    const req = https.request(requestDetails, (res) => {
        //get the status of the sent request
        const status =  res.statusCode;
        // callback succesfully if the request went through
        if(status === 200 || status === 201) {
            callback(false);
        } else {
            callback(`Status code returned was ${status}`);
        }
    });

    req.on('error', (e) => {
        callback(e);
    });

    req.write(stringifyPayload);
    req.end();

    } else {
        callback('jei parameter gula lagbo oigula shob des nai naile vul disos!');
    }
};

//export the module
module.exports =  notifications;