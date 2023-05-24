<template>
    <div>
        <self-dialog
            ref="addRef"
            :dialog-data="{ title: '新增', width: '35rem', confirmName: '确认', closeName: '取消' }" 
            @confirm="confirmAdd" @close="closeAdd">
            <div v-if="dialogMessage=='新增cpu等级'" style="text-align: center">
                是否新增等级{{max_level+1}}
            </div>
            <el-form 
                v-else-if="dialogMessage=='新增cpu覆盖'"
                ref="addCPUFormRef"
                :model="cpuForm"
                :rules="cpuFormRules" 
                label-width="12rem" 
                :show-message="false">
                <el-form-item label="选择新增等级" prop="level">
                    <el-select v-model="cpuForm.level" placeholder="选择等级" style="width:16rem;" clearable>
                        <el-option v-for="i in max_level" :label="i" :value="i" :key="i"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="CPU厂商" prop="brand">
                        <el-select v-model="cpuForm.brand" placeholder="选择cpu厂商" style="width:16rem;">
                          <el-option v-for="item,index in cpuBrandData" :label="item.name" :value="item.id" :key="index"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="CPU型号" prop="name">
                    <el-input 
                        v-model="cpuForm.name" 
                        style="width:16rem;"/>
                </el-form-item>
            </el-form>
            <el-form 
                v-else
                ref="addFormRef" 
                :model="coverForm" 
                :rules="coverRules" 
                label-width="12rem" 
                :show-message="false">
                <el-form-item v-if="needDeviceModel" prop="device_model" label="device model">
                    <el-input 
                        v-model="coverForm.device_model" 
                        style="width:16rem;"
                        @change="getDeviceName"/>
                </el-form-item>
                <el-form-item prop="coverage_detail" :label="addItemName">
                    <el-input v-model="coverForm.coverage_detail" style="width:16rem;"/>
                </el-form-item>
                <el-form-item prop="coverage_detail" label="选择测试类型">
                    <el-select v-model="testType" placeholder="请选择"style="width:16rem;">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                
            </el-form>
        </self-dialog>
        <self-dialog 
            ref="editCoverRef" 
            class="cover-div"
            :dialog-data="{ title: '编辑兼容性覆盖情况', width: '70rem', closeName: '关闭' }">
            <div class="status-div">  
                <div class="import"></div>必测 
                <div class="ignore"></div>非必测
            </div>
            <el-card v-for="(item, k) in coverData" :key="k" style="margin-bottom: 1rem">
                <div slot="header" class="clearfix plat-title">
                    {{ k }}
                </div>
                <div class="type-item" v-for="(coverType, typeIndex) in item" :key="k + '_' + typeIndex">
                    <div class="type-title">{{ coverType.name }}</div>
                    <div class="type-content">
                        <span  v-for="(coverageItem, coverageIndex) in coverType.coverage" :key="k + '_' + typeIndex + '_' + coverageIndex" >
                            <el-tag
                                closable
                                :type="coverageItem.test_type == '必测' ? '':'info'"
                                :disable-transitions="true"
                                style="margin:0 5px 5px 0;"
                                @close="handleClose(coverageItem, false)">
                                {{ coverageItem.coverage }}
                            </el-tag> 
                        </span>
                        
                        <el-button
                            size="small"
                            @click="addItem(coverType.name, coverType)">新增</el-button>
                    </div>
                </div>
                <div v-if="k=='Android'" class="type-item">
                    <div class="type-title">CPU覆盖</div>
                    <div class="type-content">
                        <el-select v-model="selectedLevel" placeholder="选择等级" style="margin-bottom: 5px" @change="cpuLevelChange">
                          <el-option v-for="i in max_level" :label="i" :value="i" :key="i"></el-option>
                          <el-option label="新增等级" :value="max_level + 1"></el-option>
                        </el-select><span style="margin-left: 5px; cursor: pointer; color:blue; font-size: 10px;"><a href="/mtl_test_platform/page/cpuLadder/" target="_black">CPU天梯</a></span><br>
                        <span v-for="(coverageItem, coverageIndex) in cpuData" :key="k + '_' + coverageIndex" >
                            <el-tag
                                closable
                                @close="handleClose(coverageItem, true)"
                                :disable-transitions="true"
                                style="margin:0 5px 5px 0;">
                                {{ coverageItem }}
                            </el-tag> 
                        </span>
                        <el-button size="small" @click="addCPUItem">新增</el-button>
                    </div>
                </div>
            </el-card>
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import SelfDialog from "@/components/Common/SelfDialog.vue"
import "@/css/cover.css"
export default {
    components: {
        SelfDialog,
    },
    props: {
        tableName: String,
    },
    data() {
        return {
            cpuData: [],
            selectedLevel: "",
            dialogMessage: "",
            cpuForm: {
                level: "",
                brand: "",
                name: "",
            },
            max_level: "",
            cpuBrandData: [],
            allCpuData: [],
            tabLoading: false,
            coverData: {},
            addItemName: "",
            coverForm: {
                id:"",//覆盖大类的id
                coverage_detail: "",
                device_model: "",
            },
            needDeviceModel: false,
            coverRules: {
                coverage_detail: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                device_model: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
            },
            cpuFormRules: {
                level: [{required: true, trigger: 'blur'}],
                brand: [{ required: true, trigger: 'blur' }],
                name: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
            },
            testType:"必测",
            options: [{
                value: '必测',
                label: '必测'
            }, {
                value: '非必测',
                label: '非必测'
            }]

        }
    },
    computed: {
    },
    created() {

    },
    mounted() {

    },
    methods: {
        closeAdd(){
            if(this.dialogMessage = "新增cpu等级"){
                this.cpuData = this.handleSelectedCpuData(this.allCpuData[this.selectedLevel])
            }
        },

        // 增加cpu覆盖
        addCPUItem(){
            this.dialogMessage = "新增cpu覆盖"
            this.cpuForm = {
                level: "",
                brand: "",
                name: "",
            }
            this.$refs.addRef.openDialog();
        },

        // 处理cpu等级改变事件
        cpuLevelChange(value){
            if(value == this.max_level + 1){
                this.dialogMessage = "新增cpu等级"
                this.$refs.addRef.openDialog();
            }else{
                this.cpuData = this.handleSelectedCpuData(this.allCpuData[value])
            }
        },

        handleSelectedCpuData(data){
            let dataAfter = []
            for(var index in data){
                dataAfter = dataAfter.concat(data[index])
            }
            return dataAfter
        },

        //打开编辑兼容性覆盖项模态框
        async editCover() {
            let res = await this.getCoverData();
            let res1 = await this.getCpuData()
            if (res.code == 200 && res1.code == 200) {
                this.$refs.editCoverRef.openDialog();
            }
            this.cpuData = this.handleSelectedCpuData(this.allCpuData[this.selectedLevel])
        },

        // 获取cpu数据
        getCpuData(){
            return new Promise(resolve => {
                this.$codePost("/expertCompatibility/get_cpu_ladder/", { operation: "获取CPU天梯数据", failed: true }).then(res => {
                    if (res.code == 200) {
                        this.max_level = this.max_level == "" ? res.data.max_level : this.max_level
                        this.cpuBrandData = res.data.brand
                        this.allCpuData = res.data.data
                        this.cpuData = this.handleSelectedCpuData(this.allCpuData[this.selectedLevel])
                    }
                    resolve(res);
                })
            })
        },

        //获得覆盖数据
        getCoverData() {
            return new Promise(resolve => {
                let list = { table_name: this.tableName };
                this.$codePost("/expertCompatibility/get_model_coverage/", list, { operation: "获取兼容性覆盖情况", failed: true }).then(res => {
                    if (res.code == 200) {
                        this.coverData = res.data;
                    }
                    resolve(res);
                })
            })
        },

        //删除
        handleClose(item, isCPU) {
            let confirmText = "确定删除【<b>" 
            if(isCPU){
                confirmText = confirmText + item
            }else{
                confirmText = confirmText + item.coverage
            }
            confirmText = confirmText + "</b>】吗？";
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                if(!isCPU){
                    let list = { id: item.id };
                    this.$codePost("/expertCompatibility/delete_model_coverage/", list, { operation: "删除", success: true, failed: true }).then(res => {
                        if (res.code == 200) {
                            this.getCoverData();
                        }
                    })
                }else{
                    // 删除cpu覆盖项代码
                    let list = {name: item}
                    this.$codePost("/expertCompatibility/delete_cpu_coverage/", list, { operation: "删除cpu覆盖项", success: true, failed: true }).then(res => {
                        if (res.code == 200) {
                            this.handleReset();
                        }
                    })
                }
            }).catch(() => { });
        },

        //新增
        addItem(addItemName, coverType) {
            this.dialogMessage = "新增其他覆盖项"
            this.addItemName = addItemName;
            this.coverForm = {
                id: coverType.id,
                coverage_detail: "",
            }
            if(coverType.two_parameter) {
                //需要填写device model
                this.coverForm = {
                    id: coverType.id,
                    coverage_detail: "",
                    device_model: ""
                }
                this.needDeviceModel = true;
            }else {
                this.coverForm = {
                    id: coverType.id,
                    coverage_detail: "",
                }
                this.needDeviceModel = false;
            }
            this.$refs.addRef.openDialog();
        },

        //获取device model对应的机型名
        getDeviceName(){
            let list = { device_model: this.coverForm.device_model };
            this.$codePost("/service/get_device_by_model/", list, { operation: "获取机型", success: true, failed: true }).then(res => {
                if (res.code == 200) {
                    this.coverForm.coverage_detail = res.data;
                }
            })
        },

        //确认新增
        confirmAdd() {
            if(this.dialogMessage == "新增cpu等级"){
                this.max_level = this.max_level + 1
                this.handleReset()
            }else if(this.dialogMessage == "新增cpu覆盖"){
                let hasError = this.$publicJS.checkFormData(this, "addCPUFormRef", "您有必填项未填！");
                if(!hasError){
                    let brand = this.cpuBrandData.filter(item => {
                        return item.id == this.cpuForm.brand
                    })[0].name
                    // CPU型号不包含厂商
                    console.log(this.cpuForm.name.indexOf(brand))
                    if(this.cpuForm.name.indexOf(brand) === -1){
                        this.cpuForm.name = [brand, this.cpuForm.name].join(' ')
                    }
                    //填写无误，提交
                    this.$codePost("/expertCompatibility/add_cpu_coverage/", this.cpuForm, { operation: "新增cpu覆盖项", success: true, failed: true }).then(res => {
                        if (res.code == 200) {
                            this.selectedLevel = this.cpuForm.level
                            this.handleReset()
                        }
                    })
                }
            }else{
                let hasError = this.$publicJS.checkFormData(this, "addFormRef", "您有必填项未填！");
                this.coverForm['test_type'] = this.testType
                if (!hasError) {
                    //填写无误，提交
                    this.$codePost("/expertCompatibility/update_model_coverage/", this.coverForm, { operation: "新增覆盖项", success: true, failed: true }).then(res => {
                        if (res.code == 200) {
                            this.handleReset()
                        }
                    })
                }
            }
        },

        // 对话框确认后处理
        handleReset(){
            this.getCoverData();
            this.getCpuData()
            this.dialogMessage = ""
            this.cpuData = []
            this.$refs.addRef.closeDialog();
        }

    },
}
</script>
<style lang="less" scoped>


.status-div {
    display: flex;
    direction: row;
    margin-bottom: 10px;
    height: 20px;
    line-height: 20px;
    justify-content: flex-end;
    margin-right: 10px;
    .import {
        width: 15px;
        height: 15px;
        background: #4876F2;
        border-radius: 8px;
        margin-right: 5px;
        margin-top: 2px;
    }
    .ignore {
        width: 15px;
        height: 15px;
        background: #909399;
        border-radius: 8px;
        margin-right: 5px;
        margin-top: 2px;
        margin-left: 15px
    }
}


</style>
