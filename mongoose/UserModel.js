const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { USERDB } = require('../dbConfig.js')
const dbUser = mongoose.createConnection(USERDB, {
  useNewUrlParser: true
})
dbUser.on('error', console.error.bind(console, 'connection error:'))
dbUser.once('open', function() {
  // we're connected!
  console.log('用户数据库连接成功')
  //实体的实例化
})

//定义模式User_Schema
//{versionKey:false}是否建立文档的版本
let User_Schema = new Schema(
  {
    name: String,
    hobby: String,
    pwd: String,
    date: Date
  },
  {
    versionKey: false
  }
)
//定义模型user,注意数据库存的是users
let User = dbUser.model('users', User_Schema)
// 创建一个模型，这个模型对应数据库里的一个collection
module.exports = User
