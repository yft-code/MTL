<template>
    <div>
        <self-dialog 
            ref="addTestMissionRef" 
            :dialog-data="{ title: testContentDialogTitle, width: '50%', top: '3rem', confirmName: '确认分配', closeName: '关闭'}" 
            @close="close"
            @confirm="confirmAllocateMission"
            >
            <el-form ref="missionFormRef" :model="missionForm" label-width="230px" :rules="missionFromRules" :show-message="false">
                <div v-for="item,index in deviceData" :key="index" class="device-div">
                    <el-form-item :prop="item.name" :label="item.name+'('+item.device+')'">
                        <el-select 
                            v-model="missionForm[item.name]" 
                            placeholder="请选择测试人员"
                            filterable 
                            clearable 
                            >
                            <el-option
                                v-for="item in testerOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value+''"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="scene-div">
                    <el-form-item label="选择测试场景" prop="scene_id_list">
                        <!-- <el-checkbox-group v-model="missionForm.scene_id_list">
                            <el-checkbox v-for="item,index in sceneTempData" :key="index" :label="item.id">{{ item.scene_name }}</el-checkbox>
                        </el-checkbox-group> -->
                        <el-select v-model="missionForm.scene_id_list" multiple filterable >
                          <el-option v-for="item,index in sceneTempData" :key="index" :label="item.scene_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import SelfDialog from "@/components/Common/SelfDialog.vue"
import ProtocolTable from '@/components/StartTest/Protocol/ProtocolTable'
export default {
    components: {
        SelfDialog,
        ProtocolTable
    },
    props: {
        protocolList: {},
        tableItemList: {},
        deviceData: {},
        sceneTempData: {},
        testerOption: {},
    },
    data() {
        return {
            deviceQaList: [],
            missionForm: {
                id: "",
                scene_id_list: [],
            },
            //新增编辑测试内容数据
            testContentDialogTitle: "",
            protocolForm: {
                protocol_name: "",
                description: "",
                selectedQaList: [],
            },
            missionFromRules: {},
        }
    },
    computed: {

        projectCode() {
            return this.$store.getters.getProjectCode;
        },
    },
    watch: {
    },
    created() {
    },
    mounted() {

    },
    methods: {
        openDialog(){
            this.testContentDialogTitle = "分配测试任务";
            this.initData()
            this.$refs.addTestMissionRef.openDialog();
        },

        initData(){
            let deviceQaList = []
            let list = {
                id: "",
                scene_id_list: [],
            }
            let rules = {}
            this.deviceData.forEach(item => {
                let temp = {}
                list[item.name] = ''
                // rules[item.name] = [{ required: true, trigger: 'blur', message: "请选择测试人员" }]
                temp.device = item.name
                temp.test_qa = ''
                deviceQaList.push(temp)
            })
            rules['scene_id_list'] = [{ required: true, trigger: 'blur', message: "请选择测试场景" }]
            this.deviceQaList = deviceQaList
            this.missionForm = list
            this.missionFromRules = rules
        },
       
        close(){
            this.missionForm = {
                id: "",
                scene_id_list: [],
            }
            this.missionFromRules = {}
            this.deviceQaList = []
            this.$emit("afterEdit")
        },

        confirmAllocateMission(){
            let hasError = this.$publicJS.checkFormData(this, "missionFormRef", "您有必填项未填！");
            if(!hasError){
                this.deviceQaList.forEach(item => {
                    item.test_qa = this.missionForm[item.device]
                })
                let list = {
                    id: this.$route.query.id,
                    scene_id_list: JSON.stringify(this.missionForm.scene_id_list),
                    allocate: JSON.stringify(this.deviceQaList)
                }
                // console.log(list)
                this.$codePost("/mobilePerfTest/task_allocate/", list, {operation: "分配任务", success: true, failed: true }).then(res => {
                    if(res.code == "200"){
                        this.close()
                        this.$refs.addTestMissionRef.closeDialog()
                        this.$emit('afterAllocate')
                    }
                })
            }

        },
    },

}
</script>
<style scoped>
.device-div{
    width: 49%;
    display: inline-block;
}
.device-span {
    display: inline-block;
    width: 45%;
    text-align: right;
    margin-right: 10px;
}
.select-span {
    display: inline-block;
    width: 50%;
    text-align: left;
    margin-right: 10px;
}
.scene-div {
    width: 60%;
    display: inline-block;
}
.label-span{
    display: inline-block;
    width: 20%;
    text-align: right;
    vertical-align: top;
    margin-right: 10px;
}
.option-sapn{
    display: inline-block;
    width: 75%;
    text-align: left;
    margin-right: 10px;
}


.el-table {
  display: flex;
  flex-direction: column;
}
.el-table >>> .el-table__header-wrapper {
  overflow: visible !important;
}
.comment{
    white-space:pre-wrap;
}
</style>
