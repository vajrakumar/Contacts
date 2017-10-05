/**
 * This component is used to show profile picture(Avatar) and on click of the image or glyph icon to upload file to profile picture.
 */
Ext.define('ContactApp.view.details.Avatar', {
    extend: 'Ext.form.Panel',

    alias: 'widget.avatar',

    requires: [
        'Ext.field.File',
        'Ext.layout.Fit',
        'Ext.plugin.Responsive'
    ],

    mixins: [
        'Ext.mixin.Responsive'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    responsiveConfig: {
        portrait: {
            height: 350
        },
        landscape: {
            height: 180
        }
    },

    items: [
        {
            /**
             * Container field to display profile picture (avatar). It uses template to display image if profile picture exists else
             * displays glyph icon.
             */
            xtype: 'container',
            tpl: Ext.create('Ext.XTemplate', [
                '<div align="center" class="contact-avatar-form">',
                '<tpl if = "Ext.isEmpty(values.imageUrl)">',
                '<i class="fa fa-user fa-4x"></i>',
                '<tpl else>',
                '<img src="{imageUrl}" />',
                '</tpl>',
                '</div>'
            ]),

            reference: 'avatar-viewer',
            bind: {
                data: {
                    bindTo: '{selectedContact}',
                    deep: true
                }
            }
        },
        {
            /**
             * If browser
             *  filefield is used to choose a file
             * If cordova
             *  Button is used to trigger the camera
             * plugin for taking / picking a picture
             *
             * Ext.platformTags.native is a custom tag,
             * Sencha cmd will throw error if accessed
             * through .(dot)
             */
            xtype: Ext.platformTags['native'] ? 'button' : 'filefield',
            text: 'Choose photo',
            accept: 'image',
            reference: 'avataruploader',
            handler: function (comp, evt) {
                Ext.Msg.show({
                    title: 'Avatar upload',
                    message: 'Please choose one',
                    buttons: [{
                        text: 'Take a photo',
                        itemId: 'CAMERA', //should not be changed, a constant with cordova camera.PictureSourceType
                        ui: 'action'
                    }, {
                        text: 'Choose Photo',
                        itemId: 'SAVEDPHOTOALBUM', //should not be changed, a constant with cordova camera.PictureSourceType
                        ui: 'action'
                    }, {
                        text: 'Cancel',
                        itemId: 'cancel'
                    }],
                    icon: Ext.Msg.QUESTION,
                    fn: function (itemId) {
                        if (itemId !== 'cancel') {
                            var form = comp.up('avatar');
                            navigator.camera.getPicture(function (imageUri) {
                                form.fireEvent('onfileselect', form, imageUri);
                            }, function (message) {
                                Ext.Msg.alert('Avatar upload', 'Sorry, failed to get photo.\n' + message);
                            }, {
                                quality: 50,
                                destinationType: navigator.camera.DestinationType.FILE_URI,
                                sourceType: navigator.camera.PictureSourceType[itemId],
                                mediaType: Camera.MediaType.PICTURE,
                                allowEdit: true,
                                correctOrientation: true
                            });
                        }
                    }
                });
            },
            listeners: {
                change: function (comp, value) {
                    var form = comp.up('avatar');
                    if (!Ext.isEmpty(value)) {
                        if (/(.jpg|.jpeg|.png|.gif)$/ig.test(value)) {
                            form.fireEvent('onfileselect', form);
                        }
                        else {
                            Ext.toast({
                                title: 'File Format error',
                                html: 'Invalid file format, please upload files with the formats JPEG, JPG, PNG and GIF',
                                timeout: 3000
                            });
                            comp.setValue('');
                        }
                    }
                }
            },
            name: 'avatar'

            /**
             * @event onfileselect
             * @param {ContactApp.view.details.Avatar} form Form used to upload perform file upload.
             */
        }
    ],
    listeners: {
        onfileselect: Ext.emptyFn
    }
});