<template>
    <div class="performance-application">
        <div class="application-title">AppStore预审</div>
        <div class="container">
            <div class="main-container">
                <div class="area-div" v-if="oldData.edit == 1">
                    <el-button 
                        v-if="editType == 'read'" 
                        type="primary" size="mini" 
                        @click="editType='edit'"
                    >
                        编辑
                    </el-button>
                    <el-button 
                        v-else-if="editType == 'edit'" 
                        type="primary" size="mini" 
                        @click="submitTestApplication"
                    >
                        保存
                    </el-button>
                    <el-button 
                        v-if="editType == 'edit'" 
                        size="mini" 
                        @click="cancel"
                    >
                        取消
                    </el-button>
                </div>
                <el-form 
                    v-if="canShowForm"
                    id="applicationForm" 
                    ref="applicationFormRef"
                    label-position="right" 
                    label-suffix=":"
                    inline 
                    :disabled="editType == 'read'" 
                    :hide-required-asterisk="editType == 'read'" 
                    :model="applicationFormList" 
                    :rules="applicationFormRules" 
                    :show-message="false" 
                >
                    <div class="area-div">
                        <div class="title-div">
                            <span class="title-span">基础信息</span>
                            <hr/>
                        </div>
                    </div>
                    <div>
                        <div v-if="editType == 'read' || editType == 'edit'" style="margin-bottom:1rem;">
                            <span class="read-item">
                                <span class="title">申请日期:</span>
                                <span>{{ oldData.start_date }}</span>
                            </span>
                            <span class="read-item">
                                <span class="title">项目名称:</span>
                                <span>{{ oldData.project_name }}</span>
                            </span>
                            <span class="read-item">
                                <span class="title">接口人:</span>
                                <span>{{ oldData.contact_person }}</span>
                            </span>
                            <span class="read-item">
                                <span class="title">包体版本:</span>
                                <span>{{ oldData.test_version }}</span>
                            </span>
                            <span class="read-item">
                                <span class="title">最迟报告日期:</span>
                                <span>{{ oldData.end_date }}</span>
                            </span>
                        </div>
                        <!--此处真正选择的是项目代号，但显示出来给用户的是项目名称，真正的项目名称是不需要用户选择的，选定代号后，从代号获取到项目名称-->
                        <el-form-item 
                            v-if="editType == 'add' || editType == 'reAdd'" 
                            class="short-form-item" 
                            label="项目名称" 
                            prop="project"
                        >
                            <self-cascader 
                                placeholder="请选择项目名称"
                                valueKey="value"
                                :selectValue.sync="applicationFormList.project"
                                :options="projectClassifyArr"
                                @change="changeProject"         
                            />
                        </el-form-item>
                        <el-form-item 
                            v-if="editType == 'add' || editType == 'reAdd'" 
                            class="short-form-item"
                            style="display:none" 
                            label="项目代号" 
                            prop="project"
                        >
                            <el-input v-model="applicationFormList.project" disabled></el-input>
                        </el-form-item>
                        <el-form-item
                            v-if="editType == 'add' || editType == 'reAdd'" 
                            :class="{ 'short-form-item': true, 'right-form-item': editType == 'add' || editType == 'reAdd' }" 
                            label="包体版本" 
                            prop="test_version"
                        >
                            <el-input v-model="applicationFormList.test_version" placeholder="请输入包体版本"></el-input>
                        </el-form-item>
                        <el-form-item 
                            v-if="editType == 'add' || editType == 'reAdd'" 
                            class="short-form-item contact-person-item" 
                            label="接口人" 
                            prop="contact_person"
                        >
                            <el-input v-model="applicationFormList.contact_person" placeholder="请输入接口人"></el-input>
                        </el-form-item>
                        <el-form-item class="short-form-item right-form-item end-date-item" label="最迟报告日期" v-if="editType == 'add' || editType == 'reAdd'" prop="end_date">
                            <el-date-picker
                                v-model="applicationFormList.end_date"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择最迟报告日期"
                            />
                        </el-form-item>
                        <el-form-item class="line-form-item" label="测试原因" prop="test_reason">
                            <el-input v-model="applicationFormList.test_reason" placeholder="请输入测试原因"></el-input>
                        </el-form-item>
                    </div>
                    <div class="area-div">
                        <div class="title-div">
                            <span class="title-span">测试设备</span>
                            <hr/>
                        </div>
                        <div>
                            <div v-if="editType != 'read'" class="platform-div">
                                <div class="platform-title">iOS最低配置</div>
                                <div class="platform-content">
                                    <el-form-item class="short-form-item" label="测试机型" prop="ios_model">
                                        <el-input v-model="applicationFormList.ios_model" placeholder="请输入测试机型"></el-input>
                                    </el-form-item>
                                    <el-form-item class="short-form-item" label="系统版本" prop="ios_os">
                                        <el-input v-model="applicationFormList.ios_os" placeholder="请输入系统版本"></el-input>
                                    </el-form-item>
                                    <el-form-item class="line-form-item" label="其他要求" prop="ios_other">
                                        <el-input v-model="applicationFormList.ios_other" :placeholder="editType == 'read' ? '无': '请输入要求内容'"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                        </div>
                    </div>
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <div class="area-div">
                                <div class="title-div">
                                    <span class="title-span">测试用例</span>
                                    <hr/>
                                </div>
                                <div style="width:100%;">
                                    <input-and-upload 
                                        v-if="editType!='read'" 
                                        ref="testCaseRef" 
                                        :select-data="testCaseDate"
                                    />
                                    <div v-else>
                                        <input-and-upload-read 
                                            :text="oldData.test_case" 
                                            :file="oldData.test_case_file" 
                                            fileSuffix="https://lhbuild.leihuo.netease.com:443/mtl/compatibility/TestCase/" 
                                        />
                                    </div>
                                </div>
                            </div>  
                        </el-col>
                        <el-col :span="12">
                            <div class="area-div">
                                <div class="title-div">
                                    <span class="title-span">测试包体</span>
                                    <hr/>
                                </div>
                                <div style="width:100%;">
                                    <input-and-upload 
                                        v-if="editType != 'read'" 
                                        ref="testInclusionsRef" 
                                        :select-data="testInclusionsData" 
                                        :project="applicationFormList.project"
                                    />
                                    <div v-else>
                                        <input-and-upload-read 
                                            :text="oldData.test_inclusions_other" 
                                            :file="oldData.test_inclusions_file" 
                                            :history-file="oldData.test_history_inclusions"
                                            fileSuffix="https://lhbuild.leihuo.netease.com:443/mtl/compatibility/TestInclusions/" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    
                    <div class="area-div">
                        <div class="title-div">
                            <span class="title-span">备注</span>
                            <hr>
                        </div>
                        <div style="width:100%;">
                            <el-input 
                                v-model="applicationFormList.remarks" 
                                type="textarea" 
                                :rows="5" 
                                :placeholder="'登陆服务器：填写测试时需要登陆的服务器，如无特殊要求则不填\n测试账号：账号1，账号2，...\n测试密码：密码1，密码2，...\n其他要求：'"
                            ></el-input>
                        </div>
                    </div>         
                </el-form>
            </div>
        </div>
        <div class="application-footer">
            <el-button
                v-if="editType == 'add' || editType == 'edit' || editType == 'reAdd'" 
                type="primary"
                class="submit-btn"
                :disabled="isSubmit"
                @click="submitTestApplication
            >
                提交
            </el-button>
        </div>
    </div>
</template>
<script>
import InputAndUpload from '@/components/Common/InputAndUpload'
import InputAndUploadRead from '@/components/Common/InputAndUploadRead'
import formRule from "@/utils/formRule.js"
import { mapState } from 'vuex'
import {getTaskProject,getTestApplyById,submitApplication} from '@/api/expertServices'
    export default {
        components: {
            InputAndUpload,
            InputAndUploadRead
        },
        data() {
            return {
                isSubmit: false,
                addAndroidInputShow: false,
                addIOSInputShow: false,
                addAndroidDeviceName: "",
                addIOSDeviceName: "",
                isSimulatorCheckedAll: 0,
                selectAll: false,
                quality_option: "2",
                addDeviceLable: "",
                addDeviceName: "",
                addDeviceForm: {
                    value: ""
                },
                //选择的设备项 add(新增),read(查看),edit(修改),reAdd(复测)，add没有id，其他三种模式都需要id，从id中获取到已有的申请数据
                editType: "add",
                canShowForm: false,
                applicationId: "",
                oldData: {},
                // 表单数据
                applicationFormList: {
                    //项目代号
                    project: "",
                    //项目名称 
                    project_name: "",
                    //包体版本 
                    test_version: "",
                    //测试原因 
                    test_reason: "",
                    //结束日期 
                    end_date: "", 
                    //接口人
                    contact_person: "",
                    //登录服务器 
                    game_quality: "", 
                    //备注
                    remarks: "",
                    // 硬盘类型
                    disk_type: "",
                    // 系统版本 
                    system_version: "",
                    // cpu 
                    cpu_name: "", 
                    test_tool: "",
                    mem_size: "",
                    gpu_name: "",
                    server: "",
                    resolution: "",
                    test_type: '20',
                    // android选择的机型
                    android_device: "", 
                    // ios选择的机型
                    ios_device: "", 
                },
                // 提交申请需要的常规参数
                applyList: [
                    'project',
                    'project_name',
                    'test_version',
                    'test_reason',
                    'contact_person',
                    'test_type',
                    'end_date',
                    'remarks',
                    'game_quality'
                ],
                remarks: "登陆服务器：\n测试账号：\n测试密码：\n其他要求：",
                testCaseDate: {
                    rightTip: "(如不填写，按照MTL常规测试进行)",
                    radioOption: [
                        { value: "textarea", label: "直接填写" },
                        { value: "file", label: "上传测试用例" }
                    ],
                    selectDict: {
                        textarea: {
                            type: "textarea",
                            placeholder: "请填写测试用例",
                            value: "",
                        },
                        file: {
                            type: "fileArr",
                            fileAccept: ".txt,.xmind,.doc,.docx,.xls,.xlsx,.rar,.zip",
                            value: "",
                        }
                    }
                },
                playData: {
                    radioOption: [
                        { value: "textarea", label: "直接填写" },
                        { value: "file", label: "上传玩法说明" },
                    ],
                    selectDict: {
                        textarea: {
                            type: "textarea",
                            placeholder: "请填入玩法说明",
                            value: "",
                        },
                        file: {
                            type: "fileArr",
                            fileAccept: ".ipa,.apk,.exe,.rar,.zip,.jpg,.jpeg,.gif,.png,.bmp",
                            value: "",
                        },
                        history: {
                            value: "",
                        },
                    }
                },
                protocolData: {
                    radioOption: [
                        { value: "textarea", label: "直接填写" },
                        { value: "file", label: "上传具体协议" },
                    ],
                    selectDict: {
                        textarea: {
                            type: "textarea",
                            placeholder: "请填入具体协议",
                            value: "",
                        },
                        file: {
                            type: "fileArr",
                            fileAccept: ".ipa,.apk,.exe,.rar,.zip,.jpg,.jpeg,.gif,.png,.bmp",
                            value: "",
                        },
                        history: {
                            value: "",
                        },
                    }
                },
                //测试包体栏
                testInclusionsData: {
                    radioOption: [
                        { value: "textarea", label: "包体链接" },
                        { value: "file", label: "本地上传" },
                        // { value: "history", label: "历史包体" },
                    ],
                    selectDict: {
                        textarea: {
                            type: "textarea",
                            placeholder: "请输入包体地址",
                            value: "",
                        },
                        file: {
                            type: "fileArr",
                            fileAccept: ".ipa,.apk,.exe,.rar,.zip,.jpg,.jpeg,.gif,.png,.bmp",
                            value: "",
                        },
                        history: {
                            value: "",
                        },
                    }
                },
                // 表单校验规则
                applicationFormRules: {
                    project: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    test_version: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    test_reason: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    end_date: [{ required: true, trigger: 'change' }],
                    contact_person: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    disk_type: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    system_version: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    cpu_name: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    test_tool: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    mem_size: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    gpu_name: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    server: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    resolution: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    test_type: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                },
                // 表单校验规则
                addDeviceFormRules: {
                    label: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                    value: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                },
                // 项目组名称下拉框数据
                projectClassifyArr: [],
            }
        },
        computed: {
            ...mapState(['getUserEmail']),
            userEmail() {
                return this.getUserEmail || "";
            },
            projectCode() {
                return this.$store.getters.getProjectCode;
            },
            isTester() {
                return this.$store.getters.getIsTester;
            },
        },
        created() {
            this.getData();
        },
        methods: {
            //获取项目组选项
            async getProjectOption() {
               let res= await getTaskProject({ operation: "获取项目组数据", failed: true },{}).then(res => {
                    // console.log(res)
                    if(res.code == 200){
                        this.projectClassifyArr = res.data;
                        // console.log(this.projectClassifyArr)
                        if (this.editType == "add") {
                            // console.log(this.editType)
                            // console.log(this.projectCode)
                            if (this.projectCode != "all") {
                                //如果当前项目组不是“全部”，默认设置申请项目组为当前项目组
                                this.applicationFormList.project = this.projectCode;
                                this.changeProject();
                            }
                        }
                    }
                    this.$store.commit("setPageIsLoading", false);
            },

            // 获取需要的数据（获取数据有顺序，需要同步功能，因此该函数内容不能直接写在create里而要async）
            async getData(){
                this.getProjectOption();
                let path = this.$route.path;
                if (path == "/mtl_test_platform/page/expertServices/appstore") {
                    //新申请
                    this.editType = "add";
                    this.applicationFormList.contact_person = this.userEmail;
                    this.canShowForm = true;
                } else if (path == "/expertPerformancePC/page/applicationDetails") {
                    //查看
                    this.editType = "read";
                    this.getOldApplication();
                } else {
                    //复测
                    this.editType = "reAdd";
                    this.getOldApplication();
                }
            },
            //获取已有申请数据
            async getOldApplication() {
                this.applicationId = this.$route.query.id;
                if (this.applicationId == undefined) {
                    //没有获取到id
                    this.errorApplicationDeal("申请id丢失，将为您跳转到测试申请界面");
                } else {
                    let list = { test_type: 21, id: this.applicationId };
                    let res = await getTestApplyById(list,{})
                        if (res.code == 200) {
                            this.oldData = JSON.parse(JSON.stringify(res.data));
                            this.dealFileAndTest();
                            for (let i in this.applyList) {
                                let k = this.applyList[i]
                                if(k == 'game_quality'){
                                    this.quality_option = res.data[k].split('_')[0]
                                    this.applicationFormList[k] = this.quality_option == "1" ? res.data[k].split('_')[1]: ""
                                }else{
                                    this.applicationFormList[k] = res.data[k];
                                }
                            }
                            let deviceData = JSON.parse(this.oldData.device)
                            // 处理已有的设备数据
                            this.deviceList = []
                            for(let i in deviceData){
                                this.applicationFormList[deviceData[i].label] = deviceData[i].value;
                                this.deviceList.push(deviceData[i].label)
                            }
                            //复测时，最迟报告日期初始化为空
                            if (this.editType == "reAdd") {
                                this.applicationFormList.end_date = "";
                            }
                            this.canShowForm = true;
                        } else {
                            this.errorApplicationDeal(res.msg);
                        }
                }
            },
            //处理文件相关的数据
            dealFileAndTest() {
                this.testCaseData.selectDict.textarea.value = this.oldData.test_case;
                this.testInclusionsData.selectDict.textarea.value = this.oldData.test_inclusions_other;
                this.testCaseData.selectDict.file.value = this.oldData.test_case_file;
                this.testInclusionsData.selectDict.file.value = this.oldData.test_inclusions_file;
                this.testInclusionsData.selectDict.history.value = this.oldData.test_history_inclusions;
            },
            //申请记录异常
            errorApplicationDeal(msg) {
                this.$message.error(msg);
                setTimeout(() => {
                    this.$router.push({
                        path: '/expertPerformancePC/page/testApplication',
                        query: { project: this.projectCode }
                    })
                }, 1000)
            },
            //修改项目组时，获取当前选中的项目组名
            changeProject() {
                let projectList = this.$publicJS.getCascacaderChoosed(this.projectClassifyArr, this.applicationFormList.project);
                this.applicationFormList.project_name = projectList.label;
            },
            //提交申请
            submitTestApplication() {
                this.isSubmit = true;
            },
            //提交申请表单
            async axiosFormData(formData) {
                let postApp = "";
                let operation = "";
                if (this.editType == "edit") {
                    //编辑
                    postApp = "update_expert_test_apply";
                    operation = "编辑申请";
                    formData.append("id", this.applicationId);
                } else {
                    //新的申请
                    postApp = "insert_test_apply";
                    operation = "申请";
                }
                let res = await submitApplication("/PerformancePCTest/" + postApp + "/", formData, { operation: operation, success: true, failed: true })
                    this.isSubmit = false;
                    this.$store.commit("setPageIsLoading", false);
                    if (res.code == 200) {
                        if (this.editType == "edit") {
                            //编辑申请时跳转到当前申请查看界面
                            this.editType = "read";
                            this.getOldApplication();
                        } else {
                            //新的申请提交成功后跳转到申请记录
                            this.$router.push({
                                path: '/expertPerformancePC/page/applicationRecord',
                                query: { project: this.projectCode }
                            })
                        }
                }
            },
            //取消编辑
            cancel() {
                this.editType = "read";
                this.getOldApplication();
            }
        },
}
</script>

<style lang="less" scoped>
.page {
    margin: 1rem 0.5rem;
}

.main-container {
    padding: 30px;
    background-color: #fff;
    border: 0 solid #e5e5e5;
    .read-item {
        margin: 0 2rem 0 0;
        color: #606266;
        line-height: 2rem;
        .title {
            margin-right: 0.5rem;
        }
    }
    .area-div {
        margin-bottom: 2rem;
        .title-div {
            padding: 0;
            margin-bottom: 1rem;
            .title-span {
                display: inline-block;
                height: 2rem;
                line-height: 2rem;
                font-size: 16px;
                font-weight: bold;
                color: #000;
                border-bottom: 2px solid #4E7AF2;
            }
            .title-tip {
                line-height: 2rem;
                font-size: 16px;
                font-weight: bold;
                color: #000;
            }
            hr {
                margin-top: -2px;
                border: none;
                border-bottom: 2px solid #e4e4e4;
            }
        }
        hr {
            margin-top: 1rem;
            border: none;
            border-bottom: 1px solid #e4e4e4;
        }
    }
}


</style>
<style lang="less">
#applicationForm {
    box-sizing: border-box;
    .el-input.is-disabled .el-input__inner,
    .el-checkbox__input.is-disabled+span.el-checkbox__label,
    .el-textarea.is-disabled .el-textarea__inner {
        color: #959595;
    }

    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
        background: #959595;
    }

    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
        border-color: #fff;
    }

    .el-input.is-disabled .el-input__inner::-webkit-input-placeholder,
    .el-textarea.is-disabled .el-textarea__inner::-webkit-input-placeholder {
        visibility: hidden;
    }

    .short-form-item {
        width:25%;
        margin-right:0%;
        .el-form-item__content {
            width: 16.2rem;
            .el-input {
                width: 100%;
            }
        }
    }

    .platform-form-item {
        width:35%;
        margin-right:2%;
        .el-form-item__content {
            width: 16rem;
            .el-input {
                width: 100%;
            }
        }
    }

    .end-date-item {
        .el-form-item__content {
            width:14.5rem;
        }
    }
    
    .contact-person-item {
        .el-form-item__label {
            width: 5.1rem;
        }
    }

    .right-form-item {
        margin-right: 0;
    }

    .long-label-short-form-item {
        .el-form-item__content {
            width: 11rem;
            .el-input {
                width: 8rem;
            }
        }
    }

    .line-form-item {
        width: 100%;
        .el-form-item__content {
            width: calc(100% - 85px);
            .el-input {
                width: 100%;
            }
        }
    }

    .no-platform {
        color: #ff8000;
        margin: 1rem 0;
    }

    .platform-div {
        margin-top: 1rem;
        .platform-title {
            width: 120px;
            margin-right: 10px;
            display: inline-block;
            vertical-align: top;
        }
        .platform-content {
            width: calc(100% - 30px);
            display: inline-block;
            background-color: #f6f9fc;
            border-radius: 4px;
            padding: 1rem 1rem 0 1rem;
            .short-form-item {
                margin-right: 1rem;
            }
            .platform-other-item {
                .el-form-item__label {
                    width: 5.1rem;
                }
            }
        }
    }

    .test-equipment-item {
        .el-form-item__content {
            width: calc(100% - 100px);
        }
    }
    
    .test-acount-upload {
        width: calc(100% - 100px);
        display: inline-block;
    }
}
</style>
<style scoped>
    .performance-application {
        width: 100%;
        flex: 1;
        margin: 20px;
        border-radius: 4px;
        background: #fff;
        display: flex;
        flex-direction: column;
        position: relative;
    }
    .container {
        width: 100%;
        overflow: auto;
        min-width: 1200px;
        margin: 2rem auto;
    }
    .application-title {
        position: absolute;
        flex: 1;
        top: 0;
        z-index: 1;
        padding: 0 20px;
        font-size: 16px;
        color: #333333;
        font-weight: 700;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.1);
        height: 47px;
        width: calc(100% - 40px);
        line-height: 47px;
        z-index: 1;
        background: #fff;
        border-radius: 4px 4px 0 0;
    }
    .application-footer {
        height: 72px;
        line-height: 72px;
        border-top: 1px solid rgba(97, 119, 255, 0.1);
        text-align: center;
    }
    .application-item-content .el-input {
        width: 325px;
    }
    .application-content .el-input__inner {
        height: 36px;
        line-height: 36px;
    }
    .case-upload .el-upload, .case-upload .el-upload-dragger, .account-upload .el-upload, .account-upload .el-upload-dragger {
        width: 100%;
    }
    .case-upload .el-upload-dragger .el-upload__text, .account-upload .el-upload-dragger .el-upload__text {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .platform-title {
        width: 130px;
        margin-right: 20px;
        margin-bottom: 2px;
        display: inline-block;
        vertical-align: center;
        margin-bottom: 10px;
        margin-top: 10px;
        font: 16px "Microsoft YaHei"
    }
    .type-item {
        width: 100%;
        font-size: 16px;
        margin-bottom: 1rem;
        margin-left: 1rem;
    }
    .type-item .type-title {
        width: 20%;
        margin-right: 1rem;
        font-weight: bold;
        vertical-align: top;
        display: inline-block;
    }
    .type-item .type-content {
        width: 75%;
        vertical-align: top;
        display: inline-block;
    }
    .submit-btn {
        width: 60px;
        height: 32px;
        background: rgba(21, 110, 239, 0.8);
        border-radius: 3px;
        color: #fff;
        font-size: 14px;
        padding: 0;
    }
</style>