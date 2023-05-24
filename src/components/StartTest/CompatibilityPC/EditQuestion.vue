<template>
    <div>
        <self-dialog 
            ref="editQuestionRef" 
            :dialog-data="{ title: editQuestionDialogTitle, width: '36rem', confirmName: '确定', closeName: '取消' }" 
            @confirm="confirmEditQuetion" 
            @close="resetEditQuestionForm"
        >
            <el-form ref="caseFormRef" :model="caseQuestionFormList" :rules="caseFormRules" :show-message="false" label-width="7rem">
                <el-form-item v-if="qNumber" label="问题编号" class="public-dialog-form-item">
                    {{ qNumber }}
                </el-form-item>
                <el-form-item label="问题分类" prop="q_category" class="public-dialog-form-item half-form-item">
                    <el-select 
                        v-model="caseQuestionFormList.q_category" 
                        placeholder="请选择问题分类"
                        style="width:100%"
                        @change="changeCategory"
                    >
                        <el-option v-for="(item,index) in caseFormOptions.category" :key="index" :value="item" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题类型" prop="q_classification" class="public-dialog-form-item half-form-item">
                    <span v-if="caseQuestionFormList.q_category == ''">请先选择问题分类</span>
                    <el-select 
                        v-else
                        v-model="caseQuestionFormList.q_classification" 
                        placeholder="请选择问题类型"
                        style="width:100%"
                        >
                        <el-option 
                            v-for="(item, index) in caseFormOptions.classification[caseQuestionFormList.q_category]" 
                            :key="index" 
                            :value="item" 
                            :label="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题级别" prop="q_level" class="public-dialog-form-item half-form-item">
                    <el-select 
                        v-model="caseQuestionFormList.q_level" 
                        placeholder="请选择问题级别"
                        style="width:100%"
                        >
                        <el-option v-for="item,index in caseFormOptions.level" :key="index" :value="item.value" :label="'(P'+ item.value +')'+item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题重现率" prop="recurrent_rate" class="public-dialog-form-item half-form-item">
                    <el-select 
                        v-model="caseQuestionFormList.recurrent_rate" 
                        placeholder="请选择问题重现率"
                        style="width:100%"
                        >
                        <el-option v-for="(item, index) in caseFormOptions.rate" :key="index" :value="item" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题描述" prop="q_description" class="public-dialog-form-item">
                    <el-input
                        type="textarea"
                        v-model="caseQuestionFormList.q_description" 
                        placeholder="请填写问题描述"
                        style="width:100%"
                        >
                    </el-input>
                </el-form-item>
                <el-form-item label="问题状态" prop="q_status" class="public-dialog-form-item">
                    <el-radio-group v-model="caseQuestionFormList.q_status">
                        <el-radio 
                            v-for="(statusItem, statusIndex) in caseFormOptions.status" 
                            :key="statusIndex" 
                            :label="statusItem.value"
                        >{{ statusItem.label }}</el-radio>
                    </el-radio-group>
                    <div>注：已知/忽略的问题不记入报告</div>
                </el-form-item>
            </el-form>
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import SelfDialog from "@/components/Common/SelfDialog.vue"
export default {
    components: {
        SelfDialog,
    },
    props: {
        tableName: {}
    },
    data() {
        return {
            //编辑问题相关数据
            editQuestionDialogTitle: "",
            qNumber: "",
            caseQuestionFormList: {
                q_category: "",//问题分类
                q_classification: "",//问题类型
                q_level: "",//问题级别
                recurrent_rate: "",//问题重现率
                q_description: "",//问题描述
                q_status: 0, //问题状态
            },
            caseFormRules: {
                q_category: [{ required: true, trigger: 'change' }],
                q_classification: [{ required: true, trigger: 'change' }],
                q_level: [{ required: true, trigger: 'change' }],
                recurrent_rate: [{ required: true, trigger: 'change' }],
                q_description: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                q_status: [{ required: true, trigger: 'change' }], 
            },
            caseFormOptions: {
                category: [],
                classification: {},
                level: [],
                rate: ["必现", "高概率复现", "偶现", "未复现"],
                status: []
            },

        }
    },
    computed: {
    },
    created() {

    },
    mounted() {

    },
    methods: {
        //获取问题分类
        getQuestionClassify() {
            this.$codePost("/expertCompatibilityPC/get_expert_test_question_classify/", {}, { operation: "获取选项", failed: true }).then(res => {
                if (res.code == 200) {
                    this.$set(this.caseFormOptions, "category", res.data.classify_name);
                    this.$set(this.caseFormOptions, "classification", res.data.question_classify);
                    this.$set(this.caseFormOptions, "status", res.data.question_status);
                    
                    // this.$set(this.caseFormOptions, "level", res.data.question_level);
                    let level_list = []
                    res.data.question_level.forEach((item,index) => {
                        // console.log(item,index)
                        level_list.push({
                            label: item,
                            value: index+''
                        })
                    })
                    // console.log(level_list)
                    this.$set(this.caseFormOptions, "level", level_list);
                }
            })
        },

        // 修改问题分类
        changeCategory() {
            let qCategory = this.caseQuestionFormList.q_category;
            let options = this.caseFormOptions.classification[qCategory];
            let qClassification = this.caseQuestionFormList.q_classification;
            if (!options.includes(qClassification)) {
                this.$set(this.caseQuestionFormList,"q_classification","")
            }
        },

        //新增问题
        addCaseQuestion() {
            this.qNumber = "";
            this.caseQuestionFormList = {
                q_category: "",
                q_classification: "",
                q_level: "",
                recurrent_rate: "",
                q_description: "",
                q_status: 0,
            };
            this.getQuestionClassify();
            this.editQuestionDialogTitle = "新增";
            this.$refs.editQuestionRef.openDialog();
        },

        //编辑问题
        editCaseQuestion(item) {
            this.qNumber = item.q_number;
            for (let k in this.caseQuestionFormList) {
                this.caseQuestionFormList[k] = item[k];
            }
            this.caseQuestionFormList.question_id = item.id;
            this.getQuestionClassify();
            this.editQuestionDialogTitle = "编辑";
            this.$refs.editQuestionRef.openDialog();
        },

        //确认新增、编辑
        confirmEditQuetion() {
            let hasError = this.$publicJS.checkFormData(this, "caseFormRef", "您有必填项未填！");
            if (!hasError) {
                let list = JSON.parse(JSON.stringify(this.caseQuestionFormList));
                list.table_name = this.tableName;
                let postApp = "insert_expert_test_question";
                if (this.editQuestionDialogTitle == "编辑") {
                    postApp = "update_expert_test_question";
                }
                this.$codePost("/expertCompatibilityPC/" + postApp + "/", list, { operation: this.editQuestionDialogTitle, success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$emit("afterEdit", this.caseQuestionFormList.q_category);
                        this.resetEditQuestionForm();
                        this.$refs.editQuestionRef.closeDialog();
                    }
                })
            }
        },

        //重置编辑问题表单
        resetEditQuestionForm() {
            this.$refs["caseFormRef"].resetFields();
        },

    },
    watch: {

    }
}
</script>
<style lang="less" scoped>
.half-form-item {
    display: inline-block;
    width: 50%;
}
</style>
