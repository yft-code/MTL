<template>
    <div>
        <self-dialog 
            ref="editTestDeviceRef" 
            :dialog-data="{ title: editDeviceName+'测试设备', width: '40%', confirmName: editDeviceName, closeName: '取消' }" 
            style="text-align: left;"
            @confirm="confirmEditDevice"
            >
            <div class="split-card form-card">
                <el-form 
                    ref="editDeviceFormRef" 
                    :model="editDeviceForm" 
                    :rules="testContentFormRules" 
                    :show-message="false" 
                    label-width="7rem"
                    >
                    <el-form-item label="设备名称" class="public-dialog-form-item">
                        <el-select v-model="device_name" placeholder="选择想要修改的设备名" @change="handleDeviceChange">
                            <el-option v-for="item,index in deviceData" :label="item.name" :value="item.name" :key="index">
                                <span>{{ item.name }}</span>
                                <span @click.stop="delDevice(item, $event)" style="float: right; color: blue">删除</span>
                            </el-option>
                            <el-option label="新增测试设备" value="新增测试设备" style="color: red"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-for="item,i in deviceContentFormList" :key="i" :label="item.propName" :prop="item.label" class="public-dialog-form-item">
                        <el-radio-group v-if="item.label == 'isRoot'" v-model="editDeviceForm[item.label]">
                            <el-radio label="是">是</el-radio>
                            <el-radio label="不是">否</el-radio>
                        </el-radio-group>
                        <el-select v-else-if="item.label == 'performanceLevel'" v-model="editDeviceForm[item.label]" placeholder="选择性能级别">
                          <el-option v-for="level,index in perfLevel" :label="level" :value="level" :key="i+'_'+index"></el-option>
                        </el-select>
                        <el-select v-else-if="item.label == 'screenType'" v-model="editDeviceForm[item.label]" placeholder="选择屏幕类型">
                          <el-option v-for="level,index in screenTypeList" :label="level" :value="level" :key="i+'_'+index"></el-option>
                        </el-select>
                        <el-input v-else v-model="editDeviceForm[item.label]"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </self-dialog>
    </div>
</template>

<script>
import formRule from "@/utils/formRule.js"
export default {
    components:{

    },
    data(){
        return {
            editDeviceForm: {
                name: "", // 设备编号
                deviceBrand: "",// 设备品牌
                device: "",//测试机型-设备名
                cpuModel: "", // cpu名称
                os: "",//系统版本
                ram: "",//内存
                gpuModel: "", // gpu名称
                resolution: "", // 分辨率
                isRoot: "", // 是否开启root
                screenType: "", // 屏幕类型
                performanceLevel: "", // 性能级别（极低、低、中、高）
            },
            perfLevel: [
                "极低",
                "低",
                "中",
                "高"
            ],
            screenTypeList: [
                "普通屏",
                "刘海屏",
                "全面屏",
                "挖孔屏",
                "水滴屏",
                "曲面屏",
            ],
            device_name: "",
            selectedDevice: {},
            deviceContentFormList: [
                {
                    label: "name",
                    propName: "设备名称",
                },
                {
                    label: "deviceBrand",
                    propName: "设备品牌",
                },
                {
                    label: "device",
                    propName: "设备机型",
                },
                {
                    label: "os",
                    propName: "系统版本",
                },
                {
                    label: "ram",
                    propName: "内存",
                },
                {
                    label: "resolution",
                    propName: "屏幕尺寸",
                },
                {
                    label: "gpuModel",
                    propName: "gpu名称",
                },
                {
                    label: "cpuModel",
                    propName: "cpu名称",
                },
                // {
                //     label: "isRoot",
                //     propName: "是否开启root",
                // },
                {
                    label: "screenType",
                    propName: "屏幕类型",
                },
                // {
                //     label: "performanceLevel",
                //     propName: "性能级别",
                // },
            ],
            testContentFormRules: {
                name: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                deviceBrand: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                os: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                resolution: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                device: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                ram: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
            },
            editDeviceName: "新增",
        }
    },
    props:{
        deviceData: {},
        appUrl: {},
    },
    computed: {
        // html中直接用this.editDeviceForm.device_type做判断值，会出现渲染问题，因此这里要特别处理
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
    },
    created(){
    },
    methods: {
        openDialog(){
            this.$refs.editTestDeviceRef.openDialog()
        },
        
        confirmEditDevice(){
            let hasError = this.$publicJS.checkFormData(this, "editDeviceFormRef", "您有必填项未填或填写不规范！");
            if(!hasError){
                let formData = new FormData();
                for(let k in this.editDeviceForm){
                    formData.append(k, this.editDeviceForm[k]);
                }
                let appProp = "create_test_device"
                if(this.editDeviceName === "修改"){
                    // formData.append('old_name', this.selectedDevice.name);
                    formData.append('id', this.selectedDevice.id);
                    appProp = "edit_test_device"
                }
                this.$formPost("/" + this.appUrl + "/"+ appProp +"/", formData, { operation: this.editDeviceName+"测试设备", success:true, failed: true }).then(res => {
                    if (res.code == 200) {
                        // this.$refs.editTestDeviceRef.closeDialog()
                        this.$refs.editDeviceFormRef.resetFields()
                        this.selectedDevice = {}
                        this.device_name = ""
                        this.$emit('afterEdit')
                    }
                })
            } 
        },

        delDevice(item){
            let confirmText = "确定删除【<b>" + item.name + "</b>】吗？";
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let list = {
                    // name: item.name,
                    id: item.id
                }
                this.$codePost("/" + this.appUrl + "/delete_test_device/", list, { operation: "删除测试设备", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$refs.editDeviceFormRef.resetFields()
                        this.selectedDevice = {}
                        this.device_name = ""
                        this.$emit('afterEdit')
                    }
                })
            }).catch(() => { });
        },

        handleDeviceChange(val){
            if(val !== "新增测试设备"){
                this.editDeviceName = "修改"
                this.selectedDevice = this.deviceData.filter(function(item){
                    return item.name === val
                })[0]
                for(let k in this.editDeviceForm){
                    this.editDeviceForm[k] = this.selectedDevice[k]
                }
            }else{
                this.editDeviceName = "新增"
                this.$refs.editDeviceFormRef.resetFields()
            }
        },
        
    }
}
</script>
<style scoped>
.split-card {
    display: inline-block;
    vertical-align: top;
}

.form-card {
    width: 90%;
    margin-right: 1%;
}

.public-dialog-form-item{
    width: 48%;
    margin-left: 2%;
    display:inline-block;
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
</style>
