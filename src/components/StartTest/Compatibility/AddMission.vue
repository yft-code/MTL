<template>
    <div>
        <self-dialog 
            ref="editDialogRef" 
            :dialog-data="{ title: testContentDialogTitle, width: '60rem', top: '10rem', confirmName: '确定', closeName: '取消' }" 
            @confirm="saveTestContent"
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
                    <!-- <el-form-item v-if="testContentDeviceType != 'AS'" label="预分配设备" class="public-dialog-form-item">
                        <el-input disabled v-model="testContentFormList.preset_device"></el-input>
                    </el-form-item> -->
                    <el-form-item 
                        v-if="testContentDeviceType != 'AS'"  
                        label="设备编号" 
                        class="public-form-item"
                        prop="device_id">
                        <el-autocomplete
                            class="inline-input"
                            v-model="testContentFormList.device_id"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入设备编号"
                            style="width:45%"
                            @select="getDeiveData"
                        ></el-autocomplete>
                        <el-tooltip placement="top" effect="light" content="重新获取设备信息">
                            <i class="el-icon-refresh" @click="getDeiveData"></i>
                        </el-tooltip>
                        <span v-if="testContentDeviceType != 'AS'" style="margin-left: 10px;"><a :href="'http://mtl-devices.leihuo.netease.com:30064/devices/page/devicesInfo?id=' + testContentFormList.device_id" target="blank">点此修改设备信息</a></span>
                    </el-form-item>
                    <el-form-item 
                        label="设备类型" 
                        prop="device_type" 
                        class="public-dialog-form-item"   
                        >
                        <!-- <el-radio-group 
                            v-model="testContentFormList.device_type"
                            :disabled="testContentFormList.device_id != ''" 
                            > -->
                        <el-radio-group v-model="testContentFormList.device_type">
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
                </el-form>
            </div>
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import EditQuestion from "./EditQuestion"
import EditPicture from "@/components/Common/EditPicture"
import SelfDialog from "@/components/Common/SelfDialog.vue"
export default {
    components: {
        EditQuestion,
        EditPicture,
        SelfDialog
    },
    props: {
        tableName: String,
    },
    data() {
        return {
            //新增编辑测试内容数据
            testContentDialogTitle: "",
            testContentFormList: {
                // id: "",
                device_type: "",
                brand: "",
                device: "",
                preset_device: "",
                device_id: "",
                os: "",
                ram: "",
                cpuModel: "",
            },
            testContentFormRules: {
                device_type: [{ required: true, trigger: 'change' }],
                brand: [{ required: true, trigger: 'change' }],
                device: [{ required: true, trigger: 'change' }],
                device_id: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                os: [{ required: true, trigger: 'change' }],
                ram: [{ required: true, trigger: 'change' }],
                cpuModel: [{ required: true, trigger: 'change' }],
            },
            asDeviceOptions: [],
            canClearBasic: true,
            totalDeviceIdList: [],
            testQa: "",
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


        openDialog(testQa) {
            this.testQa = testQa;
            this.testContentDialogTitle = "新增测试任务";
            this.initData();
            
            this.$refs.editDialogRef.openDialog();
        },
        
        //初始化填写数据
        initData(){
            let list = {
                // id: "",
                device_type: "",
                brand: "",
                device: "",
                preset_device: "",
                device_id: "",
                os: "",
                ram: "",
                cpuModel: "",
            };
            this.testContentFormList = list;
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
                formData.append("preset_device", this.testContentFormList.device);
                formData.append("table_name", this.tableName);
                formData.append("test_qa", this.testQa);
                
                let postApp = "insert_expert_test_record";
                // let postApp = "update_expert_test_record";
                
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

        

        //初始化测试内容模态框
        resetTestContentForm() {
            this.$refs["testContentFormRef"].resetFields();
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
    width: 100%;
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
.public-dialog-form-item {
    color: rgba(48, 49, 51, 0.6);
    margin-bottom: 1rem;
    display: inline-block;
    width: 45%;
}
.public-form-item .el-form-item__label {
    color: rgba(48, 49, 51, 0.6);
}
</style>
