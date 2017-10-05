/**
 * Created by vajra on 29/09/15.
 */


Ext.define('ContactApp.overrides.Connection', {
    override: 'Ext.data.Connection',

    request: function (options) {
        options = options || {};

        var me = this,
            requestOptions, request;

        if (me.fireEvent('beforerequest', me, options) !== false) {
            requestOptions = me.setOptions(options, options.scope || Ext.global);

            request = me.createRequest(options, requestOptions);

            //return request.start(requestOptions.data);
            return request.start(requestOptions.data || request.data);
        }

        Ext.callback(options.callback, options.scope, [options, undefined, undefined]);

        return Ext.Deferred.rejected([options, undefined, undefined]);
    }
});