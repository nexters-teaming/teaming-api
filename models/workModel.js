/**
 * Created by YS on 2016-07-28.
 */
var credentials = require('../credentials');
var Promise = require("bluebird");
var pool = require('./mysqlSetting');

var work_model = {

    getWorkList : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    makeWork : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    getWorkInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    joinWork : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    editWorkInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    deleteWork : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    }

};

module.exports = work_model;