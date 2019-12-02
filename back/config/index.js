/**
 * 全局配置
 */
// 本地开发环境
global.mongoPort = '27017';
global.ENV = 'devolopment';

// 线上环境
// global.mongoPort = '19999';
// global.ENV = 'production';

// 定时清除阿里云OSS多余图片的时间(每1个小时清一次)
global.deleteOssPhotoTime = 1000 * 60 * 60 * 1;