'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function(db) {
    return db.createTable('movies', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true
        },
        title: 'string',
        releaseDate: 'datetime',
        director: 'string',
        producers: 'string',
        actors: 'string',
        language: 'string',
        subtitles: 'string',
        dubbed: 'string',
        runtime: 'string',
    }).catch(err => {
        if (err) throw err;
    });
};

exports.down = function(db) {
    return db.dropTable('movies', { ifExists: true });
};

exports._meta = {
    'version': 1
};
