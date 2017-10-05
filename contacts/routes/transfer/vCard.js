/**
 * This module helps to import and export contact from vCard.
 */

var vcf = require('cozy-vcard'),
    fs = require('fs-extra'),
    base64 = require('../base64');

var data = {

    escapeText: function (value) {
        var text;
        if (value == null) {
            return value;
        } else {
            text = value.replace(/([,;\\])/ig, "\\$1");
            text = text.replace(/\n/g, '\\n');
            return text;
        }
    },

    unescapeText: function (t) {
        var s;
        if (t == null) {
            return t;
        } else {
            s = t.replace(/\\n/ig, '\n');
            s = s.replace(/\\([,;\\])/ig, "$1");
            return s;
        }
    },

    /**
     * Convert vCard 'N' filed value into first name, last name, middle name and prefix values by splitting the value by `;` attribute.
     * @param {String} nameValue Name of the contact. Field 'N' in vCard.
     * @returns {Object} Returns Name in the format of Prefix, First Name, Middle Name and Last Name.
     */
    parseName: function (nameValue) {
        nameValue = nameValue.split(";", 5);

        return {
            lastName: nameValue[0],
            firstName: nameValue[1],
            middleName: nameValue[2],
            prefix: nameValue[3]
        }
    },

    /**
     * Convert vCard 'ADDR' field value into Street Address, Extended Address, City, State/Province, Pin code/Zip code and Country fields
     * @param {String} adrValues Address field of the contact.
     * @returns {Object} Returns Address fields.
     */
    parseAddress: function (adrValues) {

        var addressValues = typeof adrValues === 'string' ? adrValues.split(";", 7) : adrValues,
            pincode = (!isNaN(addressValues[5]) && addressValues[5].length > 0) ? +addressValues[5] : null;

        return {
            streetAddress: addressValues[0] + addressValues[1],
            extendedAddress: addressValues[2],
            city: addressValues[3],
            state: addressValues[4],
            pincode: pincode,
            country: addressValues[6]
        }
    },

    /**
     * Import contact from vCard(*.vcf) file.
     * @param {Object} file File filed
     * @param {Function} callBack function which will be invocked after import complete.
     * @param {Object} callBack.err Error Object. If there is no error then it's value is undefined.
     * @param {Object} callBack.contactList List of contacts extracted from vCard.
     * @param {Object} [scope] scope The scope (`this` reference) in which the specified function is executed.
     */
    importContact: function (file, callBack, scope) {
        var me = this;

        fs.readFile(file.path, 'utf8', function (err, fileData) {
            if (err) {
                callBack.apply(scope || me, [err]);
            }
            else {
                var json = new vcf(fileData.toString()),
                    contactList = [],
                    len, contacts;

                if (json && json.contacts) {
                    delete json.currentContact;
                    delete json.currentDatapoint;
                    delete json.currentIndex;
                    delete json.currentVersion;
                    delete json.currentversion;
                    contacts = json.contacts;

                    len = contacts.length;

                    while (--len > -1) {
                        //contactList.push();
                        contactList.push(me.getJSONData(contacts[len]));
                    }
                    callBack.apply(scope || me, [err, contactList]);
                }
            }
        });
    },


    getJSONData: function (vCardData) {
        var me = this,
            datapoints = vCardData.datapoints,
            contact = {},
            obj = {},
            isDetailsAdd = true,
            tempFileServerPath, serverConfig, key, name, prop, values, type;

        for (key in vCardData) {
            switch (key) {
                case 'n' :
                    values = me.parseName(vCardData[key]);
                    for (prop in values) {
                        contact[prop] = values[prop];
                    }
                    break;
                case 'org' :
                    contact.organization = vCardData[key];
                    break;
                case 'title':
                    contact.designation = vCardData[key];
                    break;
                case 'photo':
                    serverConfig = global.App.ServerConfig;
                    tempFileServerPath = serverConfig.fileServerPath + serverConfig.tempFolder + '/' + (Math.random() + '' + Date.now()).replace(/\W+/g, '_') + '.jpg';
                    contact.imageUrl = base64.convertBase64StringToFile(tempFileServerPath, vCardData[key]);
                    break;
                case 'bday':
                    if (!contact['date']) {
                        contact['date'] = []
                    }
                    contact['date'].push({
                        viewType: 'date',
                        type: 'Birthday',
                        value: vCardData[key],
                        id: null
                    });
                    break;
            }
        }

        for (key in datapoints) {

            obj = datapoints[key];
            name = obj.name;

            obj = {
                type: (obj.type || '').trim(),
                value: obj.value,
                id: null
            };

            type = obj.type ? obj.type.split(/[ ,]+/) : [];

            if (type.length > 1) {
                if (type.lastIndexOf('pref') > -1) {
                    obj.type = obj.type.replace(/( pref)$/ig, '');
                }
            }

            switch (name) {
                case 'tel':
                    obj.viewType = 'phone';
                    obj.type = obj.type.trim().replace(/( voice)$/ig, '').trim();

                    if (obj.type.trim().toLowerCase() == 'cell' || obj.type.trim().toLowerCase() == 'cell voice') {
                        obj.type = 'Mobile'
                    }

                    break;
                case 'email':
                    obj.viewType = 'email';
                    break;
                case 'url':
                    obj.viewType = 'url';
                    break;
                case 'adr':
                    values = me.parseAddress(obj.value);
                    isDetailsAdd = false;
                    break;
                case 'about':
                    if (isNaN(Date.parse(obj.value))) {
                        isDetailsAdd = false;
                        values = null;
                    }
                    else {
                        isDetailsAdd = true;
                        obj = {
                            viewType: 'date',
                            type: obj.type,
                            value: new Date(obj.value),
                            id: null
                        };
                    }
                    break;
                default :
                    obj.viewType = name;
            }

            if (isDetailsAdd) {
                if (!contact[name]) {
                    contact[name] = [];
                }
                contact[name].push(obj);
            }
            else {
                for (prop in values) {
                    contact[prop] = values[prop];
                }
                isDetailsAdd = true;
            }
        }
        return contact;
    },

    /**
     * Export selected contacts to vCard
     */
    exportContact: function (contacts, mode, fileName, callBack, scope) {

        if (contacts) {
            contacts = [].concat(contacts);
            try {
                var me = this,
                    len = contacts.length,
                    dataPoints = [],
                    vCardPic = [],
                    vCard = [],
                    vCardJson, dataPointLen, prop, contact, datapoint, obj, type, date, value;

                while (--len > -1) {
                    contact = contacts[len];

                    dataPoints = [];

                    vCardJson = {
                        datapoints: []
                    };

                    for (prop in contact) {
                        if (contact[prop] && contact[prop].constructor.name === 'Array') {
                            dataPoints = dataPoints.concat(contact[prop]);
                            delete contact[prop];
                        }
                    }

                    me.exportName(contact, vCardJson);
                    me.exportAddress(contact, vCardJson);

                    vCardJson.org = contact.organization || '';
                    vCardJson.title = contact.designation || '';

                    dataPointLen = dataPoints.length;

                    while (--dataPointLen > -1) {

                        datapoint = dataPoints[dataPointLen];

                        type = datapoint.type;

                        obj = {
                            name: datapoint.viewType,
                            type: type
                        };
                        switch (datapoint.viewType) {
                            case 'email':
                                if (type.toLowerCase().trim() === 'email') {
                                    obj.pref = true
                                }
                                obj.value = datapoint.value;
                                vCardJson.datapoints.push(obj);
                                break;

                            case 'url':
                                if (type.toLowerCase().trim() === 'homepage') {
                                    obj.pref = true;
                                }
                                obj.value = datapoint.value;
                                vCardJson.datapoints.push(obj);
                                break;

                            case 'date':
                                date = new Date(datapoint.value);
                                value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

                                if (type.toLowerCase().trim() === 'birthday' || type.toLowerCase().trim() === 'date of birth' || type.toLowerCase().trim() === 'dob' || type.toLowerCase().trim() === 'birth date') {
                                    vCardJson.bday = value;
                                }
                                else {
                                    obj.name = 'about';
                                    obj.value = value;
                                    if (obj.type === 'anniversary') {
                                        obj.pref = true;
                                    }
                                    obj.type = type;
                                    vCardJson.datapoints.push(obj);
                                }
                                break;

                            case 'phone':
                                if (type.toLowerCase().trim() === 'mobile') {
                                    obj.type = 'CELL';
                                    obj.pref = true;
                                }
                                obj.name = 'tel';
                                obj.value = datapoint.value;
                                vCardJson.datapoints.push(obj);
                                break;

                            default:
                                obj.value = datapoint.value;
                                vCardJson.datapoints.push(obj);
                                break;
                        }
                    }
                    if (contact.imageUrl) {
                        vCardPic.push({
                            imageUrl: contact.imageUrl,
                            json: vCardJson
                        });
                    }
                    else {
                        vCard.push(vCardJson);
                    }
                }
                me.buildVcard(vCard, vCardPic, fileName, callBack, scope || me, mode || 'ios');
            }
            catch (e) {
                callBack.apply(scope || this, [new Error()]);
            }
        }
        else {
            callBack.apply(scope || this, [new Error('No Contact Available to Export')]);
        }
    },

    exportName: function (contact, vCardJson) {
        var me = this,
            prefix = contact.prefix || '',
            firstName = contact.firstName || '',
            middleName = contact.middleName || '',
            lastName = contact.lastName || '';

        vCardJson.fn = prefix + ' ' + firstName + ' ' + middleName + ' ' + lastName;
        vCardJson.n = me.escapeText(lastName) + ';' + me.escapeText(firstName) + ';' + me.escapeText(middleName) + ';' + me.escapeText(prefix) + ';;';
    },

    exportAddress: function (contact, vCardJson) {

        vCardJson.datapoints.push(
            {
                name: 'adr',
                type: 'home',
                pref: true,
                value: [
                    "",
                    contact.streetAddress || '',
                    contact.extendedAddress || '',
                    contact.city || '',
                    contact.state || '',
                    (contact.pincode + '') || '',
                    contact.country || ''
                ]
            }
        );
    },

    buildVcard: function (vCardJsnonList, profilePictVcardJsonList, fileName, callBack, scope, mode) {

        var me = this,
            counter = profilePictVcardJsonList.length,
            len = vCardJsnonList.length,
            vCard = [],
            counter = 0,
            vCardJson;

        while (--len > -1) {
            vCardJson = vCardJsnonList[len];
            vCard.push(vcf.toVCF(vCardJson, null, mode));
        }

        len = profilePictVcardJsonList.length;
        if (len > 0) {
            while (--len > -1) {
                vCardJson = profilePictVcardJsonList[len];
                counter++;
                base64.convertRemoteFileToBase64String(
                    vCardJson.imageUrl,
                    function (err, fileData, vCardJson) {
                        //VcardJSon is a variable Name passed to call bqck function.
                        vCard.push(vcf.toVCF(vCardJson.json, fileData, mode));

                        counter--;
                        if (counter === 0) {
                            me.createVcardFile(vCard.join(''), fileName, callBack, scope);
                        }
                    },
                    this,
                    vCardJson
                );
            }
        }
        else {
            me.createVcardFile(vCard.join(''), fileName, callBack, scope);
        }
    },

    createVcardFile: function (vCardData, fileName, callBack, scope) {
        var me = this, serverConfig = global.App.ServerConfig,
            folderName = (Math.random() + '' + Date.now()).replace(/\./ig, ''),
            tempPath = serverConfig.fileServerPath + serverConfig.tempFolder + '/' + folderName;

        fs.ensureDir(tempPath, function(err){

            if(err){
                callBack.apply(scope || me, [new Error()]);
            }
            else {
                var writeStream = fs.createWriteStream(tempPath + '/' + fileName+ '.vcf');
                try {
                    writeStream.write(vCardData);
                    writeStream.end();
                    callBack.apply(scope || me, [null, tempPath, folderName + '/' + fileName+ '.vcf']);
                }
                catch (e) {
                    callBack.apply(scope || me, [new Error()]);
                }
            }
        });
    }
};

module.exports = data;