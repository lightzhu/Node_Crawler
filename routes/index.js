const path = require('path')
const Router = require('koa-router')
const router = new Router()
const User = require('../mongoose/UserModel.js')
const MovieDetail = require('../mongoose/MovieListModel.js')
router.get('/page', async ctx => {
  let html = `
    <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
    </ul>
  `
  ctx.body = 'fdsfsdfsd'
})
// 注册接口
router.post('/register', async (ctx, next) => {
  console.log(ctx.request.body)
  let light = new User({
    name: ctx.request.body.userName,
    pwd: ctx.request.body.pwd,
    hobby: ctx.request.body.hobby,
    date: Date.now()
  })
  let doc = await User.findOne({ name: ctx.request.body.userName }, function(
    err,
    docs
  ) {
    if (err) {
      console.log(err)
    }
  })
  if (doc) {
    ctx.body = {
      code: 200,
      msg: '用户名已存在！'
    }
    return false
  }
  let resp = await new Promise((resolve, reject) => {
    light.save(function(err, doc) {
      if (err) {
        reject(err)
      } else {
        resolve({
          code: 200,
          msg: '注册成功',
          user: ctx.request.body.userName
        })
      }
    })
  })
  ctx.body = resp
})
// 登陆接口
router.post('/login', async (ctx, next) => {
  // console.log(ctx.request.body);
  let name = ctx.request.body.userName
  let pwd = ctx.request.body.pwd
  await User.findOne({ name }, function(err, docs) {
    if (err) {
      console.log(err)
    } else {
      if (!docs) {
        ctx.body = {
          code: 200,
          msg: '用户名错误',
          statue: 1
        }
      } else {
        console.log(docs)
        if (pwd !== docs.pwd) {
          ctx.body = {
            code: 200,
            msg: '密码错误',
            statue: 2
          }
        } else {
          ctx.body = {
            code: 200,
            msg: '登陆成功！',
            statue: 0
          }
        }
      }
    }
  })
})

router.get('/get_movies', async ctx => {
  console.log(ctx.query)
  let page = parseInt(ctx.query.page)
  let size = parseInt(ctx.query.size)
  await MovieDetail.find(
    {},
    null,
    { sort: { type: -1 }, skip: 10 * page, limit: size },
    function(err, docs) {
      if (err) {
        ctx.body = {
          code: 202,
          msg: '获取数据失败'
        }
      } else {
        ctx.body = {
          code: 200,
          msg: '获取成功',
          data: docs
        }
      }
    }
  )
})
module.exports = router
