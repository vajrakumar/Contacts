/**
 * This is the collection of Contacts in the application
 */


var Contact = require('../models/personal').model;
exports.collection = global.App.BookShelf.Collection.extend({
    model: Contact
});