import $ from "jquery"
var publicJS = {}
//注册
publicJS.install = function (Vue, options) {
    Vue.prototype.$publicJS = publicJS
    Vue.publicJS = publicJS
    Vue.prototype.$checkStrIsNull = publicJS.checkStrIsNull
    Vue.prototype.$checkIsNull = publicJS.checkIsNull
}

//校验el-cascader选项中，value是否在选项中存在
publicJS.getCascacaderChoosed = function (options, value) {
    let list = {
        value: value,
        label: "",
    };
    if (!this.checkStrIsNull(value)) {
        //如果项目组不为空
        for (let i = 0; i < options.length; i++) {
            if (list.label != "") {
                break;
            }
            let childrenArr = options[i].children;
            if (childrenArr.length != 0) {
                for (let j = 0; j < childrenArr.length; j++) {
                    if (childrenArr[j].value == value) {
                        list.label = childrenArr[j].label;
                        break;
                    }
                }
            }
        }
    }
    return list;
}

//判断用户是否是测试人员
publicJS.judgeAdmin = async function (_this) {
    await _this.$codePost("/service/get_user_auth/", { operation: "获取人员身份", failed: true }).then(res => {
        if (res.code == 200) {
            _this.$store.commit("setIsTester", res.data.tester);
            // console.log(_this.$store.getters.getIsTester)
        }
        _this.$store.commit("setBasicDataHasGet", true);
    })
}

// 判断是否为mtl的最高管理员
publicJS.judgeMTLAdmin = async function (_this) {
    await _this.$codePost("/service/judge_mtl_admin/").then(res => {
        if (res.code == 200) {
            _this.$store.commit("setIsAdmin", res.data==1);
            // _this.$store.commit("setIsAdmin", true);
        }
        _this.$store.commit("setBasicDataHasGet", true);
    })
}

// 判断是否为接口人
publicJS.judgeContact = async function (_this) {
    // await _this.$codePost("/service/judge_contact/").then(res => {
    //     if (res.code == 200) {
    //         _this.$store.commit("setIsContact", res.data==1);
    //         // _this.$store.commit("setIsContact", true);
    //     }
    //     _this.$store.commit("setBasicDataHasGet", true);
    // })

    await _this.$codePost("/service/get_reminder/").then(res => {
        if (res.code == 200) {
            let contactList = []
            for(let k in res.data){
                contactList = contactList.concat(res.data[k].popo.split(','))
            }
            let userEmail = _this.$store.getters.getUserEmail
            if(contactList.indexOf(userEmail) !== -1){
                _this.$store.commit("setIsContact", true);
            }else{
                _this.$store.commit("setIsContact", false);
            }
        }
        _this.$store.commit("setBasicDataHasGet", true);
    })

}

//根据参数字典拼接url后缀
publicJS.getQueryStr = function (queryList) {
    let index = 0;
    let str = "";
    for (let k in queryList) {
        if (index == 0) {
            str += "?";
        } else {
            str += "&";
        }
        str = str + k + "=" + queryList[k];
        index++;
    }
    return str;
}

//检查值是否为空字符串
publicJS.checkStrIsNull = function (value) {
    if (value == undefined || value == null || value == "") {
        return true;
    } else {
        if (value.trim == "") {
            return true;
        } else {
            return false;
        }
    }
}

//检查是否为空
publicJS.checkIsNull = function (value) {
    if (value == undefined || value == null || value == "") {
        return true;
    } else {
        return false;
    }
}

//iframe外调用，便于iframe内切换路径后通知调用对象
publicJS.iframeParentPost = function (path, queryList, shouldChangeRoute, _this) {
    let list = {
        isIframeMethod: true,
        path: path,
        queryList: queryList,
        shouldChangeRoute: shouldChangeRoute,
    }
    // window.parent.postMessage(list, '*');
    if (list.isLoading != undefined) {
        //转圈
        _this.$store.commit("setPageIsLoading", list.isLoading);
    } 
    if (list.isIframeMethod) {
        //iframe内部切换路径后，外部网址也要跟着变，否则刷新网页时会回到最开始打开时的页面
        let url = list.path;
        url = url + this.getQueryStr(list.queryList);
        history.pushState({ url: url, title: document.title }, document.title, url);
    }
}

//iframe外调用，便于iframe内切换路径后通知调用对象
publicJS.iframeParentPost1 = function (path, queryList, _this) {
    let list = {
        isIframeMethod: true,
        path: path,
        queryList: queryList,
    }
    // window.parent.postMessage(list, '*');
    if (list.isLoading != undefined) {
        //转圈
        _this.$store.commit("setPageIsLoading", list.isLoading);
    } 
    if (list.isIframeMethod) {
        //iframe内部切换路径后，外部网址也要跟着变，否则刷新网页时会回到最开始打开时的页面
        let url = list.path;
        url = url + this.getQueryStr(list.queryList);
        history.pushState({ url: url, title: document.title }, document.title, url);
    }
}

//将queryList参数拼成url后缀
publicJS.getQueryStr = function(queryList) {
    let index = 0;
    let str = "";
    for (let k in queryList) {
        if (index == 0) {
            str += "?";
        } else {
            str += "&";
        }
        str = str + k + "=" + queryList[k];
        index++;
    }
    return str;
}

//iframe外调用，便于iframe内数据最基础数据获取完毕后通知外层停止转圈
publicJS.iframeLoadingPost = function (isLoading) {
    let list = {
        isLoading: isLoading,
    }
    window.parent.postMessage(list, '*');
}

//获取报告类型
publicJS.getReportType = function () {
    let path = top.location.pathname;
    // console.log(path)
    let pathPrefix = path.split("/")[2];
    // console.log(pathPrefix)
    if (pathPrefix == "expertServices") {
        return "expert";
    } else {
        return "deep";
    }
}

//根据报告类型获取axiosList值
publicJS.getReportAxiosList = function (reportType, queryList) {
    let axiosList = {};
    if (reportType == 'deep') {
        axiosList = {
            task_id: queryList.taskId,
            preview: queryList.preview || 0,
            test_type: 4
        }
    } else if (reportType == 'expert') {
        axiosList = {
            table_name: queryList.testRecordName,
            // test_type: 1,
            test_type: queryList.testType,
        }
    }
    return axiosList;
}

//下载文件（存在跨域文件，调用download_file把远程文件移到本地，下载后再删除
publicJS.downloadFile = function (_this, href) {
    // _this.$codePost("/service/download_file/", { srcArr: JSON.stringify([href]) }, { operation: "下载", failed: true }).then(res => {
    //     var $a = $("<a></a>").attr("href", '' + href).attr("download", "");
    //     $a[0].click();
    //     setTimeout(() => {
    //         _this.$codePost("/service/remove_file/", { srcArr: JSON.stringify([href]) });
    //     }, 2000)
    // })
    console.log(href)
}

//校验form表单
publicJS.checkFormData = function (_this, formName, errorMsg) {
    let hasError = false;
    _this.$refs[formName].validate((valid) => {
        if (valid) {
            hasError = false;
        } else {
            hasError = true;
        }
    });
    if (hasError) {
        _this.$message.error(errorMsg);
    }
    return hasError;
}

//获取完整的列数据
publicJS.getReportColumnData = function (colArr, colRelatedData) {
    let everyColData = {
        q_classification: {
            titleName: "问题类型",
            sortFlag: true,
        },
        q_level: {
            titleName: "问题级别",
            sortFlag: true,
        },
        q_description: {
            titleName: "问题描述",
            minWidth: 200,
            align: "left",
        },
        allDevice: {
            titleName: "影响设备",
            minWidth: 200,
            align: "left",
        },
        questionDetail: {
            titleName: "查看",
        },
        q_category: {
            titleName: "问题分类",
            sortFlag: true,
            type: "normal",
        },
        recurrent_rate: {
            titleName: "问题重现率",
            sortFlag: true,
            type: "normal",
        },
        deviceDetail: {
            titleName: "查看",
            fixed: "left",
            minWidth: 100,
        },
        device: {
            titleName: "测试机型",
            fixed: "left",
            sortFlag: true,
            minWidth: 120,
            type: "normal",
        },
        questionList: {
            titleName: "问题",
            minWidth: 600,
        },
        start_time: {
            titleName: "测试时间",
            sortFlag: true,
            type: "normal",
        },
        qa_name: {
            titleName: "审核QA",
            sortFlag: true,
            type: "normal",
        },
        brand: {
            titleName: "品牌",
            sortFlag: true,
            type: "normal",
        },
        deviceBrand: {
            titleName: "品牌",
            sortFlag: true,
            type: "normal",
        },
        os: {
            titleName: "系统版本",
            sortFlag: true,
            minWidth: 120,
            type: "normal",
        },
        resolution: {
            titleName: "分辨率",
            sortFlag: true,
            type: "normal",
        },
        is_pass: {
            titleName: "是否通过",
            sortFlag: true,
            fixed: "left",
        },
        if_pass: {
            titleName: "是否通过",
            sortFlag: true,
            fixed: "left",
        },
        device_id: {
            titleName: "设备编号",
            sortFlag: true,
            fixed: "left",
            type: "normal",
        },
        compatibility_scores: {
            titleName: '兼容性分数',
            sortFlag: true,
            type: "normal",
        },
        stability_scores: {
            titleName: '稳定性分数',
            sortFlag: true,
            type: "normal",
        },
        remark: {
            titleName: '备注',
            minWidth: 180,
            type: "normal",
        },
        log_file: {
            titleName: 'log文件',
            minWidth: 80,
        },
        test_time: {
            titleName: "测试时间",
            sortFlag: true,
            minWidth: 160,
            type: "normal",
        },
        test_qa: {
            titleName: "MTL接口人",
            sortFlag: true,
        },
        screenSize: {
            titleName: "屏幕尺寸",
            sortFlag: true,
            type: "normal",
        },
        cpuModel: {
            titleName: "CPU型号",
            sortFlag: true,
            minWidth: 250,
            type: "normal",
        },
        cpuCore: {
            titleName: "CPU核数",
            sortFlag: true,
            type: "normal",
        },
        gpuModel: {
            titleName: "GPU型号",
            sortFlag: true,
            minWidth: 250,
            type: "normal",
        },
        openGLES: {
            titleName: "OpenGL ES版本",
            sortFlag: true,
            type: "normal",
            minWidth: 80,
        },
        ram: {
            titleName: "内存",
            sortFlag: true,
            minWidth: 60,
            type: "normal",
        },
        rank: {
            titleName: "机型排名",
            sortFlag: true,
            type: "normal",
        },
        marketShare: {
            titleName: "市场占有率",
            sortFlag: true,
            type: "normal",
        },
        covering_user: {
            titleName: "覆盖活跃用户数",
            sortFlag: true,
            minWidth: 180,
            type: "normal",
        },
        all_device_number: {
            titleName: "问题设备数",
            sortFlag: true,
        },
        expand: {
            titleName: "",
        },
        checkbox: {
            titleName: "",
        },
        follow_qa: {
            titleName: "跟进QA",
            sortFlag: true,
        },
        remarks: {
            titleName: "备注",
        },
        questionPic: {
            titleName: "问题图片",
            minWidth: 80
        }
    }
    let columnData = [];
    for (let i = 0; i < colArr.length; i++) {
        let col = everyColData[colArr[i]];
        col.propName = colArr[i];
        if (colArr[i] == "deviceDetail") {
            col.idKey = colRelatedData.deviceDetailId;
        }
        columnData.push(col);
    }
    return columnData;
}

publicJS.getReportColumnData1 = function (colArr) {
    let everyColData = {
        q_classification: {
            titleName: "问题类型",
            sortFlag: true,
        },
        q_level: {
            titleName: "问题级别",
            sortFlag: true,
        },
        q_description: {
            titleName: "问题描述",
            minWidth: 200,
            align: "left",
            minWidth: 300,
        },
        allDevice: {
            titleName: "影响设备",
            minWidth: 200,
            align: "left",
        },
        failReason: {
            titleName: "不通过原因",
            minWidth: 500,
            align: "left",
        },
        questionDetail: {
            titleName: "查看",
        },
        q_category: {
            titleName: "问题分类",
            sortFlag: true,
            type: "normal",
        },
        recurrent_rate: {
            titleName: "问题重现率",
            sortFlag: true,
            type: "normal",
        },
        deviceDetail: {
            titleName: "查看",
            fixed: "left",
            minWidth: 100,
        },
        device: {
            titleName: "测试机型",
            fixed: "left",
            sortFlag: true,
            minWidth: 120,
            type: "normal",
        },
        questionList: {
            titleName: "问题",
            minWidth: 600,
        },
        start_time: {
            titleName: "测试时间",
            sortFlag: true,
            type: "normal",
        },
        qa_name: {
            titleName: "审核QA",
            sortFlag: true,
            type: "normal",
        },
        brand: {
            titleName: "品牌",
            sortFlag: true,
            type: "normal",
        },
        deviceBrand: {
            titleName: "品牌",
            sortFlag: true,
            type: "normal",
        },
        os: {
            titleName: "系统版本",
            sortFlag: true,
            minWidth: 120,
            type: "normal",
        },
        resolution: {
            titleName: "分辨率",
            sortFlag: true,
            type: "normal",
        },
        is_pass: {
            titleName: "是否通过",
            sortFlag: true,
            fixed: "left",
        },
        if_pass: {
            titleName: "是否通过",
            sortFlag: true,
            fixed: "left",
        },
        device_id: {
            titleName: "设备编号",
            sortFlag: true,
            fixed: "left",
            type: "normal",
        },
        compatibility_scores: {
            titleName: '兼容性分数',
            sortFlag: true,
            type: "normal",
        },
        stability_scores: {
            titleName: '稳定性分数',
            sortFlag: true,
            type: "normal",
        },
        remark: {
            titleName: '备注',
            minWidth: 180,
            type: "normal",
        },
        log_file: {
            titleName: 'log文件',
            minWidth: 80,
        },
        test_time: {
            titleName: "测试时间",
            sortFlag: true,
            minWidth: 160,
            type: "normal",
        },
        test_qa: {
            titleName: "MTL接口人",
            sortFlag: true,
        },
        screenSize: {
            titleName: "屏幕尺寸",
            sortFlag: true,
            type: "normal",
        },
        cpuModel: {
            titleName: "CPU型号",
            sortFlag: true,
            minWidth: 250,
            type: "normal",
        },
        cpuCore: {
            titleName: "CPU核数",
            sortFlag: true,
            type: "normal",
        },
        gpuModel: {
            titleName: "GPU型号",
            sortFlag: true,
            minWidth: 250,
            type: "normal",
        },
        openGLES: {
            titleName: "OpenGL ES版本",
            sortFlag: true,
            type: "normal",
            minWidth: 80,
        },
        ram: {
            titleName: "内存",
            sortFlag: true,
            minWidth: 60,
            type: "normal",
        },
        rank: {
            titleName: "机型排名",
            sortFlag: true,
            type: "normal",
        },
        marketShare: {
            titleName: "市场占有率",
            sortFlag: true,
            type: "normal",
        },
        covering_user: {
            titleName: "覆盖活跃用户数",
            sortFlag: true,
            minWidth: 180,
            type: "normal",
        },
        all_device_number: {
            titleName: "问题设备数",
            sortFlag: true,
        },
        expand: {
            titleName: "",
        },
        checkbox: {
            titleName: "",
        },
        follow_qa: {
            titleName: "跟进QA",
            sortFlag: true,
        },
        remarks: {
            titleName: "备注",
        },
        questionPic: {
            titleName: "问题图片",
            minWidth: 80
        }
    }
    let columnData = [];
    for (let i = 0; i < colArr.length; i++) {
        let col = everyColData[colArr[i]];
        col.propName = colArr[i];
        if (colArr[i] == "deviceDetail") {
            col.idKey = "id";
        }
        columnData.push(col);
    }
    return columnData;
}

export default publicJS

