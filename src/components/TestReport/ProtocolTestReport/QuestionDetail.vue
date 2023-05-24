<template>
    <div class="self-table">   
        <div>
            <el-table 
                ref="elTableRef"
                :data="tableData.filter((v) => v.question.length > 0)"  
                border 
                stripe 
                :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center'}"
                >
                <!-- <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-card style="margin:0 15px;">
                            <question-table  :isChackData="true" :tableData="scope.row.question" @afterDelete="afterQuestionDelete"></question-table>
                        </el-card>
                    </template>
                </el-table-column> -->
                <el-table-column
                    v-for="(item,index) in basicColumnData"
                    :key="index"
                    :prop="item.propName"
                    :label="item.titleName"
                    :sortable="item.sortFlag ? true : false"
                    :min-width="item.minWidth"
                    :align="item.align || 'center'"
                    :fixed="item.fixed || false"
                    >
                    <template slot-scope="scope">
                        <div v-if="item.propName == 'protocol_name'">
                            {{ scope.row[item.propName] }} {{scope.row.description ? ('（' + scope.row.description + '）') : ''}}
                        </div>
                        <div v-else-if="item.propName == 'problem_detail'">
                            <div v-if="scope.row.question.length > 0">
                                <div v-for="ques,i in scope.row.question" :key="i">

                                    <!-- {{ques}} -->
                                    {{"【P"+ques.q_level+"】"}} {{ques.msg}}
                                    <span v-if="!$checkIsNull(ques.picture)">
                                        <self-picture-show 
                                            :img-path="getPicUrl(scope.row, scope.$index, ques.picture)" 
                                            :title="`查看图片（共${ques.picture.length}张）`"
                                            style="margin-left:2px;"
                                            />
                                    </span>
                                    <!-- <hr v-if="i != scope.row.question.length-1" /> -->
                                </div>
                            </div>
                        </div>
                        <!-- <div v-else-if="item.propName == 'pic_list'">
                            <div v-if="scope.row.question.length > 0">
                                <div v-for="ques,i in scope.row.question" :key="i">
                                    {{ques.picture}}
                                    <hr v-if="i != scope.row.question.length-1" />
                                </div>
                            </div>
                        </div> -->
                    </template>
                </el-table-column>
            </el-table> 
        </div>
    </div>
</template>

<script>
import $ from "jquery"
import EditPicture from '@/components/Common/EditPicture'
import SendReport from '@/components/Common/SendReport'
import SelfPopo from '@/components/Common/SelfPopo'
import QuestionTable from '@/components/StartTest/Protocol/QuestionTable'
export default {
    components: {
        EditPicture,
        SendReport,
        SelfPopo,
        QuestionTable
    },
    props: {
        axiosList: {
            type: Object
        },
        tableType:{
            type: String
        },
        currentQaAdmin: {},
        tableData: {},
        recordQuestionlist: {},
    },
    data() {
        return {
            basicColumnData:[
                {
                    titleName: '协议名(功能)',
                    propName: 'protocol_name',
                    align: 'left',
                    minWidth: "35%",
                },
                {
                    titleName: "问题详情+执行图片",
                    propName: 'problem_detail',
                    align: 'left',
                    minWidth: "65%",
                },
            ],
        }
    },
    computed: {

    },
    created() {
       
    },
    mounted() {
        
    },
    destroyed() {
    },
    methods: {

        afterQuestionDelete(){
            this.$emit("afterQuestionDelete")
        },



        getColor(item, row){
            let index = -1
            if(row.not_pass_reason && row.not_pass_reason !== 'null'){

                let index = row.not_pass_reason.split(',').indexOf(item.propName)
            }
            if(index != -1){
                return 'red'
            }
            return ''
        },


        getPicUrl(row, index, pic) {
            let arr = pic.map((value, index) => {
                return value.pic_url;
            })
            return arr;
        },
    },

}
</script>

<style scoped>

.self-table>>>.pagination .btn-prev,
.self-table>>>.pagination .el-pager li,
.self-table>>>.pagination .btn-next {
    background-color: white;
}

.self-table>>>.el-table__fixed-right-patch {
    background-color: #e7e9ee;
}
.self-table .qaSelect>>>.el-select {
    height: 100%;
}
.self-table .qaSelect>>>.el-select__tags {
    transform: none;
    top: 2px;
}
.self-table .qaSelect>>>.el-tag__close.el-icon-close {
    display: none;
}
.el-progress >>> .el-progress-bar__outer {
    background-color: #d0d0d0 !important;
}
.orderBtn{
    float: right;
    margin-bottom: 8px;
    margin-top: -8px;
}

.el-table {
  display: flex;
  flex-direction: column;
}
.el-table >>> .el-table__header-wrapper {
  overflow: visible !important;
}
/deep/ .el-table .row-expand-cover .cell .el-table__expand-icon{
    display: none;
}
</style>