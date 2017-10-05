/**
 *  This is the view controller of the Contact list view. This class handles all the add, delete and search operations of contact list.
 */
Ext.define('ContactApp.view.list.ListController', {
    extend: 'ContactApp.view.list.BaseListController',

    requires: [
        'ContactApp.model.Contact'
    ],
    mixins: ['ContactApp.view.main.Routes'],
    routes: {
        'contacts': 'routeNoSelectedContact',
        'contacts/:count': 'routeMultiContactSelect',
        'contact/:id/:viewOrEdit': 'routeContactSelect'
    },
    alias: 'controller.list',

    /**
     * @event addcontacttolistonsave
     * Global event of the controller. This event is fired when the contact is saved and added to the contactlist store.
     * @param {ContactApp.model.Contact} record Contact that has to be added.
     */

    listen: {
        controller: {
            '*': {
                'deletecontacts': 'deleteConfirmedHandler',
                'addcontacttolistonsave': 'addContactToListOnSave',
                'deselectall': 'deselectAll',
                'exportcontacts': 'exportContacts',
                'updatehash': 'updateHash'
            }
        }
    },

    addContactHandler: function () {
        this.fireEvent('updatehash', 'add');
    },
    /**
     * Create new contact and fires a global event {@ContactApp.view.details.DetailsController newcontactform} `newcontactform`
     * to display form to fill new contact details.
     */
    createNewContact: function () {
        var view = this.getView(),
            store = view.getStore();
        if (store && store.getCount() > 0) {
            this.getView().deselectAll();
        }

        this.callParent();
    },

    /**
     * This method is used to delete contact from the contact list.
     * @param {ContactApp.model.Contact} record The contact that has to be deleted.
     */
    deleteContacts: function () {
        this.deleteConfirmedHandler();
    },


    /**
     * Displays contact summary view on tap of any contact in list.
     * @param {ContactApp.view.List} comp Contact List View
     * @param {Number} index Selected row index
     * @param {Object} target Selected row dom element
     * @param {ContactApp.model.Contact} record The contact selected.
     */
    onContactSelect: function (comp, record, eopts) {

        /* if (comp.getMode() === 'SINGLE' &&) {
         this.fireEvent('viewcontact', record, 'edit');
         }
         else if (comp.action === 'delete') {
         return false;
         }
         else if(comp.getMode() === 'MULTI'){
         return false;
         }
         else {
         this.fireEvent('viewcontact', record);
         }*/
        if (comp.getMode() === 'SINGLE') {
            if (comp.action === 'edit') {
                this.fireEvent('updatehash', 'edit');
            }
            else if (comp.action === 'delete') {
                return false;
            }
            else {
                this.fireEvent('updatehash', 'view');
            }
        }
        /*else if (comp.getMode() === 'MULTI') {
         this.fireEvent('updatehash', 'multiselection');
         }*/

    },

    /**
     * Search/filter contact based on the value typed in the search field.
     * @param {Ext.field.Search} comp Search Field Component
     * @param {String} value Contact name to be searched. //ToDo check if passing this is usefull? than accessing value from component
     */
    searchContact: function (comp) {
        var contactList = this.getView();
        contactList.getPlugin('listSlideActions').removeButtonPanel();// To remove if any horizontal slides caused delete / edit options on any contact
        this.callParent(arguments);
    },

    chooseContact: function (comp, evt) {
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        navigator.contacts.find(["displayName", "name"], function (contacts) {
            console.log('total:' + contacts.length);
        }, function (error) {
            Ext.Msg.show({
                title: 'Import contact',
                message: 'Sorry, failed to get the contact.' + (Ext.isString(error) ? '\n\n' + error : ''),
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
        }, options);
    },

    importContact: function (comp, value) {
        if (!Ext.isEmpty(value)) {
            var me = this,
                file = comp.getFiles().item(0),
                formData = new FormData(),
                request = new XMLHttpRequest(),
                name = file.name;

            request.open('POST', '/importcontact', true);

            request.addEventListener('readystatechange', me.readStateChange.bind(me, file, request, comp), false);
            request.upload.addEventListener('error', me.importContactError.bind(me, file, request, comp), false);

            formData.append(name.replace(/\./g, '_'), file);
            request.send(formData);

            comp.parent.down('#import-status').show();
            comp.parent.down('#import-close').hide();

        }
    },

    readStateChange: function (file, request, fileField, eOpt) {
        if (request.readyState === 4) {
            var me = this,
                contactList = me.getView(),
                store = contactList.getStore();
            if (request.status === 200) {
                store.reload();
                fileField.up('toolbar').hide();
            }
            else {
                Ext.toast({
                    html: 'Impoarting contacts failed',
                    timeout: 3000
                });
                comp.parent.down('#import-status').hide();
                comp.parent.down('#import-close').show();
            }
        }
    },

    importContactError: function (file, request, fileField, eOpt) {
        Ext.toast({
            html: 'Impoarting contacts failed',
            timeout: 3000
        });
        comp.parent.down('#import-status').hide();
        comp.parent.down('#import-close').show();
    },

    onImportHide: function (toolbar) {
        var fielfield = toolbar.down('filefield');
        if (fielfield && fielfield.getValue() !== '') {
            fielfield.getComponent().input.dom.value = '';
        }
    },

    /**
     * @param {Ext.dataview.DataView} component
     * @param {Number} index
     * @param {Ext.Element/Ext.dataview.component.DataItem} target
     * @param {Ext.data.Model} record
     * @param {Ext.event.Event} e
     */
    optionsOnContacts: function (component, index, target, record, e) {
        //debugger;

    },
    singleMenuBtnItemTap: function (comp, index, target, record, e, eOpts, menuBtnSingle) {
        var grid = this.getView();

        switch (record.get('title')) {
            case 'Add':
            {
                this.addContactHandler();

                break;
            }
            case 'Import':
            {
                var toolbar = grid.down('#import-contact-toolbar');
                toolbar.show();
                toolbar.down('#import-status').hide();
                toolbar.down('#import-close').show();
                break;
            }
            case 'Select':
            {
                if (grid && grid.getStore() && grid.getStore().isLoading()) {
                    Ext.toast({html: 'Please wait... Loading...!', timeout: 2000});
                    return;
                }
                else if (grid && grid.getStore() && grid.getStore().getCount() === 0) {
                    Ext.toast({html: 'No Contacts to Select!', timeout: 2000});
                    return;
                }
                this.selectTap(comp, index, target, record, e, eOpts, menuBtnSingle);
                break;
            }
        }
    },
    multiMenuBtnItemTap: function (comp, index, target, record, e, eOpts, menuBtnMulti) {
        var grid = this.getView();

        if (grid.getSelections().length === 0) {
            Ext.toast({html: 'Please Select at least 1 contact!', timeout: 2000});
            return;
        }

        switch (record.get('title')) {
            case 'Delete' :
            {
                this.DeleteTap(comp, index, target, record, e, eOpts, menuBtnMulti);
                break;
            }
            case 'Export Apple' :
            {
                this.exportContacts(comp, 'ios');
                break;
            }
            case 'Export Android' :
            {
                this.exportContacts(comp, 'google');
                break;
            }
        }

        if (grid.getStore().getCount() === 0) {
            this.switchList();
        }


    },
    selectTap: function (comp, index, target, record, e, eOpts, menuBtnSingle) {
        var grid = this.getView();

        var multiSelectplugin = grid.getPlugins('gridmultiselection')[0];
        multiSelectplugin.onSelectTap();
        this.switchList();

    },
    DeleteTap: function (comp, index, target, record, e, eOpts, menuBtnMulti) {
        var grid = this.getView();
        grid.getSelections();
        this.fireEvent('deletecontacts');
    },
    deselectAll: function () {
        this.getView().deselectAll();
    },
    exitMultiSelection: function () {
        this.switchList();
    },
    switchList: function () {
        var grid = this.getView(),
            multiSelectMenu = grid.down('#multiSelectMenuBtn'),
            singleSelectMenu = grid.down('#singleSelectMenuBtn');

        if (grid.getMode() === "MULTI") {
            singleSelectMenu.hide();
            // multiSelectMenu.show();

            multiSelectMenu.setBadgeText(grid.getSelections().length);
        }
        else {
            singleSelectMenu.show();
        }
        this.showMultiSelectMenu(false);

    },
    /**
     * @param {Ext.mixin.Selectable} component
     * @param {Ext.data.Model[]} records
     */
    updateCount: function (grid, records) {
        if (grid.getMode() === 'MULTI') {
            var len = grid.getSelections().length,
                multiMenuBtn = grid.down('#multiSelectMenuBtn');
            if (len === 0) {
                this.showMultiSelectMenu(false);
            }
            else {
                this.showMultiSelectMenu(true);
            }
            multiMenuBtn.updateBadgeText(len);
            multiMenuBtn.updateBadgeCls('button-badgetext');
        }
    },
    updateProgressBar: function (counter, total, msg) {
        //ToDo doonot display toast as it will keep on displaying all n number of toasts where n = number of times this method is called.
        //   var i = counter / total;
        // Ext.MessageBox.updateProgress(i, Math.round(100 * i) + '%', msg);
        //  Ext.toast('Deleting ... '+Math.round(100 * i) + '%');
    },

    showMultiSelectMenu: function (isDisplay) {
        var exportMenu = this.lookup('multiselectBtn');
        if (exportMenu) {
            exportMenu[isDisplay ? 'show' : 'hide']();
        }
    }
});