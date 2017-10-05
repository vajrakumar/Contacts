//Note: For new contacts and contactdetails Id's are -ve

var Contacts = require('../collections/personal').collection,
    Contact = require('../models/personal').model,
    avatarUploader = require('./avatarUploader'),
    fs = require('fs-extra');

var data = {

    /**
     * Get all or contacts for given ids
     * @param req express request object
     * @param res express response object
     * @param next express next callback
     */
    getContacts: function (req, res, next) {
        var me = this,
            ids = req.body.ids; //In export contact ids of contacts are sent to bring only those contacts

        Contacts
            .forge()
            .query(function (qb) {
                qb.orderByRaw('lower(first_Name), lower(middle_name), lower(last_name) ASC');
                if (ids) {
                    ids = [].concat(ids);
                    if (ids.length > 0) {
                        qb.whereIn('id', ids);
                    }
                }
            })
            .fetch({
                withRelated: ['emails', 'phoneNumbers', 'urls', 'dates']
            })
            .then(
                function (collection) {
                    res.responseData = collection.toJSON();
                    next();
                },
                function (err) {
                    res.errorMessage = 'Sorry, failed to load contacts. Please try again later.';
                    next(err);
                });
    },

    /**
     * Get contact by it's id
     * @param req express request object
     * @param res express response object
     * @param next express next callback
     */
    getContactById: function (req, res, next) {
        var me = this,
            id = req.body.id || req.params.id; //In POST methods id will be in req.body. For GET methods id will be in params as it will be part of URL

        Contact.forge()
            .query(function (qb) {
                qb.whereIn('id', [].concat(id));
            })
            .fetch({
                require: true,  //Throw error when no contact found for given ids
                withRelated: ['emails', 'phoneNumbers', 'urls', 'dates']
            })
            .then(
                function (model) {
                    res.responseData = model.toJSON();
                    next();
                },
                function (err) {
                    res.errorMessage = 'Sorry, failed to load requested contact(s).';
                    next(err);
                }
            );
    },

    /**
     * Process contact data in request body before updating it to DB
     * @param req express request object
     * @param res express response object
     * @param next express next callback
     */
    updatePersonalInformation: function (req, res, next) {
        var me = this,
            contact = req.body;

        //get contact id from URL
        contact.id = req.params.id;

        if (contact.imageUrl && contact.imageUrl.length > 0) {
            var imageName = contact.imageUrl.split('/').pop(),
                serverConfig = global.App.ServerConfig,
                path = serverConfig.fileServerPath + serverConfig.tempFolder + '/' + imageName;

            avatarUploader.uploadAvatarToCloudinary(path, imageName, function (result) {
                if (result.error) {
                    res.errorMessage = 'Sorry, failed to update contact. Error while uploading avatar.';
                    next(new Error(result.error)); //As error is a string here, can't be passed directly to next method, so create a new error instances with that message
                }
                else {
                    contact.imageUrl = global.isSecureConnection ? result.secure_url : result.url;
                    next();
                }
            });
        }
        else {
            next();
        }
    },

    /**
     * Delete contact from DB by it's id
     * @param req request object
     * @param res response object
     * @param next express next function
     */
    deleteUser: function (req, res, next) {
        /**
         * Fetch the contact from DB first to get imageURL,
         * then send delete request with that URL to Cloudinary
         * and then delete that Contact from DB
         */
        Contact.forge()
            .query({
                where: {
                    id: req.params.id //get contact id from URL
                }
            })
            .fetch({
                require: true
            })
            .then(function (contact) {
                var imageUrl = contact.get('imageUrl'),
                    publicId;

                if (imageUrl) {
                    publicId = imageUrl.split('/').pop();
                    avatarUploader.deleteFromCloudinary(publicId.replace(/\.[^\.]+$/, ''));
                }

                contact
                    .destroy()
                    .then(function (model) {
                        res.responseData = model.toJSON();
                        next();
                    }, function (err) {
                        res.errorMessage = 'Sorry, failed to delete the contact.';
                        next(err);
                    });

            }, function (err) {
                res.errorMessage = 'Sorry, failed to delete the contact. Error while deleting avatar.';
                next(err);
            });
    },

    /**
     * Delete all contacts from DB
     * @param req request object
     * @param res response object
     * @param next express next function
     */
    deleteAll: function (req, res, next) {
        Contact.where('id', '!=', '0').destroy().then(function () {
            res.responseData = 'Done';
            next();
        }, function (err) {
            res.errorMessage = 'Failed to delete all contacts.';
            next(err);
        });
    },

    /**
     * Process contact data in request body before updating it to DB
     * @param req request object
     * @param res response object
     * @param next express next function / internal callback in case of import contacts
     */
    insertIndividualContact: function (req, res, next) {

        //debugger;

        var contact = req.body,
            contactDetails = [],
            serverConfig = global.App.ServerConfig,
            prop, imageName, path;

        //As new contact id is auto generated from DB, set it to null
        contact.id = null;

        for (prop in contact) {
            if (contact[prop] && contact[prop].constructor.name === 'Array') {
                contactDetails = contactDetails.concat(contact[prop]);
                delete contact[prop];
            }
        }

        if (contact.imageUrl) {
            imageName = contact.imageUrl.split('/').pop();
            path = serverConfig.fileServerPath + serverConfig.tempFolder + '/' + imageName;

            avatarUploader.uploadAvatarToCloudinary(path, imageName, function (result) {
                if (result.error) {
                    res.errorMessage = 'Sorry, failed to add contact. Error while uploading avatar.';
                    next(new Error(result.error)); //As error is a string here, can't be passed directly to next method, so create a new error instances with that message
                }
                else {
                    contact.imageUrl = global.isSecureConnection ? result.secure_url : result.url;
                    req.contactDetails = contactDetails;
                    next();
                }
            })
        }
        else {
            req.contactDetails = contactDetails;
            next();
        }
    },

    /**
     * Insert contact data into DB
     * @param req request object
     * @param res response object
     * @param next express next function / internal callback in case of import contacts
     */
    saveContact: function (req, res, next) {
        var me = this,
            contactDetails = req.contactDetails || [],
            contact = req.body;

        Contact
            .forge(contact)
            .save()
            .then(function (contactModel) {

                    var len = contactDetails.length;

                    //update contact id in request body
                    contact.id = contactModel.get('id');

                    if (len > 0) {

                        /**
                         * Assign new contact id to each contact details object and set contact detail's id to null.
                         * contact id is foreign key for contact detail
                         */
                        while (--len > -1) {
                            contactDetails[len].contactId = contact.id;
                            contactDetails[len].id = null;
                        }

                        require('../collections/details').collection.forge(contactDetails).invokeThen('save', null);
                    }

                    next();
                },
                function (err) {
                    res.errorMessage = 'Sorry, failed to ' + (contact.id ? 'update' : 'add') + ' contact.';
                    next(err);
                });
    }
};

module.exports = data;