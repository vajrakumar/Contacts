/**
 * This view is used to add or delete multi field contact details List like for phone number, website, email and important dates.
 * This uses {@link ContactApp.view.details.TypeListItem} Type list items.
 */
Ext.define('ContactApp.view.details.TypeView', {
    extend: 'Ext.dataview.DataView',
    requires: [
        'ContactApp.view.details.TypeListItem'
    ],

    alias: 'widget.contact-type',
    scrollable: false,
    config: {
        useComponents: true,
        defaultType: 'contact-type-item'
    }
});