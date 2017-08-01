var _       = require('lodash'),
    express = require('express'),
    path    = require('path'),
    config  = require('../config'),
    themeUtils = require('../themes'),
    utils   = require('../utils');

function isBlackListedFileType(file) {
    var blackListedFileTypes = ['.hbs', '.md', '.json'],
        ext = path.extname(file);
    return _.includes(blackListedFileTypes, ext);
}

function isWhiteListedFile(file) {
    var whiteListedFiles = ['manifest.json'],
        base = path.basename(file);
    return _.includes(whiteListedFiles, base);
}

function forwardToExpressStatic(req, res, next) {
    if (!themeUtils.getActive()) {
        next();
    } else {
<<<<<<< HEAD
        express.static(
            path.join(config.paths.themePath, req.app.get('activeTheme')),
            {maxAge: process.env.NODE_ENV === 'development' ? 0 : utils.ONE_YEAR_MS}
=======
        var configMaxAge = config.get('caching:theme:maxAge');

        express.static(themeUtils.getActive().path,
            {maxAge: (configMaxAge || configMaxAge === 0) ? configMaxAge : utils.ONE_YEAR_MS}
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
        )(req, res, next);
    }
}

function staticTheme() {
    return function blackListStatic(req, res, next) {
        if (!isWhiteListedFile(req.path) && isBlackListedFileType(req.path)) {
            return next();
        }
        return forwardToExpressStatic(req, res, next);
    };
}

module.exports = staticTheme;
