/**
 * This view is used to add or delete multi field contact details  like for phone number, website, email and important dates.
 * This uses {@link Ext.grid.plugin.CellEditing} cell editing plugin.
 */

Ext.define('ContactApp.view.details.TypeListItem', {
    extend: 'Ext.dataview.component.DataItem',
    requires: [
        'ContactApp.validator.ContactValidator',
        'Ext.field.DatePicker',
        'Ext.field.Text',
        'Ext.layout.HBox'
    ],

    alias: 'widget.contact-type-item',
    reference: 'contact-type-item',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    height: 35,

    items: [
        {
            xtype: 'textfield',
            itemId: 'contact-type',
            clearIcon: false,
            inputCls: 'contact-input-cls',
            width: '30%',
            //name: 'type',
            listeners: {
                change: function (comp) {
                    var dataItem = comp.up('contact-type-item');
                    dataItem.validateTextField.apply(dataItem, arguments);
                }
            }
        },
        {
            xtype: 'textfield',
            itemId: 'contact-value',
            inputCls: 'contact-input-cls',
            clearIcon: false,
            hidden: true,
            flex: .4,
            //name: 'value',
            listeners: {
                change: function (comp) {
                    var dataItem = comp.up('contact-type-item');
                    dataItem.validateTextField.apply(dataItem, arguments);
                }
            }
        },
        {
            xtype: 'datepickerfield',
            itemId: 'contact-date-value',
            inputCls: 'contact-input-cls',
            dateFormat: 'M d, Y',
            hidden: true,
            flex: .4,
            clearIcon: false,
            picker: {
                yearFrom: (new Date()).getFullYear() - 100,
                yearTo: (new Date()).getFullYear() + 20
            },
            listeners: {
                change: function (comp, newDate, oldDate, eOpts) {
                    if (newDate) {
                        var dataItem = comp.up('contact-type-item');
                        dataItem.validateDateField.apply(dataItem, arguments);
                    }
                }
            }
        },
        {
            xtype: 'button',
            iconCls: 'fa fa-trash',
            handler: function (comp) {
                var record = comp.parent.getRecord(),
                    dataview = comp.parent.getDataview();

                dataview.getStore().remove(record);
                dataview.refresh();
            }
        }
    ],

    /**
     * Sets value to the each fields of based on the contact type and hide or unhide components based on the viewType value of the {ContactApp.model.Details}
     * model.
     * @param {ContactApp.model.Details} record Contact detail.
     */
    updateRecord: function (record) {
        if (record) {
            var me = this,
                type = record.get('viewType'),
                value = record.get('value'),
                dataview = me.getDataview(),
                valueField = me.down('#contact-value'),
                dateField = me.down('#contact-date-value'),
                field;

            if (type === 'date') {
                dateField.setValue(value);
                valueField.hide();
                dateField.show();
                field = dateField;
            }
            else {
                valueField.setValue(value);
                dateField.hide();
                valueField.show();
                field = valueField;
            }

            field.setInputCls(Ext.isEmpty(value) ? 'contact-error-cls' : 'contact-input-cls');

            me.down('#contact-type').setValue(record.get('type'));
            dataview.setHeight(dataview.getStore().getCount() * me.getHeight());

            me.callParent(arguments);
        }
    },

    /**
     * Validate Type and value fields for phone number, website and emails.
     * @param {Ext.field.Text} comp Text fields for which validation to be applied.
     */
    validateTextField: function (comp) {
        var name = comp.getItemId(),
            record = this.getRecord(),
            value = comp.getValue(),
            validator = Ext.create('ContactApp.validator.ContactValidator'),
            isValid;

        if (name === 'contact-type') {
            isValid = value.length > 1;
            record.set('type', value);
        }
        else {
            isValid = (value.length > 1) && (validator.validate(value + '', record) === true);
            record.set('value', value);
        }

        comp.setInputCls(isValid ? 'contact-input-cls' : 'contact-error-cls');
    },

    /**
     * Set value field of the record only for datepicker field
     * @param {Ext.field.DatePicker} comp Text fields for which validation to be applied.
     */
    validateDateField: function (comp, newVal) {
        var record = this.getRecord();
        record.set('value', newVal);
    }
});