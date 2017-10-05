/**
 * Created by vajra on 08/02/16.
 */
Ext.define('ContactApp.view.details.ContactRoutes', {
    extend: 'Ext.Mixin',
    /**
     * Displays no selection message when no contact is selected.
     */
    showNoSelectionView: function () {
       // this.getView().setActiveItem('contact-no-selection');
        if (!this.getView().isHidden()) {
            this.getView().hide();
        }
    },
    /**
     * Display Form.
     */
    showContactForm: function () {
        this.getView().setActiveItem('contact-form');
        if (this.getView().isHidden()) {
            this.getView().show();
        }
    },
    /**
     * Display Contact summary detals and set status to edit mode.
     */
    showContactView: function () {
        this.getView().setActiveItem('contact-view');
        if (this.getView().isHidden()) {
            this.getView().show();
        }
    },
    /**
     * Shows multiselect grid
     */
    displayMultiSelectGrid: function () {
        this.getView().setActiveItem('multi-select-grid');
        if (!this.getView().isHidden()) {
            this.getView().hide();
        }
    }
});