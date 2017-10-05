/**
 * Created by vajra on 30/11/15.
 */
Ext.define('ContactApp.ux.MenuButton', {
    extend: 'Ext.Container',
    alias: 'widget.menubutton',

    requires: [
        'Ext.dataview.List'
    ],

    config: {
        iconCls: 'fa fa-ellipsis-v',
        text: null,
        menuAlign: 'tr-tr?',
        menu: null,
        badgeText: null,
        badgeCls: null
    },
    initialize: function () {
        var me = this, list;

        me.setItems([{
            xtype: 'button',
            iconCls: me.getIconCls(),
            text: me.getText(),
            itemId: me.getItemId() + 'Button',
            handler: function (btn) {
                me.getList().showBy(btn, me.getMenuAlign());
            }
        }, {
            xtype: 'list',
            itemTpl: '<div style="padding-left: 25px;"><i class="{iconCls}" style="position: absolute;left:2px;width: 25px; text-align: center;"></i>{title}</div>',//ToDo move to css
            style: {
                'border': '1px solid #F0F0F0'
            },
            itemId: me.getItemId() + 'List',
            selectedCls: null,
            hidden: true,
            left: 0,
            modal: {
                xtype: 'mask',
                style: 'background: transparent'
            },
            hideOnMaskTap: true,
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    me.fireEventArgs('menuitemtap', arguments);
                    list.hide();
                }
            }
        }]);
        me.callParent(arguments);
        list = me.getList();
        list.setData(me.getMenu());
    },
    /**
     * To make sure dynamically updating up of list data
     */
    /* updateMenu: function () {
     debugger;
     var me = this,
     list = me.getList();
     if (list) {
     list.setData(me.getMenu()); // IF anybody uses set data to menubutton then automatically list contents will be changed.
     }
     },*/
    applyBadgeText: function (value) {
        this.down('button').setBadgeText(value);
    }, updateBadgeText: function (value) {
        this.down('button').setBadgeText(value);
    }, updateBadgeCls: function (value) {
        this.down('button').setBadgeCls(value);
    },
    items: [],
    getList: function () {
        return this.list = this.list || this.down('list');
    }
});