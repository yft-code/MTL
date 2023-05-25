import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui';

var Utils = {};
Utils.install = function(Vue, options){
    Vue.prototype.$Utils = Utils;
    Vue.prototype.$axiosPost = Utils.axiosPost;
    Vue.prototype.$axiosFormData = Utils.axiosFormData;
    Vue.prototype.$codePost = Utils.codePost;
    Vue.prototype.$axiosGet = Utils.axiosGet;
    Vue.axiosPost = Utils.axiosPost;
    Vue.axiosFormData = Utils.axiosFormData;
    Vue.axiosGet = Utils.axiosGet;
}

//{code:"",msg:"",data:""}
Utils.codePost = function (url, list, messageList) {
    return this.$Utils.post("", url, list, messageList);
}
// type:是否为表单提交，url：请求地址，list：请求参数，messageList：需要信息提示的请求
Utils.post = function (type, url, list, messageList) {
    let headers = {};
    if (type != "form") {
        list = qs.stringify(list);
    } else {
        headers = { headers: { "Content-Type": "multipart/form-data" } };
    }
    return new Promise(resolve => {
        let response = {};
        axios.post(url, list, headers).then(res => {
            console.log('loginRes',res);
            if (res.data == "Unlogin") {
                response = {
                    code: "Unlogin",
                    data: "cookie失效"
                }
            } else {
                response = res.data;
            }
        }).catch(err => {
            console.log(err)
            response = { code: "500", msg: err.message };
        }).finally(() => {
            if (messageList != undefined) {
                //需要信息提示
                this.codePostMessage(response, messageList);
            }
            resolve(response);
        })
    })
}

//post请求
Utils.axiosPost = function(url, params){
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(params)).then(res => {
            // console.log(3)
            console.log(res)
            let response = res.data;
            if(response.code == -1){
                Message.error(response.msg);
            }
            resolve(response);
        }).catch(err => {
            reject(err);
            Message({
                dangerouslyUseHTMLString: true,
                message: `<p>POST： ${err.request.responseURL}</p><p>错误：${err.request.status} (${err.request.statusText})</p>`,
                type: 'error',
            })
        })
    })
}

//表单传值post请求
Utils.axiosFormData = function(url, params){
    return new Promise((resolve, reject) => {
        axios.post(url, params, {
            headers:{
                "Content-Type": "multipart/form-data"
            }
        }).then(res => {
            let response = res.data;
            if(response.code == -1){
                Message.error(response.msg);
            }
            resolve(response);
        }).catch(err => {
            reject(err);
            Message({
                dangerouslyUseHTMLString: true,
                message: `<p>POST： ${err.request.responseURL}</p><p>错误：${err.request.status} (${err.request.statusText})</p>`,
                type: 'error',
            })
        })
    })
}

//get请求
Utils.axiosGet = function(url, params){
    return new Promise((resolve, reject) => {
        axios.get(url, qs.stringify(params)).then(res => {
            let response = res.data;
            if(response.code == -1){
                Message.error(response.msg);
            }
            resolve(response);
        }).catch(err => {
            reject(err);
            Message({
                dangerouslyUseHTMLString: true,
                message: `<p>POST： ${err.request.responseURL}</p><p>错误：${err.request.status} (${err.request.statusText})</p>`,
                type: 'error',
            })
        })
    })
}

export default Utils;