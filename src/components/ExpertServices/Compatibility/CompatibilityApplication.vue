<template>
    <div 
        class="compatibility-application" 
        :style="$route.path.indexOf('expertServices') !== -1 ? {'margin': '20px',} : {'margin-top': '30px'}"
    >
        <div v-if="$route.path.indexOf('expertServices') !== -1" class="application-title">兼容性测试</div>
        <div class="container">
            <div 
                v-if="$route.path.indexOf('expertServices') == -1 && (editType=='read' || editType=='edit')" 
                class="page"
            >
                <span @click="jumpPage()" style="cursor:pointer">我的任务</span>
                &nbsp;
                <i class="el-icon-arrow-right"></i> 
                &nbsp;
                <span class="blue-span">查看详细信息</span>
            </div>
            <div class="main-container">
                <div class="area-div" v-if="oldData.edit == 1">
                    <el-button 
                        v-if="editType == 'read'" 
                        type="primary" 
                        size="mini" 
                        @click="editType='edit'"
                    >
                        编辑
                    </el-button>
                    <el-button 
                        v-else-if="editType == 'edit'" 
                        type="primary" size="mini" 
                        @click.stop="submitTestApplication"
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
                            <span class="title-span">测试平台</span>
                            <template>
                                <el-radio
                                    class="el-radio-margin"
                                    label="10" 
                                    v-model="applicationFormList.test_type" 
                                 >
                                    手游
                                 </el-radio>
                                <el-radio v-model="applicationFormList.test_type" label="11">端游</el-radio>
                            </template>
                            <hr>
                        </div>
                        <div>
                            <div v-if="editType != 'read'">
                                <div class="application-item-content">
                                    <div v-if="!pc_flag" class="application-flag-item">
                                        <div class="platform-tag" @click="changePlatform('android_platform')">
                                            <img :src="applicationFormList.android_platform == 1 ? androidHoverImg : androidImg">
                                            <div>Android</div>
                                        </div>
                                        <div class="platform-tag" @click="changePlatform('ios_platform')">
                                        <img :src="applicationFormList.ios_platform == 1 ? iosHoverImg : iosImg">
                                            <div>iOS</div>
                                        </div>
                                        <div class="platform-tag" @click="changePlatform('simulator_platform')">
                                            <img :src="applicationFormList.simulator_platform == 1 ? androidHoverImg : androidImg">
                                            <div>Android模拟器</div>
                                        </div>
                                    </div>
                                    <div v-else class="application-flag-item">
                                        <div class="platform-tag" @click="changePlatform('pc_platform')">
                                            <img :src="applicationFormList.pc_platform == 1 ? windowsHoverImg : windowsImg">
                                            <div>Windows</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div 
                                v-if="!applicationFormList.android_platform && !applicationFormList.ios_platform && 
                                      !applicationFormList.simulator_platform && !applicationFormList.pc_platform && 
                                      !applicationFormList.xboxPlatform" 
                                class="no-platform"
                            >
                                必须选择至少一个测试平台
                            </div>
                            <div v-if="applicationFormList.android_platform" class="platform-div">
                                <div class="platform-title">Android最低配置</div>
                                <div class="platform-content">
                                    <el-row>
                                        <el-col :span="6">
                                            <el-form-item label="测试台数" prop="android_num">
                                                <el-select 
                                                    placeholder="请选择测试台数" 
                                                    allow-create 
                                                    filterable 
                                                    clearable
                                                    v-model="applicationFormList.android_num" 
                                                >
                                                    <el-option 
                                                        v-for="item,index in androidNumOption" 
                                                        :key="index"
                                                        :label="item" 
                                                        :value="item" 
                                                    />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="系统版本">
                                                <el-input v-model="applicationFormList.android_os" placeholder="请输入系统版本"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="内存" prop="android_ram">
                                                <el-input v-model="applicationFormList.android_ram" placeholder="请输入内存"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="CPU">
                                                <self-cascader 
                                                    placeholder="请选择CPU"
                                                    valueKey="value"
                                                    :selectValue.sync="applicationFormList.android_cpu"
                                                    :options="cpuOptions"
                                                    :show-all-levels="false"
                                                />
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-form-item 
                                        class="line-form-item" 
                                        label="其他要求" 
                                        prop="android_other"
                                    >
                                        <el-input v-model="applicationFormList.android_other" :placeholder="editType == 'read' ? '无': '请输入要求内容'"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <div v-if="applicationFormList.ios_platform" class="platform-div">
                                <div class="platform-title">iOS最低配置</div>
                                <div class="platform-content">
                                    <el-row>
                                        <el-col :span="6">
                                            <el-form-item label="测试台数" prop="ios_num">
                                                <el-select 
                                                    v-model="applicationFormList.ios_num" 
                                                    placeholder="请选择测试台数" 
                                                    allow-create 
                                                    filterable 
                                                    clearable
                                                >
                                                    <el-option 
                                                        v-for="item,index in iosNumOption"
                                                        :key="index" 
                                                        :label="item" 
                                                        :value="item" 
                                                    />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="测试机型" prop="ios_model">
                                                <el-input v-model="applicationFormList.ios_model" placeholder="请输入测试机型"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="系统版本" prop="ios_os">
                                                <el-input v-model="applicationFormList.ios_os" placeholder="请输入系统版本"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="是否需要测试iPad">
                                                <el-radio v-model="applicationFormList.ipad_need" label="1">是</el-radio>
                                                <el-radio v-model="applicationFormList.ipad_need" label="0">否</el-radio>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-form-item class="line-form-item" label="其他要求" prop="ios_other">
                                        <el-input v-model="applicationFormList.ios_other" :placeholder="editType == 'read' ? '无': '请输入要求内容'"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <div v-if="applicationFormList.simulator_platform" class="platform-div">
                            <div class="platform-title">Android模拟器</div>
                                <div class="platform-content">
                                    <div style="margin-bottom:1rem;">
                                        <el-button 
                                            v-if="editType != 'read'"
                                            type="primary"
                                            size="mini"
                                            @click="checkedAllOrCancel(isSimulatorCheckedAll ? 0 : 1)"
                                        >
                                            {{ isSimulatorCheckedAll ? "取消全选" : "&emsp;全选&emsp; " }}
                                        </el-button>
                                        <div class="simulator-check-group">
                                            <el-checkbox 
                                                v-for="(item, index) in applicationFormList.simulatorList"
                                                :key="'simulator_' + index"
                                                v-model="applicationFormList[item.value]" 
                                                :true-label="1" 
                                                :false-label="0"
                                                @change="judgeSimulatorIsAllChecked"
                                            >
                                                {{ item.label }}
                                            </el-checkbox>
                                        </div>
                                    </div>
                                    <el-form-item class="line-form-item" label="其他" prop="other_simulator">
                                        <el-input v-model="applicationFormList.other_simulator" :placeholder="editType == 'read' ? '无': '请输入其他模拟器'"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <div v-if="applicationFormList.pc_platform" class="platform-div">
                            <div class="platform-title">PC最低配置</div>
                                <div class="platform-content">
                                    <el-form-item class="platform-form-item" label="处理器" prop="pc_cpu_model">
                                        <el-input v-model="applicationFormList.pc_cpu_model" placeholder="请输入处理器型号"></el-input>
                                    </el-form-item>
                                    <el-form-item class="platform-form-item" label="显卡" prop="pc_gpu_model">
                                        <el-input v-model="applicationFormList.pc_gpu_model" placeholder="请输入显卡型号"></el-input>
                                    </el-form-item>
                                    <el-form-item class="line-form-item" label="其他要求" prop="pc_other">
                                        <el-input v-model="applicationFormList.pc_other" :placeholder="editType == 'read' ? '无': '请输入要求内容'"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="area-div">
                        <div class="title-div">
                            <span class="title-span">基础信息</span>
                            <hr/>
                        </div>
                    </div>
                    <div>
                        <div v-if="editType == 'read' || editType == 'edit'" style="margin-bottom:1rem;">
                            <span class="read-item">
                                <span class="title">申请人:</span>
                                <span>{{ oldData.applicant }}</span>
                            </span>
                            <span class="read-item">
                                <span class="title">申请日期:</span>
                                <span>{{ oldData.application_date }}</span>
                            </span>
                            <span class="read-item">
                                <span class="title">项目代号:</span>
                                <span>{{ oldData.project }}</span>
                            </span>
                            <span class="read-item">
                                <span class="title">项目名称:</span>
                                <span>{{ oldData.project_name }}</span>
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
                                :selectValue.sync="applicationFormList.project"
                                :options="projectClassifyArr"
                                valueKey="value"
                                @change="changeProject"         
                            />
                        </el-form-item>
                        <el-form-item 
                            v-if="editType == 'add' || editType == 'reAdd'" 
                            class="short-form-item" 
                            label="项目代号" 
                            style="display:none"
                            prop="project"
                        >
                            <el-input v-model="applicationFormList.project" disabled></el-input>
                        </el-form-item>
                        <el-form-item 
                            label="包体版本" 
                            prop="test_version"
                            :class="{ 'short-form-item': true, 'right-form-item': editType == 'add' || editType == 'reAdd' }" 
                        >
                            <el-input v-model="applicationFormList.test_version" placeholder="请输入包体版本"></el-input>
                        </el-form-item>
                        <el-form-item 
                            v-if="editType == 'read' || editType == 'edit'" 
                            class="short-form-item right-form-item" 
                            label="接口人" 
                            prop="contact_person">
                            <el-input v-model="applicationFormList.contact_person" placeholder="请输入接口人"></el-input>
                        </el-form-item>
                        <el-form-item class="short-form-item right-form-item end-date-item" label="最迟报告日期" prop="end_date">
                            <el-date-picker
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择最迟报告日期"
                                v-model="applicationFormList.end_date"
                                @change="checkEndDate('end_date')"
                            />
                        </el-form-item>
                        <el-form-item 
                            v-if="editType == 'add' || editType == 'reAdd'" 
                            class="short-form-item contact-person-item" 
                            label="接口人" 
                            prop="contact_person"
                        >
                            <el-input v-model="applicationFormList.contact_person" placeholder="请输入接口人"></el-input>
                        </el-form-item>
                        <el-form-item class="line-form-item" label="测试原因" prop="test_reason">
                            <el-input v-model="applicationFormList.test_reason" placeholder="请输入测试原因"></el-input>
                        </el-form-item>
                        <el-form-item 
                            v-if="pc_flag"
                            label="服务器" 
                            class="line-form-item" 
                            prop="server"
                        >
                            <el-input v-model="applicationFormList.server" placeholder="请输入测试服务器"></el-input>
                        </el-form-item>
                    </div>
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <div class="area-div">
                                <div class="title-div">
                                    <span class="title-span">测试用例</span>
                                    <hr>
                                </div>
                                <div style="width:100%;">
                                    <input-and-upload 
                                        v-if="editType!='read'" 
                                        ref="testCaseRef" 
                                        :select-data="testCaseData"
                                    />
                                    <div v-else>
                                        <input-and-upload-read 
                                            :text="oldData.test_case" 
                                            :file="oldData.test_case_file" 
                                            :fileSuffix="prePath.testCase" 
                                        />
                                    </div>
                                </div>
                            </div>  
                        </el-col>
                        <el-col :span="12">
                            <div class="area-div">
                                <div class="title-div">
                                    <span class="title-span">测试包体</span>
                                    <hr>
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
                                            :fileSuffix="prePath.testInclusion" 
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

        <div class="application-footer" v-if="editType == 'add' || editType == 'reAdd'">
            <el-button
                class="submit-btn"
                :disabled="isSubmit"
                @click.stop="submitTestApplication"
                v-if="editType == 'add' || editType == 'edit' || editType == 'reAdd'"
            >
                提交
            </el-button>
        </div>
    </div>
</template>
<script>
    import packageUpload from '@/components/Common/PackageUpload.vue'
    import schedule from '@/components/Common/Schedule.vue'
    import InputAndUploadRead from "@/components/Common/InputAndUploadRead.vue"
    import InputAndUpload from "@/components/Common/InputAndUpload.vue"
    import SelfCascader from "@/components/Common/SelfCascader.vue"
    import formRule from "@/utils/formRule.js"
    import {submitApplication} from "@/api/expertServices"
    export default {
        components: {
            packageUpload,
            schedule,
            InputAndUploadRead,
            InputAndUpload,
            SelfCascader
        },
        data() {
            return {
                isSubmit: false,
                androidNumOption: [
                    '20',
                    '30',
                    '50',
                    '70',
                    '100',
                    '150',
                    '200',
                ],
                iosNumOption: [
                    '10',
                    '20',
                    '30',
                    '40',
                    '50',
                ],
                cpuOptions: [],
                canShowForm: false,
                oldData: {},
                projectClassifyArr: [],
                //测试账号栏
                testAccountData: {
                    radioOption: [
                        { value: "textarea", label: "直接填写" },
                        { value: "file", label: "上传账号文件" }
                    ],
                    selectDict: {
                        textarea: {
                            type: "textarea",
                            placeholder: "默认使用MTL申请的163邮箱账号登录\n如有特殊要求（如提供特定等级账号），请按以下格式给出账号:\n账号1，密码1\n账号2，密码2",
                            value: "",
                        },
                        file: {
                            type: "fileArr",
                            fileAccept: ".txt,.xmind,.doc,.docx,.xls,.xlsx,.rar,.zip",
                            value: "",
                        }
                    }
                },
                //测试包体栏
                testInclusionsData: {
                    radioOption: [
                        { value: "textarea", label: "下载链接" },
                        { value: "file", label: "本地上传" },
                    ],
                    selectDict: {
                        textarea: {
                            type: "textarea",
                            placeholder: "请输入其他方式或包体地址等",
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
                //测试用例栏
                testCaseData: {
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
                // 申请数据
                isSimulatorCheckedAll: 0,
                // add(新增),read(查看),edit(修改),reAdd(复测)，add没有id，其他三种模式都需要id，从id中获取到已有的申请数据
                editType: "add",
                accountfileList: [],
                casefileList: [],
                packageAcceptList: '.apk,.ipa,.exe,.zip,.rar',
                accountAcceptList: '.doc,.txt,.zip,.rar',
                caseAcceptList: '.doc,.txt,.zip,.rar',
                applicationFormRules: {
                    project: [{ required: true, message: '请输入项目代号', validator: formRule.validateStr, trigger: 'blur' }],
                    test_version:[{required:true, message: '请输入包体版本', validator: formRule.validateStr, trigger: 'blur'}],
                    test_reason: [{required: true, message: '请输入测试原因', validator: formRule.validateStr, trigger: 'blur'}],
                    single_time: [{required: true, message: '请输入时间', validator: formRule.necessaryIntNumber, trigger: 'blur'}],
                    end_date: [{ required: true, message: '请输入最迟报告日期', trigger: 'change' }],
                    contact_person: [{ required: true, message: '请输入测试联系人', validator: formRule.validateStr, trigger: 'blur' }],
                    server: [{ required: true, message: '请输入测试服务器', validator: formRule.validateStr, trigger: 'blur' }],
                    android_os: [{ required: true, message:'请输入Android测试台数', trigger: 'blur' }],
                    android_num: [{ required: true, message:'请输入iOS测试台数', trigger: 'blur' }],
                    ios_num: [{ required: true, message:'请输入系统版本', validator: formRule.validateStr, trigger: 'blur' }],
                    test_type: [{ required: true, message: '请选择是否手游', validator: formRule.validateStr, trigger: 'blur' }]
                },
                projectData: [],
                applicationFormList: {
                    android_cpu: "",
                    ipad_need: "0",
                    // 测试类型
                    test_type: '10',
                    // 项目代号project   
                    project: '',
                    // 项目名称project_name    
                    project_name: [],
                    //包体版本test_version   
                    test_version:"",
                    //测试原因test_reason    
                    test_reason: '',
                    //单台测试时间single_time    
                    single_time: 40,
                    // 最迟报告日期end_date    
                    end_date: '', 
                    // 接口人contact_person  
                    contact_person: '',
                    // 安卓平台android_platform  
                    android_platform: 1, 
                    // ios平台ios_platform
                    ios_platform: 1, 
                    simulatorList: [],
                    // Android模拟器simulator_platform  
                    simulator_platform: 1,
                    // PC平台pc_platform 
                    pc_platform: 0,  
                    //安卓系统版本
                    android_os: "Android 5",
                    android_num: "",
                    ios_num: "",
                    //安卓内存
                    android_ram: "2G",
                    // 安卓其他要求android_other
                    android_other: "",
                    //IOS测试机型 
                    ios_model: "iPhone 8P",
                    //IOS系统版本
                    ios_os: "iOS 9",
                    //IOS其他要求
                    ios_other: "",
                    //其他模拟器
                    other_simulator: "",
                    //PC处理器
                    pc_cpu_model: "", 
                    //PC显卡
                    pc_gpu_model: "", 
                    server: "任意服务器",
                    // 备注
                    remarks: "",
                    //登录服务器   
                    login_server: "",
                },
                androidImg: require('@/assets/img/android.png'),
                androidHoverImg: require('@/assets/img/android_hover.png'),
                iosImg: require('@/assets/img/ios.png'),
                iosHoverImg: require('@/assets/img/ios_hover.png'),
                windowsImg: require('@/assets/img/windows.png'),
                windowsHoverImg: require('@/assets/img/windows_hover.png'),
                xboxImg: require('@/assets/img/xbox.png'),
                xboxHoverImg: require('@/assets/img/xbox_hover.png'),
                isSelectAll: 0,
                // 标志是否PC
                pc_flag: 0,
            }
        },
        props:{
            
        },
        created(){
            this.getData();
        },
        mounted(){
            
        },
        computed:{
            userEmail() {
                return this.$store.getters.getUserEmail || "";
            },
            projectCode() {
                return this.$store.getters.getProjectCode;
            },
            isTester () {
                return this.$store.getters.getIsTester
            },
            isAdmin() {
                return this.$store.getters.getIsAdmin
            },
            prePath() {
                return this.$store.getters.getPrePath
            },
        },
        watch:{
            'applicationFormList.test_type':{
                handler(newTestType,oldTestType){
                    // console.log(newTestType, oldTestType)
                    if(newTestType == '11') {
                        this.applicationFormList.android_platform = 0
                        this.applicationFormList.ios_platform = 0
                        this.applicationFormList.simulator_platform = 0
                        this.applicationFormList.pc_platform = 1
                        this.pc_flag = 1
                    }else{
                        this.applicationFormList.android_platform = 1
                        this.applicationFormList.ios_platform = 1
                        this.applicationFormList.simulator_platform = 1
                        this.applicationFormList.pc_platform = 0
                        this.pc_flag = 0
                    }
                },
                //为true，表示深度监听，这时候就能监测到a值变化
                deep:true 
            },
            $route(to, from) {
                if(to.path == "/mtl_test_platform/page/expertServices/compatibility"){
                    // 表单数据清空
                    this.applicationFormList = {
                        //测试类型
                        test_type: '10',
                        //项目代号project 
                        project: '',
                        // 项目名称project_name    
                        project_name: [],
                        //包体版本test_version    
                        test_version:"",
                         //测试原因test_reason    
                        test_reason: '',
                        //单台测试时间single_time   
                        single_time: 40,
                        // 最迟报告日期end_date    
                        end_date: '', 
                        // 接口人contact_person  
                        contact_person: '',
                        // 安卓平台android_platform  
                        android_platform: 1,
                        // ios平台ios_platform 
                        ios_platform: 1, 
                        android_num: "",
                        server: "任意服务器",
                        ios_num: "",
                        simulatorList: [], 
                        // Android模拟器simulator_platform 
                        simulator_platform: 0, 
                        // PC平台pc_platform
                        pc_platform: 0,  
                        //安卓系统版本
                        android_os: "",
                        //安卓内存
                        android_ram: "",
                        // 安卓其他要求android_other
                        android_other: "", 
                        //IOS测试机型
                        ios_model: "",
                        //IOS系统版本
                        ios_os: "",
                        //IOS其他要求
                        ios_other: "",
                        //其他模拟器
                        other_simulator: "",
                        //PC处理器
                        pc_cpu_model: "", 
                        //PC显卡
                        pc_gpu_model: "", 
                        // 备注
                        remarks: "",
                        //登录服务器   
                        login_server: "",
                    },
                    this.editType = "add";
                    // 重新获取数据
                    this.getData()
                }
            },
        },
        methods:{
            //跳转到测试记录界面
            jumpPage() {
                this.$router.push({
                    path: '/mtl_test_platform/page/workstation/myMission',
                    query: { project: this.projectCode }
                })
            },
            //取消编辑
            cancel() {
                this.editType = "read";
                this.getOldApplication();
            },

            //校验最迟报告日期
            checkEndDate(checkItem) {
            },
            //让后台校验最迟报告日期
            judgeEndData(){
            },
            // 最迟报告日期相关项错误处理
            dateRelatedError(checkItem){
                if(checkItem == "single_time"){
                    this.$message.error("申请人预估单台测试时间为空或填写不规范！");
                }else if(checkItem == "device_num"){
                    this.$message.error("期望测试设备数为空或填写不规范！");
                }
                this.$set(this.applicationFormList, "end_date", "");
            },

            checkNumber(checkItem){
                let value = this.applicationFormList[checkItem];
                if (/^\d+$/.test(value)) {
                    //是整数
                    return false;
                } else if (value == undefined || value == null || value === "") {
                    return true;
                } else {
                    return true;
                }
            },

            // 申请记录异常
            errorApplicationDeal(msg) {
                this.$message.error(msg);
                setTimeout(() => {
                    this.$router.push({
                        path: '/mtl_test_platform/page/expertServices/compatibility',
                        query: { project: this.projectCode }
                    })
                }, 1000)
            },

            //提交申请表单
            axiosFormData(applicationFormList) {
                let postApp = "";
                let operation = "";
                if (this.editType == "edit") {
                    //编辑
                    postApp = "/expertCompatibility/update_expert_test_apply";
                    operation = "编辑申请";
                    applicationFormList.append("id", this.applicationId);
                } else {
                    //新的申请
                    postApp = "/service/insert_test_apply";
                    operation = "申请";
                } 
                this.$formPost(postApp + "/", applicationFormList, { operation: operation, success: true, failed: true }).then(res => {
                    this.isSubmit = false;
                    this.$store.commit("setPageIsLoading", false);
                    if (res.code == 200) {
                        if (this.editType == "edit") {
                            //编辑申请时跳转到当前申请查看界面
                            this.editType = "read";
                            this.getOldApplication();
                        } else {
                            // 非mtl普通qa新的申请提交成功后跳转到申请记录
                            if(!this.isTester && !this.isAdmin){
                                this.$router.push({
                                    path: '/mtl_test_platform/page/expertServices/serviceOrdersList',
                                    query: { project: this.projectCode }
                                })
                            }else{
                                // mtl普通qa跳转到工作站页面
                                this.$router.push({
                                    path: '/mtl_test_platform/page/workstation/myMission',
                                    query: { project: this.projectCode }
                                })
                            }
                        }
                    }
                })
            },

            submitTestApplication(){
                this.isSubmit = true;
                let hasError = this.$publicJS.checkFormData(this, "applicationFormRef", "您有必填项未填或填写不规范！");
                if(!hasError) {
                    //必填项已经填写
                    if (!this.applicationFormList.android_platform && !this.applicationFormList.ios_platform && !this.applicationFormList.simulator_platform && !this.applicationFormList.pc_platform) {
                        //测试设备一个都没选
                        this.$message.error("必须选择至少一个测试平台！");
                        return
                    } else {
                        this.$store.commit("setPageIsLoading", true);
                        let formData = new FormData();
                        //引入常规表单数据
                        for (let k in this.applicationFormList) {
                            if (typeof (this.applicationFormList[k]) == "object") {
                                formData.append(k, JSON.stringify(this.applicationFormList[k]));
                            } else {
                                formData.append(k, this.applicationFormList[k]);
                            }
                        }

                        //处理测试用例数据
                        let testCaseResult = this.$refs.testCaseRef.getResult();
                        formData.append("test_case", testCaseResult.textareaValue);
                        if (testCaseResult.type == "file" && testCaseResult.fileData.length > 0) {
                            for (let i = 0; i < testCaseResult.fileData.length; i++) {
                                formData.append("test_case_file", testCaseResult.fileData[i].raw);
                            }
                        }
                        //处理测试包体数据
                        let testInclusionsResult = this.$refs.testInclusionsRef.getResult();
                        formData.append("test_inclusions_other", testInclusionsResult.textareaValue);
                        formData.append("test_history_inclusions", JSON.stringify(testInclusionsResult.historyArr));
                        if (testInclusionsResult.type == "file" && testInclusionsResult.fileData.length > 0) {
                            for (let i = 0; i < testInclusionsResult.fileData.length; i++) {
                                formData.append("test_inclusions_file", testInclusionsResult.fileData[i].raw);
                            }
                        }

                        if (this.editType == "edit" || this.editType == "reAdd") {
                            formData.append("old_test_case_file", testCaseResult.oldFileData.join(","));
                            formData.append("old_test_inclusions_file", testInclusionsResult.oldFileData.join(","));
                            formData.append("old_test_history_inclusions", testInclusionsResult.oldHistoryData.join(","));
                        }
                        this.axiosFormData(formData);
                    }
                }else{
                    this.isSubmit = false;
                }
            },

            // 判断模拟器是否全选
            judgeSimulatorIsAllChecked() {
                let result = false;
                for (let i in this.applicationFormList.simulatorList) {
                    let key = this.applicationFormList.simulatorList[i].value;
                    if (this.applicationFormList[key] == 0) {
                        result = false;
                    }
                }
                if (result) {
                    this.isSimulatorCheckedAll = 1;
                } else {
                    this.isSimulatorCheckedAll = 0;
                }
            },
            //全选/取消全选 模拟器
            checkedAllOrCancel(value) {
                this.isSimulatorCheckedAll = value;
                this.applicationFormList.simulatorList.map((option) => {
                    let key = option.value;
                    this.$set(this.applicationFormList, key, value)    // 这里什么意思需要确定
                })
            },

            //获取模拟器选项
            getSimulatorOption() {
                return new Promise(resolve => {
                    this.$axiosGet("/expertCompatibility/get_simulator_list/", "", { operation: "获取模拟器", failed: true }).then(res => {    // 获取模拟器接口
                        if (res.code == 200) {
                            this.applicationFormList.simulatorList = res.data;
                            this.applicationFormList.simulatorList.map((option) => {
                                let key = option.value;
                                this.$set(this.applicationFormList, key, 0);
                            })
                        }
                        resolve(res);
                    })
                })
            },
            async getData(){
                this.getProjectOption();
                this.getCPUOption()
                await this.getSimulatorOption();
                let path = this.$route.path;
                if (path == "/mtl_test_platform/page/expertServices/compatibility") {
                    //新申请
                    this.editType = "add";
                    this.applicationFormList.contact_person = this.userEmail;
                    this.canShowForm = true;
                } else if (path == "/mtl_test_platform/page/expertServices/compatibilityTestDetail" || path == "/mtl_test_platform/page/expertServices/compatibilityPCTestDetail" || path == "/mtl_test_platform/page/compatibilityTestDetail" || path == "/mtl_test_platform/page/compatibilityPCTestDetail") {
                    //查看
                    this.editType = "read";
                    this.getOldApplication();
                } else {
                    //复测
                    this.editType = "reAdd";
                    this.getOldApplication();
                }
            },

            // 获取cpu数据
            getCPUOption(){
                this.$codePost("/expertCompatibility/get_model_cpu/", { operation: "获取cpu数据", failed: true }).then(res => {
                    if(res.code == 200){
                        this.handleCPUOptions(res.data.brand, res.data.data)
                    }
                })
            },

            // 处理后端给的数据
            handleCPUOptions(brand, data){
                this.cpuOptions = []
                brand.forEach(item => {
                    let tmp = {}
                    tmp.label = item
                    tmp.children = []
                    data[item].forEach(item1 => {
                        let tmp1 = {}
                        tmp1.label = item1
                        tmp1.value = item1
                        tmp.children.push(tmp1)
                    })
                    this.cpuOptions.push(tmp)
                })
            },

            //获取项目组选项
            getProjectOption() {
                // console.log(0)
                this.$codePost("/service/get_create_task_project/", { operation: "获取项目组数据", failed: true }).then(res => {
                    if(res.code == 200){
                        this.projectClassifyArr = res.data;
                        if (this.editType == "add") {
                            if (this.projectCode != "all") {
                                //如果当前项目组不是“全部”，默认设置申请项目组为当前项目组
                                this.applicationFormList.project = this.projectCode;
                                this.changeProject();
                            }
                        }
                    }
                    this.$store.commit("setPageIsLoading", false);
                })
            },

            //获取已有申请数据
            getOldApplication() {
                this.applicationId = this.$route.query.id;
                if (this.applicationId == undefined) {
                    // 没有获取到id
                    this.errorApplicationDeal("申请id丢失，将为您跳转到测试申请界面");
                } 
                else {
                    let list = { table_name: this.$route.query.table_name, test_type: this.$route.query.test_type, id: this.applicationId };
                    this.$codePost("/expertCompatibility/apply_detail/", list).then(res => {
                        if (res.code == 200) {
                            this.oldData = JSON.parse(JSON.stringify(res.data));
                            this.dealFileAndTest();
                            for (let k in this.applicationFormList) {
                                if(k !== 'simulatorList'){
                                    if(k == "ipad_need"){
                                        this.applicationFormList[k] = res.data[k] + '';
                                    }else{
                                        this.applicationFormList[k] = res.data[k];
                                    }
                                }
                            }
                            //复测时，最迟报告日期初始化为空
                            if (this.editType == "reAdd") {
                                this.applicationFormList.end_date = "";
                            }
                            this.judgeSimulatorIsAllChecked();
                            this.canShowForm = true;
                        } 
                        else {
                            this.errorApplicationDeal(res.msg);
                            window.location.href = '/mtl_test_platform/page/expertServices/compatibility'
                        }
                    })
                }
            },

            //处理文件相关的数据
            dealFileAndTest() {
                this.testAccountData.selectDict.textarea.value = this.oldData.test_account;
                this.testCaseData.selectDict.textarea.value = this.oldData.test_case;
                this.testInclusionsData.selectDict.textarea.value = this.oldData.test_inclusions_other;
                this.testAccountData.selectDict.file.value = this.oldData.test_account_file;
                this.testCaseData.selectDict.file.value = this.oldData.test_case_file;
                this.testInclusionsData.selectDict.file.value = this.oldData.test_inclusions_file;
                this.testInclusionsData.selectDict.history.value = this.oldData.test_history_inclusions;
            },


            //修改项目组时，获取当前选中的项目组名
            changeProject() {
                let projectList = this.$publicJS.getCascacaderChoosed(this.projectClassifyArr, this.applicationFormList.project);
                // console.log(projectList)
                // this.applicationFormList.project_name = projectList.value[1];
                this.applicationFormList.project_name = projectList.label;
                // console.log(this.applicationFormList.project_name)
            },

            changeproject_name(value) {
                this.applicationFormList.projectCode = value[value.length - 1];
            },
            changePlatform(key) {
                this.applicationFormList[key] = this.applicationFormList[key] == 0 ? 1 : 0;
            },
            handleSelectAll() {
                this.applicationFormList.simulatorList.forEach((item) => {
                    this.$set(item, 'value', this.isSelectAll ? true : false);
                })
            },
            changeSimulator(value) {
                if (!value) {
                    this.isSelectAll = false;
                } else {
                    let falseList = this.applicationFormList.simulatorList.filter(item => !item.value);
                    this.isSelectAll = falseList.length > 0 ? false : true;
                }
            },
        },
    }
</script>
<style lang="less" scoped>
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
            width:48%;
            margin-right:2%;
            .el-form-item__content {
                width: 100%;
                .el-input {
                    width: 100% !important;
                }
            }
        }

        .end-date-item {
            .el-form-item__content {
                width:14.5rem;
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

        .no-platform {
            color: #ff8000;
            margin: 1rem 0;
        }

        .platform-div {
            margin-top: 1rem;
            .platform-title {
                width: 130px;
                margin-right: 20px;
                margin-bottom: 2px;
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


    .compatibility-application {
        flex: 1;
        width: 100%;
        border-radius: 4px;
        background: #fff;
        display: flex;
        flex-direction: column;
        position: relative;
        min-height: calc(100% - 40px);
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
    .application-container {
        flex: 1;
        width: 100%;
    }
    .application-content {
        padding: 20px;
        margin-top: 10px;
    }
    .application-item-title {
        margin-top:30px;
        padding: 10px 0;
        border-bottom: 2px solid rgba(0, 0, 0, 0.2);
        color: #555555;
        font-size:20px;
    }
    .application-item-content {
        width: 98%;
        padding: 20px 0;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
    }
    .application-flag-item{
        display: flex; 
        align-items: center;
    }
    .application-item-content .el-form-item {
        margin-right: 67px;
    }
    .platform-tag:first-child {
        margin-left: 20px;
    }
    .platform-tag {
        cursor: pointer;
        margin-right: 100px;
        text-align: center;
    }
    .platform-tag img {
        width: 60px;
        height: 60px;
    }
    .platform-tag div {
        margin-top: 20px;
        color: #666666;
        font-size: 14px;
    }
    .application-footer {
        height: 72px;
        line-height: 72px;
        border-top: 1px solid rgba(97, 119, 255, 0.1);
        text-align: center;
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
    .staging-btn {
        margin-left: 60px;
        padding: 0;
        width: 60px;
        height: 32px;
        background: rgba(21, 110, 239, 0.1);
        border: 1px solid #156EEF;
        border-radius: 3px;
        color: rgba(21, 110, 239, 1);
        font-size: 14px;
    }
    .case-upload 
    .el-upload, 
    .case-upload 
    .el-upload-dragger,
    .account-upload 
    .el-upload, 
    .account-upload 
    .el-upload-dragger {
        width: 100%;
    }
    .case-upload 
    .el-upload-dragger 
    .el-upload__text, 
    .account-upload 
    .el-upload-dragger 
    .el-upload__text {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    
    .simulator-check-group {
        display: inline-block;
        width: calc(100% - 100px);
        vertical-align: top;
        margin-left: 1rem;
        line-height: 28px;
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
    .right-form-item {
        margin-right: 0;
    }
    .contact-person-item {
        .el-form-item__label {
            width: 5.1rem;
        }
    }
    .read-item {
        margin: 0 8rem 0 0;
        color: #606266;
        line-height: 2rem;
        .title {
            margin-right: 0.5rem;
        }
    }
    
    .container {
        width: 100%;
        overflow: auto;
        min-width: 1200px;
    }
</style>
<style lang="less" scoped>
.page {
    margin-top: 1.5rem;
    margin-left: 0.5rem;
    padding:5px 0 -15px 20px;
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
            .el-radio-margin{
               margin-left: 15px;
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

.simulator-check-group {
    display: inline-block;
    width: calc(100% - 100px);
    vertical-align: top;
    margin-left: 1rem;
    line-height: 28px;
}

.short-form-item {
    width:30%;
    margin-right:0%;
    .el-form-item__content {
        width: 20.2rem;
        .el-input {
            width: 100%;
        }
    }
}

</style>