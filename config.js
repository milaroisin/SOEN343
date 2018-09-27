var hidden = {};
try {
    hidden = require('./hidden');
} catch (ex) {}

var config = {
    db: {
        host: '127.0.0.1', // localhost
        user: 'dbuser',
        password: hidden.password || process.env.MYSQL_PASSWORD,
        database: 'anansi_db'
    }
};

module.exports = config;
