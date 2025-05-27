var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

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





// 測試get請求，配合res.json，輸出資料庫northwind的customers表
app.get('/customers0527', (req, res) => {
  const customers = [
    { id: 1, name: 'Customer A' },
    { id: 2, name: 'Customer B' },
    { id: 3, name: 'Customer C' }
  ];
  res.json(customers);
});

// 測試get請求，配合res.json，輸出資料庫northwind的orders表，真的連接資料庫
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




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
