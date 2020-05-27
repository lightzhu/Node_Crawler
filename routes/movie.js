const Router = require('koa-router')
const router = new Router()
const movieTask = require('../task/movieTask.js')
function update() {
  return new Promise(function (reslove, reject) {
    setTimeout(() => {
      movieTask.run()
      reslove()
    }, 100)
  })
}
//更新电影列表
router.get('/update_movies', async ctx => {
  await update()
  ctx.body = {
    code: 200,
    msg: '成功'
  }
})
module.exports = router
