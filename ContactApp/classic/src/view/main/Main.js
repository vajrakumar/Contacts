/**
 * This class is the main view of the application for a classic toolkit.
 *
 * This Component uses 'border' layout. West Panel contains {@link ContactApp.view.list.List} Contact List and
 * center panel contains contact {@link ContactApp.view.details.Details} details container.
 *
 * This container contains a {@link ContactApp.view.main.ContactModel} ContactApp.view.main.ContactModel as a contact view model
 * to perform 2-way data binding.
 */

Ext.define('ContactApp.view.main.Main', {
    extend: 'Ext.Container',

    requires: [
        'ContactApp.view.details.Details',
        'ContactApp.view.list.List',
        'ContactApp.view.main.ContactModel',
        'Ext.layout.container.Border',
        'Ext.layout.container.Fit',
        'Ext.plugin.Viewport',
        'Ext.tab.Panel'
    ],

    alias: 'widget.app-main',

    layout: {
        type: 'border'
    },

    plugins: 'viewport',

    viewModel: 'contact',

    items: [
        {
            region: 'west',
            xtype: 'contact-list',
            minWidth: 200,
            width: '23%',
            split: {
                size: 5
            }
        },
        {
            region: 'center',
            layout: 'fit',
            width: '73%',
            scrollable: true,
            items: [
                {
                    xtype: 'contact-details'
                }
            ]
        }
    ]
});
