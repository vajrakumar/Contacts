/**
 * This class is used to validate URL fields
 */
Ext.define('ContactApp.validator.Url', {

    extend: 'Ext.data.validator.Format',

    alias: 'data.validator.url',

    type: 'url',

    config: {
        /**
         * @cfg {string} Message to be displayed of invalid url
         */
        message: 'It is not a valid url',

        matcher: /(((^https?)|(^ftp)):\/\/((([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*)|(localhost|LOCALHOST))\/?)/i
    }
});