const Router = require('koa-router')
const router = new Router()
const sleep = require('sleep');
const { dytt8Task, btbtdyTask } = require('../task/movie/index.js')
function update() {
  return new Promise(function (reslove, reject) {
    // dytt8Task.run().then((data) => {
    //   sleep.sleep(3)

    // }).catch(error => {
    //   reject(error)
    // })
    btbtdyTask.run().then((data1) => {
      reslove(data1)
    }).catch(error => {
      reject(error)
    })
  })
}
//更新电影列表
router.get('/update_movies', async ctx => {
  // let data1 = await dytt8Task.run();
  // sleep.sleep(3)
  // let data2 = await btbtdyTask.run();
  let len = await update()
  console.log(len)
  ctx.body = {
    code: 200,
    msg: '成功',
    data: len
  }
})
module.exports = router
