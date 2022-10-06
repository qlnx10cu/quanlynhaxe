const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')
const EventEmitter = require('events').EventEmitter;
const hbs = require('express-handlebars').create({
  helpers: {
    format_tien: function (a) {
      return a.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })
    },
    log: function (a) {
      console.log("item", a)
    }
  }
});
const {
  normalizePort,
  onError,
  onListening
} = require('./lib/server')

require('dotenv').config({
  path: '.env'
})

const emitter = new EventEmitter()
emitter.setMaxListeners(0)

const config = require('./config');

const app = express();

let server = http.createServer(app);
let io = require('./lib/socket')(server);
app.io = io;
app.use(express.static('public'));
require('./lib/express')(app, logger, express, path, cookieParser, passport, hbs, cors, bodyParser);
require('./lib/passport')(passport);
require('./routes')(app);
require('./lib/zalo').init();

const port = normalizePort(config.port)
server.port = port;

server.listen(server.port);
server.on('error', onError.bind(server));
server.on('listening', onListening.bind(server));

require('./models/test');


const app2 = express();
let server2 = http.createServer(app2);
server2.port = normalizePort(config.portApp);
app2.use(function (req, res, next) {
  if (req.url.startsWith('/resources') || req.url.startsWith('/app.js')) {
    res.setHeader('Cache-Control', 'private')
  }
  next()
})
app2.use(express.static(__dirname + '/public'));
app2.use(function (req, res, next) {
  res.sendFile(__dirname + '/public/index.html')
});
server2.listen(server2.port);
server2.on('error', onError.bind(server2));
server2.on('listening', onListening.bind(server2));

module.exports = app;
