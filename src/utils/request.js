import axios from 'axios'
import api from '../../api.config'
import qs from 'qs'
import {Message} from 'element-ui'

// 这里没有环境切换所以项目发布时添加相应的接口域名即可
axios.defaults.baseURL = api.baseURL 
// 设置请求超时时间，毫秒
axios.defaults.timeout = 960000

// 设置post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// 请求拦截
axios.interceptors.request.use(config => {
	// 在发送请求之前做些什么 验证token之类的
	// config.headers.token
	return config
}, err => {
	// 对请求错误做些什么
	return Promise.error(err)
})

// 响应拦截
axios.interceptors.response.use(response => {
	// 对响应数据做点什么
	return response
}, err => {
	return Promise.reject(err.response);
	// // 后端返回401则重定向到openid登录页面
    // if (err.response && err.response.status === 401) {
    //     return location.replace(`http://qa.leihuo.netease.com:9714/qaweblogin/login?redirect=${encodeURIComponent(location.href)}`)
    // } else {
    //     return Promise.reject(err.response);
    // }
})

// 封装get方法和post方法
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

export function get(url, params) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			params: params
		}).then(res => {
            // 请求成功状态码为200，返回请求数据
            if(res.data.code === 200) {
			     resolve(res.data)
            } else {
                Message({
                    message: res.data.msg,
                    type: 'error'
				})
            }
			// resolve(res)
		}).catch(err => {
			reject(err.response);
		})
	})
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params, callback, specialMessageCodes = [], requestType = '') {
	return new Promise((resolve, reject) => {
		axios.post(url, requestType === 'formData' ? params : qs.stringify(params))
			.then(res => {
				// 请求成功状态码为200，返回请求数据
				if(res.data.code === 200) {
					callback(res)
					if (requestType === 'formData') {
						resolve(true)
					}
				} else {
					if (specialMessageCodes.indexOf(res.data.code) === -1 && requestType !== 'getFrameScreenshot') {
						if(res.data.msg) {
							Message({
								message: res.data.msg,
								type: 'error'
							})
						} else if(res.data) {
							Message({
								message: res.data,
								type: 'error'
							})
						}
					}
					resolve(res)
				}
			})
			.catch(err => {
				if (requestType === 'getFrameScreenshot') {
					resolve(err)
				}else {
					reject(err);
				}
			})
	})
}
  