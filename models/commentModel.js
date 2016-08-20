/**
 * Created by YS on 2016-08-20.
 */
var credentials = require('../credentials');
var Promise = require("bluebird");
var mysqlSetting = require('./mysqlSetting');

var comment_model = {

    getCommentList : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.team_id, data.section_id, data.work_id];
                        var sql = "SELECT comment_id, comment_user_id, User.username, comment_team_id, comment_section_id, comment_work_id, comment_msg, comment_time " +
                            "FROM Comment INNER JOIN User ON Comment.comment_user_id = User.user_id " +
                            "WHERE comment_team_id = ? " +
                            "AND comment_section_id = ? " +
                            "AND comment_work_id = ? ";
                        context.connection.query(sql, select, function (err, rows) {

                            if (err) {
                                var error = new Error("댓글 가져오기 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if (rows.length == 0) {
                                var error = new Error("댓글 없음");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            context.result = rows;
                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(data){
                    return resolved(data);
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    makeComment : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.access_token, data.team_id, data.section_id, data.work_id, data.comment_msg];
                        var sql = "INSERT INTO Comment SET " +
                            "comment_user_id = (SELECT user_id FROM User WHERE access_token = ?), " +
                            "comment_team_id = ?, " +
                            "comment_section_id = ?, " +
                            "comment_work_id = ?, " +
                            "comment_msg = ?, " +
                            "comment_time = NOW() ";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("댓글 생성 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            context.result = rows.insertId;
                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(data) {
                    return resolved({comment_id: data});
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    editComment : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.comment_msg, data.comment_id, data.access_token];
                        var sql = "UPDATE Comment SET " +
                            "comment_msg = ?, " +
                            "comment_time = NOW() " +
                            "WHERE comment_id = ? " +
                            "AND comment_user_id = (SELECT user_id FROM User WHERE access_token = ?) ";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("댓글 변경 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            context.result = data.comment_id;
                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(data) {
                    return resolved({comment_id: data});
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    deleteComment : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var del = [data.access_token, data.comment_id];
                    var sql = "DELETE FROM Comment " +
                        "WHERE comment_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                        "AND comment_id = ?";
                    context.connection.query(sql, del, function (err, rows) {
                        if (err) {
                            var error = new Error("댓글 삭제");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        }

                        context.connection.release();
                        return resolved(rows);
                    });
                })
                .catch(function(err) {
                    return rejected(err)
                });
        });
    }
};

module.exports = comment_model;