//dependencies
const fs =  require('fs');
const path = require('path');

//module scaffolding
const lib = {};

//base directory of the data folder
lib.basedir = path.join(__dirname, '/../.data/'); //path.join is to create path

//write data to file
lib.create = (dir, file, data, callback) => {
    //open file for writting
    fs.open(`${lib.basedir+dir}/${file}.json`,'wx', (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            //convert data to string
            const stringData = JSON.stringify(data);

            //write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if(!err2){
                    fs.close(fileDescriptor, (err3) => {
                        if(!err3){
                            callback(false);
                        }else{
                            callback('Error closing the new file!');
                        }
                    });
                }else {
                    callback('Error Writting to new file ');
                }
            });
        } else {
            callback('error! file may exist!');
        }
    });
}
//read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir+dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

//update existing file
lib.update = (dir, file, data, callback) => {
    //file open for writing
    fs.open(`${lib.basedir+dir}/${file}.json`,'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            //convert the data to string
            const stringData = JSON.stringify(data);
            //truncate the file means file khali kora
            fs.ftruncate(fileDescriptor, (err1) => {
                if(!err1) {
                    //write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err2) => {
                        if(!err2) {
                            //close the file
                            fs.close(fileDescriptor, (err3) => {
                                if(!err3){
                                    callback(false);
                                } else {
                                    callback('Error closing file!');
                                }
                            })
                        } else {
                            callback('Error writting file');
                        }
                    })
                } else {
                    callback('Error truncating file!');
                }
            });
        };
    });
};

//delete existing file
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir+dir}/${file}.json`, (err) => {
        if(!err){
            callback(false);
        } else{
            callback('error deleting file');
        }
    });
};
module.exports = lib;