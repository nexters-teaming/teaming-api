/**
 * Created by YS on 2016-07-28.
 */
var teamModel = require('../models/teamModel');
var Promise = require("bluebird");
var errorHandler = require('./errorHandler');

var getTeamList = function(req, res, next) {
    var data = {
        access_token : req.header('access-token')
    };

    teamModel.getTeamList(data)
        .then(function (data) {
            res.statusCode = 200;
            res.json({
                msg : '팀 목록',
                // TODO data : data
                data : [
                    {
                        team_id: "10",
                        teamname: "nexters",
                        description: "개발자, 디자이너 모임",
                        party : [10, 11, 12, 13],
                        team_progress : 10,
                        section_progress : {
                            "개발자" : 20,
                            "디자이너" : 20
                        },
                        start_date : "2016-07-01 14:04:00",
                        end_date : "2016-07-21 14:04:00"
                    }, {
                        team_id: "11",
                        teamname: "nexters",
                        description: "개발자, 디자이너 모임",
                        party : [10, 11, 12, 13],
                        team_progress : 10,
                        section_progress : {
                            "개발자" : 20,
                            "디자이너" : 20
                        },
                        start_date : "2016-07-01 14:04:00",
                        end_date : "2016-07-21 14:04:00"
                    }
                ]
                // END TODO
            });
        })
        .catch(errorHandler);
};

var makeTeam = function(req, res, next) {
    var data = {
        access_token : req.header('access-token'),
        teamname : req.body.teamname,
        description : req.body.description,
        manager : req.body.manager,
        section : req.body.section,
        start_date : req.body.start_date,
        end_date : req.body.end_date
    };

    teamModel.makeTeam(data)
        .then(function (data) {
            res.statusCode = 200;
            res.json({
                msg : '팀 정보 저장 완료',
                // TODO data : data
                data : {
                    team_id : "10",
                    teamname : "nexters",
                    description : "개발자, 디자이너 모임",
                    team_progress : 40,
                    section_progress : {
                        "개발자" : 20,
                        "디자이너" : 20
                    },
                    manager : "10101010",
                    start_date : "2016-07-01 14:04:00",
                    end_date : "2016-07-21 14:04:00"
                }
                // END TODO
            });
        })
        .catch(errorHandler);
};

var editTeamInfo = function(req, res, next) {
    var data = {
        access_token : req.header('access-token'),
        team_id : req.params.team_id,
        teamname : req.body.teamname,
        description : req.body.description,
        manager : req.body.manager,
        section : req.body.section,
        start_date : req.body.start_date,
        end_date : req.body.end_date
    };

    teamModel.editTeamInfo(data)
        .then(function (data) {
            res.statusCode = 200;
            res.json({
                msg : '팀 정보 수정 완료',
                // TODO data : data
                data : {
                    team_id : "10",
                    teamname : "nexters",
                    description : "개발자, 디자이너 모임",
                    team_progress : 40,
                    section_progress : {
                        "개발자" : 20,
                        "디자이너" : 20
                    },
                    manager : "10101010",
                    start_date : "2016-07-01 14:04:00",
                    end_date : "2016-07-21 14:04:00"
                }
                // END TODO
            });
        })
        .catch(errorHandler);
};

var getTeamInfo = function(req, res, next) {
    var data = {
        access_token : req.header('access-token'),
        team_id : req.params.team_id
    };

    teamModel.getTeamInfo(data)
        .then(function (data) {
            res.statusCode = 200;
            res.json({
                msg : '팀 상세 정보',
                // TODO data : data
                data : {
                    team_id: "10",
                    teamname: "nexters",
                    description: "개발자, 디자이너 모임",
                    team_logo: "http:dev.qinshihwang/image/some",
                    party : [10, 11, 12, 13],
                    team_progress : 10,
                    section_progress : {
                        "개발자" : 20,
                        "디자이너" : 20
                    },
                    start_date : "2016-07-01 14:04:00",
                    end_date : "2016-07-21 14:04:00"
                }
                // END TODO
            });
        })
        .catch(errorHandler);
};

var deleteTeam = function(req, res, next) {
    var data = {
        access_token : req.header('access-token'),
        team_id : req.params.team_id
    };

    teamModel.deleteTeam(data)
        .then(function () {
            res.statusCode = 200;
            res.json({
                msg : '팀 삭제 완료'
            });
        })
        .catch(errorHandler);
};

var getTeamCode = function(req, res, next) {
    var data = {
        access_token : req.header('access-token'),
        team_id : req.params.team_id
    };

    teamModel.getTeamCode(data)
        .then(function (data) {
            res.statusCode = 200;
            res.json({
                msg : '초대 URL',
                // TODO data : data
                data : {
                    invite_url : "http://host.com/invite/1341343"
                }
                // END TODO
            });
        })
        .catch(errorHandler);
};

var joinTeam = function(req, res, next) {
    var data = {
        access_token : req.header('access-token'),
        invite_code: req.params.invite_code
    };

    teamModel.joinTeam(data)
        .then(function (data) {
            // TODO change invite code data
            if (require('../credentials').host.api + "/ABCDEFGHIJK_HASH_CODE" == data.invite_code) {
                res.statusCode = 200;
                res.json({
                    msg : "가입 되었습니다."
                });
            } else {
                res.json({
                    msg : "잘못된 초대코드 입니다."
                })
            }
            // END TODO
        })
        .catch(errorHandler);
};

module.exports.getTeamList = getTeamList;
module.exports.makeTeam = makeTeam;
module.exports.editTeamInfo = editTeamInfo;
module.exports.getTeamInfo = getTeamInfo;
module.exports.deleteTeam = deleteTeam;
module.exports.getTeamCode = getTeamCode;
module.exports.joinTeam = joinTeam;