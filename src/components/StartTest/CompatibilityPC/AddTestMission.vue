<template>
    <div>
        <self-dialog 
            ref="addTestMissionRef" 
            :dialog-data="{ title: '分配测试任务', width: '45%', top: '3rem'}" 
            >
            <el-card>
                <el-form label-width="250px;">
                    <el-form-item label="指定执行人">
                        <el-select 
                            v-model="selectedQaList" 
                            placeholder="请选择测试人员"
                            filterable 
                            multiple
                            style="width: 60%"
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
            </el-card>
            <div style="text-align:center; margin-bottom: -30px;margin-top:10px"><el-button type="primary" @click="createMission" size="small">分配</el-button></el-button></div>
            
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
export default {
    components: {
    },
    props: {
        currentQa: {},
    },
    data() {
        return {
            testerOption: [],   // 测试人员
            selectedQaList: [],
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
        this.getQaList()    // 获取测试人员信息
    },
    mounted() {

    },
    methods: {
        addTestMission() {
            this.getTestQa()
            this.$refs.addTestMissionRef.openDialog();
        },

        getTestQa(){
            let list = {
                table_name: this.$route.query.testRecordName
            }
            this.$codePost("/expertCompatibilityPC/get_qa_excutor/", list).then(res => {
                if (res.code == 200) {
                    console.log(res)
                    this.selectedQaList = res.data
                }
            })
        },

        // 获取测试人员信息
      async  getQaList() {
        let res=await getQaList({},{})
                // console.log(res)
                if (res.code == 200) {
                    this.testerOption = res.data;
                }
        },

        // 分配任务
        createMission(){
            if(this.selectedQaList.length < 1){
                return this.$message.warning("执行人不能为空")
            }
            let list = {
                qa_list: JSON.stringify(this.selectedQaList),
                table_name: this.$route.query.testRecordName
            }
            this.$codePost("/expertCompatibilityPC/task_allocate/", list, {operation: "分配任务", success: true, failed: true }).then(res => {
                if(res.code == "200"){
                    this.$emit('afterEdit')
                    this.$refs.addTestMissionRef.closeDialog();
                }
            })
        },

    },

}
</script>
<style scoped>

</style>
