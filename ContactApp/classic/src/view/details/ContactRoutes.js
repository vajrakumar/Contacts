/**
 * Created by vajra on 08/02/16.
 */
Ext.define('ContactApp.view.details.ContactRoutes', {
    extend: 'Ext.Mixin',
    /**
     * Displays no selection message when no contact is selected.
     */
    showNoSelectionView: function () {
        this.getView().setActiveItem('contact-no-selection');
    },
    /**
     * Display Form.
     */
    showContactForm: function () {
        this.getView().setActiveItem('contact-form');
    },
    /**
     * Display Contact summary detals and set status to edit mode.
     */
    showContactView: function () {
        this.getView().setActiveItem('contact-view');
    },
    /**
     * Shows multiselect grid
     */
    displayMultiSelectGrid: function () {
        this.getView().setActiveItem('multi-select-grid');
    }
});