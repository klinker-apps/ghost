var path                = require('path'),
    express             = require('express'),
    _                   = require('lodash'),
    ampRouter           = express.Router(),
    i18n                = require('../../../i18n'),

    // Dirty requires
    config              = require('../../../config'),
    errors              = require('../../../errors'),
    settingsCache       = require('../../../settings/cache'),
    templates           = require('../../../controllers/frontend/templates'),
    postLookup          = require('../../../controllers/frontend/post-lookup'),
    setResponseContext  = require('../../../controllers/frontend/context');

function controller(req, res, next) {
    var templateName = 'amp',
        defaultTemplate = path.resolve(__dirname, 'views', templateName + '.hbs'),
        data = req.body || {};

    if (res.error) {
        data.error = res.error;
    }

    setResponseContext(req, res, data);

    // we have to check the context. Our context must be ['post', 'amp'], otherwise we won't render the template
    if (_.includes(res.locals.context, 'post') && _.includes(res.locals.context, 'amp')) {
        return res.render(templates.pickTemplate(templateName, defaultTemplate), data);
    }

    return next();
}

function getPostData(req, res, next) {
    req.body = req.body || {};

    postLookup(res.locals.relativeUrl)
        .then(function (result) {
            if (result && result.post) {
                req.body.post = result.post;
            }

            next();
        })
        .catch(function (err) {
            next(err);
        });
}

function checkIfAMPIsEnabled(req, res, next) {
<<<<<<< HEAD
    var ampIsEnabled = config.theme.amp;
=======
    var ampIsEnabled = settingsCache.get('amp');
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9

    if (ampIsEnabled) {
        return next();
    }

    // CASE: we don't support amp pages for static pages
    if (req.body.post && req.body.post.page) {
<<<<<<< HEAD
        return errors.error404(req, res, next);
=======
        return next(new errors.NotFoundError({message: i18n.t('errors.errors.pageNotFound')}));
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
    }

    /**
     * CASE: amp is disabled, we serve 404
     *
     * Alternatively we could redirect to the original post, as the user can enable/disable AMP every time.
     *
     * If we would call `next()`, express jumps to the frontend controller (server/controllers/frontend/index.js fn single)
     * and tries to lookup the post (again) and checks whether the post url equals the requested url (post.url !== req.path).
     * This check would fail if the blog is setup on a subdirectory.
     */
<<<<<<< HEAD
    errors.error404(req, res, next);
=======
    return next(new errors.NotFoundError({message: i18n.t('errors.errors.pageNotFound')}));
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
}

// AMP frontend route
ampRouter.route('/')
    .get(
        getPostData,
        checkIfAMPIsEnabled,
        controller
    );

module.exports = ampRouter;
module.exports.controller = controller;
module.exports.getPostData = getPostData;
module.exports.checkIfAMPIsEnabled = checkIfAMPIsEnabled;
