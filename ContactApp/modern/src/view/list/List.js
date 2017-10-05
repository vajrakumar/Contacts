/**
 *  This class is used to display list of available contacts in the {@link EExt.dataview.List} List view.
 *  This view uses {@link ContactApp.view.list.ListController} ContactApp.view.list.ListController as a view controller.
 *  This provides an ability to search contact using {@link ContactApp.ux.Search} Search field.
 *  This view uses Single selection mode.
 *
 *  It is uses {@link Ext.grid.column.Template} template column to display contact name.
 *
 *  It uses {@link ContactApp.view.main.ContactModel#store} Contact Store.
 */
Ext.define('ContactApp.view.list.List', {
    extend: 'Ext.grid.Grid',

    requires: [
        'ContactApp.ux.ListSlideActions',
        'ContactApp.ux.MenuButton',
        'ContactApp.ux.grid.plugin.MultiSelect',
        'ContactApp.view.list.BaseListController',
        'ContactApp.view.list.ListController',
        'Ext.Toast',
        'Ext.field.File',
        'Ext.field.Search'
    ],
    alias: 'widget.contact-list',
    reference: 'contact-list',
    controller: 'list',
    action: null,
    grouped: true,
    indexBar: true,
    //ui: 'round',
    plugins: [{
        type: 'gridmultiselect'//ToDo Plan to pass toolBarItemId from here which can be used for getToolBar()
    },
        {
            xclass: 'ContactApp.ux.ListSlideActions',
            pluginId: 'listSlideActions',
            columnCls: 'singleColumn',
            leftButtons: [{
                xtype: 'button',
                iconCls: 'x-fa fa-trash',
                ui: 'decline',

                listeners: {
                    tap: function (button, e) {
                        var list = Ext.ComponentQuery.query(button.listId)[0],
                            controller = list.getController(),
                            record = button.getRecord();

                        button.slideactions.removeButtonPanel();
                        list.action = 'delete';
                        list.select(record);
                        controller.fireEvent('deletecontacts');
                        list.action = null;
                        e.stopPropagation();
                        return false;
                    },
                    scope: this
                }
            }],
            //NOTE: These buttons are added outside the component chain and so the controller scope needs to be a component lookup until a better method is worked out.
            rightButtons: [
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-pencil',

                    ui: 'action',
                    bind: {
                        disabled: '{!isRoomActionByOwner}'
                    },
                    listeners: {
                        tap: function (button, e) {
                            var list = Ext.ComponentQuery.query(button.listId)[0],
                                controller = list.getController(),
                                record = button.getRecord();

                            button.slideactions.removeButtonPanel();
                            list.action = 'edit';
                            list.select(record);
                            list.action = null;
                            e.stopPropagation();
                            return true;
                        },
                        scope: this
                    }
                }]
        }],
    items: [
        {
            xtype: 'toolbar',
            docked: 'top',
            layout: {
                type: 'hbox'
            },
            items: [
                {
                    xtype: 'searchfield',
                    placeHolder: 'Search...',
                    itemId: 'searchBox',
                    flex: 1,
                    listeners: {
                        clearicontap: function (comp, input, eve) {
                            comp.fireEvent('searchcontact', comp, comp.getValue(), eve);
                        },
                        keyup: function (comp, eve) {
                            comp.fireEvent('searchcontact', comp, comp.getValue(), eve);
                        },
                        searchcontact: 'searchContact'
                    }
                },
                {
                    xtype: 'menubutton',
                    itemId: 'singleSelectMenuBtn',
                    menu: [
                        {
                            title: 'Add',
                            iconCls: 'fa fa-plus',
                            itemId: 'addNewBtn'
                        }, {
                            title: 'Import',
                            iconCls: 'fa fa-upload',
                            itemId: 'importBtn'
                        },
                        {
                            title: 'Select',
                            iconCls: 'fa fa-list',
                            itemId: 'selectBtn'
                        }
                    ],
                    listeners: {
                        menuitemtap: 'singleMenuBtnItemTap'

                    }
                }, {
                    xtype: 'menubutton',
                    itemId: 'multiSelectMenuBtn',
                    reference: 'multiselectBtn',
                    hidden: true,
                    menu: [
                        {
                            title: 'Delete',
                            iconCls: 'fa fa-trash'
                        }, {
                            title: 'Export Apple',
                            iconCls: 'fa fa-apple'
                        }, {
                            title: 'Export Android',
                            iconCls: 'fa fa-android'
                        }
                    ],
                    listeners: {
                        menuitemtap: 'multiMenuBtnItemTap'

                    }
                }
            ]
        },
        {
            xtype: 'toolbar',
            docked: 'top',
            itemId: 'import-contact-toolbar',
            items: [
                {
                    xtype: Ext.platformTags['native'] ? 'button' : 'filefield',
                    text: 'Choose contact',
                    accept: '.vcf',
                    listeners: {
                        tap: 'chooseContact',
                        change: 'importContact'
                    }
                },
                {
                    xtype: 'spacer'
                },
                {
                    xtype: 'component',
                    html: '<i class="fa fa-spinner fa-pulse fa-2x">',
                    hidden: true,
                    itemId: 'import-status'
                },
                {
                    xtype: 'component',
                    html: '<i class="fa fa-close">',
                    //hidden:true,
                    itemId: 'import-close',
                    listeners: {
                        initialize: function (comp) {
                            comp.el.on('click', function () {
                                comp.up('#import-contact-toolbar').hide();
                            });
                        }
                    }
                }
            ],
            hidden: true,
            listeners: {
                hide: 'onImportHide'
            }
        }
    ],

    bind: {
        store: {
            bindTo: '{contacts}'
        }
    },
    rowLines: false,
    /**
     * Config to hide grid header.
     */
    hideHeaders: true,
    columns: [
        {
            xtype: 'templatecolumn',
            cell: {
                encodeHtml: false,
                cls: "singleColumn"
            },
            flex: 1,
            tpl: Ext.create("Ext.XTemplate", [
                '<div class="contact-thumb-list">',
                '<div class="contact-list-avatar-container">',
                '<tpl if = "Ext.isEmpty(values.imageUrl)">',
                '<i class="fa fa-user fa-3x"></i>',
                '<tpl else>',
                '<img src="{imageUrl}" onload="ContactApp.utils.Helper.scaleImage(this, 45, 45, false)" />',
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
            ])
        }
    ],

    listeners: {
        select: 'onContactSelect',
        selectionchange: 'updateCount',
        exitmultiselection: 'exitMultiSelection'
    }
});