/**
 * Created by vajra on 05/02/16.
 */
Ext.define('ContactApp.view.details.BaseDetailsController', {
    extend: 'Ext.app.ViewController',


    /**
     * Validate Contacts before save.
     * @returns {boolean} Returns true if form is valid and false if it is invalid.
     */
    validateBeforeSave: function () {
        var me = this,
            record = me.getViewModel().get('selectedContact'),
            firstName = record.get('firstName'),
            errorMsg = [],
            msg,
            type, store, records, data, len, isValid;

        if (firstName && Ext.String.trim(firstName).length > 0) {

            for (type in record.associations) {
                store = record[type]();
                records = store.getModifiedRecords();
                len = records.length;

                isValid = true;

                switch (type) {
                    case 'phoneNumbers':
                        msg = '<div> Some of the Phone Number and Fax fields are not valid </div>';
                        break;
                    case  'emails':
                        msg = '<div> Some of the email fields are not valid </div>';
                        break;
                    case 'dates':
                        msg = '<div> Some of the Important date fields are not valid </div>';
                        break;
                    case 'urls':
                        msg = '<div>Some of the Website fields are not valid </div>';
                        break;
                }

                while (--len > -1) {
                    data = records[len].getData();

                    if (Ext.isEmpty(data.type)) {
                        break;
                    }

                    isValid = records[len].customValidate(data.value);

                    if (Ext.isString(isValid) || isValid === false) {
                        break;
                    }
                }

                if (len > -1) {
                    errorMsg.push(msg);
                }
            }

            if (errorMsg.length > 0) {
                Ext.toast({
                    title: 'Form Error',
                    html: errorMsg.join(''),
                    timeout: 2000
                });
                return false;
            }
        }
        else {
            Ext.toast({
                title: 'Form Validation',
                html: 'Please enter First Name',
                timeout: 2000
            });
            return false;
        }
        return true;
    }
});