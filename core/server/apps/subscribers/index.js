var router     = require('./lib/router'),
    registerHelpers = require('./lib/helpers'),

    // Dirty requires
    config = require('../../config'),
    labs = require('../../utils/labs');

module.exports = {
    activate: function activate(ghost) {
<<<<<<< HEAD
        var errorMessages = [
            i18n.t('warnings.helpers.helperNotAvailable', {helperName: 'subscribe_form'}),
            i18n.t('warnings.helpers.apiMustBeEnabled', {helperName: 'subscribe_form', flagName: 'subscribers'}),
            i18n.t('warnings.helpers.seeLink', {url: 'https://help.ghost.org/hc/en-us/articles/224089787-Subscribers-Beta'})
        ];

        // Correct way to register a helper from an app
        ghost.helpers.register('subscribe_form', function labsEnabledHelper() {
            if (labs.isSet('subscribers') === true) {
                return subscribeFormHelper.apply(this, arguments);
            }

            errors.logError.apply(this, errorMessages);
            return new hbs.handlebars.SafeString('<script>console.error("' + errorMessages.join(' ') + '");</script>');
        });
=======
        registerHelpers(ghost);
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
    },

    setupRoutes: function setupRoutes(blogRouter) {
        blogRouter.use('/' + config.get('routeKeywords').subscribe + '/', function labsEnabledRouter(req, res, next) {
            if (labs.isSet('subscribers') === true) {
                return router.apply(this, arguments);
            }

            next();
        });
    }
};
