module.exports = {
  MAINDB: 'mongodb+srv://username:pwd@数据库.mongodb.net/tfboy?retryWrites=true&w=majority', // 数据库示例连接地址
  webhook: 'https://oapi.dingtalk.com/robot/send?access_token=yourtoken', /// 给钉钉发消息web钩子
  secret: 'SECe7aee18e3b63853d4a3682' // 给钉钉发消息的签名密钥
}
