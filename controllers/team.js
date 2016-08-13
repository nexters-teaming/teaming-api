/**
 * Created by YS on 2016-07-28.
 */
var teamModel = require('../models/teamModel');
var Promise = require("bluebird");
//var errorHandler = require('./errorHandler');

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
                });
            })
            .catch(next);
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
            .then(function(result) {
                return new Promise(function(resolved) {
                    data.team_id = result;
                    console.log(data);
                    resolved(data);
                });
            })
            .then(teamModel.getTeamProgress)
            .then(function(result) {
                return new Promise(function(resolved) {
                    data.progress = result;
                    resolved(data);
                });
            })
            .then(teamModel.getTeamInfo)
            .then(function(result) {
                return new Promise(function(resolved) {
                    if (data.progress.total == 0) result.team_progress = 0;
                    else result.team_progress = data.progress.done_count/data.progress.total;
                    result.all_progress = data.progress.all_progress;
                    resolved(result);
                });
            })
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
            .catch(next);
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

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(teamModel.editTeamInfo)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(teamModel.getTeamProgress)
            .then(function(result) {
                return new Promise(function(resolved) {
                    data.progress = result;
                    resolved(data);
                });
            })
            .then(teamModel.getTeamInfo)
            .then(function(result) {
                return new Promise(function(resolved) {
                    result.team_progress = data.progress.done_count/data.progress.total;
                    result.all_progress = data.progress.all_progress;
                    resolved(result);
                });
            })
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
            .catch(next);
    },

    getTeamInfo : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id
        };

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(teamModel.getTeamProgress)
            .then(function(result) {
                return new Promise(function(resolved) {
                    data.progress = result;
                    resolved(data);
                });
            })
            .then(teamModel.getTeamInfo)
            .then(function(result) {
                return new Promise(function(resolved) {
                    result.team_progress = data.progress.done_count/data.progress.total;
                    result.all_progress = data.progress.all_progress;
                    console.log(result);
                    resolved(result);
                });
            })
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '팀 상세 정보',
                    data: data
                });
            })
            .catch(next);
    },

    deleteTeam : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id
        };

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(teamModel.deleteTeam)
            .then(function () {
                res.statusCode = 200;
                res.json({
                    msg: '팀 삭제 완료'
                });
            })
            .catch(next);
    },

    // deprecated
    inviteTeam : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            user_id: req.params.user_id,
            team_id: req.params.team_id
        };

        // TODO 여러명이 초대시 sender 변경? 또는 초대 못하게
        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(teamModel.inviteTeam)
            .then(function () {
                res.statusCode = 200;
                res.json({
                    msg: '팀 초대 완료'
                });
            })
            .catch(next);
    },

    inviteURL : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id
        };

        // TODO 여러명이 초대시 sender 변경? 또는 초대 못하게
        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(function () {
                res.statusCode = 200;
                res.json({
                    msg: '팀 초대 URL',
                    data: require('../credentials').host.api + '/invite/' + data.team_id
                });
            })
            .catch(next);
    },

    joinTeam : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id
        };

        teamModel.checkTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(teamModel.joinTeam)
            .then(function () {
                res.statusCode = 200;
                res.json({
                    msg: "가입 신청 되었습니다."
                });
            })
            .catch(next);
    },

    getJoinAsk : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id
        };

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(teamModel.getJoinAsk)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: "팀 신청 정보.",
                    data: data
                });
            })
            .catch(next);
    },

    approveTeam : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            user_id: req.params.user_id
        };

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(teamModel.approveTeam)
            .then(function () {
                res.statusCode = 200;
                res.json({
                    msg: "가입 되었습니다."
                });
            })
            .catch(next);
    },

    approveRecord : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id
        };

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(teamModel.getApproveRecord)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: "팀 가입 신청 승낙 정보.",
                    data: data
                });
            })
            .catch(next);
    },

    leaveTeam : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id
        };

        // TODO if team member is empty delete team
        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(teamModel.leaveTeam)
            .then(function () {
                res.statusCode = 200;
                res.json({
                    msg: "탈퇴 되었습니다."
                });
            })
            .catch(next);
    },

};