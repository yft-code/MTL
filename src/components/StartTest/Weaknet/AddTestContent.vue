<template>
    <div>
        <self-dialog 
            ref="addTestContentRef" 
            :dialog-data="{ title: dialogName +'测试内容', width: '40%', confirmName: '确认', closeName: '取消' }" 
            style="text-align: left;"
            @confirm="confirmAddContent"
            @close="closeContentDialog"
            >
            <div class="split-card form-card">
                <el-form 
                    ref="addContentFormRef" 
                    :model="addContentForm" 
                    :rules="testContentFormRules" 
                    :show-message="false" 
                    label-width="7rem"
                    >
                    <el-form-item label="测试设备" prop="" class="public-dialog-form-item" prop="status">
                        <el-select v-model="addContentForm.status" placeholder="" @change="handleDeviceChangeInScene">
                            <el-option label="测试机" :value="'0'"></el-option>
                            <el-option label="辅助机" :value="'1'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-for="item,i in testContentFormList" v-if="item.label !== '表现'" :key="i" :label="item.label" :prop="item.propName" class="public-dialog-form-item">
                        <el-input v-model="addContentForm[item.propName]"></el-input>
                    </el-form-item>
                    <el-form-item v-else :key="i" :label="item.label" :prop="item.propName" style="margin-left: 2%">
                        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="addContentForm[item.propName]"></el-input>
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
            testContentFormList: [
                {
                    label: "延迟",
                    propName: "delay",
                },
                {
                    label: "丢包率",
                    propName: "loss",
                },
                {
                    label: "kcp",
                    propName: "kcp",
                },
                {
                    label: "tcp",
                    propName: "tcp",
                },
                {
                    label: "工时",
                    propName: "work_time",
                },
                {
                    label: "表现",
                    propName: "msg",
                },
                
            ],
            addContentForm: {
                device_id: "",
                status: "",
                date: "", // 测试时间
                scene_id: "",   // 场景id
                delay: "",   // 延迟
                loss: "",  // 丢包率
                kcp: "", // kcp
                tcp: "",  // tcp
                msg: "", // 表现
                work_time: "",  // 工时
                test_qa: "", // 测试人员
                application_id: '',
            },
            testContentFormRules: {
                status: [{ required: true, trigger: 'change' }],
                scene_id: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                application_id: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                work_time: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
            },
            scene_data:{},
            dialogName: "新增",
            editObject: {},
            fieldList: [
                'delay',
                'loss',
                'kcp',
                'tcp',
                'test_qa',
            ],
            test_device: {},
            support_device: {},
        }
    },
    props:{
        axiosList: {},
        appUrl: {}
    },
    computed: {

    },
    created(){
    },
    methods: {
        openDialog(item, type){
            this.getTestSet()
            if(type === "add"){
                this.dialogName = "新增"
                this.scene_data = item
                this.addContentForm.scene_id = item.id
                this.addContentForm.application_id = this.axiosList.id
            }else{
                console.log(item)
                this.editObject = item
                this.dialogName = "编辑"
                for(let k in this.addContentForm){
                    this.addContentForm[k] = item[k] + ''
                }
            }
            this.$refs.addTestContentRef.openDialog()
        },

        getTestSet(){
            let list = {
                id: this.axiosList.id
            }
            this.$codePost("/" + this.appUrl + "/get_test_set/", list, { operation: "获取测试/辅助机信息", failed: true }).then(res => {
                if (res.code == 200) {
                    let checkDeviceData = JSON.parse(JSON.stringify(res.data))[0]
                    this.test_device = JSON.parse(checkDeviceData.test_device)
                    this.support_device = JSON.parse(checkDeviceData.support_device)
                }
            })
        },
        confirmAddContent(){
            let hasError = this.$publicJS.checkFormData(this, "addContentFormRef", "您有必填项未填或填写不规范！");
            if(!hasError){
                let formData = new FormData();
                for(let k in this.addContentForm){
                    formData.append(k, this.addContentForm[k]);
                }
                // for (var key of formData.keys()) {
                //     console.log(key, formData.get(key));
                // }
                if(this.dialogName === "新增"){
                    formData.append('application_id', this.axiosList.id);
                    formData.append('content_name', this.axiosList.table_name);
                    this.$formPost("/" + this.appUrl + "/create_test_record/", formData, { operation: "新增测试记录", success:true, failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$refs.addTestContentRef.closeDialog();
                            this.$emit('afterEdit')
                        }
                    })
                }else{
                    formData.append('id', this.editObject.id)
                    this.$formPost("/" + this.appUrl + "/edit_test_record/", formData, { operation: "编辑测试记录", success:true, failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$refs.addTestContentRef.closeDialog();
                            this.closeContentDialog()
                            this.$emit('afterEdit')
                        }
                    })
                }
            }
        },

        handleDeviceChangeInScene(val){
            if(val === '0'){
                this.addContentForm.device_id = this.test_device.id
            }else{
                this.addContentForm.device_id = this.support_device.id
            }
        },


        closeContentDialog(){
            this.editObject = {}
            this.scene_data = {}
            this.dialogName = "新增"
            this.addContentForm = {
                device_id: "",
                date: "", // 测试时间
                scene_id: "",   // 场景id
                delay: "",   // 延迟
                loss: "",  // 丢包率
                kcp: "", // kcp
                tcp: "",  // tcp
                msg: "", // 表现
                work_time: "",  // 工时
                test_qa: "", // 测试人员
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
.device-div{
    text-align:center;
    margin-top: -15px;
    margin-bottom: 15px;
    color: red;
}
.pease-url{
    margin-left: 2%;
}
</style>