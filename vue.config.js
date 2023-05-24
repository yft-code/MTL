// module.exports = {

//   //build目录
//   assetsDir: 'site_media/lib/mtl_test_platform/static',
//   outputDir:'dist',
//   productionSourceMap: false,
//   // publicPath:'./',

//   devServer: {
//     host:'0.0.0.0',
//     hot:true,
//     inline: false,
//     port:8080,
//     proxy: {
//       '/apis': {
//         target: 'http://mtl-login.leihuo.netease.com:8989/',
//         // target: 'http://127.0.0.1:8080',
//         changeOrigin: true,
//         ws: false,
//         pathRewrite: {
//           '^/apis': ''
//         }
//       }
//     }
//   },
//   lintOnSave:false,
// }


module.exports = {
  assetsDir: 'site_media/lib/mtl_test_platform/static',
  outputDir: 'dist',
  productionSourceMap: false,

  devServer: {
    host:'test.qa.leihuo.netease.com',
    proxy: {
      '/apis': {
        // target: 'http://mtl-testplatform.leihuo.netease.com:30079',
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
