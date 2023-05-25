<template>
    <div class="start-test">
        <!-- 其他子组件 -->
        <!-- <edit-column ref="editColumnRef" :table-name="axiosList.table_name" @afterEdit="getTableAndCustomColumn"/> -->
        <add-test-scene 
            ref="editSceneRef" 
            :editSceneName="editSceneName" 
            :sceneTempData="sceneTempData" 
            :axiosList="axiosList" 
            @changeSceneName="changeSceneName" 
            @afterEdit="getTableData"></add-test-scene>
        <edit-scene-temp 
            ref="editSceneTempRef" 
            :appUrl="appUrl" 
            :projectClassifyArr="projectClassifyArr" 
            :sceneTempData="sceneTempData" 
            :editSceneTempName="editSceneTempName" 
            @changeSceneTempName="changeSceneTempName" 
            @afterEdit="getSceneTemp({project: 'all'})"></edit-scene-temp>
        <edit-test-device :deviceData="deviceData" @afterEdit="getDeviceData" ref="editTestDeviceRef"></edit-test-device>
        <add-test-content 
            ref="addTestContentRef"
            :classNameList="classNameList"
            :axiosList="axiosList" 
            :deviceData="deviceData"
            @afterEdit="getTableData"></add-test-content>
        <add-test-mission 
            ref="addTestMissionRef" 
            :sceneTempData="sceneTempData" 
            :deviceData="deviceData" 
            :testerOption="testerOption"
            @afterEdit="getTableData"></add-test-mission>
        <compare-order
            ref="compareRef"
            :axiosList="axiosList"></compare-order>
        <transfer-mission ref="transferMissionRef" @afterTransferMission="getTableData" :testerOption="testerOption"></transfer-mission>
        <self-dialog ref="workTimeRef" 
            :dialog-data="{ title:'登记工时', width: '30%', confirmName: '确认', closeName: '取消' }" 
            @confirm="uploadWorkTime">
                <div style="margin:auto; width: 60%;">
                    <el-form ref="workTimeForm" :model="workTimeForm" label-width="80px">
                        <el-form-item label="工时">
                            <el-input-number v-model="workTimeForm.work_time" :min="0" :max="1000" :step="1"></el-input-number> 分钟
                        </el-form-item>
                    </el-form>
                </div>
            </self-dialog>

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
                    <el-button type="primary" size="small" @click="addTestMission">分配测试任务</el-button>
                    <el-button type="warning" size="small" @click="editTestDevice">编辑测试设备</el-button>
                    <el-button type="danger" size="small" @click="editSceneTemp">编辑场景模板</el-button>
                    <!-- <el-button type="info" size="small" @click="editColumns">编辑自定义列</el-button> -->
                    <el-button type="info" size="small" @click="editCompare">对比策略</el-button>
                </div>
                <!-- 测试要求 -->
                <test-requirement :testDetail="testDetail" :testRequest="testRequest" :serverName="'performance'"></test-requirement>
                <div v-loading="dataLoading">
                    <!-- qa-设备-场景 -->
                    <div v-if="tableList && tableList.length > 0">
                        <div v-for="item,k in tableList" class="report-card" :key="k">
                            <div class="card-title" @click="item.show = !item.show" >
                                <div class="title">{{ item.test_qa_name ? item.test_qa_name:item.test_qa }}</div>
                                <div class="other-span"></div>
                                <div class="expand-div">
                                    <div class="expand-icon">
                                        <i :class="[item.show ? 'el-icon-arrow-up':'el-icon-arrow-down']" style="color:#ffffff"></i>
                                    </div>
                                    <div class="expand">{{ item.show ? '收起':'展开' }}</div>
                                </div>
                            </div>
                            <div v-if="item.show" class="card-body" style="padding-bottom: 2px;">
                                <div v-for="device,i in item.device" :key="k+'_'+i" class="report-card">
                                    <div class="card-title" style="background: #708090; height: 30px;">
                                        <div class="title" style="font-size: 15px; vertical-align: center; line-height: 30px;">
                                            {{ device.device }}({{ device.device_name }})
                                        </div>
                                        <!-- <el-tooltip :content="'删除设备【'+device.device+'】'" placement="top">
                                            <i class="el-icon-delete" style="cursor: pointer; vertical-align: center; line-height: 30px; margin-left: 8px;" @click="deleteTestDevice(device)"></i>
                                        </el-tooltip> -->
                                        <div class="other-span" style="font-size: 14px; vertical-align: center; line-height: 30px;">
                                            <el-tooltip content="新增测试场景" placement="top">
                                                <svg @click="addTestScene(device,item.test_qa)" style="margin-top: 8px; cursor: pointer; margin-left: -8px;" t="1681287448439" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2305" width="16" height="16"><path d="M885.9 352l0 532.7L139.2 884.7 139.2 139l634.7 0 0-75.2L120.4 63.8c-31.1 0-56.4 25.3-56.4 56.4l0 783.3c0 31.1 25.3 56.4 56.4 56.4l784.3 0c31.1 0 56.4-25.3 56.4-56.4L961.1 352 885.9 352 885.9 352zM885.9 352" p-id="2306"></path><path d="M773.6 541.7c8.3-8.3 12.8-19.3 12.8-30.9 0-11.7-4.6-22.7-12.8-30.9-8.3-8.3-19.3-12.8-30.9-12.8L555 467.1 555 279.3c0-11.7-4.6-22.7-12.8-30.9-8.3-8.3-19.3-12.8-30.9-12.8-11.7 0-22.7 4.6-30.9 12.8-8.3 8.3-12.8 19.3-12.8 30.9L467.6 467.1 279.7 467.1c-11.7 0-22.7 4.6-30.9 12.8-8.3 8.3-12.8 19.3-12.8 30.9 0 11.7 4.6 22.7 12.8 30.9 8.3 8.3 19.3 12.8 30.9 12.8l187.8 0 0 187.8c0 24.1 19.6 43.8 43.8 43.8 11.7 0 22.7-4.6 30.9-12.8 8.3-8.3 12.8-19.3 12.8-30.9L555 554.6l187.8 0C754.4 554.6 765.4 550 773.6 541.7L773.6 541.7zM773.6 541.7" p-id="2307"></path></svg>
                                            </el-tooltip>
                                            
                                        </div>
                                        <div class="expand-div">
                                            <el-tooltip :content="'转单，将'+ device.device +'下所有未完成的测试场景转给别人'" placement="top">
                                                <i class="el-icon-refresh" style="margin-left: 8px; vertical-align: center; line-height: 30px; cursor: pointer;" @click="transferMission(scene, device)"></i>
                                            </el-tooltip>
                                            <el-tooltip :content="'删除设备【'+device.device+'】'" placement="top">
                                                <i class="el-icon-delete" style="cursor: pointer; vertical-align: center; line-height: 30px; margin-left: 8px;" @click="deleteTestDevice(device)"></i>
                                            </el-tooltip>
                                            <!-- <i @click="item.show = !item.show" :class="[item.show ? 'el-icon-arrow-up':'el-icon-arrow-down']" style="color:#ffffff; margin-top: 5px;"></i> -->
                                        </div>
                                    </div>
                                    <div class="card-body" style="background: #f3f4f6; padding-top:10px; padding-bottom: 2px;">
                                        <div v-for="scene,j in device.scene" :key="k+'_'+i+'_'+j" class="report-card">
                                            <div class="card-title" style="background: #f3f4f6; height: 25px;">
                                                <div class="title" style="color: #303133;font-size: 15px; vertical-align: center; line-height: 25px;">
                                                    {{ scene.scene_name }}
                                                    <span v-if="scene.work_time" style="color:green;">【已完成】</span>
                                                    <!-- <el-tooltip :content="'删除测试场景【'+scene.scene_name+'】'" placement="top">
                                                        <i class="el-icon-delete" style="cursor: pointer;" @click="deleteTestScene(scene)"></i>
                                                    </el-tooltip> -->
                                                    <el-tooltip content="编辑测试场景" placement="top">
                                                        <i class="el-icon-edit" style="cursor: pointer; margin-left: 8px;" @click="editTestScene(scene,device)"></i>
                                                    </el-tooltip>
                                                    <el-tooltip content="上传测试数据" placement="top">
                                                        <i class="el-icon-upload" style="margin-left: 8px; cursor: pointer;" @click="addTestRecord(scene)"></i>
                                                    </el-tooltip>
                                                    <el-tooltip :content="'转单，将'+ device.device +'下 '+scene.scene_name + ' 转给别人'" placement="top" v-if="!scene.work_time">
                                                        <i class="el-icon-refresh" style="margin-left: 8px; cursor: pointer;" @click="transferMission(scene, device)"></i>
                                                    </el-tooltip>
                                                    <el-tooltip content="测试完成，登记工时" placement="top">
                                                        <i class="el-icon-s-order" style="margin-left: 8px; cursor: pointer;" @click="finishScene(scene, device)"></i>
                                                    </el-tooltip>
                                                </div>
                                                <div class="other-span"></div>
                                                <div class="expand-div">
                                                    <el-tooltip :content="'删除测试场景【'+scene.scene_name+'】'" placement="top">
                                                        <i class="el-icon-delete" style="cursor: pointer;" @click="deleteTestScene(scene)"></i>
                                                    </el-tooltip>
                                                </div>
                                            </div>
                                            <scene-table 
                                                :isFirst="true" 
                                                :ref="'table'+'-'+k+'-'+i+'-'+j" 
                                                :basicColumnData="outterColumn(scene)" 
                                                :tableData="scene.class && scene.class[0] != null && scene.class[0] != 'null' ? scene.class:[]"
                                                @openEditDialog="editTestRecord"
                                                @afterEdit="getTableData"></scene-table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div v-else class="remind-div">没有测试任务，请先分配测试任务进行测试！</div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import formRule from "@/utils/formRule.js"
import SceneTable from '@/components/StartTest/Performance/SceneTable'
import AddTestScene from '@/components/StartTest/Performance/AddTestScene'
import EditSceneTemp from '@/components/StartTest/PerformancePC/EditSceneTemp'
import EditTestDevice from '@/components/StartTest/Performance/EditTestDevice'
import AddTestContent from '@/components/StartTest/Performance/AddTestContent'
import TestRequirement from '@/components/StartTest/Common/TestRequirement'
import AddTestMission from '@/components/StartTest/Performance/AddTestMission'
import EditColumn from '@/components/StartTest/Performance/EditColumn'
import CompareOrder from '@/components/StartTest/Performance/CompareOrder'
import Sortable from 'sortablejs'
import TransferMission from '@/components/StartTest/Performance/TransferMission'
import {getExpertGroup} from '@/api/common.js'
export default {
    components: {
        SceneTable,
        AddTestScene,
        EditSceneTemp,
        EditTestDevice,
        AddTestContent,
        TestRequirement,
        AddTestMission,
        EditColumn,
        CompareOrder,
        TransferMission
    },
    data() {
        return {
            workTimeForm: {
                work_time: "",
            },
            scene: {},
            device: {},
            testerOption: [],
            dataLoading: false,
            recordData: [],
            // isPublish: false,
            selectCompareList:[],
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
                    titleName: '操作',
                    propName: 'opration',
                    width: '120px'
                }, 
                {
                    titleName: '组别名',
                    propName: 'class_name',
                    // type: "normal",
                },
                {
                    titleName: '原始包大小',
                    propName: 'origin_package_size',
                    type: "normal"
                }, 
                {
                    titleName: '实体包大小',
                    propName: 'real_package_size',
                    type: "normal",
                }, 
                {
                    titleName: '平均内存占用',
                    propName: 'memory_usage',
                    type: "normal",
                }, 
                {
                    titleName: '最大内存占用',
                    propName: 'memory_usage_max',
                    type: "normal",
                }, 
                {
                    titleName: 'CPU占用',
                    propName: 'cpu_usage',
                    type: "normal",
                }, 
                {
                    titleName: 'GPU使用率',
                    propName: 'gpu_use_rate',
                    type: "normal",
                }, 
                {
                    titleName: '帧率',
                    propName: 'fps',
                    type: "normal",
                }, 
                {
                    titleName: '流量',
                    propName: 'flow',
                    type: "normal",
                }, 
                {
                    titleName: '耗电量',
                    propName: 'power_consumption',
                    type: "normal",
                }, 
                {
                    titleName: '冷启动时间',
                    propName: 'cold_start_used',
                    type: "normal",
                },       
            ],
            editSceneTempForm: {
                project: '',
                project_name: '',
                scene_name: '',
                remarks: '',
                description: '',
            },
            editSceneTempFormRules: {
                scene_name: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                project: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                description: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
            },
            editSceneTempName: '新增',
            projectClassifyArr: [],
            sceneTempData: [],  // 场景模板数据
            selectedTempId: "",   // 选择的场景模板
            editSceneName: "新增",
            sceneData: [],  // 场景数据
            deviceData:[],
            addDeviceForm: {
                name:"",
                disk_type:"",
                system_version:"",
                cpu_name:"",
                mem_size:"",
                gpu_name:"" ,
                test_tool:"",
                server: "",
                resolution: "",
            },
            addDeviceFormRules: {
                name: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                disk_type: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                system_version: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                cpu_name: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                mem_size: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
                gpu_name: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],
            },
            appUrl: "mobilePerfTest",
            testRequest:[
                {
                    propName:"test_version",
                    titleName:"包体版本",
                },
                {
                    propName:"test_reason",
                    titleName:"测试原因",
                },
            ],
            testDetail:{},
            classNameList:[],
            currentTableData: [],
            expandRow: null,
            fieldList: [],
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
        },
        outerColumn(){
            return this.basicColumnData
        },

        performanceFiledList() {
            return this.$store.getters.getPerformanceFiledList;
        },
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
            
            this.getFieldList()
            this.getSceneTemp({project: this.projectCode})
            this.getTestDetail()
            this.getProject()
            // this.getSceneData()
            this.getQaList()
            this.getDeviceData()
            this.getAllRecordTable({ project: "all", test_status: '1' });
            // this.getTableData()
        }
    },
    mounted() {
        this.$store.commit("setPageIsLoading", false);
    },
    methods: {
        uploadWorkTime(){
            let list = {
                id: this.scene.id,
                work_time: this.workTimeForm.work_time,
                device_name: this.device.device_name,
            }
            this.$codePost("/mobilePerfTest/edit_test_scene/", list, { operation: "登记工时", success:true, failed: true }).then(res => {
                
                this.$refs.workTimeRef.closeDialog();
                this.getTableData()
                this.scene = {}
                this.device = {}
                this.workTimeForm.work_time = ""
            })
        },
        finishScene(scene, device){
            this.scene = scene
            this.device = device
            if(scene.work_time){
                this.workTimeForm.work_time = scene.work_time
            }
            this.$refs.workTimeRef.openDialog();
        },
        // 获取测试人员信息
        getQaList() {
            this.$codePost("/service/get_qa_list/").then(res => {
                if (res.code == 200) {
                    this.testerOption = res.data;
                }
            })
        },
        transferMission(scene, device){
            this.$refs.transferMissionRef.openDialog(scene, device);
        },
        editCompare(){
            this.$refs.compareRef.openDialog()
        },
        getFieldList(){
            this.basicColumnData = this.performanceFiledList
        },

        outterColumn(scene){
            let basicColumnData = [
                {
                    titleName: '组别名',
                    propName: 'class_name',
                    type: "normal",
                },
                {
                    titleName: '测试时间',
                    propName: 'date',
                    type: "normal",
                }
            ]
            this.basicColumnData.forEach(item => {
                if(scene.field_name){
                    if(scene.field_name.indexOf(item.propName) != -1){
                        basicColumnData.push(item)
                    }
                }else{
                    basicColumnData.push(item)
                }
            })
            basicColumnData.push({
                titleName: 'Pease链接',
                propName: 'pease_link',
                type: "normal",
            })
            basicColumnData.push({
                titleName: '操作',
                propName: 'opration',
            })
            return basicColumnData
        },

        innerColumn(scene){
            let basicColumnData = [
                {
                    titleName: '操作',
                    propName: 'opration',
                }, 
            ]
            this.basicColumnData.forEach(item => {
                if(scene.field_name && item.propName != "class_name" && scene.field_name.indexOf(item.propName) != -1){
                    basicColumnData.push(item)
                }
            })
            return basicColumnData
        },
       

        // 表格数据排序改变
        handleSortChange({ newIndex }){
            if (this.expandRow) {
                // 获取当前展开行的数据
                const expandRowData = this.expandRow.row;
                // 计算展开行在新位置的索引
                const newExpandRowIndex = newIndex.indexOf(expandRowData);
                // 更新展开行的位置
                this.tableData.splice(newExpandRowIndex, 0, this.tableData.splice(this.expandRow.index, 1)[0]);
                // 将展开行的状态重置为关闭状态
                this.$refs.table.toggleRowExpansion(expandRowData, false);
                this.expandRow = null;
            }
        },

        getTableAndCustomColumn(){

        },

        // 编辑自定义列
        editColumns() {
            this.$refs.editColumnRef.openEditDialog();
        },


        // 删除测试设备
        deleteTestDevice(device){
            let id_list = []
            device.scene.forEach(item => {
                id_list.push(item.id)
            })
            // console.log(id_list)
            let list = {
                id_list: JSON.stringify(id_list)
            }
            this.$confirm('此操作将永久删除设备【'+device.device+'】以及该设备下的场景和测试记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$codePost("/mobilePerfTest/delete_test_scene/", list).then(res => {
                    if(res.code == "200"){
                        if(res.msg && res.msg.length > 0){
                            this.$message.info(res.msg)
                        }else{
                            this.$message.success("删除成功！")
                        }
                        this.getTableData()
                    }
                })
            }).catch(() => {
                this.$message.info('已取消删除');
            });
        },

        // 展开行样式
        getRowClass(row, rowIndex){
            if(!row.row || !row.row.records || row.row.records.length == 0){
                return 'row-expand-cover'
            }
        },

        // 获取测试详情
        getTestDetail(){
            this.$codePost("/mobilePerfTest/get_test_apply_detail/", this.axiosList).then(res => {
                if(res.code == "200"){
                    this.testDetail = res.data
                    // console.log(this.testDetail)
                }
            })
        },

        // 删除测试场景
        deleteTestScene(row){
            let list = {
                id_list: JSON.stringify([row.id])
            }
            this.$confirm('此操作将永久删除场景【'+row.scene_name+'】, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$codePost("/mobilePerfTest/delete_test_scene/", list).then(res => {
                    if(res.code == "200"){
                        if(res.msg && res.msg.length > 0){
                            this.$message.info(res.msg)
                        }else{
                            this.$message.success("删除成功！")
                        }
                        this.getTableData()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },

        // 新增测试记录
        addTestRecord(item){
            this.$refs.addTestContentRef.addTestContent(item, 'add')
        },

        // 编辑测试记录
        editTestRecord(row, basicColumnData){
            this.$refs.addTestContentRef.openDialog(row, basicColumnData, 'edit')
        },

        // 新增测试场景
        addTestScene(item, qa){
            this.getSceneTemp({project: this.projectCode})
            this.$refs.editSceneRef.addTestScene(item, qa);
        },

        // 获取场景模板
        async getSceneTemp(list){
            let res = await this.$codePost("/mobilePerfTest/get_scene_schemas/", list, { operation: "获取场景数据", failed: true });
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
                        // this.getSceneData()
                        this.getDeviceData()
                    } 
                    else {
                        this.getTableData()
                        // this.getSceneData()
                        this.getDeviceData()
                    }
                    this.canLoadTable = true
                }
            })
        },


        //表格数据列
        getTableData() {
            // 设置加载
            this.dataLoading = true
            this.$codePost("/mobilePerfTest/get_test_record/", { application_id: this.axiosList.id,content_name:this.axiosList.table_name, table_name: this.axiosList.table_name }).then(res => {
                if(res.code == 200){
                    this.tableList = res.data.data
                    this.classNameList = res.data.class_name_list
                    // console.log(this.classNameList)
                }
                this.dataLoading = false
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
    
        // 编辑场景模板
        editSceneTemp(){
            this.getSceneTemp({project: 'all'})
            this.$refs.editSceneTempRef.openDialog();
        },

        // 获取项目组数据--带有数据提示
        async getProject() {
            let res = await getExpertGroup({}, { operation: "获取项目组数据", failed: true });
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
            let res = await this.$codePost("/mobilePerfTest/get_test_scene/", list, { operation: "获取场景数据", failed: true });
            if(res.code == 200){
                this.sceneData = res.data
            }
            this.addDataShowList = []
        },

        // 获取测试设备数据
        async getDeviceData(){
            let res = await this.$codePost("/mobilePerfTest/get_test_device/", {}, { operation: "获取测试设备数据", failed: true });
            if(res.code == 200){
                this.deviceData = res.data
            }
        },


        // 编辑测试场景
        editTestScene(scene,device){
            this.editSceneName = "修改"
            this.$refs.editSceneRef.openDialog(scene,device);
        },

        // 编辑测试设备
        editTestDevice(){
            this.$refs.editTestDeviceRef.openDialog();
        },

        changeSceneName(val){
            this.editSceneName = val
        },

        changeSceneTempName(val){
            this.editSceneTempName = val
        },

        // 分配测试任务
        addTestMission(){
            this.$refs.addTestMissionRef.openDialog();
        },
    },

}
</script>
<style scoped>
.remind-div{
    text-align: center;
    margin-top: 2rem;
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
}
/deep/ .el-table .row-expand-cover .cell .el-table__expand-icon{
    display: none;
}
</style>


