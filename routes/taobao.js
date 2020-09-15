const Router = require('koa-router')
const router = new Router()

const { loginToDahanghai } = require('../task/taobao.js')
//模拟淘宝登陆
router.get('/taobao_login', async ctx => {
  let res = await loginToDahanghai()
  ctx.body = {
    code: 200,
    msg: '成功',
    data: res
  }
})
module.exports = router
