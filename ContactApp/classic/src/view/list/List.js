/**
 *  This class is used to display list of available contacts in the {@link Ext.grid.Panel} grid panel.
 *  This view uses {@link ContactApp.view.list.ListController} ContactApp.view.list.ListController as a view controller.
 *  This provides an ability to search contact using {@link ContactApp.ux.Search} Search field.
 *  This view uses Single selection mode.
 *
 *  It is uses {@link Ext.grid.column.Template} template column to display contact name.
 *
 *  It uses {@link ContactApp.view.main.ContactModel#store} Contact Store.
 */

Ext.define('ContactApp.view.list.List', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.contact-list',

    requires: [
        'ContactApp.ux.Search',
        'ContactApp.view.list.ListController',
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.grid.column.Template',
        'Ext.window.Toast'
    ],

    reference: 'contact-list',

    controller: 'list',
    viewConfig: {
        emptyText: 'No Contacts',
        loadMask: true
    },
    selModel: {
        mode: 'MULTI'
    },

    rowLines: false,
    /**
     * Config to hide grid header.
     */
    hideHeaders: true,
    tbar: [
        {
            xtype: 'search-field',
            emptyText: 'Search...',
            toolTip: 'Search Contact',
            flex: 1,
            listeners: {
                search: 'searchContact'
            }
        },
        {
            xtype: 'button',
            itemId: 'addContactButton',
            glyph: 'xf067@FontAwesome',
            tooltip: 'Add New Contact',
            handler: 'addContactHandler'
        },
        /*{
            xtype: 'button',
            arrowCls: '',
            glyph: 'xf078@FontAwesome',
            menu: {
                items: [
                    {
                        text: 'Import',
                        glyph: 'xf093@FontAwesome',
                        handler: 'importContact'
                    }
                ]
            }
        },*/
        {
           // text: 'Import',
            glyph: 'xf093@FontAwesome',
            tooltip: 'Import Contact',
            handler: 'importContact'
        },
        {
            xtype: 'container',
            html: '<i class="fa fa-spinner fa-pulse fa-2x"></i>',
            hidden: true,
            reference: 'export-status-container',
            exportCount: 0
        }
    ],

    columns: [
        {
            xtype: 'templatecolumn',
            tpl: Ext.create("Ext.XTemplate", [
                '<div class="contact-thumb-list">',
                '<div class="contact-list-avatar-container">',
                '<tpl if = "Ext.isEmpty(values.imageUrl)">',
                '<i class="fa fa-user fa-3x"></i>',
                '<tpl else>',
                '<img src="{imageUrl}" onload="ContactApp.utils.Helper.scaleImage(this, 50, 50, false)" />',
                '</tpl>',
                '</div>',
                '<div class="contact-list-full-name">',
                '<tpl if = "!Ext.isEmpty(values.prefix)">',
                '{[Ext.String.htmlEncode(values.prefix)]}.&nbsp;',
                '</tpl>',
                '{[Ext.String.htmlEncode(values.firstName)]}',
                '<tpl if = "!Ext.isEmpty(values.middleName)">',
                '&nbsp;{[Ext.String.htmlEncode(values.middleName)]}',
                '</tpl>',
                '<tpl if = "!Ext.isEmpty(values.lastName)">',
                '&nbsp;{[Ext.String.htmlEncode(values.lastName)]}',
                '</tpl>',
                '</div>',
                '<div class="contact-list-organisation">',
                '<tpl if = "!Ext.isEmpty(values.designation)">',
                '{[Ext.String.htmlEncode(values.designation)]}',
                '</tpl>',
                '<tpl if="!Ext.isEmpty(values.designation) && !Ext.isEmpty(values.organization)">, </tpl>',
                '<tpl if = "!Ext.isEmpty(values.organization)">',
                '{[Ext.String.htmlEncode(values.organization)]}',
                '</tpl>',
                '</div>',
                '</div>'
            ]),
            dataIndex: 'imageUrl',
            flex: 1
        }
    ],

    bind: '{contacts}',

    listeners: {
        select: 'addToMultiSelect',
        deselect: 'removeFromMultiSelect'
    },
    getSelections: function () {
        return this.getSelection();
    }
});