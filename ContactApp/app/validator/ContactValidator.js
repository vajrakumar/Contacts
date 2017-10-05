/**
 * This class is used to validate cotnacts fields
 */
Ext.define('ContactApp.validator.ContactValidator', {

    extend: 'Ext.data.validator.Validator',

    alias: 'data.validator.contact',

    message: 'This is not a valid contact field',

    requires: [
        'ContactApp.validator.Url',
        'Ext.data.validator.Email',
        'Ext.data.validator.Length'
    ],

    config: {
        /**
         * @cfg {string} Empty field Message
         */
        emptyMessage: 'Must not be Empty',

        /**
         * @cfg {string} Invalid date message
         */
        invalidDateMsg: 'Please enter Valid Date',

        /**
         * @cfg {string} Invalid email message
         */
        invalidEmailMsg: 'The specified email value \'{0} \'  must be of the format \'abc@xyz.com \'',

        /**
         * @cfg {string} Invalid url Message
         */
        invalidWebSiteMsg: 'The specified Website value \'{0}\' should be of the format \'http://www.xyz.com\' or \'https://www.xyz.com\' or \'fttp://xyz.com\'',

        /**
         * @cfg {string} Invalid phone number message
         */
        invalidPhoneNumber: 'Phone number must be of the format +919686676665 / (080)-23350188 / +1 (760) 569-7676'
    },

    /**
     * This method is used to validate fields based on the viewType field
     * @param {String} value field value
     * @param {Ext.data.model} record Data model
     * @returns {String/Boolean} Returns error message or true
     */
    validate: function (value, record) {
        var me = this;

        var viewType = record.get('viewType'),
            value = Ext.isString(value) ? Ext.String.trim(value) : value,
            isEmpty = Ext.isEmpty(value);

        switch (viewType) {
            case 'phone':
                if (isEmpty || value.length === 0 || /^[ 0-9()+-]*$/i.test(value) === false) {
                    return me.getInvalidPhoneNumber();
                }

                break;
            case 'email':
                return Ext.create('Ext.data.validator.Email', {
                    message: Ext.String.format(me.getInvalidEmailMsg(), value)
                }).validate(Ext.String.trim(value));
                break;
            case 'url':
                return Ext.create('ContactApp.validator.Url', {
                    message: Ext.String.format(me.getInvalidWebSiteMsg(), value)
                }).validate(Ext.String.trim(value));
                break;
            case 'date':
                if (isEmpty || !Ext.isDate(new Date(value))) {
                    return me.getInvalidDateMsg();
                }
                break;
        }
        return true;
    }
});