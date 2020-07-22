const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
let Gate_Schema = new Schema(
  {
    country: String,
    ddns: String,
    ip: String,
    consumer: String,
    valid_time: String,
    band_width: String,
    ping: String,
    type: String,
    date: String
  },
  {
    versionKey: false
  }
);
let Vpngate = Model('vpngate', Gate_Schema);
module.exports = Vpngate;