const FreeSS = require('../../mongoose/FreeSS.js')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const moment = require('moment')
const { urlToplaintext, creatMd5String } = require('../../utils/index')

class Shadowsock {
  constructor(url, day) {
    this.day = day
    this.dist = url
    this.monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    this.list = []
    console.log(this.day)
    // this.date = `${this.monthList[now.getMonth()]} ${now.getDate}`
  }
  dealShadowsock(str, type) {
    let isNew = false
    let $ = cheerio.load(str)
    let ndate = new Date()
    let thisDay = `${this.monthList[ndate.getMonth()]} ${ndate.getDate() - this.day == 0 ? ndate.getDate() : ndate.getDate() - this.day}` //${ndate.getDate()}
    let $mainWrap = $('.tgme_channel_history .tgme_widget_message_wrap')
    console.log(thisDay)
    let allList = new Array()
    let sslist = []
    if ($mainWrap.length) {
      $mainWrap.each(function (key, value) {
        let $item = $(this)
        let $itemContent = $item.find('.tgme_widget_message_bubble .tgme_widget_message_text')
        let $itemFooter = $item.find('.tgme_widget_message_service_date')
        let $contentEnd = $item.find('.tgme_widget_message_bubble .tgme_widget_message_footer')
        if (thisDay == $itemFooter.text()) {
          console.log('今天的数据')
          isNew = true
        }
        // 只采集今天的数据
        if (isNew) {
          sslist = $itemContent.eq(0).html().split("<br><br>")
        }
        sslist = sslist.filter(item => {
          return typeof (item) == 'string'
        })
        let array = []
        sslist.forEach(item => {
          let ssInfo = urlToplaintext(cheerio.load(item).text())
          if (ssInfo.url) {
            array.push(
              new FreeSS({
                country: ssInfo.name,
                id: ssInfo.id,
                url: ssInfo.url,
                md5: creatMd5String(ssInfo.url),
                type: ssInfo.type,
                create_time: $contentEnd.find('a.tgme_widget_message_date time').attr('datetime'),
                update_time: moment(new Date()).format('YYYY-MM-DD HH:mm'),
              })
            )
          }
        })
        allList = [...allList, ...array]
      })
    }
    return allList
  }
  async insetToTable() {
    let res = false
    // 获取当前库里的ip列表
    let hadIPs = await FreeSS.find({}, { md5: 1 }, { limit: 2000 })
    let hadList = new Array()
    if (hadIPs.length) {
      hadIPs.forEach((item) => {
        hadList.push(item.md5)
      })
    }
    // console.log(this.list)
    this.list = this.list.filter((item) => {
      return !hadList.includes(item.md5)
    })
    if (this.list.length) {
      return new Promise((reslove, reject) => {
        FreeSS.insertMany(this.list, (err) => {
          if (err) {
            reject(err)
          } else {
            res = true
            reslove(this.list)
          }
        })
      })
    }
    return res
  }
  async updateShadowsock() {
    const browser = await puppeteer.launch({
      'args': [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    })
    const page = await browser.newPage()
    console.log('浏览器启动')
    if (typeof (this.dist) == 'string') {
      this.dist = [this.dist]
    }
    let urlList = this.dist
    for (let i = 0; i < urlList.length; i++) {
      try {
        await page.goto(urlList[i], { timeout: 90000, waitUntil: 'domcontentloaded' })
        // console.log(await page.content())
        let _list = this.dealShadowsock(await page.content())
        this.list = [...this.list, ..._list]
      } catch (error) {
        console.log(error)
      }
    }
    await browser.close()
    let feed = await this.insetToTable()
    return feed
  }
}
module.exports = Shadowsock
