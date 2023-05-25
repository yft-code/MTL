<template>
    <div>
        <self-dialog 
            ref="edittMissionRef" 
            :dialog-data="{ title: testContentDialogTitle, width: '30%', top: '12rem'}" 
            >

            <el-form ref="missionFormRef" :model="missionForm" label-width="40%" :rules="missionFormRules">
                <el-form-item label="预分配设备" prop="preset_device">
                    <el-input disabled v-model="missionForm.preset_device" style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="测试执行人" prop="test_qa">
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

            <div style="text-align:center; margin-bottom: -30px;margin-top:10px"><el-button type="primary" @click="confirmEditMission" size="small">确定</el-button></el-button></div>
            
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
            testContentDialogTitle: "转单",
            testerOption: [],   // 测试人员
            missionForm: {
                id: "",
                preset_device: "",
                test_qa: "",            
            },
            missionFormRules: {
                preset_device: [{ required: true, trigger: 'change' }],
                test_qa: [{ required: true, trigger: 'change' }],
            },
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
         let res= getQaList({},{})
                // console.log(res)
                if (res.code == 200) {
                    this.testerOption = res.data;
                }
        },

        confirmEditMission(){
            let hasError = this.$publicJS.checkFormData(this, "missionFormRef", "您有必填项未填！");
            if(!hasError){
                let list = {
                    id_list: JSON.stringify([this.missionForm.id]),
                    // preset_device: this.missionForm.preset_device,
                    test_qa: this.missionForm.test_qa
                }
                this.$codePost("/expertCompatibility/update_test_task/", list, {operation: "转单", success: true, failed: true }).then(res => {
                    if(res.code == "200"){
                        this.$emit('afterEdit')
                        // if(res.data){

                        // }
                        this.$refs.edittMissionRef.closeDialog();
                    }
                })
            }

        },

        editMission(item){
            // console.log(item)
            this.initData(item)
            this.$refs.edittMissionRef.openDialog();
        },

        initData(item){
            this.missionForm.id = item.id
            this.missionForm.preset_device = item.preset_device
            this.missionForm.test_qa = item.test_qa
            // console.log(this.missionForm)
        },
    },

}
</script>
<style scoped>

</style>
