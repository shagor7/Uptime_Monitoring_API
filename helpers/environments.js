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
};

environemnts.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'rogahs',
};

//determine which environement was passed

const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

//export corresponding environment object
const environmentToExport = typeof(environemnts[currentEnvironment]) === 'object' ? environemnts[currentEnvironment] : environemnts.staging;

//export modeule
module.exports =environmentToExport;