/**
 * Created by YS on 2016-07-28.
 */
var users = require('./users');
var team = require('./team');
var section = require('./section');
var work = require('./work');

var api = {
    user : {
        joinUser : users.joinUser,
        deleteUser : users.deleteUser,
        getUser : users.getUser,
        editUser : users.editUser
    },
    team : {
        getTeamList : team.getTeamList,
        makeTeam : team.makeTeam,
        getTeamInfo : team.getTeamInfo,
        editTeamInfo : team.editTeamInfo,
        deleteTeam : team.deleteTeam,
        getTeamCode : team.getTeamCode,
        joinTeam : team.joinTeam
    },
    section : {
        getSectionList : section.getSectionList,
        makeSection : section.makeSection,
        getSectionInfo : section.getSectionInfo,
        joinSection : section.joinSection,
        editSectionInfo : section.editSectionInfo,
        deleteSection : section.deleteSection,
        getSectionParty : section.getSectionParty
    },
    work : {
        getWorkList : work.getWorkList,
        makeWork : work.makeWork,
        getWorkInfo : work.getWorkInfo,
        joinWork : work.joinWork,
        editWorkInfo : work.editWorkInfo,
        deleteWork : work.deleteWork
    }
};

module.exports = api;