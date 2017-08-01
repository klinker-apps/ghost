// # Bootup
// This file needs serious love & refactoring

/**
 * make sure overrides get's called first!
 * - keeping the overrides require here works for installing Ghost as npm!
 *
 * the call order is the following:
 * - root index requires core module
 * - core index requires server
 * - overrides is the first package to load
 */
require('./overrides');

// Module dependencies
<<<<<<< HEAD
var express = require('express'),
    _ = require('lodash'),
    uuid = require('uuid'),
=======
var debug = require('debug')('ghost:boot:init'),
// Config should be first require, as it triggers the initial load of the config files
    config = require('./config'),
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
    Promise = require('bluebird'),
    logging = require('./logging'),
    i18n = require('./i18n'),
    models = require('./models'),
    permissions = require('./permissions'),
    apps = require('./apps'),
    auth = require('./auth'),
    dbHealth = require('./data/db/health'),
    xmlrpc = require('./data/xml/xmlrpc'),
    slack = require('./data/slack'),
    GhostServer = require('./ghost-server'),
<<<<<<< HEAD
    scheduling = require('./scheduling'),
    dbHash;

function initDbHashAndFirstRun() {
    return api.settings.read({key: 'dbHash', context: {internal: true}}).then(function (response) {
        var hash = response.settings[0].value,
            initHash;

        dbHash = hash;

        if (dbHash === null) {
            initHash = uuid.v4();
            return api.settings.edit({settings: [{key: 'dbHash', value: initHash}]}, {context: {internal: true}})
                .then(function (response) {
                    dbHash = response.settings[0].value;
                    return dbHash;
                    // Use `then` here to do 'first run' actions
                });
        }

        return dbHash;
    });
}

// ## Initialise Ghost
// Sets up the express server instances, runs init on a bunch of stuff, configures views, helpers, routes and more
// Finally it returns an instance of GhostServer
function init(options) {
    options = options || {};

    var ghostServer = null, settingsMigrations, currentDatabaseVersion;
=======
    scheduling = require('./adapters/scheduling'),
    settings = require('./settings'),
    settingsCache = require('./settings/cache'),
    themes = require('./themes'),
    utils = require('./utils');

// ## Initialise Ghost
function init() {
    debug('Init Start...');
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9

    var ghostServer, parentApp;

    // Initialize Internationalization
    i18n.init();
    debug('I18n done');
    models.init();
    debug('models done');

<<<<<<< HEAD
    // Load our config.js file from the local file system.
    return config.load(options.config).then(function () {
        return config.checkDeprecated();
    }).then(function () {
        // Load models, no need to wait
        models.init();

        /**
         * fresh install:
         * - getDatabaseVersion will throw an error and we will create all tables (including populating settings)
         * - this will run in one single transaction to avoid having problems with non existent settings
         * - see https://github.com/TryGhost/Ghost/issues/7345
         */
        return versioning.getDatabaseVersion()
            .then(function () {
                /**
                 * No fresh install:
                 * - every time Ghost starts,  we populate the default settings before we run migrations
                 * - important, because it can happen that a new added default property won't be existent
                 */
                return models.Settings.populateDefaults();
            })
            .catch(function (err) {
                if (err instanceof errors.DatabaseNotPopulated) {
                    return migrations.populate();
                }

                return Promise.reject(err);
            });
    }).then(function () {
        /**
         * a little bit of duplicated code, but:
         * - ensure now we load the current database version and remember
         */
        return versioning.getDatabaseVersion()
            .then(function (_currentDatabaseVersion) {
                currentDatabaseVersion = _currentDatabaseVersion;
            });
    }).then(function () {
        // ATTENTION:
        // this piece of code was only invented for https://github.com/TryGhost/Ghost/issues/7351#issuecomment-250414759
        if (currentDatabaseVersion !== '008') {
            return;
        }

        if (config.database.client !== 'sqlite3') {
            return;
        }

        return models.Settings.findOne({key: 'migrations'}, options)
            .then(function fetchedMigrationsSettings(result) {
                try {
                    settingsMigrations = JSON.parse(result.attributes.value) || {};
                } catch (err) {
                    return;
                }

                if (settingsMigrations.hasOwnProperty('006/01')) {
                    return;
                }

                // force them to re-run 008, because we have fixed the date fixture migration
                currentDatabaseVersion = '007';
                return versioning.setDatabaseVersion(null, '007');
            });
    }).then(function () {
        var response = migrations.update.isDatabaseOutOfDate({
            fromVersion: currentDatabaseVersion,
            toVersion: versioning.getNewestDatabaseVersion(),
            forceMigration: process.env.FORCE_MIGRATION
        }), maintenanceState;

        if (response.migrate === true) {
            maintenanceState = config.maintenance.enabled || false;
            config.maintenance.enabled = true;

            migrations.update.execute({
                fromVersion: currentDatabaseVersion,
                toVersion: versioning.getNewestDatabaseVersion(),
                forceMigration: process.env.FORCE_MIGRATION
            }).then(function () {
                config.maintenance.enabled = maintenanceState;
            }).catch(function (err) {
                if (!err) {
                    return;
                }

                errors.logErrorAndExit(err, err.context, err.help);
            });
        } else if (response.error) {
            return Promise.reject(response.error);
        }
=======
    return dbHealth.check().then(function () {
        debug('DB health check done');
        // Populate any missing default settings
        // Refresh the API settings cache
        return settings.init();
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
    }).then(function () {
        debug('Update settings cache done');
        // Initialize the permissions actions and objects
        return permissions.init();
    }).then(function () {
<<<<<<< HEAD
        // Initialize the settings cache now,
        // This is an optimisation, so that further reads from settings are fast.
        // We do also do this after boot
        return api.init();
    }).then(function () {
=======
        debug('Permissions done');
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
        return Promise.join(
            themes.init(),
            // Initialize apps
            apps.init(),
            // Initialize xmrpc ping
            xmlrpc.listen(),
            // Initialize slack ping
            slack.listen()
        );
    }).then(function () {
        debug('Apps, XMLRPC, Slack done');

<<<<<<< HEAD
        // ## Middleware and Routing
        middleware(parentApp);

=======
        // Setup our collection of express apps
        parentApp = require('./app')();

        debug('Express Apps done');
    }).then(function () {
        return auth.validation.validate({
            authType: config.get('auth:type')
        });
    }).then(function () {
        // runs asynchronous
        auth.init({
            authType: config.get('auth:type'),
            ghostAuthUrl: config.get('auth:url'),
            redirectUri: utils.url.urlFor('admin', true),
            clientUri: utils.url.urlFor('home', true),
            clientName: settingsCache.get('title'),
            clientDescription: settingsCache.get('description')
        }).then(function (response) {
            parentApp.use(response.auth);
        }).catch(function onAuthError(err) {
            logging.error(err);
        });
    }).then(function () {
        debug('Auth done');
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
        return new GhostServer(parentApp);
    }).then(function (_ghostServer) {
        ghostServer = _ghostServer;

        // scheduling can trigger api requests, that's why we initialize the module after the ghost server creation
        // scheduling module can create x schedulers with different adapters
        debug('Server done');
        return scheduling.init({
            schedulerUrl: config.get('scheduling').schedulerUrl,
            active: config.get('scheduling').active,
            apiUrl: utils.url.urlFor('api', true),
            internalPath: config.get('paths').internalSchedulingPath,
            contentPath: config.getContentPath('scheduling')
        });
    }).then(function () {
        debug('Scheduling done');
        debug('...Init End');
        return ghostServer;
    });
}

module.exports = init;
