// 我的任务
<template>
    <div class="workstation-content">
        <div class="container">
            <div>
                <el-tabs class="record-tabs" v-model="tableAxiosList.my_task" @tab-click="changeMyTask">
                    <el-tab-pane label="我的任务" name="1"></el-tab-pane>
                    <el-tab-pane label="全部任务" name="0"></el-tab-pane>
                </el-tabs>
                <div style="float:right; display: inline-block;">
                    <el-input
                        class="search-input"
                        placeholder="请输入关键词检索"
                        prefix-icon="el-icon-search"
                        v-model="tableAxiosList.key"
                        @keyup.native.enter="getTestRecord"
                        @blur="searchBlur"
                    >
                    </el-input>
                </div>
            </div>
            <div class="record-table">
                <self-table 
                    ref="recordTableRef"
                    :axios-list="tableAxiosList" 
                    :table-list="selfTableList" 
                />
            </div>
            
        </div>
    </div>
</template>
<script>
export default {
    components: {
    },
    data() {
        return {
            lastSearchValue: "",
            tableAxiosList: {
                project: "",
                key: "",
                my_task: "1",
            },
            selfTableList: {
                backgroundJudgeByStatus: true,
                // postApp: "get_test_apply",
                postApp: "get_qa_task",
                sortKey: "sort_field",
                tableDataKey: "res",
                tableTotalKey: "res_num",
                needQaList: true,
                needStatusList: true,
                columnData: [
                    {
                        titleName: '申请人',
                        propName: 'applicant',
                        // sortFlag: true,
                        minWidth: 95,
                    },
                    {
                        titleName: '项目代号',
                        propName: 'project',
                        // sortFlag: true,
                        minWidth: 100,
                        type: "normal",
                    },
                    {
                        titleName: '测试原因',
                        propName: 'test_reason',
                        sortFlag: false,
                        minWidth: 180,
                        type: "normal",
                    },
                    {
                        titleName: '测试类型',
                        propName: 'test_type',
                        // sortFlag: true,
                        minWidth: 120,
                        type: "normal",
                    },
                    {
                        titleName: '最迟报告日期',
                        propName: 'end_date',
                        // sortFlag: true,
                        minWidth: 120,
                        type: "normal",
                    },
                    {
                        titleName: '测试进度',
                        propName: 'test_progress',
                        sortFlag: false,
                        align: 'left'
                    },
                    {
                        titleName: '详细信息',
                        propName: 'testDetail',
                        sortFlag: false,
                        minWidth: 60,
                    },
                    {
                        titleName: '测试状态',
                        propName: 'test_status',
                        // sortFlag: true,
                        minWidth: 80,
                    },
                    {
                        titleName: 'MTL接口人',
                        propName: 'qa_list',
                        // sortFlag: true,
                        minWidth: 80,
                    },
                    {
                        titleName: '测试报告',
                        propName: 'testReport',
                        sortFlag: false,
                        minWidth: 60,
                    },
                    {
                        titleName: '操作',
                        propName: 'operation',
                        sortFlag: false,
                        minWidth: this.$store.getters.getIsTester ? 150 : 150,
                        fixed: 'right',
                        align: this.$store.getters.getIsTester ? 'center' : 'center',
                        canStartTest: true,
                        canReTest: true,
                        canSendReport: true,
                    }
                ],
            },
        }
    },
    props:{
        
    },
    created(){
        if(!this.isTester && !this.isAdmin){
            this.$store.commit("setPageIsLoading", true);
            this.$router.push({
                path: '/mtl_test_platform/page/expertServices/serviceOrdersList',
                query: { project: this.project }
            })
            setTimeout(() => {
                this.$message.error("您没有权限访问此界面，将为您跳转到测试申请记录界面！");
            }, 1000)
        }else{
            this.tableAxiosList.project = this.$store.getters.getProjectCode;
        }
    },
    mounted(){
        this.$store.commit("setPageIsLoading", false);
    },
    computed:{
        isTester() {
            return this.$store.getters.getIsTester
        },
        isAdmin() {
            return this.$store.getters.getIsAdmin
        },
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
    },
    watch:{
    },
    methods:{
        //切换是全部申请还是我的申请
        changeMyTask() {
            if (this.tableAxiosList.my_task != "old") {
                if(this.tableAxiosList.my_task == "1"){
                    this.selfTableList.postApp = "get_qa_task"
                    this.selfTableList.project = this.projectCode
                }
                else{
                    this.selfTableList.postApp = "get_test_apply"
                    this.selfTableList.project = this.projectCode
                }
                
                this.getTestRecord();
            } else {
                window.location.href = "http://mtl.leihuo.netease.com:8000/compatibilityTest/ApplicationResult1/";
            }
        },
        //搜索框失焦时（不能用change，因为change会在值发生变化回车后触发，导致事件二次触发）
        searchBlur(){
            //如果搜索值发生变化
            if(this.lastSearchValue != this.tableAxiosList.key){
                this.getTestRecord();
            }
        },
        //获取申请记录
        getTestRecord() {
            this.lastSearchValue = this.tableAxiosList.key;
            this.$refs.recordTableRef.tableKeyList.page = 1;
            this.$refs.recordTableRef.getTableData();
        },
    },
}
</script>
    
<style scoped>
    .workstation-content {
        width: 100%;
        flex: 1;
        margin: 20px;
        border-radius: 4px;
        background: #fff;
        display: flex;
        flex-direction: column;
    }
    .list-title {
        padding: 0 20px;
        font-size: 16px;
        font-weight: 700;
        color: #333333;
        height: 47px;
        width: calc(100% - 40px);
        line-height: 47px;
        background: #fff;
        border-radius: 4px 4px 0 0;
        border-bottom: 1px solid rgba(97, 119, 255, 0.1);
    }
    .list-container {
        flex: 1;
        overflow: auto;
        margin-top: 47px;
        padding: 20px;
    }
    .container{
        width: 98%;
        min-width: 1200px;
        margin: 2rem auto;
    }
    .record-tabs {
        width: 10rem;
        margin-left: 1rem;
        display: inline-block;
    }
</style>

<style>
</style>