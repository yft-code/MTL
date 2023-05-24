<template>
    <div class="container" style="margin-top: 80px;">
        <edit-question-p-c v-if="isPC == 'questionTablePC'" ref="editQuestionPCRef" :table-name="tableName" @afterEdit="afterEdit"/>
        <edit-question v-else-if="isPC == 'questionTable'" ref="editQuestionRef" :table-name="tableName" @afterEdit="afterEdit"/>
        <div style="margin-bottom: 1rem;">
            <span @click="jumpPage()" style="cursor:pointer">开始测试</span>
            &nbsp;
            <i class="el-icon-arrow-right"></i> 
            &nbsp;
            <span class="blue-span">问题列表</span>
        </div>
        <div style="margin-bottom:1rem;">
            <el-button type="primary" size="small"  @click="addCaseQuestion">新增问题</el-button>
        </div>
        <self-table 
            ref="questionTableRef"
            :axios-list="{ table_name: tableName }" 
            :table-list="tableList" 
            :table-type="`questionTable`"
            @editCaseQuestion="editCaseQuestion" 
            @deleteCaseQuestion="deleteCaseQuestion"
            />
    </div>
</template>
<script>
import EditQuestion from "@/components/StartTest/Compatibility/EditQuestion"
import EditQuestionPC from '@/components/StartTest/CompatibilityPC/EditQuestion'
export default {
    components: {
        EditQuestion,
        EditQuestionPC
    },
    data() {
        return {
            isPC: "",
            tableName: "",
            //问题表格相关数据
            tableList: {
                postApp: "get_expert_test_question",
                postAppPrefix: "expertCompatibility",
                sortKey: "sort_field",
                tableDataKey: "data",
                columnData: [
                    {
                        titleName: "",
                        propName: "index",
                        minWidth: 40,
                    },
                    {
                        titleName: '问题编号',
                        propName: 'q_number',
                        sortFlag: true,
                        type: "normal",
                    },
                    {
                        titleName: '问题分类',
                        propName: 'q_category',
                        sortFlag: true,
                        type: "normal",
                    },
                    {
                        titleName: '问题类型',
                        propName: 'q_classification',
                        sortFlag: true,
                        type: "normal",
                    },
                    {
                        titleName: '问题级别',
                        propName: 'q_level',
                        minWidth: 80,
                        sortFlag: true,
                    },
                    {
                        titleName: '问题重现率',
                        propName: 'recurrent_rate',
                        sortFlag: true,
                        type: "normal",
                    },
                    {
                        titleName: '问题描述',
                        propName: 'q_description',
                        align: 'left',
                        minWidth: 250,
                    },
                    {
                        titleName: '问题状态',
                        propName: 'q_name',
                        minWidth: 50,
                    },
                    {
                        titleName: 'MTL接口人',
                        propName: 'test_qa',
                    },
                    {
                        titleName: '图片',
                        propName: 'picture_list',
                        minWidth: 150,
                    },
                    {
                        titleName: '操作',
                        propName: 'operation',
                        minWidth: 170,
                        fixed: 'right',
                        canEditCaseQuestion: true,
                        canDeleteCaseQuestion: true,
                    },
                ],
            },
        }
    },
    computed: {
    },
    created() {
        this.tableName = this.$route.query.testRecordName;
        // console.log(this.$route.path.split('/')[3])
        if(this.$route.path.split('/')[3] == 'questionTablePC'){
            this.isPC = "questionTablePC"
            this.tableList.postAppPrefix = "expertCompatibilityPC"
        }else if(this.$route.path.split('/')[3] == 'questionTable'){
            this.isPC = "questionTable"
            this.tableList.postAppPrefix = "expertCompatibility"
        }else if(this.$route.path.split('/')[3] == 'protocolQuestionTable'){
            this.isPC = "protocolQuestionTable"
            this.tableList.postAppPrefix = "protocolTest"
        }
    },
    mounted() {
        this.$store.commit("setPageIsLoading", false);
    },
    methods: {
        jumpPage(){
            if(this.isPC == "questionTablePC"){
                this.$router.push({
                    path: '/mtl_test_platform/page/compatibilityStartTestPC',
                    query: this.$route.query
                })
            }else if(this.isPC == "questionTable"){
                this.$router.push({
                    path: '/mtl_test_platform/page/compatibilityStartTest',
                    query: this.$route.query
                })
            }else if(this.isPC == "protocolQuestionTable"){
                this.$router.push({
                    path: '/mtl_test_platform/page/protocolStartTest',
                    query: this.$route.query
                })
            }
        },

        //打开问题列表模态框
        openQuestionDialog() {
            this.$refs.questionShowRef.openDialog();
        },

        //新增问题
        addCaseQuestion() {
            if(this.isPC == "questionTablePC"){
                this.$refs.editQuestionPCRef.addCaseQuestion();
            }else if(this.isPC == "questionTable"){
                this.$refs.editQuestionRef.addCaseQuestion();
            }
        },

        //编辑问题
        editCaseQuestion(item) {
            if(this.isPC == "questionTablePC"){
                this.$refs.editQuestionPCRef.editCaseQuestion(item);
            }else if(this.isPC == "questionTable"){
                this.$refs.editQuestionRef.editCaseQuestion(item);
            }
        },

        //编辑后
        afterEdit(){
            this.$refs.questionTableRef.getTableData();
        },

        //删除问题
        deleteCaseQuestion(item) {
            this.$selfConfirm("确定删除该用例问题吗？", '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                //确认
                let list = { question_id: item.id, table_name: this.tableName };
                if(this.isPC == "questionTable"){
                    this.$codePost("/expertCompatibility/delete_expert_test_question/", list, { operation: "删除用例问题", success: true, failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$refs.questionTableRef.getTableData();
                        }
                    })
                }else if(this.isPC == "questionTablePC"){
                    this.$codePost("/expertCompatibilityPC/delete_expert_test_question/", list, { operation: "删除用例问题", success: true, failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$refs.questionTableRef.getTableData();
                        }
                    })
                }
            }).catch(() => { });
        },

    },
    watch: {

    }
}
</script>