var Promise = require('bluebird'),
    moment = require('moment'),
<<<<<<< HEAD:core/server/scheduling/post-scheduling/index.js
    utils = require(__dirname + '/../utils'),
    events = require(__dirname + '/../../events'),
    errors = require(__dirname + '/../../errors'),
    models = require(__dirname + '/../../models'),
    config = require(__dirname + '/../../config'),
    schedules = require(__dirname + '/../../api/schedules'),
=======
    localUtils = require(__dirname + '/../utils'),
    events = require(__dirname + '/../../../events'),
    errors = require(__dirname + '/../../../errors'),
    models = require(__dirname + '/../../../models'),
    schedules = require(__dirname + '/../../../api/schedules'),
    utils = require(__dirname + '/../../../utils'),
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9:core/server/adapters/scheduling/post-scheduling/index.js
    _private = {};

_private.normalize = function normalize(options) {
    var object = options.object,
        apiUrl = options.apiUrl,
        client = options.client;

    return {
        time: moment(object.get('published_at')).valueOf(),
<<<<<<< HEAD:core/server/scheduling/post-scheduling/index.js
        url: config.urlJoin(apiUrl, 'schedules', 'posts', object.get('id')) + '?client_id=' + client.get('slug') + '&client_secret=' + client.get('secret'),
=======
        url: utils.url.urlJoin(apiUrl, 'schedules', 'posts', object.get('id')) + '?client_id=' + client.get('slug') + '&client_secret=' + client.get('secret'),
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9:core/server/adapters/scheduling/post-scheduling/index.js
        extra: {
            httpMethod: 'PUT',
            oldTime: object.updated('published_at') ? moment(object.updated('published_at')).valueOf() : null
        }
    };
};

_private.loadClient = function loadClient() {
    return models.Client.findOne({slug: 'ghost-scheduler'}, {columns: ['slug', 'secret']});
};

_private.loadScheduledPosts = function () {
    return schedules.getScheduledPosts()
        .then(function (result) {
            return result.posts || [];
        });
};

exports.init = function init(options) {
    var config = options || {},
        apiUrl = config.apiUrl,
        adapter = null,
        client = null;

    if (!config) {
        return Promise.reject(new errors.IncorrectUsageError({message: 'post-scheduling: no config was provided'}));
    }

    if (!apiUrl) {
        return Promise.reject(new errors.IncorrectUsageError({message: 'post-scheduling: no apiUrl was provided'}));
    }

    return _private.loadClient()
        .then(function (_client) {
            client = _client;

            return localUtils.createAdapter(config);
        })
        .then(function (_adapter) {
            adapter = _adapter;

            return _private.loadScheduledPosts();
        })
        .then(function (scheduledPosts) {
            if (!scheduledPosts.length) {
                return;
            }

            scheduledPosts.forEach(function (object) {
                adapter.reschedule(_private.normalize({object: object, apiUrl: apiUrl, client: client}));
            });
        })
        .then(function () {
            adapter.run();
        })
        .then(function () {
            events.onMany([
                'post.scheduled',
                'page.scheduled'
            ], function (object) {
                adapter.schedule(_private.normalize({object: object, apiUrl: apiUrl, client: client}));
            });

            events.onMany([
                'post.rescheduled',
                'page.rescheduled'
            ], function (object) {
                adapter.reschedule(_private.normalize({object: object, apiUrl: apiUrl, client: client}));
            });

            events.onMany([
                'post.unscheduled',
                'page.unscheduled'
            ], function (object) {
                adapter.unschedule(_private.normalize({object: object, apiUrl: apiUrl, client: client}));
            });
        });
};
