<template>
    <div>
        <self-dialog 
            ref="checkTestDeviceRef" 
            :dialog-data="{ title: '登记测试/辅助机', width: '40%', confirmName: '确认', closeName: '取消' }" 
            style="text-align: left;"
            @confirm="confirmCheckDevice"
            >
            <div class="split-card form-card">
                <el-form 
                    ref="checkDeviceFormRef" 
                    :model="checkeDeviceForm" 
                    :rules="checkDeviceFormRules" 
                    :show-message="false" 
                    label-width="7rem"
                    >
                    <el-form-item label="测试机" class="public-dialog-form-item">
                        <el-select v-model="checkeDeviceForm.test_device" @change="testDeviceChange">
                            <el-option v-for="item,index in deviceData" :label="item.name" :value="item.id" :key="index">
                                <span>{{ item.name }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="辅助机" class="public-dialog-form-item">
                        <el-select v-model="checkeDeviceForm.support_device" @change="supportDeviceChange">
                            <el-option v-for="item,index in deviceData" :label="item.name" :value="item.id" :key="index">
                                <span>{{ item.name }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div style="color:red; text-align: left; margin-left: 20px;" v-if="test_device">
                        测试机【
                        <span v-for="item,k,i in test_device" :key="k" v-if="displayItem.indexOf(k) != -1">
                            <span v-if="item && item !== ''">-{{item}}-</span>
                        </span>】
                    </div>
                    <div style="color:red; text-align: left;margin-top:5px; margin-left: 20px;" v-if="support_device">
                        辅助机【<span v-for="item,k,i in support_device" :key="k" v-if="displayItem.indexOf(k) != -1">
                            <span v-if="item && item !== ''">-{{item}}-</span>
                        </span>】
                    </div>
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
            checkeDeviceForm: {
                test_device: "", 
                support_device: "",
            },

            checkDeviceFormRules: {
                test_device: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                support_device: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
            },
            test_device: {},
            support_device: {},
            displayItem: ['name','os','ram','cpuModel','gpuModel'],
        }
    },
    props:{
        deviceData: {},
        appUrl: {},
        axiosList: {},
    },
    computed: {
        // html中直接用this.checkeDeviceForm.device_type做判断值，会出现渲染问题，因此这里要特别处理
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
    },
    created(){
    },
    methods: {
        openDialog(){
            this.getCheckDevice()
            this.$refs.checkTestDeviceRef.openDialog()
        },

        testDeviceChange(val){
            this.test_device = this.deviceData.filter(function(item){
                return item.id === val
            })[0]
        },

        supportDeviceChange(val){
            this.support_device = this.deviceData.filter(function(item){
                return item.id === val
            })[0]
        },
        
        confirmCheckDevice(){
            let hasError = this.$publicJS.checkFormData(this, "checkDeviceFormRef", "您有必填项未填或填写不规范！");
            if(!hasError){
                let formData = new FormData();
                for(let k in this.checkeDeviceForm){
                    formData.append(k, this.checkeDeviceForm[k])
                }
                formData.append('id', this.axiosList.id)
                this.$formPost("/" + this.appUrl + "/edit_test_set/", formData, { operation: "登记测试/辅助机信息", success:true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$refs.checkTestDeviceRef.closeDialog()
                    }
                })
            } 
        },

        getCheckDevice(){
            let list = {
                id: this.axiosList.id
            }
            this.$codePost("/" + this.appUrl + "/get_test_set/", list, { operation: "获取测试/辅助机信息", failed: true }).then(res => {
                if (res.code == 200) {
                    let checkDeviceData = JSON.parse(JSON.stringify(res.data))[0]
                    this.test_device = JSON.parse(checkDeviceData.test_device)
                    this.support_device = JSON.parse(checkDeviceData.support_device)
                    if(this.test_device){
                        this.checkeDeviceForm.test_device = this.test_device.id
                    }
                    if(this.support_device){
                        this.checkeDeviceForm.support_device = this.support_device.id
                    }
                }
            })
        }
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

</style>
