/**
 *  Contacts model to fetch contact information.
 */

var Details = require('./details').model,
    Bookshelf = global.App.BookShelfModel;

exports.model = Bookshelf.extend({
    tableName: "contacts",
    idAttribute: 'id',

    initialize: function(attributes, options) {

        if(attributes && attributes.image_url) {
            var serverConfig = global.App.ServerConfig,
                path = '/avatar' + serverConfig.fileServerPath + serverConfig.profileFolder + serverConfig.profileSubFolder + "/" + attributes.image_url;

            attributes.image_url = path;
        }
    },

    contactDetails: function(){
        return this.hasMany(Details, 'contact_id')
    },

    emails: function(){
        return this.contactDetails().query(function(qb){
            qb.orderByRaw('lower(type)');
            qb.where({view_type: 'email'})
        })
    },

    phoneNumbers: function(){
        return this.contactDetails().query(function(qb){
            qb.orderByRaw('lower(type)');
            qb.where({view_type: 'phone'})
        });
    },

    urls: function(){
        return this.contactDetails().query(function(qb){
            qb.orderByRaw('lower(type)');
            qb.where({view_type: 'url'})
        });
    },

    dates: function(){
        return this.contactDetails().query(function(qb){
            qb.orderByRaw('lower(type)');
            qb.where({view_type: 'date'})
        });
    }

});