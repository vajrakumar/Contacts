/**
 * This component uses {@link Ext.layout.container.Card} card layout, holds {@link ContactApp.view.details.View} Contact view and
 * {@link ContactApp.view.details.Form} Contact Form.
 *
 * This view uses {@liink ContactApp.view.details.DetailsController} details view container.
 */
Ext.define('ContactApp.view.details.Details', {
    extend: 'Ext.Container',

    alias: 'widget.contact-details',

    requires: [
        'ContactApp.view.details.DetailsController',
        'ContactApp.view.details.Form',
        'ContactApp.view.details.MultiSelectGrid',
        'ContactApp.view.details.View',
        'Ext.container.Container',
        'Ext.layout.container.Card'
    ],

    reference: 'contact-details-container',

    layout: {
        type: 'card'
    },

    controller: 'details',

    items: [
        {
            xtype: 'container',
            html: '<div class="no-contact-selected">Select a contact from list </div>',
            reference: 'contact-no-selection',
            itemId: 'contact-no-selection'
        },
        {
            xtype: 'multi-select-grid',
            itemId:'multi-select-grid',
            bind: {
                store: '{selectedContacts}'
            }
        },
        {
            xtype: 'contact-view',
            itemId:'contact-view'
        },
        {
            xtype: 'contact-form',
            itemId:'contact-form'
        }
    ]/*,
    listeners: {
        afterrender: 'initializeConfigs'
    }*/
});