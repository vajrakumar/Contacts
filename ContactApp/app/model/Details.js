/**
 * This model is used to hold information like Phone Number, Emails, websites and Important Dates (currently in future it can be used for adding new
 * fields also).
 */

Ext.define('ContactApp.model.Details', {
    extend: 'ContactApp.model.Base',

    requires: [
        'ContactApp.validator.ContactValidator',
        'Ext.data.proxy.Rest'
    ],

    fields: [
    /**
     *  Identifier
     */
        {name: 'id'},

    /**
     *  Foreign key for Contact user Model
     */
        {name: 'contactId', allowBlank: false},

        //Type of view (i.e phone->Phone Number, email->Emails, url->Websites and date-> Important Dates

    /**
     *  Represent type of contact information. Currently it supports phoneNumbers, emails, urls and dates
     */
        {name: 'viewType', type: 'string'},
        // Label names

    /**
     * Represents the custom title of the contact field
     */
        {name: 'type', type: 'string'},

    /**
     * Stores the value of the contact like phone number's, email-id's, website names and important dates.
     */
        {
            name: 'value',
            convert: function (value, rec) {
                if (rec.get('viewType') === 'date') {
                    value = new Date(value);
                }
                return value;
            }
        }
    ],

    /**
     * This method is used to perform custom validation on passed value. It internally uses  {@link ContactApp.validator.ContactValidator}
     * @param value {Object} value
     * @returns {String|Boolean} true if the value is valid. A string may be returned if the value is not valid, to indicate an error message.
     */
    customValidate: function (value) {
        var contactValidator = Ext.create('ContactApp.validator.ContactValidator');
        return contactValidator.validate(value, this);
    },

    /**
     * Rest proxy
     */
    proxy: {
        type: 'rest',
        url: '/contacttype',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});