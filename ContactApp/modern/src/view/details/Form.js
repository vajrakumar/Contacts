/**
 * Created by manjunathub on 28/09/15.
 */
Ext.define('ContactApp.view.details.Form', {
    extend: 'Ext.form.Panel',
    requires: [
        'ContactApp.view.details.Avatar',
        'ContactApp.view.details.TypeView',
        'Ext.field.Number',
        'Ext.field.Text',
        'Ext.form.FieldSet',
        'Ext.layout.Fit',
        'Ext.layout.HBox',
        'Ext.layout.VBox'
    ],

    alias: 'widget.contact-form',
    reference: 'contact-form',

    items: [
        {
            xtype: 'toolbar',
            docked: 'top',
            border: false,
            items: [
                {
                    xtype: 'button',
                    iconCls: 'fa fa-arrow-left',
                    ui: 'normal',
                    itemId: 'rejectButton',
                    handler: 'rejectChanges'
                },
                {
                    xtype: 'spacer'
                },
                {
                    xtype: 'button',
                    iconCls: 'fa fa-floppy-o',
                    ui: 'normal',
                    itemId: 'saveButton',
                    handler: 'saveContact'
                }
            ]
        },
        {
            xtype: 'avatar',
            listeners: {
                onfileselect: 'uploadAvatar'
            }
        },
        {
            xtype: 'fieldset',
            title: 'Personal Information',
            items: [
                {
                    xtype: 'container',
                    cls: 'x-form-fieldset x-field',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    margin: 0,
                    //width: '100%',
                    items: [
                        {
                            xtype: 'label',
                            html: 'Name',
                            cls: 'x-form-label',
                            width: '30%'
                        },
                        {
                            xtype: 'container',
                            width: '70%',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'prefix',
                                    itemId: 'prefix',
                                    placeHolder: 'Prefix',
                                    bind: '{selectedContact.prefix}'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'firstName',
                                    itemId: 'firstName',
                                    allowOnlyWhitespace: false,
                                    placeHolder: 'First Name',
                                    bind: '{selectedContact.firstName}'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'middleName',
                                    itemId: 'middleName',
                                    placeHolder: 'Middle Name',
                                    bind: '{selectedContact.middleName}'
                                },
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    name: 'lastName',
                                    placeHolder: 'Last Name',
                                    itemId: 'lastName',
                                    bind: '{selectedContact.lastName}'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    label: 'Organization',
                    name: 'organization',
                    placeHolder: 'Add Organization',
                    itemId: 'organization',
                    bind: '{selectedContact.organization}'
                },
                {
                    xtype: 'textfield',
                    label: 'Designation',
                    name: 'designation',
                    itemId: 'designation',
                    placeHolder: 'Add Designation',
                    bind: '{selectedContact.designation}'
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Address',
            items: [
                {
                    xtype: 'textfield',
                    label: 'Address 1',
                    placeHolder: 'Street Address',
                    name: 'streetAddress',
                    itemId: 'streetAddress',
                    bind: '{selectedContact.streetAddress}'

                },
                {
                    xtype: 'textfield',
                    label: 'Address 2',
                    placeHolder: 'Extended Address',
                    name: 'extendedAddress',
                    itemId: 'extendedAddress',
                    bind: '{selectedContact.extendedAddress}'
                },

                {
                    xtype: 'textfield',
                    label: 'City',
                    placeHolder: 'City',
                    itemId: 'city',
                    name: 'city',
                    padding: '0 5 0 0',
                    bind: '{selectedContact.city}'
                },
                {
                    xtype: 'numberfield',
                    label: 'Pincode',
                    placeHolder: 'Pincode',
                    name: 'pincode',
                    itemId: 'pincode',
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false,
                    bind: '{selectedContact.pincode}'
                },
                {
                    xtype: 'textfield',
                    label: 'State',
                    placeHolder: 'State',
                    itemId: 'state',
                    name: 'state',
                    bind: '{selectedContact.state}'
                },
                {
                    xtype: 'textfield',
                    label: 'Country',
                    placeHolder: 'Country',
                    itemId: 'country',
                    name: 'country',
                    bind: '{selectedContact.country}'
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Phone and Fax',
            items: [
                {
                    xtype: 'contact-type',
                    contactType: 'phoneNumbers',
                    viewType: 'phone',
                    bind: {
                        store: '{selectedContact.phoneNumbers}'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Add New',
                    ui: 'normal',
                    margin: 1,
                    handler: 'addContactDetails'

                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Emails',
            items: [
                {
                    xtype: 'contact-type',
                    contactType: 'emails',
                    bind: {
                        store: '{selectedContact.emails}'
                    },
                    viewType: 'email'
                },
                {
                    xtype: 'button',
                    text: 'Add New',
                    ui: 'normal',
                    margin: 1,
                    handler: 'addContactDetails'

                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Web Pages',
            items: [
                {
                    xtype: 'contact-type',
                    contactType: 'urls',
                    viewType: 'url',
                    bind: {
                        store: '{selectedContact.urls}'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Add New',
                    ui: 'normal',
                    margin: 1,
                    handler: 'addContactDetails'

                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Important Dates',
            items: [
                {
                    xtype: 'contact-type',
                    contactType: 'dates',
                    viewType: 'date',
                    bind: {
                        store: '{selectedContact.dates}'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Add New',
                    ui: 'normal',
                    margin: 1,
                    handler: 'addContactDetails'
                }
            ]
        }
    ]
});