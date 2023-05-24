<template>
    <div id="protocolTestReport" class="performance-test-report">
        <!-- 报告标题 -->
        <div class="reportTitle" :style="this.$route.path=='/mtl_test_platform/page/protocolTestReport' ? {'margin-top':'67px'} : {}">
            <span>{{ taskDetail['test_report_title'] || "" }}</span>
        </div>
        <div class="container">
            <!-- 测试信息 -->
            <div>
                <task-detail 
                    :axios-list="axiosList" 
                    :isPreview="isPreview" 
                    :taskDetail="taskDetail" 
                    @afterEdit="afterEditMethod"
                    :taskDetailList="taskDetailList"
                    :editUrl="'/protocolTest/edit_report_msg/'"
                    :taskFormItemList="taskFormItemList"
                    :taskFormList="taskFormList"
                    @changeAppIcon="changeAppIcon"
                    />
            </div>

            <!-- 备注 -->
            <remark :isPreview="isPreview" :taskDetail="taskDetail" :updateUrl="'/protocolTest/edit_report_remarks/'" @cancelEditRemark="cancelEditRemark" @updateRemark="getPageData"></remark>

            <!-- 
            <div v-if="isPreview">
                <test-result :allTestData="allTestData" :isPreview="isPreview"></test-result>
                <problem-list :questionData="questionData" :criticalQuestion="criticalQuestion" :isPreview="isPreview"></problem-list>
            </div>

            <div v-else>
                <div class="selectPackage">
                    <el-radio-group v-model="packageType" @change="changePackageType">
                        <el-radio-button :label="0">测试结果</el-radio-button>
                        <el-radio-button :label="1">问题列表</el-radio-button>
                    </el-radio-group>
                </div> 
                <div v-if="packageType == '0'">
                    <test-result :allTestData="allTestData" :isPreview="isPreview"></test-result>
                </div>
                <div v-else-if="packageType == '1'">
                    <problem-list :questionData="questionData" :criticalQuestion="criticalQuestion" :isPreview="isPreview"></problem-list>
                </div>
            </div> 
            -->

            <!-- <all-report :allTestData="allTestData" :isPreview="isPreview" :questionData="questionData" :criticalQuestion="criticalQuestion"></all-report> -->
            <all-report-new :allTestData="allTestData" :isPreview="isPreview" :questionData="questionData" :criticalQuestion="criticalQuestion"></all-report-new>
        </div>
    </div>
</template>

<script>
import TaskDetail from '@/components/TestReport/Common/TaskDetail'
import TestResult from '@/components/TestReport/ProtocolTestReport/TestResult'
import ProblemList from '@/components/TestReport/ProtocolTestReport/ProblemList'
import AllReport from '@/components/TestReport/ProtocolTestReport/AllReport'
import AllReportNew from '@/components/TestReport/ProtocolTestReport/AllReportNew'
import Remark from '@/components/TestReport/Common/Remark'
export default {
    components: {
        TaskDetail,
        TestResult,
        ProblemList,
        AllReport,
        AllReportNew,
        Remark
    },
    data() {
        return {
            taskDetailList: {
                commonItemArr: [
                    {
                        value: "app_name",
                        label: "App名称",
                        width: "25%",
                    },
                    // {
                    //     value: "test_report_title",
                    //     label: "报告名称",
                    //     width: "50%",
                    // },
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
                        value: "end_date",
                        label: "结束日期",
                        width: "25%",
                    },
                ]
            },
            taskFormList: {
                test_report_title: "",
                app_name: "",
                test_version: "",
                // report_remarks: "",
                end_date: "",
                icon: "",
            },
            taskFormItemList: [
                {
                    label: '测试报告标题',
                    name: 'test_report_title',
                    type: 'input',
                    class: 'public-dialog-form-item'
                }, {
                    label: 'App名称',
                    name: 'app_name',
                    type: 'input',
                    class: 'public-dialog-form-item'
                }, {
                    label: '测试版本',
                    name: 'test_version',
                    type: 'input',
                    class: 'public-dialog-form-item'
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
            isLoading: false,
            projectCode: '',
            isPreview: 0,
            axiosList:{
                table_name: '',
                test_type: '',
                id: '',
            },
            packageType: '0', //0测试结果，1问题列表
            taskDetail: {},
            oldRemark: "",

            allTestData: {},
            questionStaticData: {},
            recordData: [],
            questionData: [],
            criticalQuestion: {}
        }
    },
    props:{
        
    },
    created(){
        if (this.$route.query.project != undefined) {
            this.projectCode = this.$route.query.project;
        }
        if (this.$route.query.isPreview != undefined) {
            this.isPreview = this.$route.query.isPreview;
        }
        this.$set(this.axiosList, 'table_name', this.$route.query.testRecordName)
        this.$set(this.axiosList, 'test_type', '20')
        this.$set(this.axiosList, 'id', this.$route.query.applicationId)
        this.getPageData()   // 获取页面数据【测试任务详情+测试结果】
    },
    mounted(){
        
    },
    computed:{
        
    },
    watch:{
    },
    methods:{
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
        cancelEditRemark(){
            this.taskDetail['report_remarks'] = this.oldRemark
        },
        getPageData(){
            this.isLoading = true;
            this.$codePost('/protocolTest/test_basic_info_report/', this.axiosList, { operation: "获取报告数据", failed: true }).then(res => {
                if (res.code == 200) {
                    this.taskDetail = res.data.task_detail;
                    if(this.taskDetail['end_date'] == 'null' || this.taskDetail['end_date'] == null){
                        this.taskDetail['end_date'] = ''
                    }
                    this.oldRemark = this.taskDetail['report_remarks']
                    this.allTestData = res.data.statistics_data;
                    // 后端通过与不通过数据写反，这里做调整
                    let temp = this.allTestData.number_data.not_pass_protocol_num
                    this.allTestData.number_data.not_pass_protocol_num = this.allTestData.number_data.pass_protocol_num
                    this.allTestData.number_data.pass_protocol_num = temp
                    // console.log(this.allTestData)
                    
                    this.questionStaticData = res.data.statistics_data.question_static
                    this.recordData = res.data.statistics_data.record_data
                    this.questionData = res.data.statistics_data.question_data
                    this.criticalQuestion = res.data.statistics_data.critical_question
                    // this.criticalQuestion = this.getCriticalQuestion(res.data.statistics_data.critical_question)
                    // console.log(this.criticalQuestion)
                    this.isLoading = false;
                }
            })
        },

        getCriticalQuestion(data){
            let result = []
            for(let k in data){
                // console.log(k)
                result = result.concat(data[k])
            }
            return result
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
    margin: 0 auto;
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
.performance-test-report{
    background-color: #f3f4f6;
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
.decorate-div {
    width: 3px;
    height: 20px;
    background: #4876f2;
    display: inline-block;
    margin-right: 8px;
    vertical-align: sub;
}

.comment{
    white-space:pre-wrap;
    font-size: 14px;
}
</style>