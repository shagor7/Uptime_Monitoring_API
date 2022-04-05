/*
title =  utilities
description: important utility functins
author: shagor
date 5th april, 2022
*/

///module scaffolding
const crypto = require('crypto');
const utilities = {};
const environements = require('./environments');

//parse JSON string to object
utilities.parseJSON = (jsonString) => {
    let output = {};

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }

    return output;
}

//hashing string

utilities.hash = (str) => {
    if(typeof(str) === 'string' && str.length > 0) {
        const hash = crypto
        .createHmac('sha256', environements.secretKey)
        .update(str)
        .digest('hex');
        return hash;
    } else {
        return false;
    }
};

// export module
module.exports =  utilities;