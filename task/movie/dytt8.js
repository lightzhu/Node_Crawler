const Movie = require('../../mongoose/MovieModel.js')
const MovieDetail = require('../../mongoose/MovieListModel.js')
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
const movieSrc = [
  {
    dist: 'https://www.dygod.net/html/gndy/china/index.html',
    host: 'https://www.dygod.net',
    type: 'target',
    charset: 'gb2312',
    category: '2',
    deal: dytt8fn
  },
  {
    dist: 'https://www.dygod.net/html/gndy/rihan/index.html',
    host: 'https://www.dygod.net',
    type: 'target',
    charset: 'gb2312',
    category: '2',
    deal: dytt8fn
  },
  {
    dist: 'https://www.dygod.net/html/gndy/oumei/index.html',
    host: 'https://www.dygod.net',
    type: 'target',
    charset: 'gb2312',
    category: '2',
    deal: dytt8fn
  }
]
// 将不同的网页请求放到一个promise数组中
let promiseArr = []
movieSrc.forEach((item, key) => {
  let options = {
    method: 'get',
    url: item.dist
  }
  if (item.charset === 'gb2312') {
    options = {
      method: 'get',
      url: item.dist,
      encoding: null
    }
  }
  promiseArr.push(
    new Promise(function (resolve, reject) {
      try {
        request(options, function (err, res) {
          if (err) {
            // console.log(err)
            reject(err)
          } else {
            if (item.charset === 'gb2312') {
              resolve(item.deal(iconv.decode(res.body, 'gb2312'), item))
            } else {
              resolve(item.deal(res.body.toString(), item))
            }
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  )
})

function updateMoviesList(data) {
  // 根据最新的电影表获取电影信息及下载链接
  data.forEach(item => {
    let options = {
      method: 'get',
      url: item.dist,
      encoding: null
    }
    request(options, function (err, res) {
      if (err) {
        console.log(err)
      } else {
        let $ = cheerio.load(iconv.decode(res.body, 'gb2312'))
        let $contentp = $('#Zoom>span')
          .eq(0)
          .find('p')
          .eq(0)
        let $table = $('#Zoom table')
        let movieDetail = new MovieDetail({
          title: item.title,
          id: item.id,
          postUrl: $contentp
            .find('img')
            .first()
            .attr('src'),
          content: $contentp.text(),
          type: item.type,
          btUrl: $table
            .find('tr')
            .first()
            .find('a')
            .text(),
          date: moment(new Date()).format('YYYY-MM-DD HH:mm')
        })
        movieDetail.save((err, res) => {
          if (err) {
            // console.log(err)
          }
        })
      }
    })
  })
}

module.exports = {
  run: function () {
    // 所有数据源拿到之后更新电影表
    let movieList = [];
    let newMovies = []
    return new Promise(function (reslove, reject) {
      Promise.all(promiseArr)
        .then(result => {
          for (let i = 0; i < result.length; i++) {
            movieList = movieList.concat(result[i])
          }
          let movies = []
          // 去除重名
          movieList.forEach((item) => {
            if (movies.length == 0) {
              movies.push(item)
            } else {
              let had = false;
              for (let j = 0; j < movies.length; j++) {
                let mo = movies[j]
                if (item.title == mo.title) {
                  had = true;
                  break;
                }
              }
              if (!had) {
                movies.push(item)
              }
            }
          })
          let titles = []
          Movie.find({}, { title: 1 }, { sort: { date: 1 }, limit: 10000 }, (err, docs) => {
            if (err) {
              reject(err)
            } else {
              docs.forEach((item) => {
                titles.push(item.title)
              })
              movies.forEach((item, index) => {
                if (!titles.includes(item.title)) {
                  newMovies.push(item)
                }
              })
              console.log('电影天堂新电影个数:' + newMovies.length)
              if (newMovies.length) {
                Movie.insertMany(newMovies, (err, docs) => {
                  if (err) {
                    reject(err)
                  } else {
                    updateMoviesList(docs)
                    reslove(docs.length)
                  }
                })
              } else {
                reslove(0)
              }
            }
          })
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
