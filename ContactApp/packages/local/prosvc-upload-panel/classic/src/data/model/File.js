/**
 * @class ProSvc.ux.data.model.File
 * @extend Ext.data.Model
 * @author Andrea Cammarata
 * Data model which contains all the information of files to upload.
 */
Ext.define('ProSvc.ux.data.model.File', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.identifier.Uuid'],
    identifier: 'uuid',
    fields: [
        {
            name: 'originalName',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string',
            depends: ['originalName'],
            convert: function(value, record){
                return value || record.get('originalName');
            }
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'size',
            type: 'number'
        },
        {
            name: 'lastModified',
            type: 'int'
        },
        {
            name: 'lastModifiedDate',
            type: 'date'
        },
        {
            name: 'progress',
            type: 'number',
            persist: false
        },
        {
            name: 'uploading',
            type: 'boolean',
            defaultValue: false,
            persist: false
        },
        {
            name: 'uploaded',
            type: 'boolean',
            defaultValue: false,
            persist: false
        },
        {
            name: 'uploadError',
            type: 'boolean',
            defaultValue: false,
            persist: false
        },
        {
            name: 'file',
            type: 'auto',
            persist: false
        },
        {
            name: 'request',
            type: 'auto',
            persist: false
        },
        {
            name: 'sizeInfo',
            type: 'string',
            depends: ['size'],
            calculate: function(data){
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
                    value = data.size,
                    i;

                if (value == 0) return '0 Byte';

                i = parseInt(Math.floor(Math.log(value) / Math.log(1024)));
                return Math.round(value / Math.pow(1024, i), 2) + ' ' + sizes[i];
            }
        },
        {
            name: 'action',
            type: 'string',
            depends: ['uploading', 'uploadError'],
            persist: false,
            calculate: function(data){
                if(data.uploading){
                    return 'abort';
                }
                else if(data.uploadError){
                    return 'upload';
                }
                return 'delete';
            }
        }
    ]
});