/**
 *  Contacts model to fetch contact details of individual contact.
 */
var Bookshelf = global.App.BookShelfModel;

exports.model = Bookshelf.extend({
    tableName: "contactdetails",
    idAttribute: 'id',
    //hasTimestamps: ['created_at', 'updated_at'],
    contacts: function(){
        var PersonalDetails = require('./personal').model;
        return this.belongsTo(PersonalDetails);
    }
});