const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MYOSS = require('../../utils/Oss');
const myOss = new MYOSS();

class Es6List {
  constructor() {
    this.app = global.app;
    this.db = mongoose.createConnection(`mongodb://127.0.0.1:${global.mongoPort}/notes`, { useUnifiedTopology: true,  useNewUrlParser: true });

    // Es6 数据结构 Schema
    this.Es6Schema = new Schema({
      Title: String,
      Tag: [String],
      Desc: String,
      Content: String,
      CreatedTime: Date,
      IsDelete: false
    });

    // Es6 数据 Model
    this.Es6Model = this.db.model('es6list', this.Es6Schema);
  }

  /**
   * 查询 Es6 列表
   */
  async FindList(conditions = {}, Size, Page) {
    const res = await this.Es6Model.find(conditions)
      .sort({ _id: -1 }) // 根据插入数据的时间来排序，由近到远
      .skip(Number.parseInt(Page - 1) * Number.parseInt(Size))
      .limit(Number.parseInt(Size))
      .exec();
    return res;
  }

  /**
   * 查询 Es6 列表总条数
   */
  async FindListCount(conditions = {}) {
    const count = await this.Es6Model.find(conditions).countDocuments();
    return count;
  }

  /**
   * 新增 Es6 列表Item
   */
  async InsertListItem(data = {}) {
    const Es6Model = this.Es6Model;
    const Es6ModelItem = new Es6Model(data);
    const res = await Es6ModelItem.save();
    return res;
  }

  /**
   * 修改 Es6 列表Item
   */
  async UpdateListItem(conditions = {}, updateData) {
    const res = await this.Es6Model.updateOne(conditions, { $set: { ...updateData } })
    return res;
  }

  /**
   * 删除 Es6 列表Item
   */
  async DeleteListItem (conditions = {}) {
    const res = await this.Es6Model.deleteOne(conditions);
    return res;
  }

  /**
   * 获取 Es6 列表Item
   */
  GetEs6List() {
    this.app.get('/api/getEs6List', (req, res, next) => {
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
          msg: '获取 Es6 列表总条数失败'
        })
      })
    })
  }

  /**
   * 插入/更新单条数据
   */
  AddEs6ListItem() {
    this.app.post('/api/insertEs6ListItem', (req, res, next) => {
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
            msg: '添加 Es6 列表数据成功'
          })
        })
        .catch((err) => {
          res.send({
            result: null,
            status: 400,
            msg: '添加 Es6 列表数据失败'
          })
        })
      }
    })
  }

  /**
   * 删除 Es6 列表
   */
  DeleteEs6ListItem () {
    this.app.get('/api/deleteEs6Item', (req, res, next) => {
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
    console.log('Es6 阿里云OSS checking____________________________________________');
    let timer = null;
    // 设置定时器
    timer = setInterval(() => {
    // 查找对应数据库获取当前正在用的所有图片地址
    this.Es6Model.find({}).then((doc) => {
      let mongodbPhotos = '';
      doc.map((i) => {
        mongodbPhotos += i.Content;
      });

      myOss.setBuckName('tanglihe-notes').then(() => {
        myOss.listDir('list-content/Es6/').then((result) => {
          const OssHasPhotos = [];
          if (result.objects && result.objects.length) {
            result.objects.forEach((obj) => {
              OssHasPhotos.push(obj.name);
            });
            
            const unExist = OssHasPhotos.filter((item) => !mongodbPhotos.includes(item));
            console.log(unExist);
            myOss.deleteMulti(unExist).then(() => {
              console.log('Es6 相关的多余图片已删除');
            })
          }
        })
      });
    });
    }, global.deleteOssPhotoTime);
  }

  start() {
    this.GetEs6List();
    this.AddEs6ListItem();
    this.DeleteEs6ListItem();
    this.DeleteAliOssPhotos();
  }
}

const es6List = new Es6List();
es6List.start();