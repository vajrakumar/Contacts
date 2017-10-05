/**
 * Created by vajra on 30/12/15.
 */
Ext.define('ContactApp.ux.ListSlideActions', {
    extend: 'Ext.Component',
    alias: 'plugin.slideactions',
    requires: [
        'Ext.dom.Helper',
        'Ext.layout.HBox',
        'Ext.util.Draggable'
    ],

    config: {
        list: null,
        leftButtons: [],
        rightButtons: [],
        viewModel: {}, //per record view model (optional)
        scrollTolerance: 30, //Allow some scrolling when sliding out
        minDrag: 5, //Ensure a little bit of drag before creating
        openPositionRight: 50,
        openPositionLeft: 50,
        animation: {duration: 250, easing: {type: 'ease-out'}},
        actionsBackground: "#909090",
        itemBackground: '#ffffff',
        boxShadow: '5px 0px 5px 0px #6060'
        //boxShadow: 'none'
    },

    init: function (list) {
        var me = this;

        me.setList(list);

        list.getScrollable().on({
            scroll: me.onScrollStart,
            scrollend: me.onScrollEnd,
            scope: me
        });

        list.on({
            itemtap: me.onTap,
            select: me.onTap,
            updatedata: me.updateData,
            itemtouchmove: me.onTouchMove,
            hide: me.removeButtonPanel,
            scope: me
        });


    },

    actualItem: null,
    actualActions: null,

    scrolling: false,

    onScrollEnd: function () {
        this.scrolling = false;
        //console.log('scrollend');
    },

    onScrollStart: function (scroller, x, y) {
        this.scrolling = true;
        //console.log('scrollstart -  x:' + x + ' y:' +y);
        if (this.actualItem && y >= this.getScrollTolerance()) {
            this.removeButtonPanel(false);
        }
    },

    updateData: function () {
        if (this.actualItem) {
            this.removeButtonPanel();
        }
    },

    onTap: function (list, index, target, record, e, eOpts) {

        var me = this,
            element, stop;
        if (this.actualItem == null) {
            stop = false;
        }
        else {
            if (me.columnCls) {
                element = target.el.down('.x-grid-cell.' + me.columnCls);
            }
            else {
                element = target.el.down('.x-innerhtml');
            }
            stop = this.actualItem != null && element == this.actualItem.getElement();
        }


        this.removeButtonPanel();
        if (stop) {
            return false;
        }
    },

    onTouchMove: function (list, index, target, record, e, eOpts) {
        if (this.scrolling) return false;


        var me = this,
            element;

        if (me.columnCls) {
            element = target.el.down('.x-grid-cell.' + me.columnCls);
        }
        else {
            element = target.el.down('.x-innerhtml');
        }
        if (!element) {
            console.error('Element not recognized to apply draggable component!');
        }
        var initialOffset = {x: 0, y: 0};

        if (me.actualItem && me.actualItem.getElement() != element) {
            me.removeButtonPanel();
        }

        if (!me.actualItem) {
            me.actualRecord = record;
            me.actualActions = me.createButtonsPanel(target, list);
            element.setStyle('background', me.config.itemBackground);
            element.setStyle('box-shadow', me.config.boxShadow);

            me.actualItem = new Ext.util.Draggable({
                element: element,
                constraint: false,
                direction: 'horizontal',
                listeners: {
                    dragstart: function (self, e, startX, startY) {
                        if (self.getOffset().x == -1 * me.config.openPositionRight) //drag right
                        {
                            initialOffset = {x: -1 * me.config.openPositionRight, y: 0};
                        }
                        if (self.getOffset().x == 1 * me.config.openPositionLeft) //drag left
                        {
                            initialOffset = {x: 1 * me.config.openPositionLeft, y: 0};
                        }
                    },
                    drag: function (self, e, newX, newY) {
                        // console.log(self.getOffset().x);
                        // debugger;

                        if (self.getOffset().x > 0 && me.config.leftButtons.length == 0) //only right buttons and drag left
                        {
                            self.setOffset(0, 0);
                        }
                        else if (self.getOffset().x < 0 && me.config.rightButtons.length == 0) //only left buttons and drag right
                        {
                            self.setOffset(0, 0);
                        }
                        else if (Math.min(initialOffset.x, newX) - Math.max(initialOffset.x, newX) > -1 * me.config.minDrag) {
                            //Ex: -350 and -380
                            //Ex: 0 and -30
                            self.setOffset(self.getOffset().x, 0);
                        }
                        else {
                            list.getScrollable().fireEvent('scrollend');
                            list.setScrollable(false);
                        }

                    },
                    dragend: function (self, e, endX, endY) {
                        if (self.getOffset().x < -1 * (me.config.openPositionRight / 2)) {
                            self.setOffset(-1 * me.config.openPositionRight, 0, me.config.animation);
                        }
                        else if (self.getOffset().x > 1 * (me.config.openPositionLeft / 2)) {
                            self.setOffset(1 * me.config.openPositionLeft, 0, me.config.animation);
                        }
                        else {
                            self.setOffset(0, 0, me.config.animation);
                            Ext.destroy(me.actualActions);
                            Ext.destroy(me.actualItem);
                            me.actualItem = null;
                            me.actualActions = null;
                            me.actualRecord = null;
                            element.setStyle('box-shadow', null);
                        }
                        setTimeout(function () {
                            list.setScrollable(true);
                        }, 250);
                        // list.setScrollable(true);
                    }
                }
            });
        }

    },

    removeButtonPanel: function (timeout) {
        if (typeof timeout == 'undefined') {
            timeout = true;
        }

        if (this.actualItem) {
            if (typeof this.actualItem.getElement() == 'undefined') {
                this.actualItem = null;
                this.actualRecord = null;
                this.actualActions = null;
            }
            else {
                var actualItem = this.actualItem;
                actualItem.setOffset(0, 0, this.config.animation);
                var actualActions = this.actualActions;
                if (actualItem.getElement() && actualItem.getElement().dom) {
                    actualItem.getElement().setStyle('box-shadow', null);
                }
                //To close actual item with animation
                setTimeout(function () {
                    Ext.destroy(actualActions);
                    Ext.destroy(actualItem);
                }, timeout ? 500 : 0);
                this.actualItem = null;
                this.actualRecord = null;
                this.actualActions = null;
            }
        }
        if (this.list && !this.list.getScrollable()) {
            this.list.getScroller().fireEvent('scrollend');
            this.list.setScrollable(true);
        }
    },

    createButtonsPanel: function (target, list, buttons) {
        var me = this,
            element = target.el,
            viewModel = list.lookupViewModel(),
            outer = Ext.DomHelper.insertFirst(element, '<div class="x-slide-action-outer" style="background: ' + me.config.actionsBackground + '; position:absolute; width: 100%; height: 100%"></div>', true);

        Ext.Array.each(me.config.rightButtons, function (button) {
            button['flex'] = 1;
            button['style'] = 'height: 100%;border: none;box-shadow: none;z-index: auto;';
            button['record'] = me.actualRecord;
            button['slideactions'] = me;
            button['listId'] = me.cmp.xtype;
        });

        Ext.Array.each(me.config.leftButtons, function (button) {
            button['flex'] = 1;
            button['style'] = 'height: 100%;border: none;box-shadow: none;z-index: auto;';
            button['record'] = me.actualRecord;
            button['slideactions'] = me;
            button['listId'] = me.cmp.xtype;
        });

        //attach the current record and parent VM chain to the panel
        Ext.apply(me.config.viewModel,
            {
                data: {
                    slideActionRecord: me.actualRecord
                },
                parent: viewModel
            }
        );

        var panel = Ext.create('Ext.Panel', {
            layout: 'hbox',
            style: 'height: 100%;',
            border: false,
            cls: 'x-slide-action-buttons-outer',
            viewModel: me.config.viewModel,
            renderTo: outer,
            items: [
                {
                    layout: 'hbox',
                    style: 'height: 100%;',
                    border: false,
                    width: me.config.openPositionLeft,
                    items: me.config.leftButtons
                }, {
                    flex: 1
                },
                {
                    layout: 'hbox',
                    style: 'height: 100%;',
                    border: false,
                    cls: 'x-slide-action-buttons-outer',
                    width: me.config.openPositionRight,
                    items: me.config.rightButtons
                }
            ]
        });

        return outer;
    }
});