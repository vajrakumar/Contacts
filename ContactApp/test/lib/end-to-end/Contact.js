var Contact = {
    pressAdd: function () {
        ST.button('#addContactButton').click();
    },
    pressEdit: function () {
        ST.button('#editContactButton').click();
    },
    pressSave: function () {
        ST.button('#saveContactButton').click();
    },
    fillTextField: function (fields) {
        Ext.Object.each(fields, function (name, value) {
            ST.textField('[name="' + name + '"]').type(value);
        });
    },
    editContactItem: function (type, data) {
        // select type,
        // working in chrome and safari, not in firefox, getting "no element found" in firefox console
        ST.grid('contact-type[contactType="' + type + '"]').
            rowAt(0).
            cellAt(0).
            click(10, 10);

        ST.component('customCombo').
            click(10, 10);

        // could be data[0] if this would be working
        //ST.component('boundlist => [data-recordindex="0"]').
        //    click(10, 10);
        

        // enter phone number
        ST.grid('contact-type[contactType="' + type + '"]').
            rowAt(0).
            cellAt(1).
            click(10, 10);
        
        ST.textField('#detailsTypesTextField').type(data[1]);
    },
    addContactItem: function (type, data) {
        ST.button("contact-type[contactType='" + type + "'] #addContactItemButton").click();

        this.editContactItem(type, data);
    },
    create: function(fields, items) {
        this.update('Add', fields, items);
    },
    edit: function (fields, items) {
        this.update('Edit', fields, items);
    },
    update: function (action, fields, items) {
        this['press' + action]();

        this.fillTextField(fields);

        if (Ext.isArray(items)) {
            Ext.Array.each(items, function (item) {
                this.addContactItem(item[0], item[1]);
            }, this);
        }

        this.pressSave();
    },
    deleteAll: function (done) {
        Ext.Ajax.request({
            url: '/resetdb',
            method: 'GET',
            success: done
        });
    },
    
    beforeAll: function(done) {
        console.time('Test Duration');

        // Make sure we reload the contacts store after the contacts after been deleted on the server-side
        ST.component('app-main').
            visible().
            and(function () {
                Contact.deleteAll(function () {
                    // Ext.first('app-main').getViewModel().get('contacts') is sometimes null and therefore failing,
                    // need to look for a better solution
                    Ext.first('app-main').getViewModel().get('contacts').load(done);
                });
            });
    },

    afterAll: function() {
        console.timeEnd('Test Duration');
    }
};