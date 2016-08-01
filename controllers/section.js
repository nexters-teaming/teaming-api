/**
 * Created by YS on 2016-07-28.
 */
var sectionModel = require('../models/sectionModel');
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

        sectionModel.getSectionList(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '섹션 목록',
                    // TODO data : data
                    data: [{
                        section_id: "10",
                        section_title: "개발자",
                        edit_date: "2016-07-27 06:11:00"
                    }, {
                        section_id: "11",
                        section_title: "디자이너",
                        edit_date: "2016-07-28 06:11:00"
                    }]
                    // END TODO
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

        require('../models/teamModel').getTeamMemberById(data)
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
                    // TODO data : data
                    /*data: {
                        section_id: "10",
                        section_title: "개발팀",
                        edit_date: "2016-07-27 06:11:00"
                    }*/
                    // END TODO
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

        sectionModel.editSectionInfo(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '섹션 정보 수정 완료',
                    // TODO data : data
                    data: {
                        section_id: "10",
                        section_title: "개발팀",
                        edit_date: "2016-07-27 06:11:00"
                    }
                    // END TODO
                });
            })
            .catch(errorHandler);
    },

    getSectionInfo: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id
        };

        sectionModel.getSectionInfo(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '섹션 상세',
                    // TODO data : data
                    data: {
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
                    }
                    // END TODO
                });
            })
            .catch(errorHandler);
    },

    deleteSection: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id
        };

        sectionModel.deleteSection(data)
            .then(function () {
                res.statusCode = 200;
                res.json({
                    msg: '섹션 삭제 완료'
                });
            })
            .catch(errorHandler);
    },

    getSectionParty: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id
        };

        sectionModel.getSectionParty(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '섹션 참여자 목록',
                    // TODO data : data
                    data: [{
                        user_id: 10,
                        username: "테스터1"
                    }, {
                        user_id: 11,
                        username: "테스터2"
                    }]
                    // END TODO
                });
            })
            .catch(errorHandler);
    },

    joinSection: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id
        };

        sectionModel.joinSection(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: "가입 되었습니다.",
                    // TODO data : data
                    data: [{
                        user_id: 10,
                        username: "테스터1"
                    }, {
                        user_id: 11,
                        username: "테스터2"
                    }]
                    // END TODO
                });
            })
            .catch(errorHandler);
    }
}