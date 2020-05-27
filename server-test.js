const Koa = require('koa')
const path = require('path')
const serve = require('koa-static')
// 创建一个Koa对象表示web app本身:
const app = new Koa()

const home = serve(path.join(__dirname) + '/public/')
app.use(home)
// 在端口监听:
const port = '8089'
app.listen(port)

console.log(`app started at port ${port}`)
