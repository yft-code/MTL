<template>
    <div id="performanceTestReport" class="performance-test-report">
        <!-- 报告标题 -->
        <div class="reportTitle" :style="this.$route.path=='/mtl_test_platform/page/performanceTestReport' ? {'margin-top':'67px'} : {}">
            <span>{{ taskDetail['test_report_title'] || "" }}</span>
        </div>
        <div class="container">
            <!-- 测试信息 -->
            <div>
                <task-detail 
                    :axios-list="axiosList" 
                    :isPreview="isPreview" 
                    :taskDetail="taskDetail" 
                    @afterEdit="getPageData"
                    :taskDetailList="taskDetailList"
                    :editUrl="'/mobilePerfTest/edit_report_msg/'"
                    :exportUrl="''"
                    :taskFormItemList="taskFormItemList"
                    :taskFormList="taskFormList"
                    @changeAppIcon="changeAppIcon"
                    />
            </div>

            <!-- 备注 -->
            <!-- <remark :isPreview="isPreview" :taskDetail="taskDetail" :updateUrl="'/mobilePerfTest/edit_report_remarks/'" @cancelEditRemark="cancelEditRemark" @updateRemark="getPageData"></remark> -->

            <!-- <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <div class="decorate-div"></div>
                    <div class="decorate-title">
                        测试结论
                        <i v-if="!conclusionFlag && !isPreview" 
                            class='el-icon-edit-outline edit-icon' 
                            style="margin-top:0;" 
                            @click="editConclusion"
                        ></i>
                    </div>
                </div>
                <div class="card-content-div">
                    <div class="task-content-div">
                        <div v-if="!conclusionFlag" style="margin-left: 10px">
                            <span class="comment">{{taskDetail['test_conclusion'] ? taskDetail['test_conclusion'] : '无'}}</span>
                        </div>
                        <div v-else  style="margin-left: 10px">
                            <el-input v-model="taskDetail['test_conclusion']" type="textarea" :autosize="{ minRows: 2}" style="width: 90%" placeholder="请填入测试结论"></el-input>
                            <el-button type="primary" size="mini" style="margin-left: 10px;" @click="updateConclusion">确定</el-button>
                            <el-button size="mini" @click="cancelEditConclusion">取消</el-button>
                        </div>
                    </div> 
                </div>
            </el-card> -->

            <!-- <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <div class="decorate-div"></div>
                    <div class="decorate-title" style="font-size: 18px;">
                        测试场景
                    </div>
                </div>
                <div class="card-content-div">
                    <el-table :data="[]" :show-header="false" border :cell-style="{padding:2+'px'}">
                        <el-table-column label="场景名称">
                            <template slot-scope="scope">
                                <span>{{scope.row['scene_name']}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="场景说明">
                            <template slot-scope="scope">
                                <span>{{scope.row['description']}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card> -->

            <div v-if="compareData">
                <compare-reports 
                    :axios-list="axiosList" 
                    :compareSet="taskDetail.compare_set ? taskDetail.compare_set : 'scene-device-class'"
                    :isPreview="isPreview" 
                    :compareData="compareData" 
                    :compareMesg="compareMesg" 
                    :taskDetail="taskDetail"
                    @cancelEditRemark="cancelEditRemark"
                    @afterEdit="getPageData"></compare-reports>
            </div>

            <div v-else>
                <current-test 
                    :compareSet="taskDetail.compare_set ? taskDetail.compare_set : 'scene-device-class'" 
                    :axios-list="axiosList" :isPreview="isPreview" 
                    :currentStaticData="currentStaticData"
                    :taskDetail="taskDetail"
                    @cancelEditRemark="cancelEditRemark"></current-test>
            </div>
        </div>
    </div>
</template>

<script>
import TaskDetail from '@/components/TestReport/Common/TaskDetail'
import CurrentTest from '@/components/TestReport/PerformanceTestReport/CurrentTest'
import Remark from '@/components/TestReport/Common/Remark'
import CompareReports from '@/components/TestReport/PerformanceTestReport/CompareReports'
export default {
    components: {
        TaskDetail,
        CurrentTest,
        Remark,
        CompareReports
    },
    data() {
        return {
            oldConclusion: "",
            isLoading: false,
            projectCode: '',
            isPreview: 0,
            axiosList:{
                table_name: '',
                test_type: '',
                id: '',
            },
            packageType: 0, //0:本次测试,1:对比测试页面
            taskDetail: {},
            currentStaticData: [],  // 当前测试的统计数据
            compareData: [], // 对比测试记录
            remarkFlag: 0,
            conclusionFlag: 0,
            oldRemark: "",
            oldAndroidRemark: "",
            oldIOSRemark: "",
            taskDetailList: {
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
                    {
                        value: "end_date",
                        label: "结束日期",
                        width: "20%",
                    },
                    {
                        value: "device",
                        label: "测试设备",
                        width: "95%",
                    },
                    {
                        value: "test_conclusion",
                        label: "测试结论",
                        width: "90%",
                    }
                ]
            },
            taskFormList: {
                test_report_title: "",
                app_name: "",
                test_version: "",
                icon: "",
                end_date: "",
                test_conclusion: "",
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
                {
                    label: '测试结论',
                    name: 'test_conclusion',
                    type: 'input',
                    class: 'public-dialog-form-item'
                },
            ],
            compareMesg: {},
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
        basicColumnData(){
            return this.$store.getters.getPerformanceFiledList;
        },
    },
    watch:{
    },
    methods:{
        changePackageType(){
            let queryList = JSON.parse(JSON.stringify(this.$route.query))
            queryList.packageType = this.packageType
            this.$publicJS.iframeParentPost(top.location.pathname, queryList, this)
            this.timer = new Date().getTime()
        },
        changeAppIcon(msg, list){
            if(msg === 'icon'){

                this.$set(this.taskFormList, msg, list);
            }else{
                this.taskFormList = list
            }
        },
        cancelEditRemark(type){
            this.remarkFlag = !this.remarkFlag
            if(type == 'android'){
                this.taskDetail['android_remarks'] = this.oldAndroidRemark
            }else if(type == 'ios'){
                this.taskDetail['ios_remarks'] = this.oldIOSRemark
            }else{
                this.taskDetail['report_remarks'] = this.oldRemark
            }
        },
        getPageData(){
            this.isLoading = true;
            this.$codePost('/mobilePerfTest/test_basic_info_report/', this.axiosList, { operation: "获取报告数据", failed: true }).then(res => {
                if (res.code == 200) {
                    // console.log(res.data)
                    this.taskDetail = res.data.task_detail;
                    this.handleDeviceType()
                    // console.log(this.taskDetail)
                    this.oldRemark = this.taskDetail['report_remarks']
                    this.oldAndroidRemark = this.taskDetail['android_remarks']
                    this.oldIOSRemark = this.taskDetail['ios_remarks']
                    this.oldConclusion = this.taskDetail['test_conclusion']
                    this.currentStaticData = res.data.statistics_data;
                    this.compareData = res.data.compare_data;
                    this.compareMesg = this.handleMsg(res.data.compare_msg);
                    this.isLoading = false;
                }
            })
        },
        handleDeviceType(){
            let device = this.taskDetail['device']
            let iosIndexList = []
            let androidIndexList = []
            device.forEach((item, index) => {
                if(item.os.indexOf('Android') !== -1){
                    androidIndexList.push(index)
                }else{
                    iosIndexList.push(index)
                }
            })
            // console.log(iosIndexList, androidIndexList)
            this.$set(this.taskDetail, 'iosIndexList', iosIndexList)
            this.$set(this.taskDetail, 'androidIndexList', androidIndexList)
            // console.log(this.taskDetail)
        },
        handleMsg(data){
            let afterData = {}
            for(let k in data){
                afterData[k] = []
                data[k].forEach(item => {
                    item['remark'] = '变动备注'
                    afterData[k].push(item)
                })
            }
            // console.log(afterData)
            return afterData
        },

        editConclusion(){
            this.conclusionFlag = 1
        },

        updateConclusion(){
            let list = {
                id: this.$route.query.applicationId,
                table_name: this.$route.query.testRecordName,
                test_conclusion: this.taskDetail['test_conclusion']
            }
            this.$codePost('/mobilePerfTest/edit_report_remarks/', list, { operation: "编辑结论", success: true, failed: true }).then(res => {
                if (res.code == 200) {
                    this.getPageData()
                    this.conclusionFlag = 0
                }
            })
        },

        cancelEditConclusion(){
            this.conclusionFlag = !this.conclusionFlag
            this.taskDetail['test_conclusion'] = this.oldConclusion
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
.box-card {
    margin: 1rem auto;
    box-sizing: border-box;
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
.edit-icon {
    color: #4876F2;   
    font-weight: bold;
    height: 20px;
    vertical-align: middle;
    cursor: pointer;
    margin-left: -3px;
    margin-top: -3px;
}
.comment{
    white-space:pre-wrap;
    font-size: 14px;
}
.el-card /deep/ .el-card__header {
    background-color: #f6f9fc;
    padding: 10px 20px;
}
</style>