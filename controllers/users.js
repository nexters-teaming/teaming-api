/**
 * Created by YS on 2016-07-28.
 */
var userModel = require('../models/userModel');
var facebook = require('./facebook');
var Promise = require("bluebird");
//var errorHandler = require('./errorHandler');

/**
 *
 * @type {{
 *  joinUser: module.exports.joinUser,
 *  deleteUser: module.exports.deleteUser,
 *  getUser: module.exports.getUser,
 *  editUser: module.exports.editUser
 * }}
 */
module.exports = {
    joinUser : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            user_id: req.body.user_id,
            username: req.body.username
        };

        // TODO validation
        facebook.checkToken(data)
            .then(userModel.joinUser)
            .then(function () {
                res.statusCode = 200;
                res.json({
                    msg: '사용자 등록 완료'
                });
            })
            .catch(next);
    },

    deleteUser : function(req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        userModel.deleteUser(data)
            .then(function () {
                res.statusCode = 200;
                res.json({
                    msg: '로그아웃 완료'
                });
            })
            .catch(next);
    },

    getUser : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            user_id: req.params.user_id
        };

        userModel.getUser(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '사용자 정보 가져옴',
                    data: data
                });
            })
            .catch(next);
    },

    getMe : function(req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        userModel.getMe(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '사용자 정보 가져옴',
                    data: data
                });
            })
            .catch(next);
    },

    editUser : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            user_id: req.params.user_id,
            username: req.body.username
        };

        // TODO validation
        userModel.editUser(data)
            .then(userModel.getUser)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '사용자 정보 수정 완료',
                    data: data
                });
            })
            .catch(next);
    }

};