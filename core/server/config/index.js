<<<<<<< HEAD
// # Config
// General entry point for all configuration data
var path          = require('path'),
    Promise       = require('bluebird'),
    chalk         = require('chalk'),
    fs            = require('fs'),
    url           = require('url'),
    _             = require('lodash'),

    validator     = require('validator'),
    generateAssetHash = require('../utils/asset-hash'),
    readThemes    = require('../utils/read-themes'),
    errors        = require('../errors'),
    configUrl     = require('./url'),
    packageInfo   = require('../../../package.json'),
    i18n          = require('../i18n'),
    appRoot       = path.resolve(__dirname, '../../../'),
    corePath      = path.resolve(appRoot, 'core/'),
    testingEnvs   = ['testing', 'testing-mysql', 'testing-pg'],
    defaultConfig = {};

function ConfigManager(config) {
=======
var Nconf = require('nconf'),
    path = require('path'),
    _debug = require('debug'),
    debug = _debug('ghost:config'),
    localUtils = require('./utils'),
    env = process.env.NODE_ENV || 'development',
    _private = {};

_private.loadNconf = function loadNconf(options) {
    debug('config start');
    options = options || {};

    var baseConfigPath = options.baseConfigPath || __dirname,
        customConfigPath = options.customConfigPath || process.cwd(),
        nconf = new Nconf.Provider();

>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
    /**
     * no channel can override the overrides
     */
    nconf.file('overrides', path.join(baseConfigPath, 'overrides.json'));

<<<<<<< HEAD
    return Promise.resolve(self._config);
};

ConfigManager.prototype.loadExtras = function () {
    var self = this;

    return self.loadThemes()
        .then(function () {
            return self._config;
        });
};

ConfigManager.prototype.loadThemes = function () {
    var self = this;

    return readThemes(self._config.paths.themePath)
        .then(function (result) {
            self._config.paths.availableThemes = result;
        });
};

/**
 * Allows you to set the config object.
 * @param {Object} config Only accepts an object at the moment.
 */
ConfigManager.prototype.set = function (config) {
    var localPath = '',
        defaultStorageAdapter = 'local-file-store',
        defaultSchedulingAdapter = 'SchedulingDefault',
        activeStorageAdapter,
        activeSchedulingAdapter,
        contentPath,
        schedulingPath,
        subdir,
        assetHash,
        timezone = 'Etc/UTC';

    // CASE: remember existing timezone
    if (this._config.theme && this._config.theme.timezone) {
        timezone = this._config.theme.timezone;
    }

    // CASE: override existing timezone
    if (config && config.theme && config.theme.timezone) {
        timezone = config.theme.timezone;
    }

    // Merge passed in config object onto our existing config object.
    // We're using merge here as it doesn't assign `undefined` properties
    // onto our cached config object.  This allows us to only update our
    // local copy with properties that have been explicitly set.
    _.merge(this._config, config);

    // Special case for the database config, which should be overridden not merged

    if (config && config.database) {
        this._config.database = config.database;
    }

    // Special case for the them.navigation JSON object, which should be overridden not merged
    if (config && config.theme && config.theme.navigation) {
        this._config.theme.navigation = config.theme.navigation;
    }

    // Protect against accessing a non-existant object.
    // This ensures there's always at least a paths object
    // because it's referenced in multiple places.
    this._config.paths = this._config.paths || {};

    // Parse local path location
    if (this._config.url) {
        localPath = url.parse(this._config.url).path;
        // Remove trailing slash
        if (localPath !== '/') {
            localPath = localPath.replace(/\/$/, '');
        }
    }

    subdir = localPath === '/' ? '' : localPath;

    if (!_.isEmpty(subdir)) {
        this._config.slugs.protected.push(subdir.split('/').pop());
    }

    // Allow contentPath to be over-written by passed in config object
    // Otherwise default to default content path location
    contentPath = this._config.paths.contentPath || path.resolve(appRoot, 'content');

    assetHash = this._config.assetHash || generateAssetHash();

    // read storage adapter from config file or attach default adapter
    this._config.storage = this._config.storage || {};
    activeStorageAdapter = this._config.storage.active || defaultStorageAdapter;

    // read scheduling adapter(s) from config file or attach default adapter
    this._config.scheduling = this._config.scheduling || {};
    activeSchedulingAdapter = this._config.scheduling.active || defaultSchedulingAdapter;

    // storage.active can be an object like {images: 'my-custom-image-storage-adapter', themes: 'local-file-storage'}
    // we ensure that passing a string to storage.active still works, but internal it's always an object
    if (_.isString(activeStorageAdapter)) {
        this._config.storage = _.merge(this._config.storage, {
            active: {
                images: activeStorageAdapter,
                themes: defaultStorageAdapter
            }
        });
    } else {
        // ensure there is a default image storage adapter
        if (!this._config.storage.active.images) {
            this._config.storage.active.images = defaultStorageAdapter;
        }

        // ensure there is a default theme storage adapter
        // @TODO: right now we only support theme uploads to local file storage
        // @TODO: we need to change reading themes from disk on bootstrap (see loadThemes)
        this._config.storage.active.themes = defaultStorageAdapter;
    }

    if (activeSchedulingAdapter === defaultSchedulingAdapter) {
        schedulingPath = path.join(corePath, '/server/scheduling/');
    } else {
        schedulingPath = path.join(contentPath, '/scheduling/');
    }

    this._config.times = _.merge({
        cannotScheduleAPostBeforeInMinutes: 2,
        publishAPostBySchedulerToleranceInMinutes: 2,
        getImageSizeTimeoutInMS: 5000
    }, this._config.times || {});

    _.merge(this._config, {
        ghostVersion: packageInfo.version,
        paths: {
            appRoot:          appRoot,
            subdir:           subdir,
            config:           this._config.paths.config || path.join(appRoot, 'config.js'),
            configExample:    path.join(appRoot, 'config.example.js'),
            corePath:         corePath,

            storagePath: {
                default: path.join(corePath, '/server/storage/'),
                custom:  path.join(contentPath, 'storage/')
            },

            contentPath:      contentPath,
            themePath:        path.resolve(contentPath, 'themes'),
            appPath:          path.resolve(contentPath, 'apps'),
            dataPath:         path.resolve(contentPath, 'data'),
            imagesPath:       path.resolve(contentPath, 'images'),
            internalAppPath:  path.join(corePath, '/server/apps/'),
            imagesRelPath:    'content/images',

            adminViews:       path.join(corePath, '/server/views/'),
            helperTemplates:  path.join(corePath, '/server/helpers/tpl/'),

            availableThemes:  this._config.paths.availableThemes || {},
            clientAssets:     path.join(corePath, '/built/assets/')
        },
        maintenance: {},
        scheduling: {
            active: activeSchedulingAdapter,
            path: schedulingPath
        },
        theme: {
            // normalise the URL by removing any trailing slash
            url: this._config.url ? this._config.url.replace(/\/$/, '') : '',
            timezone: timezone
        },
        routeKeywords: {
            tag: 'tag',
            author: 'author',
            page: 'page',
            preview: 'p',
            private: 'private',
            subscribe: 'subscribe',
            amp: 'amp'
        },
        internalApps: ['private-blogging', 'subscribers', 'amp'],
        slugs: {
            // Used by generateSlug to generate slugs for posts, tags, users, ..
            // reserved slugs are reserved but can be extended/removed by apps
            // protected slugs cannot be changed or removed
            reserved: ['admin', 'app', 'apps', 'archive', 'archives', 'categories',
            'category', 'dashboard', 'feed', 'ghost-admin', 'login', 'logout',
            'page', 'pages', 'post', 'posts', 'public', 'register', 'setup',
            'signin', 'signout', 'signup', 'user', 'users', 'wp-admin', 'wp-login'],
            protected: ['ghost', 'rss', 'amp']
        },
        // used in middleware/validation/upload.js
        // if we finish the data/importer logic, each type selects an importer
        uploads: {
            subscribers: {
                extensions: ['.csv'],
                contentTypes: ['text/csv', 'application/csv', 'application/octet-stream']
            },
            images: {
                extensions: ['.jpg', '.jpeg', '.gif', '.png', '.svg', '.svgz'],
                contentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']
            },
            db: {
                extensions: ['.json', '.zip'],
                contentTypes: ['application/octet-stream', 'application/json', 'application/zip', 'application/x-zip-compressed']
            },
            themes: {
                extensions: ['.zip'],
                contentTypes: ['application/zip', 'application/x-zip-compressed', 'application/octet-stream']
            }
        },
        deprecatedItems: ['updateCheck', 'mail.fromaddress'],
        // create a hash for cache busting assets
        assetHash: assetHash,
        preloadHeaders: this._config.preloadHeaders || false
    });

    // Also pass config object to
    // configUrl object to maintain
    // clean dependency tree
    configUrl.setConfig(this._config);

    // For now we're going to copy the current state of this._config
    // so it's directly accessible on the instance.
    // @TODO: perhaps not do this?  Put access of the config object behind
    // a function?
    _.extend(this, this._config);
};

/**
 * Allows you to read the config object.
 * @return {Object} The config object.
 */
ConfigManager.prototype.get = function () {
    return this._config;
};

ConfigManager.prototype.load = function (configFilePath) {
    var self = this;

    self._config.paths.config = process.env.GHOST_CONFIG || configFilePath || self._config.paths.config;

    /* Check for config file and copy from config.example.js
        if one doesn't exist. After that, start the server. */
    return new Promise(function (resolve, reject) {
        fs.stat(self._config.paths.config, function (err) {
            var exists = (err) ? false : true,
                pendingConfig;

            if (!exists) {
                pendingConfig = self.writeFile();
            }

            Promise.resolve(pendingConfig).then(function () {
                return self.validate();
            }).then(function (rawConfig) {
                return self.init(rawConfig);
            }).then(resolve)
            .catch(reject);
        });
    });
};

/* Check for config file and copy from config.example.js
    if one doesn't exist. After that, start the server. */
ConfigManager.prototype.writeFile = function () {
    var configPath = this._config.paths.config,
        configExamplePath = this._config.paths.configExample;

    return new Promise(function (resolve, reject) {
        fs.stat(configExamplePath, function checkTemplate(err) {
            var templateExists = (err) ? false : true,
                read,
                write,
                error;

            if (!templateExists) {
                error = new Error(i18n.t('errors.config.couldNotLocateConfigFile.error'));
                error.context = appRoot;
                error.help = i18n.t('errors.config.couldNotLocateConfigFile.help');

                return reject(error);
            }

            // Copy config.example.js => config.js
            read = fs.createReadStream(configExamplePath);
            read.on('error', function (err) {
                errors.logError(
                    new Error(i18n.t('errors.config.couldNotOpenForReading.error', {file: 'config.example.js'})),
                    appRoot,
                    i18n.t('errors.config.couldNotOpenForReading.help'));

                reject(err);
            });

            write = fs.createWriteStream(configPath);
            write.on('error', function (err) {
                errors.logError(
                    new Error(i18n.t('errors.config.couldNotOpenForWriting.error', {file: 'config.js'})),
                    appRoot,
                    i18n.t('errors.config.couldNotOpenForWriting.help'));

                reject(err);
            });

            write.on('finish', resolve);
=======
    /**
     * command line arguments
     */
    nconf.argv();
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9

    /**
     * env arguments
     */
    nconf.env({
        separator: '__'
    });

    nconf.file('custom-env', path.join(customConfigPath, 'config.' + env + '.json'));
    nconf.file('default-env', path.join(baseConfigPath, 'env', 'config.' + env + '.json'));
    nconf.file('defaults', path.join(baseConfigPath, 'defaults.json'));

    /**
     * transform all relative paths to absolute paths
     * transform sqlite filename path for Ghost-CLI
     */
    nconf.makePathsAbsolute = localUtils.makePathsAbsolute.bind(nconf);
    nconf.isPrivacyDisabled = localUtils.isPrivacyDisabled.bind(nconf);
    nconf.getContentPath = localUtils.getContentPath.bind(nconf);
    nconf.sanitizeDatabaseProperties = localUtils.sanitizeDatabaseProperties.bind(nconf);
    nconf.doesContentPathExist = localUtils.doesContentPathExist.bind(nconf);

    nconf.sanitizeDatabaseProperties();
    nconf.makePathsAbsolute(nconf.get('paths'), 'paths');
    nconf.makePathsAbsolute(nconf.get('database:connection'), 'database:connection');

    /**
     * Check if the URL in config has a protocol
     */
    nconf.checkUrlProtocol = localUtils.checkUrlProtocol.bind(nconf);
    nconf.checkUrlProtocol();

    /**
     * Ensure that the content path exists
     */
    nconf.doesContentPathExist();

    /**
     * values we have to set manual
     */
    nconf.set('env', env);

    // Wrap this in a check, because else nconf.get() is executed unnecessarily
    // To output this, use DEBUG=ghost:*,ghost-config
    if (_debug.enabled('ghost-config')) {
        debug(nconf.get());
    }

    debug('config end');
    return nconf;
};

<<<<<<< HEAD
ConfigManager.prototype.displayDeprecated = function (item, properties, address) {
    var self = this,
        property = properties.shift(),
        errorText,
        explanationText,
        helpText;

    address.push(property);

    if (item.hasOwnProperty(property)) {
        if (properties.length) {
            return self.displayDeprecated(item[property], properties, address);
        }
        errorText = i18n.t('errors.config.deprecatedProperty.error', {property: chalk.bold(address.join('.'))});
        explanationText =  i18n.t('errors.config.deprecatedProperty.explanation');
        helpText = i18n.t('errors.config.deprecatedProperty.help', {url: 'https://docs.ghost.org/v0.11.9/docs/configuring-ghost'});
        errors.logWarn(errorText, explanationText, helpText);
    }
};

if (testingEnvs.indexOf(process.env.NODE_ENV) > -1) {
    defaultConfig  = require('../../../config.example')[process.env.NODE_ENV];
}

module.exports = new ConfigManager(defaultConfig);
=======
module.exports = _private.loadNconf();
module.exports.loadNconf = _private.loadNconf;
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
