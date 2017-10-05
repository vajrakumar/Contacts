/**
 * Created by vajra on 05/11/15.
 */
Ext.define('ContactApp.ux.CustomCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.customCombo',
    queryMode: 'local',
    value: 'home',
    editable: false,
    displayField: 'name',
    listeners: {
        select: function (combo, record, index, eOpts) {
            if (record.data.name === 'Custom...') {
                combo.setValue('');
                combo.setEditable(true);
                combo.focus();
            }
            else {
                combo.setEditable(false);
            }
        },
        blur: function (combo, event, eOpts) {
            if (combo.getValue() === null) combo.setValue(combo.getStore().getAt(0));
        }
    }
});