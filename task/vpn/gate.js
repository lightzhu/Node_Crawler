const Vpngate = require('../../mongoose/VpnGateModel.js')
const request = require('request')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const moment = require('moment')

const dealGate = function (str) {
  let $ = cheerio.load(str)
  let $mainTable = $('#vpngate_inner_contents_td>#vg_hosts_table_id')
  let $tableTr = $mainTable.find('tr')
  console.log("=====>>>>>>>")
  console.log($tableTr.length)
  let list = []
  $mainTable.find('tr').each(function (key, value) {
    let $tag = $(this)
      .find('td')
    if ($tag.eq(0).attr("class").indexOf('vg_table_row') != -1) {
      if ($tag.eq(5).html() != '') {
        let country = $tag.eq(0).text()
        let ddns = $tag.eq(1).find('span').eq(0).text()
        let ip = $tag.eq(1).find('span').eq(1).text()
        let consumer = $tag.eq(2).find('span').eq(0).text()
        let valid_time = $tag.eq(2).find('span').eq(1).text()
        let band_width = $tag.eq(3).find('b').eq(0).text()
        let ping = $tag.eq(3).find('b').eq(1).text()
        let type = $tag.eq(5).find('b').eq(0).text()
        console.log(band_width, ping, type)
        list.push({
          country,
          ddns,
          ip,
          consumer,
          valid_time,
          band_width,
          ping,
          type,
          date: moment(new Date()).format('YYYY-MM-DD HH:mm')
        })
      }
    }
  })
  return list
}

async function getVpnGateList(data) {
  // 获取vpngate 列表
  const browser = await puppeteer.launch({
    'args': [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const page = await browser.newPage()
  let list = []
  console.log('浏览器启动')
  try {
    await page.goto('https://www.vpngate.net/cn/', { timeout: 90000, waitUntil: 'domcontentloaded' })
    // console.log(page)
    let typeInput = '#C_L2TP'
    await page.waitFor(typeInput)
    await page.click('#C_SoftEther')
    await page.click('#C_OpenVPN')
    await page.click('#C_SSTP')
    let Button3 = 'input#Button3'
    await page.waitForSelector(Button3)
    const response = await Promise.all([
      page.waitForNavigation({ timeout: 90000, waitUntil: 'domcontentloaded' }), // The promise resolves after navigation has finished
      page.click(Button3), // 点击该链接将间接导致导航(跳转)
    ])
    let $mainTable = await page.$$('#vpngate_inner_contents_td>#vg_hosts_table_id tr')
    console.log($mainTable.length)
    for (let i = 0; i < $mainTable.length; i++) {
      let className = await page.$eval(`#vpngate_inner_contents_td >#vg_hosts_table_id tr:nth-of-type(${i + 1}) td:first-child`, el => el.getAttribute('class'))
      // console.log(className)
      if (className.indexOf('vg_table_row') != -1) {
        let trHtml = await page.$eval(`#vpngate_inner_contents_td >#vg_hosts_table_id tr:nth-of-type(${i + 1})`, el => el.outerHTML)
        // console.log(trHtml)
        let $ = cheerio.load(trHtml, {
          ignoreWhitespace: true,
          xmlMode: true
        })
        let $tag = $('td')
        if ($tag.eq(5).html() != '') {
          let country = $tag.eq(0).text()
          let ddns = $tag.eq(1).find('span').eq(0).text()
          let ip = $tag.eq(1).find('span').eq(1).text()
          let consumer = $tag.eq(2).find('span').eq(0).text()
          let valid_time = $tag.eq(2).find('span').eq(1).text()
          let band_width = $tag.eq(3).find('b').eq(0).text()
          let ping = $tag.eq(3).find('b').eq(1).text()
          let type = $tag.eq(5).find('b').eq(0).text()
          // console.log(band_width, ping, type)
          list.push({
            country,
            ddns,
            ip,
            consumer,
            valid_time,
            band_width,
            ping,
            type,
            date: moment(new Date()).format('YYYY-MM-DD HH:mm')
          })
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
  await browser.close()
  console.log(`浏览器关闭`)
  return list
}
function getVpnGateList2(data) {
  // 获取vpngate 列表
  let options = {
    method: 'get',
    url: 'https://www.vpngate.net/cn/'
  }
  return new Promise((reslove, reject) => {
    try {
      request(options, function (err, res) {
        if (err) {
          reject(err)
        } else {
          let data = dealGate(res.body.toString())
          reslove(data)
          // let $contentp = $('#Zoom>span')
          //   .eq(0)
          //   .find('p')
          //   .eq(0)
          // let $table = $('#Zoom table')
          // let movieDetail = new MovieDetail({
          //   title: item.title,
          //   id: item.id,
          //   postUrl: $contentp
          //     .find('img')
          //     .first()
          //     .attr('src'),
          //   content: $contentp.text(),
          //   type: item.type,
          //   btUrl: $table
          //     .find('tr')
          //     .first()
          //     .find('a')
          //     .text(),
          //   date: moment(new Date()).format('YYYY-MM-DD HH:mm')
          // })
          // console.log($)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = getVpnGateList
