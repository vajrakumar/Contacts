/**
 *  This is a view controller for the {@link ContactApp.view.details.Details} Details view.
 *  This class implements most of the business logic and server side calls to perform contact add/update and delete
 * operations.
 */

Ext.define('ContactApp.view.details.DetailsController', {
    extend: 'ContactApp.view.details.BaseDetailsController',
    alias: 'controller.details',

    requires: [
        'ContactApp.model.Details',
        'ContactApp.utils.Helper',
        'ContactApp.ux.DetailsBox'
    ],

    mixins: ['ContactApp.view.details.ContactRoutes'],

    listen: {
        controller: {
            '*': {
                /**
                 * @event newcontactform
                 * Global view controller event to fill the details of newly created contact.
                 */
                'newcontactform': 'newContactForm',
                /**
                 * @event displaynoselection
                 * Global view Controller event to display no selection message.
                 */
                'displaynoselection': 'showNoSelectionView',
                /**
                 * @event displaymultiselection
                 * Global view Controller event to display selected contacts list .
                 */
                'displaymultiselection': 'displayMultiSelectGrid',
                'showcontactform': 'showContactForm',
                'showcontactview': 'showContactView'
            }
        }
    },

    /**
     * Display form to enter details of newly created Contact and sets status to `add`
     * @param {ContactApp.model.Contact} record Newly added contact
     */
    newContactForm: function (record) {
        var me = this,
            form = me.getView().down('contact-form'),
            associations = record.associations,
            query = '[xtype="contact-type"]',
            key, contactType;

        form.reset();

        form.loadRecord(record);
        for (key in associations) {
            contactType = form.down(query + '[contactType=\'' + key + '\']');
            contactType.setStore(record[key]());
        }

        //me.setSelectedContact(record);
        //me.setStatus('add');

        form.down('[name= "prefix"]').focus();
    },

    /**
     * Deletes selected contact by fireing {@link ContactApp.view.list.ListController#deletecontact} `deletecontact`
     * event.
     */
    deleteContact: function () {
        this.fireEvent('deletecontact', this.getViewModel().get('selectedContact'));
    },

    /**
     * Add new contact details like phone Number, emails, urls and important dates.
     * @param {Ext.Button} comp Button Component
     */
    addNewContactDetail: function (comp) {

        var me = this,
            grid = comp.up('grid'),
            store = grid.getStore(),
            records = store.getRange(),
            i = 0,
            data, record;

        while (i < records.length) {
            data = records[i].getData();

            if (Ext.isEmpty(data.type) || Ext.isEmpty(data.value)) {
                return;
            }
            i++;
        }

        record = Ext.create('ContactApp.model.Details');
        record.set('viewType', grid.type);

        store.add(record);

        grid.getPlugin('contact-type-cell-edit-plugin').startEdit(record, 0);
    },

    /**
     * Save contact to database.
     * For new contact both personal details and contact details are saved in one request.
     * For existing contact only personal information is saved and to save contact details other method
     * {@link ContactApp.view.details.DetailsController#saveContactDetails} `saveContactDetails method is invoked.
     */
    saveContact: function () {

        var me = this,
            form = me.getView().down('contact-form'),
            record = me.getViewModel().get('selectedContact'),
            isNewRec = false;

        if (record && record.data && record.getId() > 0) {
            isNewRec = false;
        }
        else {
            isNewRec = true;
        }

        if (me.validateBeforeSave()) {

            Ext.getBody().mask('Saving...');

            record.save({
                success: function (rec, operation) {
                    var responseData = Ext.JSON.decode(operation.getResponse().responseText).data,
                        association = record.associations,
                        key, store;

                    if (!isNewRec) {
                        // When contact is in edit mode
                        me.saveContactDetails(record);
                    }
                    else {
                        //New Contact save
                        for (key in association) {
                            store = record[key]();
                            store.loadRawData(responseData[key]);
                        }

                        me.fireEvent('addcontacttolistonsave', record);
                        Ext.getBody().unmask();
                    }
                },
                failure: function (record, operation) {
                    var errResponse = Ext.JSON.decode(operation.getError().response.responseText);
                    Ext.Details.show({
                        title: 'Save Changes?',
                        message: errResponse.message,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR,
                        details: errResponse.error //Try commenting this to get normal MesageBox
                    });
                    Ext.getBody().unmask();
                }
            })
        }
    },
    editContact: function () {
        this.fireEvent('updatehash', 'edit');
    },

    /**
     * Save contact details to database.
     */
    saveContactDetails: function (record) {
        var me = this,
            association = record.associations,
            isComplete = true,
            completeStatus = {},
            modifiedStores = {},
            key, store;

        for (key in association) {

            store = record[key]();

            if (ContactApp.utils.Helper.isStoreModified(store)) {
                isComplete = false;
                completeStatus[key] = false;
                modifiedStores[key] = store;
            }
        }

        if (isComplete) {
            Ext.getBody().unmask();
            // me.fireEvent('reloadcontactList', me.getSelectedContact()); //No need to reload the store as of now, as
            // this is single application
            this.fireEvent('updatehash', 'view');
        }
        else {
            for (key in completeStatus) {
                modifiedStores[key].sync({
                    storeName: key,
                    success: function (batch, options) {
                        completeStatus[options.storeName] = true;
                        if (me.checkCompleteStatus(completeStatus)) {

                            Ext.getBody().unmask();
                            //   me.fireEvent('reloadcontactList', me.getSelectedContact()); //No need to reload the store
                            // as of now, as this is single application
                            me.fireEvent('updatehash', 'view');
                        }
                    },
                    failure: function (batch, options) {
                        var errResponse = Ext.JSON.decode(batch.operations[0].getError().response.responseText);
                        Ext.Details.show({
                            title: 'Save Changes?',
                            message: errResponse.message,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR,
                            details: errResponse.error //Try commenting this to get normal MesageBox
                        });
                        Ext.getBody().unmask();
                    }
                });
            }
        }
    },

    /**
     * Check different contact details are saved.
     * This method traverse all the properties of the object and checks all the properties are set to true.
     * @param {Object} completeStatus Object for which the complet status has to be checked.
     * @returns {boolean} true/false Return true if all the properties of the contact are set to true.
     */
    checkCompleteStatus: function (completeStatus) {
        var isComplete = true,
            key;

        for (key in completeStatus) {
            if (completeStatus[key] === false) {
                isComplete = false;
                break;
            }
        }

        return isComplete;
    },

    /**
     * Reset the modified changes when form is modified and not saved.
     */
    rejectChanges: function () {
        var me = this,
            record = me.getViewModel().get('selectedContact'),
            associations = record.associations,
            key;

        if (record.getId() > 0) { //Edit
            for (key in associations) {
                record[key]().rejectChanges();
            }

            record.reject();
            record.set('selected', true);
            this.fireEvent('updatehash', 'view');
        }
        else {  //Add
            record.destroy();
            this.fireEvent('updatehash', 'nocontactselected');
            me.getViewModel().set('selectedContact', null);
        }
    },

    /**
     * Validate Contacts before save.
     * @returns {boolean} Returns true if form is valid and false if it is invalid.
     */
    validateBeforeSave: function () {
        var isValid = this.callParent();

        return isValid;
    },

    /**
     * Upload Profile picture (Avatar).
     * @param {ContactApp.view.details.Avatar} form Form object for upload file.
     */
    uploadAvatar: function (form) {
        var me = this;

        form.mask('loading...');
        form.submit({
            url: '/avatarupload',
            method: 'Post',
            success: function (frm, eopt) {
                var response = Ext.JSON.decode(eopt.response.responseText),
                    record = me.getViewModel().get('selectedContact');

                record.set('imageUrl', response.data.imageUrl);
                form.unmask();
            },
            failure: function (frm, eopt) {
                var errResponse = Ext.JSON.decode(eopt.response.responseText);
                Ext.Details.show({
                    title: 'Avtar Upload?',
                    message: errResponse.message,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR,
                    details: errResponse.error //Try commenting this to get normal MesageBox
                });
                form.unmask();
            }
        });
    },

    /**
     *  Deletes multiple contacts, by firing `deletecontact` event.
     */
    deleteMultipleContacts: function () {
        this.fireEvent('deletecontact');
    },

    /**
     * Export contacts to vcf file format
     * @param {Ext.Button} comp Button component
     * @param {string} mode Mode of export, it will be `ios` for IOS format of vCard and `google` for android format of
     *     vCard
     */
    exportContact: function (comp, mode) {
        this.fireEvent('exportcontact', comp, mode);
    },

    /**
     * Deselect the contact form the multiselect grid
     * @param {ContactApp.model.Contact} rec Contact Record
     */
    deSelectFromMultiGrid: function (rec) {
        this.fireEvent('deselectcontact', rec);
    },

    rejectMultiSelection: function () {
        this.fireEvent('updatehash', 'nocontactselected');
    },

    /**
     * This method is used to svae the contact on click of enter key
     * @param {Ext.form.field.Base} field
     * @param {Ext.event.Event} e
     */
    saveOnEnterKey: function (field, e) {
        if (e.ENTER === e.getKey()) {
            this.saveContact();
        }
    }
});