<template>
    <div>
        <self-dialog 
            ref="editPatchMissionRef" 
            :dialog-data="{ title: testContentDialogTitle, width: '30%', top: '3rem'}" 
            >

            <el-form ref="missionFormRef" :model="missionForm" label-width="20%" :rules="missionFormRules">
                <el-table :data="tableSelectItem" stripe :height="tableSelectItem.length > 10 ? '500': 'auto'" :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }">
                    <el-table-column label="预分配设备" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.preset_device}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-form-item label="测试执行人" prop="test_qa" style="margin-top:15px;">
                    <el-select 
                        v-model="missionForm.test_qa" 
                        placeholder="请选择测试人员"
                        filterable 
                        style="width: 60%"
                        >
                        <el-option
                            v-for="item in testerOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <div style="text-align:center; margin-bottom: -30px;margin-top:10px"><el-button type="primary" @click="confirmEditPatchMission" size="small">确定</el-button></el-button></div>
            
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import {getQaList} from '@/api/workStation/common'
export default {
    components: {
        
    },
    props: {
    },
    data() {
        return {
            //新增编辑测试内容数据
            testContentDialogTitle: "批量转单",
            testerOption: [],   // 测试人员
            missionForm: {
                test_qa: "",            
            },
            missionFormRules: {
                test_qa: [{ required: true, trigger: 'change' }],
            },
            tableSelectItem: [],
        }
    },
    computed: {
    },
    watch: {

    },
    created() {
        this.getQaList()    // 获取测试人员信息
    },
    mounted() {

    },
    methods: {

        // 获取测试人员信息
       async getQaList() {
          let res= await getQaList({},{})
                // console.log(res)
                if (res.code == 200) {
                    this.testerOption = res.data;
                }
        },

        confirmEditPatchMission(){
            let hasError = this.$publicJS.checkFormData(this, "missionFormRef", "您有必填项未填！");
            if(!hasError){
                let id_list = []
                this.tableSelectItem.forEach(item => {
                    id_list.push(item.id)
                })
                let list = {
                    id_list: JSON.stringify(id_list),
                    test_qa: this.missionForm.test_qa
                }
                this.$codePost("/expertCompatibility/update_test_task/", list, {operation: "批量转单", success: true, failed: true }).then(res => {
                    if(res.code == "200"){
                        this.$emit('afterEdit')
                        this.$refs.editPatchMissionRef.closeDialog();
                    }
                })
            }

        },

        editPatchMission(item){
            // console.log(item)
            this.tableSelectItem = item
            this.missionForm.test_qa = item[0].test_qa
            this.$refs.editPatchMissionRef.openDialog();
        },
    },

}
</script>
<style scoped>

</style>
