/**
 * Created by YS on 2016-07-28.
 */
var sectionModel = require('../models/sectionModel');
var teamModel = require('../models/teamModel');
var Promise = require("bluebird");
var errorHandler = require('./errorHandler');

/**
 *
 * @type {{
 *  getSectionList: module.exports.getSectionList,
 *  makeSection: module.exports.makeSection,
 *  editSectionInfo: module.exports.editSectionInfo,
 *  getSectionInfo: module.exports.getSectionInfo,
 *  deleteSection: module.exports.deleteSection,
 *  getSectionParty: module.exports.getSectionParty,
 *  joinSection: module.exports.joinSection
 * }}
 */
module.exports = {

    getSectionList: function (req, res, next) {
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
            .then(sectionModel.getSectionList)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '섹션 목록',
                    data: data
                });
            })
            .catch(next);
    },

    makeSection: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_title: req.body.section_title,
            end_date: req.body.end_date
        };

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(sectionModel.makeSection)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '섹션 생성 완료',
                    data: data
                });
            })
            .catch(next);
    },

    editSectionInfo: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id,
            section_title: req.body.section_title
        };

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(sectionModel.editSectionInfo)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '섹션 정보 수정 완료',
                    data: data
                });
            })
            .catch(next);
    },

    getSectionInfo: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id
        };

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(sectionModel.getSectionInfo)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '섹션 상세',
                    data: data
                    // TODO data 안에 progress 추가할 것
                    /*data: {
                        section_id: "10",
                        section_title: "진시황 개발",
                        party: [{
                            user_id: 10,
                            username: "테스터1"
                        }, {
                            user_id: 11,
                            username: "테스터2"
                        }],
                        progress: "10"
                    }*/
                    // END TODO
                });
            })
            .catch(next);
    },

    deleteSection: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id
        };

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(sectionModel.deleteSection)
            .then(function () {
                res.statusCode = 200;
                res.json({
                    msg: '섹션 삭제 완료'
                });
            })
            .catch(next);
    },

    getSectionParty: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id
        };

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(sectionModel.getSectionParty)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '섹션 참여자 목록',
                    data: data
                });
            })
            .catch(next);
    },

    joinSection: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id
        };

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(sectionModel.checkSectionMemberById)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                })
            })
            .then(sectionModel.joinSection)
            .then(function() {
                return new Promise(function(resolved){
                    resolved(data);
                });
            })
            .then(sectionModel.getSectionParty)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: "섹션 참여 완료",
                    data: data
                });
            })
            .catch(next);
    },

    exitSection: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id
        };

        teamModel.getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                });
            })
            .then(sectionModel.getSectionMemberById)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                })
            })
            .then(sectionModel.exitSection)
            .then(function() {
                return new Promise(function(resolved){
                    resolved(data);
                });
            })
            .then(sectionModel.getSectionParty)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: "섹션 탈퇴 완료",
                    data: data
                });
            })
            .catch(next);
    }
};