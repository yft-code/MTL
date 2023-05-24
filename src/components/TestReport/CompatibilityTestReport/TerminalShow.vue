<template> 
    <div>
        <div class="main-container">
            <div>
                <el-card id="deviceDetail" class="box-card">
                    <div slot="header" class="clearfix">
                        <div class="decorate-div"></div>
                        <div class="decorate-title">
                            详细机型测试结果
                        </div>
                    </div>
                    <div class="card-content-div">
                        <div v-if="totalHtml != ''" class="device-count-div">
                            <span v-html="totalHtml"></span>
                        </div>
                        
                        <!--筛选条件-->
                        <filter-condition 
                            style="margin:20px auto" 
                            :filterList="filterList" 
                            :defaultConditionList="defaultConditionList" 
                            :isShowExpandOrFold="isShowExpandOrFold" 
                            @getFilterData="getFilterData"
                            >
                        </filter-condition>

                        <!-- 表格部分 -->
                        <terminal-table 
                            v-if="reportTableList != ''"
                            :axios-list="axiosList"
                            :route-list="$store.getters.getReportRouteList[reportType]"
                            :table-list="reportTableList"
                            :report-type="reportType"
                            @afterGetTable="afterGetTable"
                            :filterPost="filterPost"
                            @getFilterOriginal="getFilterOriginal"
                            />
                        <question-level></question-level>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import QuestionLevel from './QuestionLevel'
import TerminalTable from './TerminalTable'
import filterCondition from '@/components/TestReport/CompatibilityTestReport/filterCondition'

import $ from 'jquery'
export default {
    components: {
        QuestionLevel,
        TerminalTable,
        filterCondition
    },
    props: {
        axiosList: {
            required: true,
            type: Object
        },
        reportType: {
            required: true,
            type: String,
        },
        platform: {
            required: true,
            type: String,
        },
        showNav: {
            required: true,
            type: Boolean,
        },
    },
    data() {
        return {
            totalHtml:"",//详细机型测试结果标题右侧设备统计html
            reportTableList: "",
            expertTableList: {
                android: {
                    postApp: "test_terminal_android_report",
                    tableDataKey: "device_info",
                    tableTotalKey: "all_device_number",
                    // colArr: [
                    //     "deviceDetail", "device_id", "device", "if_pass", "questionList", "brand", "os", 
                    //     "resolution", "screenSize", "cpuModel", "cpuCore", "ram", "openGLES","gpuModel", 
                    //     "rank","marketShare", "covering_user","compatibility_scores", "stability_scores", 
                    //     "remark", "log_file", "test_time","test_qa"
                    // ],
                    colArr: ["device_id", "device", "if_pass", "os",  "questionList", "cpuModel", "deviceDetail"],
                    columnData: "",
                    filter:"filter_condition" //zeng
                    
                },
                ios: {
                    postApp: "test_terminal_ios_report",
                    tableDataKey: "device_info",
                    tableTotalKey: "all_device_number",
                    // colArr: [
                    //     "deviceDetail","device_id","device", "if_pass", "questionList","brand", "os", 
                    //     "resolution", "screenSize", "cpuModel", "cpuCore", "ram", "openGLES","gpuModel", 
                    //     "rank", "marketShare", "covering_user","compatibility_scores", "stability_scores", 
                    //     "remark", "log_file", "test_time","test_qa"
                    // ],
                    colArr: ["device_id", "device", "if_pass", "os",  "questionList", "cpuModel", "deviceDetail"],
                    columnData: "",
                    filter:"filter_condition" //zeng
                    
                },
                as: {
                    postApp: "test_terminal_simulator_report",
                    tableDataKey: "device_info",
                    tableTotalKey: "all_device_number",
                    colArr: [
                        "deviceDetail","device", "if_pass", "questionList", "compatibility_scores",
                        "stability_scores", "remark", "log_file", "test_time", "test_qa"
                    ],
                    columnData: "",
                    filter:"filter_condition" //zeng
                    
                }
            },
            //筛选配置参数
            defaultConditionList: [],
            isShowExpandOrFold: false, // 是否需要折叠展开按钮
            selectedData: [],
            filterOriginal:[],
            //zeng 重新写筛选需要格式
            chartsFilterData: {
                android: [
                    { title: "品牌", key: "brand" },
                    { title: "系统版本", key: "os" },
                    { title: "分辨率", key: "resolution" },
                    { title: "内存", key: "ram" },
                    { title: "屏幕尺寸", key: "screen_size" },
                    { title: "CPU型号", key: "cpu", type: "bar" }
                ],
                ios: [
                    { title: "系统版本", key: "os" },
                    { title: "分辨率", key: "resolution" },
                    { title: "内存", key: "ram" },
                    { title: "屏幕尺寸", key: "screen_size" },
                    { title: "CPU型号", key: "cpu", type: "bar" }
                ],
                as: [{ title: "测试机型", key: "device" }]
            },
            activeNav: 'deviceDetail',

        }
    },
    computed: {
        qLevelList() {
            return this.$store.getters.getQLevelList;
        },
        filterList() {
            return this.filterOriginal
        },
        filter(){
            let filterArr = {};
            this.chartsFilterData[this.platform].map((item,index)=>{
                if(item.key == 'screen_size'){
                    let changKey = 'screenSize'
                    filterArr[item.key] = [
                        { "value": changKey, "label": item.title, "data":[{ "value": "", "label": "" }]}
                    ];
                }else if(item.key == 'cpu'){
                    let changKey = 'cpuModel'
                    filterArr[item.key] = [
                        { "value": changKey, "label": item.title, "data":[{ "value": "", "label": "" }]}
                    ];
                }
                else{
                    filterArr[item.key] = [
                        { "value": item.key, "label": item.title, "data":[{ "value": "", "label": "" }]}
                    ];
                }
            })
            return filterArr
        },
        failFilter(){
            let filterArr = {};
            this.chartsFilterData[this.platform].map((item,index)=>{
                if(item.key == 'screen_size'){
                    let changKey = 'screenSize'
                    filterArr[item.key] = [
                        { "value": changKey, "label": item.title, "data":[{ "value": "", "label": "" }]}
                    ];
                }else if(item.key == 'cpu'){
                    let changKey = 'cpuModel'
                    filterArr[item.key] = [
                        { "value": changKey, "label": item.title, "data":[{ "value": "", "label": "" }]}
                    ];
                }
                else{
                    filterArr[item.key] = [
                        { "value": item.key, "label": item.title, "data":[{ "value": "", "label": "" }]}
                    ];
                }
                let notPass = { "value": "if_pass", "label": "是否通过", "data": [ { "value": "不通过", "label": "不通过" }]}
                filterArr[item.key].push(notPass)
            })
            return filterArr
        },
        checkHasSelect(){
            return this.$store.getters.getProblemFilter
        },
        filterPost() {
            let res = [];
            let curFilter = this.selectedData;
            if (curFilter.length > 0) {
                for (let i = 0; i < curFilter.length; i++) {
                    let curItem = { "item": "", "item_value": [] };
                    curItem.item = curFilter[i].value;
                    for (let j = 0; j < curFilter[i].data.length; j++) {
                        let childData = curFilter[i].data[j]
                        if (curFilter[i].data[j].data) {//说明还有多个
                            let child = curFilter[i].data[j].data
                            for (let k = 0; k < child.length; k++) {
                                curItem.item_value.push(child[k].label);
                            }
                        } else {
                            if (curItem.item == 'q_level') {
                                let levelArr = childData.value.split('P')
                                curItem.item_value.push(levelArr[1]);
                            } else {
                                curItem.item_value.push(childData.label);
                            }

                        }

                    }
                    res.push(curItem)
                }
            }
            return res
        },
    },
    watch: {
        checkHasSelect: {
            handler: function(newVal) {
                if (newVal.length > 0) {
                    document.getElementById('deviceDetail').scrollIntoView()
                }
            },
            deep: true,
            immediate: true,

        }
    },
    created() {
        //专家表格需要获取自定义列
        let colArr = JSON.parse(JSON.stringify(this.expertTableList[this.platform].colArr));
        let columnData = this.$publicJS.getReportColumnData1(colArr);
        this.$codePost("/expertCompatibility/get_custom_cols/", this.axiosList, { operation: "获取自定义列", failed: true }).then(res => {
            if (res.code == 200) {
                let index = colArr.indexOf("questionList");
                for (let i = 0; i < res.data.length; i++) {
                    let list = {
                        propName: res.data[i].col_name,
                        titleName: res.data[i].col_cn_name,
                        type: "normal",
                    };
                    columnData.splice(index + 1 + i, 0, list);
                }
            }
            this.expertTableList[this.platform].columnData = columnData;
            this.reportTableList = this.expertTableList[this.platform];
            // console.log(this.reportTableList)
        })
    },
    methods: {
        //滚动到
        scrollTo(id) {
            $('.el-main').animate({
                scrollTop: $(".el-main").scrollTop() + $("#" + id).offset().top - $('.el-main').offset().top
            }, 300);
            this.activeNav = id;
        },

        //表格数据获取到后，拿到数据里的总数统计值
        afterGetTable(data) {
            let totalNum = data;
            //获取测试机型统计显示html
            if (totalNum != "") {
                let unit = this.platform == "as" ? "款" : "台";
                let platformName = this.platform == "as" ? "Android模拟器" : this.platform == "android" ? "Android" : "iOS";
                let device = this.platform == "as" ? "" : "机器";
                let html = `
                    <span>
                        本次共测试<b>【${ totalNum.all_device_number }${ unit }】</b>${ platformName }${ device }，
                    </span>
                    <span>共有<b>【${ totalNum.error_device_number }${ unit }】</b>${ device }出现<b>【${ totalNum.question_number }</b>个】问题</span>
                `;
                this.totalHtml = html;
            } else {
                this.totalHtml = "";
            }
        },
        //获取到筛选的数据
        getFilterData(selectedData) {
            this.selectedData = selectedData
        },
        getFilterOriginal(data){
            this.filterOriginal = data
        },

    },
}
</script>
<style lang="less" scoped>
.main-container {
    min-height: 880px; // 左侧导航
    .terminal-nav {
        position: fixed;
        top: 200px;
        left: 0;
        z-index: 500;
        .nav-div {
            display: inline-block;
            border: 1px solid #EBEEF5;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
            width: 8rem;
            .nav-item {
                cursor: pointer;
                color: #303133;
                padding: 0.5rem 1rem;
                border-bottom: 1px solid #EBEEF5;
                background-color: #FFF;
            }
            .nav-item.active {
                color: #4876F2;
                font-weight: bold;
            }
            .nav-item:hover {
                background: #e4e7ed;
            }
        }
        .show-or-hide-div {
            display: inline-block;
            vertical-align: top;
            cursor: pointer;
            box-sizing: border-box;
            font-weight: bold;
            text-align: center;
            width: 25px;
            height: 93px;
            div {
                padding-top: 40px;
                height: 100%;
                vertical-align: middle;
            }
            .hide-nav {
                width: 25px;
                height: 93px;
                background: url("http://mtl.leihuo.netease.com:8000/site_media/img/pmis/nuv_03.png") no-repeat transparent;
            }
            .show-nav {
                width: 25px;
                height: 93px;
                background: url("http://mtl.leihuo.netease.com:8000/site_media/img/pmis/nuv_04.png") no-repeat transparent;
            }
        }
    } // 报告内容
    .box-card {
        box-shadow: none; // 表格
        // 统计图
        .chart-title {
            color: #333333;
            font-size: 16px;
        }
        .pie-box {
            width: 50%;
            display: inline-block;
            vertical-align: top;
            .pie-div {
                height: 400px;
                width: 100%;
            }
        }
        .bar-box {
            width: 100%;
            .bar-div {
                width: 100%;
                height: 500px;
            }
        }
    }
}
.device-count-div {
    width: 100%;
    background-color: #e6f1ff;
    border-radius: 4px;
    border: 1px solid #89a7ff;
    padding: 1rem;
    margin-bottom: 1rem;
}
</style>


