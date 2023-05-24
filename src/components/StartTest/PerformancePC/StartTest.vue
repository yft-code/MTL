<template>
    <div class="start-test">
        
        <!-- 其他子组件 -->
        <edit-test-scene 
            ref="editSceneRef" 
            :editSceneName="editSceneName" 
            :sceneTempData="sceneTempData" 
            @changeSceneName="changeSceneName" 
            @afterEdit="afterTestSceneEdit" 
            :deviceData="deviceData" 
            :axiosList="axiosList"></edit-test-scene>
        <edit-test-device ref="editTestDeviceRef" :deviceData="deviceData" :appUrl="appUrl" @afterEdit="getDeviceData"></edit-test-device>
        <compare-scene ref="compareRef" :oldRecordList="oldRecordList" :axiosList="axiosList" :comparerecordList="comparerecordList" @afterEdit="getCompareData"></compare-scene>
        <edit-scene-temp 
            ref="editSceneTempRef" 
            :projectClassifyArr="projectClassifyArr" 
            :appUrl="appUrl" 
            :sceneTempData="sceneTempData" 
            :editSceneTempName="editSceneTempName" 
            @changeSceneTempName="changeSceneTempName"
            @afterEdit="getSceneTemp({project: projectCode})"></edit-scene-temp>

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
                    <el-button v-if="!isPublish" type="primary" size="small" @click="addTestScene">新增测试场景</el-button>
                    <el-button v-if="!isPublish" type="warning" size="small" @click="selectCompareScene">选择测试对比记录</el-button>
                    <el-button type="danger" size="small" @click="editTestDevice">编辑测试设备</el-button>
                    
                    <el-button type="danger" size="small" @click="editSceneTemp">编辑场景模板</el-button>
                    <el-button v-if="!isPublish && sceneData.length !== 0" style="float: right" type="danger" size="small" @click="publishTest">发布本次测试数据</el-button>
                    <el-button v-if="isPublish && isCurrentQa" style="float: right" type="danger" size="small" @click="cancelPublish">取消发布</el-button>

                    <div v-if="sceneData.length === 0" class="remind-div">没有测试记录，请先添加测试场景进行测试！</div>

                    <!-- 各个场景 -->
                    <el-card v-for="item,k in sceneData" class="box-card" :key="k">
                        <div slot="header">
                            <span>{{item.scene_name}}</span>
                            <i v-if="!isPublish" class='el-icon-edit-outline edit-icon' 
                                style="margin-top:0;" 
                                @click="editTestScene(item, k)"></i>
                            <el-button v-if="!isPublish" style="float: right;" type="primary" size="small" @click=addTestRecord(item,k)>新增测试</el-button>
                        </div>
                        <div>
                            <!-- 表格部分 -->
                            <scene-table :basicColumnData="handleFieldData(item)" :key="tableKeyList[k]" :tableData="sceneTableData(item)" :tableKey="tableKeyList[k]" @afterEdit="afterEdit" :isPublish="isPublish"></scene-table>

                            <!-- 新增测试记录输入 -->
                            <div v-if="addDataShowList[k].show === '1'" style="marigin-left: 5px;margin-top: 15px;margin-bottom:15px;">
                                Pease链接：<el-input v-model="addDataShowList[k].pease_link" style="width:85%"></el-input>
                                <el-button type="warning" :disabled="confirmButtonState[k].disable" size="mini" style="margin-left:5px;" @click="getTestData(item, k)">确认</el-button>
                            </div>
                        </div>
                    </el-card>

                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import formRule from "@/utils/formRule.js"
import SceneTable from '@/components/StartTest/PerformancePC/SceneTable'
import EditTestScene from '@/components/StartTest/PerformancePC/EditTestScene'
import EditTestDevice from '@/components/StartTest/PerformancePC/EditTestDevice'
import CompareScene from '@/components/StartTest/PerformancePC/CompareScene'
import EditSceneTemp from '@/components/StartTest/PerformancePC/EditSceneTemp'

export default {
    components: {
        SceneTable,
        EditTestScene,
        EditTestDevice,
        CompareScene,
        EditSceneTemp
    },
    data() {
        return {
            isPublish: false,
            canLoadTable: false,
            axiosList: {
                table_name: "",
                key: "",
                id: "",
                test_type: 1,
                project: ""
            },
            testRecordNameList: [],
            tableList: [],
            editSceneTempName: '新增',
            projectClassifyArr: [],
            sceneTempData: [],  // 场景模板数据
            editSceneName: "新增",
            sceneData: [],  // 场景数据
            deviceData:[],
            
            oldRecordList: [],
            comparerecordList: [],
            addDataShowList: [],
            tableKeyList: [],
            confirmButtonState: [],
            fixList: [
                'stuck_frame_rate',
                'test_time',
                'upload_time',
            ],
            unfixList: [
                'cpu',
                'fps',
                'ram',
                'gpu_memory',
                'gpu'
            ],
            appUrl: "pcPerfTest",
            isCurrentQa: false,
        }
    },
    computed: {
        projectCode() {
            return this.$store.getters.getProjectCode;
        },
        isTester() {
            return this.$store.getters.getIsTester;
        },
        basicColumnData() {
            return this.$store.getters.getBasicColumnData;
        },
        startTestDict(){
            return this.$store.getters.getStartTestDict
        }
    },
    created() {
        if (!this.isTester) {
            this.$store.commit("setPageIsLoading", true);
            this.$router.push({
                path: '/expertPerformancePC/page/applicationRecord',
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
            this.canLoadTable = false
            this.getProject()
            this.getSceneData()
            this.getDeviceData()
            this.getAllRecordTable({ project: 'all', test_status: '1' });
            this.getTableData()
            this.getPublishState()
            this.getIsCurrentQa()
            this.canLoadTable = true
        }
    },
    mounted() {
        this.$store.commit("setPageIsLoading", false);
    },
    methods: {
        // 判断是否为当前测试接口人
        getIsCurrentQa(){
            let list = {
                id: this.axiosList.id
            }
            this.$codePost("/PerformancePCTest/check_is_qa/", list).then(res => {
                if(res.code == 200){
                    this.isCurrentQa = res.data
                }
            })
        },
        // 取消发布
        cancelPublish(){
            let confirmText = "是否取消本次发布"
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let list = {
                    id: this.axiosList.id
                }
                this.$codePost("/PerformancePCTest/report_cancel_publish/", list, { operation: "测试数据发布", success:true, failed: true }).then(res => {
                    if(res.code == 200){
                        this.getPublishState()
                    }
                })
            }).catch(() => { });
        },
        afterTestSceneEdit(k){
            this.getSceneData()
            this.tableKeyList[k] = !this.tableKeyList[k]
        },
        publishTest(){
            let confirmText = "是否发布本次测试结果"
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let list = {
                    id: this.axiosList.id,
                    table_name: this.axiosList.table_name,
                }
                this.$codePost("/" + this.appUrl + "/report_publish/", list, { operation: "测试数据发布", success:true, failed: true }).then(res => {
                    if(res.code == 200){
                        this.getPublishState()
                    }
                })
            }).catch(() => { });
            
        },

        // 获取发布状态
        getPublishState(){
            let list = {
                id: this.axiosList.id,
                table_name: this.axiosList.table_name,
            }
            this.$codePost("/" + this.appUrl + "/get_publish/", list).then(res => {
                if(res.code == 200){
                    this.isPublish = res.data[0].is_publish == "true" ? true : false
                }
            })
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

        //表格数据列
        getTableData() {
            this.$codePost("/" + this.appUrl + "/get_test_record/", { application_id: this.axiosList.id,table_name: this.axiosList.table_name }).then(res => {
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

        addTestScene(){
            this.getSceneTemp({project: this.projectCode})
            this.$refs.editSceneRef.openDialog();
        },

        selectCompareScene(){
            this.getCompareData()
            this.$refs.compareRef.openDialog();
        },

        async getCompareData(){
            let data = []
            let list = { project: this.projectCode, test_status: '2' }
            // 获取对比记录选项
            let res1 = await this.$codePost("/" + this.appUrl + "/get_apply_list/", list)
            if(res1.code == 200){
                data = res1.data
            }
            let compareNames = []
            list = {id: this.axiosList.id, table_name: this.axiosList.table_name}
            let res2 = await this.$codePost("/" + this.appUrl + "/get_compare_data/", list)
            if(res2.code == 200){
                this.comparerecordList = res2.data
                this.comparerecordList.forEach(item => {
                    compareNames.push(item.content_name)
                })
            }
            this.oldRecordList = []
            data.forEach(item => {
                if(compareNames.indexOf(item.table) == -1){
                    this.oldRecordList.push(item)
                }
            })
            this.oldRecordList = this.oldRecordList.filter(item => {
                return this.axiosList.table_name !== item.table
            })
        },

        editSceneTemp(){
            this.getSceneTemp({project: 'all'})
            this.$refs.editSceneTempRef.openDialog();
        },

        // 获取项目组数据
        async getProject() {
            let res = await this.$codePost("/" + this.appUrl + "/get_expert_group/", {}, { operation: "获取项目组数据", failed: true });
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
            let res = await this.$codePost("/" + this.appUrl + "/get_test_scene/", list, { operation: "获取场景数据", failed: true });
            if(res.code == 200){
                this.sceneData = res.data
            }
            this.addDataShowList = []
            this.tableKeyList = []
            this.confirmButtonState = []
            this.sceneData.forEach(item => {
                this.addDataShowList.push({
                    scene_id: item.id,
                    show: "0",
                    pease_link: "",
                })
                this.tableKeyList.push(true)
                this.confirmButtonState.push({
                    scene_id: item.id,
                    disable: false,
                })
            })
        },

        // 获取测试设备数据
        async getDeviceData(){
            let res = await this.$codePost("/" + this.appUrl + "/get_test_device/", {}, { operation: "获取测试设备数据", failed: true });
            if(res.code == 200){
                this.deviceData = res.data

                // 去除已经删除的设备数据
                this.deviceData = this.deviceData.filter(function(item){
                    return item.is_delete != "true"
                })
            }
        },

        // 获取场景模板
        async getSceneTemp(list){
            let res = await this.$codePost("/" + this.appUrl + "/get_scene_schemas/", list, { operation: "获取场景数据", failed: true });
            if(res.code == 200){
                this.sceneTempData = res.data
            }
        },

        // 编辑测试场景
        editTestScene(item, k){
            this.editSceneName = "修改"
            this.$refs.editSceneRef.openDialog(item, k);
        },

        editTestDevice(){
            this.$refs.editTestDeviceRef.openDialog();
        },

        addTestRecord(item,k){
            if(this.sceneTableData(item).length !== 0){
                return this.$message.warning('该场景下已存在测试记录，请不要重复添加！')
            }
            this.addDataShowList[k].show = this.addDataShowList[k].show == '1' ? '0' : '1'
        },

        getTestData(item, k){
            if(!this.addDataShowList[k].pease_link){
                return this.$message.warning("PEase链接不能为空！");
            }
            this.confirmButtonState[k].disable = true
            let list = {
                pease_link: this.addDataShowList[k].pease_link
            }
            this.$codePost("/" + this.appUrl + "/get_pease_data/", list, { operation: "获取Pease数据", failed: true }).then(res => {
                if (res.code == 200) {
                    let list1 = this.handlePeaseData(res.data)
                    list1['scene_id'] = item.id
                    list1['application_id'] = this.axiosList.id
                    list1['pease_link'] = this.addDataShowList[k].pease_link
                    list1['table_name'] = this.axiosList.table_name
                    this.upTestData(list1, k)
                }else{
                    this.getSceneData()
                    this.getTableData()
                }
            })
        },

        upTestData(list, k){
            list['upload_time'] = list['upload_time'].split(' ')[0]
            console.log(list)
            this.$codePost("/" + this.appUrl + "/create_test_record/", list, { operation: "上传测试数据", failed: true }).then(res => {
                if (res.code == 200) {
                    this.confirmButtonState[k].disable = false
                    this.getSceneData()
                    this.getTableData()
                }else{
                    this.getSceneData()
                    this.getTableData()
                }
            })
        },

        handlePeaseData(data){
            let afterPeaseData = {}
            data.forEach(item => {
                if(item.key == 'fps_percent'){
                    afterPeaseData['fps_40_49'] = item['fps_40_49']
                    afterPeaseData['fps_50_59'] = item['fps_50_59']
                    afterPeaseData['fps_60_69'] = item['fps_60_69']
                }else if(this.fixList.indexOf(item.key) != -1){
                    afterPeaseData[item.key] = item.value
                }else{
                    afterPeaseData[item.key+'_max'] = item['max_data']
                    afterPeaseData[item.key+'_avg'] = item['avg_data']
                    afterPeaseData[item.key+'_min'] = item['min_data']
                }
            })
            return afterPeaseData
        },


        sceneTableData(item){
            return this.tableList.filter(i=>{
                return i.scene_id === item.id
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

        handleFieldData(item){
            let fieldData = [
                {
                    titleName: '测试时间',
                    propName: 'date',
                    width: '100px',
                }, 
            ]
            if(item.field_name){
                this.basicColumnData.forEach(field => {
                    if(item.field_name.indexOf(field.titleName) !== -1){
                        fieldData.push(field)
                    }
                })
            }else{
                fieldData = fieldData.concat(this.basicColumnData)
            }
            fieldData.push({
                titleName: '测试人员',
                propName: 'test_qa',
                width: '85px',
            })
            fieldData.push({
                titleName: 'PEase链接',
                propName: 'pease_link',
            })
            return fieldData
        }

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


