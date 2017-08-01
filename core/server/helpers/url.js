// # URL helper
// Usage: `{{url}}`, `{{url absolute="true"}}`
//
// Returns the URL for the current object scope i.e. If inside a post scope will return post permalink
// `absolute` flag outputs absolute URL, else URL is relative

<<<<<<< HEAD
var hbs            = require('express-hbs'),
    getMetaDataUrl = require('../data/meta/url');

function url(options) {
    var absolute = options && options.hash.absolute,
        url = getMetaDataUrl(this, absolute);

    url = encodeURI(decodeURI(url));

    return new hbs.SafeString(url);
}
=======
var proxy = require('./proxy'),
    SafeString = proxy.SafeString,
    getMetaDataUrl = proxy.metaData.getMetaDataUrl;

module.exports = function url(options) {
    var absolute = options && options.hash.absolute,
        outputUrl = getMetaDataUrl(this, absolute);

    outputUrl = encodeURI(decodeURI(outputUrl));
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9

    return new SafeString(outputUrl);
};
