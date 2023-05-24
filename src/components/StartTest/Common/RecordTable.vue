<template>
    <div class="self-table">   
        <edit-picture ref="editPictureRef" confirm-type="directAxios" @afterEdit="getTableData"/> 
        <send-report ref="sendReportRef" :axiosList="axiosList" />
        <!-- <el-table 
            ref="elTableRef"
            :data="currentPageData"  
            style="width: 100%"
            stripe
            sort-able
            :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
            > -->
        <el-button v-if="$route.query.testRecordName.indexOf('端游') == -1" class="orderBtn" type="primary" size="mini" @click="changeMission(tableSelectItem)">一键统一转单</el-button>
        <!-- <div :style="tableData.length > 10 ? {'height': '600px','overflow':'auto','width': '100%'} : {'width': '100%'}"> -->
        <div>
            <el-table 
                ref="elTableRef"
                :data="tableData"  
                stripe
                :max-height="tableHeight"
                @selection-change="handleSelectionChange"
                :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
                >
                <el-table-column v-if="$route.query.testRecordName.indexOf('端游') == -1" type="selection" :selectable="checkSelect"></el-table-column>
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
                        <div v-else-if="item.propName == 'preset_device'">
                            <span v-if="!scope.row.work_time" style="color:blue;cursor:pointer;text-decoration:underline;" @click="deviceSelect(scope.row)">{{scope.row[item.propName]}}</span>
                            <span v-else>{{scope.row[item.propName]}}</span>
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
                                <span v-for="(question, questionIndex) in scope.row.question.split(',')" :key="index + '_question_' + questionIndex">
                                    <div v-if="question != ''">
                                        <span>{{ recordQuestionlist[question].q_number }}</span>
                                        <span v-if="!$checkIsNull(scope.row.pic_info[question])">
                                            <self-picture-show 
                                                :img-path="getPicUrl(scope.row, scope.$index, scope.row.pic_info[question])" 
                                                :title="`查看图片（共${scope.row.pic_info[question].length}张）`"
                                                style="margin-left:2px;"
                                                />
                                        </span>
                                        <i class="el-icon-upload2 edit-icon" title="编辑图片" @click="editPicture(scope.row, question)"></i>
                                    </div>
                                </span>
                            </span>
                        </div>

                        <div v-else-if="item.propName == 'log_file'">
                            <!-- <a v-if="scope.row.log_file && logUrl[scope.$index]" class="blue-span" :href="logUrl[scope.$index]" target="_blank">下载</a> -->
                            <a v-if="scope.row.log_file" class="blue-span" style="cursor: pointer;" target="_blank" @click.onece="getLog(scope.row[item.propName], scope.$index)">下载</a>
                            <a :ref="'logFileRef_' + scope.$index" target="_blank" style="display: none;">下载</a>
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
                            <!-- <el-button 
                                type="primary" 
                                size="mini" 
                                @click="editTestContent(scope.row)"
                            >编辑</el-button> -->

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
        
        <!-- <el-pagination
            style="margin-top: 10px;"
            background
            align="right"
            :page-size="pageSize"
            :current-page="currentPage"
            :total="tableData.length"
            :page-sizes="[10, 20, 50, 100]"
            layout="prev, pager, next, jumper, sizes, total"
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange">
        </el-pagination> -->
    </div>
</template>

<script>
import $ from "jquery"
import EditPicture from '@/components/Common/EditPicture'
import SendReport from '@/components/Common/SendReport'
import SelfPopo from '@/components/Common/SelfPopo'
import SelfPersonSelect from '@/components/Common/SelfPersonSelect'
export default {
    components: {
        EditPicture,
        SendReport,
        SelfPopo,
        SelfPersonSelect
    },
    props: {
        axiosList: {
            // required: true,
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
        recordQuestionlist: {}
    },
    data() {
        return {
            fileSuffix: '/static/',
            testTypeDictVerse:{},
            qaList: [],
            pageSize: 10,
            currentPage: 1,
            tableSelectItem: [],
            tableHeight: 600,
            logUrl: {},
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
        },
        prePath(){
            return this.$store.getters.getPrePath
        },
    },
    created() {
    //    this.getLogUrl()
    },
    // watch: {
    //     tableData: {
    //         handler: function (val, oldVal) {
    //             this.getLogUrl()
    //         },
    //         deep: true
    //     }
    // },
    mounted() {
        // this.$nextTick(function() {
        //     this.resizeTable();
        //     // 监听窗口大小变化
        //     let _this = this;
        //     window.onresize = function() {
        //         _this.resizeTable();
        //     }
        // })
    },
    destroyed() {
    },
    methods: {
        getLog(url, index){
            this.$codePost('/service/get_driver_file/', {pre_path: this.prePath.log, path: url}).then(res => {
                if(res.code == 200){
                    this.$refs['logFileRef_' + index][0].href = res.data
                    this.$refs['logFileRef_' + index][0].click()
                }else{
                    this.$message.error(res.msg)
                }
            })
            
        },
        // 获取日志路径
        async getLogUrl(){
            this.logUrl = {}
            for (let i = 0; i < this.tableData.length; i++) {
                if(this.tableData[i].log_file !== '' && this.tableData[i].log_file !== null){
                    await this.$codePost('/service/get_driver_file/', {
                        pre_path: this.prePath.log,
                        path: this.tableData[i].log_file
                    }).then(res => {
                        this.logUrl[i] = res.data
                    })
                }
            }
            // console.log(this.logUrl)
        },
        deviceSelect(item){
            this.$emit("deviceSelect", item)
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
        //调整表格高度
        resizeTable() {
            let tableHeight = window.innerHeight - this.$refs.elTableRef.$el.offsetTop - 45;
            // if (this.tableList.tableTotalKey != undefined) {
            //     tableHeight = tableHeight - 45;
            // }
            this.tableHeight = tableHeight;
            //处理表格渲染错位的问题（当resize时，表头高度发生变化，固定列的表头和普通表头可能高度不一致）
            this.$refs.elTableRef.doLayout();
        },

        //选中行变化
        handleSelectionChange(val) {
            this.tableSelectItem = JSON.parse(JSON.stringify(val));
            // console.log(this.tableSelectItem)
        },
        changeMission(tableSelectItem){
            if(tableSelectItem.length < 1){
                return this.$message.warning("请先勾选想要转单的设备")
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
            if(!row.device_id && !row.device && this.$route.query.testRecordName.indexOf('端游') == -1){
                return this.$message.warning("该记录还没有选择测试设备，请先点击预分配机型进行设备选择")
            }
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
        editPicture(row, questionId){
            let path = this.$route.path
            let test_type = '10'
            let isPC = false
            if(path.indexOf('PC') !== -1){
                isPC = true
                test_type = '11'
            }
            let list = {
                table_name: this.axiosList.table_name,
                project: this.projectCode,
                id: row.id,
                question_id: questionId,
                isPC: isPC,
                test_type: test_type
            }
            // console.log(row.pic_info)
            this.$refs.editPictureRef.editPicture(list, row.pic_info[questionId]);
        },

        getPicUrl(row, index, pic) {
            let arr = pic.map((value, index) => {
                return value.pic_url;
            });
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
        async getPath(href) {
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
</style>