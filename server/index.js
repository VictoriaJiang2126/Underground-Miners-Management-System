const express = require('express')
const app = express()

const cors = require('cors') //解决跨域问题
app.use(cors())

const http = require('http') //引入HTTP协议模块
const fs = require('fs') //引入fs模块

const bodyParser = require('body-parser')
const multiparty = require('connect-multiparty')
// 处理 x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// 处理 mutipart/form-data
app.use(multiparty())
// 处理 application/json
app.use(bodyParser.json())

//导入我们上一步写的连接数据库的函数
const {PostgreSql} = require('./PostgreSql.js')
var postgreSql = new PostgreSql();

//创建统一的返回报文对象
// class Response {
// 	constructor(isSucceed, msg, code, data) {
// 		this.isSucceed = isSucceed;
// 		this.msg = msg;
// 		this.code = code;
// 		this.data = data;
// 	}
// }



// 登录
app.post('/login', (req, res) => {
  // 获取用户名和密码
  var uname = req.body.username;
  var upwd = req.body.password;
  // console.log(uname, upwd);

  let sql = `select * from t_admin where user_name = '${uname}' and user_pws= '${upwd}'`
  console.log(sql)
  postgreSql.searchData(sql, (searchData) => {
    if(searchData && searchData.length >0){
      res.send({
        data: searchData[0],
        msg: '登录成功',
      })
    }else{
      res.send({
        data: {},
        msg: '登录失败',
      })
    }
  })
})

// ==================================管理员信息管理页面 相关接口 开始===============================

// 查询所有人员信息
app.post('/getUserInfo', (req, res) => {
  let uname = req.body.searchBO.userName
  let userId = req.body.searchBO.userId
  let sql = ''
  if(uname) {
    sql = `select * from t_admin where user_name like '%${uname}%'
      and role > (select ta."role"  from t_admin ta where ta.id =${userId})
     order by id`
  }else{
    sql = `select * from t_admin where role > (select ta."role"  from t_admin ta where ta.id =${userId}) order by id`
  }
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '获取成功',
    })
  })
})

// 添加新用户
app.post('/addUserInfo', (req, res) => {
  let userInfo = {
    user_name: req.body.userName,
    user_pws: req.body.newPassword,
    roleValue: Number(req.body.roleValue)
  }
  let sql = `INSERT INTO t_admin (user_name, user_pws, role) VALUES ('${userInfo.user_name}', '${userInfo.user_pws}', ${userInfo.roleValue})`
  postgreSql.addData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '保存成功',
    })
  })
})

// 根据id获取用户信息
app.post('/getUserInfoById', (req, res) => {
  let sql = "select * from t_admin where id = " + req.body.id
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData[0],
      msg: '获取成功',
    })
  })
})

// 修改用户信息
app.post('/updateUserInfo', (req, res) => {
  let userInfo = {
    id: req.body.id,
    user_name: req.body.userName,
    user_pws: req.body.newPassword,
    roleValue: Number(req.body.roleValue)
  }
  let sql = `update t_admin set user_name='${userInfo.user_name}',user_pws='${userInfo.user_pws}',role=${userInfo.roleValue} where id = ${userInfo.id}`
  postgreSql.updateData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '修改成功',
    })
  })
})

// 根据id 删除用户
app.post('/delUserInfo', (req, res) => {
  let sql = `delete from t_admin where id = ` + req.body.id
  postgreSql.delData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '删除成功',
    })
  })
})

// ==================================管理员信息管理页面 相关接口 结束===============================







// ==================================站点信息管理页面 相关接口 开始===============================
// 查询所有站点信息
app.post('/getStationInfo', (req, res) => {
  let stationName = req.body.searchBO.stationName
  let sql = ''
  if(stationName) {
    sql = "select * from t_station where name like '%" + stationName + "%' order by id"
  }else{
    sql = "select * from t_station order by id"
  }
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '获取成功',
    })
  })
})
// 添加新站点
app.post('/addStationInfo', (req, res) => {
  let stationInfo = {
    stationName: req.body.stationName,
    section_id: req.body.sectionId,
    mark: req.body.mark,
  }
  let sql = `INSERT INTO t_station (name, section_id, mark) VALUES ('${stationInfo.stationName}', '${stationInfo.section_id}', '${stationInfo.mark}')`
  postgreSql.addData(sql, (searchData,err) => {
    if(err){
      res.send({
        data: {},
        msg: '保存失败',
      })
    }else{
      res.send({
        data: searchData,
        msg: '保存成功',
      })
    }

  })
})

// 根据id获取站点信息
app.post('/getStationInfoById', (req, res) => {
  let sql = "select * from t_station where id = " + req.body.id
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData[0],
      msg: '获取成功',
    })
  })
})

// 修改站点信息
app.post('/updateStationInfo', (req, res) => {
  let stationInfo = {
    id: req.body.id,
    name: req.body.stationName,
    section_id: req.body.sectionId,
    mark: req.body.mark,
  }
  let sql = `update t_station set name='${stationInfo.name}', section_id='${stationInfo.section_id}', mark='${stationInfo.mark}' where id = ${stationInfo.id}`
  postgreSql.updateData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '修改成功',
    })
  })
})
// 根据id 删除用户
app.post('/delStationInfo', (req, res) => {
  let sql = `delete from t_station where id = ` + req.body.id
  postgreSql.delData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '删除成功',
    })
  })
})
// ==================================站点信息管理页面 相关接口 结束===============================


// ==================================区域信息管理页面 相关接口 开始===============================
// 查询所有区域信息
app.post('/getAreaInfo', (req, res) => {
  let areaName = req.body.searchBO.areaName
  let sql = ''
  if(areaName) {
    sql = "select * from t_section where name like '%" + areaName + "%' order by id"
  }else{
    sql = "select * from t_section order by id"
  }
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '获取成功',
    })
  })
})

// 添加新区域
app.post('/addAreaInfo', (req, res) => {
  let AreaInfo = {
    areaName: req.body.areaName,
    mark: req.body.mark,
  }
  let sql = `INSERT INTO t_section (name, mark) VALUES ('${AreaInfo.areaName}', '${AreaInfo.mark}')`
  postgreSql.addData(sql, (searchData,err) => {
    if(err){
      res.send({
        data: {},
        msg: '保存失败',
      })
    }else{
      res.send({
        data: searchData,
        msg: '保存成功',
      })
    }

  })
})

// 根据id获取区域信息
app.post('/getAreaInfoById', (req, res) => {
  let sql = "select * from t_section where id = " + req.body.id
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData[0],
      msg: '获取成功',
    })
  })
})

// 修改区域信息
app.post('/updateAreaInfo', (req, res) => {
  let AreaInfo = {
    id: req.body.id,
    name: req.body.areaName,
    mark: req.body.mark,
  }
  let sql = `update t_section set name='${AreaInfo.name}',mark='${AreaInfo.mark}' where id = ${AreaInfo.id}`
  postgreSql.updateData(sql, (searchData,err) => {
    if(err){
      res.send({
        data: {},
        msg: '修改失败',
      })
    }else{
      res.send({
        data: searchData,
        msg: '修改成功',
      })
    }

  })
})
// 根据id 删除区域
app.post('/delAreaInfo', (req, res) => {
  let sql = `delete from t_section where id = ` + req.body.id
  postgreSql.delData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '删除成功',
    })
  })
})
// ==================================区域信息管理页面 相关接口 结束===============================



//addMinerInfo updateMinerInfo delMinerInfo getMinerInfo getMinerInfoById
// ==================================矿工信息管理 相关接口 开始===============================

//新增矿工
app.post('/addMinerInfo', (req, res) => {
  let param = {
    name: req.body.minerName,
    phone: req.body.phone,
    gender: req.body.gender,
    age: req.body.age || null,
    level: req.body.level,
    email: req.body.email,
    section_id: req.body.sectionId,
    mark: req.body.mark
  }
  
  let sql = `INSERT INTO public.t_miner
    (name, phone, gender, age, level, email, section_id, mark)
    VALUES ('${param.name}', '${param.phone}', '${param.gender}',
    ${param.age}, '${param.level}', '${param.email}',
    ${param.section_id}, '${param.mark}');
  `

  postgreSql.addData(sql, (searchData,err) => {
    if(err){
      res.send({
        data: {},
        msg: '保存失败',
      })
    }else{
      res.send({
        data: searchData,
        msg: '保存成功',
      })
    }
  })
})
//修改矿工
app.post('/updateMinerInfo', (req, res) => {
  let param = {
    id: req.body.id,
    name: req.body.minerName,
    phone: req.body.phone,
    gender: req.body.gender,
    age: req.body.age || null,
    level: req.body.level,
    email: req.body.email,
    section_id: req.body.sectionId,
    mark: req.body.mark
  }
  let sql = `
  UPDATE public.t_miner
  SET "name"='${param.name}', phone='${param.phone}',
  gender='${param.gender}', age=${param.age}, "level"='${param.level}',
  email='${param.email}', section_id=${param.section_id}, mark='${param.mark}'
  WHERE id=${param.id};
  `
  postgreSql.updateData(sql, (searchData,err) => {
    if(err){
      res.send({
        data: {},
        msg: '修改失败',
      })
    }else{
      res.send({
        data: searchData,
        msg: '修改成功',
      })
    }
  })
})
//删除矿工
app.post('/delMinerInfo', (req, res) => {

  let sql = `
    DELETE FROM public.t_miner
    WHERE id= ${req.body.id};
  `
  postgreSql.delData(sql, (searchData,err) => {
    res.send({
      data: searchData,
      msg: '删除成功',
    })
  })
})
//查询全部矿工
app.post('/getMinerInfo', (req, res) => {
  var name = req.body.searchBO.minerName
  let sql = ''
  if(name) {
    sql = `SELECT id, "name", phone, gender, age, "level", email, section_id, mark
      FROM public.t_miner
      WHERE "name" like  '%${name}%' order by id;
    `
  }else{
    sql = "select * from public.t_miner order by id"
  }
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '获取成功',
    })
  })
})
//根据ID查询矿工
app.post('/getMinerInfoById', (req, res) => {
  let sql = "select * from public.t_miner where id = " + req.body.id
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData[0],
      msg: '获取成功',
    })
  })
})
// ==================================矿工信息管理 相关接口 结束===============================


// ==================================考勤信息管理 相关接口 开始===============================

// 新增
app.post('/addAttendanceInfo', (req, res) => {
  let param = {
    name: req.body.attendanceName,
    date: req.body.dateValue,
    onworktime: req.body.underTime,
    offworktime: req.body.upTime,
  }
  let sql = `INSERT INTO public.t_attendance
    (miner_id, date, onworktime, offworktime)
    VALUES ('${param.name}', '${param.date}', '${param.onworktime}', '${param.offworktime}');
  `
  postgreSql.addData(sql, (searchData,err) => {
    if(err){
      res.send({
        data: {},
        msg: '保存失败',
      })
    }else{
      res.send({
        data: searchData,
        msg: '保存成功',
      })
    }
  })
})
// 修改
app.post('/updateAttendanceInfo', (req, res) => {
  let param = {
    id: req.body.id,
    miner_id: req.body.attendanceName,
    date: req.body.dateValue,
    onworktime: req.body.underTime,
    offworktime: req.body.upTime,
  }
  let sql = `
  UPDATE public.t_attendance
  SET miner_id='${param.miner_id}', date='${param.date}',
  onworktime='${param.onworktime}', offworktime='${param.offworktime}' where id=${param.id};
  `
  postgreSql.updateData(sql, (searchData,err) => {
    if(err){
      res.send({
        data: {},
        msg: '修改失败',
      })
    }else{
      res.send({
        data: searchData,
        msg: '修改成功',
      })
    }
  })
})
// 删除
app.post('/delAttendanceInfo', (req, res) => {

  let sql = `
    DELETE FROM public.t_attendance
    WHERE id= ${req.body.id};
  `
  postgreSql.delData(sql, (searchData,err) => {
    res.send({
      data: searchData,
      msg: '删除成功',
    })
  })
})
// 查询全部
app.post('/findAttendanceInfo', (req, res) => {
  var name = req.body.searchBO.attendanceName
  var startTime = req.body.searchBO.startTime.split(" ")[0]
  var endTime = req.body.searchBO.endTime.split(" ")[0]
  // abnormal normal all
  var statusValue = req.body.searchBO.statusValue

  let sql = ''
  if(name) {
    sql = `SELECT ta.id, "name",  miner_id, to_char("date",'yyyy-mm-dd') as "date", onworktime, offworktime,
    case when onworktime > '10:00:00' or  offworktime <'17:30:00' then 'abnormal' else 'normal' end as status
      FROM public.t_attendance ta left join  t_miner tm on ta.miner_id = tm.id
      where tm."name" like '%${name}%' and "date"  between '${startTime}' and '${endTime}' order by "date"
    `
    if(statusValue!='all') {
      sql = `select id, "name",  miner_id, "date", onworktime, offworktime,status from ( ` + sql + `) t where t.status='${statusValue}' order by t."date"`
    }

  }else{
    sql = `SELECT ta.id, "name",  miner_id, to_char("date",'yyyy-mm-dd') as "date", onworktime, offworktime,
    case when onworktime > '10:00:00' or  offworktime <'17:30:00' then 'abnormal' else 'normal' end as status
      FROM public.t_attendance ta left join  t_miner tm on ta.miner_id = tm.id
      where "date"  between '${startTime}' and '${endTime}' order by "date"
    `
    if(statusValue!='all') {
      sql = `select id, "name",  miner_id, "date", onworktime, offworktime,status from ( ` + sql + `) t where t.status='${statusValue}' order by t."date"`
    }
  }
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '获取成功',
    })
  })
})
// 根据ID查询
app.post('/getAttendanceInfoById', (req, res) => {
  let sql = `select id, miner_id, to_char("date",'yyyy-mm-dd') as "date", onworktime, offworktime from public.t_attendance where id =${req.body.id} `
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData[0],
      msg: '获取成功',
    })
  })
})
// ==================================考勤信息管理 相关接口 结束===============================


// ==================================本地历史位置 相关接口 开始===============================
// 获取position所有数据
app.post('/getPositionInfo', (req, res) => {
  let sql = ''
  var name = req.body.searchBO.minerName
  var startTime = req.body.searchBO.startTime.split(" ")[0]
  var endTime = req.body.searchBO.endTime.split(" ")[0]

  if(name) {
    sql = `
      SELECT p.id, miner_id,m.name as mine_name, date, pos10, time10, pos11, time11, pos12, time12, pos15, time15, pos16, time16, pos17, time17
      FROM t_position p left join t_miner m on p.miner_id=m.id
      where m."name" like '%${name}%' and "date"  between '${startTime}' and '${endTime}' order by "date"
    `
  }else{
    sql = `
      SELECT p.id, miner_id,m.name as mine_name, date, pos10, time10, pos11, time11, pos12, time12, pos15, time15, pos16, time16, pos17, time17
      FROM t_position p left join t_miner m on p.miner_id=m.id
      where "date"  between '${startTime}' and '${endTime}' order by "date"
    `
  }
  // sql = "SELECT p.id, miner_id,m.name as mine_name, date, pos10, time10, pos11, time11, pos12, time12, pos15, time15, pos16, time16, pos17, time17 FROM t_position p left join t_miner m on p.miner_id=m.id order by p.id"
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '获取成功',
    })
  })
})
// ==================================本地历史位置 相关接口 结束===============================




//加载最后时刻所有miner的信息
app.post('/readWorkers',  (req, res) => {
  let inputdate =req.body.date;
  let sql=`SELECT t_miner.id, t_miner.name,	t_miner.phone, t_miner.gender, t_miner.age, t_miner.level, t_miner.email, t_miner.section_id, t_miner.mark, t_position.pos10 FROM t_miner JOIN t_position ON t_miner.id = t_position.miner_id WHERE t_position.date = '${inputdate}' `;
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '获取成功',
    })
  })

});


//查找 一个特定miner的 所有 历史路径
app.post('/loadPathPositions',  (req, res) => {
  let input= [req.body.id];
  input[1] = req.body.date;

  let sql = `SELECT pos10, pos11, pos12, pos15, pos16, pos17, time10, time11, time12, time15, time16, time17 FROM t_position WHERE miner_id = ${input[0]} AND date = '${input[1]}'`;
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '获取成功',
    })
  })
});


app.post('/searchByName',(req, res, next) => {

  // const { input } = req.body.name; // 获取客户端传递过来的 input
  let input = req.body.name
  let inputdate =req.body.date;

  let sql=`SELECT t_miner.id, t_miner.name,	t_miner.phone, t_miner.gender, t_miner.age, t_miner.level, t_miner.email, t_miner.section_id, t_miner.mark, t_position.pos10 FROM t_miner JOIN t_position ON t_miner.id = t_position.miner_id WHERE t_miner.name = '${input}' and t_position.date = '${inputdate}' `;
  // let sql = `SELECT * FROM t_miner WHERE name = '${input}'`; // 拼接 SQL 语句
  postgreSql.searchData(sql, (searchData) => {
    res.send({
      data: searchData,
      msg: '获取成功',
    })
  })



  // const { input } = req.body; // 获取客户端传递过来的 input
  // // console.log("req.body.input"+req.body.input);
  // // console.log("req"+req);
  // // console.log("req.body"+req.body);
  // // console.log("input"+input);
  // let sql = 'SELECT * FROM t_miner WHERE name = ?'; // 拼接 SQL 语句
  // let result = await query(dbPool, sql, [input]); // 执行查询操作
  // res.send(result); // 将查询结果返回给客户端


});



//监听node服务器的端口号
app.listen(8090, () => {
	console.log('恭喜你，服务器启动成功')
})
