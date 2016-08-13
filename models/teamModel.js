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
                .then(function(context) {
                    var select = [];
                    var sql = "SELECT team_id, teamname, description, GROUP_CONCAT(TeamMember.team_user_id) AS party, start_date, end_date " +
                        "FROM Team " +
                        "INNER JOIN TeamMember " +
                        "ON Team.team_id = TeamMember.member_team_id ";

                    sql += "GROUP BY team_id LIMIT 20 ";
                    context.connection.query(sql, select, function (err, rows) {
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
                        context.connection.release();
                        return resolved(rows);
                    });
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    deleteTeam : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.team_id, data.access_token];
                    // TODO if manager is not required then change sql query
                    var sql = "DELETE FROM Team " +
                        "WHERE team_id = ? " +
                        "AND manager = (SELECT user_id FROM User WHERE access_token = ?) ";
                    context.connection.query(sql, select, function (err, rows) {
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
                        context.connection.release();
                        return resolved();
                    });
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    makeTeam : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.teamname, data.description, data.access_token, data.start_date, data.end_date];
                        var sql = "INSERT INTO Team SET " +
                            "`teamname` = ?, " +
                            "`description` = ?, " +
                            "`manager` = (SELECT user_id FROM User WHERE access_token = ?), " +
                            "`start_date` = ?, " +
                            "`end_date` = ? ";
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
                            context.team_id = rows.insertId;
                            return resolved(context);
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
                            context.team_info = rows[0];
                            return resolved(context);
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
                            context.result = context.team_info;
                            return resolved(context);
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

    getTeamInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.team_id];
                    var sql = "SELECT team_id, teamname, description, manager, GROUP_CONCAT(TeamMember.team_user_id) AS party, start_date, end_date " +
                        "FROM Team " +
                        "INNER JOIN TeamMember " +
                        "ON Team.team_id = TeamMember.member_team_id " +
                        "WHERE team_id = ? " +
                        "GROUP BY team_id ";

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
                        rows.forEach(function(col) {
                            col.party = JSON.parse("["+col.party+"]");
                        });
                        context.connection.release();
                        return resolved(rows);
                    });
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    editTeamInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.teamname, data.description, data.start_date, data.end_date];
                        var sql = "UPDATE Team SET " +
                            "`teamname` = ?, " +
                            "`description` = ?, " +
                            "`start_date` = ?, " +
                            "`end_date` = ? ";
                        context.connection.query(sql, insert, function (err, rows) {
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
                            return resolved(context);
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
                            context.result = rows[0]
                            return resolved(context);
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

    // deprecated
    getTeamCode : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.team_id];
                    var sql = "SELECT invite_code " +
                        "FROM Invite " +
                        "WHERE invite_team_id = ? ";

                    context.connection.query(sql, select, function (err, rows) {
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

                        context.connection.release();
                        return resolved(rows[0]);
                    });
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    // deprecated
    inviteTeam : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.user_id, data.team_id];
                        var sql = "SELECT team_user_id FROM TeamMember " +
                            "WHERE team_user_id = ? " +
                            "AND member_team_id = ?";

                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("팀원 검색 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            if (rows.length == 0) {
                                return resolved(context);
                            } else {
                                var error = new Error("이미 가입한 팀원");
                                error.status = 400;
                                console.error(err);
                                return rejected(error);
                            }
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.access_token, data.user_id, data.team_id];
                        var sql = "INSERT INTO Invite SET " +
                            "invite_sender_id = (SELECT user_id FROM User WHERE access_token = ?)," +
                            "invite_user_id = ?, " +
                            "invite_team_id = ?, " +
                            "invite_time = NOW() " +
                            "ON DUPLICATE KEY UPDATE " +
                            "invite_time = NOW()";

                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("팀 초대 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if(rows.affectedRows == 0) {
                                var error = new Error("팀 초대 실패");
                                error.status = 500;
                                return rejected(error);
                            }

                            context.result = data;
                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(result) {
                    return resolved(result);
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    joinTeam : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.access_token, data.team_id];
                        var sql = "SELECT team_user_id FROM TeamMember " +
                            "WHERE team_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                            "AND member_team_id = ?";

                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("팀원 검색 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            if (rows.length == 0) {
                                return resolved(context);
                            } else {
                                var error = new Error("이미 가입한 팀원");
                                error.status = 400;
                                console.error(err);
                                return rejected(error);
                            }
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.access_token, data.team_id];
                        var sql = "SELECT ask_user_id FROM JoinAsk " +
                            "WHERE ask_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                            "AND ask_team_id = ?";

                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("신청 검색 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            if (rows.length == 0) {
                                return resolved(context);
                            } else {
                                var error = new Error("이미 신청한 팀");
                                error.status = 400;
                                console.error(err);
                                return rejected(error);
                            }
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.access_token, data.team_id];
                        var sql = "INSERT INTO JoinAsk SET " +
                            "ask_user_id = (SELECT user_id FROM User WHERE access_token = ?), " +
                            "ask_team_id = ?, " +
                            "ask_time = NOW() " +
                            "ON DUPLICATE KEY UPDATE " +
                            "ask_time = NOW()";

                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("팀 신청 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if(rows.affectedRows == 0) {
                                var error = new Error("팀 신청 실패");
                                error.status = 500;
                                return rejected(error);
                            }

                            context.result = data;
                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(result) {
                    return resolved(result);
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    getJoinAsk : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.team_id];
                    var sql = "SELECT ask_user_id, User.username, ask_time " +
                        "FROM JoinAsk INNER JOIN User " +
                        "ON ask_user_id = User.user_id " +
                        "WHERE ask_team_id = ? ";

                    context.connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("가져오기 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if (rows.length == 0) {
                            var error = new Error("팀 신청 없음");
                            error.status = 500;
                            console.error("팀 신청 없음");
                            return rejected(error);
                        }
                        context.connection.release();
                        return resolved(rows);
                    });
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    approveTeam : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.user_id, data.team_id];
                        var sql = "SELECT team_user_id " +
                            "FROM TeamMember " +
                            "WHERE team_user_id = ? " +
                            "AND member_team_id = ?";

                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("팀원 가져오기 실패");
                                error.status = 400;
                                console.error(err);
                                return rejected(error);
                            }

                            if (rows.length == 0) {
                                return resolved(context);
                            } else {
                                var error = new Error("이미 가입중인 팀 입니다.");
                                error.status = 400;
                                console.error(err);
                                return rejected(error);
                            }
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.user_id, data.team_id];
                        var sql = "INSERT INTO TeamMember SET " +
                            "team_user_id = ?, " +
                            "member_team_id = ? ";

                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("팀 가입 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            return resolved(context);
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.user_id, data.access_token, data.team_id];
                        var sql = "INSERT INTO JoinRecord SET " +
                            "join_user_id = ?, " +
                            "join_approver_id = (SELECT user_id FROM User WHERE access_token = ?), " +
                            "join_team_id = ?, " +
                            "approve_time = NOW() ";

                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("가입 기록 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            return resolved(context);
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.user_id, data.team_id];
                        var sql = "DELETE FROM JoinAsk " +
                            "WHERE ask_user_id = ? " +
                            "AND ask_team_id = ? ";

                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("신청 삭제실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function() {
                    return resolved();
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    leaveTeam : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.access_token, data.team_id];
                        var sql = "SELECT team_user_id " +
                            "FROM TeamMember " +
                            "WHERE team_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                            "AND member_team_id = ?";

                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("팀원 가져오기 실패");
                                error.status = 400;
                                console.error(err);
                                return rejected(error);
                            }

                            if (rows.length == 0) {
                                var error = new Error("가입하지 않은 팀 입니다.");
                                error.status = 400;
                                console.error(err);
                                return rejected(error);
                            } else {
                                return resolved(context);
                            }
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.access_token, data.team_id];
                        var sql = "DELETE FROM TeamMember " +
                            "WHERE team_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                            "AND member_team_id = ? ";

                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("팀 가입 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function() {
                    return resolved();
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    getApproveRecord : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.team_id];
                    var sql = "SELECT join_user_id, Joinuser.username AS joinuser_name, join_approver_id, Approver.username AS approver_name, join_team_id, approve_time " +
                        "FROM teaming.JoinRecord, teaming.User Joinuser, teaming.User Approver " +
                        "WHERE Joinuser.user_id = JoinRecord.join_user_id " +
                        "AND Approver.user_id = JoinRecord.join_approver_id";

                    context.connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("가져오기 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if (rows.length == 0) {
                            var error = new Error("승낙 기록 없음");
                            error.status = 500;
                            console.error("승낙 기록 없음");
                            return rejected(error);
                        }
                        context.connection.release();
                        return resolved(rows);
                    });
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    getTeamMemberById : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.access_token, data.team_id];
                    var sql = "SELECT team_user_id, member_team_id " +
                        "FROM TeamMember " +
                        "WHERE team_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                        "AND member_team_id = ? ";

                    context.connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("가져오기 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if (rows.length == 0) {
                            var error = new Error("해당 멤버 아님");
                            error.status = 500;
                            console.error("해당 멤버 아님");
                            return rejected(error);
                        }

                        context.connection.release();
                        return resolved();
                    });
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    checkTeamMemberById : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.access_token, data.team_id];
                    var sql = "SELECT team_user_id, member_team_id " +
                        "FROM TeamMember " +
                        "WHERE team_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                        "AND member_team_id = ? ";

                    context.connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("가져오기 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if (rows.length > 0) {
                            var error = new Error("이미 가입한 팀");
                            error.status = 400;
                            console.error("이미 가입한 팀");
                            return rejected(error);
                        }

                        context.connection.release();
                        return resolved();
                    });
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    }
};

module.exports = team_model;