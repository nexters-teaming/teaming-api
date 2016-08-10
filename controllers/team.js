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
            .then(teamModel.getTeamInfo)
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
                    msg: "가입 되었습니다."
                });
            })
            .catch(next);
    }

};