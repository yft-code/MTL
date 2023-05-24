<template>
    <div>
        <self-dialog 
            ref="editSceneRef" 
            :dialog-data="{ title: editSceneName+'测试场景', width: '41%', confirmName: editSceneName, closeName: '取消' }" 
            @confirm="confirmEditScene"
            @close="resetScene">
            <div>
                <el-form ref="editSceneFormRef" :model="editSceneForm" label-suffix=":" :rules="editSceneFormRules"  label-width="110px">
                    <div style="color:red; text-align: center; margin: -10px 15px 15px 15px;" v-if="editSceneForm.device_id">
                        <span v-for="item,k,i in selectedDeviceInScene" :key="k" v-if="displayItem.indexOf(k) != -1">
                            <span v-if="item && item !== ''">-{{item}}-</span>
                        </span>
                    </div>
                    <el-form-item label="场景模板" v-if="editSceneName=='新增'" class="item-short">
                        <el-select v-model="selectedId" placeholder="选择场景模板" @change="selectSceneChange" style="width: 100%;" filterable>
                            <el-option v-for="item,index in sceneTempData" :label="item.scene_name" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择设备配置" class="item-short" prop="device_id">
                        <el-select v-model="editSceneForm.device_id" placeholder="" @change="handleDeviceChangeInScene" style="width: 100%;" filterable>
                          <el-option v-for="item,index in deviceDataCopy" :label="item.name" :value="item.id" :key="index">{{item.name}}</el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item label="场景名称" prop="scene_name" class="item-short">
                        <el-input v-model="editSceneForm.scene_name" v-if="editSceneName=='新增'"></el-input>
                        <el-input v-model="editSceneForm.scene_name" v-else style="width: 72%"></el-input>
                        <el-button type="primary" v-if="editSceneName!=='新增'" style="margin-left: 5px;" size="mini" @click="deleteScene">删除</el-button>
                    </el-form-item>
                    
                    <el-form-item label="测试服务器" class="item-short">
                        <el-input v-model="editSceneForm.server"></el-input>
                    </el-form-item>
                    <el-form-item label="测试工具" class="item-short">
                        <el-input v-model="editSceneForm.test_tool"></el-input>
                    </el-form-item>
                    <el-form-item label="场景说明"  prop="description" style="margin-left: 2%;">
                        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="editSceneForm.description" style="width: 92%;"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" style="margin-left: 2%;">
                        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="editSceneForm.remarks" style="width: 92%;"></el-input>
                    </el-form-item>
                    <el-form-item label="选择字段" style="margin-left: 2%;">
                        <el-button size="mini" type="primary" @click="checkSelectAll">{{ selectAll ? '取消全选' : '全选' }}</el-button>
                        <el-checkbox-group v-model="editSceneForm.field_name" @change="handleItemChange">
                            <el-checkbox v-for="item,index in basicColumnData" class="field-item" :key="index" :label="item"></el-checkbox>
                        </el-checkbox-group>
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
            selectAll: false,
            editSceneForm: {
                project: '',
                project_name: '',
                scene_name: '',
                remarks: '',
                description: '',
                device_id: '',
                device_name: "",
                server:'',
                test_tool: '',
                field_name: [],
            },
            editSceneFormRules: {
                device_id:[
                    { required: true, message: '需要选择设备配置', trigger: 'change' },
                ],
                scene_name: [
                    { required: true, validator: formRule.validateStr, trigger: 'change' },
                    { min: 1, max: 30, message: '长度为1-30个字符', trigger: 'change' },
                ],
                description: [
                    { required: true, validator: formRule.validateStr, trigger: 'change' },
                    { min: 1, max: 45, message: '长度为1-45个字符', trigger: 'change' },
                ],
                remarks: [
                    { min: 1, max: 500, message: '长度为0-500个字符', trigger: 'change' },
                ],
            },
            deviceDataCopy: [],
            selectedId: "", // 新增测试场景里选择的模板id
            editSceneObject: {},    // 当前修改的场景对象
            selectedDeviceInScene: {},
            tableKey: "",
            deviceItem: ['cpu_name','disk_type','gpu_name','id','is_delete','men_size','name','resolution','system_version'],
            displayItem: ['cpu_name','disk_type','gpu_name','resolution','system_version'],
        }
    },
    props: {
        editSceneName: {},
        sceneTempData: {},
        deviceData: {},
        axiosList: {},
    },
    computed: {
        basicColumnData() {
            return this.$store.getters.getAllItem;
        },
    },
    methods: {
        checkSelectAll(){
            this.selectAll = !this.selectAll
            if(this.selectAll){
                this.editSceneForm.field_name = this.basicColumnData
            }else{
                this.editSceneForm.field_name = []
            }
        },

        handleItemChange(val){
            if(val.length === this.basicColumnData.length){
                this.selectAll = true
            }else{
                this.selectAll = false
            }
        },

        // 确认场景新增或修改
        confirmEditScene(){
            let hasError = this.$publicJS.checkFormData(this, "editSceneFormRef", "您有必填项未填或填写不规范！");
            if(!hasError){
                let formData = new FormData();
                for(let k in this.editSceneForm){
                    if(k == 'field_name'){
                        formData.append(k, this.editSceneForm[k].join(','));
                    }else{
                        formData.append(k, this.editSceneForm[k]);
                    }
                }
                formData.append('table_name', this.axiosList.table_name)
                // console.log(this.editSceneForm)
                if(this.editSceneName == "新增"){
                    formData.append('application_id', this.axiosList.id)
                    this.$formPost("/pcPerfTest/create_test_scene/", formData, { operation: "新增测试场景", failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$refs.editSceneRef.closeDialog();
                            this.resetScene()
                        }
                    })
                }else{
                    formData.append('id', this.editSceneObject.id)
                    this.$formPost("/pcPerfTest/edit_test_scene/", formData, { operation: "编辑测试场景", failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$refs.editSceneRef.closeDialog();
                            this.resetScene()
                        }
                    })
                }
            }
        },

        handleDeviceChangeInScene(val){
            this.selectedDeviceInScene = this.deviceDataCopy.filter(function(item){
                return item.id === val
            })[0]
            this.editSceneForm['device_name'] = this.selectedDeviceInScene.name
            // console.log(this.selectedDeviceInScene)
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
            this.editSceneForm.field_name = scene.field_name ? scene.field_name.split(',') : []
        },

        deleteScene(){
            // console.log(this.editSceneObject)
            let confirmMeg = "确定删除【"+ this.editSceneObject.scene_name +"】场景吗？"
            this.$selfConfirm(confirmMeg, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let list = { id: this.editSceneObject.id, table_name: this.axiosList.table_name};
                this.$codePost("/pcPerfTest/delete_test_scene/", list, { operation: "删除测试场景", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$refs.editSceneRef.closeDialog();
                        this.resetScene()
                    }
                })
            }).catch(() => { });
        },

        openDialog(item, k){
            this.deviceDataCopy = []
            this.deviceData.forEach(deviceItem => {
                this.deviceDataCopy.push(deviceItem)
            })
            if(k) {
                this.tableKey = k
            }
            if(item){
                this.editSceneObject = item
                for(let k in this.editSceneForm){
                    if(k == 'field_name'){
                        if(item[k]){
                            this.editSceneForm[k] = item[k].split(',')
                            if(this.editSceneForm[k].length === this.basicColumnData.length){
                                this.selectAll = true
                            }
                        }else{
                            this.editSceneForm[k] = this.basicColumnData
                            this.selectAll = true
                        }
                    }else{
                        this.editSceneForm[k] = item[k]
                    }
                }
                this.selectedDeviceInScene = this.deviceData.filter(function(i){
                    return i.id === item.device_id
                })[0]
                if(!this.selectedDeviceInScene){
                    this.handleDeviceData(item)
                }
            }
            this.$refs.editSceneRef.openDialog();
        },

        resetScene(){
            this.editSceneForm = {
                project: '',
                project_name: '',
                scene_name: '',
                remarks: '',
                description: '',
                device_id: '',
                device_name: '',
                server:'',
                test_tool: '',
                field_name: [],
            }
            this.selectedId = ""
            this.$emit('changeSceneName', '新增')
            this.editSceneObject = {}
            this.selectedDeviceInScene = {}
            this.$emit('afterEdit', this.tableKey)
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
            // console.log(device)
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
.field-item{
    display: inline-block;
    margin-top: -2%;
}
</style>