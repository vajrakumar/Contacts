/**
 * Created by manjunathub on 27/09/15.
 */
var fs = require('fs-extra'),
    log4js = require('log4js'),
    data,
    logger = log4js.getLogger();

data = {

    clearTempFiles: function () {
        var serverConfig = global.App.ServerConfig,
            path = serverConfig.fileServerPath + serverConfig.tempFolder,
            startDate = new Date();

        startDate.setDate(startDate.getDate() - 2);
        fs.readdir(path, data.deleteFoldersAndFiles);
    },

    logStatus: function (err) {
        if (err) {
        logger.trace('********Deleting Temp Files Error Start********');
        logger.error(err);
        logger.trace('********End********');
    }
    else {
        console.log('Deleted successfully');
}
    },

    deleteFoldersAndFiles: function (err, files) {
        if (err) {
            data.logStatus(err);

        }
        else {
            var len = files.length,
                serverConfig = global.App.ServerConfig,
                path = serverConfig.fileServerPath + serverConfig.tempFolder,
                startDate = new Date(),
                file, stat;

            startDate.setDate(startDate.getDate() - 2);

            try {
                while (--len > -1) {
                    file = files[len];
                    stat = fs.statSync(path + '/' + file);
                    if (stat.mtime < startDate) {
                        if (stat.isDirectory()) {
                            fs.remove(path + '/' + file, data.logStatus);
                        }
                        else {
                            fs.unlink(path + '/' + file, data.logStatus);
                        }
                    }
                }
            }
            catch (e) {
                data.logStatus(e);
            }
        }

    }
};

module.exports = data;