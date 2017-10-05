/**
 * Created by manjunathub on 14/09/15.
 */
var fs = require('fs-extra'),
    cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dwlyyx7qq',
    api_key: '992564594147666',
    api_secret: 'mKTwo6G1GaH7aWnLrWjCr67o64A'
});

var data = {
    uploadAvatar: function (req, res, next) {
        var imageDetails;
        if (req.files) {
            imageDetails = req.files.avatar;
            if (imageDetails.size > 0) {
                fs.exists(imageDetails.path, function (exists) {
                    var fileInfo = data.getFileNameAndExtension(imageDetails.originalFilename),
                        fileName = fileInfo.fileName.replace(/\W+/g, '_') + Date.now() + '.' + fileInfo.extension;

                    if (exists) {
                        req.imageData = {
                            filePath: imageDetails.path,
                            fileName: fileName
                        };
                        next();
                    }
                    else {
                        res.errorMessage = 'Failed to upload avatar. File "' + imageDetails.originalFilename + '" doesn\'t exist at path : ' + imageDetails.path;
                        next(new Error(res.errorMessage));
                    }
                });
            }
            else {
                res.errorMessage = 'Failed to upload avatar. File "' + imageDetails.originalFilename + '" couldn\'t be uploaded as it\'s size is = ' + imageDetails.size;
                next(new Error(res.errorMessage));
            }
        }
        else {
            res.errorMessage = 'Failed to upload avatar. File was not sent';
            next(new Error(res.errorMessage));
        }
    },

    getFileNameAndExtension: function (path) {
        if (path) {
            var list = path.split('/'),
                fileName = list.pop(),
                extension, index;

            index = fileName.lastIndexOf('.');
            extension = index > -1 ? fileName.split('.').pop() : '';

            return {
                fileName: fileName.substring(0, index > -1 ? index : undefined),
                extension: extension
            };
        }
        return '';
    },

    moveAvatarToTempFolder: function (req, res, next) {
        var filePath = req.imageData.filePath,
            fileName = req.imageData.fileName,
            serverConfig = global.App.ServerConfig,
            tempPath = serverConfig.fileServerPath + serverConfig.tempFolder + '/' + fileName,
            inputStream = fs.createReadStream(filePath),
            outputStream = fs.createWriteStream(tempPath);

        delete req.imageData;   //As this is temp information used to pass between internal calls and didnt actually come from req object
        inputStream.pipe(outputStream);

        inputStream.on('end', function () {
            fs.unlinkSync(filePath);
            res.responseData = {
                imageUrl: '/avatar' + serverConfig.tempFolder + '/' + fileName
            };
            next();
        });
    },

    uploadAvatarToCloudinary: function (filePath, fileName, callBack) {
        var me = this;
        cloudinary.uploader.upload(filePath, function (result) {
                if (callBack) {
                    callBack.apply(me, [result]);
                }
            },
            {public_id: fileName}
        );
    },
    uploadAvatarToCloudinary: function (filePath, fileName, callBack) {
        var me = this;
        cloudinary.uploader.upload(filePath, function (result) {
                if (callBack) {
                    callBack.apply(me, [result]);
                }
            },
            {public_id: fileName}
        );
    },

    getAvatarFromCloudinary: function (publicIds, callBack) {
        var me = this;

        publicIds = [].concat(publicIds);

        cloudinary.api.resources_by_ids(publicIds, function (result) {
                if (callBack) {
                    callBack.apply(me, [result]);
                }
            }
        );
    },

    deleteFromCloudinary: function (publicIds, callBack) {
        var me = this;

        publicIds = [].concat(publicIds);

        cloudinary.api.delete_resources(publicIds, function (result) {
            if (callBack) {
                callBack.apply(me, [result]);
            }
        }, {keep_original: false});
    }
};

module.exports = data;