<template>
    <div>
        <edit-picture ref="editPictureRef" confirm-type="parentDeal" @afterEdit="storePicChange"/> 
        <edit-question ref="editQuestionRef" :table-name="tableName" @afterEdit="afterEditQuestion" />
        <!-- <self-dialog 
            ref="editDialogRef" 
            :dialog-data="{ title: testContentDialogTitle, width: '74rem', top: '3rem', confirmName: '确定', closeName: '取消' }" 
            @confirm="saveTestContent"
            > -->
        <self-dialog 
            ref="editDialogRef" 
            :dialog-data="{ title: testContentDialogTitle, width: '80rem', top: '3rem', confirmName: '完成录入', closeName: '取消' }" 
            @confirm="saveTestContent"
            @close="close"
            >
            <div class="split-card form-card">
                <el-form 
                    ref="testContentFormRef" 
                    :model="testContentFormList" 
                    :rules="testContentFormRules" 
                    :show-message="false" 
                    label-width="7rem"
                    :key="testContentDeviceType"
                    >
                    <el-form-item label="协议名" class="public-dialog-form-item">
                        <el-input v-model="testContentFormList.protocol_name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="工时" prop="work_time" class="public-dialog-form-item">
                        <el-input 
                            v-model="testContentFormList.work_time" 
                            placeholder="请填写工时"
                            type="number"
                            style="width:50%; margin-right: 5px"
                            ></el-input>分钟
                    </el-form-item>
                    <el-form-item label="协议说明" class="public-dialog-form-item">
                        <el-input v-model="testContentFormList.description" disabled type="textarea" :autosize="{ minRows: 2}"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remarks" class="public-dialog-form-item">
                        <el-input 
                            type="textarea" :autosize="{ minRows: 2}"
                            v-model="testContentFormList.remarks" 
                            placeholder="请填写备注"
                            >
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>

            <el-card>
                <div style="margin-bottom: 1rem;">
                    <el-button type="primary" size="small"  @click="addCaseQuestion">新增问题</el-button>
                </div>
                <question-table :tableWidth="'90%'" @afterDelete="afterDelete" @editPicture="editPicture" @editCaseQuestion="editCaseQuestion" :isDialog="true" :isChackData="true" :tableData="testContentFormList.question"></question-table>

            </el-card>

        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import EditQuestion from '@/components/StartTest/Protocol/EditQuestion'
import EditPicture from "@/components/Common/EditPicture"
import SelfDialog from "@/components/Common/SelfDialog.vue"
import QuestionTable from '@/components/StartTest/Protocol/QuestionTable'
export default {
    components: {
        EditQuestion,
        EditPicture,
        SelfDialog,
        QuestionTable
    },
    props: {
        // customCols: Array,
        tableName: String,
    },
    data() {
        return {
            //新增编辑测试内容数据
            testContentDialogTitle: "",
            testContentFormList: {
                id: "",
                protocol_name: "",  // 协议名称
                description: "",//协议说明
                remarks: "",//备注
                work_time: "",  // 工时
                question: [],
            },
            editItemPicData: {},
            beforeEditData: "",
            oldLogFile: "",
            testContentFormRules: {
                work_time: [{ required: true, trigger: 'change' }],
            },
            questionData: [],
            uploadData: [],
            tabArr: ["兼容性问题", "功能性问题", "稳定性问题"],
            currentTab: "兼容性问题",
            tabLoading: true,
            canClearBasic: true,
            storePicData: {},            
        }
    },
    computed: {
        // html中直接用this.testContentFormList.device_type做判断值，会出现渲染问题，因此这里要特别处理
        testContentDeviceType() {
            return this.testContentFormList.device_type;
        },
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
    },
    watch: {
        
    },
    created() {

    },
    mounted() {

    },
    methods: {


        createFilter(queryString) {
            return (results) => {
                return (results.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
            };
        },
        //获得设备下问题对应图片数组
        getPicUrl(picDict){
            let picArr = picDict.map((v,index)=>{
                return v.pic_url;
            })
            return picArr;
        },

        addTestContent() {
            this.testContentDialogTitle = "新增测试内容";
            if (this.testContentFormList.id != "") {
                this.initData();
            }
            this.getQuestionData();
            this.$refs.editDialogRef.openDialog();
        },
        
        //初始化填写数据
        initData(){
            let list = {
                id: "",
                protocol_name: "",  // 协议名称
                description: "",//协议说明
                remarks: "",//备注
                work_time: "",  // 工时
                question: [],
            };

            this.testContentFormList = list;
            this.editItemPicData = {};
            this.oldLogFile = "";
            this.currentTab = "兼容性问题";
            // this.getQuestionData();
            this.storePicData = {};
        },

        //录入测试数据
        editTestContent(item) {
            // console.log(item)
            this.canClearBasic = false;
            this.testContentDialogTitle = "录入测试数据";
            this.testContentFormList.id = item.id;
            for (let k in this.testContentFormList) {
                if (k != "question") {
                    this.testContentFormList[k] = item[k] ? item[k] : '';
                } 
                else {
                    this.testContentFormList[k] = !this.$checkStrIsNull(item[k]) ? item[k] : [];
                }
            }
            this.editItemPicData = {}
            if(item.question && item.question.length > 0){
                item.question.forEach(ques => {
                    this.editItemPicData[ques.id] = ques.pic_url
                })
            }
            //存储完整的旧数据
            this.beforeEditData = JSON.parse(JSON.stringify(item));
            this.currentTab = "兼容性问题";
            this.getQuestionData();
            this.$nextTick(() => {
                this.canClearBasic = true;
            })
            this.storePicData = {};
            this.$refs.editDialogRef.openDialog();
        },

        //获取问题数据
        getQuestionData() {
            // this.tabLoading = true;
            let list = {
                application_id: this.$route.query.id,
                record_id: this.testContentFormList.id,
            };
            this.$codePost("/protocolTest/get_test_record/", list, { operation: "获取问题列表", failed: true }).then(res => {
                if (res.code == 200) {
                    this.testContentFormList.question = res.data[0].records[0].question
                }
            })
        },

        afterDelete(){
            this.getQuestionData()
            this.$emit("afterEdit");
        },


        //确认新增/修改 测试内容
        saveTestContent() {
            // console.log(this.testContentFormList)
            let hasError = this.$publicJS.checkFormData(this, "testContentFormRef", "您有必填项未填！");
            if (!hasError) {
                this.$store.commit("setPageIsLoading", true);
                let formData = new FormData();
                //表单填写数据
                for (let k in this.testContentFormList) {
                    formData.append(k, this.testContentFormList[k] ? this.testContentFormList[k] : '');
                }
                //不用用户填写，但要传给后台的固定数据
                formData.append("project", this.projectCode);
                formData.append("table_name", this.tableName);
                let postApp = "insert_expert_test_record";
                if (this.testContentDialogTitle == "录入测试数据") {
                    //编辑
                    postApp = "finish_task";
                    formData.append("application_id", this.$route.query.id);
                }
                // for (var [key, valuefor] of formData) {
                //     console.log(key, valuefor);
                // }
                this.$formPost("/protocolTest/" + postApp + "/", formData, { operation: this.testContentDialogTitle, success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.initData();
                        this.resetTestContentForm();
                        this.$refs.editDialogRef.closeDialog();
                        if (this.testContentDialogTitle == "录入测试数据") {
                            this.$emit("afterEdit");
                        } else {
                            this.$emit("afterEdit", "addTestContent");
                        }
                    }
                    this.$store.commit("setPageIsLoading", false);
                })
            }
        },

        //修改问题后获取到问题的分类，切换当前选择问题的tab
        afterEditQuestion(qCategory){
            if(["功能性问题", "稳定性问题"].includes(qCategory)){
                this.currentTab = qCategory
            }else{
                this.currentTab = "兼容性问题";
            }
            this.getQuestionData();
            this.$emit("afterEdit");
        },

        //初始化测试内容模态框
        resetTestContentForm() {
            this.$refs["testContentFormRef"].resetFields();
        },

        //新增问题
        addCaseQuestion() {
            // console.log(this.testContentFormList)
            this.$refs.editQuestionRef.addCaseQuestion(this.testContentFormList);
        },

        close(){
            // this.$emit("afterEdit");
        },

        //编辑问题
        editCaseQuestion(item) {
            this.$refs.editQuestionRef.editCaseQuestion(item);
        },

        //编辑问题图片
        editPicture(row){
            // console.log(row)
            let questionId = row.id
            // console.log(this.storePicData)
            if(this.storePicData[questionId]==undefined){
                if(this.editItemPicData[questionId]!=undefined){
                    this.storePicData[questionId] = {
                        oldPictures: this.editItemPicData[questionId],
                        oldDeleteList: [],
                        fileListData: [],
                    }
                }else{
                    this.storePicData[questionId] = {
                        oldPictures: [],
                        oldDeleteList: [],
                        fileListData: [],
                    }
                }
            }
            // console.log(questionId)
            this.$refs.editPictureRef.editPicture({questionId: questionId}, row.picture, this.storePicData[questionId].fileListData);
        },

        //临时保存图片修改
        storePicChange(data){
            // console.log(data)
            this.storePicData[data.questionId] = {
                oldPictures: data.oldPictures,
                oldDeleteList: data.oldDeleteList,
                fileListData: data.fileListData
            }
            let list = {
                application_id: this.$route.query.id,
                question_id: data.questionId,
            }
            let formData = new FormData();
            //表单填写数据
            for (let k in list) {
                formData.append(k, list[k]);
            }
            data.fileListData.forEach(pic => {
                formData.append('picture_list', pic)
            })
            let deleteList = [];
            console.log(this.storePicData)
            for(let k in this.storePicData){
                let questionId = k;
                let data = this.storePicData[k];
                deleteList = deleteList.concat(data.oldDeleteList);
            }
            formData.append("delete_list",JSON.stringify(deleteList))
            formData.append("id", this.testContentFormList.id)
            // for (var [key, valuefor] of formData) {
            //     console.log(key, valuefor);
            // }
            this.$formPost("/protocolTest/update_picture/", formData, { operation: "编辑图片", success: true, failed: true }).then(res => {
                if (res.code == 200) {
                    this.getQuestionData()
                }
            })
        },
    },

}
</script>
<style scoped>
.split-card {
    display: inline-block;
    vertical-align: top;
}

.form-card {
    width: 98%;
    margin-right: 1%;
    color: #606266;
}

/*
.question-table-card {
    width: 64%;
}
*/
.el-icon-refresh {
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    border: 1px solid #DCDFE6;
    padding: 0.5rem 0.4rem;
    margin-left: 0.1rem;
    border-radius: 5px;
}

.form-card>>>.el-radio {
    margin-right: 0.7rem;
}

.form-card>>>.el-radio .el-radio__label {
    padding-left: 0.3rem;
}

.form-card>>>.el-input.is-disabled .el-input__inner,
.form-card>>>.el-radio__input.is-disabled+span.el-radio__label {
    color: #959595;
}

.question-item {
    font-size: 14px;
    border: 1px solid #DCDFE6;
    width: 33%;
    margin-right: 2px;
    margin-bottom: 2px;
    display: inline-block;
    vertical-align: top;
    padding: 0.3rem;
    border-radius: 3px;
    cursor: pointer;
}

.question-item .question-desc {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.question-check {
    border-bottom: 1px solid #DCDFE6;
}

.question-check>>>.el-checkbox .el-checkbox__label {
    padding-left: 0;
    transition: none !important;
}
.public-dialog-form-item{
    width: 45%;
    margin-bottom: 1rem;
    display: inline-block;
}
</style>
