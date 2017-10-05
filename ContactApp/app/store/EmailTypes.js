/**
 * Created by manjunathub on 05/11/15.
 */
Ext.define('ContactApp.store.EmailTypes', {
    extend: 'Ext.data.Store',

    storeId: 'email-type-store',

    fields: ['name'],
    data: [
        {
            'name': 'home'
        },
        {
            'name': 'work'
        },
        {
            'name': 'other'
        },
        {
            'name': 'Custom...'
        }
    ]
});