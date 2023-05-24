<template>
    <div class="start-test">
        <!-- 其他子组件 -->
        <add-test-scene 
            ref="editSceneRef" 
            :appUrl="appUrl"
            :editSceneName="editSceneName" 
            :sceneTempData="sceneTempData" 
            :axiosList="axiosList" 
            :deviceData="deviceData" 
            @changeSceneName="changeSceneName" 
            @afterEdit="getSceneData"></add-test-scene>
        <edit-scene-temp 
            ref="editSceneTempRef" 
            :appUrl="appUrl" 
            :projectClassifyArr="projectClassifyArr" 
            :sceneTempData="sceneTempData" 
            :editSceneTempName="editSceneTempName" 
            @changeSceneTempName="changeSceneTempName" 
            @afterEdit="getSceneTemp({project: 'all'})"></edit-scene-temp>
        <edit-test-device :deviceData="deviceData" @afterEdit="getDeviceData" :appUrl="appUrl" ref="editTestDeviceRef"></edit-test-device>
        <add-test-content 
            :appUrl="appUrl"
            ref="addTestContentRef"
            :axiosList="axiosList" 
            @afterEdit="getTableData"></add-test-content>
        <check-test-device ref="checkTestDeviceRef" :axiosList="axiosList" :appUrl="appUrl" :deviceData="deviceData"></check-test-device>
        <check-conclusion ref="editConclusionRef" :axiosList="axiosList" :appUrl="appUrl"></check-conclusion>

        <div class="container">
            <div style="margin-bottom: 1rem; margin-top: 80px;">
                <span @click="jumpPage()" style="cursor:pointer">工作站</span>
                &nbsp;
                <i class="el-icon-arrow-right"></i> 
                &nbsp;
                <span class="blue-span">开始测试</span>
            </div>
            <div v-if="canLoadTable">
                <div style="margin-bottom:1rem;">
                    <!-- 测试记录选择 -->
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
                        >
                        </el-option>
                    </el-select>

                    <!-- 按钮部分 -->
                    <el-button type="primary" size="small" @click="addTestScene">新增测试场景</el-button>
                    <el-button type="danger" size="small" @click="checkTestDevice">登记测试/辅助机</el-button>
                    <el-button type="danger" size="small" @click="checkTestConclusion">登记测试结论</el-button>
                    <el-button type="warning" size="small" @click="editTestDevice">编辑测试设备</el-button>
                    <el-button type="danger" size="small" @click="editSceneTemp">编辑场景模板</el-button>


                    <div v-if="sceneData.length === 0" class="remind-div">没有测试记录，请先添加测试场景进行测试！</div>


                    <!-- 各个场景 -->
                    <el-card v-for="item,k in sceneData" class="box-card" :key="k">
                        <div slot="header">
                            <span>{{item.scene_name}}</span>
                            <i  class='el-icon-edit-outline edit-icon' 
                                style="margin-top:0;" 
                                @click="editTestScene(item)"></i>
                            <el-button  style="float: right;" type="primary" size="small" @click=addTestRecord(item,k)>新增测试记录</el-button>
                        </div>
                        <div>
                            <!-- 表格部分 -->
                            <scene-table 
                                :basicColumnData="basicColumnData" 
                                :appUrl="appUrl" 
                                :mergeArr="mergeArr" 
                                :mergeObj="getSpanArr(item)" 
                                :tableData="sceneTableData(item)" 
                                @afterEdit="afterEdit" 
                                @openEditDialog="editTestRecord"></scene-table>
                        </div>
                    </el-card>

                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import formRule from "@/utils/formRule.js"
import SceneTable from '@/components/StartTest/Weaknet/SceneTable'
import AddTestScene from '@/components/StartTest/Weaknet/AddTestScene'
import EditSceneTemp from '@/components/StartTest/PerformancePC/EditSceneTemp'
import EditTestDevice from '@/components/StartTest/Weaknet/EditTestDevice'
import AddTestContent from '@/components/StartTest/Weaknet/AddTestContent'
import CheckTestDevice from '@/components/StartTest/Weaknet/CheckTestDevice'
import CheckConclusion from '@/components/StartTest/Weaknet/CheckConclusion'
export default {
    components: {
        SceneTable,
        AddTestScene,
        EditSceneTemp,
        EditTestDevice,
        AddTestContent,
        CheckTestDevice,
        CheckConclusion
    },
    data() {
        return {
            canLoadTable: false,
            axiosList: {
                table_name: "",
                key: "",
                id: "",
                test_type: "20"
            },
            testRecordNameList: [],
            tableList: [],
            // 存储基本列数据，是为了避免自定义列发生变化重载列数据时操作列重复添加
            basicColumnData:[
                {
                    titleName: '设备',
                    propName: 'status',
                    type: "normal",
                },
                {
                    titleName: '延迟(ms)',
                    propName: 'delay',
                    type: "normal",
                },
                {
                    titleName: '丢包率(%)',
                    propName: 'loss',
                    type: "normal",
                },
                {
                    titleName: 'kcp',
                    propName: 'kcp',
                    type: "normal",
                }, 
                {
                    titleName: 'tcp',
                    propName: 'tcp',
                    type: "normal",
                }, 
                {
                    titleName: '表现',
                    propName: 'msg',
                    type: "normal",
                    width: "600px",
                    align: 'left'
                }, 
                {
                    titleName: '测试人员',
                    propName: 'test_qa',
                },
                {
                    titleName: '测试时间',
                    propName: 'date',
                    type: "normal",
                    width: "100px"
                },
                {
                    titleName: '操作',
                    propName: 'opration',
                    width: '180px'
                }, 
            ],
            editSceneTempName: '新增',
            projectClassifyArr: [],
            sceneTempData: [],  // 场景模板数据
            editSceneName: "新增",
            sceneData: [],  // 场景数据,写死的，后续需要删除
            deviceData:[],
            appUrl: "mobileWeaknetTest",
            mergeArr: ['delay', 'loss', 'kcp', 'tcp', 'msg', 'test_qa'] // 表格中的列名
        }
    },
    computed: {
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
        isTester() {
            return this.$store.getters.getIsTester
        },
        startTestDict(){
            return this.$store.getters.getStartTestDict
        }
    },
    created() {
        this.project = this.$route.query.project
        if (!this.isTester) {
            this.$store.commit("setPageIsLoading", true);
            this.$router.push({
                path: '/mtl_test_platform/page/expertServices/serviceOrdersList',
                query: { project: this.projectCode }
            })
            setTimeout(() => {
                this.$message.error("您没有权限访问此界面，将为您跳转到测试申请记录界面！");
            }, 1000)
        } else if (this.$route.query.testRecordName == undefined) {
            this.$message.error("表格获取异常！");
        } else {
            this.$set(this.axiosList, "table_name", this.$route.query.testRecordName)
            this.$set(this.axiosList, "id", this.$route.query.id)
            this.getProject()
            this.getSceneData()
            this.getDeviceData()
            this.getAllRecordTable({ project: "all", test_status: '1' });
            this.getTableData()
        }
    },
    mounted() {
        this.$store.commit("setPageIsLoading", false);
    },
    methods: {
        // getSpanArr方法
        getSpanArr(item) {
            let data = this.sceneTableData(item)
            let mergeObj = {}
            this.mergeArr.forEach((key, index1) => {
                let count = 0; // 用来记录需要合并行的起始位置
                mergeObj[key] = []; // 记录每一列的合并信息
                data.forEach((item, index) => {
                    // index == 0表示数据为第一行，直接 push 一个 1
                    if(index === 0) {
                        mergeObj[key].push(1); 
                    } else {
                        // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
                        if(item[key] === data[index - 1][key]) { 
                            mergeObj[key][count] += 1;
                            mergeObj[key].push(0);
                        } else {
                            // 如果当前行和上一行其值不相等 
                            count = index; // 记录当前位置 
                            mergeObj[key].push(1); // 重新push 一个 1
                        }
                    }
                })
            })
            return mergeObj
        },
        addTestRecord(item,k){
            this.$refs.addTestContentRef.openDialog(item, 'add')
        },
        editTestRecord(row){
            this.$refs.addTestContentRef.openDialog(row, 'edit')
        },
        addTestScene(){
            this.getSceneTemp({project: this.projectCode})
            this.$refs.editSceneRef.openDialog();
        },

        // 获取场景模板
        async getSceneTemp(list){
            let res = await this.$codePost("/mobileWeaknetTest/get_scene_schemas/", list, { operation: "获取场景数据", failed: true });
            if(res.code == 200){
                this.sceneTempData = res.data
            }
        },


        //跳转到工作站
        jumpPage() {
            this.$router.push({
                path: '/mtl_test_platform/page/workstation/myMission',
                query: { project: this.projectCode }
            })
        },

    
        //获取所有测试表
        getAllRecordTable(list) {
            this.$codePost("/service/get_all_record_tables/", list).then(res => {
                if (res.code == 200) {
                    this.testRecordNameList = res.data;
                    let tableNameArr = this.testRecordNameList.map((v) => { return v.table });
                    if (this.testRecordNameList.length == 0) {
                        this.$message.warning("当前项目组没有测试表！")
                    } 
                    else if (!tableNameArr.includes(this.axiosList.table_name)) {
                        this.$message.warning("当前项目组没有您想要的测试表，已为您切换测试表！")
                        //所有的测试表中不包含当前表，设置选中表为数据中第一个，且修改网址
                        this.$set(this.axiosList, "table_name", tableNameArr[0]);
                        this.$set(this.axiosList, "id", this.testRecordNameList[0].id);
                        let queryList = { project: this.projectCode, testRecordName: tableNameArr[0], id: this.testRecordNameList[0].id};
                        let url = location.pathname + this.$publicJS.getQueryStr(queryList);
                        history.pushState({ url: url, title: document.title }, document.title, url);
                        this.$route.query.testRecordName = this.axiosList.table_name;
                        this.getTableData()
                        this.getSceneData()
                        this.getDeviceData()
                    } 
                    else {
                        this.getTableData()
                        this.getSceneData()
                        this.getDeviceData()
                    }
                    this.canLoadTable = true
                }
            })
        },
        checkTestConclusion(){
            this.$refs.editConclusionRef.openDialog();
        },
        //表格数据列
        getTableData() {
            this.$codePost("/mobileWeaknetTest/get_test_record/", { application_id: this.axiosList.id,content_name:this.axiosList.table_name, table_name: this.axiosList.table_name }).then(res => {
                if(res.code == 200){
                    this.tableList = res.data
                }
            })
        },

        //切换测试表
        changeTable(val) {
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
    

        editSceneTemp(){
            this.getSceneTemp({project: 'all'})
            this.$refs.editSceneTempRef.openDialog();
        },

        // 获取项目组数据
        async getProject() {
            let res = await this.$codePost("/expertCompatibility/get_expert_group/", {}, { operation: "获取项目组数据", failed: true });
            if (res.code == 200) {
                this.projectClassifyArr = res.data;
            }
        },

        // 获取场景数据
        async getSceneData(){
            let list = {
                id: this.axiosList.id,
                table_name: this.axiosList.table_name
            }
            let res = await this.$codePost("/mobileWeaknetTest/get_test_scene/", list, { operation: "获取场景数据", failed: true });
            if(res.code == 200){
                this.sceneData = res.data
            }
            this.addDataShowList = []
        },

        // 获取测试设备数据
        async getDeviceData(){
            let list = {
                application_id: this.axiosList.id,
            }
            let res = await this.$codePost("/mobileWeaknetTest/get_test_device/", list, { operation: "获取测试设备数据", failed: true });
            if(res.code == 200){
                this.deviceData = res.data

                // 去除已经删除的设备数据
                this.deviceData = this.deviceData.filter(function(item){
                    return item.is_delete != "true"
                })
            }
        },


        // 编辑测试场景
        editTestScene(item){
            this.editSceneName = "修改"
            this.$refs.editSceneRef.openDialog(item);
        },


        editTestDevice(){
            this.$refs.editTestDeviceRef.openDialog();
        },


        sceneTableData(item){
            return this.tableList.filter(i=>{
                return i.scene_id == item.id
            })
        },

        afterEdit(){
            this.getTableData()
        },

        changeSceneName(val){
            this.editSceneName = val
        },

        changeSceneTempName(val){
            this.editSceneTempName = val
        },

        checkTestDevice(){
            this.$refs.checkTestDeviceRef.openDialog();
        },

    },

}
</script>
<style scoped>
.box-card{
    margin-top: 15px;
}
.clearfix{
    
}

.el-card /deep/ .el-card__header {
    background: #f0f1f2;
    font-size: 16px;
}

.remind-div{
    text-align: center;
    margin-top: 2rem;
}
</style>


