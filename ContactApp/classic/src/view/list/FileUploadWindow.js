/**
 * Created by vajra on 12/10/15.
 */
Ext.define('ContactApp.view.list.FileUploadWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.layout.container.Fit',
        'ProSvc.ux.form.UploadPanel'
    ],
    alias: 'widget.file-upload-window',
    layout: 'fit',
    height: 400,
    width: 600,
    title: 'Import Contact',
    modal: true,

    config: {
        fileUploadCounter: 0,
        failedUploadCount: 0
    },

    items: [
        {
            xtype: 'uploadpanel',
            instantUpload: true,
            supportedFileExtensions: ['vcf'],
            options: {
                url: '/importcontact'
            },
            listeners: {
                fileupload: function (comp, file, status) {

                    var fileUploadComp = this.up('window'),
                        counter = fileUploadComp.getFileUploadCounter(),
                        failCounter = fileUploadComp.getFailedUploadCount();
                    --counter;

                    if (!status) {
                        fileUploadComp.setFailedUploadCount(++failCounter);
                    }

                    if (counter === 0) {
                        fileUploadComp.fireEvent('uploadcomplete', fileUploadComp, failCounter === 0 ? true : false);
                    }
                    else {
                        fileUploadComp.setFileUploadCounter(counter);
                    }
                },
                beforeupload: function (comp, files) {
                    var fileUploadComp = comp.up('window');
                    fileUploadComp.setFileUploadCounter(files.length);
                }
            }
        }
    ]
});