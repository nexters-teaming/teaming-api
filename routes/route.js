/**
 * Created by YS on 2016-07-28.
 */
var express = require('express');
var api = require('../controllers');
var router = express.Router();

module.exports = function(){

    // User controller
    router.post('/users/oauth', api.user.joinUser);         // 유저 생성 (소셜 로그인 후)
    router.delete('/users/oauth', api.user.deleteUser);     // 로그아웃
    router.get('/users/:user_id', api.user.getUser);        // 유저 정보
    router.put('/users/:user_id', api.user.editUser);       // 유저 정보 수정

    // Team controller
    router.get('/team', api.team.getTeamList);                      // 팀 목록
    router.post('/team', api.team.makeTeam);                        // 팀 생성
    router.get('/team/:team_id', api.team.getTeamInfo);             // 팀 정보
    router.put('/team/:team_id', api.team.editTeamInfo);            // 팀 정보 변경
    router.delete('/team/:team_id', api.team.deleteTeam);           // 팀 삭제
    router.get('/team/:team_id/invitation', api.team.getTeamCode);  // 팀 초대코드
    router.get('/invite/:invite_code', api.team.joinTeam);           // 초대코드로 팀 가입

    // Section controller
    router.get('/section/:team_id', api.section.getSectionList);                    // 섹션 목록
    router.post('/section/:team_id', api.section.makeSection);                      // 섹션 생성
    router.get('/section/:team_id/:section_id', api.section.getSectionInfo);        // 섹션 상세
    router.post('/section/:team_id/:section_id', api.section.joinSection);          // 섹션 참여
    router.put('/section/:team_id/:section_id', api.section.editSectionInfo);       // 섹션 수정
    router.delete('/section/:team_id/:section_id', api.section.deleteSection);      // 섹션 삭제
    router.get('/section/:team_id/:section_id/party', api.section.getSectionParty);// 섹션 참여자

    // Work controller
    router.get('/work/:team_id/:section_id', api.work.getWorkList);             // 할일 목록
    router.post('/work/:team_id/:section_id', api.work.makeWork);               // 할일 생성
    router.get('/work/:team_id/:section_id/:work_id', api.work.getWorkInfo);    // 할일 상세
    router.post('/work/:team_id/:section_id/:work_id', api.work.joinWork);      // 할일 참여
    router.put('/work/:team_id/:section_id/:work_id', api.work.editWorkInfo);   // 할일 변경
    router.delete('/work/:team_id/:section_id/:work_id', api.work.deleteWork);   // 할일 삭제

    return router;
};

