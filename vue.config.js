const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  assetsDir: 'site_media/lib/mtl_test_platform/static',
  outputDir: 'dist',
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.symlinks(true); // 修复热更新失效
    config.resolve.alias // 添加别名
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@store', resolve('src/store'))
      .set('@static', resolve('src/../public/static'))
  },
  devServer: {
    host:'test.qa.leihuo.netease.com',
    proxy: {
      '/apis': {
        target:' http://10.240.171.170:8088/',
        changeOrigin: true,
        pathRewrite: {
          '^/apis': ''
        }
      }
    }
  },
  lintOnSave: false,
}
