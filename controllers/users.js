/**
 * Created by YS on 2016-07-28.
 */
var userModel = require('../models/userModel');
var Promise = require("bluebird");
var errorHandler = require('./errorHandler');

var joinUser = function(req, res, next) {
    var data = {
        access_token : req.header('access-token'),
        user_id : req.body.user_id,
        username : req.body.username
    };

    userModel.joinUser(data)
        .then(function () {
            res.statusCode = 200;
            res.json({
                msg : '사용자 등록 완료'
            });
        })
        .catch(errorHandler);
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
        .catch(errorHandler);
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
                //TODO data : data
                data : {
                    user_id : 1000,
                    username : "tester"
                }
                // END TODO
            });
        })
        .catch(errorHandler);
};

var editUser = function(req, res, next) {
    var data = {
        access_token : req.header('access-token'),
        user_id : req.params.user_id,
        username : req.body.username
    };

    userModel.editUser(data)
        .then(function (data) {
            res.statusCode = 200;
            res.json({
                msg : '사용자 정보 수정 완료',
                //TODO data : data
                data : {
                    user_id : 1000,
                    username : "tester"
                }
                // END TODO
            });
        })
        .catch(errorHandler);
};

module.exports.joinUser = joinUser;
module.exports.deleteUser = deleteUser;
module.exports.getUser = getUser;
module.exports.editUser = editUser;