var dns = require("dns");
var UrlModel = require("./models/url-model.js");
var { nanoid } = require("nanoid");

function urlFormatCheck(url) {
  var regex = /https?:\/\//;
  if (!regex.test(url)) return; // INCORRECT URL FORMAT
  var tempUrl = url.slice(url.indexOf("//") + 2);
  var path = tempUrl.indexOf("/");
  // return DOMAIN for checking with dns e.g. 'glitch.com'
  return path < 0 ? tempUrl : tempUrl.slice(0, path);
}

async function url_post_handler(req, res, next) {
  var urlFormat = urlFormatCheck(req.body.url);
  if (!urlFormat) {
    return res.json({ Error: "Incorrect URL format" });
  }
  var urlInDB = await UrlModel.exists({ url: req.body.url });
  if (urlInDB) {
    return res.json({ Error: "That URL is already shortened!" });
  }
  try {
    var urlDomainValid = await dns.promises.lookup(urlFormat);
    if (urlDomainValid) {
      var shortenUrl = new UrlModel({
        url: req.body.url,
        shortUrl: nanoid(3)
      });
      var shortUrl = await shortenUrl.save();

      return res.json(shortUrl);
    }
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      return res.json({ Error: "That URL is INVALID!" });
    }
    next(error);
  }
}

module.exports = url_post_handler;
