<template>
    <div>
        <self-dialog 
            ref="editSceneTempRef" 
            :dialog-data="{ title: editSceneTempName+'场景模板', width: '40%', confirmName: editSceneTempName, closeName: '取消' }" 
            style="text-align: left;"
            @confirm="confirmEditSceneTemp"
            @close="resetSceneTemp">
            <div>
                <el-form ref="editSceneTempFormRef" :model="editSceneTempForm" label-suffix=":" :rules="editSceneTempFormRules" label-width="90px">

                    <el-form-item label="场景模板" class="item-short">
                        <el-select v-model="selectedTempId" placeholder="选择场景模板" @change="selectTempChange"  style="width: 100%;" filterable>
                            <el-option v-for="item,index in sceneTempData" :label="item.scene_name" :value="item.id" :key="index">
                                <span>{{ item.scene_name }}</span>
                                <span @click.stop="delSceneTemp(item, $event)" style="float: right; color: blue">删除</span>
                            </el-option>
                            <el-option label="新增场景模板" value="新增场景模板" style="color:red"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="场景名称" prop="scene_name" class="item-short">
                        <el-input v-model="editSceneTempForm.scene_name"></el-input>
                    </el-form-item>

                    <el-form-item label="所属项目" prop="project" class="item-short">
                        <self-cascader 
                            placeholder="选择项目组"
                            :selectValue.sync="editSceneTempForm.project"
                            :options="projectClassifyArr"
                            valueKey="value" 
                            @change="changeTempProject"/>
                    </el-form-item>
                    <el-form-item label="场景说明"  prop="description" style="margin-left: 2%;">
                        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="editSceneTempForm.description" style="width: 92%;"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" style="margin-left: 2%;">
                        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="editSceneTempForm.remarks" style="width: 92%;"></el-input>
                    </el-form-item>

                    <el-form-item label="选择字段" style="margin-left: 2%;" v-if="isProformancePC">
                        <el-button size="mini" type="primary" @click="checkSelectAll">{{ selectAll ? '取消全选' : '全选' }}</el-button>
                        <el-checkbox-group v-model="editSceneTempForm.field_name" @change="handleItemChange">
                            <el-checkbox v-for="item,index in basicColumnData" :key="index" :label="item"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="选择字段" style="margin-left: 2%;" v-else>
                        <el-button size="mini" type="primary" @click="checkSelectAll">{{ selectAll ? '取消全选' : '全选' }}</el-button>
                        <el-checkbox-group v-model="editSceneTempForm.field_name" @change="handleItemChange">
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
            editSceneTempForm: {
                project: '',
                project_name: '',
                scene_name: '',
                remarks: '',
                description: '',
                field_name: [],
            },
            editSceneTempFormRules: {
                scene_name: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                // project: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
                description: [{ required: true, validator: formRule.validateStr, trigger: 'change' }],
            },
            selectedTempId: "",   // 选择的场景模板
        }
    },
    props: {
        editSceneTempName: {},
        sceneTempData: {},
        projectClassifyArr: {},
        appUrl: {},
    },
    computed: {
        basicColumnData() {
            return this.$store.getters.getAllItem;
        },
        performanceFiledList(){
            return this.$store.getters.getPerformanceFiledList;
        },
        isProformancePC(){
            return this.appUrl === 'pcPerfTest'
        }
    },
    methods: {
        checkSelectAll(){
            this.selectAll = !this.selectAll
            if(this.selectAll){
                this.editSceneTempForm.field_name = this.isProformancePC ? this.basicColumnData : this.performanceFiledList.map(item => item.propName)
            }else{
                this.editSceneTempForm.field_name = []
            }
        },

        handleItemChange(val){
            // console.log(val)
            if(this.isProformancePC){
                if(val.length === this.basicColumnData.length){
                    this.selectAll = true
                }else{
                    this.selectAll = false
                }
            }else{
                if(val.length === this.performanceFiledList.length){
                    this.selectAll = true
                }else{
                    this.selectAll = false
                }
            }
        },
        confirmEditSceneTemp(){
            let hasError = this.$publicJS.checkFormData(this, "editSceneTempFormRef", "您有必填项未填或填写不规范！");
            if(!hasError){
                let formData = new FormData();
                for(let k in this.editSceneTempForm){
                    if(k == 'field_name'){
                        formData.append(k, this.editSceneTempForm[k].join(','));
                    }
                    else if(k == 'project'){
                        if(!this.editSceneTempForm[k]){
                            formData.append(k, 'all');
                        }else{
                            formData.append(k, this.editSceneTempForm[k]);
                        }
                    }
                    else if(k == 'project_name'){
                        if(!this.editSceneTempForm[k]){
                            formData.append(k, '全部项目组');
                        }else{
                            formData.append(k, this.editSceneTempForm[k]);
                        }
                    }
                    else{
                        formData.append(k, this.editSceneTempForm[k]);
                    }
                }
                if(this.editSceneTempName == "新增"){
                    this.$formPost("/" + this.appUrl + "/create_scene_schemas/", formData, { operation: "新增测试场景模板", success:true, failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$refs.editSceneTempRef.closeDialog();
                            this.resetSceneTemp()
                        }
                    })
                }else{
                    formData.append('id', this.selectedTempId);
                    this.$formPost("/" + this.appUrl + "/edit_scene_schemas/", formData, { operation: "修改测试场景模板", success:true, failed: true }).then(res => {
                        if (res.code == 200) {
                            this.$refs.editSceneTempRef.closeDialog();
                            this.resetSceneTemp()
                        }
                    })
                }
            }
        },

        // 场景模板数据清空
        resetSceneTemp(){
            this.editSceneTempForm = {
                project: '',
                project_name: '',
                scene_name: '',
                remarks: '',
                description: '',
                field_name: [],
            }
            this.$emit('changeSceneTempName', '新增')
            this.selectedTempId = ""
        },

        // 选择的场景模板变动
        selectTempChange(val){
            if(val !== "新增场景模板"){
                this.$emit('changeSceneTempName', "修改")
                let sceneTemp = this.sceneTempData.filter(function(item){
                    return item.id == val
                })[0]
                this.editSceneTempForm.scene_name = sceneTemp.scene_name
                this.editSceneTempForm.project = sceneTemp.project
                this.editSceneTempForm.project_name = sceneTemp.project_name
                this.editSceneTempForm.remarks = sceneTemp.remarks
                this.editSceneTempForm.description = sceneTemp.description
                this.editSceneTempForm.field_name = sceneTemp.field_name ? sceneTemp.field_name.split(',') : []
                if(this.isProformancePC){
                    if(this.editSceneTempForm.field_name.length === this.basicColumnData.length){
                        this.selectAll = true
                    }else{
                        this.selectAll = false
                    }
                }else{
                    if(this.editSceneTempForm.field_name.length === this.performanceFiledList.length){
                        this.selectAll = true
                    }else{
                        this.selectAll = false
                    }
                }
            }else{
                this.resetSceneTemp()
            }
        },

        // 场景模板项目组变动
        changeTempProject(){
            let projectList = this.$publicJS.getCascacaderChoosed(this.projectClassifyArr, this.editSceneTempForm.project);
            this.editSceneTempForm.project_name = projectList.label;
        },

        openDialog(){
            this.$refs.editSceneTempRef.openDialog();
        },

        delSceneTemp(item, event){
            // console.log(item)
            let confirmText = "确定删除【<b>" + item.scene_name + "</b>】吗？";
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let list = {
                    id: item.id,
                }
                this.$codePost("/" + this.appUrl + "/delete_scene_schemas/", list, { operation: "删除场景模板", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.resetSceneTemp()
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
.field-item{
    display: inline-block;
    margin-top: -2%;
}
</style>