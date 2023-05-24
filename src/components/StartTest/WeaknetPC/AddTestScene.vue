<template>
    <div>
        <self-dialog 
            ref="editSceneRef" 
            :dialog-data="{ title: editSceneName+'测试场景', width: '40%', confirmName: editSceneName, closeName: '取消' }" 
            @confirm="confirmEditScene"
            @close="resetScene">
            <div>
                <el-form ref="editSceneFormRef" :model="editSceneForm" label-suffix=":" :rules="editSceneFormRules" label-width="100px">
                    <div style="color:red; text-align: center; margin: -10px 15px 15px 15px;" v-if="selectedDeviceInScene">
                        <span v-for="item,k,i in selectedDeviceInScene" :key="k" v-if="displayItem.indexOf(k) != -1">
                            <span v-if="item && item !== ''">-{{item}}-</span>
                        </span>
                    </div>
                    <el-form-item label="场景模板"  class="item-short" v-if="editSceneName=='新增'">
                        <el-select v-model="selectedId" placeholder="选择场景模板" @change="selectSceneChange" style="width: 100%;">
                            <el-option v-for="item,index in sceneTempData" :label="item.scene_name" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择设备配置" class="item-short">
                        <el-select v-model="editSceneForm.device_id" placeholder="" @change="handleDeviceChangeInScene" style="width: 100%;" filterable>
                          <el-option v-for="item,index in deviceDataCopy" :label="item.name" :value="item.id+''" :key="index">{{item.name}}</el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="场景名称" prop="scene_name" class="item-short">
                        <el-input v-model="editSceneForm.scene_name" v-if="editSceneName=='新增'"></el-input>
                        <el-input v-model="editSceneForm.scene_name" v-else style="width: 72%"></el-input>
                        <el-button type="primary" v-if="editSceneName!=='新增'" style="margin-left: 5px;" size="mini" @click="deleteScene">删除</el-button>
                    </el-form-item>
                    <el-form-item label="测试工具" class="item-short">
                        <el-input v-model="editSceneForm.test_tool"></el-input>
                    </el-form-item>

                    <el-form-item label="场景说明"  prop="description" label-width="100px" style="margin-left: 2%;">
                        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="editSceneForm.description" style="width: 92%"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" style="margin-left: 2%;">
                        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="editSceneForm.remarks" style="width: 92%"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </self-dialog>
    </div>
</template>

<script>
import formRule from "@/utils/formRule.js"
export default {
    data() {
        return {
            editSceneForm: {
                project: '',
                project_name: '',
                scene_name: '',
                remarks: '',
                description: '',
                server:'',
                test_tool: '',
                device_id: '',
                device_name: "",
            },
            editSceneFormRules: {
                scene_name: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                description: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
            },
            selectedId: "", // 新增测试场景里选择的模板id
            editSceneObject: {},    // 当前修改的场景对象
            selectedDeviceInScene: {},
            deviceDataCopy: [],
            deviceItem: ['cpu_name','disk_type','gpu_name','id','is_delete','men_size','name','resolution','system_version'],
            displayItem: ['cpu_name','disk_type','gpu_name','resolution','system_version'],
        }
    },
    props: {
        editSceneName: {},
        sceneTempData: {},
        deviceData: {},
        axiosList: {},
        appUrl: {},
    },
    methods: {
        // 确认场景新增或修改
        confirmEditScene(){
            let hasError = this.$publicJS.checkFormData(this, "editSceneFormRef", "您有必填项未填或填写不规范！");
            if(!hasError){
                let formData = new FormData();
                for(let k in this.editSceneForm){
                    formData.append(k, this.editSceneForm[k]);
                }
                if(this.editSceneName == "新增"){
                    formData.append('application_id', this.axiosList.id)
                    formData.append('table_name', this.axiosList.table_name)
                    this.$formPost("/" + this.appUrl + "/create_test_scene/", formData, { operation: "新增测试场景", failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$refs.editSceneRef.closeDialog();
                            this.resetScene()
                        }
                    })
                }else{
                    formData.append('id', this.editSceneObject.id)
                    formData.append('table_name', this.axiosList.table_name)
                    console.log(formData)
                    this.$formPost("/" + this.appUrl + "/edit_test_scene/", formData, { operation: "编辑测试场景", failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$refs.editSceneRef.closeDialog();
                            this.resetScene()
                        }
                    })
                }
            }
        },

        deleteScene(){
            // console.log(this.editSceneObject)
            let confirmMeg = "确定删除【"+ this.editSceneObject.scene_name +"】场景吗？"
            this.$selfConfirm(confirmMeg, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let list = { id: this.editSceneObject.id };
                this.$codePost("/" + this.appUrl + "/delete_test_scene/", list, { operation: "删除测试场景", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$refs.editSceneRef.closeDialog();
                        this.resetScene()
                    }
                })
            }).catch(() => { });
        },

        handleDeviceChangeInScene(val){
            this.selectedDeviceInScene = this.deviceDataCopy.filter(function(item){
                return item.id + '' === val
            })[0]
            this.editSceneForm['device_name'] = this.selectedDeviceInScene.name
        },


        // 选择的场景发生更改-新增测试场景模态框
        selectSceneChange(val){
            let scene = this.sceneTempData.filter(function(item){
                return item.id == val
            })[0]
            this.editSceneForm.scene_name = scene.scene_name
            this.editSceneForm.project = scene.project
            this.editSceneForm.project_name = scene.project_name
            this.editSceneForm.remarks = scene.remarks
            this.editSceneForm.description = scene.description
        },

        openDialog(item){
            // console.log(item)
            this.deviceDataCopy = []
            this.deviceData.forEach(deviceItem => {
                this.deviceDataCopy.push(deviceItem)
            })
            if(item){
                this.editSceneObject = item
                for(let k in this.editSceneForm){
                    this.editSceneForm[k] = item[k]
                }
                this.selectedDeviceInScene = this.deviceData.filter(function(i){
                    return i.id == item.device_id
                })[0]
                // console.log(!this.selectedDeviceInScene)
                if(this.selectedDeviceInScene == 'undefined'){
                    this.handleDeviceData(item)
                }
            }
            // console.log(this.editSceneForm)
            // console.log(this.selectedDeviceInScene)
            this.$refs.editSceneRef.openDialog();
        },

        resetScene(){
            this.editSceneForm = {
                project: '',
                project_name: '',
                scene_name: '',
                remarks: '',
                description: '',
                server:'',
                test_tool: '',
                device_name: "",
                device_id: "",
            }
            this.selectedId = ""
            this.$emit('changeSceneName', '新增')
            this.editSceneObject = {}
            this.selectedDeviceInScene = {}
            this.$emit('afterEdit')
        },

        handleDeviceData(scene){
            let device = {}
            for(let k in this.deviceItem){
                if(this.deviceItem[k] == 'name'){
                    device[this.deviceItem[k]] = scene['device_name']
                }else if(this.deviceItem[k] == 'id'){
                    device[this.deviceItem[k]] = scene['device_id']
                }
                else{
                    device[this.deviceItem[k]] = scene[this.deviceItem[k]]
                }
            }
            this.selectedDeviceInScene = device
            this.deviceDataCopy.push(device)
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