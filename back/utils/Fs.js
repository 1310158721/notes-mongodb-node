const fs = require('fs');

class FS {
  /**
   * 递归删除某个文件夹里面的所有内容，不删除文件夹本身
   * @params { path } 文件夹的路径
   */
  async deleteFolder(path) {
    var files = [];
    if (fs.existsSync(path)) {
      if (fs.statSync(path).isDirectory()) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
          var curPath = path + "/" + file;
          if (fs.statSync(curPath).isDirectory()) {
            deleteFolder(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        });
      } else {
        fs.unlinkSync(path);
      }
    }
  }
};

const Fs = new FS();
module.exports = Fs;
