/**
 * This class overrides updateData method to make sure that data passed to template is data object not data model.
 * JIRA-ID: EXTJS-19414
 * URL: https://sencha.jira.com/browse/EXTJS-19414
 */
Ext.define('ContactApp.overrides.Component', {

    override: 'Ext.Component',

    /**
     * Checks passed parameter is model or not. If passed parameter is model then it extracts data object and calls parent updateData method.
     * @param newData
     * @returns {*|Object}
     */
    updateData: function (newData) {
        var me = this;

        if (newData && newData.isModel) {
            newData = newData.getData(true);
        }

        return me.callParent(arguments);
    },
    /* Retrieves a plugin from this component's collection by its `pluginId`.
     * @param {String} pluginId The `pluginId` set on the plugin config object
     * @return {Ext.plugin.Abstract} plugin instance or `null` if not found
     */
    getPlugin: function (pluginId) {
        var i,
            plugins = this.getPlugins(),//ToDo understand why this.plugins is not working? why it is accessible as this._plugins / this.getPlugins()?
        //plugins = this.plugins,
            ln = plugins && plugins.length;

        for (i = 0; i < ln; i++) {
            if (plugins[i].pluginId === pluginId) {
                return plugins[i];
            }
        }
        return null;
    }
});