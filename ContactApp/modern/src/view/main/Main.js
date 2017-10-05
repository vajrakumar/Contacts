/**
 * This is the main view of the Application for modern toolkit.
 *
 * This Component uses 'fit' layout. It contains {@link ContactApp.view.list.List} Contact List and
 *  {@link ContactApp.view.details.Details} details container.
 *
 * This container contains a {@link ContactApp.view.main.ContactModel} ContactApp.view.main.ContactModel as a contact view model
 * to perform 2-way data binding.
 *
 * By default list of contacts.
 */
Ext.define('ContactApp.view.main.Main', {
    extend: 'Ext.Container',
    alias: 'widget.app-main',

    requires: [
        'ContactApp.view.details.Details',
        'ContactApp.view.list.List',
        'ContactApp.view.main.ContactModel',
        'Ext.MessageBox',
        'Ext.Toast',
        'Ext.tab.Panel'
    ],

    viewModel: 'contact',

    layout: {
        type: 'fit'
    },

    fullscreen: true,
    padding: 0,

    items: [
        {
            xtype: 'contact-list'
        },
        {
            xtype: 'contact-details',
            hidden: true
        }
        ]
});
