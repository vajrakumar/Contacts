/**
 * Created by vajra on 04/02/16.
 */
Ext.define('ContactApp.view.main.Routes', {
    extend: 'Ext.Mixin',
    routeNoSelectedContact: function () {
        this.fireEvent('displaynoselection');
    },
    routeContactSelect: function (contactId, viewOrEdit) {
        var me = this,
            contactList = this.getView(),
            store = contactList.getStore(),
            selectedRecs = contactList.getSelections(),
            selRcsCount = selectedRecs.length,
            selContact = selectedRecs[0];

        if (contactId < 0) {
            this.createNewContact();
            this.fireEvent('showcontactform');
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
            selected = cntctList.getSelections(),
            selRcsCount = selected.length,
            selContact = selected[0],
            listStore = cntctList.getStore();

        if (selRcsCount === 0 || selContact.getId() != contactId) {
            me.isRouting = true;
            cntctList.action = viewOrEdit;
            cntctList.select(listStore.getById(contactId));
            me.isRouting = false;
            //selMdl.select(listStore.getById(contactId),false,true );
            selected = cntctList.getSelections();
            selContact = selected[0];
            selRcsCount = selected.length;

            if (selRcsCount === 0) {
                this.updateHash('nocontactselected');
            }
        }

        if (viewOrEdit === 'edit') {
            me.fireEvent('showcontactform');
        }
        else {
            me.fireEvent('showcontactview');
        }
        //ToDO ViewModel not available on contactList??? how can it be null???? but it is available for its ownerCt....  is it not inherited?
        cntctList.up('app-main').getViewModel().set('selectCount', selRcsCount);
    },
    updateHash: function (action) {
        var contactList = this.getView(),
            selectedAry = contactList.getSelections(),
            selRcsCount = selectedAry.length;

        if (action === 'add') {
            this.redirectTo('contact/' + '-1' + '/' + 'add');

        }
        else if (action === 'nocontactselected') {
            if (selRcsCount >= 1) {
                contactList.deselectAll();
            }
            this.redirectTo('contacts');
        }
        else if (selectedAry.length === 1) {
            var selectedContactId = selectedAry[0].getId();

            if (action === 'edit') {
                this.redirectTo('contact/' + selectedContactId + '/' + 'edit');
            }
            else {
                //else if (action === 'view') {
                this.redirectTo('contact/' + selectedContactId + '/' + 'view');
            }
        }
        else if (action === 'multiselection' && selRcsCount > 1) {
            this.redirectTo('contacts/' + selRcsCount);
        }

    }
});