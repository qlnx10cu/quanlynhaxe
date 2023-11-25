const APIRouter = require('./Api');
const AccountRouter = require('./Account');
const CustomerRouter = require('./Customer');
const SalaryRouter = require('./Salary');
const EmpoyeeRouter = require('./Employee')
const HistoryCallRouter = require('./HistoryCall')
const ChamSocRouter = require('./ChamSoc')
const ItemRouter = require('./Item');
const ItemPartRouter = require('./ItemPart');
const ItemAccessaryRouter = require('./ItemAccessary');
const BillRouter = require('./Bill');
const BillleRouter = require('./BillLe');
const BillSuaChuaRouter = require('./BillSuachua');
const StatisticRouter = require('./Statistic');
const ChamCongRouter = require('./ChamCong');
const CuaHangNgoaiRouter = require('./CuaHangNgoai');


const screenshot = require('screenshot-desktop')
const createError = require('http-errors');
const logger = require("../lib/logger");
const LiftTable = require('../controllers/LiftTable');
module.exports = (app) => {

  app.use(function (req, res, next) {
    req.start = Date.now();
    req.fullUrl = req.method + " " + req.protocol + '://' + req.get('host') + req.originalUrl;
    logger.info(req.fullUrl +" with:"+ req.start);
    next();
  });
  LiftTable(app.io);
  app.use('/api', APIRouter);
  app.use('/account', AccountRouter);
  app.use('/customer', CustomerRouter);
  app.use('/salary', SalaryRouter);
  app.use('/employee', EmpoyeeRouter);
  app.use('/chamsoc', ChamSocRouter);
  app.use('/historycall', HistoryCallRouter);
  app.use('/item', ItemRouter);
  app.use('/itempart', ItemPartRouter);
  app.use('/itemaccessary', ItemAccessaryRouter);
  app.use('/bill', BillRouter);
  app.use('/billle', BillleRouter);
  app.use('/billsuachua', BillSuaChuaRouter);
  app.use('/statistic', StatisticRouter);
  app.use('/chamcong', ChamCongRouter);
  app.use('/cuahangngoai', CuaHangNgoaiRouter);

  app.get('/capture', function (req, res) {
    if (req.query.token != 'thaonk') {
      res.send({ 'status': 404 });
      return;
    }
    screenshot({ format: 'png' }).then((img) => {
      res.setHeader('Content-Type', 'image/png');
      res.send(img);
    }).catch((err) => {
      res.send({ 'status': 404, err: String(err) });
    })
  });



  app.use(function (req, res, next) {
    next(createError(404));
  });
  app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.statusCode || 500).json({
      error: {
        message: err.message
      }
    })
  });
}