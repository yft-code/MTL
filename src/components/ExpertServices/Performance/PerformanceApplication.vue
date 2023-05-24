<template>
    <div class="performance-application" :style="$route.path.indexOf('expertServices') !== -1 ? {'margin': '20px',} : {'margin-top': '30px'}">
        <div class="application-title" v-if="$route.path.indexOf('expertServices') !== -1">手游性能测试</div>
        <div class="container">
            <div v-if="$route.path.indexOf('expertServices') == -1 && (editType=='read' || editType=='edit')" class="page" style="padding-left: 20px;margin-bottom:-15px;padding-top:5px">
                <span @click="jumpPage()" style="cursor:pointer">我的任务</span>
                &nbsp;
                <i class="el-icon-arrow-right"></i> 
                &nbsp;
                <span class="blue-span">查看详细信息</span>
            </div>
            <div class="main-container">
                <div class="area-div" v-if="oldData.edit == 1">
                    <el-button v-if="editType == 'read'" type="primary" size="mini" @click="editType='edit'">编辑</el-button>
                    <el-button v-else-if="editType == 'edit'" type="primary" size="mini" @click="submitTestApplication">保存</el-button>
                    <el-button v-if="editType == 'edit'" size="mini" @click="cancel">取消</el-button>
                </div>
                <el-form 
                    v-if="canShowForm"
                    id="applicationForm" 
                    ref="applicationFormRef" 
                    :disabled="editType == 'read'" 
                    :hide-required-asterisk="editType == 'read'" 
                    :model="applicationFormList" 
                    :rules="applicationFormRules" 
                    :show-message="false" 
                    label-position="right" 
                    label-suffix=":"
                    inline>
                    <div class="area-div">
                        <div class="title-div">
                            <span class="title-span">基础信息</span>
                            <hr>
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
                            <span class="read-item" v-if="editType == 'read'">
                                <span class="title">接口人:</span>
                                <span>{{ oldData.contact_person }}</span>
                            </span>
                            <span class="read-item" v-if="editType == 'read'">
                                <span class="title">包体版本:</span>
                                <span>{{ oldData.test_version }}</span>
                            </span>
                            <span class="read-item" v-if="editType == 'read'">
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
                            prop="project"
                            style="display:none"
                        >
                            <el-input v-model="applicationFormList.project" disabled></el-input>
                        </el-form-item>
                        <el-form-item 
                            :class="{ 'short-form-item': true, 'right-form-item': editType == 'add' || editType == 'reAdd' }" 
                            label="包体版本" 
                            v-if="editType == 'add' || editType == 'reAdd' || editType == 'edit'"
                            prop="test_version"
                        >
                            <el-input v-model="applicationFormList.test_version" placeholder="请输入包体版本"></el-input>
                        </el-form-item>
                        <el-form-item 
                            v-if="editType == 'add' || editType == 'reAdd' || editType == 'edit'" 
                            class="short-form-item contact-person-item" 
                            label="接口人" 
                            prop="contact_person"
                        >
                            <el-input v-model="applicationFormList.contact_person" placeholder="请输入接口人"></el-input>
                        </el-form-item>
                        
                        <el-form-item class="short-form-item right-form-item end-date-item" label="最迟报告日期" v-if="editType == 'add' || editType == 'reAdd'  || editType == 'edit'" prop="end_date">
                            <el-date-picker
                                v-model="applicationFormList.end_date"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择最迟报告日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                        
                        <el-form-item class="line-form-item" label="测试原因" prop="test_reason">
                            <el-input v-model="applicationFormList.test_reason" placeholder="请输入测试原因"></el-input>
                        </el-form-item>
                    </div>

                    <div class="area-div">
                        <div class="title-div">
                            <span class="title-span">设备选择
                            <i v-if="isTester && (editType == 'add' || editType == 'reAdd' || editType == 'edit')" 
                                class='el-icon-edit-outline edit-icon' 
                                @click="choseTestDevice"></i>
                            </span>
                            <hr>
                        </div>
                        <div>
                            <div class="platform-content">
                                <div style="margin-bottom:1rem;">

                                    <div class="simulator-check-group" v-for="sys,k in allDeviceData" :key="k">
                                        <span class="platform-title">{{sys.label}}机型选择</span>
                                        <el-checkbox-group style="display: inline-block;" v-model="deviceDataList[sys.label]">
                                            <el-checkbox v-for="(item, index) in sys.child" :key="k+'_'+index" :label="item">{{item}}</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    
                                </div>
                                <el-form-item class="line-form-item" label="其他" prop="other_simulator">
                                    <el-input v-model="applicationFormList.other_simulator" :placeholder="editType == 'read' ? '无': '请输入其他要求'"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <div class="area-div">
                                <div class="title-div">
                                    <span class="title-span">测试画质</span>
                                    <hr>
                                </div>
                                <div>
                                    <el-radio v-model="quality_option" label="1">指定画质：
                                        <el-input v-model="applicationFormList.game_quality"></el-input>
                                    </el-radio><br>
                                    <el-radio style="margin-top: 15px" v-model="quality_option" label="2">装包后第一次进入的默认画质</el-radio>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="area-div">
                                <div class="title-div">
                                    <span class="title-span">测试内容</span>
                                    <hr>
                                </div>
                                <div>
                                    <div>
                                        <el-checkbox-group v-model="applicationFormList.test_data_field">

                                            <el-checkbox v-for="item,index in testContentList" :key="index" :label="item" style="width: 98%; align-items: baseline;display: flex; margin-bottom: 5px;">
                                                <span style="overflow: hidden;text-overflow: ellipsis;white-space: normal;word-break: break-all;">
                                                    <span v-if="item.indexOf('注') == -1">{{item}}</span>
                                                    <span v-else>{{ item.split('注')[0] }} <br>注{{ item.split('注')[1] }}</span>
                                                </span>
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="30">
                        <el-col :span="12">
                            <div class="area-div">
                                <div class="title-div">
                                    <span class="title-span">测试用例</span>
                                    <hr>
                                </div>
                                <div style="width:100%;">
                                    <input-and-upload v-if="editType!='read'" ref="testCaseRef" :select-data="testCaseData"/>
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

            <!-- 编辑测试设备模态框 -->
            <self-dialog 
                ref="choseTestDeviceRef" 
                :dialog-data="{ title: '编辑测试设备', width: '40%'}" >
                <div class="type-item" v-for="sys,k in allDeviceData" :key="k">
                    <div class="type-title">{{sys.name}}</div>
                    <div class="type-content">
                        <span v-for="(item, index) in sys.child" :key="k+'_'+index" >
                            <el-tag
                                closable
                                :disable-transitions="true"
                                style="margin:0 5px 5px 0;"
                                @close="deleteDeviceItem(sys.label, item)">
                                {{ item }}
                            </el-tag>
                        </span>
                        <div v-if="InputShow[sys.label]">
                            <el-input v-model="DeviceName[sys.label]" style="width: 40%"></el-input>
                            <el-button size="small" type="primary" style="margin-left:10px;" @click="confirmAddDevice(sys.label)">确认</el-button>
                            <el-button size="small" @click="cancelAdd(sys.label)">取消</el-button>
                        </div>
                        <el-button v-else size="small" @click="addDevice(sys.label)">新增</el-button>
                    </div>
                </div>
            </self-dialog>
        </div>
        <div v-if="editType == 'add' || editType == 'reAdd' || editType == 'edit'" class="application-footer">
            <el-button 
                :disabled="isSubmit"
                class="submit-btn"
                type="primary" 
                v-if="editType == 'add' || editType == 'edit' || editType == 'reAdd'"
                @click="submitTestApplication">提交</el-button>
            <!-- <el-button
                class="staging-btn"
            >
                暂存
            </el-button> -->
        </div>
    </div>
</template>

<script>
import InputAndUpload from '@/components/Common/InputAndUpload'
import InputAndUploadRead from '@/components/Common/InputAndUploadRead'
import formRule from "@/utils/formRule.js"
import { mapState } from 'vuex'
export default {
    components: {
        InputAndUpload,
        InputAndUploadRead
    },
    data() {
        return {
            isSubmit: false,
            allDeviceData: [],
            deviceDataList: {
                Android: [],
                iOS: [],
            },
            DeviceName: {
                Android: "",
                iOS: "",
            },
            InputShow: {
                Android: false,
                iOS: false,
            },
            quality_option: "2",
            editType: "add",//add(新增),read(查看),edit(修改),reAdd(复测)，add没有id，其他三种模式都需要id，从id中获取到已有的申请数据
            canShowForm: false,
            applicationId: "",
            oldData: {},
            // 表单数据
            applicationFormList: {
                project: "", //项目代号
                project_name: "", //项目名称
                test_version: "", //包体版本
                test_reason: "", //测试原因
                end_date: "", //结束日期
                contact_person: "", //接口人
                game_quality: "", //画质
                remarks: "", //备注
                test_type: '20',
                android_device: "", // android选择的机型
                ios_device: "", // ios选择的机型
                other_device: "", // 其他机型要求
                test_data_field: [], // 测试内容
            },
            testContentList: [
                "常规性能：游戏包大小（G）、内存占用（平均APP内存、APP最大内存）（MB）、平均APP CPU使用率（%）、平均GPU使用率（%）、平均帧数（FPS） 注：部分机型无法采集GPU数据",
                "耗电：安卓-PEase WIFI模式下采集的平均电池电流（mA），iOS-在稳压电源供电下整机的平均电流（mA）",
                "流量：游戏的平均每分钟流量（K/min）",
                "冷启动时间：点击游戏icon到游戏登录界面加载完成所需的时间（s）"
            ],
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
                'game_quality',
                'test_data_field',
            ],
            remarks: "登陆服务器：\n测试账号：\n测试密码：\n其他要求：",
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
                        placeholder: "请填写测试用例，包含需要测试的场景信息",
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
                    { value: "textarea", label: "包体链接" },
                    { value: "file", label: "本地上传" },
                    // { value: "history", label: "历史包体" },
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
            // 表单校验规则
            applicationFormRules: {
                project: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                test_version: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                test_reason: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                end_date: [{ required: true, trigger: 'change' }],
                contact_person: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                test_type: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
            },

            // 项目组名称下拉框数据
            projectClassifyArr: [],
        }
    },
    watch: {
        $route(to, from) {
            if(to.path == "/mtl_test_platform/page/expertServices/performance"){
                // 表单数据清空
                // this.$refs.applicationFormRef.resetFields()
                this.applicationFormList = {
                    project: "", //项目代号
                    project_name: "", //项目名称
                    test_version: "", //包体版本
                    test_reason: "", //测试原因
                    end_date: "", //结束日期
                    contact_person: "", //接口人
                    game_quality: "", //画质
                    remarks: "", //备注
                    test_type: '20',
                    android_device: "", // android选择的机型
                    ios_device: "", // ios选择的机型
                    other_device: "", // 其他机型要求
                    test_data_field: [], // 测试内容
                }
                this.deviceDataList = {
                    Android: [],
                    iOS: [],
                },
                this.editType = "add";
                // 重新获取数据
                this.getData()
            }
        },
    },
    computed: {
        userEmail() {
            return this.$store.getters.getUserEmail || "";
        },
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
        isTester() {
            return this.$store.getters.getIsTester;
        },
        isAdmin() {
            return this.$store.getters.getIsAdmin
        },
        prePath() {
            return this.$store.getters.getPrePath
        },
    },
    created() {
        this.getData();
    },
    methods: {
        addDevice(sys){
            if(sys === "Android"){
                this.InputShow.Android = true
            }else{
                this.InputShow.iOS = true
            }
        },
        cancelAdd(sys){
            if(sys === "Android"){
                this.InputShow.Android = false
                this.DeviceName.Android = ""
            }else{
                this.InputShow.iOS = false
                this.DeviceName.iOS = ""
            }
        },
        confirmAddDevice(sys){
            // console.log(this.DeviceName[sys])
            let value = this.DeviceName[sys]
            this.DeviceName[sys] = ""
            this.allDeviceData.forEach(item => {
                if(item.label === sys){
                    item.child.push(value)
                }
            })
            let list = {
                test_type: '20',
                device: JSON.stringify(this.allDeviceData)
            }
            
            this.$codePost("/mobilePerfTest/edit_application_schemas/",list, { operation: "更新测试设备" }).then(res => {
                this.InputShow[sys] = false
            })
        },

        //获取项目组选项
        getProjectOption() {
            // console.log(0)
            this.$codePost("/service/get_create_task_project/", { operation: "获取项目组数据", failed: true }).then(res => {
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
            })
        },
        
        // 编辑测试设备
        choseTestDevice(){
            this.$refs.choseTestDeviceRef.openDialog();
            this.handleTestDeviceData()
        },

        // 删除测试设备项
        deleteDeviceItem(sys, name){
            // console.log(sys, name)
            let confirmText = "确定删除【<b>" + name + "</b>】吗？";
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                // console.log(this.allDeviceData)
                // 删除代码块
                
                this.allDeviceData.forEach(item => {
                    if(item.label === sys){
                        item.child = item.child.filter(dev => {
                            return dev !== name
                        })
                    }
                })
                this.updateDevice("删除测试设备")
                
            }).catch(() => { });
        },


        // 获取测试设备数据
        getDeviceData(){
            this.$codePost("/mobilePerfTest/get_application_schemas/", {test_type: 20}, { operation: "获取设备数据", failed: true }).then(res => {
                if (res.code == 200) {
                    this.allDeviceData = JSON.parse(res.data[0].device)
                }
            })
        },


        updateDevice(msg){
            // 新增的代码块
            let list = {
                test_type: 20,
                device: JSON.stringify(this.allDeviceData)
            }
            this.$codePost("/mobilePerfTest/edit_application_schemas/", list, { operation: msg, success: true, failed: true }).then(res => {
                if (res.code == 200) {
                    this.$refs.choseTestDeviceRef.closeDialog();
                }
            })
        },


        // 获取需要的数据（获取数据有顺序，需要同步功能，因此该函数内容不能直接写在create里而要async）
        async getData(){
            this.getProjectOption();
            let path = this.$route.path;
            if (path == "/mtl_test_platform/page/expertServices/performance") {
                //新申请
                this.editType = "add";
                this.applicationFormList.contact_person = this.userEmail;
                this.canShowForm = true;
                this.getDeviceData();
            } else if (path == "/mtl_test_platform/page/expertServices/performanceTestDetail" || path == "/mtl_test_platform/page/performanceTestDetail") {
                //查看
                this.editType = "read";
                this.getDeviceData();
                this.getOldApplication();
            } else {
                //复测
                this.editType = "reAdd";
                this.getDeviceData();
                this.getOldApplication();
            }
        },


        //获取已有申请数据
        getOldApplication() {
            this.applicationId = this.$route.query.id;
            if (this.applicationId == undefined) {
                //没有获取到id
                this.errorApplicationDeal("申请id丢失，将为您跳转到测试申请界面");
            } else {
                let list = { test_type: 20, id: this.applicationId, table_name: this.$route.query.table_name };
                this.$codePost("/mobilePerfTest/get_test_apply_detail/", list).then(res => {
                    if (res.code == 200) {
                        this.oldData = JSON.parse(JSON.stringify(res.data));
                        this.dealFileAndTest();
                        for (let i in this.applyList) {
                            let k = this.applyList[i]
                            if(k == 'game_quality'){
                                this.quality_option = res.data[k].split('_')[0]
                                this.applicationFormList[k] = this.quality_option == "1" ? res.data[k].split('_')[1]: ""
                            }else if(k == 'test_data_field'){
                                if(res.data[k]){
                                    this.applicationFormList[k] = JSON.parse(res.data[k])
                                }else{
                                    this.applicationFormList[k] = []
                                }
                            }
                            else{
                                this.applicationFormList[k] = res.data[k];
                            }
                        }
                        let deviceData = JSON.parse(this.oldData.device)
                        // 处理已有的设备数据
                        deviceData.forEach(item => {
                            this.deviceDataList[item.label] = item.value.split(',')
                        })
                        

                        //复测时，最迟报告日期初始化为空
                        if (this.editType == "reAdd") {
                            this.applicationFormList.end_date = "";
                        }
                        this.canShowForm = true;
                    } else {
                        this.errorApplicationDeal(res.msg);
                    }
                })
            }
        },

        // 跳转到我的任务
        jumpPage() {
            this.$router.push({
                path: '/mtl_test_platform/page/workstation/myMission',
                query: { project: this.projectCode }
            })
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
                    path: '/mtl_test_platform/page/expertServices/serviceOrdersList',
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
            let hasError = this.$publicJS.checkFormData(this, "applicationFormRef", "您有必填项未填或填写不规范！");
            if(!hasError) {         
                //必填项已经填写
                this.$store.commit("setPageIsLoading", true);
                let formData = new FormData();
                //引入常规表单数据
                for(let i in this.applyList){
                    let k = this.applyList[i]
                    if (typeof (this.applicationFormList[k]) == "object") {
                        formData.append(k, JSON.stringify(this.applicationFormList[k]));
                    } else if(k == 'game_quality') {
                        // console.log(this.quality_option)
                        let quality = "装包后第一次进入的默认画质"
                        // if (this.applicationFormList[k]){
                        //     quality = this.applicationFormList[k]
                        // }
                        if(this.quality_option == '1'){
                            quality = this.applicationFormList[k]
                        }
                        formData.append(k, this.quality_option + '_' + quality);
                    }else if(k === 'test_data_field'){
                        formData.append(k, JSON.stringify(this.applicationFormList[k]));
                    }else {
                        formData.append(k, this.applicationFormList[k]);
                    }
                }
                
                // 引入测试设备数据
                this.handleTestDeviceData(formData)
                
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
                    // formData.append("old_test_account_file", testAccountResult.oldFileData.join(","));
                    formData.append("old_test_case_file", testCaseResult.oldFileData.join(","));
                    formData.append("old_test_inclusions_file", testInclusionsResult.oldFileData.join(","));
                    formData.append("old_test_history_inclusions", testInclusionsResult.oldHistoryData.join(","));
                }
                this.axiosFormData(formData);
            }else{
                this.isSubmit = false;
            }
        },


        // 提交申请时，处理测试设备数据
        handleTestDeviceData(formData){
            let device = []
            let sys = ["Android", "iOS"]
            for (let i in sys){
                let k = sys[i]
                device.push({
                    label: k,
                    value: this.deviceDataList[k].join(',')
                })
            }
            formData.append('device', JSON.stringify(device))
        },

        //提交申请表单
        axiosFormData(formData) {
            let postApp = "";
            let operation = "";
            if (this.editType == "edit") {
                //编辑
                postApp = "/mobilePerfTest/update_test_apply";
                operation = "编辑申请";
                formData.append("id", this.applicationId);
            } else {
                //新的申请
                postApp = "/service/insert_test_apply";
                operation = "申请";
            }
            // for (var key of formData.keys()) {
            //     console.log(key, formData.get(key));
            // }

            this.$formPost(postApp + "/", formData, { operation: operation, success: true, failed: true }).then(res => {
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
    margin-top: 1.5rem;
    margin-left: 0.5rem;
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
            width: calc(100% - 130px);
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
        /*
        margin: 20px;
        */
        border-radius: 4px;
        background: #fff;
        display: flex;
        flex-direction: column;
        position: relative;
        min-height: calc(100% - 40px);
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