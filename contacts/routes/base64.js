/**
 *
 */

var fs = require('fs-extra'),
    http = require('http'),
    request = require('request'),
    data;

data = {
    convertFileToBase64String: function (filePath, callBack, scope) {
        var me = this,
            fileData;
        if (typeof callBack === 'function') {
            fs.readFile(filePath, function (err, fileData) {
                if (err) {
                    callBack.apply(scope || me, [false, err]);
                }
                else {
                    callBack.apply(scope || me, [true, fileData.toString('base64')]);
                }
            });
        }
        else {
            try {
                fileData = fs.readFileSync(filePath, 'base64');
                return fileData;
            }
            catch (e) {
                throw (new Error);
            }
        }
    },

    convertBase64StringToFile: function (filePath, fileData, callBack, scope) {

        var me = this;

        fileData = (fileData instanceof Buffer) ? fileData : new Buffer(fileData, 'base64');

        if (typeof callBack === 'function') {
            fs.writeFile(filePath, fileData, function (err) {
                if (err) {
                    callBack.apply(scope || me, [false, err]);
                }
                else {
                    callBack.apply(scope || me, [true, saveFilePath]);
                }
            });
        }
        else {
            try {
                fs.writeFileSync(filePath, fileData);
            }
            catch (e) {
                throw (new Error);
            }
            return filePath;
        }
    },

    convertRemoteFileToBase64String: function (filePath, callBack, scope, options) {
        var me = this, serverConfig = global.App.ServerConfig,
            tempPath = serverConfig.fileServerPath + serverConfig.tempFolder + '/' + Date.now() + '.jpg';

        request
            .get(filePath)
            .pipe(fs.createWriteStream(tempPath, {defaultEncoding: 'base64'}))
            .on('close', function () {
                var fileData = me.convertFileToBase64String(tempPath);
                callBack.apply(scope || me, [null, fileData, options]);
            })
            .on('error', function (error) {
                callBack.apply(scope || me, [error, null, options]);
            });
    }
};

module.exports = data;