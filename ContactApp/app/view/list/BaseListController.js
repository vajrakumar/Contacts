/**
 * Created by vajra on 05/02/16.
 */
Ext.define('ContactApp.view.list.BaseListController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'ContactApp.model.Contact',
        'ContactApp.utils.UrlMapping'
    ],
    /**
     * Create new contact and fires a global event {@ContactApp.view.details.DetailsController newcontactform} `newcontactform`
     * to display form to fill new contact details.
     */
    createNewContact: function () {
        var me = this,
            newContact = Ext.create('ContactApp.model.Contact'),
            viewModel = me.getViewModel();

        //ToDo For Classic check for modern if same code works!!!

        viewModel.set('selectedContact', newContact);
        me.fireEvent('newcontactform', newContact, false);
    },

    /**
     * @event deleteConfirmatedHandler
     * Global event of the controller. This event is fired when contact has to be deleted form contact list.
     */
    deleteConfirmedHandler: function () {
        var me = this,
            contactGrid = this.getView(),
            selectedRecords = contactGrid.getSelections(),
            len, totalRec, counter;

        len = totalRec = counter = selectedRecords.length;

        while (--len > -1) {
            var record = selectedRecords[len];

            record.erase({
                success: function (rec, operation) {
                    me.getView().getStore().remove(rec);
                    if (--counter === 0) {
                        // me.reloadContactStore(); No need to reload the store as of now, as this is single application
                        me.fireEvent('showemptymessage');
                        me.updateProgressBar(-1, totalRec);

                        if (typeof(Ext.MessageBox) === 'object')
                            Ext.MessageBox.close();
                    }
                    me.updateProgressBar(totalRec - counter, totalRec);
                },
                failure: function (record, operation) {
                    if (--counter === 0) {
                        me.updateProgressBar(-1, totalRec);
                        // me.reloadContactStore();
                        if (typeof(Ext.MessageBox) === 'object') {
                            Ext.MessageBox.close();
                        }
                    }
                    else {
                        me.updateProgressBar(totalRec - counter, totalRec);
                    }
                }
            });
        }
    },
    /**
     * Add new contact to the contact list.
     * @param {ContactApp.model.Contact} record The contact that has to be added.
     */
    addContactToListOnSave: function (record) {
        var contactList = this.getView();

        contactList.getStore().add(record);
        contactList.setSelection(record);
    },

    /**
     * Search contact form the contact list
     * @param {ContactApp.ux.Search} comp Search field
     */
    searchContact: function (comp) {
        var me = this,
            contactList = me.getView(),
            store = contactList.getStore(),
            value = comp.getValue().toLowerCase(),
            selRec = contactList.getSelections();

        store.clearFilter();

        if (!Ext.isEmpty(Ext.String.trim(value))) {
            store.filterBy(function (rec) {
                var data = rec.getData(),
                    name = (data.prefix ? (data.prefix + '. ') : '') + data.firstName + ' ' + (data.middleName ? (data.middleName + ' ') : ' ') + (data.lastName ? data.lastName : '');

                return name.toLowerCase().indexOf(value.toLowerCase()) > -1;
            });
        }
        // Clear selection if searched result doesn't contains selected contact.
        if (selRec.length === 1 && store.indexOf(selRec[0]) === -1) {
            this.fireEvent('updatehash', 'nocontactselected');
            //contactList.getSelectionModel().deselectAll(); //toDo please check for modern contactList.deselectAll(); is correct or the one mentioned
        }
    },
    /**
     * Export Contact to .vcf format.
     *
     * @param {Ext.button} comp Button componet
     * @param {String} mode Modes of .vcf format (ios or google). By default it's value is `ios`
     */
    exportContacts: function (comp, mode) {

        var me = this,
            grid = me.getView(),
            selectedRecords = grid.getSelections(),
            ids = [],
            len = selectedRecords.length,
            timeOut = (len === 0 ? grid.getStore().getCount() : len) * 30000,
            failureCallback;

        while (--len > -1) {
            ids.push(selectedRecords[len].getId());
        }

        me.showExportStatus(true);

        failureCallback = function (error) {
            me.showExportStatus(false);
            Ext.Msg.show({
                title: 'Export contact?',
                message: 'Sorry, failed to export contact.' + (Ext.isString(error) ? '\n\n' + error : ''),
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
        };

        Ext.Ajax.request({
            url: '/exportcontact',
            method: 'POST',
            jsonData: {
                ids: ids,
                mode: mode ? mode : 'ios'
            },
            proxy: {
                timeout: timeOut
            },
            success: function (response) {
                var responseData = Ext.JSON.decode(response.responseText).data;
                if (Ext.platformTags['native']) {
                    new FileTransfer().download(
                        encodeURI(ContactApp.utils.UrlMapping.baseUrl + responseData.url),
                        cordova.file[Ext.os.is.iOS ? 'dataDirectory' : 'externalDataDirectory'] + responseData.url.substring(responseData.url.lastIndexOf('/') + 1).replace(/ /g, "_"),
                        function (fileEntry) {
                            me.showExportStatus(false);
                            if (Ext.os.is.iOS) {
                                window.plugins.socialsharing.share(null, 'Share contacts', fileEntry.toURL());
                            } else {
                                Ext.Msg.show({
                                    title: 'Exported successfully',
                                    message: 'Please choose one',
                                    buttons: [{
                                        text: 'Add to contacts',
                                        itemId: 'ACTION_VIEW', //Constant from cordova webintent plugin
                                        ui: 'action'
                                    }, {
                                        text: 'Share',
                                        itemId: 'ACTION_SEND', //Constant from cordova webintent plugin
                                        ui: 'action'
                                    }, {
                                        text: 'Cancel',
                                        itemId: 'cancel'
                                    }],
                                    icon: Ext.Msg.QUESTION,
                                    fn: function (itemId) {
                                        if (itemId !== 'cancel') {
                                            var extras = {};
                                            extras[window.plugins.webintent.EXTRA_STREAM] = fileEntry.toURL();
                                            window.plugins.webintent.startActivity(
                                                {
                                                    action: window.plugins.webintent[itemId],
                                                    extras: extras,
                                                    type: 'text/x-vcard'
                                                },
                                                function () {
                                                    /**
                                                     * success
                                                     */
                                                },
                                                failureCallback);
                                        }
                                    }
                                });
                            }
                        },
                        failureCallback,
                        false
                    );
                } else {
                    window.location.href = responseData.url;
                    if (len > 1) {
                        //ToDo from backend let it send how many contacts exported perfectly
                        Ext.toast({html: len + ' Contacts exported successfully!', timeout: 2000});
                        grid.setSelection(null);
                    }
                    else {
                        //ToDo from backend let it which contact exported perfectly
                        Ext.toast({html: 'Contact exported successfully...', timeout: 2000});
                    }
                    me.showExportStatus(false);
                }
            },
            failure: function () {
                failureCallback();
            }
        });
    },

    reSelectContact: function (selectedRecord) {
        this.getView().select(selectedRecord);
    },

    /**
     * Abstract function. This function is used to show the spinning image while exporting the contact.
     */
    showExportStatus: Ext.emptyFn
});