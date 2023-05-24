<template>
    <div>
        <edit-picture ref="editPictureRef" confirm-type="parentDeal" @afterEdit="storePicChange"/> 
        <edit-question ref="editQuestionRef" :table-name="tableName" @afterEdit="afterEditQuestion" />
        <!-- , saveName: '暂存' -->
        <self-dialog 
            ref="editDialogRef" 
            :dialog-data="{ title: testContentDialogTitle, width: '78%', top: '3rem', confirmName: '确定', closeName: '取消' }" 
            @confirm="saveTestContent"
            @save="saveTempContent"
            >
            <div class="split-card form-card">
                <el-form 
                    ref="testContentFormPCRef" 
                    :model="testContentFormList" 
                    :rules="testContentFormRules"
                    :show-message="false" 
                    label-width="31%"
                    >
                    <el-form-item v-for="item,index in basicColumnData" :key="index" :label="item.titleName" class="form-item">
                        <el-select 
                            v-model="testContentFormList[item.propName]" 
                            filterable 
                            clearable
                            :placeholder="''"
                            style="width: 90%"
                            allow-create
                            >
                            <el-option v-for="(option,k) in optionDict[item.propName]" :key="index+'_'+k" :label="option" :value="option">
                                <span>{{option}}
                                    <span v-if="testedData && testedData[nameDict[item.propName]] && testedData[nameDict[item.propName]].indexOf(option) !== -1" class="check-icon">√</span>
                                </span>
                            </el-option>
                        </el-select>
                        <span v-if="testedData && testedData[nameDict[item.propName]] && testedData[nameDict[item.propName]].indexOf(testContentFormList[item.propName]) !== -1" class="check-icon">√</span>
                    </el-form-item>
                    <el-form-item label="工时"  prop="work_time" label-width="15%">
                        <el-input 
                            v-model="testContentFormList.work_time" 
                            placeholder="请填写工时"
                            type="number"
                            style="width:35%; margin-right: 5px"
                            ></el-input>分钟
                    </el-form-item>
                    <el-form-item label="是否通过" prop="if_pass" class="public-dialog-form-item" label-width="15%">
                        <el-radio-group v-model="testContentFormList.if_pass">
                            <el-radio label="通过">通过</el-radio>
                            <el-radio label="不通过">不通过</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="need_fail_reason" label="不通过原因" label-width="15%">
                        <el-select 
                            v-model="testContentFormList.not_pass_reason" 
                            filterable 
                            clearable
                            multiple
                            placeholder="请选择不通过原因"
                            style="width:95%"
                            allow-create
                            ><el-option v-for="(item,index) in NameReflect" v-if="testContentFormList[item.pc_report_col_name]" :key="index" :label="item.diaplay_name" :value="item.pc_report_col_name"></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item label="备注" prop="remarks" class="public-dialog-form-item"  label-width="15%">
                        <el-input 
                            type="textarea"
                            v-model="testContentFormList.remarks" 
                            placeholder="请填写备注"
                            style="width:95%"
                            >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="log文件" prop="log_file" class="public-dialog-form-item"  label-width="15%">
                        <log-file-upload ref="logFileUploadRef" :old-file="oldLogFile" />
                    </el-form-item>

                    <!-- 自定义列 -->
                    <el-form-item 
                        v-for="(item,index) in customCols" 
                        :key="index" 
                        :label="item.col_cn_name" 
                        :prop="item.col_name" 
                        class="public-dialog-form-item"
                         label-width="15%"
                        >
                        <el-input 
                            type="textarea"
                            v-model="testContentFormList[item.col_name]" 
                            style="width:95%"
                            >
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>

            <el-card class="split-card question-table-card">
                <div style="margin-bottom: 1rem;">
                    <el-button type="primary" size="small"  @click="addCaseQuestion">新增问题</el-button>
                </div>
                <div style="max-height:570px;overflow-y:auto;">
                    <el-checkbox-group v-model="testContentFormList.question">
                        <el-tabs type="border-card" v-model="currentTab" v-loading="tabLoading" @tab-click="getQuestionData()">
                            <el-tab-pane 
                                v-for="(tabItem, tabIndex) in tabArr" 
                                :key="tabItem" 
                                :label="tabItem"
                                :name="tabItem"
                                >   
                                <div
                                    v-for="(questionItem, questionIndex) in questionData"
                                    :key="questionIndex"
                                    class="question-item"
                                    @click="changeChecked(questionItem.id)"
                                    >   
                                    <div>
                                        <div class="question-check">
                                            <el-checkbox class="question-checkbox" :label="questionItem.id" @click.native.prevent>&nbsp;</el-checkbox>
                                            <el-tag 
                                                :type="questionItem.q_status == 0 ? 'success' : 'info'"
                                                size="mini"
                                                >{{ questionItem.q_name }}</el-tag>
                                            {{ questionItem.q_number }}
                                            <i class="el-icon-edit-outline edit-icon" title="编辑问题" @click.stop="editCaseQuestion(questionItem)"></i>
                                        </div>
                                        <div>
                                            
                                            {{ questionItem.q_category }}-{{ questionItem.q_classification }}
                                            <span v-if="editItemPicData[questionItem.id] != undefined" @click.stop>
                                                <self-picture-show :img-path="getPicUrl(editItemPicData[questionItem.id])" :title="`查看图片（共${editItemPicData[questionItem.id].length}张）`" />
                                            </span>
                                            <i 
                                                v-if="testContentFormList.question.includes(questionItem.id)" 
                                                class="el-icon-upload2 edit-icon" 
                                                title="编辑图片" 
                                                style="margin-top: 0; height: 18px;"
                                                @click.stop="editPicture(questionItem.id)"></i>
                                        </div>
                                        <div class="question-desc" :title="questionItem.q_description">
                                            描述：{{ questionItem.q_description }}
                                        </div>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </el-checkbox-group>
                </div>
            </el-card>
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import EditQuestion from "./EditQuestion"
import EditPicture from "@/components/Common/EditPicture"
import SelfDialog from "@/components/Common/SelfDialog.vue"
import LogFileUpload from '@/components/Common/LogFileUpload'
export default {
    components: {
        LogFileUpload,
        EditQuestion,
        EditPicture,
        SelfDialog
    },
    props: {
        customCols: Array,
        tableName: String,
        NameReflect: {},
        optionDict: {},
        testedData: {},
        nameDict: {},
        basicColumnData: {},
    },
    data() {
        return {
            //新增编辑测试内容数据
            testContentDialogTitle: "",
            testContentFormList: {
                id: "",
                os: "",// 系统版本
                gpu: "", // 显卡
                cpu: "", // cpu
                input: "", // 输入法
                antivirus_software: "", // 杀毒软件
                game_resolution: "", // 游戏内分辨率
                pc_resolution: "", // 显示器分辨率
                display_quality: "", // 游戏画质
                picture_mode: "", // 画面模式
                game_location: "", // 游戏存储位置
                game_language: "", // 游戏内语言
                os_language: "", // 系统语言
                game_platform: "", // 游戏平台
                other_set: "",
                remarks: "",// 备注
                work_time: "",  // 工时
                question: [],
                if_pass: "",
                not_pass_reason: "",  // 不通过原因
            },
            // 是否需要不通过原因
            need_fail_reason: false,
            editItemPicData: {},
            beforeEditData: "",
            oldLogFile: "",
            testContentFormRules: {
                work_time: [{ required: true, trigger: 'change' }],
                not_pass_reason: [{ required: true, trigger: 'change' }],
                if_pass: [{ required: true, trigger: 'change' }],
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
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
    },
    watch: {
        "testContentFormList.if_pass": {
            handler(newVal, oldVal){
                if(newVal == "不通过"){
                    this.need_fail_reason = true
                    this.testContentFormRules = {
                        not_pass_reason: [{ required: true, trigger: 'change' }],
                        work_time: [{ required: true, trigger: 'change' }]
                    }
                }
                else{
                    this.need_fail_reason = false
                }
            },
            immediate: true
        },
        "testContentFormList.not_pass_reason": {
            handler(newReason, oldReason){
                if(typeof(newReason) == 'string'){
                    newReason = newReason.split(',')
                }
                let testContentFormRules = {
                    not_pass_reason: [{ required: true, trigger: 'change' }],
                    work_time: [{ required: true, trigger: 'change' }]
                }
                newReason.forEach(function(item){
                    testContentFormRules[item] = [{ required: true, trigger: 'change' }]
                })

                this.testContentFormRules = testContentFormRules
            }
        }
    },
    created() {
    },
    mounted() {

    },
    methods: {
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
            }else{
                this.getQuestionData();
            }
            this.$refs.editDialogRef.openDialog();
        },
        
        //初始化填写数据
        initData(){
            let list = {
                id: "",
                os: "",// 系统版本
                gpu: "", // 显卡
                cpu: "", // cpu
                input: "", // 输入法
                antivirus_software: "", // 杀毒软件
                game_resolution: "", // 游戏内分辨率
                pc_resolution: "", // 显示器分辨率
                display_quality: "", // 游戏画质
                picture_mode: "", // 画面模式
                game_location: "", // 游戏存储位置
                game_language: "", // 游戏内语言
                os_language: "", // 系统语言
                game_platform: "", // 游戏平台
                other_set: "",
                if_pass: "通过",
                work_time: "",
                ram: "",
                remarks: "",
                question: [],
                not_pass_reason: "",
            };
            //填入自定义的项值
            for (let i = 0; i < this.customCols.length; i++) {
                let colName = this.customCols[i].col_name;
                list[colName] = "";
            }
            this.testContentFormList = list;
            this.editItemPicData = {};
            this.oldLogFile = "";
            this.currentTab = "兼容性问题";
            this.getQuestionData();
            this.storePicData = {};
        },

        //编辑测试内容
        editTestContent(item) {
            this.canClearBasic = false;
            this.testContentDialogTitle = "编辑测试内容";
            this.testContentFormList.id = item.id;
            for (let k in this.testContentFormList) {
                if (k == "question") {
                    //将问题字符串转为数字型数组
                    let questionArr = [];
                    if (!this.$checkStrIsNull(item[k])) {
                        let questionStrArr = item[k].split(",");
                        questionArr = questionStrArr.map(function(v, index, arr) {
                            return parseInt(v)
                        })
                    }
                    this.testContentFormList[k] = questionArr;
                } else if(k == "not_pass_reason") {
                    if(item[k] == '' || item[k] == null){
                        this.testContentFormList[k] = ""
                    }else{
                        this.testContentFormList[k] = item[k].split(',')
                    }
                }else{
                    this.testContentFormList[k] = item[k];
                }
            }
            //填入自定义的项值
            for (let i = 0; i < this.customCols.length; i++) {
                let colName = this.customCols[i].col_name;
                if(item[colName] == undefined){
                    this.$set(this.testContentFormList, colName, "");
                }else{
                    this.$set(this.testContentFormList, colName, item[colName]);
                }
            }
            this.oldLogFile = item.log_file;
            this.editItemPicData = item.pic_info;
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
            this.tabLoading = true;
            let list = {
                table_name: this.tableName,
                q_category: this.currentTab,
                sort: "",
                order: "",
            };
            this.$codePost("/expertCompatibilityPC/get_expert_test_question/", list, { operation: "获取问题列表", failed: true }).then(res => {
                if (res.code == 200) {
                    this.questionData = res.data;
                    setTimeout(() => {
                        this.tabLoading = false;
                    }, 300)
                }
            })
        },

        //初始化部分数据
        clearBasicContent() {
            this.$set(this.testContentFormList, "brand", "");
            this.$set(this.testContentFormList, "device", "");
            this.$set(this.testContentFormList, "device_id", "");
            this.$set(this.testContentFormList, "os", "");
            this.$set(this.testContentFormList, "ram", "");
        },

        //切换选中
        changeChecked(questionId) {
            let index = this.testContentFormList.question.indexOf(questionId);
            if (index == -1) {
                //原来没有选中，要选中
                this.testContentFormList.question.push(questionId);
            } else {
                //要取消选中
                //如果被取消选中的问题下有当前设备的图片
                if (this.editItemPicData[questionId] != undefined) {
                    let confirmText = "<span style='color:red;'>该问题下来自当前设备的图片也会被删除</span>，确定仍要移除该问题吗？";
                    this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                        //确认就移除问题
                        this.testContentFormList.question.splice(index, 1);
                    }).catch(() => { });
                } else {
                    this.testContentFormList.question.splice(index, 1);
                }
            }
            this.getIsPass();
        },

        //获取通过/不通过
        getIsPass() {
            if (this.testContentFormList.question.length == 0) {
                //没有问题则通过
                this.testContentFormList.if_pass = "通过";
            } else {
                //有问题则让后台判断
                let list = {
                    table_name: this.tableName,
                    question_ids: JSON.stringify(this.testContentFormList.question),
                }
                this.$codePost("/expertCompatibilityPC/judge_if_pass/", list, { operation: "自动判断是否通过", failed: true }).then(res => {
                    if (res.code == 200) {
                        this.testContentFormList.if_pass = res.data;
                    }
                })
            }
        },

        // 暂存测试内容
        saveTempContent(){
            this.$store.commit("setPageIsLoading", true);
            let formData = new FormData();
            //表单填写数据
            for (let k in this.testContentFormList) {
                if (k != "question") {
                    if(this.testContentFormList[k]){
                        formData.append(k, this.testContentFormList[k]);
                    }else{
                        formData.append(k, "");
                    }
                } else {
                    let questionStr = this.testContentFormList[k].join(",");
                    formData.append(k, questionStr);
                }
            }
            //不用用户填写，但要传给后台的固定数据
            formData.append("project", this.projectCode);
            formData.append("table_name", this.tableName);
            //log文件数据
            let logFileData = this.$refs.logFileUploadRef.getFileData();
            if (logFileData.file) {
                //上传了新的log文件
                formData.append("log_file", logFileData.file);
            } else if (this.oldLogFile && this.testContentDialogTitle == "编辑测试内容") {
                //编辑时，没有上传新的,但检测到原来有log文件
                if (logFileData.oldFile == "") {
                    //组件中旧文件已被删除
                    formData.append("delete_log_file", true);
                } else {
                    formData.append("delete_log_file", false);
                }
            }
            let postApp = "insert_expert_test_record";
            if (this.testContentDialogTitle == "编辑测试内容") {
                //编辑
                postApp = "update_expert_test_record";
                formData.append("old_question", this.beforeEditData.question);
            }
            let deleteList = [];
            for(let k in this.storePicData){
                let questionId = k;
                let data = this.storePicData[k];
                deleteList = deleteList.concat(data.oldDeleteList);
                data.fileListData.map((file)=>{
                    formData.append("question_pic_" + questionId, file);
                })
            }
            formData.append("delete_list",JSON.stringify(deleteList))
            if(formData.get("if_pass") == '通过'){
                formData.set('not_pass_reason', '');
            }
            // for (var [key, valuefor] of formData) {
            //     console.log(key,":", valuefor);
            // }

            this.$formPost("/expertCompatibilityPC/" + postApp + "/", formData, { operation: this.testContentDialogTitle, success: true, failed: true }).then(res => {
                if (res.code == 200) {
                    this.initData();
                    this.resetTestContentForm();
                    this.$refs.editDialogRef.closeDialog();
                    if (this.testContentDialogTitle == "编辑测试内容") {
                        this.$emit("afterEdit");
                    } else {
                        this.$emit("afterEdit", "addTestContent");
                    }
                    this.testContentFormRules = {
                        work_time: [{ required: true, trigger: 'change' }]
                    }
                }
                this.$store.commit("setPageIsLoading", false);
            })
        },


        //确认新增/修改 测试内容
        saveTestContent() {
            let hasError = this.$publicJS.checkFormData(this, "testContentFormPCRef", "您有必填项未填！");
            if (!hasError) {
                this.saveTempContent()
                // this.$store.commit("setPageIsLoading", true);
                // let formData = new FormData();
                // //表单填写数据
                // for (let k in this.testContentFormList) {
                //     if (k != "question") {
                //         if(this.testContentFormList[k]){
                //             formData.append(k, this.testContentFormList[k]);
                //         }else{
                //             formData.append(k, "");
                //         }
                //     } else {
                //         let questionStr = this.testContentFormList[k].join(",");
                //         formData.append(k, questionStr);
                //     }
                // }
                // //不用用户填写，但要传给后台的固定数据
                // formData.append("project", this.projectCode);
                // formData.append("table_name", this.tableName);
                // //log文件数据
                // let logFileData = this.$refs.logFileUploadRef.getFileData();
                // if (logFileData.file) {
                //     //上传了新的log文件
                //     formData.append("log_file", logFileData.file);
                // } else if (this.oldLogFile && this.testContentDialogTitle == "编辑测试内容") {
                //     //编辑时，没有上传新的,但检测到原来有log文件
                //     if (logFileData.oldFile == "") {
                //         //组件中旧文件已被删除
                //         formData.append("delete_log_file", true);
                //     } else {
                //         formData.append("delete_log_file", false);
                //     }
                // }
                // let postApp = "insert_expert_test_record";
                // if (this.testContentDialogTitle == "编辑测试内容") {
                //     //编辑
                //     postApp = "update_expert_test_record";
                //     formData.append("old_question", this.beforeEditData.question);
                // }
                // let deleteList = [];
                // for(let k in this.storePicData){
                //     let questionId = k;
                //     let data = this.storePicData[k];
                //     deleteList = deleteList.concat(data.oldDeleteList);
                //     data.fileListData.map((file)=>{
                //         formData.append("question_pic_" + questionId, file);
                //     })
                // }
                // formData.append("delete_list",JSON.stringify(deleteList))
                // if(formData.get("if_pass") == '通过'){
                //     formData.set('not_pass_reason', '');
                // }
                // // for (var [key, valuefor] of formData) {
                // //     console.log(key,":", valuefor);
                // // }

                // this.$formPost("/expertCompatibilityPC/" + postApp + "/", formData, { operation: this.testContentDialogTitle, success: true, failed: true }).then(res => {
                //     if (res.code == 200) {
                //         this.initData();
                //         this.resetTestContentForm();
                //         this.$refs.editDialogRef.closeDialog();
                //         if (this.testContentDialogTitle == "编辑测试内容") {
                //             this.$emit("afterEdit");
                //         } else {
                //             this.$emit("afterEdit", "addTestContent");
                //         }
                //         this.testContentFormRules = {
                //             work_time: [{ required: true, trigger: 'change' }]
                //         }
                //     }
                //     this.$store.commit("setPageIsLoading", false);
                // })
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
            this.getIsPass();
        },

        //初始化测试内容模态框
        resetTestContentForm() {
            this.$refs["testContentFormPCRef"].resetFields();
        },

        //新增问题
        addCaseQuestion() {
            this.$refs.editQuestionRef.addCaseQuestion();
        },

        //编辑问题
        editCaseQuestion(item) {
            this.$refs.editQuestionRef.editCaseQuestion(item);
        },

        //编辑问题图片
        editPicture(questionId){
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
            this.$refs.editPictureRef.editPicture({questionId: questionId}, this.storePicData[questionId].oldPictures, this.storePicData[questionId].fileListData);
        },

        //临时保存图片修改
        storePicChange(data){
            this.storePicData[data.questionId] = {
                oldPictures: data.oldPictures,
                oldDeleteList: data.oldDeleteList,
                fileListData: data.fileListData
            }
        },
    },

}
</script>
<style scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
}
::v-deep input[type='number'] {
    -moz-appearance: textfield !important;
}

.split-card {
    display: inline-block;
    vertical-align: top;
}

.form-card {
    width: 46%;
    margin-left: 1%;
}

.question-table-card {
    width: 50%;
}

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
.check-icon{
    color: green;
    margin-left: 5px;
}
.form-item{
    display: inline-block;
    width: 49%;
}
</style>
