/**
 *  This is the view controller of the {@ContactApp.view.list.List} Contact list view.
 *  This class handles all the add, delete and search operations of contact list.
 */

Ext.define('ContactApp.view.list.ListController', {
    extend: 'ContactApp.view.list.BaseListController',

    requires: [
        'ContactApp.model.Contact',
        'ContactApp.view.list.FileUploadWindow'
    ],
    mixins: ['ContactApp.view.main.Routes'],
    routes: {
        'contacts': 'routeNoSelectedContact',
        'contacts/:count': 'routeMultiContactSelect',
        'contact/:id/:viewOrEdit': 'routeContactSelect'
    },
    alias: 'controller.list',

    listen: {
        controller: {
            '*': {
                /**
                 * @event deletecontact
                 * Global event of the controller. This event is fired when contact has to be deleted form contact list.
                 * @param {ContactApp.model.Contact} record Contact that has to be removed.
                 */
                'deletecontact': 'deleteContacts',
                /**
                 * @event addcontacttolistonsave
                 * Gloabal event of the controller. This event is fired when contact has to be added to the contact list.
                 * @param {ContactApp.model.Contact} record Contact that has to be added to the contact list.
                 */
                'addcontacttolistonsave': 'reSelectContact',
                /**
                 * @event reloadcontactList
                 * Global event of the controller. This event is fired when contact list has to be reloaded
                 * @param {ContactApp.model.Contact} [record] currently selected contact
                 */
                // 'reloadcontactList': 'reloadContactStore',
                /**
                 * @event exportcontact
                 * Global controller event. This event is fired to export selected contacts form the contact list.
                 * @param {String} mode Mode of export format. Modes may be `ios` or `google`.
                 */
                'exportcontact': 'exportContacts',
                /**
                 * @event deselectcontact
                 * Global controller event. This event is fired to remove selection form the contact list
                 * @param {ContactApp.model.Contact} record Contact whose selection to be removed.
                 */
                'deselectcontact': 'deSelectContact',
                /**
                 * @event deselectallcontact
                 * Global controller event. This event is fired to remove selection form the contact list
                 * @param {ContactApp.model.Contact} record Contact whose selection to be removed.
                 */
                'deselectallcontact': 'deSelectAllContacts',
                'updatehash': 'updateHash'
            }
        }
    },


    addContactHandler: function () {

        this.getView().getSelectionModel().deselectAll();
        Ext.defer(function () {
            this.fireEvent('updatehash', 'add');
        }, 10, this);
    },
    /**
     * Create new contact and fires global view controller event {@link ContactApp.view.details.DetailsController newContactForm} `newcontactform`
     * to display form to fill new contact details.
     */
    createNewContact: function () {
        this.getView().getSelectionModel().deselectAll();
        this.callParent();
    },

    /**
     * Delete contact from the contact list.
     */
    deleteContacts: function () {
        var me = this,
            contactList = this.getView(),
            data, name, msg,
            selectedRecords = contactList.getSelections();

        if (selectedRecords.length > 1) {
            msg = 'Do you want to delete ' + selectedRecords.length + ' contacts';
        }
        else {
            data = selectedRecords[0].getData();
            name = (data.prefix ? (data.prefix + '. ') : '') + data.firstName + ' ' + (data.middleName ? (data.middleName + ' ') : ' ') + (data.lastName ? data.lastName : '');
            msg = 'Do you want to delete contact ' + name;
        }

        Ext.Msg.show({
            icon: Ext.Msg.QUESTION,
            buttons: Ext.Msg.YESNO,
            title: 'Delete Confirmation',
            msg: msg,
            fn: me.deleteConfirmedHandler,
            scope: me
        });
    },

    deleteConfirmedHandler: function (status) {

        if ('yes' === status) {
            var len, title;

            var me = this,
                contactList = me.getView(),
                data, name,
                selectedRecords = contactList.getSelections();

            len = selectedRecords.length;

            if (len === 1) {
                data = selectedRecords[0].getData();
                name = (data.prefix ? (data.prefix + '. ') : '') + data.firstName + ' ' + (data.middleName ? (data.middleName + ' ') : ' ') + (data.lastName ? data.lastName : '');
                title = 'Deleting contact ' + name;
            }
            else {
                title = 'Deleting ' + len + ' contacts';
            }

            Ext.MessageBox.show({
                modal: true,
                title: title,
                progress: true,
                msg: title,
                closable: false
            });

            me.callParent();
            me.updateHash('nocontactselected');
        }
    },

    reSelectContact: function (selectedRecord) {
        var view = this.getView(),
            store = view.getStore();
        if (selectedRecord) {
            store.add(selectedRecord);
        }

        view.setSelection(selectedRecord);
        //ToDo currently the reloading of store is prevented which can be enabled later.
        /*
         var me = this,
         view = this.getView(),
         id = selectedRecord.getId(),
         store = view.getStore();

         view.mask('Loading...');
         store.reload({
         callback: function () {
         var view = this.getView(),
         rec = view.getStore().findRecord('id', id);
         if (rec) {
         view.setSelection(rec);
         }
         view.unmask();
         },
         scope: me
         }); */
    },
    /**
     * Updates progressbar  status and  message
     * @param {Number} counter Counter used to calculate % change
     * @param {Number} total Total count used to calculate % change
     * @param {String} [msg] Message to be displayed.
     */
    updateProgressBar: function (counter, total, msg) {
        var i = counter / total;
        Ext.MessageBox.updateProgress(i, Math.round(100 * i) + '%', msg);
    },

    /**
     * This method is invoked when contact is selected.
     * @param {ContacatApp.view.list.List} view Contact list view.
     * @param record {ContactApp.model.Contact) record Selected contact.
     */
    onContactSelect: function (view, record) {
        if (record.length === 1) {
            // this.getView().setSelection(record);
            this.fireEvent('updatehash', 'view');
        }
        else if (record.length > 1) {
            this.fireEvent('updatehash', 'multiselection');
        }
    },


    /**
     * Import contact form vCard.
     */
    importContact: function () {
        var me = this;
        var fpWin = Ext.create('ContactApp.view.list.FileUploadWindow',
            {
                listeners: {
                    uploadcomplete: function (comp, allSucceed) {
                        var contactList = me.getView(),
                            store = contactList.getStore();
                        if (allSucceed) {
                            comp.close();
                        }
                        store.reload();
                    }
                }
            });
        fpWin.show();
    },

    addToMultiSelect: function (selModel, record) {
        var selCont = selModel.getCount();
        if (record) {
            record.set('selected', true);
        }
        if (!this.isRouting) {
            if (selCont === 1) {
                this.fireEvent('updatehash', 'view');
            }
            else if (selCont > 1) {

                this.fireEvent('updatehash', 'multiselection');
            }
            else if (selCont === 0) {
                this.fireEvent('updatehash', 'nocontactselected');
            }
        }
    },

    removeFromMultiSelect: function (selModel, record) {
        var me = this,
            count = selModel.getCount();
        record.set('selected', false);
        me.getViewModel().set('selectCount', count);
        if (count === 1) {
            me.fireEvent('updatehash', 'view');
        }
        else if (count === 0) {
            me.fireEvent('updatehash', 'nocontactselected');
        }
    },

    deSelectContact: function (rec) {
        this.getView().getSelectionModel().deselect(rec);
    },

    deSelectAllContacts: function () {
        var contactList = this.getView();
        contactList.getSelectionModel().deselectAll();
    },

    exportContacts: function (comp, mode) {
        this.callParent(arguments);
    },

    showExportStatus: function (isDisplay) {
        var exportStatusCmp = this.lookup('export-status-container');
        if (isDisplay) {
            exportStatusCmp.exportCount++;
        }
        else {
            exportStatusCmp.exportCount--;
        }

        this.lookup('export-status-container').setVisible(exportStatusCmp.exportCount > 0);
    }
});