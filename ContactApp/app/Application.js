/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('ContactApp.Application', {
    extend: 'Ext.app.Application',

    name: 'ContactApp',

    stores: [
        // TODO: add global / shared stores here
    ],

    launch: function () {
        if (Ext.get('page-loader')) {
            Ext.get('page-loader').remove();
        }
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
