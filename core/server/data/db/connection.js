var knex = require('knex'),
    _ = require('lodash'),
    config = require('../../config'),
    knexInstance;

// @TODO:
// - if you require this file before config file was loaded,
// - then this file is cached and you have no chance to connect to the db anymore
// - bring dynamic into this file (db.connect())
function configure(dbConfig) {
<<<<<<< HEAD
    var client = dbConfig.client,
        pg;

    dbConfig.isPostgreSQL = function () {
        return client === 'pg' || client === 'postgres' || client === 'postgresql';
    };

    if (dbConfig.isPostgreSQL()) {
        try {
            pg = require('pg');
        } catch (e) {
            pg = require('pg.js');
        }

        // By default PostgreSQL returns data as strings along with an OID that identifies
        // its type.  We're setting the parser to convert OID 20 (int8) into a javascript
        // integer.
        pg.types.setTypeParser(20, function (val) {
            return val === null ? null : parseInt(val, 10);
        });

        // https://github.com/tgriesser/knex/issues/97
        // this sets the timezone to UTC only for the connection!
        dbConfig.pool = _.defaults({
            afterCreate: function (connection, callback) {
                connection.query('set timezone=\'UTC\'', function (err) {
                    callback(err, connection);
                });
            }
        }, dbConfig.pool);
    }
=======
    var client = dbConfig.client;
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9

    if (client === 'sqlite3') {
        dbConfig.useNullAsDefault = dbConfig.useNullAsDefault || false;
    }

    if (client === 'mysql') {
        dbConfig.connection.timezone = 'UTC';
        dbConfig.connection.charset = 'utf8mb4';
    }

    return dbConfig;
}

if (!knexInstance && config.get('database') && config.get('database').client) {
    knexInstance = knex(configure(config.get('database')));
}

module.exports = knexInstance;
