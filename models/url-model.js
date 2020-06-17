var mongoose = require('mongoose');
// nanoid(x) generates a unique string of length 'x'
var { nanoid } = require('nanoid');

var Schema = mongoose.Schema;

var UrlModelSchema = new Schema({
  url: {type: String, unique: true },
  shortUrl: { type: String, default: nanoid(3) }
});

// var UrlModel
module.exports = mongoose.model('UrlModel', UrlModelSchema);
