const crypto = require('crypto')
// 生成加密字符串
function dingTalkSign(timestamp, secret) {
  // const hash = crypto.createHmac('sha256', timestamp + "\n" + secret).digest('base64')
  const hmac = crypto.createHmac('sha256', secret)
  const hash2 = hmac.update(timestamp + '\n' + secret).digest('base64')
  // console.log(hash2)
  // console.log(hash)
  return hash2
}
function creatMd5String(content) {
  return crypto.createHash('md5').update(content).digest('base64')
}
function urlToplaintext(url) {
  let encodeStr = ''
  if (url.includes('<span')) {
    let index = url.indexOf('<span')
    url = url.slice(0, index)
  }
  if (url.includes('<a')) {
    let index = url.indexOf('<a')
    url = url.slice(0, index)
  }
  let obj = new Object()
  if (url.startsWith('ssr://')) {
    obj.type = 'ssr'
    encodeStr = url.slice(6)
    let decodeStr = new Buffer.from(encodeStr, 'base64').toString()
    let arr = decodeStr.split(':')
    obj.url = url
    obj.name = arr[0]
    obj.id = `${arr[0]}:${arr[1]}`
  } else if (url.startsWith('ss://')) {
    obj.type = 'ss'
    try {
      url = decodeURI(url)
    } catch (e) {
      url = url
    }
    // encodeStr = url.slice(5)
    let start = url.indexOf('@') + 1
    let end = url.indexOf('?')
    let decodeStr = url.slice(start, end)
    let arr = decodeStr.split(':')
    obj.url = url
    obj.name = arr[0]
    obj.id = `${arr[0]}:${arr[1]}`
  } else if (url.startsWith('vmess://')) {
    obj.type = 'vmess'
    try {
      url = decodeURI(url)
    } catch (e) {
      url = url
    }
    encodeStr = url.slice(8, url.indexOf('?'))
    let decodeStr = new Buffer.from(encodeStr, 'base64').toString()
    let arr = decodeStr.split(/[:@]/)
    obj.url = url
    obj.id = arr[1]
    // obj.name = arr[2]
    obj.name = `${arr[2]}:${arr[3]}`
  }

  return obj
}
module.exports = {
  dingTalkSign,
  creatMd5String,
  urlToplaintext
}