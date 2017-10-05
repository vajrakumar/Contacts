Ext.beforeLoad = function (tags) {
    tags.native = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
};