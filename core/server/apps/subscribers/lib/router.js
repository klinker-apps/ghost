var path                = require('path'),
    express             = require('express'),
    _                   = require('lodash'),
    subscribeRouter     = express.Router(),
    bodyParser          = require('body-parser'),

    // Dirty requires
    api                 = require('../../../api'),
    errors              = require('../../../errors'),
    validator           = require('../../../data/validation').validator,
    templates           = require('../../../controllers/frontend/templates'),
    postlookup          = require('../../../controllers/frontend/post-lookup'),
    setResponseContext  = require('../../../controllers/frontend/context');

function controller(req, res) {
    var templateName = 'subscribe',
        defaultTemplate = path.resolve(__dirname, 'views', templateName + '.hbs'),
        data = req.body;

    setResponseContext(req, res);

    return res.render(templates.pickTemplate(templateName, defaultTemplate), data);
}

/**
 * Takes care of sanitizing the email input.
 * XSS prevention.
 * For success cases, we don't have to worry, because then the input contained a valid email address.
 */
function errorHandler(error, req, res, next) {
    /*jshint unused:false */

    req.body.email = '';

    if (error.statusCode !== 404) {
        res.locals.error = error;
        return controller(req, res);
    }

    next(error);
}

function honeyPot(req, res, next) {
    if (!req.body.hasOwnProperty('confirm') || req.body.confirm !== '') {
        return next(new Error('Oops, something went wrong!'));
    }

    // we don't need this anymore
    delete req.body.confirm;
    next();
}

<<<<<<< HEAD
function validateUrl(url) {
=======
function santizeUrl(url) {
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
    return validator.isEmptyOrURL(url || '') ? url : '';
}

function handleSource(req, res, next) {
<<<<<<< HEAD
    req.body.subscribed_url = validateUrl(req.body.location);
    req.body.subscribed_referrer = validateUrl(req.body.referrer);
=======
    req.body.subscribed_url = santizeUrl(req.body.location);
    req.body.subscribed_referrer = santizeUrl(req.body.referrer);
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
    delete req.body.location;
    delete req.body.referrer;

    postlookup(req.body.subscribed_url)
        .then(function (result) {
            if (result && result.post) {
                req.body.post_id = result.post.id;
            }

            next();
        })
        .catch(function (err) {
            if (err instanceof errors.NotFoundError) {
                return next();
            }

            next(err);
        });
}

function storeSubscriber(req, res, next) {
    req.body.status = 'subscribed';

    if (_.isEmpty(req.body.email)) {
<<<<<<< HEAD
        return next(new errors.ValidationError('Email cannot be blank.'));
    } else if (!validator.isEmail(req.body.email)) {
        return next(new errors.ValidationError('Invalid email.'));
=======
        return next(new errors.ValidationError({message: 'Email cannot be blank.'}));
    } else if (!validator.isEmail(req.body.email)) {
        return next(new errors.ValidationError({message: 'Invalid email.'}));
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
    }

    return api.subscribers.add({subscribers: [req.body]}, {context: {external: true}})
        .then(function () {
            res.locals.success = true;
            next();
        })
        .catch(function () {
            // we do not expose any information
            res.locals.success = true;
            next();
        });
}

// subscribe frontend route
subscribeRouter.route('/')
    .get(
        controller
    )
    .post(
        bodyParser.urlencoded({extended: true}),
        honeyPot,
        handleSource,
        storeSubscriber,
        controller
    );

// configure an error handler just for subscribe problems
subscribeRouter.use(errorHandler);

module.exports = subscribeRouter;
module.exports.controller = controller;
module.exports.storeSubscriber = storeSubscriber;
