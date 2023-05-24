<template>
    <div class="self-table">   
        <edit-picture ref="editPictureRef" confirm-type="directAxios" @afterEdit="getTableData"/> 
        <send-report ref="sendReportRef" :axiosList="axiosList" />
        <el-button v-if="$route.query.testRecordName.indexOf('端游') == -1 && $route.path.indexOf('Report') == -1 " class="orderBtn" type="primary" size="mini" @click="changeMission(tableSelectItem)">一键统一转单</el-button>
        <div>
            <el-table 
                ref="elTableRef"
                :data="tableData"  
                stripe
                :row-class-name="getRowClass"
                max-height="calc(100vh - 500px)"
                @selection-change="handleSelectionChange"
                :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center'}"
                >
                <el-table-column v-if="$route.query.testRecordName.indexOf('端游') == -1 && $route.path.indexOf('Report') == -1" type="selection" :selectable="checkSelect"></el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-card style="margin:0 15px;">
                            <question-table  :isChackData="true" :tableData="scope.row.question" @afterDelete="afterQuestionDelete"></question-table>
                        </el-card>
                    </template>
                </el-table-column>
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
                        <div v-if="item.type == 'reason'">
                            <span :style="{ color: getColor(item, scope.row)}">{{scope.row[item.propName]}}</span>
                        </div>

                        <div v-else-if="item.propName == 'q_level'">
                            P{{ scope.row[item.propName] }}
                        </div>
        
                        <div v-else-if="item.propName == 'applicant'">
                            <span>{{ scope.row.applicant_name || scope.row.applicant }}</span>
                            <self-popo v-if="!$checkStrIsNull(scope.row.applicant)" :email="scope.row.applicant"/>
                        </div>

                        <div v-else-if="item.propName == 'test_qa'">
                            <span>{{ scope.row.test_qa_name || scope.row.test_qa }}</span>
                            <self-popo v-if="!$checkStrIsNull(scope.row.test_qa)" :email="scope.row.test_qa"/>
                        </div>

                        <div v-else-if="item.propName == 'test_progress'">
                            <el-progress :stroke-width="8" :percentage="scope.row.test_progress" :color="customColorMethod"></el-progress>
                        </div>

                        <div v-else-if="item.propName == 'questionList'">
                            <span v-if="scope.row.question">
                                <span v-for="(question, questionIndex) in scope.row.question" :key="index + '_question_' + questionIndex">
                                    <div v-if="question != ''">
                                        <span>{{ question.q_number }}</span>
                                        <span v-if="!$checkIsNull(question.picture)">
                                            <self-picture-show 
                                                :img-path="getPicUrl(scope.row, scope.$index, question.picture)" 
                                                :title="`查看图片（共${question.picture.length}张）`"
                                                style="margin-left:2px;"
                                                />
                                        </span>
                                        <i v-if="$route.path.indexOf('Report') == -1" class="el-icon-upload2 edit-icon" title="编辑图片" @click="editPicture(scope.row, question)"></i>
                                    </div>
                                </span>
                            </span>
                        </div>

                        <div v-else-if="item.propName == 'log_file'">
                            <a v-if="scope.row.log_file" class="blue-span" :href="getPath(scope.row.log_file)" target="_blank">下载</a>
                        </div>

                        <div v-else-if="item.propName == 'if_pass'">
                            <span :style="{ color: scope.row.if_pass == '不通过' ? 'red' : ''}">{{ scope.row.if_pass }}</span>
                        </div>

                        <div v-else-if="item.propName == 'q_description'">
                            <pre>{{ scope.row.q_description }}</pre>
                        </div>

                        <div v-else-if="item.propName == 'picture_list'">
                            <div v-if="scope.row[item.propName].length > 0">
                                <self-picture-show 
                                    :img-path="scope.row[item.propName]" 
                                    :img-type="tableType == 'questionTable' ? 'thumbnail' : ''" 
                                    title="查看图片"
                                    />
                                <div>共{{scope.row[item.propName].length}}张</div>
                            </div>
                        </div>

                        <div v-else-if="item.propName == 'operation'">
                            
                            <el-button 
                                type="primary" 
                                size="mini" 
                                @click="editTestContent(scope.row)"
                            >录入数据</el-button>

                            <el-button 
                                v-if="item.canEditMission && !scope.row.work_time"
                                type="primary" 
                                size="mini" 
                                @click="editMission(scope.row)"
                            >转单</el-button>

                            <el-button 
                                type="danger"  
                                size="mini" 
                                @click="deleteTestContent(scope.row)"
                            >删除</el-button>
                        </div>

                        <div v-else>{{scope.row[item.propName]}}</div>
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
        basicColumnData: {
            required: true,
        },
        tableType:{
            type: String
        },
        currentQaAdmin: {},
        tableData: {},
        recordQuestionlist: {},
        isReport: {},
    },
    data() {
        return {
            fileSuffix: '/static/',
            testTypeDictVerse:{},
            qaList: [],
            pageSize: 10,
            currentPage: 1,
            tableSelectItem: [],
        }
    },
    computed: {
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
        isTester() {
            return this.$store.getters.getIsTester
        },
        userEmail() {
            return this.$store.getters.getUserEmail || "";
        },
        testTypeDict(){
            return this.$store.getters.getTestTypeDict
        },
        serviceTypeOption(){
            return this.$store.getters.getServiceTypeOption
        },
        currentPageData() {
            const start = (this.currentPage - 1) * this.pageSize;
            let end = start + this.pageSize;
            return this.tableData.slice(start, end);
        }
    },
    created() {
       
    },
    mounted() {
        
    },
    destroyed() {
    },
    methods: {
        getRowClass(row, rowIndex){
            if(!row.row.question || row.row.question.length == 0){
                return 'row-expand-cover'
            }
        },

        afterQuestionDelete(){
            this.$emit("afterQuestionDelete")
        },

        // 已有工时的禁止选择
        checkSelect(row,index) {
            let isChecked = true;
            if (row.work_time) { // 判断里面是否存在某个参数
                isChecked = false
            } else {
                isChecked = true
            }
            return isChecked
        },

        //选中行变化
        handleSelectionChange(val) {
            this.tableSelectItem = JSON.parse(JSON.stringify(val));
            // console.log(this.tableSelectItem)
        },
        changeMission(tableSelectItem){
            if(tableSelectItem.length < 1){
                return this.$message.warning("请先勾选想要转单的记录")
            }
            this.$emit('changeMission', tableSelectItem)
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
        getTableData(){
            this.$emit('afterEdit')  
        },
        //编辑测试内容
        editTestContent(row) {
            this.$emit("editTestContent", row);
        },

        // 编辑任务
        editMission(row){
            this.$emit("editMission", row);
        },

        //删除测试内容
        deleteTestContent(row) {
            this.$emit("deleteTestContent", row);
        },

        //编辑图片
        editPicture(row, question){
            let isPC = false
            let test_type = '30'
            let list = {
                table_name: this.axiosList.table_name,
                project: this.projectCode,
                id: row.id,
                question_id: question.id,
                isPC: false,
                test_type: test_type
            }
            // 第二个参数是已有的图片信息
            // this.$refs.editPictureRef.editPicture(list, row.pic_info[questionId]);
            // console.log(question)
            this.$refs.editPictureRef.editPicture(list, question.picture);
        },

        getPicUrl(row, index, pic) {
            let arr = pic.map((value, index) => {
                return value.pic_url;
            })
            return arr;
        },

        // 切换当前页码
        handleCurrentChange(val){
            this.currentPage = val;
        },

        //切换分页显示几条数据
        handleSizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
        },

        //从文件数据中拼凑实际路径
        getPath(href) {
            // console.log(href)
            // let hrefArr = href.split("-");
            // let project = hrefArr[0];
            // let applicationDate = hrefArr[1] + "-" + hrefArr[2] + "-" + hrefArr[3];
            // let path = project + "/" + applicationDate + "/" + href;
            // return path;
            return href
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