// 图片上传阿里云服务器
const OSS = require('ali-oss');

const client = OSS({
  accessKeyId: 'LTAI4FcouLj4iENde5sSKcgN', // RAM id
  accessKeySecret: 'oh7yBQHuMiDhWN8vHxQ28I0YVSZCuJ', // RAM key
  region: 'oss-cn-beijing' // 华北2地区的 region 值
});

class MYOSS {
  constructor() {
    this.client = client;
    this.bucketName = null;
  }

  // 设置要操作的 bucket（储存空间）的名称
  setBuckName(bucketName) {
    return new Promise((resolve) => {
      this.bucketName = (global.ENV === 'devolopment' ? 'dev-' : 'pro-') + bucketName;
      // 查看是否存在该bucket
      this.listBuckets().then((result) => {
        if (result && result.buckets) {
          resolve();
        } else {
          // 创建bucket
          this.putBucket().then(() => {
            // 设置bucket的权限
            this.bucketACL('public-read-write').then(() => {
              resolve();
            });
          });
        }
      });
    })
  };

  // 查看阿里云OSS上存在的bucket列表
  async listBuckets() {
    try {
      return await client.listBuckets({
        prefix: this.bucketName, // 指定含有 prefix 字段开头的 bucket
      });
    } catch(err) {
      console.log(err)
    }
  }

  // 创建 bucket，并使用它
  async putBucket() {
    try {
      return await client.putBucket(this.bucketName);
    } catch (err) {
      console.log(err);
    }
  }

  // 设置 bucket 的访问权限
  async bucketACL (access) {
    try {
      return await client.putBucketACL(this.bucketName, access);
    } catch (e) {
      console.log(e);
    }
  }

  // 使用 bucket
  useBucket() {
    this.client.useBucket(this.bucketName);
  }

  // 查询指定bucket的某个目录的所有文件和子目录
  async listDir(dir) {
    this.useBucket(this.bucketName);
    return await client.list({
      prefix: dir,
      delimiter: '/'
    });
  }

  // 删除多个文件
  async deleteMulti (objects) {
    try {
      return await client.deleteMulti(objects, {
        quiet: true
      })
    } catch (e) {
      // console.log(e);
    }
  }

  /**
   * 图片上传阿里云
   * @param {本地需要上传图片} localFile
   * @param {图片需要保存的名称} filename
   */
  async put(localFile, filename) {
    try {
      // 当前要使用该bucket
      this.useBucket();
      return await this.client.put(`${filename}.png`, `${localFile}`);
    } catch (e) {
      console.log(e);
    }
  }
};

module.exports = MYOSS;