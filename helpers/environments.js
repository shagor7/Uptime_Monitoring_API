// titile: environemnts
//description: handle all environment
// author: SHagor
// date: today

//dependencies

//module scaffolding
const environemnts = {};

environemnts.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'shagor',
    maxChecks: 5,
    twilio: {
        fromPhone: '+16672958529',
        accountSid: 'ACe9d963f38af751dad1ae943d21cf7d0d',
        authToken: '4f1db9b114ccca5cd48ef0e0d874d4a3',
    },
};

environemnts.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'rogahs',
    maxChecks: 5,
    twilio: {
        fromPhone: '+16672958529',
        accountSid: 'ACe9d963f38af751dad1ae943d21cf7d0d',
        authToken: '4f1db9b114ccca5cd48ef0e0d874d4a3',
    },
};

//determine which environement was passed

const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

//export corresponding environment object
const environmentToExport = typeof(environemnts[currentEnvironment]) === 'object' ? environemnts[currentEnvironment] : environemnts.staging;

//export modeule
module.exports =environmentToExport;