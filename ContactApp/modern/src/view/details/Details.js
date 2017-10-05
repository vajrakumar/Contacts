/**
 * This component uses {@link Ext.layout.container.Card} card layout, holds {@link ContactApp.view.details.View} Contact view and
 * {@link ContactApp.view.details.Form} Contact Form. This is uses {@link Ext.Sheet} Sheet Component.
 *
 * When this component is rendered `initialize` event is fired.
 */
Ext.define('ContactApp.view.details.Details', {
    extend: 'Ext.Sheet',

    requires: [
        'ContactApp.view.details.DetailsController',
        'ContactApp.view.details.Form',
        'ContactApp.view.details.View',
        'Ext.layout.Card'
    ],

    alias: 'widget.contact-details',

    enter: 'right',
    exit: 'right',
    centered: false,
    stretchY: true,
    stretchX: true,

    layout: 'card',

    margin: -8, // To avoid white boundary space outside of sheet, to make it fullscreen

    controller: 'details',

    items: [
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
        initialize: 'initializeConfigs'
    }*/

});