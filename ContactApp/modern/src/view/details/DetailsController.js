/**
 * Created by manjunathub on 28/09/15.
 */
Ext.define('ContactApp.view.details.DetailsController', {
    extend: 'ContactApp.view.details.BaseDetailsController',
    alias: 'controller.details',

    requires: [
        'ContactApp.model.Details',
        'ContactApp.utils.Helper',
        'ContactApp.utils.UrlMapping'
    ],
    mixins: ['ContactApp.view.details.ContactRoutes'],
    /*  config: {
     status: 'edit',
     selectedContact: null,
     contactForm: null,
     contactView: null
     },*/

    listen: {
        controller: {
            '*': {
                /**
                 * @event viewcontact
                 * Global view controller event to view contact summary details.
                 * @param {ContactApp.model.Contact} contact Selected contact.
                 */
                'viewcontact': 'viewContact',
            /**
             * @event newcontactform
             * Global view controller event to fill the details of newly created contact.
             */
            'newcontactform': 'newContactForm',
            'displaynoselection': 'showNoSelectionView',
            'displaymultiselection': 'displayMultiSelectGrid',
            'showcontactform': 'showContactForm',
            'showcontactview': 'showContactView'
        }
        }
    },

    /**
     * Display Form to enter new contact details and sets status to `add`.
     * @param {ContactApp.model.Contact} record Contact to be added.
     */
    newContactForm: function (record) {
        var me = this,
            form = me.lookupReference('contact-form');//,
        //associations = record.associations,
        //query = '[xtype="contact-type"]',
        //key, contactType;

        form.setRecord(record);

        me.showContactForm();
        me.setContactDetailsStore();
        me.getView().show();
    },


    /**
     * Display Edit form to edit contact details. Pre-filled with values because of 2 way data binding.
     */
    editContact: function () {
        this.showContactForm();
        this.fireEvent('updatehash', 'edit');
    },

    /**
     * Delete Existing Contact.
     */
    deleteContact: function () {
        this.fireEvent('deletecontacts');
        this.hideDetails();
    },

    /**
     * Display Contact summary view
     * @param {ContactApp.model.Contact} record Contact for which summary should be displayed.
     */
    viewContact: function (record, action) {
        //this.setSelectedContact(record); //ToDo try to get it fro mlist controlers selections
        if (action === 'edit') {
            this.showContactForm();
        } else {
            this.showContactView();
        }
        this.getView().show();
    },

    /**
     * Add new contact details like phone Number, emails, urls and important dates.
     * @param {Ext.Button} comp Button Component
     */
    addContactDetails: function (comp) {
        var me = this,
            dataViewPanel = comp.parent.down('contact-type'),
            store = dataViewPanel.getStore() || me.setContactDetailsStore(dataViewPanel),
            records = store.getRange(),
            len = records.length,
            data, record;

        while (--len > -1) {
            data = records[len].getData();
            //If a record is empty then don't allow to add new record.
            if (Ext.isEmpty(data.type) && Ext.isEmpty(data.value)) {
                Ext.toast('Already empty field exists', 2000);
                return;
            }
        }

        record = Ext.create('ContactApp.model.Details');
        record.set('viewType', dataViewPanel.viewType);
        store.add(record);
    },

    /**
     * Save contact to database.
     * For new contact both personal details and contact details are saved in one request.
     * For existing contact only personal information is saved and to save contact details other method
     * {@link ContactApp.view.details.DetailsController#saveContactDetails} `saveContactDetails` method is invoked.
     */
    saveContact: function () {

        var me = this,
            form = me.lookupReference('contact-form'),
            record = me.getViewModel().get('selectedContact'),
            isNewRec = false;

        if (record && record.data && record.getId() > 0) {
            //record.set(form.getValues(false,true,false,true));
            isNewRec = false;
        }
        else {
            isNewRec = true;
            record = form.getRecord();
            //record.set(form.getValues(false,true,false,true));
            me.getViewModel().set('selectedContact', record);
        }

        if (me.validateBeforeSave()) {

            form.mask({
                xtype: 'loadmask',
                message: 'Saving Contact...'
            });

            record.save({
                success: function (rec, operation) {
                    var responseData = Ext.JSON.decode(operation.getResponse().responseText).data,
                        association = record.associations,
                        key, store;

                    if (!isNewRec) {
                        me.saveContactDetails(record);
                    }
                    else {
                        for (key in association) {
                            store = record[key]();
                            store.loadRawData(responseData[key]);
                        }

                        me.fireEvent('addcontacttolistonsave', record);

                        form.unmask();
                        // me.hideDetails();

                        Ext.toast({html: 'Contact Saved successfully...', timeout: 2000});
                    }
                },
                failure: function (rec, operation) {
                    Ext.toast({html: 'Contact Save failed...', timeout: 2000});
                    form.unmask();
                }
            });
        }
    },

    /**
     * Save contact details to database.
     */
    saveContactDetails: function (record) {
        var me = this,
            association = record.associations,
            form = me.lookupReference('contact-form'),
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
            form.unmask();
            me.showContactView();
        }
        else {
            for (key in completeStatus) {
                modifiedStores[key].sync({
                    storeName: key,
                    success: function (batch, operations) {
                        completeStatus[operations.storeName] = true;

                        if (me.checkCompleteStatus(completeStatus)) {
                            form.unmask();
                            Ext.toast({html: 'Contact Saved successfully....', timeout: 2000});
                            me.showContactView();
                        }
                    },
                    failure: function () {
                        Ext.toast({html: 'Contact Save failed...', timeout: 2000});
                        form.unmask();
                    }
                });
            }
        }
    },

    /**
     * Reset the modified changes when form is modified and not saved.
     */
    rejectChanges: function () {
        var me = this,
            record = me.getViewModel().get('selectedContact'),
            associations = record.associations,
            key;

        if (record.getId() > 0) {
            for (key in associations) {
                record[key]().rejectChanges();
            }
            record.reject();
            me.showContactView();
            this.fireEvent('updatehash', 'view');
        }
        else {
            record.destroy();
            // me.setStatus(null);
            // me.setSelectedContact(null);//ToDo deselectall selected contacts
            this.fireEvent('updatehash', 'nocontactselected');
            me.hideDetails();
        }
    },


    /**
     * Displays contact list by contact view or form.
     */
    hideDetails: function () {
        this.fireEvent('updatehash', 'nocontactselected');
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
     * Validate Contacts before save.
     * @returns {boolean} Returns true if form is valid and false if it is invalid.
     */
    validateBeforeSave: function () {
        return this.callParent();
    },


    /**
     * Upload Profile picture (Avatar).
     * @param {ContactApp.view.details.Avatar} form Form object for upload file.
     */
    uploadAvatar: function (form, imageUri) {
        var me = this;

        form.mask(true);
        if (Ext.platformTags['native']) {
            var options = new FileUploadOptions();
            options.fileKey = "avatar";
            options.fileName = imageUri.substr(imageUri.lastIndexOf('/') + 1);
            options.chunkedMode = false;
            new FileTransfer().upload(imageUri, encodeURI(ContactApp.utils.UrlMapping.baseUrl + '/avatarupload'), function (responseObj) {
                var record = me.getViewModel().get('selectedContact');
                record.set('imageUrl', ContactApp.utils.UrlMapping.baseUrl + Ext.decode(responseObj.response).data.imageUrl);
                form.unmask();
            }, function (error) {
                Ext.toast({html: 'Avtar upload failed...', timeout: 2000});
                form.unmask();
            }, options);
        } else {
            form.submit({
                url: '/avatarupload',
                xhr2: true,
                success: function (frm, response) {
                    var record = me.getViewModel().get('selectedContact');
                    record.set('imageUrl', response.data.imageUrl);
                    form.unmask();
                },
                failure: function (form, response) {
                    Ext.toast({html: 'Avtar upload failed...', timeout: 2000});
                    form.unmask();
                }
            });
        }
    },

    /**
     * Set stores for detail list like phone numbers, emails, urls and important dates panels
     * @param {ContactApp.view.details.TypeView} dataViewPanel Dataview panel of  phone numbers, emails, urls and important dates panels. Optional parameter
     * @returns {*|Ext.data.Store|Ext.data.AbstractStore} Returns List store or list of stores.
     */
    setContactDetailsStore: function (dataViewPanel) {
        var me = this,
            record = me.getViewModel().get('selectedContact'); //ToDo test in case of multipple contact selectedc
        if (dataViewPanel) {
            dataViewPanel.setStore(record[dataViewPanel.contactType]);
            return dataViewPanel.getStore();
        }
        else {
            var form = me.lookupReference('contact-form'),
                associations = record.associations,
                query = '[xtype="contact-type"]',
                key, contactType, store = [];

            for (key in associations) {
                contactType = form.down(query + '[contactType=\'' + key + '\']');
                store.push(record[key]());
                contactType.setStore(record[key]());
            }
            return store;
        }
    },

    /**
     * Export Contact to .vcf format
     * @param {Ext.button} comp Button componet
     * @param {String} mode Modes of .vcf format (ios or google). By default it's value is `ios`
     */
    exportContact: function (comp, mode) {
        this.fireEvent('exportcontacts', comp, mode);
    },

    viewMenuBtnItemTap: function (comp, index, target, record, e, eOpts, viewMenuBtn) {
        switch (record.get('title')) {
            case 'Export Apple' :
            {
                this.fireEvent('exportcontacts', comp, 'ios');
                break;
            }
            case 'Export Android' :
            {
                this.fireEvent('exportcontacts', comp, 'google');
                break;
            }
        }
    }
});