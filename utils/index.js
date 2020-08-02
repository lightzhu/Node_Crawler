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
module.exports = {
  dingTalkSign,
  creatMd5String
}