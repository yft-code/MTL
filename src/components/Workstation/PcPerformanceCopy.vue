<template>
    <div class="workstation-content">
        <!-- 这边用的是端游性能设备的字段 -->
        <div class="list-title">电脑设备组合管理</div>
        <div class="list-container">
            <el-button type="primary" size="mini" style="margin-bottom: 10px;" @click="addDevice">新增</el-button>
            <el-table :data="deviceData" :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }">
                <el-table-column v-for="item,index in deviceTableItemList" :label="item.titleName" align="center">
                    <template v-slot="scope">
                        <div v-if="item.propName === 'operate'">
                            <el-button type="primary" size="mini" @click="editDevice(scope.row)">编辑</el-button>
                            <el-button type="danger" size="mini">删除</el-button>
                        </div>
                        <span v-else>{{scope.row[item.propName]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            
        </div>

        <self-dialog 
            ref="editTestDeviceRef" 
            :dialog-data="{ title: editTestName+'测试设备', width: '40%', confirmName: editTestName, closeName: '取消' }" 
            @confirm="confirmEditDevice">
            <el-form ref="editDeviceFormRef" :model="editDeviceForm" label-suffix=":" :rules="editDeviceFormRules" label-width="100px">
                <el-form-item v-for="item,k in deviceTableItemList" v-if="item.propName !== 'operate'" :label="item.titleName" :key="k" :prop="item.propName" class="item-short">
                    <el-input v-model="editDeviceForm[item.propName]" :placeholder="'请输入'+ item.titleName"></el-input>
                </el-form-item>
            </el-form>
        </self-dialog>
        
    </div>
</template>

<script>
import formRule from "@/utils/formRule.js"
export default {
    components: {
    },
    data() {
        return {
            editTestName: "新增",
            deviceTableItemList: [
                {
                    propName: 'name',
                    titleName: '设备名称',
                },
                {
                    propName: 'disk_type',
                    titleName: '硬盘类型',
                },
                {
                    propName: 'gpu_name',
                    titleName: '显卡',
                },
                {
                    propName: 'cpu_name',
                    titleName: 'CPU型号',
                },
                {
                    propName: 'system_version',
                    titleName: '系统版本',
                },
                {
                    propName: 'mem_size',
                    titleName: '内存大小',
                },
                {
                    propName: 'resolution',
                    titleName: '分辨率',
                },
                {
                    propName: 'config',
                    titleName: '配置',
                },
                {
                    propName: 'operate',
                    titleName: '操作',
                }
            ],
            deviceData: [
                {
                    name: '设备1',
                    disk_type: 'SSD',
                    gpu_name: 'GTX 1080',
                    cpu_name: 'i7-8700',
                    system_version: 'Windows 10',
                    mem_size: '16G',
                    resolution: '1920*1080',
                    config: '配置1',
                },
                {
                    name: '设备2',
                    disk_type: 'SSD',
                    gpu_name: 'GTX 1080',
                    cpu_name: 'i7-8700',
                    system_version: 'Windows 10',
                    mem_size: '16G',
                    resolution: '1920*1080',
                    config: '配置1',
                },
                {
                    name: '设备3',
                    disk_type: 'SSD',
                    gpu_name: 'GTX 1080',
                    cpu_name: 'i7-8700',
                    system_version: 'Windows 10',
                    mem_size: '16G',
                    resolution: '1920*1080',
                    config: '配置1',
                },
            ],
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
        }
    },
    props:{
        
    },
    created(){
    },
    mounted(){
        
    },
    computed:{
        isTester() {
            return this.$store.getters.getIsTester
        },
        isAdmin() {
            return this.$store.getters.getIsAdmin
        },
    },
    watch:{
    },
    methods:{
        confirmEditDevice(){
            let hasError = this.$publicJS.checkFormData(this, "editDeviceFormRef", "您有必填项未填或填写不规范！");
            if(!hasError){
                let formData = new FormData();
                for(let k in this.editDeviceForm){
                    formData.append(k, this.editDeviceForm[k]);
                }
                let appUrl = "create_test_device"
                if(this.editTestName === "编辑"){
                    formData.append('old_name', this.selectedDevice.name);
                    appUrl = "edit_test_device"
                }
                this.$formPost("/mobilePerfTest/"+ appUrl +"/", formData, { operation: this.editDeviceName+"测试设备", success:true, failed: true }).then(res => {
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
        editDevice(row){
            // console.log(row)
            this.editDeviceForm = row
            this.editTestName = "编辑"
            this.$refs.editTestDeviceRef.openDialog()
        },
        addDevice(){
            this.editDeviceForm = {
                name:"",
                disk_type:"",
                system_version:"",
                cpu_name:"",
                mem_size:"",
                gpu_name:"" ,
                config:"",
                resolution: "",
            }
            this.editTestName = "新增"
            this.$refs.editTestDeviceRef.openDialog()
        }
    },
}
</script>
    
<style scoped>
.workstation-content {
    width: 100%;
    flex: 1;
    margin: 20px;
    border-radius: 4px;
    background: #fff;
    display: flex;
    flex-direction: column;
}
.list-title {
    padding: 0 20px;
    font-size: 16px;
    font-weight: 700;
    color: #333333;
    height: 47px;
    width: calc(100% - 40px);
    line-height: 47px;
    background: #fff;
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid rgba(97, 119, 255, 0.1);
}
.list-container {
    flex: 1;
    overflow: auto;
    padding: 20px;
}
.type-item {
    width: 100%;
    font-size: 16px;
    margin-bottom: 1rem;
}
.type-item .type-title {
    width: 10%;
    margin-right: 1rem;
    font-weight: bold;
    vertical-align: top;
    display: inline-block;
    text-align: right;
}
.type-item .type-content {
    width: 88%;
    vertical-align: top;
    display: inline-block;
}
.type-item .type-content .every-coverage {
    display: inline-block;
    vertical-align: top;
}
.item-short{
    display: inline-block;
    width: 45%;
    margin-left: 2%;
}
</style>