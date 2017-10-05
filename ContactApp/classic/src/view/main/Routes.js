/**
 * Created by vajra on 08/02/16.
 */
Ext.define('ContactApp.view.main.Routes', {
    extend: 'Ext.Mixin',
    routeNoSelectedContact: function () {
        this.fireEvent('displaynoselection');
    },
    routeMultiContactSelect: function (cntctsSelectedCount) {
        var me = this,
            view = me.getView();

        //ToDo if he refresh page after selecting contacts : multiselect :: then how to remember all the selected contacts and set the selection back?
        if (view.getSelectionModel().getSelected().getCount() != cntctsSelectedCount) {
            me.updateHash('nocontactselected');
        }
        else {
            me.fireEvent('displaymultiselection');
        }

        view.up('app-main').getViewModel().set('selectCount', cntctsSelectedCount);
    },
    routeContactSelect: function (contactId, viewOrEdit) {
        var me = this,
            contactList = me.getView(),
            store = contactList.getStore();

        if (contactId < 0) {
            me.createNewContact();
            me.fireEvent('showcontactform');
            //ToDO write logic to clear selected record or anything else if any record selected and then if anybody enters this URL then in new form the loaded record will be displayed
        }
        else if (contactId > 0) {
            if (store && store.isLoaded()) {
                this.showViewOrEdit(contactId, viewOrEdit);
            }
            else {
                Ext.defer(function () {
                    this.getView().getStore().on('load', function () {
                            me.showViewOrEdit(contactId, viewOrEdit);
                            console.log('Hey! loaded');
                        }
                        , me
                        , {single: true}
                    );
                }, 10, me);
            }
        }
    },
    showViewOrEdit: function (contactId, viewOrEdit) {

        var me = this,
            cntctList = me.getView(),
            listStore = cntctList.getStore(),
            selCount;

        me.isRouting = true;
        cntctList.setSelection(listStore.getById(contactId));
        me.isRouting = false;

        selCount = cntctList.getSelections().length;

        if (selCount === 0) {
            this.updateHash('nocontactselected');
        }

        if (viewOrEdit === 'edit') {
            me.fireEvent('showcontactform');
        }
        else {
            me.fireEvent('showcontactview');
        }
        //ToDO ViewModel not available on contactList??? how can it be null???? but it is available for its ownerCt....  is it not inherited?
        cntctList.up('app-main').getViewModel().set('selectCount', selCount);
    },

    updateHash: function (action) {
        var contactList = this.getView(),
            selectedAry = contactList.getSelections(),
            selRcsCount = selectedAry.length;

        if (action === 'add') {
            this.redirectTo('contact/' + '-1' + '/' + 'add');
        }
        else if (action === 'nocontactselected') {
            if (selRcsCount > 1) {
                contactList.getSelectionModel().deselectAll();
            }
            this.redirectTo('contacts');
        }
        else if (selectedAry.length === 1) {
            var selectedContactId = selectedAry[0].getId();

            if (action === 'edit') {
                this.redirectTo('contact/' + selectedContactId + '/' + 'edit');
            }
            else {
                this.redirectTo('contact/' + selectedContactId + '/' + 'view');
            }
        }
        else if (action === 'multiselection' && selRcsCount > 1) {
            this.redirectTo('contacts/' + selRcsCount);
        }
    }
});