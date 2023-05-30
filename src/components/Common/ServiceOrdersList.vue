<template>
    <!-- 新版 -->
    <div class="service-orders-list">
        <div class="list-title">{{serviceData.label}}</div>
        <div class="list-container"> 
            <div class="table-tool-bar">
                <el-tabs 
                    class="record-tabs"
                    style="float: left" 
                    v-model="tableAxiosList.my_task" 
                    @tab-click="changeMyTask"
                >
                    <el-tab-pane label="全部申请" name="0"></el-tab-pane>
                    <el-tab-pane label="我的申请" name="1"></el-tab-pane>
                    <el-tab-pane label="2023.02.14前申请记录" name="old"></el-tab-pane>
                </el-tabs>
                <el-input
                    placeholder="请输入内容"
                    suffix-icon="el-icon-search"
                    clearable
                    v-model="tableKeyList.key"
                    @keyup.native.enter="getTableData"
                    @blur="searchBlur"
                    @clear="getTableData"
                ></el-input>
            </div>
            <el-table 
                ref="serviceOrdersListTable"
                v-loading="isLoading"
                :data="tableData" 
                :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
                :row-class-name="tableRowClassName"
                @sort-change="sortTable"
            >
                <el-table-column
                    prop="applicant"
                    label="申请人"
                    :sortable="true"
                    align="center"
                    width="100px"
                >
                    <template v-slot="scope">
                        <span>{{ scope.row.applicant_name || scope.row.applicant }}</span>
                        <self-popo v-if="!$checkStrIsNull(scope.row.applicant)" :email="scope.row.applicant"/>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="project"
                    label="项目代号"
                    :sortable="true"
                    align="center"
                    width="95px"
                ></el-table-column>
                <el-table-column
                    prop="test_type"
                    align="center"
                >
                    <template slot="header">
                        <span 
                            v-if="!testTypeShow" 
                            style="cursor:pointer"
                            @click="testTypeShow=!testTypeShow" 
                        >
                            测试类型
                        </span>
                        <el-select 
                            v-else
                            placeholder="选择测试类型"
                            size="small"  
                            v-model="testTypeValue" 
                            @change="testTypeChange"    
                        >
                            <el-option 
                                v-for="item,i in testTypeOption"
                                :key="i" 
                                :label="item.label" 
                                :value="item.value"
                            />
                            <el-option label="全部" value=""></el-option>
                        </el-select>
                    </template>
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.test_type === '10'">兼容性测试-手游</el-tag>
                        <el-tag v-if="scope.row.test_type === '11'" >兼容性测试-端游</el-tag>
                        <el-tag v-if="scope.row.test_type === '20'" >性能测试-手游</el-tag>
                        <el-tag v-if="scope.row.test_type === '21'" >性能测试-端游</el-tag>
                        <el-tag v-if="scope.row.test_type === '8'" >隐私合规</el-tag>
                        <el-tag v-if="scope.row.test_type === '22'" >弱网测试-手游</el-tag>
                        <el-tag v-if="scope.row.test_type === '23'" >弱网测试-端游</el-tag>
                        <el-tag v-if="scope.row.test_type === '30'" >协议测试</el-tag>
                        <el-tag v-if="scope.row.test_type === '5'" >预审服务</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="test_reason"
                    label="测试原因"
                    align="center"
                    :sortable="true"
                ></el-table-column>
                <el-table-column
                    prop="end_date"
                    label="最迟报告日期"
                    align="center"
                    :sortable="true"
                ></el-table-column>
                <el-table-column
                    label="详细信息"
                    align="center"
                    >
                    <template slot-scope="scope">
                        <el-button type="text" @click="viewDetail(scope.row)">查看</el-button>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="test_status"
                    label="测试进度"
                    align="left"
                    :sortable="true"
                    >
                    <template slot-scope="scope">
                        <el-progress 
                            :stroke-width="8" 
                            :percentage="scope.row.test_progress" 
                            :color="customColorMethod"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="qa_list"
                    label="MTL接口人"
                    align="center"
                    width="140"
                    >
                    <template slot-scope="scope">
                        <div v-if="qaObject[scope.row.test_type].popo.indexOf(userEmail) !== -1">
                            <el-select  
                                placeholder="请选择测试人员"
                                multiple
                                filterable
                                size="small"
                                v-model="scope.row.qa_list"
                                @change="changeTester(scope.row)"
                                >
                                <el-option
                                    v-for="item in testerOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </div>
                        
                        <div v-else>
                            <span v-if="scope.row.tester == ''"></span>
                            <span v-else>
                                <span v-for="qa,i in scope.row.qa.split(',')" :key="i">
                                    {{testerOption.filter(item => item.value == qa)[0] ? testerOption.filter(item => item.value == qa)[0].label: qa}}
                                    <self-popo v-if="!$checkStrIsNull(qa)" :email="qa"/>
                                </span>
                            </span>
                            
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="测试报告"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.test_status == '1' || scope.row.test_status == '2'"  
                            type="text" 
                            @click="viewReport(scope.row)"
                        >
                            查看
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    fixed="right"
                    width="150px"
                    >
                    <template slot-scope="scope">
                        <el-button 
                            size="mini"
                            @click="restartTest(scope.row)"
                        >
                            复测
                            <el-tooltip effect="light" content="复测功能会生成新的测试任务单，复用当前测试任务的申请信息，支持编辑修改" placement="top">
                                <i class="el-icon-info" style="color:#606266;margin-left:3px"></i>
                            </el-tooltip>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table> 
        </div>
        <div class="list-footer">
            <el-pagination 
                class="pagination" 
                style="margin-top:0.5rem" 
                background 
                align="right"
                layout="prev, pager, next, jumper, sizes, total"  
                :page-sizes="[2, 5, 10, 15, 20, 50]" 
                :page-size="tableKeyList.rows" 
                :current-page="tableKeyList.page" 
                :total="total"
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" 
            >
            </el-pagination>
        </div>

        <!-- 登记工时对话框 -->
        <el-dialog 
            title="工时登记" 
            width="30%"
            :visible="workTimeDialogVisible"
            @close="cancel"
        >
            <el-input 
                placeholder="请输入工时" 
                style="width: 75%; margin-right:8px; margin-left:20px"
                v-model="work_time" 
            />小时
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="setWorkTime">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 发送报告页面 -->
        <send-report ref="sendReportRef" :axios-list="table-axios-list" />
    </div>
</template>
<script>
import SelfTable from "@/components/Common/SelfTable.vue"
import SelfPopo from "@/components/Common/SelfPopo.vue"
import SendReport from '@/components/Common/SendReport.vue'
import {getTestApply} from '@/api/workStation/ServiceOrdersList'
import { getReminder,getQaList} from '@/api/workStation/common'
import {updateApplicationWorktime,expertTestStart,expertTestStartPc,mobilePerfTest,
        pcPerfTest,mobileWeaknetTest} from '@/api/common'
    export default {
        components: {
            SelfTable,
            SelfPopo,
            SendReport
        },
        data() {
            return {
                lastSearchValue: "",
                tableKeyList: {
                    page: 1,
                    rows: 10,
                    project: '',
                    sort: "",
                    order: "",
                    key: "",
                    my_task: 0
                },
                total: 0,
                lastSearchValue: "",
                tableAxiosList: {
                    project: "",
                    key: "",
                    my_task: 0,
                },
                isLoading: false,
                tableData: [],
                statusOption: [
                    {
                        label: '未开始',
                        value: '0'
                    },
                    {
                        label: '测试中',
                        value: '1'
                    },
                    {
                        label: '已完成',
                        value: '2'
                    },
                    {
                        label: '已忽略',
                        value: '3'
                    },
                ],
                testerOption: [],
                filterValue: '',
                work_time: 0,
                workTimeDialogVisible: false,
                workId: '',
                current_row: null,
                testTypeShow: false,
                testTypeValue: "",
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
            }
        },
        props:{
            serviceData: {}
        },
        created(){
            if(this.$store.getters.getProjectCode){
                this.tableKeyList.project = this.$store.getters.getProjectCode
            }else if(this.$route.query.project){
                this.tableKeyList.project = this.$route.query.project
            }
            this.getDefaultQa()
            this.getQaList()
            this.getTableData()
        },
        mounted(){
            
        },
        computed:{
            projectCode() {
                return this.$store.getters.getProjectCode;
            },
            isTester () {
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
            testTypeOption(){
                return this.$store.getters.getTestTypeOption
            },
        },
        watch:{
        },
        methods:{
            async getDefaultQa(){
                let res = await getReminder({},{})
                if (res.code == 200) {
                    for(let k in res.data){
                        this.qaObject[k].popo = res.data[k].popo ? res.data[k].popo.split(',') : []
                    }
                }
                
            },
            handleClick(){
                this.testTypeShow = !this.testTypeShow
            },

            async testTypeChange(val){
                let list = {
                    page: 1,
                    rows: 10,
                    project: this.$store.getters.getProjectCode || this.$route.query.project,
                    sort: "",
                    order: "",
                    test_type: val
                }
                let res=await getTestApply(list, { operation: "获取数据", failed: true })
                    if (res.code == 200) {
                        this.tableData = res.data.res
                        this.total = res.data.res_num
                    }
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

            searchBlur(){
                //如果搜索值发生变化
                if(this.lastSearchValue != this.tableKeyList.key){
                    this.getTableData();
                }
            },

            tableRowClassName({row, rowIndex}){
                return "application-status-" + row.test_status;
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
            // 复测
            restartTest(row){
                let test_type_name = this.getTestTypeName(row.test_type)
                test_type_name = test_type_name.slice(0,1).toUpperCase() +test_type_name.slice(1).toLowerCase()
                const url = '/mtl_test_platform/page/expertServices/reTest'+ test_type_name +'Application?project=' + this.projectCode + '&id=' + row.id + '&test_type=' + row.test_type + '&table_name=' + row.content_name
                this.$router.push(url);
            },

            sendReport(item){
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
                switch(test_type_name){
                    case 'compatibilityPC':
                        // 后两个参数分别是：报告页面url、接口url
                        this.$refs.sendReportRef.sendReport(item, "page/compatibilityPCReport", "expertCompatibilityPC");
                        break;
                    case 'compatibility':
                         this.$refs.sendReportRef.sendReport(item, "page/compatibilityReport", "expertCompatibility");
                        break;
                    case 'performance':
                        this.$refs.sendReportRef.sendReport(item, "page/performanceReport", "mobilePerfTest");
                        break;
                    case 'performancePC':
                         this.$refs.sendReportRef.sendReport(item, "page/performancePCReport", "pcPerfTest");
                        break;
                    case 'weaknet':
                        this.$refs.sendReportRef.sendReport(item, "page/weaknetReport", "mobileWeaknetTest");
                        break;
                    case 'protocol':
                        this.$refs.sendReportRef.sendReport(item, "page/protocolReport", "protocolTest");
                        break; 
                }
            },

            // 修改测试接口人
            changeTester(item){
                let qa_str = ''
                item.qa_list.forEach((each, index) => {
                    qa_str = qa_str + each
                    if(index !== item.qa_list.length - 1) qa_str = qa_str + ','
                })
                item.qa = qa_str
                this.update(item, "修改测试接口人")
            },

            async update(item, msg) {
                let res=await updateApplicationProcessthis(item, { operation: msg, failed: true })
                    if (res.code !== 200) {
                        this.$message.error(res.msg)
                    }
                    this.getTableData()
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
                    this.update(item, "修改测试状态")
                }
            },

            async setWorkTime(){
                this.current_row.work_time = this.work_time
                let res =await updateApplicationWorktime(this.current_row,{})
                    if (res.code !== 200) {
                        this.$message.error(res.msg)
                        this.cancel()
                    }else{
                        this.update(this.current_row, "修改测试状态")
                        this.getTableData()
                        this.work_time = 0
                        this.current_row = null
                        this.workTimeDialogVisible = false
                    }        
            },

            cancel(){
                this.current_row.test_status = '1'
                this.update(this.current_row, "修改测试状态")
                this.work_time = 0
                this.current_row = null
                this.getTableData()
                this.workTimeDialogVisible = false
            },

           async getQaList() {
              let res= await getQaList({},{})
                    // console.log(res)
                    if (res.code == 200) {
                        this.testerOption = res.data;
                    }
            },

            //搜索框失焦时（不能用change，因为change会在值发生变化回车后触发，导致事件二次触发）
            searchBlur(){
                //如果搜索值发生变化
                if(this.lastSearchValue != this.tableAxiosList.key){
                    this.getTableData();
                }
            },

            viewDetail(item) {
                // 这里需要根据测试类型跳转到相应的页面，首先获取所对应测试的英文名称
                const test_type_name = this.getTestTypeName(item.test_type)
                let url = '/mtl_test_platform/page/expertServices/'+ test_type_name + 'TestDetail?id=' + item.id + '&test_type=' + item.test_type + '&table_name=' + item.content_name
                this.$router.push(url);
            },

            viewReport(item) {
                let test_type_name = this.getTestTypeName(item.test_type)
                let url = '/mtl_test_platform/page/'+ test_type_name +'TestReport?project=' + this.projectCode + '&applicationId=' + item.id + '&testRecordName=' + item.content_name
                window.open(url, '_blank')
            },

            // 获取测试申请记录，也就是页面的表格数据
            async getTableData() {
                this.lastSearchValue = this.tableKeyList.key;
                let list = this.tableKeyList
                list.test_type = this.testTypeValue
                let res=await getTestApply(list, { operation: "获取数据", failed: true })
                    if (res.code == 200) {
                        this.tableData = res.data.res
                        this.total = res.data.res_num
                    }
            },

            //排序
            sortTable(column) {
                this.tableKeyList.sort = column.prop;
                this.tableKeyList.order = column.order == 'ascending' ? 'asc' : 'desc';
                // this.getTableData();
            },

            // 开始测试
            async startTest(item){
                if(item.qa_list == null || typeof(item.qa_list) != "object") {
                    // 当前申请没有MTL接口人
                    this.$message.error("请先填写MTL接口人")
                } else if(item.qa_list.length == 0){
                    this.$message.error("请先填写MTL接口人")
                } else {
                    this.$store.commit("setPageIsLoading", true);
                    let list = { id: item.id, project_name: item.project_name };
                    let expr=item.test_type
                let res=''
                switch(expr){
                    // 手游专家兼容性
                    case '10':
                        res = await expertTestStart(list, { operation: "开始测试", failed: true })
                        if (res.code == 200) {
                            this.getTableData();
                            let href = `/mtl_test_platform/page/compatibilityStartTest?project=${this.projectCode}&testRecordName=${res.data}&id=${item.id}&test_type=${item.test_type}`;
                            window.open(href, "_blank");
                        }
                        this.$store.commit("setPageIsLoading", false);
                        break;
                    // 端游专家兼容性
                    case '11':
                        res = await expertTestStartPc(list, { operation: "开始测试", failed: true })
                        if (res.code == 200) {
                            this.getTableData();
                            let href = `/mtl_test_platform/page/compatibilityStartTestPC?project=${this.projectCode}&testRecordName=${res.data}&id=${item.id}&test_type=${item.test_type}`;
                            window.open(href, "_blank");
                        }
                        this.$store.commit("setPageIsLoading", false);
                        break;
                    // 手游性能
                    case '20':
                        res = await mobilePerfTest(list, { operation: "开始测试", failed: true })
                        if (res.code == 200) {
                            this.getTableData();
                            let href = `/mtl_test_platform/page/performanceStartTest?project=${this.projectCode}&testRecordName=${res.data}&id=${item.id}&test_type=${item.test_type}`;
                            window.open(href, "_blank");
                        }
                        this.$store.commit("setPageIsLoading", false);
                        break;
                    // 端游性能
                    case '21':
                        res = await pcPerfTest(list, { operation: "开始测试", failed: true })
                        if (res.code == 200) {
                            this.getTableData();
                            let href = `/mtl_test_platform/page/performanceStartTest?project=${this.projectCode}&testRecordName=${res.data}&id=${item.id}&test_type=${item.test_type}`;
                            window.open(href, "_blank");
                        }
                        this.$store.commit("setPageIsLoading", false);
                        break;
                    // 手游弱网
                    case '22':
                        res = await mobileWeaknetTest(list, { operation: "开始测试", failed: true })
                        if (res.code == 200) {
                            this.getTableData();
                            let href = `/mtl_test_platform/page/weaknetStartTest?project=${this.projectCode}&testRecordName=${res.data}&id=${item.id}&test_type=${item.test_type}`;
                            window.open(href, "_blank");
                        }
                        this.$store.commit("setPageIsLoading", false);
                        break;
                    // 端游弱网
                    case '23':
                        res = await pcWeaknetTest(list, { operation: "开始测试", failed: true })
                        if (res.code == 200) {
                            this.getTableData();
                            let href = `/mtl_test_platform/page/weaknetPCStartTest?project=${this.projectCode}&testRecordName=${res.data}&id=${item.id}&test_type=${item.test_type}`;
                            window.open(href, "_blank");
                        }
                        this.$store.commit("setPageIsLoading", false);
                        break;
                    // 协议
                    case '30':
                        let href = `/mtl_test_platform/page/protocolStartTest?project=${this.projectCode}&testRecordName=${item.content_name}&id=${item.id}&test_type=${item.test_type}`;
                        window.open(href, "_blank");
                        break;
                    }
                    
                }
            },

            //切换分页显示几条数据
            handleSizeChange(val) {
                this.tableKeyList.rows = val;
                this.getTableData();
            },

            //切换是全部申请还是我的申请
            changeMyTask() {
                if (this.tableAxiosList.my_task != "old") {
                    if(this.tableAxiosList.my_task == '1'){
                        this.tableKeyList.my_task = '1'
                    }else{
                        this.tableKeyList.my_task = '0'
                    }
                    this.getTableData();
                } else {
                    window.location.href = "http://mtl-compatibility.leihuo.netease.com:8015/expertCompatibility/page/applicationRecord?project=all";
                }
            },

            //切换页码
            handleCurrentChange(val) {
                this.tableKeyList.page = val;
                this.getTableData();
            },

            getStatusClass(status) {
                if (status ===  '0') {
                    return 'status-0';
                } else if (status ===  '1') {
                    return 'status-1';
                } else if (status ===  '2') {
                    return 'status-2';
                } else if (status ===  '3') {
                    return 'status-3';
                } else {
                    return '';
                }
            },
        },
    }
</script>
    
<style scoped>
    .el-button {
        margin-top: 4px;
    }
    
    .el-table>>>tr.application-status-0,
    .el-table>>>tr.application-status-0.hover-row>td{
        background: #FAEAEA;
    }

    .el-table>>>tr.application-status-1,
    .el-table>>>tr.application-status-1.hover-row>td{
        background: #DBFAFA;
    }

    .el-table>>>tr.application-status-2,
    .el-table>>>tr.application-status-2.hover-row>td{
        background: #DEF7D6;
    }

    .el-table>>>tr.application-status-3,
    .el-table>>>tr.application-status-3.hover-row>td{
        background: #ddd;
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

    .not-start-option{
        color: #f00
    }
    .service-orders-list {
        width: 100%;
        flex: 1;
        margin: 20px;
        border-radius: 4px;
        background: #fff;
        display: flex;
        flex-direction: column;
        position: relative;
    }
    .list-title {
        position: absolute;
        flex: 1;
        top: 0;
        z-index: 1;
        padding: 0 20px;
        font-size: 16px;
        font-weight: 700;
        color: #333333;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.1);
        height: 47px;
        width: calc(100% - 40px);
        line-height: 47px;
        z-index: 1;
        background: #fff;
        border-radius: 4px 4px 0 0;
    }
    .list-container {
        flex: 1;
        overflow: auto;
        margin-top: 47px;
        padding: 20px;
    }
    .table-tool-bar {
        padding-bottom: 20px;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 40px;
    }
    .list-footer {
        height: 72px;
        border-top: 1px solid rgba(97, 119, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: 50px;
    }
    .start-test-btn, .remove-record-btn {
        width: 40px;
        height: 24px;
        text-align: center;
        border-radius: 3px;
        border: 1px solid #156EEF;
        font-size: 12px;
        color: #999999;
        padding: 2px 0;
    }
    .btns {
        width:50%;
    }

    .table-tool-bar input, .table-tool-bar .el-input{
        width: 320px;
        float: right
    }
    .table-tool-bar .el-input__inner {
        height: 32px;
        line-height: 32px;
    }
    .table-tool-bar .el-input__icon {
        line-height: 32px;
    }
    .list-footer .el-pagination {
        margin: 0 !important;
    }
    .record-tabs {
        width: 23rem;
        display: inline-block;
    }
    .container{
        margin : 20px auto;
        width: 100%;
        padding: 5px 20px;
        min-height: calc(100% - 40px);
        box-sizing: border-box;
    }
    .container>>>.el-card__header {
        background-color: #f6f9fc;
        padding: 15px 20px;
    }
    .chart-div {
        vertical-align: top;
    }
    .chart-title {
        color: #333333;
        font-size: 16px;
    }
    .box-card {
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        margin-bottom: 30px;
    }
    .decorate-div{
        width: 3px;
        height: 20px;
        background: #4876f2;
        display: inline-block;
        margin-right: 8px;
        vertical-align: sub;
    }
    .decorate-title{
        display: inline-block;
        color: #333333;
        font-size: 20px;
    }
    .el-progress >>> .el-progress-bar__outer {
        background-color: #d0d0d0 !important;
    }
</style>