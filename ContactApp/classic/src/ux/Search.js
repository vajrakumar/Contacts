/**
 * This ux component is used for perform local search on every key press it fires an event 'search'.
 */
Ext.define('ContactApp.ux.Search', {
    extend: 'Ext.form.field.Text',

    alias: 'widget.search-field',

    validationEvent: false,
    validateOnBlur: false,
    enableKeyEvents: true,

    listeners: {
        keyup: function (comp, eve) {
            var val = comp.getValue(),
                clearTrigger = comp.triggers.clear;

            //Hide clear trigger if there is no text in search field.
            clearTrigger.setVisible(!Ext.isEmpty(val));

            comp.fireEvent('search', comp, eve);
        },

        /**
         * @event search
         * Fires when user start entering text.
         * @param {Ext.form.field.Text} comp Textfield where text is entered.
         * @param eve {Ext.Event} event Event Object.
         */
        search: Ext.emptyFn
    },

    /**
     * Triggers to perform search operation and clear search text.
     */
    triggers: {
        /**
         * Trigger used to clear search.
         */
        clear: {
            cls: 'x-form-clear-trigger',
            //Handler to clear the filter
            handler: function (textField, triggerComp, eve) {
                textField.setValue("");
                triggerComp.hide();
                textField.fireEvent('search', textField, eve);
            },
            hidden: true
        },
        /**
         * Trigger to perform search.
         */
        search: {
            cls: 'x-form-search-trigger',
            //handler to perform filter of contact
            handler: function (textField, triggerComp, eve) {
                textField.fireEvent('searchcontact', textField, eve);
            }
        }
    }
});