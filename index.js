const Koa = require('koa')
const compress = require('koa-compress')
const cors = require('koa-cors')
const path = require('path')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
const router = require('./routes/index.js')
const { MAINDB } = require('./dbConfig.js')
const mongoose = require('mongoose')
const movieTask = require('./task/movieTask.js')

// 连接数据库
mongoose.connect(MAINDB, {
  useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
  console.log('连接成功')
  //实体的实例化
})

// 创建一个Koa对象表示web app本身:
const app = new Koa()
// 启用gzip
const options = { threshold: 2048 }
app.use(compress(options))
app.use(cors())

const home = serve(path.join(__dirname) + '/public/')
app.use(home)
app.use(bodyParser())
// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())
// 在端口监听:
console.log(process.env.NODE_ENV)
const port = process.env.PORT || '8080'
app.listen(port)

// 开始任务
movieTask.run()

console.log(`app started at port ${port}`)
