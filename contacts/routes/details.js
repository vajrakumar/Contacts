var Details = require('../collections/details').collection;
var Detail = require('../models/details').model;

var data = {

    /**
     * Get contact details by contact id
     * @param req express request object
     * @param res express response object
     * @param next express next callback
     */
    getContactsDetailsById: function (req, res, next) {
        Details.forge().query(function (qb) {
                qb.orderByRaw('lower(view_type), lower(type)');
                qb.where({contact_id: req.params.id})
            })
            .fetch()
            .then(function (collection) {
                var obj = {
                    emails: collection.where({viewType: 'email'}),
                    phoneNumbers: collection.where({viewType: 'phone'}),
                    dates: collection.where({viewType: 'date'}),
                    urls: collection.where({viewType: 'url'})
                };
                res.responseData = obj;
                next();

            }, function (err) {
                res.errorMessage = 'Sorry, failed to get details for the contact.';
                next(err);
            });
    },

    /**
     * Add / Update contact detail by contact detail id
     * @param req express request object
     * @param res express response object
     * @param next express next callback
     */
    createOrUpdateContacts: function (req, res, next) {
        var contactDetails = req.body;

        //get contact detail id from URL in case of update request, null otherwise
        contactDetails.id = req.params.id || null;

        Detail.forge(contactDetails)
            .save()
            .then(function (model) {
                res.responseData = model.toJSON();
                next();
            }, function (err) {
                res.errorMessage = 'Sorry, failed to ' + (contactDetails.id ? 'update' : 'add') + ' contact detail.';
                next(err);
            });
    },

    /**
     * Delete contact detail by contact detail id
     * @param req express request object
     * @param res express response object
     * @param next express next callback
     */
    deleteContacts: function (req, res, next) {
        Detail.forge({
                id: req.params.id
            })
            .destroy()
            .then(function (model) {
                res.responseData = model.toJSON();
                next();
            }, function (err) {
                res.errorMessage = 'Sorry, failed to delete contact detail.';
                next(err);
            });
    }
};

module.exports = data;