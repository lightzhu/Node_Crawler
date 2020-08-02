// const request = require('request')
// const axios = require('axios');
// const cheerio = require('cheerio')
const moment = require('moment')
const puppeteer = require('puppeteer')
const FreeSS = require('../../mongoose/FreeSS.js')
const { creatMd5String } = require('../../utils/index');

class Freev2ray {
  constructor(url) {
    this.dist = url
    this.list = []
  }
  dealData(data, type) {
    for (let i = 0; i < data.length; i++) {
      this.list.push(new FreeSS({
        country: data[i].name,
        id: data[i].id,
        url: data[i].url,
        md5: creatMd5String(data[i].url),
        type,
        create_time: data[i].create_time,
        update_time: moment(new Date()).format('YYYY-MM-DD HH:mm'),
      }))
    }
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
    this.list = this.list.filter((item) => {
      return !hadList.includes(item.md5)
    })
    console.log(this.list.length)
    if (this.list.length) {
      return new Promise((reslove, reject) => {
        FreeSS.insertMany(this.list, (err) => {
          if (err) {
            reject(err)
          } else {
            reslove(this.list)
          }
        })
      })
    }
    return res
  }
  async updateV2ray() {
    let urlList = this.dist
    // let urlList = ['https://api.free-ssr.xyz/ssr', 'https://api.free-ssr.xyz/v2ray']
    let types = ['ssr', 'vmess']
    const browser = await puppeteer.launch({
      'args': [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    })
    const page = await browser.newPage()
    for (let i = 0; i < urlList.length; i++) {
      let data = []
      try {
        await page.goto(urlList[i], { timeout: 90000, waitUntil: 'domcontentloaded' })
        const html = await page.$eval('body>pre', e => e.innerHTML)
        // console.log(html)
        data = JSON.parse(html)
        if (data.length) {
          this.dealData(data, types[i])
        }
      } catch (error) {
        console.log(error)
      }
    }
    await browser.close()
    let feed = await this.insetToTable()
    return feed
    // return new Promise(function (reslove, reject) {
    // axios.get('https://api.free-ssr.xyz/ssr', {
    //   headers: {
    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36'    //   }
    //   }
    // })
    //   .then(function (response) {
    //     console.log(response);
    //     reslove(9)
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    // request({
    //   method: 'get',
    //   url: 'https://api.free-ssr.xyz/ssr',
    //   headers: {
    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36'    //   }
    //   }
    // }, function (err, res) {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     reslove(9)
    //     console.log(res)
    //   }
    // })
    // })
  }
}
module.exports = Freev2ray
