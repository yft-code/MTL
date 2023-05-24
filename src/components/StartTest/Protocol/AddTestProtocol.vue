<template>
    <div>
        <self-dialog 
            ref="addTestProtocolRef" 
            :dialog-data="{ title: testContentDialogTitle, width: '50%', top: '3rem', confirmName: '确认分配', closeName: '关闭'}" 
            @close="close"
            @confirm="confirmAllocateMission"
            >
            <protocol-table 
                ref="protocolTableRef"
                :protocolList="protocolList" 
                :showOperation="showOperation" 
                :tableItemList="tableItemList"
                :isEdit="true"
                :protocolForm="protocolForm"
                @handleProtocolChange="handleSelectionChange"
                @deleteProtocol="deleteProtocol"
                @createProtocol="createProtocol"
                @close="close"
                @handleAddProtocol="handleAddProtocol"></protocol-table>
            <el-form :model="protocolForm" ref="protocolFormRef" label-width="120px" :rules="fixDeviceFormRules" style="width: 90%;margin-top: 18px;">
                <el-form-item label="执行人" prop="selectedQaList">
                    <el-select 
                        v-model="protocolForm.selectedQaList" 
                        placeholder="请选择测试人员"
                        filterable 
                        multiple
                        style="width: 50%"
                        >
                        <el-option
                            v-for="item in testerOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value+''"
                        ></el-option>
                    </el-select>
                </el-form-item>
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
    },
    data() {
        return {
            editProtocol: "确定",
            //新增编辑测试内容数据
            testContentDialogTitle: "",
            protocolForm: {
                protocol_name: "",
                description: "",
                selectedQaList: [],
            },
            testerOption: [],   // 测试人员
            fixDeviceFormRules: {
                protocol_name: [{ required: true, trigger: 'blur', message: "请填入协议名" }],
                selectedQaList: [{ required: true, trigger: 'blur', message: "请选择执行人" }],
            },
            // tableItemList: [
            //     {
            //         titleName: "协议名",
            //         propName: "protocol_name",
            //         align: "center"
            //     },
            //     {
            //         titleName: "协议说明",
            //         propName: "description",
            //         align: "left"
            //     },
            // ],
            showOperation: false,
            selectedProtocolList: [],
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
        this.getQaList()
    },
    mounted() {

    },
    methods: {
        deleteProtocol(row){
            let text = "确定删除协议【" + row.protocol_name + "】吗？"
            this.$selfConfirm(text, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let list = {
                    id: row.id
                }
                this.$codePost("/protocolTest/delete_test_task/", list, {operation: "删除协议", success: true, failed: true }).then(res => {
                    if(res.code == "200"){ 
                        // this.close()
                        this.$emit("afterEdit")
                        this.showOperation = false
                        this.selectedProtocolList = []
                    }
                })
            }).catch(() => { });

        },

        handleSelectionChange(val){
            this.selectedProtocolList = val
        },
        
        handleAddProtocol() {
            let obj = {};
            obj.protocol_name = "";
            obj.description = "";
            obj.addLine = true
            this.showOperation = true
            this.$emit("afterAdd", obj)
            this.$nextTick(()=>{
                // console.log(this.$refs.protocolTableRef),
                this.$refs.protocolTableRef.protocolNameInputFocus()
            })
        },

        // 获取测试人员信息
        getQaList() {
            this.$codePost("/service/get_qa_list/").then(res => {
                if (res.code == 200) {
                    this.testerOption = res.data;
                }
            })
        },

        addTestProtocol() {
            this.testContentDialogTitle = "新增任务";
            this.$refs.addTestProtocolRef.openDialog();
        },

       
        close(){
            this.protocolForm = {
                protocol_name: "",
                description: "",
                selectedQaList: [],
            }
            this.$emit("afterEdit")
            this.showOperation = false
            this.selectedProtocolList = []
        },

        

        // 分配任务
        createProtocol(){
            if(this.protocolForm.protocol_name == ""){
                return this.$message.warning("请先输入协议名称")
            }
            let list = {
                id: this.$route.query.id,
                protocol_name: this.protocolForm.protocol_name,
                description: this.protocolForm.description
            }
            this.$codePost("/protocolTest/insert_test_task/", list, {operation: "新增协议", success:true, failed: true }).then(res => {
                if(res.code == "200"){
                    this.close()  
                    // this.$emit("afterEdit")
                    // this.showOperation = false
                    // this.selectedProtocolList = []
                }
            })
        },
        confirmAllocateMission(){
            let hasError = this.$publicJS.checkFormData(this, "protocolFormRef", "您有必填项未填！");
            if(!hasError){
                if(this.selectedProtocolList.length == 0){
                    return this.$message.warning("请先勾选需要分配的协议")
                }
                let id_list = []
                this.selectedProtocolList.forEach(item => {
                    id_list.push(item.id)
                })
                let list = {
                    application_id: this.$route.query.id,
                    id_list: JSON.stringify(id_list),
                    qa_list: JSON.stringify(this.protocolForm.selectedQaList)
                }
                // console.log(list)
                this.$codePost("/protocolTest/task_allocate/", list, {operation: "分配任务", success: true, failed: true }).then(res => {
                    if(res.code == "200"){
                        this.close()
                        this.$emit('afterAllocate')
                    }
                })
            }
        },
    },

}
</script>
<style scoped>
.choice-tag{
    cursor: pointer;
}
.split-card {
    display: inline-block;
    vertical-align: top;
}

.form-card {
    width: 34%;
    margin-right: 1%;
}

.question-table-card {
    width: 64%;
}

.el-icon-refresh {
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    border: 1px solid #DCDFE6;
    padding: 0.5rem 0.4rem;
    margin-left: 0.1rem;
    border-radius: 5px;
}

.form-card>>>.el-radio {
    margin-right: 0.7rem;
}

.form-card>>>.el-radio .el-radio__label {
    padding-left: 0.3rem;
}

.form-card>>>.el-input.is-disabled .el-input__inner,
.form-card>>>.el-radio__input.is-disabled+span.el-radio__label {
    color: #959595;
}

.question-item {
    font-size: 14px;
    border: 1px solid #DCDFE6;
    width: 33%;
    margin-right: 2px;
    margin-bottom: 2px;
    display: inline-block;
    vertical-align: top;
    padding: 0.3rem;
    border-radius: 3px;
    cursor: pointer;
}

.question-item .question-desc {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.question-check {
    border-bottom: 1px solid #DCDFE6;
}

.question-check>>>.el-checkbox .el-checkbox__label {
    padding-left: 0;
    transition: none !important;
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
