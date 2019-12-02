const config = require('./config');
const express = require('express');
const app = express();
// 将应用示例放到全局上，供其他页面的使用，不用 module.exports 抛出去
global.app = app;
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // 支持 post 请求获取参数
const cookieParser = require('cookie-parser');

app.use(bodyParser.json()); // 支持 post 请求在 req.body 中获取 request payload 的参数
app.use(cookieParser());
// 应用托管根目录的静态文件
// app.use(express.static('./'));
app.use(express.static('./dist/'));
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// 全局拦截所有请求，做相关的操作
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// 入口index文件
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

// 连接数据库，数据库名称为 notes
mongoose.connect(`mongodb://127.0.0.1:${global.mongoPort}/notes`, { useNewUrlParser: true });

// 保存 mongodb 连接状态
const db = mongoose.connection;
// 监听连接数据库成功状态
db.on('connected', () => {
  console.log('MongoDB 连接成功!!!');
});

// 监听连接数据库失败状态
db.on('error', () => {
  console.log('MongoDB 连接失败!!!');
});

// 监听连接数据库断开状态
db.on('disconnected', () => {
  console.log('MongoDB 断开连接!!!');
});

// 启动相关接口
require('./mongodb/User/User');
require('./mongodb/Menu/Menu');
require('./mongodb/Dashboard/Dashboard');
require('./mongodb/Node/Fs');
require('./mongodb/Javascript/Es5');
require('./mongodb/Javascript/Es6');
require('./mongodb/Plugins/BaiduMap/BaiduMap');
require('./mongodb/Plugins/Echarts/Echarts');
require('./mongodb/Plugins/Express/Express');
require('./mongodb/Plugins/Webpack/Webpack');
require('./mongodb/Frames/Vue/Vue');
require('./mongodb/Frames/ElementUI/ElementUI');
require('./mongodb/Deploy/Eslint/Eslint');
require('./mongodb/Deploy/VueCli/VueCli');
require('./mongodb/Deploy/Tslint/Tslint');
require('./mongodb/DataBase/Mongodb/Mongodb');

require('./mongodb/Common/UploadContent.js');

require('./mongodb/Styles/Css/Css');
require('./mongodb/Styles/Less/Less');
require('./mongodb/Styles/Sass/Sass');

require('./mongodb/Html/Dom/Dom');

require('./mongodb/Server/Ubuntu/Ubuntu');
require('./mongodb/Server/Terminal/Terminal');
require('./mongodb/Algorithm/Algorithm');

// 应用监听端口
app.listen(9000, () => {
  console.log('server is running at http://127.0.0.1:9000/');
});
