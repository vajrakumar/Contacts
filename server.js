var express = require('express'),
    bodyParser = require('body-parser'),
    nconf = require('nconf'),
    path = require('path'),
    log4js = require('log4js'),
    fs = require('fs-extra'),
    conectMultipart = require('connect-multiparty')(),
    inflection = require('inflection'),
    _ = require('underscore'),
    http = require('http'),
    app = express(),
    mode = app.get('env'), //Note: when node environment is set to development, then logs are not coming full!!!
    isProduction = mode === 'production',
    configFileName = 'config.' + mode + '.json',
    errorProperties = isProduction ? ['code', 'message'] : ['code', 'file', 'line', 'severity', 'stack'];

//Load config.json file
nconf.argv().env().file(__dirname + '/' + configFileName);

//server & db config
var serverConfig = nconf.get('server'),
    dbconfig = nconf.get('server:database');

// use env's DATABASE_URL if set (e.g. on Heroku)
if (nconf.get('DATABASE_URL')) {
    dbconfig.connection = nconf.get('DATABASE_URL');
}

/**
 * Ensures that all directories exists.
 * If the directory structure does not exist, it is created (throws error if failed)
 */
fs.ensureDirSync(serverConfig.logsFolder);
fs.ensureDirSync(serverConfig.fileServerPath + serverConfig.tempFolder);
fs.ensureDirSync(serverConfig.fileServerPath + serverConfig.profileFolder + serverConfig.profileSubFolder);

//Kenex & Bookshelf instances from db config
var Knex = require('knex')(dbconfig),
    BookShelf = require('bookshelf')(Knex);

//add virtuals plguin to BookShelf which helps in defining virtual properties on the model to compute new values.
BookShelf.plugin('virtuals');

//log4js config
log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'dateFile',
        filename: serverConfig.logsFolder + '/access.log',
        pattern: "-dd-hh.log",
        alwaysIncludePattern: false
    }]
});

//Adding the followings to global object to make it accessible from anywhere
global.App = _.extend(app, {
    mode: mode,
    configFileName: configFileName,
    ServerConfig: serverConfig,
    DBconfig: dbconfig,
    port: process.env.PORT || serverConfig.port,
    isSecureConnection: serverConfig.protocol === 'https',
    BookShelf: BookShelf,
    BookShelfModel: BookShelf.Model.extend({
        format: function (attributes) {
            return _.reduce(attributes, function (obj, val, key) {
                obj[inflection.underscore(key)] = val;
                return obj;
            }, {})
        },
        parse: function (attributes) {
            return _.reduce(attributes, function (obj, val, key) {
                obj[inflection.camelize(key, true)] = val;
                return obj;
            }, {})
        }
    })
});

/**
 * All the following modules uses global.App,
 * so declaring them here
 */
var ContactUser = require('./contacts/routes/personal'),
    clearTempFiles = require('./contacts/routes/deleteTempFiles'),
    ContactType = require('./contacts/routes/details'),
    avatarUploader = require('./contacts/routes/avatarUploader'),
    transferContact = require('./contacts/routes/transfer'),
    logger = log4js.getLogger();

/**
 * body parsing middleware
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// ---------------------- PATH MAPPING BEGIN ----------------------

/**
 * root folder path
 */
app.use('/', express.static(__dirname + serverConfig.webRoot));

/**
 * static path to access file server path for profile picture
 */
app.use('/avatar', express.static(serverConfig.fileServerPath));

/**
 * static path to access file server path for exporting files
 */
app.use('/export', express.static(serverConfig.fileServerPath));

// ---------------------- PATH MAPPING END ----------------------


// ---------------------- APIs BEGIN ----------------------

/**
 * Delete all contacts from DB (enabled only on non-production environemnt)
 */
if (!isProduction) {
    app.get('/resetdb', ContactUser.deleteAll);
}

/**
 * Get all contacts
 */
app.get('/contacts', ContactUser.getContacts);

/**
 * Get contact by it's id
 */
app.get('/contacts/:id', ContactUser.getContactById);

/**
 * Add new contact
 */
app.post('/contacts', ContactUser.insertIndividualContact, ContactUser.saveContact, ContactUser.getContactById);

/**
 * Update contact by it's id
 */
app.put('/contacts/:id', ContactUser.updatePersonalInformation, ContactUser.saveContact, ContactUser.getContactById);

/**
 * Delete contact by it's id
 */
app.delete('/contacts/:id', ContactUser.deleteUser);

/**
 * Get empty contact details
 * Todo: This method is called 3 or more times (for phoneNumbers, emails, urls, dates - not sure where / why this is called) at detail view, need to verify and avoid these calls
 */
app.get('/contacttype', function (req, res, next) {
    res.responseData = [];
    next();
});

/**
 * Get contact details (phone numbers, emails, urls, dates) by contact id
 */
app.get('/contacttype/:id', ContactType.getContactsDetailsById);

/**
 * Add new contact detail (could be any one of - phoneNumbers, emails, urls, dates)
 */
app.post('/contacttype', ContactType.createOrUpdateContacts);

/**
 * Update contact detail by contact detail id
 */
app.put('/contacttype/:id', ContactType.createOrUpdateContacts);

/**
 * Delete contact detail by contact detail id
 */
app.delete('/contacttype/:id', ContactType.deleteContacts);

/**
 * Upload avatar for a contact
 */
app.post('/avatarupload', conectMultipart, avatarUploader.uploadAvatar, avatarUploader.moveAvatarToTempFolder);

/**
 * Export contact to a vCard
 */
app.post('/exportcontact', ContactUser.getContacts, transferContact.exportContact);

/**
 * Import contacts from vCard(s)
 */
app.post('/importcontact', conectMultipart, transferContact.importContact);

// ---------------------- APIs END ----------------------

/**
 * Success middleware
 * @param req express request object
 * @param res express response object
 * @param next express next function
 */
app.use(function (req, res, next) {
    var responseData = res.responseData;
    if (!responseData) {
        res.status(404);
        return next(new Error('Sorry, requested resource not found.'));
    }

    var responseJSON = {
        success: true,
        message: "Success",
        timestamp: new Date(),
        total: responseData.length,
        data: responseData
    };
    res.json(responseJSON);
});

/**
 * Error handling middleware
 * @param err Error
 * @param req express request object
 * @param res express response object
 * @param next express next function
 */
app.use(function (err, req, res, next) {
    if (res.statusCode === 200) {
        res.status(500);
    }

    /**
     * `Error.stackTraceLimit` is set to 10 by default which will allow only 10 frames in stack
     * when `Error.captureStackTrace` is called. To get all available frames in stack, setting `Error.stackTraceLimit` to
     * `Infinity` before calling `Error.captureStackTrace`.
     */
    var oldStackTraceLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = Infinity;
    Error.captureStackTrace(err);
    Error.stackTraceLimit = oldStackTraceLimit;

    logger.trace('------------------START------------------');
    logger.debug('path', req.path);
    logger.debug('method', req.method);
    logger.debug('query', req.query);
    logger.debug('body', req.body);
    logger.error('stack', err);
    logger.trace('------------------END------------------');

    res.json({
        success: false,
        message: res.errorMessage || 'Something went wrong, please try again later.', //A user friendly error message
        error: _.pick(err, errorProperties) //JSON.stringify() will not take deep true : it will not include all the elements of err object so this method is used
    });
});

/**
 * clear temp files once before starting server
 */
clearTempFiles.clearTempFiles();

/**
 * Delete temporary files after every 24hrs from now.
 */
setInterval(clearTempFiles.clearTempFiles, 86400000);

app.listen(app.port, function () {
    console.log('Server is now listening in ' + global.App.mode + ' mode on port ' + global.App.port + ' ...');
});

module.exports = app;