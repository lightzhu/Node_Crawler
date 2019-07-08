const Movie = require('../mongoose/MovieModel.js');
const MovieDetail = require('../mongoose/MovieListModel.js');
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const moment = require('moment');
const schedule = require('node-schedule');
let movieList = [];
let newMovies = [];
const btbttfn = function(str, item) {
  let $ = cheerio.load(str);
  let list = [];
  $('table.thread').each(function(key, value) {
    if (key > 1) {
      let title = $(this)
        .find('td')
        .eq(0)
        .find('a')
        .last()
        .text();
      let dist = $(this)
        .find('td')
        .eq(0)
        .find('a')
        .last()
        .attr('href');
      let id = $(this)
        .find('td.views')
        .find('span')
        .last()
        .attr('tid');
      let content = $(this)
        .find('td')
        .eq(0)
        .find('a');

      list.push({
        id,
        title,
        type: item.type,
        category: item.category,
        dist,
        date: moment(new Date()).format('YYYY-MM-DD HH:mm'),
        content
      });
    }
  });
  return list;
};
const btbtdyfn = function(str, item) {
  let $ = cheerio.load(str);
  let list = [];
  $('.list_su ul>li').each(function(key, value) {
    let $tag = $(this).find('.liimg>a');
    let title = $tag.attr('title');
    let dist = item.host + $tag.attr('href');
    let id = dist.replace(/[^0-9]/gi, '');
    let content = $tag;
    list.push({
      id,
      title,
      type: item.type,
      category: item.category,
      dist,
      date: moment(new Date()).format('YYYY-MM-DD HH:mm'),
      content
    });
  });
  return list;
};
const foxizyfn = function(str, item) {
  let $ = cheerio.load(str);
  let list = [];
  $('.panel-body .row>.col-md-6').each(function(key, value) {
    let $tag = $(this)
      .find('.info-sec')
      .eq(0);
    let title = $tag
      .find('a')
      .first()
      .text();
    let dist = $tag
      .find('a')
      .first()
      .attr('href');
    let id = dist.replace(/[^0-9]/gi, '');
    let content = $tag;
    list.push({
      id,
      title,
      type: item.type,
      category: item.category,
      dist,
      date: moment(new Date()).format('YYYY-MM-DD HH:mm'),
      content
    });
  });
  return list;
};
const dytt8fn = function(str, item) {
  let $ = cheerio.load(str);
  let list = [];
  $('.co_content8 ul table').each(function(key, value) {
    let $tag = $(this)
      .find('tr')
      .eq(1);
    let title = $tag
      .find('td')
      .eq(1)
      .find('a')
      .text();
    let dist =
      item.host +
      $tag
        .find('td')
        .eq(1)
        .find('a')
        .attr('href');
    let id = dist.replace(/[^0-9]/gi, '');
    let content = $tag
      .find('td')
      .eq(1)
      .find('a');
    list.push({
      id,
      title,
      type: item.type,
      category: item.category,
      dist,
      date: moment(new Date()).format('YYYY-MM-DD HH:mm'),
      content
    });
  });
  return list;
};
const movieSrc = [
  {
    dist: 'http://www.btbtdy.me/btfl/dy1.html',
    host: 'http://www.btbtdy.me',
    type: 'target',
    charset: 'UTF-8',
    category: '1',
    deal: btbtdyfn
  },
  {
    dist: 'https://www.dytt8.net/html/gndy/dyzz/index.html',
    host: 'https://www.dytt8.net',
    type: 'target',
    charset: 'gb2312',
    category: '2',
    deal: dytt8fn
  },
  // {
  //   dist: 'https://www.foxizy.com/hot/hot_movie.html',
  //   host: 'https://www.foxizy.com',
  //   type: 'target',
  //   charset: 'UTF-8',
  //   category: '3',
  //   deal: foxizyfn
  // }
  {
    dist: 'http://www.1btbtt.com',
    host: 'http://www.1btbtt.com',
    type: 'blank',
    charset: 'UTF-8',
    category: '0',
    deal: btbttfn
  }
];
// 将不同的网页请求放到一个promise数组中
let promiseArr = [];
movieSrc.forEach((item, key) => {
  let options = {
    method: 'get',
    url: item.dist
  };
  if (item.charset === 'gb2312') {
    options = {
      method: 'get',
      url: item.dist,
      encoding: null
    };
  }
  promiseArr.push(
    new Promise(function(resolve, reject) {
      request(options, function(err, res) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          if (item.charset === 'gb2312') {
            resolve(item.deal(iconv.decode(res.body, 'gb2312'), item));
          } else {
            resolve(item.deal(res.body.toString(), item));
          }
        }
      });
    })
  );
});

function updateMoviesList(data) {
  // 根据最新的电影表获取电影信息及下载链接
  // console.log(data);
  data.forEach(item => {
    let options = {
      method: 'get',
      url: item.dist //item.dist
    };
    if (item.type === 'blank') {
      request(options, function(err, res) {
        if (err) {
          console.log(err);
        } else {
          let $ = cheerio.load(res.body.toString());
          let $contentp = $('.post_td .message').find('p');
          let content = '';
          $contentp.each(function(key, value) {
            if (
              $(this)
                .text()
                .indexOf('简介') != -1
            ) {
              content =
                $(this).text() +
                $(this)
                  .next()
                  .text();
            }
          });
          let movie = new MovieDetail({
            title: item.title,
            id: item.id,
            postUrl: $('.post_td .message')
              .find('img')
              .eq(0)
              .attr('src'),
            content,
            type: item.type,
            btUrl: item.dist,
            date: moment(new Date()).format('YYYY-MM-DD HH:mm')
          });
          movie.save((err, res) => {
            if (err) {
              console.log(err);
            } else {
            }
          });
        }
      });
    } else {
      if (item.category == '2') {
        //2
        options = {
          method: 'get',
          url: item.dist,
          encoding: null
        };
        request(options, function(err, res) {
          if (err) {
            console.log(err);
          } else {
            let $ = cheerio.load(iconv.decode(res.body, 'gb2312'));
            let $contentp = $('#Zoom>span')
              .eq(0)
              .find('p')
              .eq(0);
            let $table = $('#Zoom table');
            let movie = new MovieDetail({
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
            });
            movie.save((err, res) => {
              if (err) {
                console.log(err);
              } else {
              }
            });
          }
        });
      } else if (item.category == '1') {
        // 1
        request(options, function(err, res) {
          if (err) {
            console.log(err);
          } else {
            let $ = cheerio.load(res.body.toString());
            request(`http://www.btbtdy.me/vidlist/${item.id}.html`, function(
              err,
              res2
            ) {
              if (err) {
              } else {
                let $2 = cheerio.load(res2.body.toString());
                let btUrl = $2('.p_list_02 a.d1')
                  .eq(0)
                  .attr('href');
                let $contentp = $('.play .vod');
                let content = $contentp.find('.vod_intro .c05').text();
                let movie = new MovieDetail({
                  title: item.title,
                  id: item.id,
                  postUrl: $contentp.find('.vod_img>img').attr('src'),
                  content,
                  type: item.type,
                  btUrl,
                  date: moment(new Date()).format('YYYY-MM-DD HH:mm')
                });
                movie.save((err, res) => {
                  if (err) {
                    console.log(err);
                  } else {
                  }
                });
              }
            });
          }
        });
      } else if (item.category == '3') {
        request(options, function(err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log(res);
            let $ = cheerio.load(iconv.decode(res.body, 'gb2312'));
            // let $ = cheerio.load(res.body.toString());
            let $content = $('#introduce-content');
            // console.log($content.html());
            let title = $content
              .find('.info-sec')
              .first()
              .find('.title-wrapper')
              .eq(0)
              .text();
            let url = $('#introduce-content .thumbnail')
              .eq(0)
              .find('img')
              .first()
              .attr('src');
            let $table = $('#Zoom table');
            // console.log(title, url);
            // let movie = new MovieDetail({
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
            // });
            // movie.save((err, res) => {
            //   if (err) {
            //     console.log(err);
            //   } else {
            //   }
            // });
          }
        });
      }
    }
  });
}

module.exports = {
  run: function() {
    var rule = new schedule.RecurrenceRule();
    // 执行的时间间隔
    // var times = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
    // rule.minute = times;
    var hours = [1, 6, 12, 18]; // 一天运行三次
    rule.hour = hours;
    schedule.scheduleJob(rule, function() {
      // console.log(promiseArr.length);
      // 所有数据源拿到之后更新电影表
      Promise.all(promiseArr)
        .then(result => {
          console.log('完成');
          for (let i = 0; i < result.length; i++) {
            movieList = movieList.concat(result[i]);
          }
          Movie.deleteMany({}).then(() => {
            Movie.insertMany(movieList, (err, res) => {
              if (err) {
                console.log(err);
              } else {
                // console.log(res);
                newMovies = res;
                MovieDetail.deleteMany({}).then(() => {
                  updateMoviesList(res);
                });
              }
            });
          });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }
};
