/**
 * Created by YS on 2016-07-28.
 */
var credentials = require('../credentials');
var Promise = require("bluebird");
var mysqlSetting = require('./mysqlSetting');

var team_model = {
    getTeamList : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(connection) {
                    var select = [];
                    var sql = "SELECT team_id, teamname, description, GROUP_CONCAT(TeamMember.team_user_id) AS party, start_date, end_date " +
                        "FROM Team " +
                        "INNER JOIN TeamMember " +
                        "ON Team.team_id = TeamMember.member_team_id ";

                    sql += "GROUP BY team_id LIMIT 20 ";
                    connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("팀 목록 가져오기 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if(rows.affectedRows == 0) {
                            var error = new Error("팀 목록 가져오기 실패");
                            error.status = 500;
                            return rejected(error);
                        }
                        rows.forEach(function(col) {
                            col.party = JSON.parse("["+col.party+"]");
                        });
                        connection.release();
                        return resolved(rows);
                    });
                })
        });
    },

    deleteTeam : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(connection) {
                    var select = [data.team_id, data.access_token];
                    // TODO if manager is not required then change sql query
                    var sql = "DELETE FROM Team " +
                        "WHERE team_id = ? " +
                        "AND manager = (SELECT user_id FROM User WHERE access_token = ?) ";
                    connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("팀 삭제 실패");
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
                    var sql = "SELECT team_id, teamname, description, manager, GROUP_CONCAT(TeamMember.team_user_id) AS party, start_date, end_date " +
                        "FROM Team " +
                        "INNER JOIN TeamMember " +
                        "ON Team.team_id = TeamMember.member_team_id " +
                        "WHERE team_id = ? " +
                        "GROUP BY team_id ";

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
                        rows.forEach(function(col) {
                            col.party = JSON.parse("["+col.party+"]");
                        });
                        connection.release();
                        return resolved(rows);
                    });
                });
        });
    },

    editTeamInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(connection) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.teamname, data.description, data.access_token, data.start_date, data.end_date];
                        var sql = "UPDATE Team SET " +
                            "`teamname` = ?, " +
                            "`description` = ?, " +
                            "`start_date` = ?, " +
                            "`end_date` = ? ";
                        connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("팀 수정 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if(rows.affectedRows == 0) {
                                var error = new Error("팀 수정 실패");
                                error.status = 500;
                                return rejected(error);
                            }
                            return resolved({connection: connection});
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.team_id];
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
                            return resolved({connection: context.connection, result: rows[0]});
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(data) {
                    return resolved(data);
                });
        });
    },

    getTeamCode : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(connection) {
                    var select = [data.team_id];
                    var sql = "SELECT invite_code " +
                        "FROM Invite " +
                        "WHERE invite_team_id = ? ";

                    connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("가져오기 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if (rows.length == 0) {
                            var error = new Error("팀 정보 없음");
                            error.status = 9500;
                            console.error("팀 정보 없음");
                            return rejected(error);
                        }

                        connection.release();
                        return resolved(rows[0]);
                    });
                });
        });
    },

    makeTeamCode : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(connection) {
                    var insert = [data.team_id, data.invite_code, data.end_date, data.invite_code, data.end_date];
                    var sql = "INSERT INTO Invite SET " +
                        "invite_team_id = ?, " +
                        "invite_code = ?," +
                        "end_date = ? " +
                        "ON DUPLICATE KEY UPDATE " +
                        "invite_code = ?," +
                        "end_date = ? ";

                    connection.query(sql, insert, function (err, rows) {
                        if (err) {
                            var error = new Error("팀 코드 생성 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if(rows.affectedRows == 0) {
                            var error = new Error("팀 코드 생성 실패");
                            error.status = 500;
                            return rejected(error);
                        }

                        connection.release();
                        return resolved(data);
                    });
                });
        });
    },

    joinTeam : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    }
};

module.exports = team_model;