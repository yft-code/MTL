<template>
    <div class="self-table">   
        <edit-picture ref="editPictureRef" confirm-type="directAxios" @afterEdit="getTableData"/> 
        <send-report ref="sendReportRef" :axiosList="axiosList" />
        <!--{{tableList.columnData}}-->
        <el-table 
            ref="elTableRef"
            :data="tableData"  
            style="width: 100%"
            :stripe="!this.tableList.backgroundJudgeByStatus"
            :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
            v-loading="isLoading"
            :max-height="tableHeight"
            :row-class-name="tableRowClassName"
            @sort-change="sortTable" 
            >
            <el-table-column
                v-for="(item,index) in tableList.columnData"
                :key="index"
                :prop="item.propName"
                :label="item.titleName"
                :sortable="item.sortFlag ? 'custom' : false"
                :min-width="item.minWidth"
                :align="item.align || 'center'"
                :fixed="item.fixed || false"
                >
                <template slot="header" slot-scope="scope">
                    <div v-if="item.propName == 'test_type'">   
                        
                        <el-select v-if="testTypeShow" v-model="testTypeValue" placeholder="选择测试类型" @change="testTypeChange" size="small">
                            <el-option v-for="item,i in testTypeOption" :label="item.label" :value="item.value" :key="i"></el-option>
                            <el-option label="全部" value=""></el-option>
                        </el-select>
                        <span v-else @click="testTypeShow=!testTypeShow" style="cursor:pointer">测试类型</span>
                    </div>
                    <div v-else>{{item.titleName}}</div>
                </template>
                <template slot-scope="scope">
                    <div v-if="item.type == 'reason'">
                        <!-- <span :style="{ color: item.propName in scope.row.not_pass_reason.split(',') ? 'red' : ''}">{{scope.row[item.propName]}}--</span> -->
                        <span :style="{ color: getColor(item, scope.row)}">{{scope.row[item.propName]}}</span>
                        <!-- <span style="color: red;">{{scope.row[item.propName]}}--</span> -->
                        <!-- {{scope.row[item.propName]}} -->
                    </div>

                    <div v-else-if="item.type == 'normal' && item.propName == 'test_type'">
                        {{ testTypeDictVerse[scope.row[item.propName]] }}
                    </div>

                    <div v-else-if="item.propName == 'q_level'">
                        P{{ scope.row[item.propName] }}
                    </div>

                    <div v-else-if="item.propName == 'index'">
                        {{ scope.$index + 1 }}
                    </div>

                    <!-- 查看申请详情 -->
                    <div v-else-if="item.propName == 'testDetail'">
                        <el-button type="text" @click="viewDetail(scope.row)">查看</el-button>
                    </div>
                    
                    <!-- 查看报告详情 -->
                    <div v-else-if="item.propName == 'testReport'">
                        <el-button type="text" v-if="scope.row.test_status == '1' || scope.row.test_status == '2'" @click="viewReport(scope.row)">查看</el-button>
                    </div>

                    <div v-else-if="item.propName == 'test_status'">
                        <!-- <span v-if="scope.row.qa_list.indexOf(userEmail) !== -1 || scope.row.qa_excutor.indexOf(userEmail) !== -1" :class="'test-status-span status-' + scope.row.test_status">
                            {{ scope.row.test_status_name }}
                        </span>
                        <el-select 
                            v-else 
                            :class="'status-' + scope.row.test_status"
                            v-model="scope.row.test_status" 
                            placeholder="请选择" 
                            size="mini" 
                            @change="changeStatus(scope.row)"
                            >
                            <el-option 
                                v-for="(statusItem, statusIndex) in testStatusList" 
                                :key="index + '_status_' + statusIndex" 
                                :label="statusItem.label" 
                                :value="statusItem.value"
                            ></el-option>
                        </el-select> -->
                        <div v-if="scope.row.qa_list.indexOf(userEmail) !== -1 || isAdmin">
                            <el-select 
                                :class="'status-' + scope.row.test_status"
                                v-model="scope.row.test_status" 
                                placeholder="请选择" 
                                size="mini" 
                                @change="changeStatus(scope.row)"
                                >
                                <el-option 
                                    v-for="(statusItem, statusIndex) in testStatusList" 
                                    :key="index + '_status_' + statusIndex" 
                                    :label="statusItem.label" 
                                    :value="statusItem.value"
                                ></el-option>
                            </el-select>
                        </div>
                        <div v-else>
                            <span v-if="scope.row.test_status === '0'" :class="'test-status-span status-' + scope.row.test_status">未开始</span>
                            <span v-if="scope.row.test_status === '1'" :class="'test-status-span status-' + scope.row.test_status">测试中</span>
                            <span v-if="scope.row.test_status === '2'" :class="'test-status-span status-' + scope.row.test_status">已完成</span>
                            <span v-if="scope.row.test_status === '3'" :class="'test-status-span status-' + scope.row.test_status">已忽略</span>
                        </div>
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
                    

                    <div v-else-if="item.propName == 'qa_list'">
                        <!-- <el-button @click="alert(this.isTester)">test</el-button> -->
                        <div v-if="qaObject[scope.row.test_type].popo.indexOf(userEmail) == -1 && !isAdmin">
                            <span v-for="(qaEmail, qaIndex) in scope.row.qa_list" :key="index + '_' + qaIndex">
                                {{ personNameList[qaEmail] || qaEmail }}
                                <self-popo :email="qaEmail"/>
                            </span>
                        </div>
                        <div v-else>
                            <el-select 
                                v-model="scope.row.qa_list" 
                                placeholder="请选择测试人员"
                                multiple
                                @change="changeQa(scope.row)"
                                filterable 
                                size="mini"
                                >
                                <el-option
                                    v-for="item in qaList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </div>
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
                        <a v-if="scope.row.log_file" class="blue-span" :href="getPath(scope.row.log_file)" target="_blank">下载</a>
                    </div>

                    <div v-else-if="item.propName == 'if_pass'">
                        <span :style="{ color: scope.row.if_pass == '不通过' ? 'red' : ''}">{{ scope.row.if_pass }}</span>
                    </div>

                    <div v-else-if="item.propName == 'q_description'">
                        <span>{{ scope.row.q_description }}</span>
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
                            v-if="item.canEditCaseQuestion" 
                            type="primary" 
                            size="mini"
                            @click="editCaseQuestion(scope.row)"
                        >编辑</el-button>
                        <el-button 
                            v-if="item.canDeleteCaseQuestion" 
                            type="danger"  
                            size="mini" 
                            @click="deleteCaseQuestion(scope.row)"
                        >删除</el-button>
                        <a 
                            v-if="item.canStartTest && isTester && !$checkStrIsNull(scope.row.report_table)" 
                            :href="'/expertCompatibility/page/startTest?project='+projectCode+'&testRecordName='+scope.row.report_table" 
                            target="_blank"
                            class="el-button el-button--primary el-button--mini"
                        >开始测试</a>
                        <el-button 
                            v-else-if="(item.canStartTest && scope.row.qa_list.indexOf(userEmail) !== -1) || isAdmin" 
                            type="primary" 
                            size="mini" 
                            @click="startTest(scope.row)"
                        >开始测试</el-button>
                        <el-button 
                            v-else-if="item.canStartTest && scope.row.qa_excutor.indexOf(userEmail) !== -1" 
                            type="primary"
                            size="mini"
                            @click="startTest(scope.row)"
                            >
                            开始测试
                        </el-button>
                        <!-- <el-button 
                            v-if="item.canSendReport && (scope.row.qa_list.indexOf(userEmail) !== -1 || scope.row.qa_excutor.indexOf(userEmail) !== -1) && scope.row.test_report_title && scope.row.test_report_title != ''" -->
                        <el-button 
                            v-if="item.canSendReport && (scope.row.qa_list.indexOf(userEmail) !== -1 || scope.row.qa_excutor.indexOf(userEmail) !== -1 || isAdmin)"  
                            type="warning" 
                            size="mini" 
                            @click="sendReport(scope.row)"
                        >发送报告</el-button>
                        <!-- <el-button 
                            v-if="item.canReTest"
                            size="mini"
                            @click="restartTest(scope.row)"
                            >
                            复测
                            <el-tooltip effect="light" content="复测功能会生成新的测试任务单，复用当前测试任务的申请信息，支持编辑修改" placement="top">
                                <i class="el-icon-info" style="color:#606266;margin-left:3px"></i>
                            </el-tooltip>
                        </el-button> -->
                        <el-button 
                            v-if="item.canEditTestContent && scope.row.test_qa == userEmail" 
                            type="primary" 
                            size="mini" 
                            @click="editTestContent(scope.row)"
                        >录入数据</el-button>
                        <el-button 
                            v-if="item.canEditTestContent" 
                            type="primary" 
                            size="mini" 
                            @click="editTestContent(scope.row)"
                        >编辑</el-button>
                        <!-- <el-button 
                            v-if="item.canDeleteTestContent" 
                            type="danger"  
                            size="mini" 
                            @click="deleteTestContent(scope.row)"
                        >删除</el-button> -->
                        <el-button 
                            v-if="currentQaAdmin && currentQaAdmin.indexOf(userEmail) !== -1" 
                            type="danger"  
                            size="mini" 
                            @click="deleteTestContent(scope.row)"
                        >删除</el-button>
                    </div>

                    <div v-else>{{scope.row[item.propName]}}</div>
                </template>
            </el-table-column>
        </el-table> 
        <el-pagination 
            v-if="tableList.tableTotalKey != undefined"
            class="pagination" 
            style="margin-top:0.5rem" 
            background 
            align="right" 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :page-sizes="[2, 5, 10, 15, 50, 100]" 
            :page-size="tableKeyList.rows" 
            :current-page="tableKeyList.page" 
            layout="prev, pager, next, jumper, sizes, total" 
            :total="sizeTotal">
        </el-pagination>

        <!-- 登记工时对话框 -->
        <el-dialog 
            title="工时登记" 
            :visible="workTimeDialogVisible"
            width="30%"
            >
            <el-input v-model="work_time" placeholder="请输入工时" type="number" style="width: 75%; margin-right:8px; margin-left:20px"></el-input>小时
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="setWorkTime">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import $ from "jquery"
import EditPicture from "./EditPicture"
import SendReport from "./SendReport"
import SelfPopo from './SelfPopo.vue'
import SelfPersonSelect from './SelfPersonSelect.vue'
export default {
    components: {
        EditPicture,
        SendReport,
        SelfPopo,
        SelfPersonSelect
    },
    props: {
        axiosList: {
            required: true,
            type: Object
        },
        tableList: {
            required: true,
            type: Object
        },
        tableType:{
            type: String
        },
        currentQaAdmin: {},
    },
    data() {
        return {
            fileSuffix: '/static/',
            testTypeDictVerse:{},
            tableHeight: 500,
            isLoading: true,
            tableKeyList: {
                page: 1,
                rows: 15,
                sort: "device_id",
                order: "",
            },
            tableData: [],
            personNameList: {},
            sizeTotal: 0,
            testStatusList: [
                {
                    label: '未开始',
                    value: 0
                },
                {
                    label: '测试中',
                    value: 1
                },
                {
                    label: '已完成',
                    value: 2
                },
                {
                    label: '已忽略',
                    value: 3
                },
            ],
            qaList: [],
            recordQuestionlist: {},
            isEditingQa: {},
            work_time: 0,
            workTimeDialogVisible: false,
            workId: '',
            current_row: null,
            testTypeShow: false,
            qaObject: {
                '10': {
                    name: [],
                    popo: [],
                },
                '11': {
                    name: [],
                    popo: [],
                },
                '20': {
                    name: [],
                    popo: [],
                },
                '21': {
                    name: [],
                    popo: [],
                },
                '22': {
                    name: [],
                    popo: [],
                },
                '23': {
                    name: [],
                    popo: [],
                },
                '30': {
                    name: [],
                    popo: [],
                },
                '5': {
                    name: [],
                    popo: [],
                },
                '8': {
                    name: [],
                    popo: [],
                },
                '00': {
                    name: [],
                    popo: [],
                }
            },
            testTypeShow: false,
            testTypeValue: "",
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
        isAdmin() {
            return this.$store.getters.getIsAdmin
        },
        testTypeOption(){
            return this.$store.getters.getTestTypeOption
        },
    },
    created() {
        if(this.$route.path.split('/')[this.$route.path.split('/').length - 1] == 'myMission'){
            this.reverseTestTypeDict()
            this.getDefaultQa()
        }
        // console.log(this.tableList.defaultRows)
        if (this.tableList.defaultRows) {
            this.tableKeyList.rows = this.tableList.defaultRows;
        }
        //获取qa选项列表
        if (this.tableList.needQaList) {
            // console.log(0)
            this.getQaList();
        }
        //获取状态选项列表
        if(this.tableList.needStatusList) {
            this.getStatusList();
        }
        this.getTableData();
    },
    mounted() {
        this.$nextTick(function() {
            this.resizeTable();
            // 监听窗口大小变化
            let _this = this;
            window.onresize = function() {
                _this.resizeTable();
            }
        })
        this.testTypeShow = false
    },
    destroyed() {
        window.onresize = "";
    },
    methods: {
        testTypeChange(val){
            if(val == ''){
                this.testTypeShow = ! this.testTypeShow
            }
            let list = {
                page: 1,
                rows: 10,
                project: this.$store.getters.getProjectCode || this.$route.query.project,
                sort: "",
                order: "",
                test_type: val
            }
            this.$codePost("/service/"+ this.tableList.postApp +"/", list, { operation: "获取数据", failed: true }).then(res => {
                if (res.code == 200) {
                    this.tableData = res.data.res
                    this.sizeTotal = res.data.res_num
                    // this.testTypeShow = ! this.testTypeShow
                }
            })
        },
        getDefaultQa(){
            this.$codePost("/service/get_reminder/").then(res => {
                if (res.code == 200) {
                    for(let k in res.data){
                        this.qaObject[k].popo = res.data[k].popo.split(',')
                    }
                }
            })
        },
        // 申请详情页查看报告
        viewReport(item) {
            // console.log(item)
            let test_type_name = this.getTestTypeName(item.test_type)
            let url = '/mtl_test_platform/page/'+ test_type_name +'TestReport?project=' + this.projectCode + '&applicationId=' + item.id + '&testRecordName=' + item.content_name
            // console.log(url)
            window.open(url, '_blank')
        },

        reverseTestTypeDict(){
            let reverseDict = {}
            for(let k in this.testTypeDict){
                reverseDict[this.testTypeDict[k]] = k
            }
            this.testTypeDictVerse = reverseDict
        },

        // 申请列表页查看申请详情
        viewDetail(item){
            // console.log(item)
            // 这里需要根据测试类型跳转到相应的页面，首先获取所对应测试的英文名称
            const test_type_name = this.getTestTypeName(item.test_type)
            // console.log(this.getTestTypeName('21'))
            // console.log(test_type_name)
            let url = '/mtl_test_platform/page/'+ test_type_name + 'TestDetail?id=' + item.id + '&test_type=' + item.test_type + '&table_name=' + item.content_name
            // console.log(url)
            this.$router.push(url);
        },

        customColorMethod(percentage) {
            if (percentage < 30) {
                return '#ff3333';
            } else if (percentage < 70) {
                return '#e6a23c';
            } else {
                return '#67c23a';
            }
        },

        getTestTypeName(test_type){
            let test_type_name = ''

            for (var k in this.testTypeDict) {
                if(this.testTypeDict[k] === test_type){
                    test_type_name = k
                }
            }
            return this.serviceTypeOption[test_type_name]
        },

        getColor(item, row){
            // row.not_pass_reason.split(',').indexOf(item.propName)
            // console.log(row.not_pass_reason.split(',').indexOf(item.propName))
            let index = row.not_pass_reason.split(',').indexOf(item.propName)
            if(index != -1){
                return 'red'
            }
            return ''
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

        //设置行class
        tableRowClassName({row, rowIndex}){
            if(this.tableList.backgroundJudgeByStatus){
                return "application-status-" + row.test_status;
            }else{
                return "";
            }
            
        },

        //获取qa列表
        getQaList() {
            // console.log(1)
            this.$codePost("/service/get_qa_list/").then(res => {
                if (res.code == 200) {
                    this.qaList = res.data;
                }
            })
        },
        cancel(){
            this.current_row.test_status = '1'
            let list ={
                id: this.current_row.id,
                test_status: this.current_row.test_status
            }
            this.update(list, "修改测试状态")
            this.work_time = 0
            this.current_row = null
            this.getTableData()
            this.workTimeDialogVisible = false
        },

        setWorkTime(){
            this.current_row.work_time = this.work_time
            this.$codePost("/service/update_application_worktime/", this.current_row).then(res => {
                if (res.code !== 200) {
                    this.$message.error(res.msg)
                    this.cancel()
                }else{
                    let list ={
                        id: this.current_row.id,
                        test_status: this.current_row.test_status
                    }
                    this.update(list, "修改测试状态")
                    this.getTableData()
                    this.work_time = 0
                    this.current_row = null
                    this.workTimeDialogVisible = false
                }        
            })
        },

        restartTest(row){
            // console.log("复测", row)
            let test_type_name = this.getTestTypeName(row.test_type)
            test_type_name = test_type_name.slice(0,1).toUpperCase() +test_type_name.slice(1).toLowerCase()
            const url = '/mtl_test_platform/page/expertServices/reTest'+ test_type_name +'Application?project=' + this.projectCode + '&id=' + row.id + '&test_type=' + row.test_type + '&table_name=' + row.content_name
            // console.log(url)
            this.$router.push(url);
        },

        //获取状态数组
        getStatusList(){
            this.$codePost("/expertCompatibility/get_expert_test_status/").then(res => {
                if (res.code == 200) {
                    this.testStatusList = res.data;
                }
            })
        },

        getPicUrl(row, index, pic) {
            let arr = pic.map((value, index) => {
                return value.pic_url;
            })
            return arr;
        },
        
        downloadFile(href) {
            this.$publicJS.downloadFile(this, href);
        },

        //调整表格高度
        resizeTable() {
            let tableHeight = window.innerHeight - this.$refs.elTableRef.$el.offsetTop - 45;
            if (this.tableList.tableTotalKey != undefined) {
                tableHeight = tableHeight - 45;
            }
            if (tableHeight < 200) {
                tableHeight = 200;
            }
            this.tableHeight = tableHeight;
            //处理表格渲染错位的问题（当resize时，表头高度发生变化，固定列的表头和普通表头可能高度不一致）
            this.$refs.elTableRef.doLayout();
        },

        //排序
        sortTable(column) {
            this.tableKeyList.sort = column.prop;
            this.tableKeyList.order = column.order == 'ascending' ? 'asc' : 'desc';
            this.getTableData();
        },

        //切换分页显示几条数据
        handleSizeChange(val) {
            this.tableKeyList.page = 1;
            this.tableKeyList.rows = val;
            this.getTableData();
        },

        //切换页码
        handleCurrentChange(val) {
            this.tableKeyList.page = val;
            this.getTableData();
        },

        //获取表格数据
        getTableData() {
            this.isLoading = true;
            let list = JSON.parse(JSON.stringify(this.axiosList));
            let sortKeyName = "sort";
            if (this.tableList.sortKey != undefined) {
                sortKeyName = this.tableList.sortKey;
            }
            if(list.project != undefined){
                list.project = 'all'
            }
            list[sortKeyName] = this.tableKeyList.sort;
            list.order = this.tableKeyList.order;
            if (this.tableList.tableTotalKey != undefined) {
                list.page = this.tableKeyList.page;
                list.rows = this.tableKeyList.rows;
            }
            list.test_type = this.testTypeValue
            if(this.tableList.postAppPrefix){
                this.$codePost('/'+ this.tableList.postAppPrefix +'/' + this.tableList.postApp + '/', list, { operation: "获取数据", failed: true }).then(res => {
                    if (res.code == 200) {
                        if (this.tableList.tableTotalKey != undefined) {
                            this.tableData = res.data[this.tableList.tableDataKey];
                            this.personNameList = res.data.user || {};
                            this.sizeTotal = res.data[this.tableList.tableTotalKey];
                            if(this.tableData.length == 0 && this.tableKeyList.page != 1){
                                //如果表格数据为空，且当前不是第一页，切换到第一页
                                this.tableKeyList.page = 1;
                                this.getTableData();
                            }else{
                                this.afterGetTable(res.data);
                            }
                        } else {
                            this.tableData = res[this.tableList.tableDataKey];
                            this.afterGetTable(res.data);
                        }
                    }
                })
                this.isLoading = true;
            }else{
                this.$codePost('/service/' + this.tableList.postApp + '/', list, { operation: "获取数据"}).then(res => {
                    if (res.code == 200) {
                        if (this.tableList.tableTotalKey != undefined) {
                            this.tableData = res.data[this.tableList.tableDataKey];
                            this.personNameList = res.data.user || {};
                            this.sizeTotal = res.data[this.tableList.tableTotalKey];
                            if(this.tableData.length == 0 && this.tableKeyList.page != 1){
                                //如果表格数据为空，且当前不是第一页，切换到第一页
                                this.tableKeyList.page = 1;
                                this.getTableData();
                            }else{
                                this.afterGetTable(res.data);
                            }
                        } else {
                            this.tableData = res[this.tableList.tableDataKey];
                            this.afterGetTable(res.data);
                        }
                    }
                })
                this.isLoading = true;
            }
        },

        //获取到表格数据后
        afterGetTable(data){
            if (this.tableList.needGetRecordQuestionlist) {
                this.recordQuestionlist = data.question_data;
            }
            //父组件可能在获取表格后还有特殊操作，把数据给父亲处理
            this.$emit("afterGetTable", data);
            this.isLoading = false;
        },

        //编辑用例问题
        editCaseQuestion(row) {
            this.$emit("editCaseQuestion", row);
        },

        //删除问题
        deleteCaseQuestion(row) {
            this.$emit("deleteCaseQuestion", row);
        },

        // 修改测试状态
        changeStatus(item){
            if(item.qa_list.length === 0 && item.test_status !== '0' && item.test_status !== '3'){
                this.$message.warning('接口人为空不能修改测试状态为测试中或已完成')
                this.getTableData()
            }
            else if(item.test_status === '2'){
                this.workId = item.id
                this.current_row = item
                // 登记接口人的工时
                this.work_time = item.work_time
                this.workTimeDialogVisible = true
            }else{
                let list ={
                    id: item.id,
                    test_status: item.test_status
                }
                this.update(list, "修改测试状态")
            }
        },

        update(item, msg) {
            this.$codePost("/service/update_application_process/", item, { operation: msg, failed: true }).then(res => {
                if (res.code !== 200) {
                    this.$message.error(res.msg)
                }
                this.getTableData()
            })
        },

        //MTL接口人选择框显示隐藏事件
        qaSelectVisibleChange(event, row){
            if(event) {
                //展开选择MTL接口人下拉选项
                this.isEditingQa[row.id] = row.qa_list.join(",");
            } else {
                //隐藏
                if(this.isEditingQa[row.id] != row.qa_list.join(",")) {
                    //qa值发生变化时，触发修改
                    this.changeQa(row);
                }
            }
        },

        //修改MTL接口人
        changeQa(item) {
            let qa_str = ''
            item.qa_list.forEach((each, index) => {
                qa_str = qa_str + each
                if(index !== item.qa_list.length - 1) qa_str = qa_str + ','
            })
            item.qa = qa_str
            let list = {
                id: item.id,
                qa: item.qa,
            }
            this.update(list, "修改测试接口人")
        },

        //开始测试，生成测试记录表--申请记录页面
        startTest(item){
            if(item.qa_list == null || typeof(item.qa_list) != "object") {
                // 当前申请没有MTL接口人
                this.$message.error("请先填写MTL接口人")
            } else if(item.qa_list.length == 0){
                this.$message.error("请先填写MTL接口人")
            } else {
                this.$store.commit("setPageIsLoading", true);
                let list = { id: item.id, project_name: item.project_name };

                // 手游专家兼容性
                if(item.test_type == '10'){
                    this.$codePost("/expertCompatibility/expert_test_start/", list, { operation: "开始测试", failed: true }).then(res => {
                        if (res.code == 200) {
                            this.getTableData();
                            let href = `/mtl_test_platform/page/compatibilityStartTest?project=${this.projectCode}&testRecordName=${res.data}&id=${item.id}&test_type=${item.test_type}`;
                            window.open(href, "_blank");
                        }
                        this.$store.commit("setPageIsLoading", false);
                    })
                }
                // 端游专家兼容性
                else if(item.test_type == '11'){
                    this.$codePost("/expertCompatibilityPC/expert_test_start/", list, { operation: "开始测试", failed: true }).then(res => {
                        if (res.code == 200) {
                            this.getTableData();
                            let href = `/mtl_test_platform/page/compatibilityStartTestPC?project=${this.projectCode}&testRecordName=${res.data}&id=${item.id}&test_type=${item.test_type}`;
                            window.open(href, "_blank");
                        }
                        this.$store.commit("setPageIsLoading", false);
                    })
                }
                // 手游性能
                else if(item.test_type == '20'){
                    this.$codePost("/mobilePerfTest/expert_test_start/", list, { operation: "开始测试", failed: true }).then(res => {
                        if (res.code == 200) {
                            this.getTableData();
                            let href = `/mtl_test_platform/page/performanceStartTest?project=${this.projectCode}&testRecordName=${res.data}&id=${item.id}&test_type=${item.test_type}`;
                            window.open(href, "_blank");
                        }
                        this.$store.commit("setPageIsLoading", false);
                    })
                }

                // 端游性能
                else if(item.test_type == '21'){
                    this.$codePost("/pcPerfTest/expert_test_start/", list, { operation: "开始测试", failed: true }).then(res => {
                        if (res.code == 200) {
                            this.getTableData();
                            let href = `/mtl_test_platform/page/performanceStartTestPC?project=${item.project}&testRecordName=${res.data}&id=${item.id}&test_type=${item.test_type}`;
                            window.open(href, "_blank");
                        }
                        this.$store.commit("setPageIsLoading", false);
                    })
                }

                // 手游弱网
                else if(item.test_type == '22'){
                    this.$codePost("/mobileWeaknetTest/expert_test_start/", list, { operation: "开始测试", failed: true }).then(res => {
                        if (res.code == 200) {
                            this.getTableData();
                            let href = `/mtl_test_platform/page/weaknetStartTest?project=${this.projectCode}&testRecordName=${res.data}&id=${item.id}&test_type=${item.test_type}`;
                            window.open(href, "_blank");
                        }
                        this.$store.commit("setPageIsLoading", false);
                    })
                }

                // 端游弱网
                else if(item.test_type == '23'){
                    this.$codePost("/pcWeaknetTest/expert_test_start/", list, { operation: "开始测试", failed: true }).then(res => {
                        if (res.code == 200) {
                            this.getTableData();
                            let href = `/mtl_test_platform/page/weaknetPCStartTest?project=${this.projectCode}&testRecordName=${res.data}&id=${item.id}&test_type=${item.test_type}`;
                            window.open(href, "_blank");
                        }
                        this.$store.commit("setPageIsLoading", false);
                    })
                }

                // 协议
                else if(item.test_type == '30'){
                    // console.log(item)
                    let href = `/mtl_test_platform/page/protocolStartTest?project=${this.projectCode}&testRecordName=${item.content_name}&id=${item.id}&test_type=${item.test_type}`;
                    window.open(href, "_blank");
                }
                
            }
        },

        //发送报告
        sendReport(item){
            // console.log(item)
            if(item.test_status === '0') {
                return this.$message.error("还没开始进行测试，请先完成测试")
            }
            if(item.test_status === '3') {
                return this.$message.error("该测试申请已忽略")
            }
            if(!item.test_report_title || item.test_report_title === ""){
                return this.$message.error("请去报告页编辑测试项进行审核")
            }
            let test_type_name = this.getTestTypeName(item.test_type)
            // console.log(test_type_name)
            if(test_type_name == 'compatibilityPC'){
                // 后两个参数分别是：报告页面url、接口url
                this.$refs.sendReportRef.sendReport(item, "page/compatibilityPCReport", "expertCompatibilityPC");
            }else if(test_type_name == 'compatibility'){
                this.$refs.sendReportRef.sendReport(item, "page/compatibilityReport", "expertCompatibility");
            }else if(test_type_name == 'performance'){
                this.$refs.sendReportRef.sendReport(item, "page/performanceReport", "mobilePerfTest");
            }else if(test_type_name == 'performancePC'){
                this.$refs.sendReportRef.sendReport(item, "page/performancePCReport", "pcPerfTest");
            }else if(test_type_name == 'weaknet'){
                this.$refs.sendReportRef.sendReport(item, "page/weaknetReport", "mobileWeaknetTest");
            }else if(test_type_name == 'protocol'){
                this.$refs.sendReportRef.sendReport(item, "page/protocolReport", "protocolTest");
            }
        },

        //编辑测试内容
        editTestContent(row) {
            this.$emit("editTestContent", row);
        },

        //删除测试内容
        deleteTestContent(row) {
            this.$emit("deleteTestContent", row);
        },

        //编辑图片
        editPicture(row, questionId){
            let isPC = false
            let test_type = '10'
            if(this.tableList.postAppPrefix == 'expertCompatibilityPC'){
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
            this.$refs.editPictureRef.editPicture(list, row.pic_info[questionId]);
        },

    },

}
</script>

<style scoped>
.self-table>>>.el-table tr.application-status-0,
.self-table>>>.el-table tr.application-status-0.hover-row>td{
    background: #FAEAEA;
}

.self-table>>>.el-table tr.application-status-1,
.self-table>>>.el-table tr.application-status-1.hover-row>td{
    background: #DBFAFA;
}

.self-table>>>.el-table tr.application-status-2,
.self-table>>>.el-table tr.application-status-2.hover-row>td{
    background: #DEF7D6;
}

.self-table>>>.el-table tr.application-status-3,
.self-table>>>.el-table tr.application-status-3.hover-row>td{
    background: #ddd;
}

.self-table>>>.el-table .caret-wrapper{
    white-space: nowrap;
}

.test-status-span {
    border: 1px solid;
    display: inline-block;
    padding: 0 0.5rem;
    border-radius: 3px;
}

.status-0,
.status-0>>>.el-input__inner {
    color: #ff557d;
    border-color: #ff557d;
}

.status-1,
.status-1>>>.el-input__inner {
    color: #4876f2;
    border-color: #4876f2;
}

.status-2,
.status-2>>>.el-input__inner {
    color: #00b67c;
    border-color: #00b67c;
}

.status-3,
.status-3>>>.el-input__inner {
    color: #90939a;
    border-color: #90939a;
}

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
</style>