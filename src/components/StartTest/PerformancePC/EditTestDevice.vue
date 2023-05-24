<template>
    <div>
        <self-dialog 
            ref="editTestDeviceRef" 
            :dialog-data="{ title: editTestName+'测试设备', width: '40%', confirmName: editTestName, closeName: '取消' }" 
            @confirm="confirmEditDevice">
            <el-form ref="editDeviceFormRef" :model="editDeviceForm" label-suffix=":" :rules="editDeviceFormRules" label-width="100px">
                <el-form-item label="设备名称" class="item-short">
                    <el-select v-model="device_id" placeholder="选择想要修改的设备名" @change="handleDeviceChange" style="width:100%;" filterable>
                        <el-option v-for="item,index in deviceData" :label="item.name" :value="item.id" :key="index">
                            <span>{{ item.name }}</span>
                            <span @click.stop="delDevice(item, $event)" style="float: right; color: blue">删除</span>
                        </el-option>
                        <el-option label="新增测试设备" value="新增测试设备" style="color:red"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-for="item,k in deviceOption" :label="item.name" :key="k" :prop="item.label" class="item-short">
                    <el-input v-model="editDeviceForm[item.label]" :placeholder="'请输入'+ item.name"></el-input>
                </el-form-item>
            </el-form>
        </self-dialog>
    </div>
</template>

<script>
import formRule from "@/utils/formRule.js"
export default {
    data() {
        return {
            editDeviceForm: {
                name:"",
                disk_type:"",
                system_version:"",
                cpu_name:"",
                mem_size:"",
                gpu_name:"" ,
                config:"",
                // test_tool:"",
                // server: "",
                resolution: "",
            },
            editDeviceFormRules: {
                name: [
                    { required: true, validator: formRule.validateStr, trigger: 'change' },
                    { min: 1, max: 45, message: '长度为1-45个字符', trigger: 'change' },
                ],
                disk_type: [
                    { required: true, validator: formRule.validateStr, trigger: 'change' },
                    { min: 1, max: 45, message: '长度为1-45个字符', trigger: 'change' },
                ],
                system_version: [
                    { required: true, validator: formRule.validateStr, trigger: 'change' },
                    { min: 1, max: 45, message: '长度为1-45个字符', trigger: 'change' },
                ],
                cpu_name: [
                    { required: true, validator: formRule.validateStr, trigger: 'change' },
                    { min: 1, max: 45, message: '长度为1-45个字符', trigger: 'change' },
                ],
                mem_size: [
                    { required: true, validator: formRule.validateStr, trigger: 'change' },
                    { min: 1, max: 45, message: '长度为1-45个字符', trigger: 'change' },
                ],
                gpu_name: [
                    { required: true, validator: formRule.validateStr, trigger: 'change' },
                    { min: 1, max: 45, message: '长度为1-45个字符', trigger: 'change' },
                ],
            },
            device_id: "",
            selectedDevice: {},
            editTestName: "新增",
            deviceOption: [
                {
                    label: 'name',
                    name: '测试设备名',
                },
                {
                    label: 'disk_type',
                    name: "硬盘类型",
                },
                {
                    label: 'system_version',
                    name: "系统版本",
                },
                {
                    label: 'cpu_name',
                    name: "CPU型号",
                },
                {
                    label: 'mem_size',
                    name: "内存大小",
                },
                {
                    label: 'gpu_name',
                    name: "显卡",
                },
                {
                    label: 'config',
                    name: "配置",
                },
                {
                    label: 'resolution',
                    name: "分辨率",
                },
            ],
        }
    },
    props: {
        deviceData: {},
        appUrl: {},
    },
    methods: {
        confirmEditDevice(){
            let hasError = this.$publicJS.checkFormData(this, "editDeviceFormRef", "您有必填项未填或填写不规范！");
            if(!hasError){
                let formData = new FormData();
                for(let k in this.editDeviceForm){
                    formData.append(k, this.editDeviceForm[k]);
                }
                formData.append('id', this.selectedDevice.id);
                let appProp = "edit_test_device"
                if(this.editTestName === "新增"){
                    appProp = "create_test_device"
                }
                this.$formPost("/" + this.appUrl + "/"+ appProp +"/", formData, { operation: this.editTestName+"测试设备", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$refs.editDeviceFormRef.resetFields()
                        this.selectedDevice = {}
                        this.device_id = ""
                        this.$emit('afterEdit')
                    }
                })
            }
        },

        handleDeviceChange(val){
            if(val !== "新增测试设备"){
                this.editTestName = "修改"
                this.selectedDevice = this.deviceData.filter(function(item){
                    return item.id === val
                })[0]
                for(let k in this.editDeviceForm){
                    this.editDeviceForm[k] = this.selectedDevice[k]
                }
            }else{
                this.editTestName = "新增"
                this.$refs.editDeviceFormRef.resetFields()
            }
        },

        openDialog(){
            this.$refs.editTestDeviceRef.openDialog();
        },

        delDevice(item){
            let confirmText = "确定删除【<b>" + item.name + "</b>】吗？";
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let list = {
                    id: item.id,
                }
                this.$codePost("/" + this.appUrl + "/delete_test_device/", list, { operation: "删除测试设备", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$refs.editDeviceFormRef.resetFields()
                        this.selectedDevice = {}
                        this.$emit('afterEdit')
                    }
                })
            }).catch(() => { });
        },
    },
}
</script>
<style scoped>
.item-short{
    display: inline-block;
    width: 45%;
    margin-left: 2%;
}
</style>