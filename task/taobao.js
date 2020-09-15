const request = require('request')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const moment = require('moment')

const dytt8fn = function (str, item) {
  let $ = cheerio.load(str)
  let list = []
  $('.co_content8 ul table').each(function (key, value) {
    let $tag = $(this)
      .find('tr')
      .eq(1)
    let title = $tag
      .find('td')
      .eq(1)
      .find('a').eq(1)
      .text()
    let dist =
      item.host +
      $tag
        .find('td')
        .eq(1)
        .find('a').eq(1)
        .attr('href')
    let id = dist.replace(/[^0-9]/gi, '')
    let content = $tag
      .find('td')
      .eq(1)
      .find('a')
    list.push({
      id,
      title,
      type: item.type,
      category: item.category,
      dist,
      date: moment(new Date()).format('YYYY-MM-DD HH:mm'),
      content: ''
    })
  })
  return list
}
const login = 'https://login.taobao.com/member/login.jhtml?redirectURL=https%3A%2F%2Fdahanghai.taobao.com%2F%23%2Fchannel%2FadvertisingList'

const formData = {
  appName: 'taobao',
  fromSite: '0',
  umidToken: '5c674d8e1851ca5f8106a38e611b28783851cad5'
}
if (process.env.taobaoId) {
  formData.taobaoId = process.env.taobaoId
  formData.taobaoPwd = process.env.taobaoPwd
} else {
  const DB = require('../dbConfig')
  formData.taobaoId = DB.taobaoId
  formData.taobaoPwd = DB.taobaoPwd
}
function loginToDahanghai() {
  return new Promise(function (reslove, reject) {
    request.post({ url: 'https://login.taobao.com/newlogin/login.do', formData: formData }, (err, httpResponse, body) => {
      if (err) {
        reject(err)
        return console.error('登陆错误')
      }
      let TOKEN = ''
      console.log('---->', httpResponse.rawHeaders.length)
      httpResponse.rawHeaders.forEach(item => {
        if (item.startsWith('XSRF-TOKEN')) {
          console.log(item)
          TOKEN = (item.split(';'))[0]
        }
      })

      console.log('TOKEN is', TOKEN.split('=')[1])
      reslove(TOKEN.split('=')[1])
    })
  })
}

module.exports = {
  loginToDahanghai
}
