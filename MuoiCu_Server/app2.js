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
  path: '.env2'
})

const emitter = new EventEmitter()
emitter.setMaxListeners(0)
process.setMaxListeners(0);

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

module.exports = app;
