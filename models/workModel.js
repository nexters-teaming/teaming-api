/**
 * Created by YS on 2016-07-28.
 */
var credentials = require('../credentials');
var Promise = require("bluebird");
var mysqlSetting = require('./mysqlSetting');

var work_model = {

    getWorkList : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.section_id];
                        var sql = "SELECT work_id, work_progress, work_title, work_desc, start_date, end_date, edit_date " +
                            "FROM Work " +
                            "WHERE Work.work_section_id = ?";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("할일 가져오기 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if (rows.length == 0) {
                                var error = new Error("할일 없음");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            context.result = rows;
                            return resolved(context);
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        // Work 리스트별 Member 와 Userinfo 가져와서 바인딩
                        var work_list = [];
                        context.result.forEach(function (col, index) {
                            work_list.push(col.work_id);
                        });

                        var select = [work_list];
                        var sql = "SELECT user_id, username, WorkMember.member_work_id " +
                            "FROM User, WorkMember " +
                            "WHERE user_id IN (SELECT work_user_id " +
                            "FROM WorkMember " +
                            "WHERE member_work_id IN (?))";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("할일 가져오기 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            // Work 리스트와 가져온 Member 를 서로 ID 비교하여 삽입
                            context.result.forEach(function (col, index) {
                                var worker = [];
                                rows.forEach(function(row, row_index) {
                                    if (col.work_id == row.member_work_id) {
                                        worker.push(rows.splice(row_index,1)[0]);
                                    }
                                });
                                // 해당 Work 에 해당하는 Worker 리스트 삽입
                                context.result[index].worker = worker;
                            });

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

    makeWork : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.section_id, data.work_title, data.work_desc, data.start_date, data.end_date];
                        var sql = "INSERT INTO Work SET " +
                            "work_section_id = ?, " +
                            "work_title = ?, " +
                            "work_desc = ?, " +
                            "start_date = ?, " +
                            "end_date = ?, " +
                            "edit_date = NOW() ";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("할일 생성 실패");
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
                    return resolved({work_id: data});
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    getWorkInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.work_id];
                        var sql = "SELECT work_id, work_progress, work_title, work_desc, start_date, end_date, edit_date " +
                            "FROM Work " +
                            "WHERE Work.work_id = ? ";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("할일 가져오기 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            context.result = rows[0];
                            return resolved(context);
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.work_id];
                        var sql = "SELECT user_id, username " +
                            "FROM User " +
                            "WHERE user_id IN (SELECT work_user_id " +
                            "FROM WorkMember " +
                            "WHERE member_work_id = ?)";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("할일 가져오기 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            if (rows.length == 0) context.result.worker = [];
                            else context.result.worker = rows[0];
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
                })
        });
    },

    joinWork : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var insert = [data.access_token, data.work_id];
                    var sql = "INSERT INTO WorkMember SET " +
                        "work_user_id = (SELECT user_id FROM User WHERE access_token = ?), " +
                        "member_work_id = ?";
                    context.connection.query(sql, insert, function (err, rows) {
                        if (err) {
                            var error = new Error("할일 가입하기 실패");
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

    exitWork : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var insert = [data.access_token, data.work_id];
                    var sql = "DELETE FROM WorkMember " +
                        "WHERE work_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                        "AND member_work_id = ?";
                    context.connection.query(sql, insert, function (err, rows) {
                        if (err) {
                            var error = new Error("할일 탈퇴하기 실패");
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

    getWorkProgress : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.section_id];
                        var sql = "SELECT COUNT(work_progress) AS total " +
                            "FROM Work " +
                            "WHERE work_section_id = ?";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("가져오기 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if (rows.length == 0) {
                                var error = new Error("할일이 없습니다.");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            context.result = { total : rows[0].total };
                            return resolved(context);
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.section_id];
                        var sql = "SELECT COUNT(work_progress) AS todo_count " +
                            "FROM Work " +
                            "WHERE work_section_id = ? " +
                            "AND work_progress = 0";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("가져오기 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if (rows.length == 0) {
                                var error = new Error("할일이 없습니다.");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            context.result.todo_count = rows[0].todo_count;
                            return resolved(context);
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [data.section_id];
                        var sql = "SELECT COUNT(work_progress) AS doing_count " +
                            "FROM Work " +
                            "WHERE work_section_id = ? " +
                            "AND work_progress = 1";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("가져오기 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if (rows.length == 0) {
                                var error = new Error("할일이 없습니다.");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            context.result.doing_count = rows[0].doing_count;
                            return resolved(context);
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function (resolved, rejected) {
                        var select = [data.section_id];
                        var sql = "SELECT COUNT(work_progress) AS done_count " +
                            "FROM Work " +
                            "WHERE work_section_id = ? " +
                            "AND work_progress = 2";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("가져오기 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if (rows.length == 0) {
                                var error = new Error("할일이 없습니다.");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            context.result.done_count = rows[0].done_count;
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

    getWorkMemberById : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.access_token, data.work_id];
                    var sql = "SELECT work_user_id, member_work_id " +
                        "FROM WorkMember " +
                        "WHERE work_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                        "AND member_work_id = ? ";

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

    checkWorkMemberById : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.access_token, data.work_id];
                    var sql = "SELECT work_user_id, member_work_id " +
                        "FROM WorkMember " +
                        "WHERE work_user_id = (SELECT user_id FROM User WHERE access_token = ?) " +
                        "AND member_work_id = ? ";

                    context.connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("가져오기 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if (rows.length > 0) {
                            var error = new Error("이미 가입한 할일");
                            error.status = 400;
                            console.error("이미 가입한 할일");
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

    editWorkInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [data.section_id, data.work_title, data.work_desc, data.start_date, data.end_date, data.work_progress, data.work_id];
                        var sql = "UPDATE Work SET " +
                            "work_section_id = ?, " +
                            "work_title = ?, " +
                            "work_desc = ?, " +
                            "start_date = ?, " +
                            "end_date = ?, " +
                            "work_progress = ?, " +
                            "edit_date = NOW() " +
                            "WHERE work_id = ?";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("할일 생성 실패");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            context.result = data.work_id;
                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(data) {
                    return resolved({work_id: data});
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    deleteWork : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },

    getWorker : function(data) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var select = [data.work_id];
                    var sql = "SELECT user_id, username " +
                        "FROM User " +
                        "WHERE user_id IN (SELECT work_user_id " +
                        "FROM WorkMember " +
                        "WHERE member_work_id = ?)";
                    context.connection.query(sql, select, function (err, rows) {
                        if (err) {
                            var error = new Error("워커 가져오기 실패");
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

module.exports = work_model;