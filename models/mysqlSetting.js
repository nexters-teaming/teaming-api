/**
 * Created by YS on 2016-07-28.
 */
var credentials = require('../credentials');
var mysql = require('mysql');

var getPool = function() {
    var pool = mysql.createPool({
        connectTimeout  : 60 * 60 * 1000,
        timeout         : 60 * 60 * 1000,
        aquireTimeout   : 60 * 60 * 1000,
        host    : credentials.mysql.host,
        port : credentials.mysql.port,
        user : credentials.mysql.user,
        password : credentials.mysql.password,
        database: credentials.mysql.database,
        connectionLimit: 21,
        waitForConnections: false
    });

    return pool;
};

module.exports = getPool();