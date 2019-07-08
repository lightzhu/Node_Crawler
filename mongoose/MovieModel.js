const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
let Movie_Schema = new Schema(
  {
    title: String,
    id: Number,
    dist: String,
    content: String,
    category: String,
    type: String,
    date: Date
  },
  {
    versionKey: false
  }
);
let Movie = Model('movies', Movie_Schema);
// 创建一个模型，这个模型对应数据库里的一个collection
module.exports = Movie;
