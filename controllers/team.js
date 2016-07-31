/**
 * Created by YS on 2016-07-28.
 */
var teamModel = require('../models/teamModel');
var Promise = require("bluebird");
var errorHandler = require('./errorHandler');

/**
 *
 * @type {{
 *  getTeamList: module.exports.getTeamList,
 *  makeTeam: module.exports.makeTeam,
 *  editTeamInfo: module.exports.editTeamInfo,
 *  getTeamInfo: module.exports.getTeamInfo,
 *  deleteTeam: module.exports.deleteTeam,
 *  getTeamCode: module.exports.getTeamCode,
 *  joinTeam: module.exports.joinTeam
 * }}
 */
module.exports = {

    getTeamList: function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        teamModel.getTeamList(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '팀 목록',
                    data: data
                    // TODO data 안에 team_progress, section_progress 추가
                    /*data: [
                        {
                            team_id: "10",
                            teamname: "nexters",
                            description: "개발자, 디자이너 모임",
                            party: [10, 11, 12, 13],
                            team_progress: 10,
                            section_progress: {
                                "개발자": 20,
                                "디자이너": 20
                            },
                            start_date: "2016-07-01 14:04:00",
                            end_date: "2016-07-21 14:04:00"
                        }
                    ]*/
                    // END TODO
                });
            })
            .catch(errorHandler);
    },

    makeTeam : function (req, res, next) {
    var data = {
        access_token: req.header('access-token'),
        teamname: req.body.teamname,
        description: req.body.description,
        start_date: req.body.start_date,
        end_date: req.body.end_date
    };

    // TODO validation

    teamModel.makeTeam(data)
        //.then(teamModel.getTeamInfo)
        .then(function (data) {
            res.statusCode = 200;
            res.json({
                msg: '팀 정보 저장 완료',
                data: data
                // TODO data 안에 team_progress, section_progress 추가
                /*team_progress : 40,
                 section_progress : {
                 "개발자" : 20,
                 "디자이너" : 20
                 }*/
            });
        })
        .catch(errorHandler);
},

    editTeamInfo : function (req, res, next) {
    var data = {
        access_token: req.header('access-token'),
        team_id: req.params.team_id,
        teamname: req.body.teamname,
        description: req.body.description,
        manager: req.body.manager,
        section: req.body.section,
        start_date: req.body.start_date,
        end_date: req.body.end_date
    };

    teamModel.editTeamInfo(data)
        .then(function (data) {
            res.statusCode = 200;
            res.json({
                msg: '팀 정보 수정 완료',
                data: data
                // TODO data 안에 team_progress, section_progress 추가
                /*data: {
                    team_id: "10",
                    teamname: "nexters",
                    description: "개발자, 디자이너 모임",
                    team_progress: 40,
                    section_progress: {
                        "개발자": 20,
                        "디자이너": 20
                    },
                    manager: "10101010",
                    start_date: "2016-07-01 14:04:00",
                    end_date: "2016-07-21 14:04:00"
                }*/
                // END TODO
            });
        })
        .catch(errorHandler);
},

    getTeamInfo : function (req, res, next) {
    var data = {
        access_token: req.header('access-token'),
        team_id: req.params.team_id
    };

    teamModel.getTeamInfo(data)
        .then(function (data) {
            res.statusCode = 200;
            res.json({
                msg: '팀 상세 정보',
                data: data
                // TODO data 안에 team_logo, team_progress, section_progress 추가
                /*data: {
                    team_id: "10",
                    teamname: "nexters",
                    description: "개발자, 디자이너 모임",
                    team_logo: "http:dev.qinshihwang/image/some",
                    party: [10, 11, 12, 13],
                    team_progress: 10,
                    section_progress: {
                        "개발자": 20,
                        "디자이너": 20
                    },
                    start_date: "2016-07-01 14:04:00",
                    end_date: "2016-07-21 14:04:00"
                }*/
                // END TODO
            });
        })
        .catch(errorHandler);
},

    deleteTeam : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id
        };

        teamModel.deleteTeam(data)
            .then(function () {
                res.statusCode = 200;
                res.json({
                    msg: '팀 삭제 완료'
                });
            })
            .catch(errorHandler);
    },

    getTeamCode : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id
        };

        var crypto = require('crypto');
        var salt = Math.round((new Date().valueOf() * Math.random())) + "";
        data.invite_code = crypto.createHash("md5").update(data.team_id + salt).digest("hex");
        var set_date = new Date().setYear(new Date().getFullYear() + 1);
        var cur_date = new Date(set_date).toISOString().split("T");
        data.end_date = cur_date[0]+" "+cur_date[1].split(".")[0];

        teamModel.makeTeamCode(data)
            .then(teamModel.getTeamCode)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '초대 URL',
                    // TODO data : data
                    data: {
                        invite_url: require('../credentials').host.api + '/invite/' + data.invite_code
                    }
                    // END TODO
                });
            })
            .catch(errorHandler);
    },

    joinTeam : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            invite_code: req.params.invite_code
        };

        teamModel.joinTeam(data)
            .then(function (result) {
                return new Promise(function(resolved, rejected) {
                    // TODO change invite code data
                    if ("ABCDEFGHIJK_HASH_CODE" == data.invite_code) {
                        res.statusCode = 200;
                        res.json({
                            msg: "가입 되었습니다."
                        });
                    } else {
                        res.json({
                            msg: "잘못된 초대코드 입니다."
                        });
                    }
                    // END TODO
                });
            })
            .catch(errorHandler);
    }

};