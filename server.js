"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");
var { nanoid } = require("nanoid");
var dns = require("dns");
var UrlModel = require("./models/url-model");
var urlPostHandler = require('./url-post-handler')

var app = express();
// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

// GET form for entering a URL
app.get("/api/shorturl/new", function(req, res) {
  res.sendFile(process.cwd() + "/views/url-form.html");
});

// Receive POST request, create a record in database, return a JSON record
app.post("/api/shorturl/new", urlPostHandler);

// GET short url and redirect to original url
app.get("/api/shorturl/:shortUrl", function(req, res) {
  UrlModel.findOne({ shortUrl: req.params.shortUrl }, "url", function(
    error,
    url
  ) {
    if (error) return new Error(error);
    res.redirect(url.url);
  });
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
