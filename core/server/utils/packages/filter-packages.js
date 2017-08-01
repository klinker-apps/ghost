var _ = require('lodash'),
    notAPackageRegex = /^\.|_messages|README.md/i,
    filterPackages;

/**
 * ### Filter Packages
<<<<<<< HEAD
 * Normalizes paths read by read-packages so that the apps and themes modules can use them.
 * Iterates over each package and return an array of objects which are simplified representations of the package
 * with 3 properties:
 * package name as `name`, the package.json as `package` and an active field set to true if this package is active
=======
 * Normalizes packages read by read-packages so that the apps and themes modules can use them.
 * Iterates over each package and return an array of objects which are simplified representations of the package
 * with 3 properties:
 * - `name`    - the package name
 * - `package` - contents of the package.json or false if there isn't one
 * - `active`  - set to true if this package is active
 * This data structure is used for listings of packages provided over the API and as such
 * deliberately combines multiple sources of information in order to be efficient.
 *
 * TODO: simplify the package.json representation to contain only fields we use
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
 *
 * @param   {object}            packages    as returned by read-packages
 * @param   {array/string}      active      as read from the settings object
 * @returns {Array}                         of objects with useful info about apps / themes
 */
filterPackages = function filterPackages(packages, active) {
    // turn active into an array (so themes and apps can be checked the same)
    if (!Array.isArray(active)) {
        active = [active];
    }

    return _.reduce(packages, function (result, pkg, key) {
        var item = {};
        if (!key.match(notAPackageRegex)) {
            item = {
                name: key,
<<<<<<< HEAD
                package: pkg['package.json'] || false
            };

            // At the moment we only support themes. This property is used in Ghost-Admin LTS
            // It is not used in Ghost-Admin 1.0, and therefore this can be removed.
            if (_.indexOf(active, key) !== -1) {
                item.active = true;
            }

=======
                package: pkg['package.json'] || false,
                active: _.indexOf(active, key) !== -1
            };

>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9
            result.push(item);
        }

        return result;
    }, []);
};

module.exports = filterPackages;
