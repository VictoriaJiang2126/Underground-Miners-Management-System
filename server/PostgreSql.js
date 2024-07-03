//引入pg模块
var pg = require("pg");


function PostgreSql(sql) {
  // 数据库配置
  // var config = {
  //   database: "underground-operator-management-system", //数据库名称
  //   user: "postgres", //用户名
  //   password: "postgres", //密码
  //   host: '39.107.137.49',
  //   port: 8090, //端口号
  //   // 扩展属性
  //   max: 20, // 连接池最大连接数
  //   idleTimeoutMillis: 3000 ,// 连接最大空闲时间 3s
  // };
	
	var config = {
	  database: "underground-operator-management-system", //数据库名称
	  user: "postgres", //用户名
	  password: "postgres", //密码
	  host: '192.168.13.108',
	  port: 5532, //端口号
	  // 扩展属性
	  max: 20, // 连接池最大连接数
	  idleTimeoutMillis: 3000 ,// 连接最大空闲时间 3s
	};

  // 创建连接池
  var pool = new pg.Pool(config);

  // 查询
  this.searchData = function(sqlString, callback) {
    // "SELECT * from users"
    // 查询
    pool.connect(function(err, client, done) {
      if (err) {
        return console.error('查询时，数据库连接出错', err);
      }
      client.query(sqlString, function(err, result) {
        done(); // 释放连接（将其返回给连接池）
        if (err) {
          return console.error('查询出错', err);
        }
        return callback(result.rows);
      });
    });
  }

  // 新增
  this.addData = function(sqlString, callback) {
    // "SELECT * from users"
    // 查询
    pool.connect(function(err, client, done) {
      if (err) {
        return console.error('新增时，数据库连接出错', err);
      }
      client.query(sqlString, function(err, result) {
        done(); // 释放连接（将其返回给连接池）
        if (err) {
          console.info('新增出错', err);
        }
        return callback(err?{}:result.rows,err);
      });
    });
  }

  // 删除
  this.delData = function(sqlString, callback) {
    // "SELECT * from users"
    // 查询
    pool.connect(function(err, client, done) {
      if (err) {
        return console.error('删除时，数据库连接出错', err);
      }
      client.query(sqlString, function(err, result) {
        done(); // 释放连接（将其返回给连接池）
        if (err) {
          console.error('删除出错', err);
        }
        return callback(result.rows);
      });
    });
  }

  // 修改
  this.updateData = function(sqlString, callback) {
    // "SELECT * from users"
    // 查询
    pool.connect(function(err, client, done) {
      if (err) {
        return console.error('修改时，数据库连接出错', err);
      }
      client.query(sqlString, function(err, result) {
        done(); // 释放连接（将其返回给连接池）
        if (err) {
          console.info('修改出错', err);
        }
        return callback(err?{}:result.rows,err);
      });
    });
  }

}

// module.exports = PostgreSql;
exports.PostgreSql = PostgreSql
