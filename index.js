const Koa = require('koa')
const path = require('path')
const compress = require('koa-compress')
const cors = require('koa-cors')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
const registerRouter = require('./routes/index.js')

let MAINDB = ''
// 将数据库链接信息设置到环境变量中去,防止暴露隐私信息
if (process.env.MAINDB) {
  MAINDB = process.env.MAINDB
} else {
  const DB = require('./dbConfig')
  MAINDB = DB.MAINDB
}
const mongoose = require('mongoose')

// 连接数据库
mongoose.connect(MAINDB, {
  useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('连接成功')
})

// 创建一个Koa对象表示web app本身:
const app = new Koa()
const static = serve(path.join(__dirname) + '/public/')
app.use(static)
// 启用gzip
const options = { threshold: 2048 }
app.use(compress(options))

//将数据库链接对象挂载到上下文
app.context.db = db;
app.use(
  cors({
    origin: function (ctx) {
      if (ctx.url === '/test') {
        return '*' // 允许来自所有域名请求
      }
      return 'https://www.2048888.xyz'
    },
    credentials: true
  })
)

app.use(bodyParser())
// 加载路由中间件
app.use(registerRouter())

// 在端口监听
const port = process.env.PORT || '8080'
app.listen(port)
console.log(`app started at port ${port}`)
