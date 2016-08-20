/**
 * Created by YS on 2016-07-28.
 */
var workModel = require('../models/workModel');
var sectionModel = require('../models/sectionModel');
var Promise = require("bluebird");
var errorHandler = require('./errorHandler');

/**
 *
 * @type {{
 *  getWorkList: module.exports.getWorkList,
 *  makeWork: module.exports.makeWork,
 *  editWorkInfo: module.exports.editWorkInfo,
 *  getWorkInfo: module.exports.getWorkInfo,
 *  deleteWork: module.exports.deleteWork,
 *  joinWork: module.exports.joinWork
 * }}
 */
module.exports = {

    getWorkList: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id
        };

        require('../models/teamModel').getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(workModel.getWorkList)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '할일 목록',
                    data: data
                });
            })
            .catch(next);
    },

    makeWork: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id,
            work_title: req.body.work_title,
            work_desc: req.body.work_desc,
            worker: req.body.worker,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        };

        sectionModel.getSectionMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(workModel.makeWork)
            .then(function(tempData) {
                return new Promise(function(resolved) {
                    // worker를 처음부터 등록하는 경우
                    if (typeof data.worker != 'undefined') {
                        // 별도로 joinWork 실행
                        workModel.joinWork({access_token: data.access_token, work_id: tempData.work_id})
                            .then(function() {
                                return resolved(tempData);
                            })
                            .catch(next)
                    } else {
                        return resolved(tempData);
                    }
                });
            })
            .then(workModel.getWorkInfo)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '할일 생성 완료',
                    data: data
                });
            })
            .catch(next);
    },

    editWorkInfo: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id,
            work_id: req.params.work_id,
            work_title: req.body.work_title,
            work_desc: req.body.work_desc,
            worker: req.body.worker,
            work_progress: req.body.work_progress,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        };

        sectionModel.getSectionMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                });
            })
            .then(workModel.editWorkInfo)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                });
            })
            .then(workModel.getWorkProgress)
            .then(function(result) {
                return new Promise(function(resolved) {
                    data.progress = parseInt(result.done_count/result.total*100);
                    return resolved(data);
                });
            })
            .then(sectionModel.updateProgress)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                });
            })
            .then(workModel.getWorkInfo)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '할일 수정 완료',
                    data: data
                });
            })
            .catch(next);
    },

    getWorkInfo: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id,
            work_id: req.params.work_id
        };

        require('../models/teamModel').getTeamMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(workModel.getWorkInfo)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '할일 상세',
                    data: data
                });
            })
            .catch(next);
    },

    deleteWork: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id,
            work_id: req.params.work_id
        };

        workModel.deleteWork(data)
            .then(function () {
                res.statusCode = 200;
                res.json({
                    msg: '할일 삭제 완료'
                });
            })
            .catch(errorHandler);
    },

    joinWork: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id,
            work_id: req.params.work_id
        };

        sectionModel.getSectionMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(workModel.checkWorkMemberById)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                })
            })
            .then(workModel.joinWork)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                })
            })
            .then(workModel.getWorker)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: "가입 되었습니다.",
                    data: data
                });
            })
            .catch(next);
    },

    exitWork: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id,
            work_id: req.params.work_id
        };

        sectionModel.getSectionMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(workModel.getWorkMemberById)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                })
            })
            .then(workModel.exitWork)
            .then(function() {
                return new Promise(function(resolved) {
                    resolved(data);
                })
            })
            .then(workModel.getWorker)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: "탈퇴 되었습니다.",
                    data: data
                });
            })
            .catch(next);
    }
};