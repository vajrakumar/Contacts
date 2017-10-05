/**
 * This is the collection of contact details like phone numbers, emails, important dates and urls.
 */

var Details = require('../models/details').model;
exports.collection = global.App.BookShelf.Collection.extend({
    model: Details
});