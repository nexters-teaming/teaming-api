/**
 * Created by YS on 2016-07-28.
 */

var credentials = require('../credentials');
var Promise = require("bluebird");
var mysqlSetting = require('./mysqlSetting');

var section_model = {
    getSectionList : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    makeSection : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(connection) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.team_id, data.section_title, data.end_date];
                        var sql = "INSERT INTO Section SET " +
                            "section_team_id = ?, " +
                            "section_title = ?, " +
                            "end_date = ?, " +
                            "edit_date = NOW() ";
                        connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("섹션 생성 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            return resolved({ connection: connection, section_id: rows.insertId });
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [context.section_id];
                        var sql = "SELECT section_id, section_title, edit_date " +
                            "FROM Section " +
                            "WHERE section_id = ?";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("정보 변경 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            return resolved({ connection: context.connection, result:rows });
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(data) {
                    return resolved(data);
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },
    getSectionInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    joinSection : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    editSectionInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    deleteSection : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    getSectionParty : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    }
};

module.exports = section_model;