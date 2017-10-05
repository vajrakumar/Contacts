/**
 * This class is the view Model for contact view of the application
 */
Ext.define('ContactApp.view.main.ContactModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.contact',

    requires: [
        'ContactApp.model.Contact'
    ],

    stores: {
        /**
         * This store is used to hold list of contact's details.
         */
        contacts: {
            model: 'ContactApp.model.Contact',
            autoLoad: true,
            sorters: ['firstName', 'middleName', 'lastName'],
            grouper: {
                groupFn: function (record) {
                    return (record.data.firstName[0] || '').toUpperCase();
                }
            }
        },

        selectedContacts: {
            source: '{contacts}',
            filters: [
                function (item) {
                    return item.get('selected');
                }
            ]
        }
    },

    data: {
        selectCount: 0
    },

    formulas: {
        /**
         *  Holds the selected Contact record from the contact list.
         */
        selectedContact: {
            bind: {
                bindTo: '{contact-list.selection}',
                deep: true
            },
            get: function (contact) {
                if(contact) {
                    return contact
                }
                else {
                    return Ext.create('ContactApp.model.Contact');
                }

            }
        }
    }
});