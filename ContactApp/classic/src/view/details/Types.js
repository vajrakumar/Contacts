/**
 * This view is used to add or delete multi field contact details  like for phone number, website, email and important dates.
 * This uses {@link Ext.grid.plugin.CellEditing} cell editing plugin.
 */
Ext.define('ContactApp.view.details.Types', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.contact-type',

    requires: [
        'ContactApp.store.DateTypes',
        'ContactApp.store.EmailTypes',
        'ContactApp.store.PhoneTypes',
        'Ext.button.Button',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.grid.column.Column',
        'Ext.grid.column.Date',
        'Ext.grid.plugin.CellEditing',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Separator',
        'ContactApp.ux.CustomCombo'
    ],

    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1,
        pluginId: 'contact-type-cell-edit-plugin'
    },

    config: {
        /**
         * @cfg contacttype
         * Type of contact like phone number, website, email and important dates.
         */
        contactType: null
    },

    hideHeaders: true,

    bbar: [
        '->',
        {
            xtype: 'button',
            itemId: 'addContactItemButton',
            iconCls: 'fa fa-plus',
            handler: 'addNewContactDetail'
        }
    ],

    layout: {
        type: 'fit'
    },


    initComponent: function () {
        var me = this;

        me.setContactType(me.contactType);

        me.columns = me.buildColumns();

        me.callParent(arguments);
    },

    /**
     * Builds the column based on the contact type.
     * @returns {Array} column Returns list of columns config.
     */
    buildColumns: function () {
        var me = this,
            columns = [];


        /*columns.push({
         xtype: 'gridcolumn',
         dataIndex: 'type',
         flex: .45,
         editor: {
         xtype: 'textfield',
         allowBlank: false
         }*!/
         });*/


        switch (me.getContactType()) {

            case 'phoneNumbers':

                columns.push({
                    xtype: 'gridcolumn',
                    dataIndex: 'type',
                    flex: .45,
                    editor: {
                        xtype: 'customCombo',
                        allowBlank: false,
                        store: Ext.create('ContactApp.store.PhoneTypes')
                    }
                });
                columns.push(
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'value',
                        flex: .45,
                        editor: {
                            xtype: 'textfield',
                            itemId: 'detailsTypesTextField',
                            allowBlank: false,
                            maskRe: /^[ 0-9()+-]*$/i,
                            allowOnlyWhitespace: false
                        }
                    }
                );
                break;

            case  'emails':

                columns.push({
                    xtype: 'gridcolumn',
                    dataIndex: 'type',
                    flex: .45,
                    editor: {
                        xtype: 'customCombo',
                        allowBlank: false,
                        store: Ext.create('ContactApp.store.EmailTypes')
                    }
                });
                columns.push(
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'value',
                        flex: .45,
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false,
                            vtype: 'email',
                            vTypeText: 'Email should be of the format  xyz@xyz.com'
                        }
                    }
                );
                break;

            case 'urls':
                columns.push({
                    xtype: 'gridcolumn',
                    dataIndex: 'type',
                    flex: .45,
                    editor: {
                        xtype: 'customCombo',
                        allowBlank: false,
                        store: Ext.create('ContactApp.store.EmailTypes')
                    }
                });
                columns.push(
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'value',
                        flex: .45,
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false,
                            vtype: 'url',
                            vTypeText: 'Url should be of the format  http://xyz.com'
                        }
                    }
                );
                break;

            case 'dates':
                columns.push({
                    xtype: 'gridcolumn',
                    dataIndex: 'type',
                    flex: .45,
                    editor: {
                        xtype: 'customCombo',
                        allowBlank: false,
                        store: Ext.create('ContactApp.store.DateTypes')
                    }
                });
                columns.push(
                    {
                        xtype: 'datecolumn',
                        dataIndex: 'value',
                        format: 'M d, Y',
                        flex: .45,
                        editor: {
                            xtype: 'datefield',
                            allowBlank: false,
                            format: 'M d, Y'
                        },
                        renderer: function (value) {
                            if (isNaN(Date.parse(value)) === false) {
                                return Ext.Date.format(new Date(value), 'M d, Y');
                            }
                            else {
                                return value;
                            }
                        }
                    }
                );
                break;
        }

        columns.push(
            {
                xtype: 'actioncolumn',
                width: 30,
                items: [
                    {
                        glyph: 'xf1f8@FontAwesome',
                        tooltip: 'Delete',
                        ui: 'normal',
                        handler: function (view, rowIndex, colIndex, btn, eve, rec) {
                            view.getStore().remove(rec);
                        }
                    }
                ]
            }
        );

        return columns;
    }
});