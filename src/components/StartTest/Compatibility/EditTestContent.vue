<template>
    <div>
        <edit-picture ref="editPictureRef" confirm-type="parentDeal" @afterEdit="storePicChange"/> 
        <edit-question ref="editQuestionRef" :table-name="tableName" @afterEdit="afterEditQuestion" />
        <self-dialog 
            ref="editDialogRef" 
            :dialog-data="{ title: testContentDialogTitle, width: '74rem', top: '3rem', confirmName: '确定', closeName: '取消', saveName: '暂存' }" 
            @confirm="saveTestContent"
            @save="saveTempContent"
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
                    <el-form-item v-if="testContentDeviceType != 'AS'" label="预分配设备" class="public-dialog-form-item">
                        <el-input disabled v-model="testContentFormList.preset_device"></el-input>
                    </el-form-item>
                    <el-form-item 
                        v-if="testContentDeviceType != 'AS'"  
                        label="设备编号" 
                        prop="device_id" 
                        class="public-dialog-form-item"
                        >
                        <el-autocomplete
                            class="inline-input"
                            v-model="testContentFormList.device_id"
                            :disabled="testContentFormList.device_id != ''"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入设备编号"
                            style="width:95%"
                            @select="getDeiveData"
                        ></el-autocomplete>
                        <!-- <el-tooltip placement="top" effect="light" content="重新获取设备信息">
                            <i class="el-icon-refresh" @click="getDeiveData"></i>
                        </el-tooltip> -->
                    </el-form-item>
                    <!-- <el-form-item v-if="testContentDeviceType != 'AS'">
                        <a :href="'http://mtl-devices.leihuo.netease.com:30064/devices/page/devicesInfo?id=' + testContentFormList.device_id" target="blank">点此修改设备信息</a>
                    </el-form-item> -->
                    <el-form-item 
                        label="设备类型" 
                        prop="device_type" 
                        class="public-dialog-form-item"   
                        >
                        <!-- <el-radio-group 
                            v-model="testContentFormList.device_type"
                            :disabled="testContentFormList.device_id != ''" 
                            > -->
                        <el-radio-group 
                            v-model="testContentFormList.device_type"
                            disabled
                            >
                            <el-radio label="IOS">iOS</el-radio>
                            <el-radio label="Android">Android</el-radio>
                            <el-radio label="AS">Android模拟器</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="testContentDeviceType != 'AS'" label="品牌" prop="brand" class="public-dialog-form-item">
                        <el-input disabled v-model="testContentFormList.brand"></el-input>
                    </el-form-item>
                    <el-form-item label="测试机型" prop="device" class="public-dialog-form-item">
                        <span v-if="testContentDeviceType != 'AS'">
                            <!-- {{ testContentFormList.device }} -->
                            <el-input v-model="testContentFormList.device" disabled></el-input>
                        </span>
                        <el-select 
                            v-else
                            v-model="testContentFormList.device" 
                            filterable 
                            clearable
                            disabled
                            placeholder="请选择测试机型"
                            style="width:100%"
                            allow-create
                            >
                            <el-option v-for="(item,index) in asDeviceOptions" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="testContentDeviceType != 'AS'" label="系统版本" prop="os" class="public-dialog-form-item">
                        <el-input v-model="testContentFormList.os" disabled></el-input>
                    </el-form-item>
                    <el-form-item v-if="testContentDeviceType != 'AS'" label="内存" prop="ram" class="public-dialog-form-item">
                        <el-input disabled v-model="testContentFormList.ram"></el-input>
                    </el-form-item>
                    <el-form-item v-if="testContentDeviceType != 'AS'" label="CPU型号" prop="cpuModel" class="public-dialog-form-item">
                        <el-input disabled v-model="testContentFormList.cpuModel"></el-input>
                    </el-form-item>
                    <el-form-item label="是否通过" prop="if_pass" class="public-dialog-form-item">
                        <el-radio-group v-model="testContentFormList.if_pass">
                            <el-radio label="通过">通过</el-radio>
                            <el-radio label="不通过">不通过</el-radio>
                            <el-radio label="忽略">忽略</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="工时" prop="work_time">
                        <el-input 
                            v-model="testContentFormList.work_time" 
                            placeholder="请填写工时"
                            type="number"
                            style="width:50%; margin-right: 5px"
                            ></el-input>分钟
                    </el-form-item>
                    <el-form-item label="备注" prop="remarks" class="public-dialog-form-item">
                        <!-- <el-input 
                            type="textarea"
                            v-model="testContentFormList.remarks" 
                            placeholder="请填写备注"
                            style="width:95%"
                            >
                        </el-input> -->
                        <el-select v-model="testContentFormList.remarks" placeholder="选择备注" allow-create filterable >
                            <el-option v-for="item,index in remarkOption" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="log文件" prop="log_file" class="public-dialog-form-item">
                        <log-file-upload ref="logFileUploadRef" :old-file="oldLogFile" />
                    </el-form-item>
                    <el-form-item 
                        v-for="(item,index) in customCols" 
                        :key="index" 
                        :label="item.col_cn_name" 
                        :prop="item.col_name" 
                        class="public-dialog-form-item"
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
import LogFileUpload from "@/components/Common/LogFileUpload.vue"
import EditQuestion from "./EditQuestion"
import EditPicture from "@/components/Common/EditPicture"
import SelfDialog from "@/components/Common/SelfDialog.vue"
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
    },
    data() {
        return {
            //新增编辑测试内容数据
            testContentDialogTitle: "",
            testContentFormList: {
                id: "",
                preset_device: "",  // 预设设备
                device_type: "",//设备类型
                brand: "",//品牌
                device: "",//测试机型
                device_id: "",//设备编号
                if_pass: "通过",//是否通过
                os: "",//系统版本
                ram: "",//内存
                cpuModel: "", // CPU型号
                remarks: "",//备注
                work_time: "",  // 工时
                question: [],
                isReplace: false,
            },
            remarkOption: [
                "无此设备",
                "设备不可用"
            ],
            editItemPicData: {},
            beforeEditData: "",
            oldLogFile: "",
            testContentFormRules: {
                device_type: [{ required: true, trigger: 'change' }],
                brand: [{ required: true, trigger: 'change' }],
                device: [{ required: true, trigger: 'change' }],
                device_id: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                os: [{ required: true, trigger: 'change' }],
                ram: [{ required: true, trigger: 'change' }],
                cpuModel: [{ required: true, trigger: 'change' }],
                work_time: [{ required: true, trigger: 'change' }],
                if_pass: [{ required: true, trigger: 'change' }],
            },
            asDeviceOptions: [],
            questionData: [],
            uploadData: [],
            tabArr: ["兼容性问题", "功能性问题", "稳定性问题"],
            currentTab: "兼容性问题",
            tabLoading: true,
            canClearBasic: true,
            storePicData: {},
            totalDeviceIdList: []
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
        // 不在组件中@change而是通过监控值的变化来做操作，是因为这个值发生变化时，各个项的显示不同，渲染发生变化，会导致明明change了，但@change没有触发
        testContentDeviceType(newValue, oldValue){
            // 并不是监控到值就一定要clear，而是在旧的值或是新的值 是Android模拟器时才触发，这么做是为了避免从设备编号获取到各个值填入的时候，触发clear使得填入失效
            if((newValue == "AS" || oldValue == "AS") && this.canClearBasic ) {
                this.clearBasicContent();
            }
        },
    },
    created() {
        this.getAsDevices();
        // 获取所有设备id数据
        this.getTotalDeviceId();
    },
    mounted() {

    },
    methods: {
        // 暂存
        saveTempContent(){
            // console.log("暂存")
            this.$store.commit("setPageIsLoading", true);
            let formData = new FormData();
            //表单填写数据
            for (let k in this.testContentFormList) {
                if (k != "question") {
                    formData.append(k, this.testContentFormList[k] ? this.testContentFormList[k] : '');
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
            // for (var [key, valuefor] of formData) {
            //     console.log(key, valuefor);
            // }
            this.$formPost("/expertCompatibility/" + postApp + "/", formData, { operation: "暂存测试内容", success: true, failed: true }).then(res => {
                if (res.code == 200) {
                    // this.initData();
                    // this.resetTestContentForm();
                    // this.$refs.editDialogRef.closeDialog();
                    if (this.testContentDialogTitle == "编辑测试内容") {
                        this.$emit("afterEdit");
                    } else {
                        this.$emit("afterEdit", "addTestContent");
                    }
                }
                this.$store.commit("setPageIsLoading", false);
            })
        },
        // 获取所有设备id数据
        getTotalDeviceId() {
            let list = {
                selectedCondition: JSON.stringify([]),
                search_range: JSON.stringify(['id']),
            };
            this.$codePost("http://mtl-devices.leihuo.netease.com:30064/devices/get_filter_field_data_fun/", list).then(res => {
                if (res.code == 200) {
                    this.totalDeviceIdList = res.data;
                }
            })
        },
        // 远程搜索
        querySearch(queryString, cb) {
            let totalDeviceIdList = this.totalDeviceIdList.map(item => {
                return {value: item};
            });
            let results = queryString ? totalDeviceIdList.filter(this.createFilter(queryString)) : totalDeviceIdList;
            clearTimeout(this.timeout);
            cb(results);
        },
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
            }else{
                this.getQuestionData();
            }
            this.$refs.editDialogRef.openDialog();
        },
        
        //初始化填写数据
        initData(){
            let list = {
                id: "",
                device_type: "",
                brand: "",
                device: "",
                preset_device: "",
                device_id: "",
                if_pass: "通过",
                os: "",
                ram: "",
                cpuModel: "",
                remarks: "",
                work_time: "",
                question: []
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
            // console.log(item)
            this.canClearBasic = false;
            this.testContentDialogTitle = "编辑测试内容";
            this.testContentFormList.id = item.id;
            for (let k in this.testContentFormList) {
                if (k != "question") {
                    this.testContentFormList[k] = item[k] ? item[k] : '';
                } else {
                    //将问题字符串转为数字型数组
                    let questionArr = [];
                    if (!this.$checkStrIsNull(item[k])) {
                        let questionStrArr = item[k].split(",");
                        questionArr = questionStrArr.map(function(v, index, arr) {
                            return parseInt(v)
                        })
                    }
                    this.testContentFormList[k] = questionArr;
                }
            }
            //填入自定义的项值
            for (let i = 0; i < this.customCols.length; i++) {
                let colName = this.customCols[i].col_name;
                this.$set(this.testContentFormList, colName, item[colName]);
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
            this.$codePost("/expertCompatibility/get_expert_test_question/", list, { operation: "获取问题列表", failed: true }).then(res => {
                if (res.code == 200) {
                    this.questionData = res.data;
                    setTimeout(() => {
                        this.tabLoading = false;
                    }, 300)
                }
            })
        },

        //通过品牌获取测试机型选项
        getAsDevices() {
            this.$codePost("/expertCompatibility/get_simulator_list_array/", {}, { operation: "获取测试机型选项", failed: true }).then(res => {
                if (res.code == 200) {
                    this.asDeviceOptions = res.data;
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
            this.$set(this.testContentFormList, "cpuModel", "");
        },

        //设备编号blur后，获取到设备信息，提示是否要填入
        getDeiveData() {
            if (!this.$checkIsNull(this.testContentFormList.device_id)) {
                let list = { table_name: this.tableName, device_id: this.testContentFormList.device_id };
                if (this.testContentDialogTitle == "编辑测试内容") {
                    //编辑时，判断设备重复需要排除当前编辑项
                    list.id = this.testContentFormList.id;
                }
                this.$codePost("/service/get_device_by_number/", list, { operation: "获取设备具体信息", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        let data = res.data.data;
                        if (res.data.is_repeat) {
                            //重复机型提示
                            this.$selfConfirm("当前测试表中已存在该设备机型，确定仍要添加吗?", '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                                this.setDeviceData(data);
                            }).catch(() => {
                                //取消
                                this.$set(this.testContentFormList, "device_type", "");
                                this.clearBasicContent();
                            });
                        } else {
                            //不重复直接填入
                            this.setDeviceData(data);
                        }
                    } else {
                        this.$set(this.testContentFormList, "device_type", "");
                        this.clearBasicContent();
                    }
                })
            }
        },
        // 填入设备信息
        setDeviceData(data) {
            let deviceType = data.brand == "苹果" ? 'IOS' : 'Android';
            this.$set(this.testContentFormList, "device_type", deviceType);
            this.$set(this.testContentFormList, "brand", data.brand);
            this.$set(this.testContentFormList, "device", data.device);
            this.$set(this.testContentFormList, "os", data.os);
            this.$set(this.testContentFormList, "ram", data.ram);
            this.$set(this.testContentFormList, "cpuModel", data.cpuModel);
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
                this.$codePost("/expertCompatibility/judge_if_pass/", list, { operation: "自动判断是否通过", failed: true }).then(res => {
                    if (res.code == 200) {
                        this.testContentFormList.if_pass = res.data;
                    }
                })
            }
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
                    if (k != "question") {
                        formData.append(k, this.testContentFormList[k] ? this.testContentFormList[k] : '');
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
                // for (var [key, valuefor] of formData) {
                //     console.log(key, valuefor);
                // }
                this.$formPost("/expertCompatibility/" + postApp + "/", formData, { operation: this.testContentDialogTitle, success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.initData();
                        this.resetTestContentForm();
                        this.$refs.editDialogRef.closeDialog();
                        if (this.testContentDialogTitle == "编辑测试内容") {
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
            this.getIsPass();
        },

        //初始化测试内容模态框
        resetTestContentForm() {
            this.$refs["testContentFormRef"].resetFields();
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
    width: 34%;
    margin-right: 1%;
}

.question-table-card {
    width: 64%;
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
</style>
