// 是否为正式环境
const debug = process.env.NODE_ENV === 'production';
module.exports = {
  configureWebpack: config => {
    if (!debug) {
      config.devtool = 'source-map';
    } else  {
      config.devtool = 'hidden-source-map';
    }
  },
  devServer: {
    proxy: {
      // 将项目中请求的 /api 替换成 target 指向的值
      '/api': {
        target: 'http://localhost:9000/api',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
