// const request = require('request')
const axios = require('axios');
const cheerio = require('cheerio')
const moment = require('moment')
// const puppeteer = require('puppeteer')
const FreeSS = require('../../mongoose/FreeSS.js')
const { creatMd5String } = require('../../utils/index');

class GithubFree {
  constructor(url) {
    this.dist = url
    this.list = []
    this.create_time = ''
  }
  dealData(data, type) {
    // console.log(data)
    for (let i = 0; i < data.length; i++) {
      this.list.push(new FreeSS({
        country: 'no msg',
        id: 'no msg',
        url: data[i],
        md5: creatMd5String(data[i]),
        type,
        create_time: this.create_time,
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
    // console.log(this.list)
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
  getGitfree() {
    let urlList = this.dist
    let that = this
    return new Promise(function (reslove, reject) { //'https://github.com/freefq/free'
      axios.get(urlList, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36'
        }
      })
        .then((response) => {
          // console.log(response.data);
          let $ = cheerio.load(response.data)
          // 获取更新时间
          that.create_time = $('#readme .Box-body p').filter(function (i, el) {
            // this === el
            return $(this).text().indexOf('更新时间') != -1;
          }).eq(0).text().replace('更新时间', '').trim() || ''
          // 处理ssr资源
          let $ssrTable = $('#readme .Box-body #user-content-ssr').parent()
          let data = $ssrTable.next().html()
          // console.log($ssrTable.text());
          let list = that.dealData(data.split('<br>').map(item => item.trim()).filter(item => !item.startsWith("trojan:")), $ssrTable.text())
          // 处理v2ray资源
          let $v2rayTable = $('#readme .Box-body #user-content-v2ray').parent()
          // console.log($v2rayTable.text());
          that.dealData(
            $v2rayTable.next().html().split('<br>').map(item => item.trim()).filter(item => !item.startsWith("trojan:")),
            $v2rayTable.text()
          )
          reslove(that.list)
        })
        .catch(function (error) {
          console.log(error);
        });
    })
  }
  async updateGitfree() {
    await this.getGitfree()
    let feed = await this.insetToTable()
    return feed
  }
}
module.exports = GithubFree
