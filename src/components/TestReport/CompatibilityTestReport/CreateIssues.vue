<template>
    <div>
        <self-dialog
            ref="createIssuesRef" 
            :dialog-data="{ title: '开单', width: '50rem', confirmName: '确认', closeName: '取消' }" 
            @confirm="confirmCreateIssues" 
            @close="resetCreateIssues">
            <div style="text-align:right;margin-bottom:1rem;">
                <a href="http://qa.leihuo.netease.com:4445/config/projectConfig" target="_blank">前往配置开单规则</a>
            </div>
            <el-form 
                ref="issuesFormRef" 
                :model="issueForm" 
                :rules="issueFormRule" 
                :show-message="false" 
                label-width="100px">
                <self-form-item 
                    v-if="projectArr"
                    :formItem="{ 
                        label:'项目', 
                        name:'project_id',
                        type:'cascader',
                        class:'public-dialog-form-item',
                        options:projectArr,
                        valueKey:'value'
                    }" 
                    :formValue.sync="issueForm.project_id" 
                    @change="changeProject"/>
                <self-form-item 
                    :formItem="{
                        label:'开单规则',
                        name:'rule_id',
                        type:'select',
                        class:'public-dialog-form-item',
                        options:rulesArr,
                        valueKey:'rule_id',
                        labelKey:'rule_name'
                    }"
                    :formValue.sync="issueForm.rule_id" 
                    @change="getIssuesConfig"/>
                
            </el-form>
            <div v-if="loadingStatus == 'error'" style="text-align: center;">
                <span style="color: red; margin-right: 1rem;">开单填写项获取失败！</span>
                <el-button 
                    type="primary"
                    style="width:30rem;"
                    @click="$popo.singalPopo(issuesPrincipal)"
                >联系负责人</el-button>
            </div>
            <el-card v-else-if="loadingStatus" class="issues-loading">
                开单填写项获取中...
            </el-card>
            <el-form 
                v-else
                ref="issuesOptionsFormRef" 
                :model="issueOptionsForm" 
                :rules="issueOptionsFormRule" 
                :show-message="false" 
                label-width="100px">
                <self-form-item
                    v-for="(issueItem,issueIndex) in issuesConfig" 
                    :key="issueIndex"
                    :formValue.sync="issueOptionsForm[issueItem.name]" 
                    :formItem="getFormItemType(issueItem)" 
                    :class="{ 'issue-form-item': issueItem.name != '描述' }"/>
            </el-form>
        </self-dialog>
    </div>
</template>

<script>
import formRule from "@/utils/formRule.js"
export default {
    props: {
        axiosList: {
            required: true,
            type: Object
        },
        pictureDict: {
            required: true,
            type: Object,
        },
        reportType: {
            required: true,
            type: String,
        }
    },
    data() {
        return {
            projectArr: "",
            rulesArr: "",
            issueForm: {
                project_id: "",
                project_name: "",
                rule_id: "",
                question_ids: [],
            },
            isNoRule: false,
            loadingStatus: true,
            issueFormRule: {
                project_id: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                rule_id: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
            },
            issuesConfig: [],
            issueOptionsForm: {},
            issueOptionsFormRule: {},
            strRule: { required: true, validator: formRule.validateStr, trigger: 'change' },
            defaultDesc: "",
            qaList: [],
            issuesPrincipal: "wb.lihuifen@mesg.corp.netease.com"
        }
    },
    created() {
        this.getIssuesPrincipal();
        this.getProjectArr();
    },
    methods: {
        // 获取开单配置网页的负责人邮箱
        getIssuesPrincipal(){
             this.$codePost("/service/get_reminder/").then(res => {
                if(res.code == 200){
                    this.issuesPrincipal = res.data.billing_platform_reminder.popo;
                }
            })
        },

        //获取项目组选项
        getProjectArr() {
            this.$codePost("/service/get_create_task_project/", {}, { operation: "获取项目组数据", failed: true }).then(res => {
                if(res.code == 200){
                    this.projectArr = res.data;
                    // console.log(this.projectArr)
                }
            })
        },

        //开始一键开单
        startCreateIssues(items) {
            // console.log(items)
            this.loadingStatus = true;
            let project = this.$route.query.project;
            this.getProjectName(project);
            this.getDefaultValue(items);
            this.getIssuesRule();
        },

        //处理获得开单问题id，默认描述内容，包含问题级别、问题类型、问题描述、涉及设备、问题图片几个数据
        getDefaultValue(items) {
            let questionIds = [];
            let defaultDesc = "";
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                questionIds.push(item.id);
                let deviceArr = []
                if(item.phoneList){

                    deviceArr = item.phoneList.map((value, index) => {
                        return value.device;
                    })
                }
                let imgArr = [];
                if (this.pictureDict[item.id] != undefined) {
                    imgArr = this.pictureDict[item.id].map((value, index) => {
                        if (this.reportType == "expert") {
                            return `<img src=${value.picture}>`;
                        } else {
                            return `<img src=${value}>`;
                        }
                    })
                }
                defaultDesc += `
                    <p style="font-weight:bold">问题级别：P${ item.q_level}</p>
                    <p style="font-weight:bold">问题类型：${ item.q_classification}</p>
                    <p style="font-weight:bold">问题描述：${ item.q_description}</p>
                    <p style="font-weight:bold">MTL接口人：${ item.test_qa_name}(${ item.test_qa})</p>
                    <p style="font-weight:bold">涉及设备：${ deviceArr.join("，")}</p>
                    <p style="font-weight:bold">问题图片：</p>    
                    <div>${ imgArr.join("，")}</div>  
                `
            }
            this.defaultDesc = defaultDesc;
            this.issueForm.question_ids = JSON.stringify(questionIds);
        },

        //切换项目组后，重新获取项目组名，及当前项目组下开单规则
        changeProject() {
            this.getProjectName(this.issueForm.project_id);
            this.getIssuesRule();
        },

        //获取项目组名
        getProjectName(project) {
            let projectList = this.$publicJS.getCascacaderChoosed(this.projectArr, project);
            // console.log(projectList)
            if (projectList.label == "") {
                //如果当前项目组无效，则默认选中第一个项目组
                this.issueForm.project_id = this.projectArr[0].children[0].value;
                this.issueForm.project_name = this.projectArr[0].children[0].label;
            } else {
                this.issueForm.project_id = project;                
                this.issueForm.project_name = projectList.label;
            }
            // console.log(this.issueForm)
        },

        //获取开单规则
        getIssuesRule() {
            this.loadingStatus = true;
            let list = {
                project_id: this.issueForm.project_id,
                project_name: this.issueForm.project_name,
                test_type: this.axiosList.test_type
            }
            this.$refs.createIssuesRef.openDialog();
            this.$codePost("/service/get_rules/", list, { operation: "获取开单规则", failed: true }).then(res => {
                if (res.code == 200) {
                    this.rulesArr = res.data;
                    if (this.rulesArr.length > 0) {
                        this.isNoRule = true;
                        this.$set(this.issueForm, "rule_id", this.rulesArr[0].rule_id);
                        this.getIssuesConfig();
                    } else {
                        this.isNoRule = false;
                        this.$set(this.issueForm, "rule_id", "");
                        this.resetCreateIssues();
                        this.$message.error("当前项目组没有配置开单规则！");
                        this.loadingStatus = "error";
                    }
                } else {
                    this.isNoRule = false;
                    this.rulesArr = [];
                    this.$set(this.issueForm, "rule_id", "");
                    this.resetCreateIssues();
                    this.loadingStatus = "error";
                }
            })
        },

        //获取开单配置项
        getIssuesConfig() {
            if (this.issueForm.rule_id != "") {
                this.loadingStatus = true;
                let list = {
                    project_id: this.issueForm.project_id,
                    rule_id: this.issueForm.rule_id,
                    test_type: this.axiosList.test_type
                }
                this.$codePost("/service/get_rule_detail/", list, { operation: "获取开单配置项", failed: true }).then(res => {
                    if (res.code == 200) {
                        this.issuesConfig = res.data;
                        this.setQuestionDataToIssues();
                        this.loadingStatus = false;
                        this.$nextTick(() => {
                            this.$refs.issuesOptionsFormRef.clearValidate();
                        })
                    } else {
                        this.loadingStatus = "error";
                    }
                })
            } else {
                this.resetCreateIssues();
                // this.loadingStatus = "error";
            }
        },

        //将问题信息整合后放入对应的开单填写中
        setQuestionDataToIssues() {
            let list = {};
            let rule = {};
            for (let i = 0; i < this.issuesConfig.length; i++) {
                let issue = this.issuesConfig[i];
                if (issue.possible_values != undefined && issue.possible_values.length > 0) {
                    list[issue.name] = issue.defaultName || "";
                } else {
                    list[issue.name] = issue.defaultValue || "";
                }
                if (issue.name == "描述") {
                    list[issue.name] = this.defaultDesc;
                } else if (issue.name == "跟进QA") {
                    this.qaList = issue.possible_values;
                }
                if (issue.is_required == true) {
                    rule[issue.name] = [this.strRule];
                }
            }
            this.issueOptionsForm = list;
            this.issueOptionsFormRule = rule;
        },

        //确认开单
        confirmCreateIssues() {
            if (this.issuesConfig.length > 0) {
                let hasError = this.$publicJS.checkFormData(this, "issuesOptionsFormRef", "您有必填项未填！");
                if (!hasError) {
                    this.$publicJS.iframeLoadingPost(true);
                    let list = JSON.parse(JSON.stringify(this.issueForm));
                    for (let k in this.axiosList) {
                        list[k] = this.axiosList[k];
                    }
                    list.options = JSON.stringify(this.issueOptionsForm);
                    list.qa_id = this.getQaId();
                    this.$codePost("/service/create_issue/", list, { operation: "开单", success: true, failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$emit("afterCreateIssue");
                            this.$refs.createIssuesRef.closeDialog();
                        }
                        this.$publicJS.iframeLoadingPost(false);
                    })
                }
            } else {
                this.$message.error("开单规则错误！")
            }
        },

        //获取qa的id（方便后台获取邮箱）
        getQaId() {
            let qa = this.issueOptionsForm["跟进QA"];
            let qaId = "";
            if (!this.$checkStrIsNull(qa)) {
                for (let i = 0; i < this.qaList.length; i++) {
                    if (qa == this.qaList[i].name) {
                        qaId = this.qaList[i].id;
                        break;
                    }
                }
            }
            return qaId;
        },

        //处理表单填写项具体信息
        getFormItemType(issue) {
            if (issue.field_format == "user") {
                let list = {
                    label: issue.name,
                    name: issue.name,
                    type: "personSelect",
                    class: 'public-dialog-form-item',
                    options: issue.possible_values,
                    valueKey: "name",
                    cnNameKey: "name",
                    emailKey: "name",
                }
                return list;
            } else if (issue.field_format == "list") {
                let list = {
                    label: issue.name,
                    name: issue.name,
                    type: "select",
                    class: 'public-dialog-form-item',
                    options: issue.possible_values,
                    valueKey: "name",
                    labelKey: "name",
                }
                return list;
            } else if (issue.name == "描述") {
                let list = {
                    label: issue.name,
                    name: issue.name,
                    type: "richEditor",
                    class: 'public-dialog-form-item',
                    canUploadPic: true,
                }
                return list;
            } else {
                let list = {
                    label: issue.name,
                    name: issue.name,
                    type: "input",
                    class: 'public-dialog-form-item',
                }
                return list;
            }
        },

        //重置开单
        resetCreateIssues() {
            this.issuesConfig = [];
            this.issueOptionsForm = {};
            this.issueFormRule = {
                project_id: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                rule_id: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
            };
        }

    }
}
</script>

<style scoped>
.issue-form-item {
    width: 50%;
    display: inline-block;
    vertical-align: top;
}

.issues-loading {
    text-align: center;
    margin: 1rem 0;
    color: #606266;
}
</style>
