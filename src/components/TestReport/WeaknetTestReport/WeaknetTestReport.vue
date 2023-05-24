<template>
    <div id="weaknetTestReport" class="performance-test-report">
        <!-- 报告标题 -->
        <div class="reportTitle" :style="this.$route.path=='/mtl_test_platform/page/weaknetTestReport' ? {'margin-top':'67px'} : {}">
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
                    :editUrl="'/mobileWeaknetTest/edit_report_msg/'"
                    :taskFormItemList="taskFormItemList"
                    :taskFormList="taskFormList"
                    @changeAppIcon="changeAppIcon"
                    />
            </div>

            <!-- 备注-->
            <remark :isPreview="isPreview" :taskDetail="taskDetail" :updateUrl="'/mobileWeaknetTest/edit_report_remarks/'" @cancelEditRemark="cancelEditRemark" @updateRemark="getPageData"></remark>

            <!-- 测试结论 -->
            <conclusion :conclusionData="conclusionData"></conclusion>

            <current-test :axios-list="axiosList" :isPreview="isPreview" :currentStaticData="currentStaticData"></current-test>
        </div>
    </div>
</template>

<script>
import TaskDetail from '@/components/TestReport/Common/TaskDetail'
import CurrentTest from '@/components/TestReport/WeaknetTestReport/CurrentTest'
import Conclusion from '@/components/TestReport/WeaknetTestReport/Conclusion'
import Remark from '@/components/TestReport/Common/Remark'
export default {
    components: {
        TaskDetail,
        CurrentTest,
        Conclusion,
        Remark
    },
    data() {
        return {
            isLoading: false,
            projectCode: '',
            isPreview: 0,
            axiosList:{
                table_name: '',
                test_type: '',
                id: '',
            },
            // packageType: 0, //0:本次测试,1:对比测试页面
            taskDetail: {},
            currentStaticData: [],  // 当前测试的统计数据
            // compareData: [], // 对比测试记录
            oldRemark: "",
            appUrl: "mobileWeaknetTest",
            conclusionData: "",
            taskDetailList: {
                logo: "app_icon",
                commonItemArr: [
                    {
                        value: "app_name",
                        label: "App名称",
                        width: "20%",
                    },
                    // {
                    //     value: "test_report_title",
                    //     label: "报告名称",
                    //     width: "50%",
                    // },
                    {
                        value: "test_version",
                        label: "测试版本",
                        width: "20%",
                    },
                    {
                        value: "start_date",
                        label: "测试日期",
                        width: "20%",
                    },
                ]
            },
            taskFormList: {
                test_report_title: "",
                app_name: "",
                test_version: "",
                // report_remarks: "",
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
                // {
                //     label: '备注',
                //     name: 'report_remarks',
                //     type: 'input',
                //     class: 'public-dialog-form-item'
                // }
            ],
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
        
        getPageData(){
            this.isLoading = true;
            this.$codePost('/' + this.appUrl + '/test_basic_info_report/', this.axiosList, { operation: "获取报告数据", failed: true }).then(res => {
                if (res.code == 200) {
                    // console.log(res.data)
                    this.taskDetail = res.data.task_detail;
                    this.oldRemark = this.taskDetail['report_remarks']
                    this.conclusionData = res.data.task_detail.conclusion
                    this.currentStaticData = res.data.statistics_data;
                    this.isLoading = false;
                }
            })
        },

        afterEditMethod(){
            this.getPageData()
        },


        cancelEditRemark(){
            this.taskDetail['report_remarks'] = this.oldRemark
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
</style>