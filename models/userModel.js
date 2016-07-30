/**
 * Created by YS on 2016-07-28.
 */
var credentials = require('../credentials');
var Promise = require("bluebird");
var mysqlSetting = require('./mysqlSetting');

var user_model = {
    joinUser : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(connection) {
                    var insert = [data.user_id, data.username, data.access_token, data.access_token];
                    var sql = "INSERT INTO User SET " +
                        "`user_id` = ?, " +
                        "`username` = ?, " +
                        "`access_token` = ? " +
                        "ON DUPLICATE KEY UPDATE " +
                        "`access_token` = ? ";
                    connection.query(sql, insert, function (err, rows) {
                        if (err) {
                            var error = new Error("로그인 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if(rows.affectedRows == 0) {
                            var error = new Error("로그인 실패");
                            error.status = 500;
                            return rejected(error);
                        }
                        connection.release();
                        return resolved();
                    });
                });
        });
    },

    deleteUser : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(connection) {
                    var select = [data.access_token];
                    var sql = "DELETE FROM User " +
                        "WHERE user_id = (SELECT user_id FROM User WHERE access_token = ?) ";
                    connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("로그아웃 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if (rows.affectedRows == 0) {
                            var error = new Error("잘못된 접근");
                            error.status = 204;
                            console.error(err);
                            return rejected(error);
                        }
                        connection.release();
                        return resolved();
                    });
                });
        });
    },
    getUser : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(connection) {
                    var select = [data.access_token];
                    var sql = "SELECT user_id, username FROM User " +
                        "WHERE access_token = ? ";
                    connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("가져오기 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if (rows.length == 0) {
                            var error = new Error("유저 정보 없음");
                            error.status = 500;
                            console.error("유저 정보 없음");
                            return rejected(error);
                        }
                        connection.release();
                        return resolved(rows);
                    });
                });
        });
    },
    editUser : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(connection) {
                    var select = [data.username, data.access_token];
                    var sql = "UPDATE User SET " +
                        "`username` = ? " +
                        "WHERE access_token = ? ";
                    connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("정보 변경 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if (rows.affectedRows == 0) {
                            var error = new Error("유저 정보 없음");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        }
                        connection.release();
                        return resolved(data);
                    });
                });
        });
    }
};

module.exports = user_model;