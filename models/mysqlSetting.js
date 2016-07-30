/**
 * Created by YS on 2016-07-28.
 */
var credentials = require('../credentials');
var Promise = require("bluebird");
var mysql = require('mysql');

var getPool = function() {
    return new Promise(function(resolved, rejected) {
        var pool = mysql.createPool({
            connectTimeout: 60 * 60 * 1000,
            timeout: 60 * 60 * 1000,
            aquireTimeout: 60 * 60 * 1000,
            host: credentials.mysql.host,
            port: credentials.mysql.port,
            user: credentials.mysql.user,
            password: credentials.mysql.password,
            database: credentials.mysql.database,
            connectionLimit: 21,
            waitForConnections: false
        });

        return resolved(pool);
    });
};

var getConnection = function(pool) {
    return new Promise(function(resolved, rejected) {
        pool.getConnection(function (err, connection) {
            if (err) {
                var error = new Error("에러 발생");
                error.status = 500;
                console.error(err);
                return rejected(error);
            }

            return resolved(connection);
        });
    });
};

var connBeginTransaction = function(connection) {
    return new Promise(function(resolved, rejected) {
        connection.beginTransaction(function (err) {
            if (err) {
                var error = new Error("에러 발생");
                error.status = 500;
                console.error(err);
                return rejected(error);
            }

            return resolved(connection);
        });
    });
};

var commitTransaction = function(connection, data) {
    return new Promise(function(resolved, rejected) {
        connection.commit(function (err) {
            if (err) {
                var error = new Error("에러 발생");
                error.status = 500;
                console.error(err);
                return rejected(error);
            }

            return resolved(data);
        });
    });
};

module.exports.getPool = getPool;
module.exports.getConnection = getConnection;
module.exports.connBeginTransaction = connBeginTransaction;
module.exports.commitTransaction = commitTransaction;