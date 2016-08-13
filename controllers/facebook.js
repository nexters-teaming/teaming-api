/**
 * Created by YS on 2016-07-29.
 */
var request = require('request');
var Promise = require("bluebird");

module.exports.checkToken = checkToken;

function checkToken(data) {
    // 페이스북에 유효 토큰 질의
    return new Promise(function(resolved, rejected) {
        // 유저 상태 인증
        if (process.env.NODE_ENV == 'development') {
            return resolved(data);
        } else {
            request.get({
                url: 'https://graph.facebook.com/v2.7/me',
                qs: {
                    access_token: data.access_token,
                    field: "id"
                }
            }, function (err, httpResponse, body) {
                if (err) {
                    var error = new Error("사용자 인증 에러");
                    error.status = 401;
                    console.error(err);
                    return rejected(error);
                }

                var fb_profile = JSON.parse(body);
                if (fb_profile.error) {
                    var error = new Error("사용자 인증 에러");
                    error.status = 401;
                    console.error(err);
                    return rejected(error);
                }
                data.user_id = fb_profile.id;
                return resolved(data);
            });
        }
    });
}