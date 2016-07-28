/**
 * Created by YS on 2016-07-28.
 */

var credentials = require('../credentials');
var Promise = require("bluebird");
var pool = require('./mysqlSetting');

var section_model = {
    getSectionList : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    makeSection : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    getSectionInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    joinSection : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    editSectionInfo : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    deleteSection : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    getSectionParty : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    }
};

module.exports = section_model;