const Router = require('koa-router')
const router = new Router()
const { dingTalkSign } = require('../utils/index');
const request = require('request')
const moment = require('moment')
const { gateTask, Shadowsock, Freev2ray } = require('../task/vpn/index.js')
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
function sendMsgToDingtalk(opts) {
  let timestamp = new Date().getTime()
  let hash = dingTalkSign(timestamp, secret)
  let url = `${webhook}&timestamp=${timestamp}&sign=${encodeURIComponent(hash)}`
  return new Promise((resolve, reject) => {
    request.post(url, opts, function (err, res) {
      if (err) {
        reject(err)
      } else {
        // console.log(res.body)
        resolve(res.body.errmsg)
      }
    })
  })
}
//更新vpngate站点列表
router.get('/update_vpngates', async ctx => {
  let atMobiles = []
  let list = await gateTask()
  let content = 'T^T L2TP方式最新VPN列表=>\n\n'
  let data = '暂无更新'
  if (list.length) {
    list.forEach((item) => {
      content += `国家:${item.country}带宽:${item.band_width} 时长:${item.valid_time} IP:${item.ip}\n`
    })
    options.json.text.content = content
    data = await sendMsgToDingtalk(options)
  }
  ctx.body = {
    code: 200,
    msg: '成功',
    data: data || 0
  }
})

//更新shadowsocks（来自telegram频道）列表
router.get('/update_shadowsocks', async ctx => {
  console.log(ctx.query.day)
  let shadowsocks = new Shadowsock(['https://t.me/s/ssrlist', 'https://t.me/s/sslist', 'https://t.me/s/v2list', 'https://t.me/s/ivmess'], ctx.query.day) //https://t.me/s/ssrlist  https://t.me/s/sslist https://t.me/s/v2list 'https://t.me/s/SSRSUB','https://t.me/s/freessrnode',
  let list = await shadowsocks.updateShadowsock()
  let data = '暂无更新'
  let content = 'T^T 最新免费节点列表=>\n\n'
  if (list.length) {
    list.forEach((item) => {
      content += `${item.url}\n\n`
    })
    options.json.text.content = content
    data = await sendMsgToDingtalk(options)
  }
  ctx.body = {
    code: 200,
    msg: '成功',
    data: data || 0
  }
})


//更新 https://free-ssr.xyz/ 网站列表
router.get('/update_freev2ray', async ctx => {
  let freev2ray = new Freev2ray(['https://api.free-ssr.xyz/ssr', 'https://api.free-ssr.xyz/v2ray'])
  let list = await freev2ray.updateV2ray()
  let content = 'T^T 最新免费节点列表=>\n\n'
  let data = '暂无更新'
  if (list.length) {
    list.forEach((item) => {
      content += `地区:${item.country} 更新时间:${item.update_time}${item.url}\n\n`
    })
    options.json.text.content = content
    data = await sendMsgToDingtalk(options)
  }
  ctx.body = {
    code: 200,
    msg: '成功',
    data: data || list.length
  }
})
module.exports = router
