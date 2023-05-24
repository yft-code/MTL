<template>
    <div id="performanceTestReportPC" class="performance-test-report">
        <div class="reportTitle" :style="this.$route.path=='/mtl_test_platform/page/performancePCTestReport' ? {'margin-top':'67px'} : {}">
            <span>{{ taskDetail['test_report_title'] || "" }}</span>
        </div>
        <div class="container">
            <!-- 测试信息 -->
            <div>
                <!-- <test-detail v-loading="isLoading" :axios-list="axiosList" :isPreview="isPreview" :taskDetail="taskDetail" @afterEdit="afterEditMethod"/> -->
                <task-detail 
                    :axios-list="axiosList" 
                    :isPreview="isPreview" 
                    :taskDetail="taskDetail" 
                    @afterEdit="afterEditMethod"
                    :taskDetailList="taskDetailList"
                    :editUrl="'/mobilePerfTest/edit_report_msg/'"
                    :taskFormItemList="taskFormItemList"
                    :taskFormList="taskFormList"
                    @changeAppIcon="changeAppIcon"
                    />
            </div>

            <!-- 备注 -->
            <remark :isPreview="isPreview" :taskDetail="taskDetail" :updateUrl="'/pcPerfTest/edit_report_remarks/'" @cancelEditRemark="cancelEditRemark" @updateRemark="getPageData"></remark>
        
            <!-- 报告预览页面 -->
            <div v-if="isPreview">
                <current-test v-if="!compareData || compareData.length === 0" :axios-list="axiosList" :key="timer" :isPreview="isPreview" :currentStaticData="currentStaticData"></current-test>
                <compare-reports v-else :axios-list="axiosList" :key="timer" :isPreview="isPreview" :compareData="compareData" :compareMesg="compareMesg"></compare-reports>
            </div>

            <!-- 页面报告 -->
            <div v-else>
                <div class="selectPackage">
                    <el-radio-group v-model="packageType" @change="changePackageType">
                        <el-radio-button :label="0">对比报告</el-radio-button>
                        <el-radio-button :label="1">单次数据</el-radio-button>
                    </el-radio-group>
                </div> 
                <!--本次测试-->
                <div v-if="packageType == '1'">
                    <current-test :axios-list="axiosList" :key="timer" :isPreview="isPreview" :currentStaticData="currentStaticData"></current-test>
                </div>
                <!--对比报告-->
                <div v-else-if="packageType == '0'">
                    <compare-reports :axios-list="axiosList" :key="timer" :isPreview="isPreview" :compareData="compareData" :compareMesg="compareMesg"></compare-reports>
                </div>
            </div>
        </div>

    </div>
</template>

<script> 
// import TestDetail from '@/components/TestReport/PerformanceTestReportPC/TestDetail'
import TaskDetail from '@/components/TestReport/Common/TaskDetail'
import CurrentTest from '@/components/TestReport/PerformanceTestReportPC/CurrentTest'
import CompareReports from '@/components/TestReport/PerformanceTestReportPC/CompareReports'
import Remark from '@/components/TestReport/Common/Remark'
export default {
    components: {
        TaskDetail,
        CurrentTest,
        CompareReports,
        Remark
    },
    data() {
        return {
            taskFormList: {
                test_report_title: "",
                app_name: "",
                test_version: "",
                // report_remarks: "",
                icon: "",
                end_date: "",
            },
            taskFormItemList: [
                {
                    label: '测试报告标题',
                    name: 'test_report_title',
                    type: 'input',
                    // class: 'public-dialog-form-item'
                }, {
                    label: 'App名称',
                    name: 'app_name',
                    type: 'input',
                    // class: 'public-dialog-form-item'
                }, {
                    label: '测试版本',
                    name: 'test_version',
                    type: 'input',
                    // class: 'public-dialog-form-item'
                }, 
                {
                    label: '结束日期',
                    name: 'end_date',
                    type: 'input',
                    class: 'public-dialog-form-item'
                },
                // {
                //     label: '备注',
                //     name: 'report_remarks',
                //     type: 'input',
                //     class: 'public-dialog-form-item'
                // }
            ],
            taskDetailList: {
                logo: "app_icon",
                commonItemArr: [
                    {
                        value: "test_report_title",
                        label: "报告名称",
                        width: "25%",
                    },
                    {
                        value: "app_name",
                        label: "项目名称",
                        width: "25%",
                    },
                    {
                        value: "test_version",
                        label: "测试版本",
                        width: "25%",
                    },
                    {
                        value: "start_date",
                        label: "测试日期",
                        width: "25%",
                    },
                    {
                        value: "device",
                        label: "测试设备",
                        width: "100%",
                    },
                ]
            },
            isLoading: false,
            projectCode: '',
            isPreview: 0,
            axiosList:{
                table_name: '',
                test_type: '',
                id: '',
            },
            packageType: '0', //1:本次测试,0:对比测试页面
            timer: '',
            taskDetail: {},
            currentStaticData: [],
            compareData: [],
            compareMesg: [],
            oldRemark: "",
        }
    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester;
        },
    },
    created() {
        if (this.$route.query.project != undefined) {
            this.projectCode = this.$route.query.project;
        }
        if (this.$route.query.isPreview != undefined) {
            this.isPreview = this.$route.query.isPreview;
        }
        this.$set(this.axiosList, 'table_name', this.$route.query.testRecordName)
        this.$set(this.axiosList, 'test_type', '21')
        this.$set(this.axiosList, 'id', this.$route.query.applicationId)
        if (this.$route.query.packageType != undefined) {
            let packageType = parseInt(this.$route.query.packageType);
            if ([0, 1].includes(packageType)) {
                //参数有效
                this.packageType = packageType;
            }
        }
        this.getPageData()
        this.getCompareData()
    },
    mounted() {
        this.$store.commit("setPageIsLoading", false);
    },
    watch: {
        compareData(newData){
            if(!newData){
                this.packageType = '1'
            }
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
        },

        getPageData(){
            this.isLoading = true;
            this.$codePost('/pcPerfTest/test_basic_info_report/', this.axiosList, { operation: "获取报告数据", failed: true }).then(res => {
                if (res.code == 200) {
                    this.taskDetail = res.data.task_detail;
                    this.oldRemark = this.taskDetail['report_remarks']
                    this.currentStaticData = res.data.statistics_data;
                    this.isLoading = false;
                }
            })
        },

        cancelEditRemark(){
            this.taskDetail['report_remarks'] = this.oldRemark
        },

        getCompareData(){
            this.$codePost('/pcPerfTest/get_compare_report_data/', this.axiosList, { operation: "获取报告数据", failed: true }).then(res => {
                if (res.code == 200) {
                    this.compareData = res.data.compare_data
                    this.compareMesg = res.data.compare_msg
                }
            })
        },

        afterEditMethod(){
            this.getPageData()
        },

    },
}
</script>

<style scoped>
.container {
    width: 90%;
    min-width: 1200px;
    margin: 2rem auto;
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
.remark-span{
    position: relative;
    top: 12px;
    left: 30px;
    z-index: 999;
    font-size: 16px;
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
.box-card {
    margin: 1rem auto;
    box-sizing: border-box;
}

.el-card /deep/ .el-card__header {
    background-color: #f6f9fc;
    padding: 10px 20px;
}

.export-button {
    float: right;
    margin-top: 0.3rem;
    margin-right: 1rem;
}
</style>
