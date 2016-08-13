/**
 * Created by YS on 2016-07-28.
 */

var credentials = require('../credentials');
var Promise = require("bluebird");
var mysqlSetting = require('./mysqlSetting');

var section_model = {
    getSectionList : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.team_id];
                    var sql = "SELECT section_id, section_title, edit_date, GROUP_CONCAT(SectionMember.section_user_id) AS party " +
                        "FROM Section " +
                        "LEFT JOIN SectionMember " +
                        "ON Section.section_id = SectionMember.member_section_id " +
                        "WHERE Section.section_team_id = ? " +
                        "GROUP BY section_id " +
                        "ORDER BY Section.edit_date DESC " +
                        "LIMIT 20 ";
                    context.connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("섹션 목록 가져오기 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        }

                        rows.forEach(function(col) {
                            if (col.party == null) col.party = [];
                            else col.party = JSON.parse("["+col.party+"]");
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

    makeSection : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.team_id, data.section_title, data.end_date];
                        var sql = "INSERT INTO Section SET " +
                            "section_team_id = ?, " +
                            "section_title = ?, " +
                            "end_date = ?, " +
                            "edit_date = NOW() ";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("섹션 생성 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            context.section_id = rows.insertId;
                            return resolved(context);
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

                            context.result = rows;
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

    getSectionInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.section_id];
                        var sql = "SELECT section_id, section_title " +
                            "FROM Section " +
                            "WHERE section_id = ?";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("섹션 정보 가져오기 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }
                            context.section_info = rows[0];
                            return resolved(context);
                        });
                    });
                })
                .then(function(context) {
                    var select = [data.section_id];
                    var sql = "SELECT user_id, username " +
                        "FROM User " +
                        "WHERE user_id IN (SELECT section_user_id " +
                        "FROM SectionMember " +
                        "WHERE member_section_id = ?)";
                    context.connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("섹션 변경 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        }

                        context.connection.release();
                        context.section_info.party = rows;
                        return resolved(context.section_info);
                    });
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    getSectionMemberById : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.access_token, data.section_id];
                    var sql = "SELECT section_user_id, member_section_id " +
                        "FROM SectionMember " +
                        "WHERE section_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                        "AND member_section_id = ? ";

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

    checkSectionMemberById : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.access_token, data.section_id];
                    var sql = "SELECT section_user_id, member_section_id " +
                        "FROM SectionMember " +
                        "WHERE section_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                        "AND member_section_id = ? ";

                    context.connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("가져오기 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if (rows.length > 0) {
                            var error = new Error("이미 가입한 섹션");
                            error.status = 400;
                            console.error("이미 가입한 섹션");
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

    joinSection : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var insert = [data.access_token, data.section_id];
                    var sql = "INSERT INTO SectionMember SET " +
                        "section_user_id = (SELECT user_id FROM User WHERE access_token = ?), " +
                        "member_section_id = ?";
                    context.connection.query(sql, insert, function (err, rows) {
                        if (err) {
                            var error = new Error("섹션 가입하기 실패");
                            error.status = 500;
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

    exitSection : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var insert = [data.access_token, data.section_id];
                    var sql = "DELETE FROM SectionMember " +
                        "WHERE section_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                        "AND member_section_id = ?";
                    context.connection.query(sql, insert, function (err, rows) {
                        if (err) {
                            var error = new Error("섹션 탈퇴하기 실패");
                            error.status = 500;
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

    editSectionInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.team_id, data.section_title, data.end_date, data.section_id];
                        var sql = "UPDATE Section SET " +
                            "section_team_id = ?, " +
                            "section_title = ?, " +
                            "end_date = ?, " +
                            "edit_date = NOW() " +
                            "WHERE section_id = ?";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("섹션 변경 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if(rows.affectedRows == 0) {
                                var error = new Error("섹션 변경 실패");
                                error.status = 500;
                                return rejected(error);
                            }

                            context.section_id = data.section_id;
                            return resolved(context);
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

                            context.result = rows;
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

    deleteSection : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.section_id];
                    var sql = "DELETE FROM Section " +
                        "WHERE section_id = ? ";
                    context.connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("섹션 삭제하기 실패");
                            error.status = 500;
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

    getSectionParty : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.section_id];
                    var sql = "SELECT user_id, username " +
                        "FROM User " +
                        "WHERE user_id IN (SELECT section_user_id " +
                        "FROM SectionMember " +
                        "WHERE member_section_id = ?)";
                    context.connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("섹션 변경 실패");
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

module.exports = section_model;