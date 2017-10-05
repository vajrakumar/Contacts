var vCard = require('./transfer/vCard'),
    contact = require('./personal'),
    fs = require('fs-extra'),
    underscore = require('underscore'),

    path = require('path');

var data = {
    /*importContact: function (req, res, next) {
     var files = req.files,
     key, file;

     for (key in files) {
     file = files[key];

     vCard.importContact(file, function (err, contacts) {
     var len = contacts.length,
     processedContactCount = len;
     while (--len > -1) {
     contact.insertIndividualContact(contacts[len], function () {
     if (--processedContactCount === 0) {
     res.responseData = "Done";
     next();
     }
     });
     }
     });
     }
     },*/

    importContact: function (req, res, next) {
        req.files = underscore.toArray(req.files);
        req.currentIndex = 0;
        req.newContacts = [];
        data.injectFile(req, res, next);
    },

    injectFile: function (req, res, next) {
        var files = req.files,
            index = req.currentIndex,
            newContacts = req.newContacts;
        if (index < files.length) {
            vCard.importContact(files[index], function (err, contacts) {
                if (err) {
                    res.errorMessage = 'Failed to import contacts. Error while reading file.';
                    return next(new Error(res.errorMessage));
                }
                req.newContacts = newContacts.concat(contacts);
                req.currentIndex = ++index;
                data.injectFile(req, res, next);
            });
        } else {
            req.currentIndex = 0;
            data.injectContact(req, res, next);
        }
    },

    injectContact: function (req, res, next) {
        var newContacts = req.newContacts,
            index = req.currentIndex;
        if (index < newContacts.length) {
            req.body = newContacts[index];
            contact.insertIndividualContact(req, res, function (err) {
                if (err) {
                    res.errorMessage = 'Failed to import contacts. Error while processing contact data.';
                    return next(err);
                }
                contact.saveContact(req, res, function (err) {
                    if (err) {
                        res.errorMessage = 'Failed to import contacts. Error while saving contact.';
                        return next(err);
                    }
                    req.currentIndex = ++index;
                    data.injectContact(req, res, next)
                });
            });
        } else {
            res.responseData = 'All contacts were imported successfully.';
            next();
        }
    },


    exportContact: function (req, res, next) {

        var me = this,
            contacts = res.responseData,
            mode = req.body.mode,
            len = contacts.length,
            contact,
            fileName = '';
        if (len > 0) {
            contact = contacts[0];

            fileName = (contact.prefix ? (contact.prefix + '_' ) : '') + contact.firstName + '_' + (contact.middleName || '') + '_' + (contact.lastName || '');

            if (len === 2) {
                contact = contacts[1];
                fileName += '_and_' + (contact.prefix ? (contact.prefix + '_' ) : '') + contact.firstName + '_' + (contact.middleName || '') + '_' + (contact.lastName || '');
            }
            else if (len > 2) {
                fileName = fileName + '_and_' + (len - 1) + '_other_contacts';
            }
            fileName = fileName.replace(/(_)(?=\1)/gi, "");

        }

        vCard.exportContact(
            contacts,
            mode,
            fileName,
            function (err, filePath, exprtfileName) {
                if (err) {
                    res.errorMessage = 'Failed to export vcard ' + exprtfileName;
                    next(new Error(err));
                }
                else {
                    var serverConfig = global.App.ServerConfig,
                        path = serverConfig.tempFolder + '/' + exprtfileName;

                    res.responseData = {
                        url: '/export' + path
                    };
                    next();
                }
            },
            me
        );
    }
};

module.exports = data;