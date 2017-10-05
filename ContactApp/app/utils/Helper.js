/**
 *  This is a Helper class which contains generic and reusable code which are independent of Ext components.
 */
Ext.define('ContactApp.utils.Helper', {

    singleton: true,

    /**
     * This method is used to scale the image based on the width and height of the parent container or .
     * @param imageObj {Object} Image dom object for which scaling has to be done.
     * @param targetwidth {Number} width of the parent Container / fixed width
     * @param targetheight height of the parent Container / fixed width.
     * @param isLetterBox  false for zooming of image.
     */
    scaleImage: function (imageObj, targetwidth, targetheight, isLetterBox) {

        var width = 0,
            height = 0,
            scaleX1 = targetwidth,
            scaleY1 = (imageObj.height * targetwidth) / imageObj.width,
            scaleX2 = (imageObj.width * targetheight) / imageObj.height,
            scaleY2 = targetheight,
            fScaleOnWidth = scaleX2 > targetwidth;

        if (fScaleOnWidth) {
            fScaleOnWidth = isLetterBox;
        }
        else {
            fScaleOnWidth = !isLetterBox;
        }

        if (fScaleOnWidth) {
            width = Math.floor(scaleX1);
            height = Math.floor(scaleY1);
        }
        else {
            width = Math.floor(scaleX2);
            height = Math.floor(scaleY2);
        }

        imageObj.style.left = (Math.floor((targetwidth - width) / 2)) + 'px';
        imageObj.style.top = (Math.floor((targetheight - height) / 2)) + 'px';

        imageObj.style.width = width + 'px';
        imageObj.style.height = height + 'px';
    },

    /**
     * This method is used to check if the store is modified or not.
     * @param store
     * @returns {boolean}
     */
    isStoreModified: function (store) {
        if (store) {
            var modifiedRecordsCount = store.getModifiedRecords().length,
                deletedRecordsCount = store.getRemovedRecords().length;

            return (modifiedRecordsCount + deletedRecordsCount) > 0;
        }
        else {
            return false;
        }
    },

    mobileDeviceAccessFunctionality: function (type, value, el) {
        value = Ext.String.htmlDecode(value);
        var url = "";

        switch (type) {
            case 'phoneNumbers':
                url = "tel:" + value;
                break;
            case  'emails':
                url = "mailto:" + value;
                break;
            case 'urls':
                url = value;
                break;
            case 'address':
                url = "https://www.google.com/maps/dir/Current+Location/" + value;
                break;
        }
        window.open(url);
    }

});