/**
 * Created by vajra on 01/10/15.
 * Override created to avoid 2 times firing of change event for filefield.
 * Jira ID: link url https://sencha.jira.com/browse/EXTJS-19443
 */

Ext.define('ContactApp.field.FileInput', {
    override: 'Ext.field.FileInput',
    doBlur: function (e) {
        this.showMask();
        this.setIsFocused(false);
    }
});