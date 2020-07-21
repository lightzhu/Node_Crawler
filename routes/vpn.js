const Router = require('koa-router')
const router = new Router()
const sleep = require('sleep');
const { gateTask } = require('../task/vpn/index.js')
function gateRun() {
  return new Promise(function (reslove, reject) {
    dytt8Task.run().then((data) => {
      sleep.sleep(3)
      btbtdyTask.run().then((data1) => {
        reslove(data + data1)
      }).catch(error => {
        reject(error)
      })
    }).catch(error => {
      reject(error)
    })
  })
}
//更新电影列表
router.get('/get_vpngates', async ctx => {

  let data = await gateTask()
  // let len = await update()
  ctx.body = {
    code: 200,
    msg: '成功',
    data: data
  }
})
module.exports = router
