import axios from 'axios'
import qs from 'qs'
import Message from '../../node_modules/element-ui/lib/message.js'
var selfAxios = {}
//注册全局的function
selfAxios.install = function (Vue, options) {
    Vue.prototype.$selfAxios = selfAxios
    Vue.selfAxios = selfAxios
    Vue.prototype.$codePost = selfAxios.codePost
    Vue.prototype.$formPost = selfAxios.formPost
}

//{code:"",msg:"",data:""}
selfAxios.codePost = function (url, list, messageList) {
    // console.log(0)
    // console.log("url----",url)
    // console.log("list----",list)
    // console.log("messageList----",messageList)
    return this.$selfAxios.post("", url, list, messageList);
}

//表单提交，区别在于传值格式和headers
selfAxios.formPost = function (url, formData, messageList) {
    return this.$selfAxios.post("form", url, formData, messageList);
}

selfAxios.post = function (type, url, list, messageList) {
    // console.log(1)
    let headers = {};
    if (type != "form") {
        // console.log(0)
        // 汉字改成编码
        list = qs.stringify(list);
        // console.log(list)
    } else {
        headers = { headers: { "Content-Type": "multipart/form-data" } };
    }
    // console.log(headers)
    return new Promise(resolve => {
        let response = {};
        axios.post(url, list, headers).then(res => {
            // console.log(res)
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
            // console.log(response)
            resolve(response);
        })
    })
}

selfAxios.codePostMessage = function (response, messageList) {
    // messageList = {
    //     operation:"",//操作
    //     success:"",//成功是否需要提示
    //     successText:"",//成功特殊提示
    //     failed:"",//失败是否需要提示
    //     failedText:"",//失败特殊提示
    // }
    if (response.code == "200") {
        //操作成功时
        if (messageList.success) {
            //需要成功提示
            if (messageList.successText != undefined) {
                //成功定制了特殊提示
                Message.success(messageList.successText);
            } else {
                //通用成功提示
                Message.success(messageList.operation + "成功！");
            }
        }
    } else if (response.code == "Unlogin") {
        console.log("cookie失效");
    } else {
        //操作失败时
        if (messageList.failed) {
            Message.error(response.msg);
        }
    }
}
export default selfAxios

