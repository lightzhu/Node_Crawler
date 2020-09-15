const Router = require('koa-router')
const router = new Router()
const { dingTalkSign } = require('../utils/index');
const request = require('request')
const moment = require('moment')
const { loginToDahanghai } = require('../task/taobao.js')
// 钉钉群发消息URL 和 secret
let webhook = ''
let secret = ''
if (process.env.webhook && process.env.secret) {
  webhook = process.env.webhook
  secret = process.env.secret
} else {
  const config = require('../dbConfig')
  webhook = config.webhook
  secret = config.secret
}
let options = {
  headers: {
    "Content-Type": 'application/json;charset=utf-8'
  },
  json: {
    "msgtype": "text",
    "text": {
      "content": 'T^T 测试'
    },
    "at": {
      "atMobiles": [],
      "isAtAll": false
    }
  }
}
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
