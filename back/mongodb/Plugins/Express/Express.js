const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MYOSS = require('../../../utils/Oss');
const myOss = new MYOSS();

class ExpressList {
  constructor() {
    this.app = global.app;
    this.db = mongoose.createConnection(`mongodb://127.0.0.1:${global.mongoPort}/notes`, { useUnifiedTopology: true,  useNewUrlParser: true });

    // Express 数据结构 Schema
    this.ExpressSchema = new Schema({
      Title: String,
      Tag: [String],
      Desc: String,
      Content: String,
      CreatedTime: Date,
      IsDelete: false
    });

    // Express 数据 Model
    this.ExpressModel = this.db.model('expresslist', this.ExpressSchema);
  }

  /**
   * 查询 Express 列表
   */
  async FindList(conditions = {}, Size, Page) {
    const res = await this.ExpressModel.find(conditions)
      .sort({ _id: -1 }) // 根据插入数据的时间来排序，由近到远
      .skip(Number.parseInt(Page - 1) * Number.parseInt(Size))
      .limit(Number.parseInt(Size))
      .exec();
    return res;
  }

  /**
   * 查询 Express 列表总条数
   */
  async FindListCount(conditions = {}) {
    const count = await this.ExpressModel.find(conditions).countDocuments();
    return count;
  }

  /**
   * 新增 Express 列表Item
   */
  async InsertListItem(data = {}) {
    const ExpressModel = this.ExpressModel;
    const ExpressModelItem = new ExpressModel(data);
    const res = await ExpressModelItem.save();
    return res;
  }

  /**
   * 修改 Express 列表Item
   */
  async UpdateListItem(conditions = {}, updateData) {
    const res = await this.ExpressModel.updateOne(conditions, { $set: { ...updateData } })
    return res;
  }

  /**
   * 删除 Express 列表Item
   */
  async DeleteListItem (conditions = {}) {
    const res = await this.ExpressModel.deleteOne(conditions);
    return res;
  }

  /**
   * 获取 Express 列表Item
   */
  GetExpressList() {
    this.app.get('/api/getExpressList', (req, res, next) => {
      const {
        Size = 10,
        Page = 1,
        keyword = '',
        startTime = null,
        endTime = null
      } = req.query;
      
      const And = [];

      if (keyword) {
        And.push({
          // 关键字模糊搜索
          $or: [
            { Title: { $regex: keyword, $options: '$i' } },
            { Desc: { $regex: keyword, $options: '$i' } },
            { Tag: { $regex: keyword, $options: '$i' } },
            { Content: { $regex: keyword, $options: '$i' } },
          ]
        })
      }

      if (startTime && endTime) {
        And.push(...[
          {
            CreatedTime: {
              $gte: new Date(startTime + ' 00:00:00')
            }
          },
          {
            CreatedTime: {
              $lte: new Date(endTime + ' 23:59:59')
            }
          }
        ])
      }
      
      // 模糊搜索
      let conditions = And.length ? { $and: And } : {};

      this.FindListCount(conditions).then((count) => {
        this.FindList(conditions, Size, Page)
        .then((doc) => {
          res.send({
            result: doc,
            count,
            status: 0,
            msg: '查询列表成功'
          });
        })
        .catch((err) => {
          res.send({
            result: null,
            status: 400,
            msg: '查询列表失败'
          });
        })
      }).catch((err) => {
        res.send({
          result: null,
          status: 400,
          msg: '获取 Express 列表总条数失败'
        })
      })
    })
  }

  /**
   * 插入/更新单条数据
   */
  AddExpressListItem() {
    this.app.post('/api/insertExpressListItem', (req, res, next) => {
      const body = Object.assign(req.body, { CreatedTime: Date.now() });
      const _id = body.id;
      // _id 已存在则更新数据， 不存在则新增一条数据
      if (_id) {
        this.UpdateListItem({ _id }, body ).then((doc) => {
          res.send({
            result: null,
            status: 0,
            msg: '数据更新成功'
          })
        })
        .catch((err) => {
          res.send({
            result: null,
            status: 0,
            msg: '数据更新失败'
          })
        })
      } else {
        this.InsertListItem(body)
        .then(() => {
          res.send({
            result: null,
            status: 0,
            msg: '添加 Express 列表数据成功'
          })
        })
        .catch((err) => {
          res.send({
            result: null,
            status: 400,
            msg: '添加 Express 列表数据失败'
          })
        })
      }
    })
  }

  /**
   * 删除 Express 列表
   */
  DeleteExpressListItem () {
    this.app.get('/api/deleteExpressItem', (req, res, next) => {
      const _id = req.query.id;
      this.DeleteListItem({ _id })
        .then(() => {
          res.send({
            result: null,
            status: 0,
            msg: '删除数据成功'
          })
        })
        .catch((err) => {
          res.send({
            result: null,
            status: 0,
            msg: '删除数据失败'
          })
        })
    })
  }

  /**
   * 定时删除阿里云OSS对象上的多余图片文件（按块删除Dashboard/Fs等）
   */
  DeleteAliOssPhotos() {
    console.log('Express 阿里云OSS checking____________________________________________');
    let timer = null;
    // 设置定时器
    timer = setInterval(() => {
    // 查找对应数据库获取当前正在用的所有图片地址
    this.ExpressModel.find({}).then((doc) => {
      let mongodbPhotos = '';
      doc.map((i) => {
        mongodbPhotos += i.Content;
      });

      myOss.setBuckName('tanglihe-notes').then(() => {
        myOss.listDir('list-content/Express/').then((result) => {
          const OssHasPhotos = [];
          if (result.objects && result.objects.length) {
            result.objects.forEach((obj) => {
              OssHasPhotos.push(obj.name);
            });
            
            const unExist = OssHasPhotos.filter((item) => !mongodbPhotos.includes(item));
            console.log(unExist);
            myOss.deleteMulti(unExist).then(() => {
              console.log('Express 相关的多余图片已删除');
            })
          }
        })
      });
    });
    }, global.deleteOssPhotoTime);
  }

  start() {
    this.GetExpressList();
    this.AddExpressListItem();
    this.DeleteExpressListItem();
    this.DeleteAliOssPhotos();
  }
}

const expressList = new ExpressList();
expressList.start();