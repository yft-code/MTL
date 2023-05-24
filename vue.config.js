const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  // pages: {
	// 	index: {
	// 		// page 的入口文件
	// 		entry: 'src/main.js',
	// 		// 模板文件
	// 		template: 'public/index.html',
	// 		// 在 dist/index.html 的输出文件
	// 		filename: 'index.html',
	// 		// 当使用页面 title 选项时，
	// 		// template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
	// 		title: 'Index Page',
	// 		// 在这个页面中包含的块，默认情况下会包含
	// 		// 提取出来的通用 chunk 和 vendor chunk。
	// 		chunks: ['chunk-vendors', 'chunk-common', 'index'],
	// 	}
	// },
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
