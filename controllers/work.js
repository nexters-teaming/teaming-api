/**
 * Created by YS on 2016-07-28.
 */
var workModel = require('../models/workModel');
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

        workModel.getWorkList(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '할일 목록',
                    // TODO data : data
                    data: [{
                        work_id: "10",
                        work_process: 1,
                        work_title: "B시안 코딩",
                        work_desc: "B시안은 이러쿵 저러쿵 합니다.",
                        worker: [{
                            user_id: 10,
                            username: "테스터1",
                            status: 1
                        }, {
                            user_id: 11,
                            username: "테스터2",
                            status: 0
                        }],
                        start_date: "2016-07-01 14:04:00",
                        end_date: "2016-07-21 14:04:00",
                        edit_date: "2016-07-02 14:04:00"
                    }, {
                        work_id: "10",
                        work_process: 1,
                        work_title: "B시안 코딩",
                        work_desc: "B시안은 이러쿵 저러쿵 합니다.",
                        worker: [{
                            user_id: 10,
                            username: "테스터1",
                            status: 1
                        }, {
                            user_id: 11,
                            username: "테스터2",
                            status: 0
                        }],
                        start_date: "2016-07-01 14:04:00",
                        end_date: "2016-07-21 14:04:00",
                        edit_date: "2016-07-02 14:04:00"
                    }]
                    // END TODO
                });
            })
            .catch(errorHandler);
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

        workModel.makeWork(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '할일 생성 완료',
                    // TODO data : data
                    data: {
                        work_id: "10",
                        work_process: 0,
                        work_title: "B시안 코딩",
                        work_desc: "B시안은 이러쿵 저러쿵 합니다.",
                        worker: [{
                            user_id: 10,
                            username: "테스터1",
                            status: 1
                        }, {
                            user_id: 11,
                            username: "테스터2",
                            status: 0
                        }],
                        start_date: "2016-07-01 14:04:00",
                        end_date: "2016-07-21 14:04:00",
                        edit_date: "2016-07-02 14:04:00"
                    }
                    // END TODO
                });
            })
            .catch(errorHandler);
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
            start_date: req.body.start_date,
            end_date: req.body.end_date
        };

        workModel.editWorkInfo(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '할일 수정 완료',
                    // TODO data : data
                    data: {
                        work_id: "10",
                        work_process: 0,
                        work_title: "B시안 코딩",
                        work_desc: "B시안은 이러쿵 저러쿵 합니다.",
                        worker: [{
                            user_id: 10,
                            username: "테스터1",
                            status: 1
                        }, {
                            user_id: 11,
                            username: "테스터2",
                            status: 0
                        }],
                        start_date: "2016-07-01 14:04:00",
                        end_date: "2016-07-21 14:04:00",
                        edit_date: "2016-07-02 14:04:00"
                    }
                    // END TODO
                });
            })
            .catch(errorHandler);
    },

    getWorkInfo: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            team_id: req.params.team_id,
            section_id: req.params.section_id,
            work_id: req.params.work_id
        };

        workModel.getWorkInfo(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: '할일 상세',
                    // TODO data : data
                    data: {
                        work_id: "10",
                        work_process: 1,
                        work_title: "B시안 코딩",
                        work_desc: "B시안은 이러쿵 저러쿵 합니다.",
                        worker: [{
                            user_id: 10,
                            username: "테스터1",
                            status: 1
                        }, {
                            user_id: 11,
                            username: "테스터2",
                            status: 0
                        }],
                        start_date: "2016-07-01 14:04:00",
                        end_date: "2016-07-21 14:04:00",
                        edit_date: "2016-07-02 14:04:00"
                    }
                    // END TODO
                });
            })
            .catch(errorHandler);
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

        workModel.joinWork(data)
            .then(function (data) {
                res.statusCode = 200;
                res.json({
                    msg: "가입 되었습니다.",
                    // TODO data : data
                    data: [{
                        user_id: 10,
                        username: "테스터1",
                        status: 1
                    }, {
                        user_id: 11,
                        username: "테스터2",
                        status: 0
                    }]
                    // END TODO
                });
            })
            .catch(errorHandler);
    }
}