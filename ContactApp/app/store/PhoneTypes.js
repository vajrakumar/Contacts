/**
 * Created by manjunathub on 05/11/15.
 */
Ext.define('ContactApp.store.PhoneTypes', {
    extend: 'Ext.data.Store',

    storeId: 'phone-type-store',

    fields: ['name'],
    data: [
        {
            'name': 'home'
        },
        {
            'name': 'work'
        },
        {
            'name': 'mobile'
        },
        {
            'name': 'pager'
        },
        {
            'name': 'other'
        },
        {
            'name': 'Custom...'
        }
    ]
});