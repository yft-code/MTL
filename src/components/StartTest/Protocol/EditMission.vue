<template>
    <div>
        <self-dialog 
            ref="edittMissionRef" 
            :dialog-data="{ title: testContentDialogTitle, width: '30%', top: '12rem'}" 
            >

            <el-form ref="missionFormRef" :model="missionForm" label-width="20%" :rules="missionFormRules">
                <el-form-item label="预分配协议" prop="protocol_name">
                    <el-input disabled v-model="missionForm.protocol_name" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="测试执行人" prop="test_qa">
                    <el-select 
                        v-model="missionForm.test_qa" 
                        placeholder="请选择测试人员"
                        filterable 
                        style="width: 80%"
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
                protocol_name: "",
                test_qa: "",            
            },
            missionFormRules: {
                protocol_name: [{ required: true, trigger: 'change' }],
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
        let res=getQaList({},{})
                // console.log(res)
                if (res.code == 200) {
                    this.testerOption = res.data;
                }
        },

        confirmEditMission(){
            let hasError = this.$publicJS.checkFormData(this, "missionFormRef", "您有必填项未填！");
            if(!hasError){
                let list = {
                    application_id: this.$route.query.id,
                    id: this.missionForm.id,
                    test_qa: this.missionForm.test_qa
                }
                this.$codePost("/protocolTest/update_test_record/", list, {operation: "转单", success: true, failed: true }).then(res => {
                    if(res.code == "200"){
                        this.$emit('afterEdit')
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
            this.missionForm.protocol_name = item.protocol_name
            this.missionForm.test_qa = item.test_qa
            // console.log(this.missionForm)
        },
    },

}
</script>
<style scoped>

</style>
