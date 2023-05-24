<template>
    <div id="compatibilityTestReport" style="height: 100% text-align: center !important; scroll-behavior: smooth; margin-bottom: 5rem;" ref="content">
        <!-- 报告标题 -->
        <div class="reportTitle" :style="this.$route.path=='/mtl_test_platform/page/compatibilityTestReport' ? {'padding-top':'67px'} : {}">
            <span>{{ taskDetail['test_report_title'] || "" }}</span>
        </div>

        <div class="compatibility-div" style="padding-top: 8px;">
            <!-- 测试任务详情 -->
            <task-detail 
                :axios-list="axiosList" 
                :staticData="staticData" 
                :isPreview="isPreview" 
                :taskDetail="taskDetail" 
                @afterEdit="afterEditMethod"
                :taskDetailList="taskDetailList"
                :exportUrl="'/expertCompatibility/export_report/'"
                :editUrl="'/expertCompatibility/update_report_message/'"
                :taskFormItemList="taskFormItemList"
                :taskFormList="taskFormList"
                @changeAppIcon="changeAppIcon"
                />

            <!-- 高风险项 -->
            <!-- <div v-if="taskDetail['high_risk_items']">
                <span style="position:relative; top: 12px; left: 40px; z-index:999 !important;">高风险项</span>
                <el-card style="margin-top:0; padding-top: 10px; background: #fef0ef;">
                    {{taskDetail['high_risk_items']}}
                </el-card>
            </div> -->

            <div v-if="isPreview">
                <!-- 通过率 -->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <div class="decorate-div"></div>
                        <div class="decorate-title">
                            测试通过率
                        </div>
                    </div>
                    <div class="card-content-div">
                        <!-- 数据部分 -->
                        <div class="rate-text">
                            <div class="rate-text-div">
                                <el-row>
                                    <el-col :span="8">
                                        <div class="item">
                                            <div class="title">本次测试覆盖设备数</div>
                                            <span class="num">{{ staticData.device_number }}</span>
                                            <span>台</span>
                                        </div>
                                        <div class="item">
                                            <div class="title">设备通过率</div>
                                            <span class="num">{{ staticData.pass_rate ? parseFloat(staticData.pass_rate).toFixed(2) : '' }}%</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="item">
                                            <div class="title">通过</div>
                                            <span class="num">{{ staticData.pass_device }}</span>
                                            <span>台</span>
                                        </div>
                                        <div class="item">
                                            <div class="title">不通过</div>
                                            <span class="num">{{ staticData.fail_device }}</span>
                                            <span>台</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="item">
                                            <div class="title">发现问题数</div>
                                            <span class="num">{{ totalProblemCount }}</span>
                                            <span>个</span>
                                        </div>
                                        <div class="item">
                                            <div class="title">影响机型数</div>
                                            <span class="num">{{ affectDeviceCount }}</span>
                                            <span>台</span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <!-- 饼图部分 -->
                        <div v-if="passRateData" class="rate-pie" id="pie-div">
                            <div ref="passRateRef" class="pass-rate-div"></div>
                        </div>
                    </div>
                </el-card>
                <problem-detail :axios-list="axiosList" style="margin-top: 15px;" :report-type="reportType" :is-preview="isPreview"></problem-detail>
            </div>

            <div v-else>
                <div class="selectPackage">
                    <el-radio-group v-model="packageType" @change="changePackageType">
                        <el-radio-button :label="0">测试概况</el-radio-button>
                        <el-radio-button :label="1">问题列表</el-radio-button>
                        <el-radio-button :label="2">设备列表</el-radio-button>
                    </el-radio-group>
                </div> 

                <div v-if="packageType == '0'" style="margin-top:15px;">
                    <!-- 通过率 -->
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <div class="decorate-div"></div>
                            <div class="decorate-title">
                                测试通过率
                            </div>
                        </div>
                        <div class="card-content-div">
                            <!-- 数据部分 -->
                            <div class="rate-text">
                                <div class="rate-text-div">
                                    <el-row>
                                        <el-col :span="8">
                                            <div class="item">
                                                <div class="title">本次测试覆盖设备数</div>
                                                <span class="num">{{ staticData.device_number }}</span>
                                                <span>台</span>
                                            </div>
                                            <div class="item">
                                                <div class="title">设备通过率</div>
                                                <span class="num">{{ staticData.pass_rate ? parseFloat(staticData.pass_rate).toFixed(2) : '' }}%</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="item">
                                                <div class="title">通过</div>
                                                <span class="num">{{ staticData.pass_device }}</span>
                                                <span>台</span>
                                            </div>
                                            <div class="item">
                                                <div class="title">不通过</div>
                                                <span class="num">{{ staticData.fail_device }}</span>
                                                <span>台</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="item">
                                                <div class="title">发现问题数</div>
                                                <span class="num">{{ totalProblemCount }}</span>
                                                <span>个</span>
                                            </div>
                                            <div class="item">
                                                <div class="title">影响机型数</div>
                                                <span class="num">{{ affectDeviceCount }}</span>
                                                <span>台</span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <!-- 饼图部分 -->
                            <div v-if="passRateData" class="rate-pie" id="pie-div">
                                <div ref="passRateRef" class="pass-rate-div"></div>
                            </div>
                        </div>
                    </el-card>

                    <!-- 测试问题概述 -->
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <div class="decorate-div"></div>
                            <div class="decorate-title">
                                问题概述
                            </div>
                        </div>
                        <div class="card-content-div" v-show="totalProblemCount != 0" style="vertical-align: top;">
                            <div style="margin-top: 15px;">
                                <div>
                                    本次测试共发现问题数 {{ totalProblemCount }} 个
                                </div>
                                <div style="margin-top: 5px;" v-if="statisData.questionLevel && statisData.questionLevel.y_data">
                                    其中，
                                    <span v-for="item,index in statisData.questionLevel.y_data" :key="index">
                                        {{ statisData.questionLevel.x_data[index] }}问题有 {{ item }} 个，占比 {{ Number(item / totalProblemCount * 100).toFixed(1) }}% ；
                                    </span>
                                </div>
                                <div style="margin-top: 5px;">
                                    其中，
                                    <span v-for="item,index in statisData.questionType" :key="index">
                                        {{ item.name }}问题有 {{ item.value }} 个，占比 {{ Number(item.value / totalProblemCount * 100).toFixed(1) }}% ；
                                    </span>
                                </div>
                            </div>
                            <el-row style="margin-top: 10px;">
                                <el-col :span="8">
                                    <div class="problem-chart-div" ref="affectDeviceRef"></div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="problem-chart-div" style="height: 250px; width: 500px; margin: auto;" ref="problemDistributionRef"></div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="problem-chart-div" ref="problemLevelRef"></div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>


                    <!-- 测试统计 -->
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <div class="decorate-div"></div>
                            <div class="decorate-title">
                                测试统计
                            </div>
                        </div>
                        <div class="card-content-div">
                            <el-table v-loading="testStaticTableLoading" :data="testStaticTable" border stripe :header-cell-style="{background:'#eef1f6'}">
                                <el-table-column v-for="item,index in testStaticTableColData" 
                                    :key="index"
                                    :label="item.label"
                                    align="center">
                                    <template v-slot="scope">
                                        <div v-if="item.label == '问题类型'">
                                            <div v-for="q,k in scope.row.question" :key="k">
                                                {{q[item.prop]}}
                                            </div>
                                        </div>
                                        <div v-else-if="item.label == '失败机型数'">
                                             <div v-for="q,k in scope.row.question" :key="k">
                                                {{q[item.prop]}}
                                                <el-tooltip effect="dark" v-if="q.device_list.length > 0" placement="right">
                                                    <div slot="content">
                                                        <div v-for="item,index in q.device_list" :key="index">
                                                            <span class="device-info-span" @click="handleDeviceClick(item)">{{item.device}}</span><span v-if="item.os">（{{item.os}}）</span>
                                                        </div>
                                                    </div>
                                                    <i class="el-icon-question"></i>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                        <div v-else>
                                            {{scope.row[item.prop]}}
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                    

                    <!-- 测试机型统计 -->
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <div class="decorate-div"></div>
                            <div class="decorate-title">
                                测试机型统计
                            </div>
                        </div>
                        <div class="card-content-div">
                            <test-device-group :axios-list="axiosList"></test-device-group>
                        </div>
                    </el-card>
                </div>
                <div v-if="packageType == '1'" style="margin-top:15px;">
                    <problem-detail :axios-list="axiosList" :report-type="reportType" :is-preview="isPreview"></problem-detail>
                </div>
                <div v-if="packageType == '2'" style="margin-top:15px;">
                    <device-detail :axios-list="axiosList" :report-type="reportType"></device-detail>
                </div>
            </div>
            <!-- 页面底部的空白区域 -->
            <!-- <div style="height: 40px; text-align:center; margin-top:15px; padding-bottom: 15px; color: red">到底部啦</div> -->
            <!-- <div class="backTop" @click="toTop">
                回到顶部<i class="el-icon-arrow-up"></i>
            </div> -->

            <!-- <div class="copyright-div">
                <div style="font-weight: 700">雷火MTL</div>
                <div style="margin-top: 18px;">网易公司版权所有 ©雷火测试中心 Copyright Leihuo. All Rights Reserved</div>
            </div> -->
        </div>

    </div>
</template>

<script>
import ProblemDetail from '@/components/TestReport/CompatibilityTestReport/ProblemDetail'
import DeviceDetail from '@/components/TestReport/CompatibilityTestReport/DeviceDetail'
import TestDeviceGroup from '@/components/TestReport/CompatibilityTestReport/TestDeviceGroup'
import TaskDetail from '@/components/TestReport/Common/TaskDetail'
export default {
    components: {
        ProblemDetail,
        DeviceDetail,
        TestDeviceGroup,
        TaskDetail
    },
    data() {
        return {
            taskFormList: {
                test_report_title: "",
                app_name: "",
                app_version: "",
                // report_remarks: "",
                high_risk_items: "",
                icon: "",
                test_content: "",
                end_date: "",
            },
            taskFormItemList: [
                {
                    label: '测试报告标题',
                    name: 'test_report_title',
                    type: 'input',
                    class: 'public-dialog-form-item'
                }, 
                {
                    label: '结束日期',
                    name: 'end_date',
                    type: 'input',
                    class: 'public-dialog-form-item'
                }, 
                {
                    label: 'App名称',
                    name: 'app_name',
                    type: 'input',
                    class: 'public-dialog-form-item'
                }, 
                {
                    label: 'App版本',
                    name: 'app_version',
                    type: 'input',
                    class: 'public-dialog-form-item'
                }, 
                {
                    label: '高风险项',
                    name: 'high_risk_items',
                    type: 'input',
                    class: 'public-dialog-form-item'
                },
                {
                    label: '测试内容',
                    name: 'test_content',
                    type: 'input',
                    class: 'public-dialog-form-item'
                }
            ],
            taskDetailList: {
                commonItemArr: [
                    {
                        value: "app_name",
                        label: "App名称",
                        width: "20%",
                    },
                    {
                        value: "start_date",
                        label: "开始时间",
                        width: "20%",
                    },
                    {
                        value: "end_date",
                        label: "结束时间",
                        width: "20%",
                    },
                    {
                        value: "app_version",
                        label: "App版本",
                        width: "20%",
                    },
                    {
                        value: "platform",
                        label: "测试平台",
                        width: "50%",
                    },
                    {
                        value: "test_content",
                        label: "测试内容",
                        width: "100%",
                    },
                    {
                        value: "high_risk_items",
                        label: "高风险项",
                        width: "100%",
                    }
                ]
            },
            isLoading: false,
            failStaticData: "",
            testStaticTableLoading: true,
            basicUploadAppIconFile:'',
            fileList: [],
            // 测试任务详情表单
            taskFormList: {
                test_report_title: "",
                app_name: "",
                app_version: "",
                test_content: "",
                high_risk_items:"",
                icon: "",
                smart_compatibility_report:'',
            },
            itemRules: {
                test_report_title: [{ required: true, message: '请输入测试报告标题', trigger: 'blur' }],
            },
            positionStyle: {top:'750px',left:'1230px'},
            // 问题总数
            totalProblemCount: 0,
            // 问题机型数
            affectDeviceCount: 0,
            isPreview: 0,
            // 测试统计表格数据
            testStaticTable: [],
            testStaticTableColData: [
                {
                    label: '设备类型',
                    prop: 'name'
                },
                {
                    label: '兼容性分数',
                    prop: 'compatibility_score'
                },
                {
                    label: '稳定性分数',
                    prop: 'stability_score'
                },
                {
                    label: 'P1机型数/总机型数',
                    prop: 'p1_pass_rate'
                },
                {
                    label: '通过率',
                    prop: 'device_pass_rate'
                },
                {
                    label: '问题类型',
                    prop: 'q_classification'
                },
                {
                    label: '失败机型数',
                    prop: 'device_num'
                }
            ],
            // 问题
            filter:{
                "q_classification":[{ "value": "q_classification", "label": "问题类型", "data":[{ "value": "", "label": "" }]}],
                "q_level":[{ "value": "q_level", "label": "问题级别", "data":[{ "value": "", "label": "" }]}],
            },
            statisData: {},
            passRateData:[],
            activeName: 'first',
            // 测试任务详情
            taskDetail: {},
            staticData: "",
            axiosList: {
                table_name: this.$route.query.testRecordName,
                test_type: '10',
            },
            reportType: "expert",
            packageType: 0, //0:测试概况,1:问题详情,2:设备详情
            testDialogVisible: false,
            reportTitle: '',
            isExporting: false,
            nameToLevel: {
                '立刻': 'P0',
                '紧急': 'P1',
                '高': 'P2',
                '普通': 'P3',
                '低': 'P4',
            },
            p0Num: 0,
        }
    },
    watch: {
        packageType(newVal,oldVal){
            this.$store.commit("setProblemFilter", []);
        }
    },
    created(){
        if (this.$route.query.isPreview != undefined) {
            this.isPreview = this.$route.query.isPreview;
        }
        if (this.$route.query.packageType != undefined) {
            let packageType = parseInt(this.$route.query.packageType);
            if ([0, 1, 2].includes(packageType)) {
                //参数有效
                this.packageType = packageType;
                if(packageType === 0)   this.activeName='first'
                else if(packageType === 1)  this.activeName='second'
                else this.activeName='third'
            }
        }
        this.getPageData();
        this.getChartData()
    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester;
        }
    },
    methods: {
        changeAppIcon(msg, list){
            if(msg === 'icon'){

                this.$set(this.taskFormList, msg, list);
            }else{
                this.taskFormList = list
            }
        },
        changePackageType(){
            let queryList = JSON.parse(JSON.stringify(this.$route.query))
            queryList.packageType = this.packageType
            this.$publicJS.iframeParentPost(top.location.pathname, queryList, this)
            this.timer = new Date().getTime()
            if(queryList.packageType === 0){
                this.getPageData()
                this.getChartData()
            }
        },



        // 点击设备名称事件
        handleDeviceClick(item){
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            queryList.deviceId = item.id;
            this.$router.push({
                path: "/mtl_test_platform/page/problemDeviceDetail",
                query: queryList
            })
        },


        // 编辑任务详情对话框关闭事件
        handleClose(){
            console.log("关闭对话框")
            this.getPageData()
            this.testDialogVisible = false
        },


        // 测试概况/问题详情/设备详情点击切换事件
        handleClick(target){
            this.activeName = target.name
            // console.log(target.name)
            if(target.name === 'first') this.packageType = 0
            else if(target.name === 'second') this.packageType = 1
            else this.packageType = 2
            // 切换url中的packageType
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            queryList.packageType = this.packageType;
            this.$publicJS.iframeParentPost(top.location.pathname, queryList, this);
        },

        // 获取页面信息
        getPageData() {
            this.isLoading = true;
            this.$codePost('/expertCompatibility/test_basic_info_report/', this.axiosList, { operation: "获取报告数据", failed: true }).then(res => {
                if (res.code == 200) {
                    this.taskDetail = res.data.task_detail;
                    if(this.taskDetail['end_date'] == 'null' || this.taskDetail['end_date'] == null){
                        this.taskDetail['end_date'] = ''
                    }
                    this.staticData = res.data.statistics_data;
                    this.testStaticTable = res.data.form_data;
                    this.testStaticTableLoading = false
                    this.failStaticData = this.handleFailStaticData(this.testStaticTable)
                    // console.log(this.failStaticData)
                    this.passRateData = res.data.statistics_data.pie_chart;
                    this.drawPassRateData(this.passRateData)
                    this.isLoading = false;
                }
                this.$publicJS.iframeLoadingPost(false);
            })
        },

        // 处理失败的统计数据
        handleFailStaticData(data){
            let failData = {}
            data.forEach(item => {
                failData[item.name] = []
                item.question.forEach(item1 => {
                    item1.device_list.forEach(item3 => {     
                        let msg = item3.device
                        if(item3.os)  {
                            msg = msg + "(" + item3.os + ")"
                        }
                        failData[item.name].push(msg)
                    })
                })
            })
            // console.log(failData)
            return failData
        },

        // 绘制通过率饼图
        drawPassRateData(data){
            // console.log(this.failStaticData)
            let failStaticData = this.failStaticData
            let myChart = this.$echarts.init(this.$refs.passRateRef);
            let option = {
                graphic: {
                    type: 'text', // 添加文本类型的图形元素
                    left: 'center', // 水平居中
                    top: 'middle', // 垂直居中
                    style: {
                        text: Number(this.staticData.pass_rate.split('%')[0]).toFixed(2) + '%\n设备通过率', // 显示的文本内容
                        textAlign: 'center', // 文本水平对齐方式
                        fontSize: 15 // 字体大小
                    },
                    formatter: function(params) {
                        return params.data.value + "%";
                    }
                },
                tooltip: {
                    axisPointer: { 
                        type: 'shadow'
                    },
                    formatter : function(params){  
                        var res = '<div>';
  						res += params.name + ": " + params.value + " 台 (" + params.percent + "%)"
                        if(params.data.name == "不通过"){
                            for(var i in failStaticData){
                                res += '<span>'
                                if(failStaticData[i].length > 0){
                                    res += "<br/>" + i + "：<br/>&nbsp;&nbsp;&nbsp;&nbsp;"
                                    for(var j in failStaticData[i]){
                                        if(j % 3 == 0 && j != 0){
                                            res += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;"
                                        }
                                        res = res + failStaticData[i][j]
                                        if(j < failStaticData[i].length - 1){
                                            res = res + ", "
                                        }
                                    }
                                }
                                res += '</span>'
                            }
                        }
                        res += '</div>';
  						return res;
					},
                    confine: false,
                    position: 'inside'
                },
                color: ['#3e71fd', '#ff355f'],
                series: [
                    {
                        type: 'pie',
                        data: data,
                        radius: ['40%', '60%'],
                        label: {
                            show: true,
                            formatter: function(arg){
                                return arg.name + arg.value + '台\n' + arg.percent + '%'
                            }
                        },
                    }
                ]
            };
            myChart.setOption(option);
            window.addEventListener('resize', function() { myChart.resize() });
        },

        
        // 获取测试问题统计信息数据
        getChartData() {
            this.$codePost("/expertCompatibility/expert_test_question_static/", this.axiosList, { operation: "获取统计数据", failed: true }).then(res => {
                if (res.code == 200) {
                    // console.log(res.data)
                    // this.showPage = true;
                    this.statisData = {
                        questionType: res.data.question_type.detail_info,
                        affectDevice: res.data.affect_device,
                        affectUser: res.data.affect_user,
                        questionLevel: this.handleLevelData(res.data.question_level),
                    }
                    this.drawProblemLevelChart(this.statisData.questionLevel);
                    if(!this.isPreview){
                        this.drawProblemDistributionChart(res.data.question_type.detail_info)
                        this.drawAffectDeviceChart(res.data.affect_device)
                    }
                    // console.log(res.data.affect_device)
                    this.computeAffectDeviceNumber(res.data.affect_device)
                }
                this.$publicJS.iframeLoadingPost(false);
            })
        },

        // 处理问题级别数据
        handleLevelData(data){
            let p0Num = 0
            let levelData = {}
            levelData.y_data = data.y_data
            levelData.max_parameter = data.max_parameter
            let x_data = []

            let levelName = data.x_data
            
            let levelList = []
            for(let i = 0; i < levelName.length; i++){
                x_data.push(this.nameToLevel[levelName[i]])
                if(this.nameToLevel[levelName[i]] == 'P0' || this.nameToLevel[levelName[i]] == 'P1'){
                    p0Num += data.y_data[i]
                }
            }
            levelData.x_data = x_data
            // console.log(p0Num)
            this.p0Num = p0Num
            return levelData
            // console.log(levelData)
        },

        // 计算问题机型数
        computeAffectDeviceNumber(data){
            this.affectDeviceCount = 0
            this.affectDeviceCount = this.eachSum(data.y_data, this.affectDeviceCount)
        },

        // 遍历求和方法
        eachSum(data, sum){
            data.forEach(item => {
                sum += item
            })
            return sum
        },
        afterEditMethod(){
            this.getPageData()
        },

        // 绘制问题级别的柱状图
        drawProblemLevelChart(data){
            // console.log(data)
            this.totalProblemCount = 0
            
            this.totalProblemCount = this.eachSum(data.y_data, this.totalProblemCount)
            if(!this.isPreview){
                this.$nextTick(() => {
                    let _this = this
                    let myChart = this.$echarts.init(this.$refs.problemLevelRef);
                    let option = {
                        title: {
                            show: true,
                            text: '级别分布',
                            textStyle: {
                                fontStyle: 'normal',
                                fontWeight: 'normal',
                                fontSize: '16',
                            },
                            top: 'bottom',
                            left: 'center',
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: ''        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        xAxis: {
                            type: 'category',
                            data: data.x_data,
                        },
                        yAxis: {
                            type: 'value',
                            splitLine: {//去除网格线
                                show: false
                            },
                            minInterval: 1,
                        },
                        series: [
                            {
                                name: '问题数量',
                                type: 'bar',
                                barMaxWidth: '25',
                                stack: '总量',
                                data: data.y_data,
                                label: {
                                    show: true,
                                    position: 'top',
                                    formatter: function(arg){
                                        return arg.value + ' 个'
                                    },
                                    color: '#333333',
                                },
                            },
                        ]
                    };
                    myChart.setOption(option);
                    window.addEventListener('resize', function() { myChart.resize() });
                })
            }
        },

        // 绘制影响机型柱状图
        drawAffectDeviceChart(data){
            let x_data = data.x_data
            let y_data = data.y_data
            this.$nextTick(() => {
                let _this = this
                let myChart = this.$echarts.init(this.$refs.affectDeviceRef);
                let option = {
                    title: {
                        show: true,
                        text: '影响机型',
                        textStyle: {
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontSize: '16',
                        },
                        top: 'bottom',
                        left: 'center',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: ''        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: x_data,
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: {//去除网格线
                            show: false
                        },
                        minInterval: 1,
                    },
                    series: [
                        {
                            name: '问题数量',
                            type: 'bar',
                            barMaxWidth: '25',
                            stack: '总量',
                            data: y_data,
                            label: {
                                show: true,
                                position: 'top',
                                formatter: function(arg){
                                    return arg.value + ' 个'
                                },
                                color: '#333333',
                            },
                        },
                    ]
                };
                myChart.setOption(option);
                window.addEventListener('resize', function() { myChart.resize() });
            })
        },

        // 绘制问题分布柱状图，其实还是画饼图比较好
        drawProblemDistributionChart(data){
            // let x_data = []
            // let y_data = []
            // data.forEach((item) => {
            //     x_data.push(item.name)
            //     y_data.push(item.value)
            // })
            // this.$nextTick(() => {
            //     let _this = this
            //     let myChart = this.$echarts.init(this.$refs.problemDistributionRef);
            //     let option = {
            //         title: {
            //             show: true,
            //             text: '问题分布',
            //             textStyle: {
            //                 fontStyle: 'normal',
            //                 fontWeight: 'normal',
            //                 fontSize: '16',
            //             },
            //             top: 'bottom',
            //             left: 'center',
            //         },
            //         tooltip: {
            //             trigger: 'axis',
            //             axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            //                 type: ''        // 默认为直线，可选为：'line' | 'shadow'
            //             }
            //         },

            //         yAxis: {
            //             // name: '问题个数',
            //             type: 'value',
            //             minInterval: 1,
            //             nameTextStyle: {
            //                 fontSize: 10
            //             },
            //             splitLine: {
            //                 show: false
            //             },
            //         },
            //         xAxis: {
            //             type: 'category',
            //             nameTextStyle: {
            //                 fontSize: 12
            //             },
            //             axisLabel: {
            //                 //x轴文字的配置
            //                 show: true,
            //                 interval: 0,//使x轴文字显示全
            //             },
            //             data: x_data,
            //         },
            //         series: [
            //             {
            //                 name: '问题数量',
            //                 type: 'bar',
            //                 barMaxWidth: '25',
            //                 stack: '总量',
            //                 data: y_data,
            //                 label: {
            //                     show: true,
            //                     position: 'top',
            //                     formatter: function(arg){
            //                         return arg.value + ' 个'
            //                     },
            //                     color: '#333333',
            //                 },
            //             },
            //         ]
            //     };
            //     myChart.setOption(option);
            //     window.addEventListener('resize', function() { myChart.resize() });
            // })
            let myChart = this.$echarts.init(this.$refs.problemDistributionRef);
            let option = {
                title: {
                    show: true,
                    text: '问题分布',
                    textStyle: {
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: '16',
                    },
                    top: 'bottom',
                    left: 'center',
                },
                graphic: {
                    type: 'text', // 添加文本类型的图形元素
                    left: 'center', // 水平居中
                    top: 'middle', // 垂直居中
                    style: {
                        text: '问题分布', // 显示的文本内容
                        textAlign: 'center', // 文本水平对齐方式
                        fontSize: 15 // 字体大小
                    },
                    formatter: function(params) {
                        return params.data.value + "%";
                    }
                },
                tooltip: {
                    axisPointer: { 
                        type: 'shadow'
                    },
                    formatter : function(params){  
                        var res = '<div>';
  						res += params.name + ": " + params.value + "个 (" + params.percent + "%)"
  						// res += params.name + "(" + params.percent + "%)"
                        res += '</div>';
  						return res;
					},
                    confine: false,
                    position: 'inside'
                },
                series: [
                    {
                        type: 'pie',
                        data: data,
                        radius: ['40%', '60%'],
                        label: {
                            show: true,
                            formatter: function(arg){
                                // return arg.name + arg.value + '个\n' + arg.percent + '%'
                                return arg.name + '\n(' + arg.percent + '%)'
                            }
                        },
                    }
                ]
            };
            myChart.setOption(option);
            window.addEventListener('resize', function() { myChart.resize() });
        },

        toTop(){
            this.$refs.content.scrollIntoView()
        }
    }
}
</script>

<style lang="less" scoped>
.test-device-static-div {
    width: 350px;
    height: 300px;
    margin: auto;
}
.problem-chart-div {
    height: 250px; 
    width: 90%;
    margin: auto;
}
.rate-text {
    width: 60%;
    margin-left: 4%;
    display: inline-block;
    vertical-align: top;
    padding-top: 1.5rem;
    box-sizing: border-box;
    .rate-text-div {
        width: 90%;
        margin: 0 auto;
        .item {
            border-left: 1px solid #e6e6e6;
            width: 90%;
            margin: 0 0;
            display: inline-block;
            line-height: 1.8rem;
            padding: 0 1rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            font-size: 14px;
            color: rgb(102, 102, 102);
            .title {
                font-size: 16px;
            }
            .title::after {
                content: "："
            }
            .num {
                font-size: 18px;
                color: rgb(0, 0, 0);
            }
        }
    }
}
.rate-pie {
    width: 30%;
    height: 250px;
    display: inline-block;
    vertical-align: top;
    margin-top: -2%;
}
.item-title {
    font-size: 18px;
    margin-left: 25px;
    /*
    margin-top: 5px;
    */
    .title-content {
        margin-left: 5px;
        color: #666666;
        font: 16px 'Microsoft YaHei';
    }
}
.static-table-div {
    margin-left: 26px;
    margin-right: 26px;
    margin-top: 15px;
    margin-bottom: 25px;
}
.btn-group {
    margin-top: 15px;
    text-align: center;
    .el-button {
        margin-left: 20px;
    }
}
.chart-group {
    margin-top: 20px;
}
.detail-div {
    display: flex;
    width: 100%;
    margin-left: 20px;
}
.detail-div .icon-div {
    float: left;
    margin: 5px 5px;
    display: inline-block;
    vertical-align: middle;
}
.detail-div .detail-form {
    position: relative;
    float: left;
    display: inline-block;
    margin-top: 5px;
    width: 90%;
    margin-left: 50px;
}
.decorate-detail {
    margin-left: 20px;
    font-size: 20px;
    font-weight: bold;
}
.el-tabs {
    margin-top: 15px;
}
.el-card {
    margin-top: 30px;
}
.compatibility-div {
    margin-left: 5%;
    margin-right: 5%;
    height: 100%;
    width: 90%;
    
    .reportTitleDiv {
        display: flex;
        justify-content: space-between;
        padding: 5px 0px;
    }

    .reportTitle h3 {
        color: #555;
        font-size: 24px;
        padding: 20px 0px !important;
    }
}
.hover_con{
    position: fixed;
    padding: 10px;
    border: 1px solid #eee;
    background: #fff;
    z-index: 999 !important;
}

.checkout-report{
    position: absolute; top: 20px; right: 20px;
    color: #e6a23c;
    font-weight: 600;
    font-size: 14px;
}
.device-info-span {
    cursor: pointer;
    color: #4876f2;
}
.pass-rate-div{
    width: 100%;
    height: 100%;
}

/deep/ .el-tabs__item:hover {
  color: #333333;
}

/deep/ .el-tabs__item.is-active {
    color: #ffffff;
    background: #3e72fd;
}
.box-card {
    margin: 1rem auto;
    box-sizing: border-box;
}

.el-card /deep/ .el-card__header {
    background-color: #f6f9fc;
    padding: 10px 20px;
}
.edit-icon {
    color: #4876F2;   
    font-weight: bold;
    height: 20px;
    vertical-align: middle;
    cursor: pointer;
    margin-left: -3px;
    margin-top: -3px;
}
.decorate-div {
    width: 3px;
    height: 20px;
    background: #4876f2;
    display: inline-block;
    margin-right: 8px;
    vertical-align: sub;
}

.decorate-title {
    display: inline-block;
    color: #333333;
    font-size: 20px;
}
</style>
<style scoped>

.copyright-div {
    width: 100%;
    margin-top: 40px;
    padding-bottom:40px;
    color: #999999;
    font-size: 14px;
    text-align: center;
}
.backTop{
    position: absolute;
    right: 18px;
    bottom: 20px;
    z-index: 999;
    cursor: pointer;
}
.reportTitle {
    width: 100%;
    height: 110px;
    background: url('../../../assets/img/fastReportheader.png');
    color: white;
    font-size: 36px;
    text-align: center;
    line-height: 110px;
}
.type-card {
    margin-top: 18px;
}
.echarts-tooltip {
  overflow: visible !important;
}

.echarts-tooltip-body {
  overflow-y: auto !important;
  max-height: 100px;
}
</style>