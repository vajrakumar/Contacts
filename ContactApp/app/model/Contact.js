/**
 *  This model is used to hold the contact's personal information.
 */
Ext.define('ContactApp.model.Contact', {
    extend: 'ContactApp.model.Base',
    requires: [
        'ContactApp.model.Details',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.validator.Length',
        'Ext.data.writer.Json'
    ],

    idProperty: 'id',

    fields: [
    /**
     * Identifier and primary key
     */
        {name: 'id', type: 'int'},

    /**
     * Prefix used for the contact user name
     */
        {name: 'prefix', type: 'string'},
    /**
     * First name (Mandatory)
     */
        {
            name: 'firstName',
            type: 'string',
            default: 'New Contact',
            validators: {
                type: 'length',
                min: 1
            }
        },
    /**
     * Middle name (optional)
     */
        {name: 'middleName', type: 'string'},
    /**
     * Last name (optional)
     */
        {name: 'lastName', type: 'string'},
    /**
     * Organization name (optional)
     */
        {name: 'organization', type: 'string'},
    /**
     * Designation (optional)
     */
        {name: 'designation', type: 'string'},
    /**
     * Street address (optional)
     */

        {name: 'streetAddress', type: 'string'},
    /**
     * Extended address (optional)
     */
        {name: 'extendedAddress', type: 'string'},
    /**
     * City  (optional)
     */
        {name: 'city', type: 'string'},
    /**
     * State  (optional)
     */
        {name: 'state', type: 'string'},
    /**
     * Country  (optional)
     */
        {name: 'country', type: 'string'},
    /**
     * Pincode (optional)
     */
        {name: 'pincode', type: 'int'},
    /**
     * avatar Url
     */
        {name: 'imageUrl', type: 'string'},

    /**
     * Selected flag is used to display multiple selection grid. While performing update or save operation it has to be deleted from the record
     */
        {name: 'selected', type: 'boolean'}
    ],

    /**
     * Associated Stores
     */
    hasMany: [
        {
            name: 'phoneNumbers',
            model: 'ContactApp.model.Details',
            primaryKey: 'id',
            foreignKey: 'contactId',
            associationKey: 'phoneNumbers'
        },
        {
            name: 'emails',
            model: 'ContactApp.model.Details',
            primaryKey: 'id',
            foreignKey: 'contactId',
            associationKey: 'emails'
        },
        {
            name: 'urls',
            model: 'ContactApp.model.Details',
            primaryKey: 'id',
            foreignKey: 'contactId',
            associationKey: 'urls'
        },
        {
            name: 'dates',
            model: 'ContactApp.model.Details',
            primaryKey: 'id',
            foreignKey: 'contactId',
            associationKey: 'dates'
        }
    ],
    proxy: {
        url: '/contacts',
        type: 'rest',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',

            /**
             * Custom transform function.
             * If new record then associated store data is also returned else only current record data is returned.
             */
            transform: {
                fn: function (data, operation) {
                    var record = operation.getRecords()[0];

                    // check for new record.
                    if (record.get('id') < 0) {
                        data = record.getData(true);
                    }

                    /**
                     * remove  `selected` property before save from the data (This property is used to
                     */
                    delete data.selected;
                    return data;
                }
            }
        }
    }

});