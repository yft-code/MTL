<template>
    <div>
        <div v-if="tableData && tableData['P0'] && tableData['P0'].length == 0 && tableData['P1'] && tableData['P1'].length == 0">
            无
        </div>
        <div v-else v-for="v,k,index in tableData" :key="k" style="color: red;">
            <!-- <div>P0问题：</div> -->
            <div class="question-title">{{k + "问题："}}</div>
            <div v-if="v.length > 0">
                <div v-for="item,i in v" :key="index+'_'+i" class="item-div">
                    {{i+1 + '、'}}{{ item.protocol_name ? item.protocol_name : "" }}{{ item.protocol_description ? '(' + item.protocol_description + ')':'' }}：{{item.msg}}
                    <self-picture-show 
                        v-if="item.pic.length>0"
                        :img-path="getPicUrl(item.pic)" 
                        :title="`查看图片（共${item.pic.length}张）`"
                        style="margin-left:2px;"
                        />
                    <!-- {{item}} -->
                </div>
            </div>
            <div v-else class="item-div">
                <span>无</span>
            </div>
            <div class="gap-div"></div>
        </div>
    </div>
</template>
<script>
import EditQuestion from "@/components/StartTest/Protocol/EditQuestion"
export default {
    components: {
        EditQuestion,
    },
    data() {
        return {
            tableName: "",
            columnData: [
                {
                    titleName: '问题描述',
                    propName: 'msg',
                    minWidth: 250,
                    align: 'left',
                },
                {
                    titleName: '图片',
                    propName: 'picture_list',
                    minWidth: 150,
                },
            ],
            urlPath: "",
            applicationId: "",
            questionData: [],
        }
    },
    computed: {

    },
    props: {
        isChackData: {},
        tableData: {},
        isDialog: {},
        tableWidth: {},
        isReport: {},
    },
    created() {
        if(this.isReport){
            this.columnData = this.columnData.filter(item => {
                return item.propName != 'q_number' && item.propName != 'q_number' && item.propName != 'question_time'
            })
        }else{
            this.columnData = this.columnData.filter(item => {
                return item.propName != 'protocol_name'
            })
        }
        this.tableName = this.$route.query.testRecordName;
        this.applicationId = this.$route.query.id
        this.urlPath = this.$route.path
        if(this.urlPath == '/mtl_test_platform/page/protocolQuestionTable'){
            this.getQuestionData()
        }
    },
    mounted() {
        this.$store.commit("setPageIsLoading", false);
    },
    methods: {
        jumpPage(){
            this.$router.push({
                path: '/mtl_test_platform/page/protocolStartTest',
                query: this.$route.query
            })
        },
        getQuestionData(){
            this.$store.commit("setPageIsLoading", true);
            let list = {
                application_id: this.applicationId,
            }
            this.$codePost("/protocolTest/get_test_record/", list).then(res => {
                if(res.code == "200"){
                    let questionData = []
                    res.data.forEach(mission => {
                        if(mission.test_qa !== '未分配'){
                            mission.records.forEach(record => {
                                if(record.question){
                                    questionData = questionData.concat(record.question)
                                }
                            })
                        }
                    })
                    this.questionData = questionData
                    this.$store.commit("setPageIsLoading", false);
                }
            })
        },
        getPicUrl(pic) {
            let arr = pic.map((value, index) => {
                return value.pic_url;
            })
            return arr;
        },

        editPicture(row){
            this.$emit("editPicture", row)
        },

        //打开问题列表模态框
        openQuestionDialog() {
            this.$refs.questionShowRef.openDialog();
        },

        //新增问题
        addCaseQuestion() {
            this.$refs.editQuestionRef.addCaseQuestion();
        },

        //编辑问题
        editCaseQuestion(item) {
            if(this.isDialog){
                this.$emit('editCaseQuestion', item)
            }else{

                this.$refs.editQuestionRef.editCaseQuestion(item);
            }
        },

        //编辑后
        afterEdit(){
            // this.$refs.questionTableRef.getTableData();
        },

        //删除问题
        deleteCaseQuestion(item) {
            this.$selfConfirm("确定删除该用例问题吗？", '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                //确认
                let list = { question_id: item.id, application_id: this.applicationId };
                this.$codePost("/protocolTest/delete_question/", list, { operation: "删除用例问题", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        // this.$refs.questionTableRef.getTableData();
                        this.$emit("afterDelete")
                    }
                })
            }).catch(() => { });
        },

    },
    watch: {

    }
}
</script>
<style scoped>
.question-title{
    margin-bottom: 8px;
    font-size: 17px;
}
.gap-div{
    height: 15px;
}
.item-div{
    font-size: 15px;
    margin-left: 2rem;
}
</style>