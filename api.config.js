var isPro = process.env.NODE_ENV === 'production' //process.env.NODE_ENV用于区分是生产环境还是开发环境
//根据环境不同导出不同的baseURL
module.exports = {
    baseURL: isPro ? '' : '/apis',
    // baseURL: isPro ? '' : 'http://127.0.0.1:8080',
    isPro
}
