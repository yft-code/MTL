<template>
    <div class="container" :style="urlPath == '/mtl_test_platform/page/protocolQuestionTable' ? {'margin-top': '80px'}:{'width':'99%', 'margin':'auto'}">
        <edit-question ref="editQuestionRef" :table-name="tableName" @afterEdit="afterEdit"/>
        <div style="margin-bottom: 1rem;" v-if="urlPath == '/mtl_test_platform/page/protocolQuestionTable'">
            <span @click="jumpPage()" style="cursor:pointer">开始测试</span>
            &nbsp;
            <i class="el-icon-arrow-right"></i> 
            &nbsp;
            <span class="blue-span">问题列表</span>
        </div>
        <div>
            <el-button type="primary" size="small"  @click="addCaseQuestion" v-if="!isChackData">新增问题</el-button>
        </div>
        <el-table :data="urlPath == '/mtl_test_platform/page/protocolQuestionTable' ? questionData:tableData" 
            :header-cell-style="isReport ? { color: '#414350', textAlign: 'center', background: '#e7e9ee' }:{ color: '#414350', textAlign: 'center' }"
            >
            <el-table-column
                v-for="(item,index) in columnData"
                :key="index"
                :prop="item.propName"
                :label="item.titleName"
                :sortable="item.sortFlag ? 'custom' : false"
                :min-width="item.minWidth"
                :align="item.align || 'center'"
                :fixed="item.fixed || false"
                v-if="item.propName !== 'operation'"
                >
                <template slot-scope="scope">

                    <div v-if="item.propName == 'protocol_name'">
                        {{ scope.row[item.propName] }}
                    </div>
                    <div v-else-if="item.propName == 'q_number'">
                        {{ scope.row[item.propName] }}
                    </div>
                    <div v-else-if="item.propName == 'q_category'">
                        {{ scope.row[item.propName] }}
                    </div>
                    <div v-else-if="item.propName == 'q_level'">
                        P{{ scope.row[item.propName] }}
                    </div>
                    <div v-else-if="item.propName == 'msg'">
                        {{ scope.row[item.propName] }}
                    </div>
                    <div v-else-if="item.propName == 'q_status'">
                        {{ scope.row.q_name }}
                    </div>

                    <div v-else-if="item.propName == 'test_qa'">
                        <span>{{ scope.row.test_qa_name || scope.row.test_qa }}</span>
                        <self-popo v-if="!$checkStrIsNull(scope.row.test_qa)" :email="scope.row.test_qa"/>
                    </div>

                    <div v-else-if="item.propName == 'q_description'">
                        <pre>{{ scope.row.q_description }}</pre>
                    </div>

                    <div v-else-if="item.propName == 'picture_list'">
                        <div v-if="scope.row.picture && scope.row.picture.length > 0">
                            <div v-if="!isReport">
                            
                                <self-picture-show 
                                    :img-path="getPicUrl(scope.row.picture)" 
                                    :img-type="'thumbnail'" 
                                    title="查看图片"
                                    />
                                <div>共{{scope.row.picture.length}}张</div>
                            </div>
                            <self-picture-show 
                                v-else
                                :img-path="getPicUrl(scope.row.picture)" 
                                :title="`查看图片（共${scope.row.picture.length}张）`"
                                style="margin-left:2px;"
                                />
                        </div>
                        <i v-if="isDialog || urlPath == '/mtl_test_platform/page/protocolQuestionTable'"
                            class="el-icon-upload2 edit-icon" 
                            title="编辑图片" 
                            style="margin-top: 0; height: 18px;"
                            @click.stop="editPicture(scope.row)"></i>
                    </div>
                    <div v-else-if="item.propName == 'question_time'">
                        {{ scope.row[item.propName] }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-else-if="isDialog || urlPath == '/mtl_test_platform/page/protocolQuestionTable'" :key="index"
                :prop="item.propName"
                :label="item.titleName"
                :sortable="item.sortFlag ? 'custom' : false"
                :min-width="item.minWidth"
                :align="item.align || 'center'"
                :fixed="item.fixed || false">
                <template slot-scope="scope">
                    <el-button 
                        v-if="item.canEditCaseQuestion" 
                        type="primary" 
                        size="mini"
                        @click="editCaseQuestion(scope.row)"
                    >编辑</el-button>
                    <el-button 
                        v-if="item.canDeleteCaseQuestion" 
                        type="danger"  
                        size="mini" 
                        @click="deleteCaseQuestion(scope.row)"
                    >删除</el-button>
                </template>
                </el-table-column>
        </el-table>
    </div>
</template>
<script>
import EditQuestion from "@/components/StartTest/Protocol/EditQuestion"
export default {
    components: {
        EditQuestion,
    },
    data() {
        return {
            tableName: "",
            //问题表格相关数据
            columnData: [
                {
                    titleName: "协议名称",
                    propName: "protocol_name",
                },
                {
                    titleName: '问题编号',
                    propName: 'q_number',
                    // sortFlag: true,
                    type: "normal",
                },
                {
                    titleName: '问题分类',
                    propName: 'q_category',
                    // sortFlag: true,
                    type: "normal",
                },
                {
                    titleName: '问题级别',
                    propName: 'q_level',
                    minWidth: 80,
                    // sortFlag: true,
                },
                {
                    titleName: '问题描述',
                    propName: 'msg',
                    minWidth: 250,
                    align: 'left',
                },
                {
                    titleName: '问题状态',
                    propName: 'q_status',
                    minWidth: 50,
                },
                // {
                //     titleName: 'MTL接口人',
                //     propName: 'test_qa',
                // },
                {
                    titleName: '图片',
                    propName: 'picture_list',
                    minWidth: 150,
                },
                {
                    titleName: '创建时间',
                    propName: 'question_time',
                    minWidth: 100,
                },
                {
                    titleName: '操作',
                    propName: 'operation',
                    minWidth: 200,
                    fixed: 'right',
                    canEditCaseQuestion: true,
                    canDeleteCaseQuestion: true,
                },
            ],
            urlPath: "",
            applicationId: "",
            questionData: [],
        }
    },
    computed: {

    },
    props: {
        isChackData: {},
        tableData: {},
        isDialog: {},
        tableWidth: {},
        isReport: {},
    },
    created() {
        if(this.isReport){
            this.columnData = this.columnData.filter(item => {
                return item.propName != 'q_number' && item.propName != 'q_number' && item.propName != 'question_time'
            })
        }else{
            this.columnData = this.columnData.filter(item => {
                return item.propName != 'protocol_name'
            })
        }
        this.tableName = this.$route.query.testRecordName;
        this.applicationId = this.$route.query.id
        this.urlPath = this.$route.path
        if(this.urlPath == '/mtl_test_platform/page/protocolQuestionTable'){
            this.getQuestionData()
        }
    },
    mounted() {
        this.$store.commit("setPageIsLoading", false);
    },
    methods: {
        jumpPage(){
            this.$router.push({
                path: '/mtl_test_platform/page/protocolStartTest',
                query: this.$route.query
            })
        },
        getQuestionData(){
            this.$store.commit("setPageIsLoading", true);
            let list = {
                application_id: this.applicationId,
            }
            this.$codePost("/protocolTest/get_test_record/", list).then(res => {
                if(res.code == "200"){
                    let questionData = []
                    res.data.forEach(mission => {
                        if(mission.test_qa !== '未分配'){
                            mission.records.forEach(record => {
                                if(record.question){
                                    questionData = questionData.concat(record.question)
                                }
                            })
                        }
                    })
                    this.questionData = questionData
                    this.$store.commit("setPageIsLoading", false);
                }
            })
        },
        getPicUrl(pic) {
            let arr = pic.map((value, index) => {
                return value.pic_url;
            })
            return arr;
        },

        editPicture(row){
            this.$emit("editPicture", row)
        },

        //打开问题列表模态框
        openQuestionDialog() {
            this.$refs.questionShowRef.openDialog();
        },

        //新增问题
        addCaseQuestion() {
            this.$refs.editQuestionRef.addCaseQuestion();
        },

        //编辑问题
        editCaseQuestion(item) {
            if(this.isDialog){
                this.$emit('editCaseQuestion', item)
            }else{

                this.$refs.editQuestionRef.editCaseQuestion(item);
            }
        },

        //编辑后
        afterEdit(){
            // this.$refs.questionTableRef.getTableData();
        },

        //删除问题
        deleteCaseQuestion(item) {
            this.$selfConfirm("确定删除该用例问题吗？", '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                //确认
                let list = { question_id: item.id, application_id: this.applicationId };
                this.$codePost("/protocolTest/delete_question/", list, { operation: "删除用例问题", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        // this.$refs.questionTableRef.getTableData();
                        this.$emit("afterDelete")
                    }
                })
            }).catch(() => { });
        },

    },
    watch: {

    }
}
</script>
<style scoped>

</style>