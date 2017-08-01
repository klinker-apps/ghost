var config = require('../../config'),
<<<<<<< HEAD
    generateAssetHash = require('../../utils/asset-hash');
=======
    blogIconUtils = require('../../utils/blog-icon'),
    utils = require('../../utils');

/**
 * Serve either uploaded favicon or default
 * @return {string}
 */
function getFaviconUrl() {
    return blogIconUtils.getIconUrl();
}
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9

function getAssetUrl(path, hasMinFile) {
    // CASE: favicon - this is special path with its own functionality
    if (path.match(/\/?favicon\.(ico|png)$/)) {
        // @TODO, resolve this - we should only be resolving subdirectory and extension.
        return getFaviconUrl();
    }

    // CASE: Build the output URL
    // Add subdirectory...
    var output = utils.url.urlJoin(utils.url.getSubdir(), '/');

    // Optionally add /assets/
    if (!path.match(/^public/) && !path.match(/^asset/)) {
        output = utils.url.urlJoin(output, 'assets/');
    }

    // replace ".foo" with ".min.foo" if configured
    if (hasMinFile && config.get('useMinFiles') !== false) {
        path = path.replace(/\.([^\.]*)$/, '.min.$1');
    }

    // Add the path for the requested asset
    output = utils.url.urlJoin(output, path);

<<<<<<< HEAD
    if (!path.match(/^favicon\.ico$/)) {
        if (!config.assetHash) {
            config.set({assetHash: generateAssetHash()});
        }

        output = output + '?v=' + config.assetHash;
=======
    // Ensure we have an assetHash
    // @TODO rework this!
    if (!config.get('assetHash')) {
        config.set('assetHash', utils.generateAssetHash());
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
    }

    // Finally add the asset hash to the output URL
    output += '?v=' + config.get('assetHash');

    return output;
}

module.exports = getAssetUrl;
