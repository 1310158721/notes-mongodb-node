const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const multer  = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'mongodb/User/uploads' });
const Fs = require('../../utils/Fs');

// 阿里云OSS对象操作
const MYOSS = require('../../utils/Oss');
const myOss = new MYOSS();

// 用户相关的类
class User {
  constructor() {
    this.app = global.app;
    this.db = mongoose.createConnection(`mongodb://127.0.0.1:${global.mongoPort}/notes`, { useUnifiedTopology: true,  useNewUrlParser: true });

    // 用户数据结构 Schema
    this.UserSchema = new Schema({
      Account: String,
      Password: String,
      Phone: String,
      Desc: String,
      Avatar: String,
      Token: String
    })

    // 用户数据 Model
    this.UserModel = this.db.model('user', this.UserSchema);
  }

  /**
   * 查询是否已有注册的用户
   * .then 表示查询成功
   * .catch 表示查询失败
   */
  async IsUserExist(conditions = {}) {
    const res = await this.UserModel.findOne(conditions);
    return res;
  }

  /**
   * 插入用户注册的数据, 用 insertMany 方法来插入数据(也可以使用save)
   * .then 表示查询成功
   * .catch 表示查询失败
   */
  async InsertUser(data = {}) {
    const UserModel = this.UserModel;
    const UserItem = new UserModel(data);
    const res = await UserItem.save();
    return res;
  }

  /**
   * 更新用户信息
   */
  async UpdateUser(conditions, update) {
    const res = await this.UserModel.updateOne(conditions, update);
    return res;
  }

  /**
   * 用户注册接口
   */
  UserRegister() {
    this.app.post('/api/register', (req, res, next) => {
      // post 请求获取参数
      const { Account = '', Password = '', Phone = '', Desc = '', Avatar = '', Token = '' } = req.body;
      // 格式化数据
      const item = { Account, Password, Phone, Desc, Avatar, Token };
      // 查询注册用户是否已存在
      this.IsUserExist({ Account })
        // 查询成功
        .then((doc) => {
          // 是否存在注册用户
          if (doc) {
            res.send({
              result: null,
              status: 400,
              msg: '该用户已存在'
            })
          } else {
            // 插入单条数据
            this.InsertUser(item)
              .then(() => {
                res.send({
                  result: null,
                  status: 0,
                  msg: '注册成功'
                })
              })
              .catch(() => {
                res.send({
                  result: null,
                  status: 400,
                  msg: '用户注册失败'
                })
              })
          }
        })
        // 查询失败
        .catch(() => {
          res.send({
            result: null,
            status: 400,
            msg: '查询用户失败'
          })
        })
    })
  }

  /**
   * 用户登录接口
   */
  UserLogin() {
    this.app.get('/api/login', (req, res, next) => {
      const { Account, Password } = req.query;
      if (!Account || !Password) {
        res.send({
          result: null,
          status: 400,
          msg: '请输入账号和密码'
        })
        return false;
      }
      this.IsUserExist({ Account, Password })
        .then((doc) => {
          if (doc) {
            const { Token } = doc;
            res.cookie('Token', Token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 2) });
            res.send({
              result: null,
              status: 0,
              msg: '登录成功'
            })
          } else {
            res.send({
              result: null,
              status: 0,
              msg: '登录失败，暂无该用户'
            })
          }
        })
        .catch((err) => {
          res.send({
            result: null,
            status: 400,
            msg: err.message
          })
        })
    })
  }

  /**
   * 查询用户信息接口
   */
  GetUserInfo() {
    // 获取用户的Token来查询的
    this.app.get('/api/getUserInfos', (req, res, next) => {
      const Token = req.cookies.Token;
      if (!Token) {
        res.send({
          result: null,
          status: 500,
          msg: '用户已退出登录'
        })
      } else {
        this.IsUserExist({ Token })
          .then((doc) => {
            res.send({
              result: doc,
              status: 0,
              msg: '查询用户信息成功'
            })
          })
          .catch((err) => {
            res.send({
              result: null,
              status: 400,
              msg: '查询用户信息失败'
            })
          })
      }
    })
  }

  /**
   * 用户信息更新接口
   * @根据用户传来的Account参数更新
   */
  UpdateUserInfo() {
    this.app.post('/api/updateUserInfo', (req, res, next) => {
      const { Account } = req.body;
      this.IsUserExist({ Account })
        .then((doc) => {
          if (!doc) {
            res.send({
              result: null,
              status: 400,
              msg: '该用户不存在'
            })
          } else {
            this.UpdateUser({}, req.body)
              .then(() => {
                res.send({
                  result: null,
                  status: 0,
                  msg: '更新用户信息成功'
                })
              })
              .catch(() => {
                res.send({
                  result: null,
                  status: 0,
                  msg: '更新用户信息失败'
                })
              })
          }
        })
        .catch(() => {
          res.send({
            result: null,
            status: 400,
            msg: '用户信息查询失败'
          })
        })
    })
  }

  /**
   * 上传头像
   */
  uploadAvatar() {
    this.app.post('/api/uploadAvatar', upload.single('file'), (req, res, next) => {
      let file = req.file;
      // /**
      //  * originalname 原名
      //  * destination 上传后保存的文件夹
      //  * path 上传后保存的路径
      //  * size 文件的大小
      //  */
      const { originalname, destination, filename, size } = file;
  
      // 对文件大小做限制 1MB
      if (size >= 1024 * 1024) {
        res.send({
          result: null,
          status: 400,
          msg: '文件太大了'
        })
      } else {
        myOss.setBuckName('tanglihe-notes').then(() => {
          // 上传阿里云
          myOss.put(`${destination}/${filename}`, `Avatar/${filename}`)
          .then(data => {
            // 获取阿里云在线地址
            const url = data.res.requestUrls[0];
            // 删除本地文件夹内容
            Fs.deleteFolder(`${destination}`);
            // 接口返回信息
            res.send({
              result: {
                url,
                size
              },
              status: 0,
              msg: '上传成功'
            })
          }).catch((err) => {
            console.log(err);
          });
        });
      }
    })
  }

  /**
   * 定时删除阿里云OSS对象上的多余图片文件（按块删除Dashboard/Fs等）
   */
  DeleteAliOssPhotos() {
    console.log('Avatar 阿里云OSS checking____________________________________________');
    let timer = null;
    // 设置定时器
    timer = setInterval(() => {
      // 查找对应数据库获取当前正在用的所有图片地址
      this.UserModel.find({}).then((doc) => {
        let mongodbPhotos = '';
        doc.map((i) => {
          mongodbPhotos += i.Avatar;
        });

        myOss.setBuckName('tanglihe-notes').then(() => {
          myOss.listDir('Avatar/').then((result) => {
            const OssHasPhotos = [];
            if (result.objects && result.objects.length) {
              result.objects.forEach((obj) => {
                OssHasPhotos.push(obj.name);
              });
              
              const unExist = OssHasPhotos.filter((item) => !mongodbPhotos.includes(item));
              myOss.deleteMulti(unExist).then(() => {
                console.log('Avatar 相关的多余图片已删除');
              })
            }
          })
        });
      });
    }, global.deleteOssPhotoTime);
  }

  /**
   * 开启指定的 api 接口
   */
  start() {
    this.UserRegister();
    this.UserLogin();
    this.GetUserInfo();
    this.UpdateUserInfo();
    this.uploadAvatar();
    this.DeleteAliOssPhotos();
  }
}

const user = new User();
user.start();
