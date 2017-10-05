/**
 * Created by vajra on 09/11/15.
 */
Ext.define('ContactApp.view.details.MultiSelectGrid', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.multi-select-grid',

    requires: [
        'Ext.button.Button',
        'Ext.grid.column.Action',
        'Ext.grid.column.Template',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Separator',
        'Ext.toolbar.Spacer'
    ],
    reference: 'multiselected-contacts-grid',
    //rowLines: false,
    /**
     * Config to hide grid header.
     */
    hideHeaders: true,
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
        }, {
            xtype: 'actioncolumn',
            width: 30,
            items: [
                {
                    glyph: 'xf00d@FontAwesome',
                    ui: 'normal',
                    tooltip: 'Unselect',
                    handler: function (view, rowIndex, colIndex, btn, eve, rec) {
                        this.fireEvent('deselectfromgrid', rec);
                    }
                }
            ],
            listeners: {
                deselectfromgrid: 'deSelectFromMultiGrid'
            }
        }
    ],

    tbar: [{
        xtype: 'button',
        tooltip: 'Back',
        glyph: 'xf060@FontAwesome',
        handler: 'rejectMultiSelection'
    },
        {
            xtype: 'tbspacer',
            width: '20%'
        },
        {
            xtype: 'box',
            bind: {html: '({selectCount}) Contacts Selected'}
        },
        '->',

        {
            xtype: 'button',
            glyph: 'xf1f8@FontAwesome',
            tooltip: 'Delete Contacts',
            handler: 'deleteMultipleContacts'
        },
        {
            text: 'Export',
            tooltip: 'Export',
            glyph: 'xf019@FontAwesome',
            menu: {
                items: [
                    {
                        text: 'IOS Format',
                        glyph: 'xf179@FontAwesome',
                        handler: function () {
                            this.fireEvent('exportcontact', this, 'ios');
                        },
                        listeners: {
                            exportcontact: 'exportContact'
                        }
                    },
                    {
                        text: 'Google/Android Format',
                        glyph: 'xf17b@FontAwesome',
                        handler: function () {
                            this.fireEvent('exportcontact', this, 'google');
                        },
                        listeners: {
                            exportcontact: 'exportContact'
                        }
                    }
                ]
            }
        }
    ]
});