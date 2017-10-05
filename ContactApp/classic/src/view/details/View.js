/**
 * This view is used to display contact summary details. It uses template to display the summary details.
 */
Ext.define('ContactApp.view.details.View', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.contact-view',

    bodyCls: 'contact-view-font',

    requires: [
        'Ext.button.Button',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Separator'
    ],

    reference: 'contact-view',
    scrollable: 'vertical',
    tbar: [
        '->',{
            xtype: 'button',
            itemId: 'editContactButton',
            //iconCls: 'fa fa-pencil',
            glyph: 'xf040@FontAwesome',
            tooltip: 'Edit',
            handler: 'editContact'
            //handler: 'showContactForm'
        },
        {
            xtype: 'button',
            //iconCls: 'fa fa-trash',
            glyph: 'xf1f8@FontAwesome',
            handler: 'deleteContact',
            tooltip: 'Delete'
        },
        {
            glyph: 'xf019@FontAwesome',
            reference: 'exportmenuitem',
            tooltip: 'Export',
            text:'Export',
            menu: {
                items: [
                    {
                        text: 'IOS Format',
                        glyph: 'xf179@FontAwesome',
                        handler: function (comp) {
                            this.fireEvent('exportcontact', this, 'ios');
                        },
                        listeners: {
                            exportcontact: 'exportContact'
                        }
                    },
                    {
                        text: 'Google/Android Format',
                        glyph: 'xf17b@FontAwesome',
                        handler: function (comp) {
                            this.fireEvent('exportcontact', this, 'google');
                        },
                        listeners: {
                            exportcontact: 'exportContact'
                        }
                    }
                ]
            }
        }
    ],

    tpl: Ext.create('Ext.XTemplate', [
        '<div class="contact-view-header">',
        '<div class="contact-avatar" align="center">',
        '<tpl if = "Ext.isEmpty(values.imageUrl)">',
        '<i class="fa fa-user fa-4x"></i>',
        '<tpl else>',
        '<img src="{imageUrl}" onload="ContactApp.utils.Helper.scaleImage(this, 135, 135, false)"/>',
        '</tpl>',
        '</div>',
        '<div class="contact-summary">',
        '<div class="contact-full-name">',
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
        '<div class="contact-organisation">',
        '<div>{[Ext.String.htmlEncode(values.designation)]}</div>',
        '<div>{[Ext.String.htmlEncode(values.organization)]}</div>',
        '</div>',
        '</div>',
        '</div>',
        '<br/>',
        '<table border="0" cellpadding="4" width="100%">',
        '<tpl if="values.phoneNumbers && values.phoneNumbers.length &gt; 0">',
        '<tr>',
        '<td class="contact-group-header" colspan="2">',
        'Mobile and Fax Information',
        '</td>',
        '</tr>',
        '<tpl for="phoneNumbers">',
        '<tr>',
        '<td width="15%">',
        '<label class="contact-group-label">{[Ext.String.htmlEncode(values.type)]} </label>',
        '</td>',
        '<td class="contact-group-value">',
        '{[Ext.String.htmlEncode(values.value)]}',
        '</td>',
        '</tr>',
        '</tpl>',
        '</tpl>',
        '<tpl if="values.emails && values.emails.length &gt; 0">',
        '<tr>',
        '<td class="contact-group-header" colspan="2">',
        'Email',
        '</td>',
        '</tr>',
        '<tpl for="emails">',
        '<tr>',
        '<td width="15%">',
        '<label class="contact-group-label">{[Ext.String.htmlEncode(values.type)]} </label>',
        '</td>',
        '<td class="contact-group-value">',
        '<a rel="noreferrer" target="_blank" href="mailto:{value}">{[Ext.String.htmlEncode(values.value)]}</a>',
        '</td>',
        '</tr>',
        '</tpl>',
        '</tpl>',
        '<tpl if="values.urls && values.urls.length &gt; 0">',
        '<tr>',
        '<td class="contact-group-header" colspan="2">',
        'Websites',
        '</td>',
        '</tr>',
        '<tpl for="urls">',
        '<tr>',
        '<td width="15%">',
        '<label class="contact-group-label">{[Ext.String.htmlEncode(values.type)]} </label>',
        '</td>',
        '<td class="contact-group-value">',
        '<a rel="noreferrer" target="_blank" href="{value}">{[Ext.String.htmlEncode(values.value)]}</a>',
        '</td>',
        '</tr>',
        '</tpl>',
        '</tpl>',
        '<tpl if="values.dates && values.dates.length &gt; 0">',
        '<tr>',
        '<td class="contact-group-header" colspan="2">',
        'Important Dates',
        '</td>',
        '</tr>',
        '<tpl for="dates">',
        '<tr>',
        '<td width="15%">',
        '<label class="contact-group-label">{[Ext.String.htmlEncode(values.type)]} </label>',
        '</td>',
        '<td class="contact-group-value">',
        '{[this.convertToDate(values)]}',
        '</td>',
        '</tr>',
        '</tpl>',
        '</tpl>',
        '<tpl if="(values.streetAddress && values.streetAddress.length &gt; 0 )|| (values.extendedAddress && values.extendedAddress.length &gt; 0) || (values.city && values.city.length &gt; 0) || (values.state && values.state.length &gt; 0) || values.pincode != 0">',
        '<tr>',
        '<td class="contact-group-header" colspan="2">',
        'Address',
        '</td>',
        '</tr>',
        '<tr>',
        '<td class="contact-group-value" colspan="2">',
        '<div class="contact-address-value">',
        '{[this.concatAddress(values.streetAddress,values.extendedAddress,values.city,values.pincode,values.state,values.country)]}',
        '</div>',
        '<button class="classic-view-button-items" onclick="ContactApp.utils.Helper.mobileDeviceAccessFunctionality(\'address\',\'{[this.concatAddress(values.streetAddress,values.extendedAddress,values.city,values.pincode,values.state,values.country,true)]}\',this)">',
        '<i class="fa fa-map-marker fa-2x" />',
        '</button>',
        '</td>',


        //'<td colspan="1">',
        //'<button class="classic-view-button-items" onclick="ContactApp.utils.Helper.mobileDeviceAccessFunctionality(\'address\',\'{[this.concatAddress(values.streetAddress,values.extendedAddress,values.city,values.pincode,values.state,values.country,true)]}\',this)">',
        //'<i class="fa fa-map-marker fa-2x" />',
        //'</td>',
        '</tr>',
        '</tpl>',
        '</table>',
        {
            convertToDate: function (val) {
                if (isNaN(Date.parse(val.value)) === false) {
                    return Ext.Date.format(new Date(val.value), 'M d, Y');
                }
                else {
                    return val.value;
                }
            },
            concatAddress: function (streetAddress, extendedAddress, city, pincode, state, country, isUrl) {
                var address = "";

                if (!Ext.isEmpty(streetAddress)) {
                    address = streetAddress + ', ';
                }

                if (!Ext.isEmpty(extendedAddress)) {
                    address = address + extendedAddress + ', ';
                }

                if (!Ext.isEmpty(city)) {
                    address = address + city + ', ';
                }

                if (!Ext.isEmpty(pincode)) {
                    address = address + ' - ' + pincode + ', ';
                }

                if (!Ext.isEmpty(state)) {
                    address = address + state + ', ';
                }

                address = address + country;
                address = Ext.String.htmlEncode(address);
                if (isUrl) {
                    address = Ext.String.htmlEncode(address);
                    return address.split(', ').join('+').split(' - ').join('');
                }

                return address;

            }
        }
    ]),
    bind: {
        data: {
            bindTo: '{selectedContact}',
            deep: true

        }
    }
});