/**
 * Ext.window.DetailsBox used to display more details about Info / Warning / Error
 * Coming from Server into a UI component which is easy to debug for developer.
 */
Ext.define('ContactApp.ux.DetailsBox', {
        extend: 'Ext.window.MessageBox',

        requires: [
            'Ext.form.FieldSet'
        ],

        show: function (cfg) {
            var me = this,
                baseId = me.id,
                icon = cfg.icon,
                detailsFieldSet = me.down('#' + baseId + '-fieldset'),
                detailsHtml = '<pre><code>',
                title, color;

            var details = cfg.details;
            if (Ext.isString(details)) {
                detailsHtml += details;
            } else if (Ext.isObject(details)) {
                Ext.Object.each(details, function (key, value) {
                    detailsHtml += key + ': ' + value + '\n';
                });
            } else {
                detailsHtml += 'Invalid format.';
            }
            detailsHtml += '</code></pre>';

            if (detailsFieldSet) {
                detailsFieldSet.destroy();
            }

            if (cfg.details) {
                if (icon.indexOf('info') != -1) {
                    title = 'Info';
                    color = '#00529B'
                } else if (icon.indexOf('warning') != -1) {
                    title = 'Warning';
                    color = '#9F6000'
                } else if (icon.indexOf('error') != -1) {
                    title = 'Error';
                    color = '#D8000C'
                }

                title += ' Details';

                me.add({
                    xtype: 'fieldset',
                    id: baseId + '-fieldset',
                    collapsible: true,
                    scrollable: true,
                    collapsed: true,
                    maxHeight: 320,
                    title: title,
                    style: {
                        color: color
                    },
                    html: detailsHtml,
                    listeners: {
                        expand: function () {
                            me.center();
                        },
                        collapse: function () {
                            me.center();
                        }
                    }
                });
            }

            me = me.callParent(arguments);
            return me;
        }
    },

    function (DetailsBox) {
        /**
         * @class Ext.DetailsBox
         * @alternateClassName Ext.Details
         * @extends Ext.window.DetailsBox
         * @singleton
         * @inheritdoc Ext.window.DetailsBox
         */
        Ext.DetailsBox = Ext.Details = new DetailsBox();
    });