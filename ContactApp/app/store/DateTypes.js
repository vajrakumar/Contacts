/**
 * Created by manjunathub on 05/11/15.
 */
Ext.define('ContactApp.store.DateTypes', {
    extend: 'Ext.data.Store',

    storeId: 'date-type-store',

    fields: ['name'],
    data: [
        {
            'name': 'Birthday'
        },
        {
            'name': 'Anniversary'
        },
        {
            'name': 'Met On'
        },
        {
            'name': 'Custom...'
        }
    ]
});