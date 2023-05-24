<template>
    <div class="start-test">
        <!-- 编辑自定义列组件 -->
        <edit-column ref="editColumnRef" :table-name="axiosList.table_name" @afterEdit="getTableAndCustomColumn"/>
        <!-- 新增和编辑测试内容组件 -->
        <edit-test-content 
            ref="editTestContentRef" 
            :table-name="axiosList.table_name" 
            :custom-cols="customCols" 
            @afterEdit="afterEditTestContent"
            :NameReflect="NameReflect"
            :optionDict="optionDict"
            :testedData="testedData"
            :nameDict="nameDict"
            :basicColumnData="testItemColumnData"/>
        <!-- 分配测试任务 -->
        <add-test-content 
            ref="addTestContentRef" 
            :table-name="axiosList.table_name" 
            :custom-cols="customCols" 
            @afterEdit="afterEditTestContent" 
            :allRecord="allRecordList"
            :NameReflect="NameReflect"
            :optionDict="optionDict"
            :testedData="testedData"
            :nameDict="nameDict"
            :basicColumnData="testItemColumnData"></add-test-content>
        <!-- 兼容性测试覆盖率组件 -->
        <test-cover ref="testCoverRef" :table-name="axiosList.table_name" />
        <!-- 编辑覆盖项组件 -->
        <edit-test-cover ref="editTestCoverRef" :table-name="axiosList.table_name"/>
        <!-- 新增测试任务组件 -->
        <add-test-mission ref="addTestMissionRef" :currentQa="currentQa" :table-name="axiosList.table_name" :custom-cols="customCols" @afterEdit="afterAddMission"></add-test-mission>
        <!-- 数据统计组件 -->
        <static-data ref="testStaticRef" :appUrl="appUrl"></static-data>
        <div class="container">
            <!-- 面包屑 -->
            <div style="margin-bottom: 1rem; margin-top: 80px">
                <span @click="jumpPage()" style="cursor:pointer">工作站</span>
                &nbsp;
                <i class="el-icon-arrow-right"></i> 
                &nbsp;
                <span class="blue-span">开始测试</span>
            </div>

            <div v-if="canLoadTable">
                <div style="margin-bottom:1rem;">
                    <!-- 选择器 -->
                    <el-select 
                        style="width:25rem;margin-right:1rem;" 
                        size="small" 
                        v-model="axiosList.table_name" 
                        filterable  
                        placeholder="请选择" 
                        @change="changeTable"
                        >
                        <el-option 
                            v-for="(item, index) in testRecordNameList" 
                            :key="index" 
                            :label="item.table + '(' + item.status_name + ')'" 
                            :value="item.table"
                            ></el-option>
                    </el-select>
                    <!-- <el-button type="primary" size="small" @click="addTestContent">新增测试内容</el-button> -->
                    <el-button type="primary" v-if="currentQaAdmin.indexOf(userEmail) !== -1" size="small" @click="addTestMission">分配测试任务</el-button>
                    <el-button type="info" size="small" @click="editColumns">编辑自定义列</el-button>
                    <el-button type="warning" size="small" @click="editCasesProblem">编辑用例问题</el-button>
                    <el-button type="danger" size="small" @click="getCover">兼容性覆盖情况</el-button>
                    <el-button type="success" size="small" @click="editCover">编辑覆盖项</el-button>
                    <el-button type="" size="small" @click="editStaticData">数据统计</el-button>
                    <el-input
                        class="search-input"
                        style="float:right;"
                        placeholder="请输入关键词检索"
                        prefix-icon="el-icon-search"
                        v-model="searchValue"
                        @keyup.native.enter="getTestContentTable"
                        @blur="searchBlur"
                    ></el-input>
                </div>

                <!-- 测试要求 -->
                <test-requirement :testDetail="testDetail" :testRequest="testRequest" :serverName="'compatibilityPC'"></test-requirement>

                <div v-for="item,k in testData" class="box-card" :key="k+'_'+item.test_qa">
                    <div class="report-card">
                        <div class="card-title">
                            <div class="title">{{ item.test_qa_name || item.test_qa.split('@')[0] }}</div>
                            <div class="other-span">
                                总共 {{item.total}} 条 
                                <!-- <el-button type="" size="mini" @click="addTestContent" v-if="userEmail == item.test_qa || isAdmin">新增任务</el-button> -->
                                <el-button type="" size="mini" @click="addTestContent" v-if="userEmail == item.test_qa && qaExcutor.indexOf(userEmail) !== -1" style="margin-left:10px;">新增任务</el-button>
                            </div>
                            <div class="expand-div" @click="changeExpand(item,k)">
                                <div class="expand-icon">
                                    <i :class="[item.show ? 'el-icon-arrow-up':'el-icon-arrow-down']" style="color:#ffffff"></i>
                                </div>
                                <div class="expand">{{ item.show ? '收起':'展开' }}</div>
                            </div>
                        </div>
                        <div v-if="item.show" class="card-body">
                                <record-table 
                                :axiosList="axiosList" 
                                @deleteTestContent="deleteTestContent"
                                @editTestContent="editTestContent" 
                                @changeMission="changeMission"
                                :basicColumnData="basicColumnData" 
                                :tableData="getRecordData(item)" 
                                :recordQuestionlist="recordQuestionlist"
                                @afterEdit="getTestData"></record-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import EditColumn from "@/components/StartTest/CompatibilityPC/EditColumn"
import EditTestContent from "@/components/StartTest/CompatibilityPC/EditTestContent.vue"
import TestCover from "@/components/StartTest/CompatibilityPC/TestCoverPC.vue"
import EditTestCover from "@/components/StartTest/CompatibilityPC/EditTestCover.vue"
import SelfTable from "@/components/Common/SelfTable.vue"
import AddTestMission from '@/components/StartTest/CompatibilityPC/AddTestMission'
import RecordTable from '@/components/StartTest/Common/RecordTable'
import StaticData from '@/components/StartTest/Common/StaticData'
import AddTestContent from '@/components/StartTest/CompatibilityPC/AddTestContent'
import TestRequirement from '@/components/StartTest/Common/TestRequirement'
export default {
    components: {
        EditColumn,
        EditTestContent,
        TestCover,
        EditTestCover,
        SelfTable,
        AddTestMission,
        RecordTable,
        StaticData,
        AddTestContent,
        TestRequirement
    },
    data() {
        return {
            project: '',
            canLoadTable: false,
            axiosList: {
                table_name: "",
                key: "",
            },
            testRequest:[
                {
                    propName:"test_version",
                    titleName:"包体版本",
                },
                {
                    propName:"server",
                    titleName:"测试服务器",
                },
                {
                    propName:"test_reason",
                    titleName:"测试原因",
                },
            ],
            lastSearchValue: "",
            testRecordNameList: [],
            customCols: [],//自定义列
            basicColumnData: [],
            // 存储基本列数据，在这里存一遍而不是放到tableList.columnData中，是为了避免自定义列发生变化重载列数据时操作列重复添加
            basicColumnDataFix:[
                {
                    titleName: '是否通过',
                    propName: 'if_pass',
                    // sortFlag: true,
                    minWidth: 100,
                    fixed: 'left'
                },
                {
                    titleName: '操作系统',
                    propName: 'os',
                    // sortFlag: true,
                    minWidth: 100,
                    type: "reason",
                }, 
                {
                    titleName: '显卡',
                    // sortFlag: true,
                    propName: 'gpu',
                    type: "reason",
                }, 
                {
                    titleName: 'CPU',
                    // sortFlag: true,
                    propName: 'cpu',
                    type: "reason",
                }, 
                {
                    titleName: '输入法',
                    propName: 'input',
                    // sortFlag: true,
                    minWidth: 90,
                    type: "reason",
                }, 
                {
                    titleName: '杀毒软件',
                    propName: 'antivirus_software',
                    // sortFlag: true,
                    minWidth: 110,
                    type: 'reason'
                }, 
                {
                    titleName: '游戏内分辨率',
                    propName: 'game_resolution',
                    // sortFlag: true,
                    minWidth: 130,
                    type: "reason",
                }, 
                {
                    titleName: '显示器分辨率',
                    propName: 'pc_resolution',
                    // sortFlag: true,
                    minWidth: 130,
                    type: "reason",
                }, 
                {
                    titleName: '游戏画质',
                    propName: 'display_quality',
                    minWidth: 100,
                    type: "reason",
                }, 
                {
                    titleName: '画面模式',
                    propName: 'picture_mode',
                    minWidth: 100,
                    type: "reason",
                }, 
                {
                    titleName: '游戏存储位置',
                    propName: 'game_location',
                    minWidth: 130,
                    type: "reason",
                }, 
                {
                    titleName: '游戏内语言',
                    propName: 'game_language',
                    minWidth: 130,
                    type: "reason",
                }, 
                {
                    titleName: '系统语言',
                    propName: 'os_language',
                    minWidth: 100,
                    type: "reason",
                }, 
                {
                    titleName: '游戏平台',
                    propName: 'game_platform',
                    minWidth: 100,
                    type: "reason",
                }, 
                {
                    titleName: '其他',
                    propName: 'other_set',
                    minWidth: 100,
                    type: "reason",
                }, 
                {
                    titleName: '备注',
                    propName: 'remarks',
                    minWidth: 130,
                    type: "normal",
                },
                {
                    titleName: '问题',
                    propName: 'questionList',
                    // sortFlag: false,
                    minWidth: 100,
                }, 
                {
                    titleName: 'log文件',
                    propName: 'log_file',
                    type: 'file',
                    // sortFlag: false,
                    minWidth: 70,
                }, 
                // {
                //     titleName: 'MTL接口人',
                //     propName: 'test_qa',
                //     sortFlag: true,
                //     minWidth: 120,
                // }, 
                {
                    titleName: '测试时间',
                    propName: 'test_time',
                    // sortFlag: true,
                    minWidth: 100,
                    type: "normal",
                }
            ],
            testItemColumnData: [
                {
                    titleName: "操作系统",
                    propName: "os",
                    select: "osOptions"
                },
                {
                    titleName: "显卡",
                    propName: "gpu",
                    select: "gpuOptions"
                },
                {
                    titleName: "CPU",
                    propName: "cpu",
                    select: "cpuOptions"
                },
                {
                    titleName: "输入法",
                    propName: "input",
                    select: "inputOptions"
                },
                {
                    titleName: "杀毒软件",
                    propName: "antivirus_software",
                    select: "antivirusSoftwareOptions"
                },
                {
                    titleName: "游戏内分辨率",
                    propName: "game_resolution",
                    select: "gamaResolutionOptions"
                },
                {
                    titleName: "显示器分辨率",
                    propName: "pc_resolution",
                    select: "pcResolutionOptions"
                },
                {
                    titleName: "游戏画质",
                    propName: "display_quality",
                    select: "displayQualityOptions"
                },
                {
                    titleName: "画面模式",
                    propName: "picture_mode",
                    select: "pictureModeOptions"
                },
                {
                    titleName: "游戏存储位置",
                    propName: "game_location",
                    select: "gameLocationOptions"
                },
                {
                    titleName: "游戏内语言",
                    propName: "game_language",
                    select: "gameLanguageOptions"
                },
                {
                    titleName: "系统语言",
                    propName: "os_language",
                    select: "osLanguageOptions"
                },
                {
                    titleName: "游戏平台",
                    propName: "game_platform",
                    select: "gamePlatformOptions"
                },
                {
                    titleName: "其他",
                    propName: "other_set",
                    select: "othersetOptions"
                },
            ],
            currentQaAdmin: "",
            currentQa: "",
            qaExcutor: "",
            testData: [],
            recordQuestionlist: [],
            appUrl: "expertCompatibilityPC",
            requestShow: true,
            testDetail:{},
            searchValue: "",
            lastSearchValue: "",
            allRecordList: [],
            optionDict: {},
            NameReflect: "",
            nameDict: {},
            testedData: {},
        }
    },
    computed: {
        projectCode() {
            return this.$route.query.project;
        },
        isTester() {
            return this.$store.getters.getIsTester
        },
        startTestDict(){
            return this.$store.getters.getStartTestDict
        },
        userEmail() {
            return this.$store.getters.getUserEmail || "";
        },
        isAdmin() {
            return this.$store.getters.getIsAdmin
        },
    },
    created() {
        this.project = this.$route.query.project
        if (!this.isTester && !this.isAdmin) {
            this.$store.commit("setPageIsLoading", true);
            this.$router.push({
                path: '/mtl_test_platform/page/expertServices/serviceOrdersList',
                query: { project: this.project }
            })
            setTimeout(() => {
                this.$message.error("您没有权限访问此界面，将为您跳转到测试申请记录界面！");
            }, 1000)
        } else if (this.$route.query.testRecordName == undefined) {
            this.$message.error("表格获取异常！");
        } else {
            this.$set(this.axiosList, "table_name", this.$route.query.testRecordName)
            this.$set(this.axiosList, "id", this.$route.query.id)
            this.$set(this.axiosList, "test_type", this.$route.query.test_type)
            this.getOptions()
            this.getAlreadyTestData()
            this.getAllRecordTable();
            this.getCurrentApply()
            this.getTestData()
            this.getTestDetail()
        }
    },
    mounted() {
        this.$store.commit("setPageIsLoading", false);
    },
    methods: {
        // 获取当前已经测试的阶段
        getAlreadyTestData(){
            let list = { 
                table_name: this.axiosList.table_name,
                type: 0,
            };
            this.$codePost("/expertCompatibilityPC/record_coverage/", list, { operation: "获取兼容性覆盖情况", failed: true }).then(res => {
                if (res.code == 200) {
                    let testedData = {}
                    res.data.forEach(item => {
                        testedData[item.label] = []
                        item.coverage.forEach(coverageItem => {
                            if(coverageItem.state == 1){
                                testedData[item.label].push(coverageItem.type)
                            }
                        })
                    })
                    this.getPropName()
                    this.testedData = testedData
                }
            })
        },
        getPropName(){
            this.nameDict = {}
            for(let i in this.NameReflect){
                let item = this.NameReflect[i]
                this.nameDict[item.pc_report_col_name] = item.diaplay_name
            }
        },
        // 获取选项数据
        getOptions() {
            this.$axiosGet("/expertCompatibilityPC/get_select_options/", {}, { operation: "获取测试选项", failed: true }).then(res => {
                if (res.code == 200) {
                    // console.log(res)
                    for(let i in res.data){
                        if(i == 'NameReflect'){
                            this.NameReflect = res.data[i]
                        }else{
                            this.optionDict[i] = res.data[i]
                        }
                    }
                }
            })
        },
        afterAddMission(){
            this.getCurrentApply()
            this.getTestData()
        },
        changeMission(tableSelectItem){
            console.log(tableSelectItem)
        },
        getTestDetail(){
            this.$codePost("/expertCompatibility/apply_detail/", this.axiosList).then(res => {
                if(res.code == "200"){
                    this.testDetail = res.data
                    // console.log(this.testDetail)
                }
            })
        },
        // 获取测试记录
        getTestData(){
            let list = {
                table_name: this.axiosList.table_name,
                key: this.searchValue,
            }
            this.$codePost("/expertCompatibilityPC/get_expert_test_record/", list).then(res => {
                if(res.code === 200){
                    // console.log(res)
                    this.testData = res.data.records
                    this.recordQuestionlist = res.data.question_data
                    this.allRecordList = []
                    this.testData.forEach((v) => {
                        this.allRecordList = this.allRecordList.concat(v.records)
                    })
                    // console.log(this.allRecordList)
                    // console.log(this.testData)
                }
            })
        },


        getTestContentTable(){
            this.lastSearchValue = this.searchValue
            this.getTestData()
        },

        getRecordData(item){
            return item.records
        },

        //下载log文件
        downloadFile(href) {
            this.$publicJS.downloadFile(this, href);
        },

        //获取所有测试表
        getAllRecordTable() {
            // 这里需要获取所有记录表接口
            this.$codePost("/service/get_all_record_tables/", { project: this.project }).then(res => {
                if (res.code == 200) {
                    this.testRecordNameList = res.data;
                    let tableNameArr = this.testRecordNameList.map((v) => { return v.table });
                    if (this.testRecordNameList.length == 0) {
                        this.$message.warning("当前项目组没有测试表！")
                    } else if (!tableNameArr.includes(this.axiosList.table_name)) {
                        this.$message.warning("当前项目组没有您想要的测试表，已为您切换测试表！")
                        //所有的测试表中不包含当前表，设置选中表为数据中第一个，且修改网址
                        this.$set(this.axiosList, "table_name", tableNameArr[0]);
                        let queryList = { project: this.project, testRecordName: tableNameArr[0] };
                        let url = location.pathname + this.$publicJS.getQueryStr(queryList);
                        history.pushState({ url: url, title: document.title }, document.title, url);
                        this.$route.query.testRecordName = this.axiosList.table_name;
                        this.getTableAndCustomColumn();
                    } else {
                        this.getTableAndCustomColumn();
                    }
                }
            })
        },

        //切换测试表
        changeTable(val) {
            // let url = location.pathname + '?project=' + this.project + "&testRecordName=" + this.axiosList.table_name;
            // history.pushState({ url: url, title: document.title }, document.title, url);
            // this.getTableAndCustomColumn();
            let curItem = this.testRecordNameList.filter(item=>{
                return item.table === val
            })[0]

            let baseUrl = ""

            let pathArr = location.pathname.split('/')
            pathArr[pathArr.length-1] = this.startTestDict[curItem.test_type]
            baseUrl = pathArr.join('/')

            let url = baseUrl + '?project=' + this.projectCode + "&testRecordName=" + curItem.table + "&id=" + curItem.id + "&test_type=" + curItem.test_type;
            history.pushState({ url: url, title: document.title }, document.title, url);
            location.reload(url)
        },

        //获得表格数据和自定义列
        getTableAndCustomColumn() {
            this.canLoadTable = false;
            let list = { table_name: this.axiosList.table_name };
            let columnData = JSON.parse(JSON.stringify(this.basicColumnDataFix));

            // 这里需要获取自定义列接口
            this.$codePost("/expertCompatibilityPC/get_custom_cols/", list, { operation: "获取自定义列", failed: true }).then(res => {
                if (res.code == 200) {
                    this.customCols = res.data;
                    for (let i = 0; i < this.customCols.length; i++) {
                        let item = this.customCols[i];
                        columnData.push({
                            titleName: item.col_cn_name,
                            propName: item.col_name,
                            type: "normal",
                        })
                    }
                    // console.log('自定义列：',this.customCols)
                }
                columnData.push({
                    titleName: "操作",
                    propName: "operation",
                    minWidth: 170,
                    fixed: "right",
                    canEditTestContent: true,
                    canDeleteTestContent: true,
                    canEditMission: false,
                })
                this.basicColumnData = columnData;
                this.canLoadTable = true;
            })
        },

        //搜索框失焦时（不能用change，因为change会在值发生变化回车后触发，导致事件二次触发）
        searchBlur(){
            //如果搜索值发生变化
            if(this.lastSearchValue != this.searchValue){
                // this.getTestContentTable();
                this.getTestData()
            }
        },

        //新增/编辑测试内容后
        afterEditTestContent(operation){
            if(operation == "addTestContent"){
                //如果是新增操作，清空搜索框
                this.axiosList.key = "";
                // this.getTestContentTable();
                // this.getTestData()
                // this.getOptions()
                // this.getAlreadyTestData()
            }
            this.getTestData()
            this.getOptions()
            this.getAlreadyTestData()
            
        },

        //获得测试内容表
        getTestContentTable() {
            this.lastSearchValue = this.axiosList.key;
            this.getTestData();
        },

        //跳转到工作站
        jumpPage() {
            this.$router.push({
                path: '/mtl_test_platform/page/workstation/myMission',
                query: { project: this.projectCode }
            })
        },

        //新增测试内容
        addTestContent() {
            this.$refs.addTestContentRef.addTestContent();

        },

        //编辑测试内容
        editTestContent(item) {
            this.$refs.editTestContentRef.editTestContent(item);
        },

        //删除测试内容记录
        deleteTestContent(item) {
            let confirmText = "确定删除该测试内容吗？";
            if (Object.keys(item.pic_info).length > 0) {
                confirmText = "<span style='color:red;'>删除该条测试内容后其图片也会被删除</span>，确定删除吗？";
            }
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                //确认
                let list = { id: item.id, table_name: this.axiosList.table_name };
                this.$codePost("/expertCompatibilityPC/delete_expert_test_record/", list, { operation: "删除测试内容", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        // this.getTestContentTable();
                        this.getTestData()
                        this.getCurrentApply()
                    }
                })
            }).catch(() => { });
        },

        //编辑用例问题
        editCasesProblem() {
            // let href = `/mtl_test_platform/page/questionTablePC?project=${this.projectCode}&testRecordName=${this.axiosList.table_name}`;
            // window.open(href);
            this.$router.push({
                path: '/mtl_test_platform/page/questionTablePC',
                query: this.$route.query
            })
        },

        //编辑自定义列
        editColumns() {
            this.$refs.editColumnRef.openEditDialog();
        },

        //获得兼容性覆盖情况
        getCover() {
            this.$refs.testCoverRef.getCover();
        },
        
        //编辑兼容性覆盖情况
        editCover(){
            this.$refs.editTestCoverRef.editCover();
        },

        // 新增测试任务
        addTestMission(){
            this.$refs.addTestMissionRef.addTestMission();
        },

        // 编辑统计数据
        editStaticData(){
            this.$refs.testStaticRef.openDialog()
        },

        changeExpand(item, index){
            this.$set(this.testData[index], 'show', !item.show);
        },

        // 获得当前申请信息
        getCurrentApply(){
            let list = {
                id: this.$route.query.id
            }
            this.$codePost("/service/get_test_apply_by_id/", list).then(res => {
                if(res.code == "200"){
                    this.currentQaAdmin = res.data.qa
                    this.currentQa = res.data.qa + res.data.qa_excutor
                    this.qaExcutor = res.data.qa_excutor
                    // 判断history.length是否大于1，如果大于1，说明是从其他页面跳转过来的，如果等于1，说明是从浏览器地址栏直接输入的
                    // if(history.length > 1){
                    // if(!this.isAdmin && this.currentQa.indexOf(this.userEmail) == -1){
                    //     this.$store.commit("setPageIsLoading", true);
                    //     if(history.length > 1){
                    //         history.go(-1);
                    //         setTimeout(() => {
                    //             this.$message.error("您没有权限访问此申请！，已经返回上一页");
                    //         }, 1000)
                    //     }else{
                    //         this.$router.push({
                    //             path: '/mtl_test_platform/page/workstation/myMission',
                    //             query: { project: this.project }
                    //         })
                    //         setTimeout(() => {
                    //         this.$message.error("您没有权限访问此页面！返回我的任务页面");
                    //     }, 1000)
                    //     }
                    // }
                }
            })
        },
    },

}
</script>

<style scoped>
.box-card{
    margin-top: 15px;
}
.el-card /deep/ .el-card__header {
    background: #f0f1f2;
    font-size: 16px;
}

.remind-div{
    text-align: center;
    margin-top: 2rem;
}

.box-card {
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #FFF;
}
.report-card {
    width: 100%;
    margin-bottom: 20px;
    border-radius: 3px;
    overflow: hidden;
}

.report-card .card-title {
    height: 48px;
    background: #36495e;
    border: 5px 5px 0 0;
    display: flex;
    flex-direction: row;
}

.report-card .title {
    color: #ffffff;
    font-size: 16px;
    line-height: 48px;
    margin-left: 10px;
}

.report-card .other-span {
    color: #ffffff;
    font-size: 14px;
    line-height: 48px;
    margin-left: 20px;
    flex: 1;
}

.report-card .expand-div {
    display: flex;
    cursor: pointer;
    flex-direction: row;
    line-height: 48px;
    margin-right: 20px;
}

.report-card .expand-div .expand {
    color: #ffffff;
}

.report-card .expand-div .expand-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    margin-top: 14px;
    background: #5D6C7D;
    border-radius: 20px;
    text-align: center;
    line-height: 20px;
}

.report-card .card-body {
    background: #FFFFFF; 
    padding: 20px;
    border: 1px solid #EBEEF5;
}

.request-type{
    margin-top:10px;
}

.request-title{
    width:6%; 
    display:inline-block;
    vertical-align: top;
    font-weight: bold;
}

.request-content{
    display:inline-block; 
    width: 90%;
}

.request-item{
    width: 20%; 
    display:inline-block;
}
</style>

