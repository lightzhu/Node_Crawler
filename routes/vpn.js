const Router = require('koa-router')
const router = new Router()
const sleep = require('sleep');
const { gateTask } = require('../task/vpn/index.js')
//更新电影列表
router.get('/update_vpngates', async ctx => {
  let data = await gateTask()
  ctx.body = {
    code: 200,
    msg: '成功',
    data: data
  }
})
module.exports = router
