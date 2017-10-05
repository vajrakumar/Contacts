/**
 * Created by manjunathub on 23/09/15.
 */
Ext.define('ContactApp.view.details.Form', {
    extend: 'Ext.form.Panel',

    alias: 'widget.contact-form',

    requires: [
        'ContactApp.view.details.Avatar',
        'ContactApp.view.details.Types',
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.FieldContainer',
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.layout.container.Column',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Separator'
    ],

    reference: 'contact-form',

    defaults: {
        margin: '2 5 2 5',
        padding: 5
    },

    scrollable: true,

    tbar: [
        {
            xtype: 'button',
            tooltip: 'Back',
            glyph: 'xf060@FontAwesome',
            //iconCls: 'fa fa-arrow-left',
            handler: 'rejectChanges'
        },
        '->',
        {
            xtype: 'button',
            itemId: 'saveContactButton',
            tooltip: 'Save',
            //iconCls: 'fa fa-save',
            glyph: 'xf0c7@FontAwesome',
            handler: 'saveContact'
        }
    ],

    items: [
        {
            xtype: 'fieldset',
            layout: {
                type: 'column',
                align: 'stretch'
            },
            border: 1,
            title: 'Personal Information',
            collapsible: false,
            items: [
                {
                    xtype: 'avatar',
                    columnWidth: .2,
                    listeners: {
                        onfileselect: 'uploadAvatar'
                    }
                },
                {
                    xtype: 'container',
                    columnWidth: .8,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Name',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            defaults: {
                                xtype: 'textfield',
                                hideLabel: true,
                                padding: '5 5 5 0',
                                listeners: {
                                    specialkey: 'saveOnEnterKey'
                                }
                            },
                            items: [
                                {
                                    name: 'prefix',
                                    emptyText: 'Prefix',
                                    flex: .1,
                                    maxLength :20,
                                    bind: '{selectedContact.prefix}'
                                },
                                {
                                    name: 'firstName',
                                    flex: .3,
                                    allowOnlyWhitespace: false,
                                    maxLength :256,
                                    emptyText: 'First Name',
                                    bind: '{selectedContact.firstName}'
                                },
                                {
                                    name: 'middleName',
                                    flex: .3,
                                    maxLength :256,
                                    emptyText: 'Middle Name',
                                    bind: '{selectedContact.middleName}'
                                },
                                {
                                    name: 'lastName',
                                    flex: .3,
                                    maxLength :256,
                                    emptyText: 'Last Name',
                                    padding: '5 0 5 0',
                                    bind: '{selectedContact.lastName}'
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Designation',
                            name: 'designation',
                            maxLength :256,
                            emptyText: 'Add Designation',
                            bind: '{selectedContact.designation}',
                            listeners: {
                                specialkey: 'saveOnEnterKey'
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Organization',
                            name: 'organization',
                            maxLength :256,
                            emptyText: 'Add Organization',
                            bind: '{selectedContact.organization}',
                            listeners: {
                                specialkey: 'saveOnEnterKey'
                            }
                        }
                    ]
                }
            ]
        },

        {
            xtype: 'fieldset',
            collapsible: true,
            title: 'Address',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: 1,
            defaults: {
                xtype: 'textfield',
                listeners: {
                    specialkey: 'saveOnEnterKey'
                }
            },

            items: [
                {
                    fieldLabel: 'Address 1',
                    emptyText: 'Street Address',
                    name: 'streetAddress',
                    maxLength :256,
                    bind: '{selectedContact.streetAddress}'
                },
                {
                    fieldLabel: 'Address 2',
                    emptyText: 'Extended Address',
                    name: 'extendedAddress',
                    maxLength :256,
                    bind: '{selectedContact.extendedAddress}'
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'textfield',
                            flex: .5,
                            fieldLabel: 'City',
                            emptyText: 'City',
                            name: 'city',
                            maxLength :256,
                            padding: '0 5 0 0',
                            bind: '{selectedContact.city}',
                            listeners: {
                                specialkey: 'saveOnEnterKey'
                            }
                        },
                        {
                            xtype: 'textfield',
                            flex: .5,
                            fieldLabel: 'Pincode',
                            emptyText: 'Pincode',
                            labelAlign: 'right',
                            name: 'pincode',
                            bind: '{selectedContact.pincode}',
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            maskRe: /^[ 0-9]*$/i,
                            listeners: {
                                specialkey: 'saveOnEnterKey'
                            }
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    name: 'state',
                    fieldLabel: 'State',
                    emptyText: 'State',
                    maxLength :256,
                    bind: '{selectedContact.state}',
                    listeners: {
                        specialkey: 'saveOnEnterKey'
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'country',
                    fieldLabel: 'Country',
                    emptyText: 'Country',
                    maxLength :256,
                    bind: '{selectedContact.country}',
                    listeners: {
                        specialkey: 'saveOnEnterKey'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            collapsible: true,
            border: 1,
            title: 'Phone and Fax',
            items: [
                {
                    xtype: 'contact-type',
                    contactType: 'phoneNumbers',
                    type: 'phone',
                    maxLength :256,
                    bind: {
                        store: '{selectedContact.phoneNumbers}'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            collapsible: true,
            border: 1,
            title: 'Emails',
            items: [
                {
                    xtype: 'contact-type',
                    contactType: 'emails',
                    maxLength :256,
                    type: 'email',
                    bind: {
                        store: '{selectedContact.emails}'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            collapsible: true,
            border: 1,
            title: 'Web Pages',
            items: [
                {
                    xtype: 'contact-type',
                    contactType: 'urls',
                    maxLength :256,
                    type: 'url',
                    bind: {
                        store: '{selectedContact.urls}'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            collapsible: true,
            border: 1,
            title: 'Important Dates',
            items: [
                {
                    xtype: 'contact-type',
                    contactType: 'dates',
                    type: 'date',
                    bind: {
                        store: '{selectedContact.dates}'
                    }
                }
            ]
        }
    ]
});