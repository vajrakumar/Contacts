/**
 * This view is used to display contact summary details. It uses template to display the summary details.
 */
Ext.define('ContactApp.view.details.View', {
    extend: 'Ext.Container',
    requires: [
        'ContactApp.ux.MenuButton',
        'Ext.Button',
        'Ext.Toolbar',
        'Ext.util.Format'
    ],

    alias: 'widget.contact-view',

    reference: 'contact-view',

    scrollable: 'vertical',
    height: '100%',
    //width: '100%',
    tpl: Ext.create('Ext.XTemplate', [
        '<tpl if = "!this.isSelected(values)">',
        '<div> No Selection </div>',
        '<tpl else>',
        '<div class="contact-view-font">',
        '<div align="center" class="contact-avatar">',
        '<tpl if = "Ext.isEmpty(values.imageUrl)">',
        '<i class="fa fa-user fa-4x"></i>',
        '<tpl else>',
        '<img src="{imageUrl}" />',
        '</tpl>',
        '</div>',
        '<div class="contact-details-container">',
        //'<div class="modern-contact-name-org-desig">',
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
        '{designation}',
        '<br/>',
        '{organization}',
        '</div> ',
        //'</div>',
        '<br/>',
        '<div style="margin:0px;padding:0px;">',
        '<table border="0" cellpadding="2" cellspacing="2" width="100%" >',
        '<tpl if="values.phoneNumbers && values.phoneNumbers.length &gt; 0">',
        '<tr class="contact-details-group">',
        '<td colspan="3"/>',
        '</tr>',
        '<tpl for="phoneNumbers">',
        '<tr>',
        '<td width="5%">',
        '<tpl if="xindex==1" >',
        '<i class="contact-detail-icon fa fa-phone fa-2x" />',
        '</tpl>',
        '</td>',
        '<td  width="84%">',
        '<div class="contact-detail-value-container" >',
        '<p><label class="contact-detail-label">{type} </label></p>',
        '<p>{[Ext.String.htmlEncode(values.value)]}</p>',
        '</div>',
        '</td>',
        '<td width="10%">',
        '<button ontouchstart="ContactApp.utils.Helper.mobileDeviceAccessFunctionality(\'phoneNumbers\',\'{[Ext.String.htmlEncode(values.value)]}\',this)"><i class="fa fa-phone fa-1x" /></button>',
        '</td>',
        '</tr>',
        '</tpl>',
        '</tpl>',

        '<tpl if="values.emails && values.emails.length &gt; 0">',
        '<tr class="contact-details-group">',
        '<td colspan="3"/>',
        '<tr/>',
        '<tpl for="emails">',
        '<tr>',
        '<td width="5%">',
        '<tpl if="xindex==1" >',
        '<i class="contact-detail-icon fa fa-envelope fa-2x"/>',
        '</tpl>',
        '</td>',
        '<td  width="84%">',
        '<div class="contact-detail-value-container">',
        '<p><label class="contact-detail-label">{type} </label></p>',
        '<p><a rel="noreferrer" target="_blank" href="mailto:{[Ext.String.htmlEncode(values.value)]}" data-rel="external">{[Ext.String.htmlEncode(values.value)]}</a></p>',
        '</div>',
        '</td>',
        '<td width="10%">',
        '<button ontouchstart="ContactApp.utils.Helper.mobileDeviceAccessFunctionality(\'emails\',\'{[Ext.String.htmlEncode(values.value)]}\',this)"><i class="fa fa-envelope fa-1x" /></button>',
        '</td>',
        '</tr>',
        '</tpl>',
        '</tpl>',
        '<tpl if="values.urls && values.urls.length &gt; 0">',
        '<tr class="contact-details-group">',
        '<td colspan="3"/>',
        '<tr/>',
        '<tpl for="urls">',
        '<tr>',
        '<td width="5%">',
        '<tpl if="xindex==1" >',
        '<i class="contact-detail-icon fa fa-link fa-2x"/>',
        '</tpl>',
        '</td>',
        '<td  width="84%">',
        '<div class="contact-detail-value-container">',
        '<p><label class="contact-detail-label">{type} </label></p>',
        '<p><a rel="noreferrer" target="_blank" href="{[Ext.String.htmlEncode(values.value)]}">{[Ext.String.htmlEncode(values.value)]}</a></p>',
        '</div>',
        '</td>',
        '<td width="10%">',
        '<button ontouchstart="ContactApp.utils.Helper.mobileDeviceAccessFunctionality(\'urls\',\'{[Ext.String.htmlEncode(values.value)]}\',this)"><i class="fa fa-link fa-1x" /></button>',
        '</td>',
        '</tr>',
        '</tpl>',
        '</tpl>',
        '<tpl if="values.dates && values.dates.length &gt; 0">',
        '<tr class="contact-details-group">',
        '<td colspan="3"/>',
        '<tr/>',
        '<tpl for="dates">',
        '<tr>',
        '<td width="5%">',
        '<tpl if="xindex==1" >',
        '<i class="contact-detail-icon fa fa-calendar fa-2x"/>',
        '</tpl>',
        '</td>',
        '<td  width="84%">',
        '<div class="contact-detail-value-container">',
        '<p><label class="contact-detail-label">{type} </label></p>',
        '<p>{[this.convertToDate(values)]}</p>',
        '</div>',
        '</td>',
        '<td width="10%">',
        '</td>',
        '</tr>',
        '</tpl>',
        '</tpl>',
        '<tr class="contact-details-group">',
        '<td colspan="3"/>',
        '</tr>',
        '<tpl if="(values.streetAddress && values.streetAddress.length &gt; 0 )|| (values.extendedAddress && values.extendedAddress.length &gt; 0) || (values.city && values.city.length &gt; 0) || (values.state && values.state.length &gt; 0) || values.pincode != 0">',
        '<tr>',
        '<td width="5%">',
        '<i class="contact-detail-icon fa fa-map-marker fa-2x"/>',
        '</td>',
        '<td  width="84%">',
        '<div class="contact-detail-value-container">',
        '<p><label class="contact-detail-label">Address</label></p>',
        '<div>',
        '<p>{[this.concatAddress(values.streetAddress,values.extendedAddress,values.city,values.pincode,values.state,values.country)]}</p>',
        '</div>',
        '</div>',
        '</td>',
        '<td width="10%">',
        '<button ontouchstart="ContactApp.utils.Helper.mobileDeviceAccessFunctionality(\'address\',\'{[this.concatAddress(values.streetAddress,values.extendedAddress,values.city,values.pincode,values.state,values.country,true)]}\',this)">',
        '<i class="fa fa-map-marker fa-1x" />',
        '</button>',
        '</td>',
        '</tr>',
        '</tpl>',
        '</table>',
        '</div>',
        '</div>',
        '</tpl>',
        {
            isSelected: function (val) {
                return val.hasOwnProperty('firstName');
            },
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
                    itemId: 'hideViewBtn',
                    handler: 'hideDetails'
                },
                {
                    xtype: 'spacer'
                },
                {
                    xtype: 'button',
                    iconCls: 'fa fa-pencil',
                    ui: 'normal',
                    handler: 'editContact'
                },
                {
                    xtype: 'button',
                    iconCls: 'fa fa-trash',
                    ui: 'normal',
                    handler: 'deleteContact'
                },
                {
                    xtype: 'menubutton',
                    itemId: 'viewMenuBtn',
                    menu: [
                        {
                            title: 'Export Apple',
                            iconCls: 'fa fa-apple'
                        }, {
                            title: 'Export Android',
                            iconCls: 'fa fa-android'
                        }
                    ],
                    listeners: {
                        menuitemtap: 'viewMenuBtnItemTap'

                    }
                }
                /*{
                 xtype: 'button',
                 iconCls: 'fa fa-apple',
                 ui: 'normal',
                 handler: function(comp) {
                 comp.fireEvent('exportcontact', comp, 'ios');
                 },
                 listeners: {
                 exportcontact: 'exportContact'
                 }
                 },
                 {
                 xtype: 'button',
                 iconCls: 'fa fa-android',
                 ui: 'normal',
                 handler: function(comp) {
                 comp.fireEvent('exportcontact', comp, 'google');
                 },
                 listeners: {
                 exportcontact: 'exportContact'
                 }
                 }*/
            ]
        }
    ],
    bind: {
        data: {
            bindTo: '{selectedContact}',
            deep: true
        }
    }
});