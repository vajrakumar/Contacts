/**
 * @class ProSvc.ux.form.UploadPanel
 * @extend Ext.grid.Panel
 * @author Andrea Cammarata
 */
Ext.define('ProSvc.ux.form.UploadPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.uploadpanel',
    alternateClassName: 'Ext.UploadPanel',
    requires: [
        'Ext.ProgressBarWidget',
        'Ext.data.Store',
        'Ext.form.field.FileButton',
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.grid.column.Widget',
        'Ext.grid.plugin.CellEditing',
        'ProSvc.ux.data.model.File'
    ],

    config: {

        options: null,

        /**
         * @cfg {Boolean} removeUploadedFiles
         * True to keep the grid clean automatically removing all the already uploaded files.
         */
        removeUploadedFiles: true,

        /**
         * @cfg {Number} removeUploadedFilesDelay
         * The delay to use for removing uploaded files from the grid.
         * This is only used if {@link #removeUploadedFiles} is set to true.
         */
        removeUploadedFilesDelay: 3000,

        /**
         * @cfg {Boolean} instantUpload
         * True to upload the files immediately without requires to call the {@link #upload} method.
         */
        instantUpload: false,

        /**
         * @cfg {String} fileSelectionButtonConfig
         * The button text to display on the file selection button. Note that if you supply a value for
         * {@link #buttonConfig}, the fileSelectionButtonConfig.text value will be used instead if available.
         */
        fileSelectionButtonConfig: {},

        /**
         * @cfg {String/Array} supportedFileExtensions
         * List of supported file formats.
         */
        supportedFileExtensions: []
    },

    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 2
    },

    REQUEST_COMPLETE: 4,

    initComponent: function(config){
        var me = this,
            instantUpload = me.getInstantUpload(),
            selectionButton = me.getFileSelectionButton();

        me.store = Ext.create('Ext.data.Store', {
            model: 'ProSvc.ux.data.model.File'
        });

        me.columns = [
            {
                text: 'Name',
                dataIndex: 'name',
                flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                text: 'Type',
                dataIndex: 'type',
                width: 100
            },
            {
                text: 'Size',
                dataIndex: 'sizeInfo',
                width: 100
            },
            {
                text: 'Last Modified',
                dataIndex: 'lastModifiedDate',
                width: 100
            },
            {
                xtype: 'widgetcolumn',
                text: 'Progress',
                dataIndex: 'progress',
                width: 100,
                widget: {
                    xtype: 'progressbarwidget'
                }
            },
            {
                xtype:'actioncolumn',
                dataIndex: 'action',
                renderer: me.actionColumnRenderer,
                width: 50,
                items: [
                    {
                        itemId: 'actionButton',
                        scope: me
                    }
                ]
            }
        ];

        me.tbar = ['->', selectionButton];

        me.callParent(arguments);
    },

    afterRender: function () {
        var me = this;

        me.callParent(arguments);

        me.createDropMask();

        me.el.on({
            dragover: me.cancel,
            dragenter: me.onDragEnter,
            drop: me.onDrop,
            scope: me
        })
    },

    onDragEnter: function (e) {
        this.maskEl.show();
    },

    onDrop: function (e) {
        var me = this,
            files = e.event.dataTransfer.files;

        me.cancel(e);
        me.addFiles(files);

        return false;
    },

    onFileSelected: function (button, e, value) {
        var el = button.fileInputEl.dom,
            files = el.files;

        this.addFiles(files);
    },

    onFileButtonRender: function (button) {
        var el = button.fileInputEl.dom;
        el.setAttribute('multiple', true);
    },

    onFileDeleteClick: function (grid, rowIndex, colIndex, item, e, record) {
        var store = this.getStore();
        Ext.Msg.confirm('Delete File', Ext.String.format('Do you really want to remove the file "{0}"?', record.get('name')), function (answer) {
            if (answer === 'yes') {
                store.remove(record);
            }
        });
    },

    onAbortFileUploadClick: function(grid, rowIndex, colIndex, item, e, record) {
        var request = file.get('request');
        request.abort();
        file.set({
            uploading: false,
            progress: 0
        });
    },

    onUploadFileClick: function(grid, rowIndex, colIndex, item, e, record) {
        this.uploadFile(record);
    },

    actionColumnRenderer: function(value, metaData){
        var me = this,
            panel = me.up('grid'),
            actionButton = me.items[0],
            iconCls = 'x-fa ',
            tooltip, handler;

        if(value === 'delete'){
            iconCls += 'fa-trash-o';
            tooltip = 'Delete';
            handler = panel.onFileDeleteClick.bind(panel);
        }
        else if(value === 'abort'){
            iconCls += 'fa-ban';
            tooltip = 'Abort';
            handler = panel.onAbortFileUploadClick.bind(panel);
        }
        else if(value === 'upload'){
            iconCls += 'fa-cloud-upload';
            tooltip = 'Upload';
            handler = panel.onUploadFileClick.bind(panel);
        }

        Ext.apply(actionButton, {
            iconCls: iconCls,
            tooltip: tooltip,
            handler: handler
        });
    },

    addFiles: function(files){
        var me = this,
            store = me.getStore(),
            instantUpload = me.getInstantUpload(),
            length = files.length,
            records = [],
            i = 0, file, record;

        for (; i < length; i++) {
            file = files[i];

            if(me.validateFile(file)) {
                record = Ext.create('ProSvc.ux.data.model.File', {
                    originalName: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                    lastModifiedDate: file.lastModifiedDate,
                    file: file
                });

                records.push(record);
            }
        }

        store.add(records);

        if (instantUpload) {
            me.upload();
        }

        me.maskEl.hide();
    },

    getFileSelectionButton: function () {
        var me = this,
            button = me.fileSelectionButton,
            buttonConfig = me.getFileSelectionButtonConfig();

        if (!button) {

            buttonConfig = Ext.apply({
                text: 'Select Files',
                listeners: {
                    scope: me,
                    afterrender: me.onFileButtonRender,
                    change: me.onFileSelected
                }
            }, buttonConfig);

            button = me.fileSelectionButton = Ext.widget('filebutton', buttonConfig);
        }

        return button;
    },

    /**
     * @private
     */
    createDropMask: function () {
        this.maskEl = this.el.appendChild({
            cls: Ext.baseCSSPrefix + 'upload-drop-zone',
            html: '<div class="x-message">Drop files here</div>'
        });

        this.maskEl.hide();
    },

    upload: function () {
        var me = this,
            store = me.getStore(),
            files = store.getRange(),
            length = files.length,
            i = 0;

        me.fireEvent('beforeupload', me, files);

        for(; i < length; i++){
            me.uploadFile(files[i]);
        }
    },

    uploadFile: function(file){
        var me = this,
            uploading = file.get('uploading'),
            uploaded = file.get('uploaded'),
            options = me.getOptions(),
            url = options.url,
            headers = options.headers || {};

            if (!uploading && !uploaded) {

                var formData = new FormData(),
                    request = new XMLHttpRequest(),
                    name = file.get('name'),
                    params, uploadUrl;

                params = {
                    id: file.getId(),
                    name: file.get('name')
                };

                uploadUrl = Ext.String.urlAppend(url, Ext.urlEncode(params));

                request.open('POST', uploadUrl, true);

                me.setRequestHeaders(request, headers);

            request.addEventListener('readystatechange', me.onUploadRequestStateChange.bind(me, file, request), false);

            request.upload.addEventListener('progress', me.onFileUploadProgress.bind(me, file), false);
            request.upload.addEventListener('error', me.onFileUploadError.bind(me, file), false);

            file.set({
                request: request,
                uploading: true
            });

            formData.append(name.replace(/\./g, '_'), file.get('file'));
            request.send(formData);
        }
    },

    setRequestHeaders: function (request, headers) {
        for (var key in headers) {
            request.setRequestHeader(key, headers[key]);
        }
    },

    onFileUploadProgress: function (file, e) {
        var total = e.total,
            loaded = e.loaded,
            progress = Math.round((100 * loaded) / total) / 100;

        file.set('progress', progress);
    },

    onUploadRequestStateChange: function(file, request, e){
        if(request.readyState === this.REQUEST_COMPLETE) {

            var me = this,
                store = me.getStore(),
                removeUploadedFiles = me.getRemoveUploadedFiles(),
                delay = me.getRemoveUploadedFilesDelay();

            if (request.status === 200) {
                file.set({
                    uploading: false,
                    uploaded: true,
                    uploadError: false
                });

                if (removeUploadedFiles) {
                    Ext.defer(function () {
                        store.remove(file);
                    }, delay);
                }

                me.fireEvent('fileupload', me, file, true);
            }
            else {
                me.onFileUploadError(file, e);
                me.fireEvent('fileupload', me, file, false);
            }
        }
    },

    onFileUploadError: function(file, e){
        file.set({
            uploading: false,
            uploadError: true,
            progress: 0
        });
    },

    /**
     * @private
     */
    cancel: function(e){
        if(e.preventDefault){
            e.preventDefault();
        }
        return false;
    },

    /**
     * Validate for supported file extensions.
     * @param {Object} file File object to be validated
     * @returns {boolean} true if the file is valid.
     */
    validateFile: function(file) {
        var supportedFiles = this.getSupportedFileExtensions();
        if (supportedFiles.length > 0) {
            return new RegExp('(.' + supportedFiles.join('.|') + ')$', 'gi').test(file.name);
        }
        return true;
    }
});