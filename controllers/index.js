/**
 * Created by YS on 2016-07-28.
 */
var users = require('./users');
var team = require('./team');
var section = require('./section');
var work = require('./work');

var api = {
    user : users,
    team : team,
    section : section,
    work : work
};

module.exports = api;