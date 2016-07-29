/**
 * Created by YS on 2016-07-28.
 */
var userModel = require('../models/userModel');
var facebook = require('./facebook');
var Promise = require("bluebird");
//var errorHandler = require('./errorHandler');

var joinUser = function(req, res, next) {
    var data = {
        access_token : req.header('access-token'),
        user_id : req.body.user_id,
        username : req.body.username
    };

    facebook.checkToken(data)
        .then(userModel.joinUser)
        .then(function () {
            res.statusCode = 200;
            res.json({
                msg : '사용자 등록 완료'
            });
        })
        .catch(next);
};

var deleteUser = function(req, res, next) {
    var data = {
        access_token : req.header('access-token')
    };

    userModel.deleteUser(data)
        .then(function () {
            res.statusCode = 200;
            res.json({
                msg : '로그아웃 완료'
            });
        })
        .catch(next);
};

var getUser = function(req, res, next) {
    var data = {
        access_token : req.header('access-token'),
        user_id : req.params.user_id
    };

    userModel.getUser(data)
        .then(function (data) {
            res.statusCode = 200;
            res.json({
                msg : '사용자 정보 가져옴',
                data : data
            });
        })
        .catch(next);
};

var editUser = function(req, res, next) {
    var data = {
        access_token : req.header('access-token'),
        user_id : req.params.user_id,
        username : req.body.username
    };

    userModel.editUser(data)
        .then(userModel.getUser)
        .then(function (data) {
            res.statusCode = 200;
            res.json({
                msg : '사용자 정보 수정 완료',
                data : data
            });
        })
        .catch(next);
};

module.exports.joinUser = joinUser;
module.exports.deleteUser = deleteUser;
module.exports.getUser = getUser;
module.exports.editUser = editUser;