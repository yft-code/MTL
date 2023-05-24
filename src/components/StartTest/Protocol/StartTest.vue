<template>
    <div class="start-test">
        <edit-column ref="editColumnRef" :table-name="axiosList.table_name" @afterEdit="getTableAndCustomColumn"/>
        <edit-test-content ref="editTestContentRef" :protocolTableItemList="protocolTableItemList" :table-name="axiosList.table_name" :custom-cols="customCols" @afterEdit="afterEditTestContent"/>
        <test-cover ref="testCoverRef" :table-name="axiosList.table_name" :test-detail="testDetail" />
        <edit-test-cover ref="editTestCoverRef" :table-name="axiosList.table_name"/>
        <edit-mission ref="editMissionRef" @afterEdit="getTestData"></edit-mission>
        <edit-patch-mission ref="editPatchMissionRef" @afterEdit="getTestData"></edit-patch-mission>
        <static-data ref="testStaticRef" :appUrl="appUrl"></static-data>
        <add-test-protocol ref="addTestProtocolRef" :tableItemList="protocolTableItemList" @afterAdd="handleAddProtocol" :protocolList="protocolListCopy" @afterAllocate="getTestData" @afterEdit="getProtocols"></add-test-protocol>
        <self-dialog ref="addMissionRef" 
            :dialog-data="{ title: '新增测试任务', width: '25%', top: '15%',confirmName:'确定',closeName:'取消'}"
            @confirm="confirmAdd">
            <el-form ref="addMissionFormRef" :model="addMissionForm" :rules="addMissionFormRules" label-width="120px">
                <el-form-item label="预分配机型" prop="device">
                    <el-input style="width:80%" v-model="addMissionForm.device"></el-input>
                </el-form-item>
            </el-form>
        </self-dialog>
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
                    <el-button v-if="currentQaAdmin.indexOf(userEmail) !== -1 || isAdmin" type="primary" size="small" @click="addTestProtocol">分配测试任务</el-button>
                    <!-- <el-button type="info" size="small" @click="editColumns">编辑自定义列</el-button> -->
                    <!-- <el-button type="warning" size="small" @click="editCasesProblem">编辑用例问题</el-button> -->
                    <!-- <el-button type="danger" size="small" @click="getCover">兼容性覆盖情况</el-button> -->
                    <!-- <el-button type="success" size="small" @click="editCover">编辑覆盖项</el-button> -->
                    <el-button type="" size="small" @click="editStaticData">数据统计</el-button>
                </div>

                <!-- 测试要求 -->
                <test-requirement :testDetail="testDetail" :testRequest="testRequest" :serverName="'protocol'"></test-requirement>
                <div class="box-card" v-if="protocolList.length > 0 && currentQaAdmin.indexOf(userEmail) !== -1">
                    <div class="report-card">
                        <div class="card-title" style="background: #f56c6c;">
                            <div class="title">存在未分配任务</div>
                            <div class="other-span">
                                总共 {{protocolList.length}} 条
                                <el-button type="" size="mini" @click="addTestProtocol" style="margin-left:10px;">去分配</el-button>
                            </div>
                            <div class="expand-div" @click="needAllocateShow=!needAllocateShow">
                                <div class="expand-icon" style="background: #f56c6c;">
                                    <i :class="[needAllocateShow ? 'el-icon-arrow-up':'el-icon-arrow-down']" style="color:#ffffff"></i>
                                </div>
                                <div class="expand">{{ needAllocateShow ? '收起':'展开' }}</div>
                            </div>
                        </div>
                        <div class="card-body" v-if="needAllocateShow">   
                            <protocol-table :isEdit="false" :protocolList="protocolList" :tableItemList="protocolTableItemList"></protocol-table>
                        </div>
                    </div>
                </div>
                
                <!-- <div v-for="item,k in fakeData" class="box-card" :key="k+'_'+item.test_qa"> -->
                <div v-for="item,k in testData" class="box-card" :key="k+'_'+item.test_qa" v-if="item.test_qa !== '未分配'">
                    <div class="report-card">
                        <div class="card-title">
                            <div class="title">{{ item.test_qa_name || item.test_qa.split('@')[0] }}</div>
                            <div class="other-span">
                                已完成 {{item.completed}} 条 / 总共 {{item.total}} 条
                                <!-- <el-button type="" size="mini" @click="addMission(item.test_qa)" v-if="currentQaAdmin.indexOf(userEmail) !== -1 || item.test_qa == userEmail" style="margin-left:10px;">新增任务</el-button> -->
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
                                @afterQuestionDelete="getTestData"
                                @deleteTestContent="deleteTestContent"
                                @editTestContent="editTestContent" 
                                @editMission="editMission"
                                @changeMission="changeMission"
                                :basicColumnData="basicColumnData" 
                                :tableData="item.records" 
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
import formRule from "@/utils/formRule.js"
import StaticData from '@/components/StartTest/Common/StaticData'
import TestRequirement from '@/components/StartTest/Common/TestRequirement'
import EditColumn from "@/components/StartTest/Protocol/EditColumn"
import EditTestContent from "@/components/StartTest/Protocol/EditTestContent"
import TestCover from "@/components/StartTest/Protocol/TestCover"
import EditTestCover from "@/components/StartTest/Protocol/EditTestCover"
import RecordTable from '@/components/StartTest/Protocol/RecordTable'
import EditMission from '@/components/StartTest/Protocol/EditMission'
import EditPatchMission from '@/components/StartTest/Protocol/EditPatchMission'
import AddTestProtocol from '@/components/StartTest/Protocol/AddTestProtocol'
import ProtocolTable from '@/components/StartTest/Protocol/ProtocolTable'
export default {
    components: {
        EditColumn,
        EditTestContent,
        TestCover,
        EditTestCover,
        RecordTable,
        EditMission,
        StaticData,
        TestRequirement,
        EditPatchMission,
        AddTestProtocol,
        ProtocolTable
    },
    data() {
        return {
            requestShow: true,
            project: '',
            canLoadTable: false,
            axiosList: {
                table_name: "",
                key: "",
                id: "",
                test_type: "",
            },
            testRequest:[
                // {
                //     propName: "protocols",
                //     titleName: "具体协议",
                // },
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
            testDetail: {},
            lastSearchValue: "",
            testRecordNameList: [],
            customCols: [],//自定义列
            basicColumnData: [],
            // 存储基本列数据，在这里存一遍而不是放到tableList.columnData中，是为了避免自定义列发生变化重载列数据时操作列重复添加
            basicColumnDataFix:[
                {
                    titleName: '协议名称',
                    propName: 'protocol_name',
                    // sortFlag: true,
                    minWidth: 110,
                    type: "normal",
                },
                {
                    titleName: '协议描述/功能',
                    propName: 'description',
                    // sortFlag: true,
                    minWidth: 150,
                    type: "normal",
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
                    minWidth: 150,
                },
                {
                    titleName: '测试时间',
                    propName: 'test_time',
                    // sortFlag: true,
                    minWidth: 100,
                    type: "normal",
                },
            ],
            currentQa: "",
            currentQaAdmin: "",
            testData: [],
            recordQuestionlist: [],
            appUrl: "protocolTest",
            addMissionForm: {
                device: "",
                qa: "",
            },
            addMissionFormRules: {
                device: [{ required: true, trigger: 'change', message: "请填入预分配机型" }]
            },
            protocolList: [], // 未分配的协议
            protocolListCopy: [],
            needAllocateShow: true,
            protocolTableItemList: [
                {
                    titleName: "协议名",
                    propName: "protocol_name",
                    align: "center"
                },
                {
                    titleName: "协议说明",
                    propName: "description",
                    align: "left"
                },
            ]
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
        // console.log(this.$store.getters.getIsTester)
        if (!this.$store.getters.getIsTester && !this.isAdmin) {
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
        } 
        else {
            this.$set(this.axiosList, "table_name", this.$route.query.testRecordName)
            this.$set(this.axiosList, "id", this.$route.query.id)
            this.$set(this.axiosList, "test_type", this.$route.query.test_type)
            this.getCurrentApply()
            this.getAllRecordTable();
            this.getTestDetail()
            this.getTestData()
            this.getProtocols()
        }
    },
    mounted() {
        this.$store.commit("setPageIsLoading", false);
    },
    methods: {
        handleAddProtocol(obj){
            this.protocolListCopy.unshift(obj);
        },
        getProtocols(){
            let list = {
                application_id: this.$route.query.id
            }
            this.$codePost("/protocolTest/get_test_task/", list).then(res => {
                if(res.code == "200"){ 
                    // console.log(res.data)
                    this.protocolList = res.data
                    this.protocolListCopy = []
                    res.data.forEach(item => {
                        this.protocolListCopy.push(item)
                    })
                }
            })
        },
        changeMission(tableSelectItem){
            this.$refs.editPatchMissionRef.editPatchMission(tableSelectItem);
            // console.log(tableSelectItem)
        },
        confirmAdd(){
            let hasError = this.$publicJS.checkFormData(this, "addMissionFormRef", "您有必填项未填！");
            if(!hasError){
                let list = {
                    device_list: JSON.stringify([this.addMissionForm.device]),
                    qa_list: JSON.stringify([this.addMissionForm.qa]),
                    table_name: this.$route.query.testRecordName
                }
                this.$codePost("/protocolTest/preset_device_allocate/", list, {operation: "新增测试任务", success: true, failed: true }).then(res => {
                    if(res.code == "200"){
                        this.getTestData()
                        if(res.msg){
                            this.$message.warning(res.msg)
                        }else{
                            this.addMissionForm.device = ""
                            this.$refs.addMissionRef.closeDialog()
                        }
                    }
                })
            }
        },

        // 获取测试记录
        getTestData(){
            let list = {
                application_id: this.axiosList.id,
                // table_name: this.axiosList.table_name
            }
            this.$codePost("/protocolTest/get_test_record/", list).then(res => {
                if(res.code == "200"){
                    console.log(res)
                    this.testData = res.data
                    this.recordQuestionlist = res.data.question_data
                    // console.log(this.testData)
                }
            })
        },
        getCurrentApply(){
            let list = {
                id: this.$route.query.id
            }
            this.$codePost("/service/get_test_apply_by_id/", list).then(res => {
                if(res.code == "200"){
                    this.currentQaAdmin = res.data.qa
                    // console.log(this.currentQaAdmin)
                    this.currentQa = res.data.qa + res.data.qa_excutor
                    // if(!this.isAdmin && this.currentQa.indexOf(this.userEmail) == -1){
                    //     this.$store.commit("setPageIsLoading", true);
                    //     this.$router.push({
                    //         path: '/mtl_test_platform/page/expertServices/serviceOrdersList',
                    //         query: { project: this.project }
                    //     })
                    //     setTimeout(() => {
                    //         this.$message.error("您没有权限访问此界面，将为您跳转到测试申请记录界面！");
                    //     }, 1000)
                    // }
                }
            })
        },
        addMission(testQa){
            this.addMissionForm.qa = testQa
            this.$refs.addMissionRef.openDialog()
        },
        getTestDetail(){
            this.$codePost("/protocolTest/get_test_apply_by_id/", this.axiosList).then(res => {
                if(res.code == "200"){
                    this.testDetail = res.data
                    // if(this.testDetail.protocols){
                    //     // let temp = this.testDetail.protocols.replace(/^<p>/gi,"")
                    //     let temp = this.testDetail.protocols.replace(/<\/p><p>/g,"，").replace(/<\/?.+?>/g,"")
                    //     this.testDetail.protocols = temp
                    //     // console.log(temp)
                    // }
                    // console.log(this.testDetail)
                }
            })
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

            // // 这里需要获取自定义列接口
            // this.$codePost("/protocolTest/get_custom_cols/", list, { operation: "获取自定义列", failed: true }).then(res => {
            //     if (res.code == 200) {
            //         this.customCols = res.data;
            //         for (let i = 0; i < this.customCols.length; i++) {
            //             let item = this.customCols[i];
            //             columnData.push({
            //                 titleName: item.col_cn_name,
            //                 propName: item.col_name,
            //                 type: "normal",
            //             })
            //         }
            //     }
            //     columnData.push({
            //         titleName: "操作",
            //         propName: "operation",
            //         minWidth: 180,
            //         fixed: "right",
            //         canEditTestContent: true,
            //         canDeleteTestContent: true,
            //         canEditMission: true,
            //     })
            //     this.basicColumnData = columnData;
            //     this.canLoadTable = true;
            // })
            columnData.push({
                titleName: "操作",
                propName: "operation",
                minWidth: 180,
                // fixed: "right",
                canEditTestContent: true,
                canDeleteTestContent: true,
                canEditMission: true,
            })
            this.basicColumnData = columnData;
            this.canLoadTable = true;
        },

        //搜索框失焦时（不能用change，因为change会在值发生变化回车后触发，导致事件二次触发）
        searchBlur(){
            //如果搜索值发生变化
            if(this.lastSearchValue != this.axiosList.key){
                // this.getTestContentTable();
                this.getTestData()
            }
        },

        //新增/编辑测试内容后
        afterEditTestContent(operation){
            if(operation == "addTestContent"){
                //如果是新增操作，清空搜索框
                this.axiosList.key = "";
                this.getTestData()
            }else{
                this.getTestData()
            }
            
        },

        //获得测试内容表
        getTestContentTable() {
            this.lastSearchValue = this.axiosList.key;
            this.$refs.testContentTableRef.getTableData();
        },

        //跳转到工作站
        jumpPage() {
            this.$router.push({
                path: '/mtl_test_platform/page/workstation/myMission',
                query: { project: this.projectCode }
            })
        },

        // //新增测试内容
        // addTestContent() {
        //     this.$refs.editTestContentRef.addTestContent();

        // },


        // 新增测试协议
        addTestProtocol(){
            this.$refs.addTestProtocolRef.addTestProtocol();
        },

        //编辑测试内容
        editTestContent(item) {
            this.$refs.editTestContentRef.editTestContent(item);
        },


        // 编辑任务
        editMission(item){
            this.$refs.editMissionRef.editMission(item);
        },

        //删除测试内容记录
        deleteTestContent(item) {
            console.log(item)
            let confirmText = "确定删除该测试内容吗？";
            // if (Object.keys(item.pic_info).length > 0) {
            //     confirmText = "<span style='color:red;'>删除该条测试内容后其图片也会被删除</span>，确定删除吗？";
            // }
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                //确认
                let list = { id: item.id};
                this.$codePost("/protocolTest/delete_test_task/", list, { operation: "删除测试内容", success: true, failed: true }).then(res => {
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
            // let href = `/mtl_test_platform/page/questionTable?project=${this.projectCode}&testRecordName=${this.axiosList.table_name}`;
            // window.open(href);
            this.$router.push({
                path: '/mtl_test_platform/page/protocolQuestionTable',
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

        // 编辑统计数据
        editStaticData(){
            this.$refs.testStaticRef.openDialog()
        },

        changeExpand(item, index){
            this.$set(this.testData[index], 'show', !item.show);
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



