/**
 * This calss is used to map Urls.
 */
Ext.define('ContactApp.utils.UrlMapping', {
    singleton: true,
    platformConfig: {
        native: {
            baseUrl: 'http://senchacontacts.herokuapp.com'
        },
        '!native': {
            baseUrl: '.'
        }
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);

        Ext.Ajax.on('beforerequest', me.onBeforeRequest, me);
    },
    onBeforeRequest: function (connection, options) {
        options.url = this.baseUrl + options.url;
    }
});