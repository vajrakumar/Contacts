/**
 * Base model for all models across Contact application. This model by default sets identifier fields to negative value
 * for newly created records.
 */
Ext.define('ContactApp.model.Base', {

    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.identifier.Negative'
    ],

    /**
     * Negative id's for newly created Records.
     */
    identifier: 'negative'
});