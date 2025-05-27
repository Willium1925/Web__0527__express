var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 測試get和post請求
// GET請求
app.get('/GETtest0527', (req, res) => {
  res.send('GET 請求 received 0527');
});
// POST請求
app.post('/POSTtest0527', (req, res) => {
  res.send('POST 請求 received 0527');
});


// 透過get，回傳images內的圖片
// public/images資料夾下的圖片angry-knee.gif
app.get('/images0527', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'images', 'angry-knee.gif'));
    }
);


// get方法，/data0527
// 返回使用者輸入的資料，json格式，無論使用者輸入多少key value對，都會返回
// 若無輸入，則返回訊息 無資料
app.get('/data0527', (req, res) => {
  const data = req.query; // 獲取查詢參數
  if (Object.keys(data).length === 0) {
    return res.json({ message: '無資料' });
  }
  res.json(data);
});

// post方法，/data0527
app.use(express.json());
app.post('/data0527', (req, res) => {
  const data = req.body; // 獲取請求體中的資料
  if (Object.keys(data).length === 0) {
    return res.json({ message: '無資料' });
  }
  console.log(data);
  res.json('這是卡盃亞軍' + data.name);
});




// 測試get請求，配合res.json，輸出假資料
app.get('/customers0527', (req, res) => {
  const customers = [
    { id: 1, name: 'Customer A' },
    { id: 2, name: 'Customer B' },
    { id: 3, name: 'Customer C' }
  ];
  res.json(customers);
});


// 測試get請求，配合res.json，輸出資料庫northwind的customers表，真的連接資料庫
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  // host: 'host.docker.internal', // 不知為何無效
  port: 3306,
  user: 'root',
  password: '123456789',
  database: 'northwind'
});

app.get('/customers0527SQL', (req, res) => {
  connection.query('select * from customers', (error, results) => {
    if (error) {
      return res.status(500).json({
        error: '資料庫查詢失敗x',
        details: error.message, // 顯示錯誤訊息
        code: error.code,       // 顯示錯誤代碼
        errno: error.errno      // 顯示錯誤號
      });
    }
    res.json(results);
  });
});

// 測試get請求，抓取輸出資料庫northwind的customers表，將資料傳給customerlist.html
// 返回customerlist.html
app.get('/customerlist0527', (req, res) => {
  connection.query('select * from customers', (error, results) => {
    if (error) {
      return res.status(500).send('資料庫查詢失敗');
    }
    res.render('customerlist0527', { customers: results });
  });
});






app.use(logger('dev'));
// app.use(express.json()); 上移
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
