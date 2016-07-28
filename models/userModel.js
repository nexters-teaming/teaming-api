/**
 * Created by YS on 2016-07-28.
 */
var credentials = require('../credentials');
var Promise = require("bluebird");
var pool = require('./mysqlSetting');

var user_model = {
    joinUser : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
            /*pool.getConnection(function (err, connection) {
             if (err) return rejected(500, "에러 발생." );
             var select = [];
             var sql = "SELECT prod_id, prod_name, prod_price, category_a, category_b, prod_desc, prod_img, size, GROUP_CONCAT(KeyColor.color_name) AS color_list " +
             "FROM ShopProduct " +
             "INNER JOIN KeyColor " +
             "ON ShopProduct.prod_id = KeyColor.color_prod_id ";
             if (typeof  data.category_b == 'undefined') {
             select.push(data.category_a);
             sql += "WHERE category_a = ? ";
             } else {
             select.push(data.category_a, data.category_b);
             sql += "WHERE category_a = ? " +
             "AND category_b = ? ";
             }

             sql += "GROUP BY prod_id LIMIT 20 ";
             connection.query(sql, select, function (err, rows) {
             if (err) {
             return rejected(500, "정보 수정에 실패했습니다." );
             } else if(rows.affectedRows == 0) {
             return rejected(204, "정보 수정에 실패했습니다. 원인: 유저가 없음" );
             }
             connection.release();
             return resolved(rows);
             });
             });*/
        });
    },

    deleteUser : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    getUser : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
    editUser : function(data) {
        return new Promise(function(resolved, rejected) {
            resolved();
        });
    },
};

module.exports = user_model;