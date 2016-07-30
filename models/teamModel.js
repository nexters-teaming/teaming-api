/**
 * Created by YS on 2016-07-28.
 */
var credentials = require('../credentials');
var Promise = require("bluebird");
var mysqlSetting = require('./mysqlSetting');

var team_model = {
    getTeamList : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
            /*pool.getConnection(function (err, connection) {
                if (err) return rejected(500, "에러 발생." );
                var select = [];
                var sql = "SELECT prod_id, prod_name, prod_price, category_a, category_b, prod_desc, prod_img, size, GROUP_CONCAT(KeyColor.color_name) AS color_list " +
                    "FROM ShopProduct " +
                    "INNER JOIN KeyColor " +
                    "ON ShopProduct.prod_id = KeyColor.color_prod_id ";
                if (typeof  data.category_b == 'undefined') {
                    select.push(data.category_a);
                    sql += "WHERE category_a = ? ";
                } else {
                    select.push(data.category_a, data.category_b);
                    sql += "WHERE category_a = ? " +
                        "AND category_b = ? ";
                }

                sql += "GROUP BY prod_id LIMIT 20 ";
                connection.query(sql, select, function (err, rows) {
                    if (err) {
                        return rejected(500, "정보 수정에 실패했습니다." );
                    } else if(rows.affectedRows == 0) {
                        return rejected(204, "정보 수정에 실패했습니다. 원인: 유저가 없음" );
                    }
                    connection.release();
                    return resolved(rows);
                });
            });*/
        });
    },

    getProducts: function (data, callback) {
        // DB에 게시물정보 저장
        pool.getConnection(function (err, connection) {
            if (err) return callback({result: false, msg: "에러 발생. 원인: " + err});
            connection.beginTransaction(function (err) {
                if (err) throw err;
                var async = require('async');
                async.waterfall([
                    function (tran_callback) {
                        var select = [data.user_id, data.access_token, data.username, data.access_token];
                        connection.query("SELECT prod_id, prod_name, prod_price, category_a, category_b, prod_desc, prod_img, size, GROUP_CONCAT(KeyColor.color_name) AS color_list " +
                            "FROM ShopProduct " +
                            "INNER JOIN KeyColor " +
                            "ON ShopProduct.prod_id = KeyColor.color_prod_id " +
                            "GROUP BY prod_id " +
                            "LIMIT 20 ", select, function (err, rows) {

                            if (err) {
                                connection.rollback(function () {
                                    console.error('rollback error');
                                    return tran_callback({result: false, msg: '처리중 오류가 발생했습니다. 원인: ' + err});
                                });
                            }
                            connection.release();
                            connection.commit(function (err) {
                                if (err) {
                                    console.error(err);
                                    connection.rollback(function () {
                                        console.error('rollback error');
                                        throw err;
                                    });
                                    return tran_callback({result: false, msg: '처리중 오류가 발생했습니다. 원인: ' + err});
                                }
                                if (rows.length > 0)
                                    tran_callback(null, rows);
                                else
                                    tran_callback(204);
                            });
                        });
                    }
                ], function (err, result) {
                    if (err) return {result: false, msg: err};
                    return callback(true, "목록 가져옴", result);
                });
            });
        });
    },

    setProduct : function(data, callback) {
        pool.getConnection(function (err, connection) {
            if (err) return callback({result: false, msg: "에러 발생. 원인: " + err});
            connection.beginTransaction(function (err) {
                if (err) throw err;
                var async = require('async');
                async.waterfall([
                    function (tran_callback) {
                        var insert = [data.prod_name, data.prod_price, data.category_a, data.category_a, data.prod_desc, data.prod_img, data.size];
                        connection.query("INSERT ShopProduct SET " +
                            "prod_name = ?, " +
                            "prod_price = ?, " +
                            "category_a = ?, " +
                            "category_b = ?, " +
                            "prod_desc = ?, " +
                            "prod_img = ?, " +
                            "size = ? ", insert, function (err, rows) {

                            if (err) {
                                connection.rollback(function () {
                                    console.error('rollback error');
                                    return tran_callback({result: false, msg: '처리중 오류가 발생했습니다. 원인: ' + err});
                                });
                            }
                            connection.release();

                            tran_callback(null, rows.insertId);
                        });
                    }, function(prod_id, tran_callback) {
                        data.color_list.forEach(function (col, index, arr) {
                            var insert = [col, prod_id];
                            connection.query("INSERT KeyColor SET " +
                                "color_name = ?, " +
                                "color_prod_id = ? " , insert, function (err, rows) {

                                if (err) {
                                    connection.rollback(function () {
                                        console.error('rollback error');
                                        return tran_callback({result: false, msg: '처리중 오류가 발생했습니다. 원인: ' + err});
                                    });
                                }
                                connection.release();
                            });
                        });

                        connection.commit(function (err) {
                            if (err) {
                                console.error(err);
                                connection.rollback(function () {
                                    console.error('rollback error');
                                    throw err;
                                });
                                return tran_callback({result: false, msg: '처리중 오류가 발생했습니다. 원인: ' + err});
                            }
                            tran_callback(null);
                        });
                    }
                ], function (err) {
                    if (err) return {result: false, msg: err};
                    return callback(true, "삽입 성공");
                });
            });
        });
    },

    getProductsByCategory : function(data, callback) {
        pool.getConnection(function (err, connection) {
            if (err) return callback({ result: false, msg: "에러 발생. 원인: "+err });
            var select = [];
            var sql = "SELECT prod_id, prod_name, prod_price, category_a, category_b, prod_desc, prod_img, size, GROUP_CONCAT(KeyColor.color_name) AS color_list " +
                "FROM ShopProduct " +
                "INNER JOIN KeyColor " +
                "ON ShopProduct.prod_id = KeyColor.color_prod_id ";
            if (typeof  data.category_b == 'undefined') {
                select.push(data.category_a);
                sql += "WHERE category_a = ? ";
            } else {
                select.push(data.category_a, data.category_b);
                sql += "WHERE category_a = ? " +
                    "AND category_b = ? ";
            }

            sql += "GROUP BY prod_id LIMIT 20 ";
            connection.query(sql, select, function (err, rows) {
                if (err) {
                    return callback(false, "정보 수정에 실패했습니다. 원인: "+err);
                } else if(rows.affectedRows == 0) {
                    return callback(false, "정보 수정에 실패했습니다. 원인: 유저가 없음" );
                }
                connection.release();
                return callback(true, "데이터 가져옴.", rows);
            });
        });
    },

    deleteTeam : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    makeTeam : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(connection) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.teamname, data.description, data.access_token, data.start_date, data.end_date];
                        var sql = "INSERT INTO Team SET " +
                            "`teamname` = ?, " +
                            "`description` = ?, " +
                            "`manager` = (SELECT user_id FROM User WHERE access_token = ?), " +
                            "`start_date` = ?, " +
                            "`end_date` = ? ";
                        connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("팀 생성 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if(rows.affectedRows == 0) {
                                var error = new Error("팀 생성 실패");
                                error.status = 500;
                                return rejected(error);
                            }
                            return resolved({connection: connection, team_id: rows.insertId});
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [context.team_id];
                        var sql = "SELECT team_id, teamname, description, manager, start_date, end_date FROM Team " +
                            "WHERE team_id = ? ";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("가져오기 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if (rows.length == 0) {
                                var error = new Error("팀 정보 없음");
                                error.status = 500;
                                console.error("팀 정보 없음");
                                return rejected(error);
                            }
                            return resolved({connection: context.connection, team_info: rows[0]});
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.access_token, context.team_info.team_id];
                        var sql = "INSERT INTO TeamMember SET " +
                            "`team_user_id` = (SELECT user_id FROM User WHERE access_token = ?), " +
                            "`member_team_id` = ? ";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("팀 생성 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if(rows.affectedRows == 0) {
                                var error = new Error("팀 생성 실패");
                                error.status = 500;
                                return rejected(error);
                            }
                            return resolved({connection: context.connection, result: context.team_info});
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(data) {
                    return resolved(data);
                });
        });
    },
    getTeamInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(connection) {
                    var select = [data.team_id];
                    var sql = "SELECT team_id, teamname, description, manager, start_date, end_date FROM Team " +
                        "WHERE team_id = ? ";
                    connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("가져오기 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if (rows.length == 0) {
                            var error = new Error("팀 정보 없음");
                            error.status = 500;
                            console.error("팀 정보 없음");
                            return rejected(error);
                        }
                        connection.release();
                        return resolved(rows);
                    });
                });
        });
    },
    editTeamInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    getTeamCode : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    joinTeam : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
};

module.exports = team_model;