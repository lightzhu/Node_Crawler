const Router = require('koa-router')
const router = new Router()
const { dingTalkSign } = require('../utils/index');
const request = require('request')
const { gateTask } = require('../task/vpn/index.js')
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
function sendMsgToDingtalk(opts) {
  let timestamp = new Date().getTime()
  let hash = dingTalkSign(timestamp, secret)
  let url = `${webhook}&timestamp=${timestamp}&sign=${encodeURIComponent(hash)}`
  return new Promise((resolve, reject) => {
    request.post(url, opts, function (err, res) {
      if (err) {
        reject(err)
      } else {
        console.log(res.body)
        resolve(res.body.errmsg)
      }
    })
  })
}
//更新电影列表
router.get('/update_vpngates', async ctx => {
  let atMobiles = []
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
        "atMobiles": atMobiles == null ? [] : atMobiles,
        "isAtAll": false
      }
    }
  }
  let list = await gateTask()
  let content = 'T^T L2TP方式VPN列表=>\n\n'
  list.forEach((item) => {
    content += `带宽：${item.band_width} 时长：${item.valid_time} IP：${item.ip}\n\n`
  })
  options.json.text.content = content
  let data = await sendMsgToDingtalk(options, list)
  ctx.body = {
    code: 200,
    msg: '成功',
    data: data || 0
  }
})
module.exports = router
