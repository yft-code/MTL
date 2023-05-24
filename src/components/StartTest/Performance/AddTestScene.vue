<template>
    <div>
        <self-dialog 
            ref="editSceneRef" 
            :dialog-data="{ title: editSceneName+'测试场景', width: '40%', confirmName: editSceneName, closeName: '取消' }" 
            @confirm="confirmEditScene">
            <div>
                <el-form ref="editSceneFormRef" :model="editSceneForm" label-suffix=":" :rules="editSceneFormRules"  label-width="100px">
                    <el-form-item label="场景模板" v-if="editSceneName=='新增'" class="item-short">
                        <el-select v-model="selectedId" placeholder="选择场景模板" @change="selectSceneChange" style="width: 100%;" filterable>
                            <el-option v-for="item,index in sceneTempData" :label="item.scene_name" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="场景名称" prop="scene_name" class="item-short">
                        <el-input v-model="editSceneForm.scene_name"></el-input>
                        <!-- <el-input v-model="editSceneForm.scene_name" v-if="editSceneName=='新增'"></el-input>
                        <el-input v-model="editSceneForm.scene_name" v-else style="width: 72%"></el-input>
                        <el-button type="primary" v-if="editSceneName!=='新增'" style="margin-left: 5px;" size="mini" @click="deleteScene">删除</el-button> -->
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
                            <el-checkbox v-for="item,index in performanceFiledList" :key="index" :label="item.propName">{{ item.titleName }}</el-checkbox>
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
                scene_name: '',
                remarks: '',
                description: '',
                server:'',
                test_tool: '',
                field_name: [],
            },
            editSceneFormRules: {
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
            selectedId: "", // 新增测试场景里选择的模板id
            editSceneObject: {},    // 当前修改的场景对象
            currentDevice: {},  // 当前新增场景的设备
            currentQa: "", // 当前新增场景的qa
        }
    },
    props: {
        editSceneName: {},
        sceneTempData: {},
        axiosList: {},
    },
    computed: {
        performanceFiledList() {
            return this.$store.getters.getPerformanceFiledList;
        }
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
                formData.append('device_name', this.currentDevice.device_name)
                if(this.editSceneName == "新增"){
                    formData.append('application_id', this.axiosList.id)
                    formData.append('test_qa', this.currentQa)
                    this.$formPost("/mobilePerfTest/create_test_scene/", formData, { operation: "新增测试场景", failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$refs.editSceneRef.closeDialog();
                            this.resetScene()
                        }
                    })
                }else{
                    formData.append('id', this.editSceneObject.id)
                    this.$formPost("/mobilePerfTest/edit_test_scene/", formData, { operation: "编辑测试场景", failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$refs.editSceneRef.closeDialog();
                            this.resetScene()
                        }
                    })
                }
            }
        },
        checkSelectAll(){
            this.selectAll = !this.selectAll;
            if(this.selectAll){
                this.editSceneForm.field_name = this.performanceFiledList.map(item => item.propName)
            }else{
                this.editSceneForm.field_name = [];
            }
        },
        handleItemChange(val){
            if(val.length == this.performanceFiledList.length){
                this.selectAll = true;
            }else{
                this.selectAll = false;
            }
        },

        deleteScene(){
            console.log(this.editSceneObject)
            let confirmMeg = "确定删除【"+ this.editSceneObject.scene_name +"】场景吗？"
            this.$selfConfirm(confirmMeg, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                // let list = { id: this.editSceneObject.id };
                let list = {
                    id_list: JSON.stringify([this.editSceneObject.id])
                }
                this.$codePost("/mobilePerfTest/delete_test_scene/", list, { operation: "删除测试场景", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$refs.editSceneRef.closeDialog();
                        this.resetScene()
                    }
                })
            }).catch(() => { });
        },



        // 选择的场景发生更改-新增测试场景模态框
        selectSceneChange(val){
            let scene = this.sceneTempData.filter(function(item){
                return item.id == val
            })[0]
            for(let k in this.editSceneForm){
                if(k == 'field_name'){
                    this.editSceneForm[k] = scene[k] ? scene[k].split(',') : []
                }else{
                    this.editSceneForm[k] = scene[k] ? scene[k] : ''
                }
            }
            if(this.editSceneForm.field_name.length == this.performanceFiledList.length){
                this.selectAll = true
            }else{
                this.selectAll = false
            }
        },

        addTestScene(item, qa){
            this.currentDevice = item
            this.currentQa = qa
            this.$refs.editSceneRef.openDialog();
        },

        openDialog(scene,device){
            // console.log(scene)
            // console.log(device)
            this.currentDevice = device
            if(scene){
                this.editSceneObject = scene
                for(let k in this.editSceneForm){
                    if(k == 'field_name'){
                        this.editSceneForm[k] = scene[k] ? scene[k].split(',') : []
                    }else{
                        this.editSceneForm[k] = scene[k] ? scene[k] : ''
                    }
                }
            }
            // console.log(this.editSceneForm)
            this.$refs.editSceneRef.openDialog();
        },

        resetScene(){
            this.editSceneForm = {
                scene_name: '',
                remarks: '',
                description: '',
                server:'',
                test_tool: '',
                field_name: [],
            }
            this.selectedId = ""
            this.$emit('changeSceneName', '新增')
            this.editSceneObject = {}
            this.currentDevice = {}
            this.currentQa = ""
            this.selectAll = false
            this.$emit('afterEdit')
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