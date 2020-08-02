const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
let FreeSS_Schema = new Schema(
  {
    country: String,
    id: String,
    url: String,
    md5: String,
    type: String,
    create_time: String,
    update_time: String
  },
  {
    versionKey: false
  }
);
let FreeSS = Model('free_ssr', FreeSS_Schema);
module.exports = FreeSS;