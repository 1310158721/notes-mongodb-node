const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class MenuList {
  constructor() {
    this.app = global.app;
    this.db = mongoose.createConnection(`mongodb://127.0.0.1:${global.mongoPort}/notes`, { useUnifiedTopology: true,  useNewUrlParser: true });

    // 用户数据结构 Schema
    this.MenuListSchema = new Schema({
      title: String,
      disabled: Boolean,
      children: Array
    })

    // 用户数据 Model
    this.MenuListModel = this.db.model('menulist', this.MenuListSchema);
  }

  /**
   * 查询菜单栏
   */
  async FindMenuList(condition = {}) {
    const res = await this.MenuListModel
      .find(condition)
      .sort({ order: 1 });
    return res;
  }

  /**
   * 获取菜单栏
   */
  getMenuList() {
    this.app.get('/api/getMenuList', (req, res, next) => {
      this.FindMenuList()
        .then((doc) => {
          res.send({
            result: doc,
            status: 0,
            msg: '查询菜单列表成功'
          })
        })
        .catch((err) => {
          res.send({
            result: null,
            status: 400,
            msg: '查询菜单列表失败'
          })
        })
    })
  }

  start() {
    this.getMenuList();
  }
}

const menulist = new MenuList();
menulist.start();