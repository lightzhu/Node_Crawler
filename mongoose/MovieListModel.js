const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
let Movie_List_Schema = new Schema(
  {
    title: String,
    id: Number,
    btUrl: String,
    postUrl: String,
    content: String,
    type: String,
    date: Date
  },
  {
    versionKey: false
  }
);
let Movie = Model('movie_list', Movie_List_Schema);
// 创建一个模型，这个模型对应数据库里的一个collection
module.exports = Movie;
