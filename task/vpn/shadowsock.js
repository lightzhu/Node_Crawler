const Vpngate = require('../../mongoose/VpnGateModel.js')
const request = require('request')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const moment = require('moment')

class Shadowsock {
  constructor(url) {
    this.dist = url
    this.list = []
  }
  dealShadowsock(str) {
    let $ = cheerio.load(str)
    let $mainTable = $('#tbss')
    let $tableTr = $mainTable.find('tbody tr')
    console.log("=====>>>>>>>")
    console.log($tableTr.length)
    let list = []
    // $mainTable.find('tr').each(function (key, value) {
    //   let $tag = $(this)
    //     .find('td')
    //   if ($tag.eq(0).attr("class").indexOf('vg_table_row') != -1) {
    //     if ($tag.eq(5).html() != '') {
    //       let country = $tag.eq(0).text()
    //       let ddns = $tag.eq(1).find('span').eq(0).text()
    //       let ip = $tag.eq(1).find('span').eq(1).text()
    //       let consumer = $tag.eq(2).find('span').eq(0).text()
    //       let valid_time = $tag.eq(2).find('span').eq(1).text()
    //       let band_width = $tag.eq(3).find('b').eq(0).text()
    //       let ping = $tag.eq(3).find('b').eq(1).text()
    //       let type = $tag.eq(5).find('b').eq(0).text()
    //       console.log(band_width, ping, type)
    //       list.push({
    //         country,
    //         ddns,
    //         ip,
    //         consumer,
    //         valid_time,
    //         band_width,
    //         ping,
    //         type,
    //         date: moment(new Date()).format('YYYY-MM-DD HH:mm')
    //       })
    //     }
    //   }
    // })
    return list
  }

  async updateShadowsock() {
    const browser = await puppeteer.launch({
      'args': [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--enable-automation'
      ]
    })
    const page = await browser.newPage()
    let list = []
    console.log('浏览器启动')
    // let list = []
    let options = {
      method: 'get',
      url: this.dist  // 'https://free-ss.site/'
    }
    console.log('开始')
    // return new Promise(function (resolve, reject) {
    //   try {
    //     request(options, function (err, res) {
    //       if (err) {
    //         console.log(err)
    //         reject(err)
    //       } else {
    //         console.log(res)
    //         resolve(this.dealShadowsock.deal(res.body.toString()))
    //       }
    //     })
    //   } catch (error) {
    //     reject(error)
    //   }
    // })
    try {
      await page.goto(this.dist, { timeout: 90000, waitUntil: 'load' })


      await page.waitFor(1000);
      let className = await page.$eval('#tbss', el => el.outerHTML)
      // let $mainTable = await page.$$('#tbss_wrapper #tbss>tbody>tr')
      console.log(className)
      // let typeInput = '#C_L2TP'
      // await page.waitFor(typeInput)
      // await page.click('#C_SoftEther')
      // await page.click('#C_OpenVPN')
      // await page.click('#C_SSTP')
      // let Button3 = 'input#Button3'
      // await page.waitForSelector(Button3)
      // const response = await Promise.all([
      //   page.waitForNavigation({ timeout: 90000, waitUntil: 'domcontentloaded' }), // The promise resolves after navigation has finished
      //   page.click(Button3), // 点击该链接将间接导致导航(跳转)
      // ])
      // // 获取当前库里的ip列表
      // let hadIPs = await Vpngate.find({}, { ip: 1 }, { limit: 2000 })
      // let hadIP = new Array()
      // if (hadIPs.length) {
      //   hadIPs.forEach((item) => {
      //     hadIP.push(item.ip)
      //   })
      // }
      // let $mainTable = await page.$$('#vpngate_inner_contents_td>#vg_hosts_table_id tr')
      // console.log($mainTable.length)
      // for (let i = 0; i < $mainTable.length; i++) {
      //   let className = await page.$eval(`#vpngate_inner_contents_td >#vg_hosts_table_id tr:nth-of-type(${i + 1}) td:first-child`, el => el.getAttribute('class'))
      //   if (className.indexOf('vg_table_row') != -1) {
      //     let trHtml = await page.$eval(`#vpngate_inner_contents_td >#vg_hosts_table_id tr:nth-of-type(${i + 1})`, el => el.outerHTML)
      //     // console.log(trHtml)
      //     let $ = cheerio.load(trHtml, {
      //       ignoreWhitespace: true,
      //       xmlMode: true
      //     })
      //     let $tag = $('td')
      //     if ($tag.eq(5).html() != '') {
      //       let country = $tag.eq(0).text()
      //       let ddns = $tag.eq(1).find('span').eq(0).text()
      //       let ip = $tag.eq(1).find('span').eq(1).text()
      //       let consumer = $tag.eq(2).find('span').eq(0).text()
      //       let valid_time = $tag.eq(2).find('span').eq(1).text()
      //       let band_width = $tag.eq(3).find('b').eq(0).text()
      //       let ping = $tag.eq(3).find('b').eq(1).text()
      //       let type = $tag.eq(5).find('b').eq(0).text()
      //       // 去重
      //       if (hadIP.indexOf(ip) == -1) {
      //         list.push(
      //           new Vpngate({
      //             country,
      //             ddns,
      //             ip,
      //             consumer,
      //             valid_time,
      //             band_width,
      //             ping,
      //             type,
      //             date: moment(new Date()).format('YYYY-MM-DD HH:mm')
      //           })
      //         )
      //       }
      //     }
      //   }
      // }
    } catch (error) {
      console.log(error)
    }
    console.log('关闭')
    await browser.close()
    //   if (list.length > 0) {
    //     Vpngate.insertMany(list, function (err, r) {
    //       if (err) {
    //         console.log(err)
    //       }
    //     })
    //   }
    //   return list
    // }
  }
}
module.exports = Shadowsock
