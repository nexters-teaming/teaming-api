/**
 * Created by YS on 2016-08-20.
 */
var commentModel = require('../models/commentModel');
var sectionModel = require('../models/sectionModel');
var Promise = require("bluebird");
var errorHandler = require('./errorHandler');

module.exports = {

    getCommentList: function (req, res, next) {
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
            .then(commentModel.getCommentList)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '댓글 목록',
                    data: data
                });
            })
            .catch(next);
    },

    makeComment: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id,
            work_id: req.params.work_id,
            comment_msg: req.body.comment_msg
        };

        sectionModel.getSectionMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(commentModel.makeComment)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                });
            })
            .then(commentModel.getCommentList)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '댓글 생성 완료',
                    data: data
                });
            })
            .catch(next);
    },

    editComment: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id,
            work_id: req.params.work_id,
            comment_id: req.params.comment_id,
            comment_msg: req.body.comment_msg
        };

        sectionModel.getSectionMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                });
            })
            .then(commentModel.editComment)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                });
            })
            .then(commentModel.getCommentList)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '댓글 수정 완료',
                    data: data
                });
            })
            .catch(next);
    },

    deleteComment: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id,
            work_id: req.params.work_id,
            comment_id: req.params.comment_id
        };

        sectionModel.getSectionMemberById(data)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(commentModel.deleteComment)
            .then(function() {
                return new Promise(function(resolved) {
                    return resolved(data);
                })
            })
            .then(commentModel.getCommentList)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '댓글 삭제 완료',
                    data: data
                });
            })
            .catch(errorHandler);
    }
};