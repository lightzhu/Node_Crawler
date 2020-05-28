const Movie = require('../../mongoose/MovieModel.js')
const MovieDetail = require('../../mongoose/MovieListModel.js')
const request = require('request')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer');
const sleep = require('sleep');
const iconv = require('iconv-lite')
const moment = require('moment')

const btbtdyfn = function (str, item) {
  let $ = cheerio.load(str)
  let list = []
  $('.list_su ul>li').each(function (key, value) {
    let $tag = $(this).find('.liimg>a')
    let title = $tag.attr('title')
    let url = $tag.attr('href')
    let id = url.replace(/[^0-9]/gi, '')
    let dist = `${item.host}/down/${id}-0-0.html`
    list.push({
      id,
      title,
      type: item.type,
      category: item.category,
      dist,
      date: moment(new Date()).format('YYYY-MM-DD HH:mm')
    })
  })
  return list
}
const movieSrc = {
  dist: 'http://www.btbtdy1.com/btfl/dy1.html',
  host: 'http://www.btbtdy1.com',
  type: 'target',
  charset: 'UTF-8',
  category: '1',
  deal: btbtdyfn
}
// 将不同的网页请求放到一个promise数组中
function getPageDetail(item) {
  return new Promise(function (resolve, reject) {
    request({ method: 'get', url: item.dist }, function (err, res) {
      if (err) {
        reject(err)
      } else {
        if (item.charset === 'gb2312') {
          resolve(item.deal(iconv.decode(res.body, 'gb2312'), item))
        } else {
          resolve(item.deal(res.body.toString(), item))
        }
      }
    })
  })
}

// async function updateMoviesList(data) {
//   // 根据最新的电影表获取电影信息及下载链接
//   const browser = await puppeteer.launch()
//   console.log('浏览器启动成功')
//   let movieDetailArr = []
//   let i = 0
//   while (i < data.length) {
//     let item = data[i]
//     const page = await browser.newPage()
//     await page.goto(item.dist)
//     await page.waitFor(1000);
//     let btUrl = ''
//     let content = ''
//     let postUrl = ''
//     try {
//       btUrl = await page.$eval('#video-down p:nth-of-type(2)', el => {
//         return el.innerHTML
//       })
//       content = await page.$eval('.side', el => el.innerText)
//       postUrl = await page.$eval('.side>a img', el => el.getAttribute('src'))
//     } catch (error) {
//       console.log(error)
//     }
//     if (btUrl !== '') {
//       movieDetailArr.push(new MovieDetail({
//         title: item.title,
//         id: item.id,
//         type: item.type,
//         postUrl,
//         content,
//         btUrl,
//         date: moment(new Date()).format('YYYY-MM-DD HH:mm')
//       }))
//     }
//     console.log('采集第一个页面成功')
//     sleep.sleep(1)
//     i++
//   }
//   await browser.close()
//   MovieDetail.insertMany(movieDetailArr, function (err, r) {
//     if (err) {
//       console.log(err)
//     }
//   });
// }

module.exports = {
  run: function () {
    // 所有数据源拿到之后更新电影表
    let newMovies = []
    return new Promise(function (reslove, reject) {
      getPageDetail(movieSrc)
        .then(result => {
          console.log(result)
          let titles = []
          Movie.find({}, { title: 1 }, (err, docs) => {
            if (err) {
              reject(err)
            } else {
              docs.forEach((item) => {
                titles.push(item.title)
              })
              result.forEach((item, index) => {
                if (!titles.includes(item.title)) {
                  newMovies.push(item)
                }
              })
              console.log(newMovies.length)
              reslove(newMovies.length)
              // if (newMovies.length) {
              //   Movie.insertMany(newMovies, (err, docs) => {
              //     if (err) {
              //       reject(err)
              //     } else {
              //       try {
              //         // updateMoviesList(docs)
              //         reslove(docs.length)
              //       } catch (error) {
              //         reject(error)
              //       }
              //     }
              //   })
              // } else {
              //   reslove(0)
              // }
            }
          })
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
