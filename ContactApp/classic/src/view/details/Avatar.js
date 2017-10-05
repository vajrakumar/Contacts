/**
 *  This component is used to show profile picture(Avatar) and on click of the image or glyph icon to upload file to profile picture.
 */
Ext.define('ContactApp.view.details.Avatar', {
    extend: 'Ext.form.Panel',

    requires: [
        'Ext.container.Container',
        'Ext.form.field.File'
    ],

    alias: 'widget.avatar',

    bodyStyle: {
        background: 'transparent'
    },

    items: [
        {
            /**
             * Container field to display profile picture (avatar). It uses template to display image if profile picture exists else
             * displays glyph icon.
             */
            xtype: 'container',
            margin: 10,
            width: 135,
            height: 135,
            tpl: Ext.create('Ext.XTemplate', [
                '<div class="contact-avatar-container" >',
                '<tpl if = "Ext.isEmpty(values.imageUrl)">',
                '<i class="fa fa-user"></i>',
                '<tpl else>',
                '<img src="{imageUrl}"  onload="ContactApp.utils.Helper.scaleImage(this, 135, 135, false)" />',
                '<div class="contact-avatar-delete-icon" style="display: none;"><i class="fa fa-close"></i></div>',
                '</tpl>',
                '<div class="contact-avatar-edit-icon" ><i class="fa fa-pencil fa-2x"></i></div>',
                '</div>'
            ]),
            reference: 'avatar-viewer',
            bind: {
                data: {
                    bindTo: '{selectedContact}',
                    deep: true
                }
            },
            listeners: {
                afterrender: function (comp) {
                    var from = comp.up('avatar');
                    comp.getEl().on({
                        click: function () {
                            from.showFileViewer();
                        },
                        mouseover: function () {

                        },
                        mouseout: function () {

                        }
                    })
                },
                /**
                 * @event uploadavatar
                 * @param {ContactApp.view.details.Avatar} form Form used to upload perform file upload.
                 */
                uploadavatar: Ext.emptyFn
            }
        },
        {
            /**
             * File field used to upload file on
             */
            xtype: 'filefield',
            reference: 'avataruploader',
            listeners: {
                change: function (comp, value) {
                    var form = comp.up('avatar');
                    if (!Ext.isEmpty(value)) {
                        if (/(.jpg|.jpeg|.png|.gif)$/ig.test(value)) {
                            form.fireEvent('onfileselect', form);
                        }
                        else {
                            Ext.Msg.show({
                                title: 'File Format error',
                                message: 'Invalid file format, please upload files with the formats JPEG, JPG, PNG and GIF',
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.ERROR
                            });
                            comp.setValue('');
                        }
                    }
                }
            },
            name: 'avatar',
            hidden: true
        }
    ],

    listeners: {
        /**
         * @event onfileselect
         * @param {ContactApp.view.details.Avatar} form Form used to upload perform file upload.
         */
        onfileselect: Ext.emptyFn
    },

    /**
     * Shows file browse menu.
     */
    showFileViewer: function () {

        var me = this,
            form = me.getForm(),
            fileField = form.findField('avatar');

        fileField.fileInputEl.dom.click();
    }
});