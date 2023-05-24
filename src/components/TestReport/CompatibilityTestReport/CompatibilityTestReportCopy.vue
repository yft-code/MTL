<template>
    <div id="compatibilityTestReport" style="height: 100% text-align: center !important; scroll-behavior: smooth;" ref="content">
        <!-- 报告标题 -->
        <div class="reportTitle" :style="this.$route.path=='/mtl_test_platform/page/compatibilityTestReport' ? {'padding-top':'67px'} : {}">
            <span>{{ taskDetail['test_report_title'] || "" }}</span>
        </div>
        <div v-if="isPreview" class="compatibility-div" style="padding-top: 15px;">
            <!-- 测试任务详情 -->
            <el-card style="margin-top: 15px; position:relative;">
                <div class="decorate-detail">
                    测试任务详情
                    <i v-if="isTester && !isPreview" 
                        class='el-icon-edit-outline edit-icon' 
                        style="margin-top:0;" 
                        @click="editReportTask"></i>
                </div>
                <div class="detail-div">
                    <div class="icon-div">
                        <el-image
                            v-if="taskDetail['icon']"
                            style="width: 100px; height: 100px"
                            :src="'/static'+taskDetail['icon'].split('static')[1]"
                            fit="cover">
                            <div slot="error" style="width:100%;height:100%;display: flex;justify-content: center;align-items: center;">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                        <div v-else slot="error" style="width: 100px; height: 100px;display: flex;justify-content: center;align-items: center;">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                        
                    </div>
                    <div class="detail-form">
                        <div v-for="(item,index) in taskDetailList.commonItemArr" 
                            v-if="taskDetail[item.value] != '' || taskDetail[item.value] != null"
                            :key="index" 
                            :style="{ width: item.width, display: 'inline-block', 'margin-top': '0.6rem' }"
                            >
                            <span style="margin-left:8px;color:#666666;">
                                <span v-if="item.value == 'platform' && staticData">
                                    {{staticData.testSystem.join("，")}}
                                </span>
                                <span v-else>
                                    {{taskDetail[item.value]}}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="checkout-report" v-if="isTester && !isPreview">
                    <el-button :disabled="isExporting" type="primary" @click="exportExcel">{{ isExporting ? "正在导出 ..." : "导出报告" }}</el-button>
                </div>

                <el-dialog
                    title="编辑报告项"
                    :visible.sync="testDialogVisible"
                    width="30%"
                    :before-close="handleClose">
                    <template>
                        <el-form ref="taskFormRef" :model="taskFormList" :rules="itemRules" :show-message="false" label-width="7rem">
                            <self-form-item 
                                v-for="(item,index) in taskFormItemList"
                                :key="index"
                                :formItem="item" 
                                :formValue.sync="taskFormList[item.name]" 
                                />
                            <el-form-item label="App图片" class="public-dialog-form-item">
                                <self-picture-show 
                                    v-if="taskFormList.icon != ''" 
                                    :img-path="[taskFormList.icon]" 
                                    img-type="thumbnail"
                                    />
                                <el-upload 
                                    action="#" 
                                    accept=".jpg,.jpeg,.gif,.png,.bmp,.JPG,.JPEG,.GIF,.PNG,.BMP"
                                    :file-list="fileList" 
                                    :on-change="changeAppIcon" 
                                    :auto-upload="false" 
                                    :multiple="false" 
                                    :limit="1" 
                                    :show-file-list="false"
                                    >
                                    <span class="blue-span">上传</span>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                    </template>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="testDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="confirmEditReportBasic">确 定</el-button>
                    </span>
                </el-dialog>
            </el-card>
            <!-- <task-detail v-loading="isLoading" :axios-list="axiosList" :staticData="staticData" :isPreview="isPreview" :taskDetail="taskDetail" @afterEdit="afterEditMethod"/> -->

            <el-card style="margin-top: 15px; padding-top: 0;">
                <!-- 通过率标题 -->
                <div class="item-title">
                    测试通过率
                </div>
                <div v-loading="!staticData" style="height: 200px">
                    <!-- 数据部分 -->
                    <div class="rate-text">
                        <div class="rate-text-div">
                            <el-row>
                                <el-col :span="12">
                                    <div class="item">
                                        <div class="title">本次测试覆盖设备数</div>
                                        <span class="num">{{ staticData.device_number }}</span>
                                        <span>台</span>
                                    </div>
                                    <div class="item">
                                        <div class="title">设备通过率</div>
                                        <span class="num">{{ staticData.pass_rate ? parseFloat(staticData.pass_rate).toFixed(2) : '' }}</span>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="item">
                                        <div class="title">通过</div>
                                        <span class="num">{{ staticData.pass_device }}</span>
                                        <span>台</span>
                                    </div>
                                    <div class="item">
                                        <div class="title">不通过</div>
                                        <span class="num">{{ staticData.fail_device }}</span>
                                        <span>台万</span>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <!-- 饼图部分 -->
                    <div v-if="passRateData" class="rate-pie" id="pie-div">
                        <div ref="passRateRef" class="pass-rate-div"></div>
                    </div>
                </div>
            </el-card>
            <problem-detail :axios-list="axiosList" :report-type="reportType" :is-preview="isPreview"></problem-detail>
        </div>

        <div v-else class="compatibility-div" style="padding-top: 15px;">
            <!-- 测试任务详情 -->
            <el-card style="margin-top: 0; position:relative;">
                <!-- 测试任务详情标题 -->
                <div class="decorate-detail">
                    测试任务详情
                    <!-- 编辑按钮图标 -->
                    <i v-if="isTester && !isPreview" 
                        class='el-icon-edit-outline edit-icon' 
                        style="margin-top:0;" 
                        @click="editReportTask"></i>
                </div>
                <!-- 测试任务 -->
                <div class="detail-div">
                    <!-- 测试任务的icon -->
                    <div class="icon-div">
                        <el-image
                            v-if="taskDetail['icon']"
                            style="width: 100px; height: 100px"
                            :src="taskDetail['icon']"
                            fit="cover">
                            <div slot="error" style="width:100%;height:100%;display: flex;justify-content: center;align-items: center;">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                        <div v-else slot="error" style="width: 100px; height: 100px;display: flex;justify-content: center;align-items: center;">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                        
                    </div>
                    <!-- 测试任务的细节展示 -->
                    <div class="detail-form">
                        <div v-for="(item,index) in taskDetailList.commonItemArr" 
                            v-if="taskDetail[item.value] != '' || taskDetail[item.value] != null"
                            :key="index" 
                            :style="{ width: item.width, display: 'inline-block', 'margin-top': '0.6rem' }"
                            >
                            <span class="testInfoTitle" :style="{'width' : `${item.label == '智能兼容性测试报告' ? '9rem' : '4.5rem'}`}">{{item.label}}</span>
                            <span style="margin-left:8px;color:#666666;">
                                <span v-if="item.value == 'platform' && staticData">
                                    {{staticData.testSystem.join("，")}}
                                </span>
                                <span v-else>
                                    {{taskDetail[item.value]}}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <!-- 导出报告按钮 -->
                <div class="checkout-report" v-if="isTester && !isPreview">
                    <el-button :disabled="isExporting" type="primary" @click="exportExcel">{{ isExporting ? "正在导出 ..." : "导出报告" }}</el-button>
                </div>

                <!-- 测试任务详情的对话框 -->
                <el-dialog
                    title="编辑报告项"
                    :visible.sync="testDialogVisible"
                    width="30%"
                    :before-close="handleClose">
                    <!-- 测试任务详情可编辑表单 -->
                    <template>
                        <el-form ref="taskFormRef" :model="taskFormList" :rules="itemRules" :show-message="false" label-width="7rem">
                            <self-form-item 
                                v-for="(item,index) in taskFormItemList"
                                :key="index"
                                :formItem="item" 
                                :formValue.sync="taskFormList[item.name]" 
                                />
                        </el-form>
                    </template>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="testDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="confirmEditReportBasic">确 定</el-button>
                    </span>
                </el-dialog>
            </el-card>

            <!-- <task-detail v-loading="isLoading" :axios-list="axiosList" :staticData="staticData" :isPreview="isPreview" :taskDetail="taskDetail" @afterEdit="afterEditMethod"/> -->

            <!-- 高风险项 -->
            <div v-if="taskDetail['high_risk_items']">
                <span style="position:relative; top: 12px; left: 40px; z-index:999 !important;">高风险项</span>
                <el-card style="margin-top:0; padding-top: 10px; background: #fef0ef;">
                    {{taskDetail['high_risk_items']}}
                </el-card>
            </div>

            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <!-- 测试概况 -->
                <el-tab-pane label="测试概况" name="first">
                    <!-- 通过率 -->
                    <el-card style="margin-top: 0; padding-top: 0;">
                        <!-- 通过率标题 -->
                        <div class="item-title">
                            测试通过率
                        </div>
                        <div v-loading="!staticData" style="height: 200px">
                            <!-- 数据部分 -->
                            <div class="rate-text">
                                <div class="rate-text-div">
                                    <el-row>
                                        <el-col :span="12">
                                            <div class="item">
                                                <div class="title">本次测试覆盖设备数</div>
                                                <span class="num">{{ staticData.device_number }}</span>
                                                <span>台</span>
                                            </div>
                                            <div class="item">
                                                <div class="title">设备通过率</div>
                                                <span class="num">{{ staticData.pass_rate ? parseFloat(staticData.pass_rate).toFixed(2) : '' }}</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="item">
                                                <div class="title">通过</div>
                                                <span class="num">{{ staticData.pass_device }}</span>
                                                <span>台</span>
                                            </div>
                                            <div class="item">
                                                <div class="title">不通过</div>
                                                <span class="num">{{ staticData.fail_device }}</span>
                                                <span>台</span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <!-- 饼图部分 -->
                            <div v-if="passRateData" class="rate-pie" id="pie-div">
                                <div ref="passRateRef" class="pass-rate-div"></div>
                            </div>
                        </div>
                    </el-card>

                    <!-- 测试问题概述 -->
                    <el-card>
                        <!-- 问题概述标题 -->
                        <div class="item-title">
                            问题概述
                            <div class="title-content" v-show="totalProblemCount != 0">
                                <el-row>
                                    <el-col :span="4" style="margin-top: 30px;">本次测试共发现问题数 {{totalProblemCount}} 个，涉及相关设备 {{affectDeviceCount}} 台</el-col>
                                    <!-- 问题分布 -->
                                    <el-col :span="10" style="text-align: center">
                                        <div class="problem-chart-div" ref="problemDistributionRef"></div>

                                    </el-col>
                                    <!-- 级别分布 -->
                                    <el-col :span="10" style="text-align: center">
                                        <div class="problem-chart-div" ref="problemLevelRef"></div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-card>

                    <!-- 测试统计 -->
                    <el-card>
                        <div class="item-title">
                            测试统计
                        </div>
                        <div class="static-table-div">
                            <el-table v-loading="testStaticTableLoading" :data="testStaticTable" border stripe :header-cell-style="{background:'#eef1f6'}">
                                <el-table-column v-for="item,index in testStaticTableColData" 
                                    :key="index"
                                    :label="item.label"
                                    align="center">
                                    <template v-slot="scope">
                                        <div v-if="item.label == '问题类型'">
                                            <div v-for="q,k in scope.row.question" :key="k">
                                                {{q[item.prop]}}
                                            </div>
                                        </div>
                                        <div v-else-if="item.label == '失败机型数'">
                                            <div v-for="q,k in scope.row.question" :key="k" @mouseenter="onEnterDevice($event, scope.row, k)">
                                                {{q[item.prop]}}
                                            </div>
                                        </div>
                                        <div v-else>
                                            {{scope.row[item.prop]}}
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-card>

                    <!-- 测试统计中设备详情 -->
                    <div class="hover_con" v-show="dialogVisible" :style="positionStyle" @mouseleave="onLeaveDeviceInfo($event)">
                        <div v-for="item,index in deviceData" :key="index">
                            <span class="device-info-span" @click="handleDeviceClick(item)">{{item.device}}</span>（{{item.os}}）
                        </div>
                    </div>

                    <!-- 测试机型统计 -->
                    <el-card>
                        <div class="item-title">
                            测试机型统计
                        </div>
                        <test-device-group :axios-list="axiosList"></test-device-group>
                    </el-card>
                </el-tab-pane>

                <!-- 问题列表 -->
                <el-tab-pane label="问题列表" name="second">
                    <problem-detail :axios-list="axiosList" :report-type="reportType" :is-preview="isPreview"></problem-detail>
                </el-tab-pane>

                <!-- 设备列表 -->
                <el-tab-pane label="设备列表" name="third">
                    <device-detail :axios-list="axiosList" :report-type="reportType"></device-detail>
                </el-tab-pane>
            </el-tabs>
            <!-- 页面底部的空白区域 -->
            <!-- <div style="height: 40px; text-align:center; margin-top:15px; padding-bottom: 15px; color: red">到底部啦</div> -->
            <div class="backTop" @click="toTop">
                回到顶部<i class="el-icon-arrow-up"></i>
            </div>

            <div class="copyright-div">
                <!-- <div style="font-weight: 700">雷火MTL</div>
                <div style="margin-top: 18px;">网易公司版权所有 ©雷火测试中心 Copyright Leihuo. All Rights Reserved</div> -->
            </div>
        </div>
    </div>
</template>

<script>
import ProblemDetail from '@/components/TestReport/CompatibilityTestReport/ProblemDetail'
import DeviceDetail from '@/components/TestReport/CompatibilityTestReport/DeviceDetail'
import TestDeviceGroup from '@/components/TestReport/CompatibilityTestReport/TestDeviceGroup'
import TaskDetail from '@/components/TestReport/CompatibilityTestReport/TaskDetail'
export default {
    components: {
        ProblemDetail,
        DeviceDetail,
        TestDeviceGroup,
        TaskDetail
    },
    data() {
        return {
            isLoading: false,
            failStaticData: "",
            testStaticTableLoading: true,
            basicUploadAppIconFile:'',
            fileList: [],
            // 测试任务详情表单
            taskFormList: {
                test_report_title: "",
                app_name: "",
                app_version: "",
                test_content: "",
                high_risk_items:"",
                icon: "",
                smart_compatibility_report:'',
            },
            itemRules: {
                test_report_title: [{ required: true, message: '请输入测试报告标题', trigger: 'blur' }],
            },
            // 测试任务详情可编辑表单的遍历项
            taskFormItemList: [
                {
                    label: '测试报告标题',
                    name: 'test_report_title',
                    type: 'input',
                    class: 'public-dialog-form-item'
                }, {
                    label: 'App名称',
                    name: 'app_name',
                    type: 'input',
                    class: 'public-dialog-form-item'
                }, {
                    label: 'App版本',
                    name: 'app_version',
                    type: 'input',
                    class: 'public-dialog-form-item'
                }, {
                    label: '高风险项',
                    name: 'high_risk_items',
                    type: 'input',
                    class: 'public-dialog-form-item'
                },{
                    label: '测试内容',
                    name: 'test_content',
                    type: 'input',
                    class: 'public-dialog-form-item'
                }
            ],
            dialogVisible: false,
            positionStyle: {top:'750px',left:'1230px'},
            deviceData: [],
            // 问题总数
            totalProblemCount: 0,
            // 问题机型数
            affectDeviceCount: 0,
            isPreview: 0,
            // 测试统计表格数据
            testStaticTable: [],
            testStaticTableColData: [
                {
                    label: '设备类型',
                    prop: 'name'
                },
                {
                    label: '兼容性分数',
                    prop: 'compatibility_score'
                },
                {
                    label: '稳定性分数',
                    prop: 'stability_score'
                },
                {
                    label: 'P1机型数/总机型数',
                    prop: 'p1_pass_rate'
                },
                {
                    label: '通过率',
                    prop: 'device_pass_rate'
                },
                {
                    label: '问题类型',
                    prop: 'q_classification'
                },
                {
                    label: '失败机型数',
                    prop: 'device_num'
                }
            ],
            // 问题
            filter:{
                "q_classification":[{ "value": "q_classification", "label": "问题类型", "data":[{ "value": "", "label": "" }]}],
                "q_level":[{ "value": "q_level", "label": "问题级别", "data":[{ "value": "", "label": "" }]}],
            },
            statisticsData: {},
            passRateData:[],
            activeName: 'first',
            taskDetailList: {
                logo: "project_logo",
                apkName: "apk_name",
                commonItemArr: [
                    {
                        value: "app_name",
                        label: "App名称",
                        width: "40%",
                    },
                    {
                        value: "start_date",
                        label: "开始测试时间",
                        width: "40%",
                    },
                    {
                        value: "app_version",
                        label: "App版本",
                        width: "40%",
                    },
                    {
                        value: "end_date",
                        label: "结束测试时间",
                        width: "40%",
                    },
                    {
                        value: "platform",
                        label: "测试平台",
                        width: "40%",
                    },
                    {
                        value: "test_content",
                        label: "测试内容",
                        wdith: "40%",
                    },
                ]
            },
            // 测试任务详情
            taskDetail: {},
            staticData: "",
            axiosList: {
                table_name: this.$route.query.testRecordName,
                // test_type: this.$route.query.testType,
                test_type: '10',
            },
            reportType: "expert",
            packageType: 0, //0:测试概况,1:问题详情,2:设备详情
            testDialogVisible: false,
            reportTitle: '',
            isExporting: false,
        }
    },
    watch: {
        packageType(newVal,oldVal){
            // console.log(newVal)
            // console.log(oldVal)
            this.$store.commit("setProblemFilter", []);
        }
    },
    created(){
        if (this.$route.query.isPreview != undefined) {
            this.isPreview = this.$route.query.isPreview;
        }
        if (this.$route.query.packageType != undefined) {
            let packageType = parseInt(this.$route.query.packageType);
            if ([0, 1, 2].includes(packageType)) {
                //参数有效
                this.packageType = packageType;
                if(packageType === 0)   this.activeName='first'
                else if(packageType === 1)  this.activeName='second'
                else this.activeName='third'
            }
        }
        this.getPageData();
        this.getChartData()
        this.getReportTitle()       // 可以不用
    },
    computed: {
        isTester() {
            return this.$store.getters.getIsTester;
        }
    },
    methods: {
        //上传icon
        changeAppIcon(file, fileList) {
            this.basicUploadAppIconFile = file.raw;
            let picUrl = URL.createObjectURL(this.basicUploadAppIconFile);
            this.$set(this.taskFormList, "icon", picUrl);
        },

        // 鼠标进入失败机型数事件
        onEnterDevice(event, item, index){
            // console.log(event)
            // console.log(item)
            // console.log(index)
            // console.log(item.question[index])
            let top = event.clientY + 5
            this.positionStyle.top = top+'px';
            let left = event.clientX-82
            this.positionStyle.left = left+'px';
            let data = []
            item.question[index].device_list.forEach(i => {
                data.push(i)
            })
            // console.log(data)
            this.deviceData = data
            this.dialogVisible = true
        },

        // 鼠标离开失败机型数事件
        onLeaveDevice(event){
            this.dialogVisible = false
        },

        // 鼠标进入失败机型信息事件
        onEnterDeviceInfo(event){
            console.log("进入机型信息页")
        },

        // 鼠标离开失败机型信息事件
        onLeaveDeviceInfo(){
            console.log("离开机型信息页")
            this.dialogVisible = false
        },

        // 点击设备名称事件
        handleDeviceClick(item){
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            queryList.deviceId = item.id;
            this.$router.push({
                path: "/mtl_test_platform/page/problemDeviceDetail",
                query: queryList
            })
        },

        // 测试任务详情后编辑按钮的点击事件
        editReportTask(){
            console.log("编辑")
            let list = {};
            for (let k in this.taskFormList) {
                list[k] = this.taskDetail[k] || "";
            }
            this.taskFormList = list;
            this.basicUploadAppIconFile = "";
            this.testDialogVisible = true
        },

        // 编辑任务详情对话框关闭事件
        handleClose(){
            console.log("关闭对话框")
            this.getPageData()
            this.testDialogVisible = false
        },

        //确认修改报告项
        confirmEditReportBasic() {
            let hasError = this.$publicJS.checkFormData(this, "taskFormRef", "请填写测试报告标题！");
            if(!hasError){
                // 修改报告项
                let formData = new FormData();
                for (let k in this.taskFormList) {
                    if (k != 'icon') {
                        formData.append(k, this.taskFormList[k]);
                    }
                }
                if (this.basicUploadAppIconFile != "") {
                    formData.append("icon", this.basicUploadAppIconFile);
                }
                for (let k in this.axiosList) {
                    formData.append(k, this.axiosList[k]);
                }
                formData.append("id", this.$route.query.applicationId);
                formData.append("project", this.$route.query.project);

                // 调用修改报告项接口
                this.$formPost("/expertCompatibility/update_report_message/", formData, { operation: "编辑报告项", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        // 成功后
                        // 重新获取页面数据
                        this.getPageData()
                        this.getChartData()
                        // 关闭对话框
                        this.testDialogVisible = false
                    }
                })
            }
                
        },

        // 测试概况/问题详情/设备详情点击切换事件
        handleClick(target){
            this.activeName = target.name
            // console.log(target.name)
            if(target.name === 'first') this.packageType = 0
            else if(target.name === 'second') this.packageType = 1
            else this.packageType = 2
            // 切换url中的packageType
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            queryList.packageType = this.packageType;
            this.$publicJS.iframeParentPost(top.location.pathname, queryList, this);
        },

        // 获取页面信息
        getPageData() {
            this.isLoading = true;
            this.$codePost('/expertCompatibility/test_basic_info_report/', this.axiosList, { operation: "获取报告数据", failed: true }).then(res => {
                if (res.code == 200) {
                    this.taskDetail = res.data.task_detail;
                    this.staticData = res.data.statistics_data;
                    this.testStaticTable = res.data.form_data;
                    this.testStaticTableLoading = false
                    this.failStaticData = this.handleFailStaticData(this.testStaticTable)
                    this.passRateData = res.data.statistics_data.pie_chart;
                    this.drawPassRateData(this.passRateData)
                    this.isLoading = false;
                }
                this.$publicJS.iframeLoadingPost(false);
            })
        },

        // 处理失败的统计数据
        handleFailStaticData(data){
            let failData = {}
            data.forEach(item => {
                failData[item.name] = []
                item.question.forEach(item1 => {
                    item1.device_list.forEach(item3 => {                        
                        failData[item.name].push(item3.device + "(" + item3.os + ")")
                    })
                })
            })
            // console.log(failData)
            return failData
        },

        // 绘制通过率饼图
        drawPassRateData(data){
            // console.log(this.failStaticData)
            let failStaticData = this.failStaticData
            let myChart = this.$echarts.init(this.$refs.passRateRef);
            let option = {
                tooltip: {
                    axisPointer: { 
                        type: 'shadow'
                    },
                    formatter : function(params){  
  						var res = params.name + ":" + params.value + "台(" + params.percent + "%)"
                        if(params.data.name == "不通过"){
                            for(var i in failStaticData){
                                res = res + '<br/>' + i + "：<br/>&nbsp;&nbsp;&nbsp;&nbsp;" + failStaticData[i].join('<br/>&nbsp;&nbsp;&nbsp;&nbsp;')
                            }
                        }
  						return res;
					},
                    confine: true
                },
                color: ['#3e71fd', '#ff355f'],
                series: [
                    {
                        type: 'pie',
                        data: data,
                        radius: ['40%', '60%'],
                        label: {
                            show: true,
                            formatter: function(arg){
                                return arg.name + arg.value + '台\n' + arg.percent + '%'
                            }
                        },
                    }
                ]
            };
            myChart.setOption(option);
            window.addEventListener('resize', function() { myChart.resize() });
        },

        //获取报告标题，专家报告名称从后台获取，但实际上用不到
        getReportTitle() {
            let list = { id: this.$route.query.applicationId };
            this.$codePost("/expertCompatibility/test_report_info1/", list, { operation: "获取报告标题", failed: true }).then(res => {
                if (res.code == 200) {
                    this.reportTitle = res.data.test_report_title;
                }
            })
        },

        //导出报告
        exportExcel() {
            this.isExporting = true;
            // 导出测试报告接口
            this.$codePost("/expertCompatibility/export_report/", this.axiosList, { operation: "导出报告", failed: true }).then(res => {
                if (res.code == 200) {
                    let url = res.data;
                    window.location.href = url;
                    this.exportExcelVisible = false;
                }
                this.isExporting = false;
            })
        },
        
        // 获取测试问题统计信息数据
        getChartData() {
            this.$codePost("/expertCompatibility/expert_test_question_static/", this.axiosList, { operation: "获取统计数据", failed: true }).then(res => {
                if (res.code == 200) {
                    // this.showPage = true;
                    this.statisticsData = {
                        questionType: res.data.question_type.detail_info,
                        affectDevice: res.data.affect_device,
                        affectUser: res.data.affect_user,
                    }
                    if(!this.isPreview){
                        this.drawProblemLevelChart(res.data.question_level);
                        this.drawProblemDistributionChart(res.data.question_type.detail_info)
                    }
                    this.computeAffectDeviceNumber(res.data.affect_device)
                }
                this.$publicJS.iframeLoadingPost(false);
            })
        },

        // 计算问题机型数
        computeAffectDeviceNumber(data){
            this.affectDeviceCount = this.eachSum(data.y_data, this.affectDeviceCount)
        },

        // 遍历求和方法
        eachSum(data, sum){
            data.forEach(item => {
                sum += item
            })
            return sum
        },
        afterEditMethod(){
            this.getPageData()
        },

        // 绘制问题级别的柱状图
        drawProblemLevelChart(data){
            this.totalProblemCount = this.eachSum(data.y_data, this.totalProblemCount)
            this.$nextTick(() => {
                let _this = this
                let myChart = this.$echarts.init(this.$refs.problemLevelRef);
                let option = {
                    title: {
                        show: true,
                        text: '级别分布',
                        textStyle: {
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontSize: '16',
                        },
                        bottom: 150,
                        left: 80,
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: ''        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    // grid: {
                    //     left: "20%",
                    //     right: '15%',
                    // },
                    xAxis: {
                        type: 'category',
                        data: data.x_data,
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: {//去除网格线
                            show: false
                        }
                    },
                    series: [
                        {
                            name: '问题数量',
                            type: 'bar',
                            barMaxWidth: '20',
                            stack: '总量',
                            data: data.y_data,
                        },
                    ]
                };
                myChart.setOption(option);
                window.addEventListener('resize', function() { myChart.resize() });
            })
        },

        // 绘制问题分布柱状图
        drawProblemDistributionChart(data){
            let x_data = []
            let y_data = []
            data.forEach((item) => {
                x_data.push(item.name)
                y_data.push(item.value)
            })
            this.$nextTick(() => {
                let _this = this
                let myChart = this.$echarts.init(this.$refs.problemDistributionRef);
                let option = {
                    title: {
                        show: true,
                        text: '问题分布',
                        textStyle: {
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontSize: '16',
                        },
                        bottom: 150,
                        left: 80,
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: ''        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    // grid: {
                    //     left: '40%'
                    // },
                    yAxis: {
                        // name: '问题个数',
                        type: 'value',
                        minInterval: 1,
                        nameTextStyle: {
                            fontSize: 10
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    xAxis: {
                        type: 'category',
                        nameTextStyle: {
                            fontSize: 12
                        },
                        axisLabel: {
                            //x轴文字的配置
                            show: true,
                            interval: 0,//使x轴文字显示全
                        },
                        data: x_data,
                    },
                    series: [
                        {
                            name: '问题数量',
                            type: 'bar',
                            barMaxWidth: '20',
                            stack: '总量',
                            data: y_data
                        },
                    ]
                };
                myChart.setOption(option);
                window.addEventListener('resize', function() { myChart.resize() });
            })
        },

        toTop(){
            this.$refs.content.scrollIntoView()
        }
    }
}
</script>

<style lang="less" scoped>
.test-device-static-div {
    width: 350px;
    height: 300px;
    margin: auto;
}
.problem-chart-div {
    margin-left: 30%;
    height: 200px; 
    width: 240px;
}
.rate-text {
    width: 45%;
    margin-left: 4%;
    margin-right: 1%;
    display: inline-block;
    vertical-align: top;
    padding-top: 1rem;
    box-sizing: border-box;
    .rate-text-div {
        width: 90%;
        margin: 0 auto;
        .item {
            border-left: 1px solid #e6e6e6;
            width: 90%;
            margin: 0 0;
            display: inline-block;
            line-height: 1.8rem;
            padding: 0 1rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            font-size: 14px;
            color: rgb(102, 102, 102);
            .title {
                font-size: 16px;
            }
            .title::after {
                content: "："
            }
            .num {
                font-size: 18px;
                color: rgb(0, 0, 0);
            }
        }
    }
}
.rate-pie {
    width: 40%;
    height: 200px;
    margin-left: 6%;
    display: inline-block;
    vertical-align: top;
}
.item-title {
    font-size: 18px;
    margin-left: 25px;
    margin-top: 15px;
    .title-content {
        margin-left: 5px;
        color: #666666;
        font: 16px 'Microsoft YaHei';
    }
}
.static-table-div {
    margin-left: 26px;
    margin-right: 26px;
    margin-top: 15px;
    margin-bottom: 25px;
}
.btn-group {
    margin-top: 15px;
    text-align: center;
    .el-button {
        margin-left: 20px;
    }
}
.chart-group {
    margin-top: 20px;
}
.detail-div {
    display: flex;
    width: 100%;
    margin-left: 20px;
}
.detail-div .icon-div {
    float: left;
    margin: 5px 5px;
    display: inline-block;
    vertical-align: middle;
}
.detail-div .detail-form {
    position: relative;
    float: left;
    display: inline-block;
    margin-top: 5px;
    width: 90%;
    margin-left: 50px;
}
.decorate-detail {
    margin-left: 20px;
    font-size: 20px;
    font-weight: bold;
}
.el-tabs {
    margin-top: 15px;
}
.el-card {
    margin-top: 30px;
}
.compatibility-div {
    margin-left: 5%;
    margin-right: 5%;
    height: 100%;
    width: 90%;
    
    .reportTitleDiv {
        display: flex;
        justify-content: space-between;
        padding: 5px 0px;
    }

    .reportTitle h3 {
        color: #555;
        font-size: 24px;
        padding: 20px 0px !important;
    }
}
.hover_con{
    position: fixed;
    padding: 10px;
    border: 1px solid #eee;
    background: #fff;
    z-index: 999 !important;
}

.checkout-report{
    position: absolute; top: 20px; right: 20px;
    color: #e6a23c;
    font-weight: 600;
    font-size: 14px;
}
.device-info-span {
    cursor: pointer;
    color: #4876f2;
}
.pass-rate-div{
    width: 400px;
    height: 200px;
}

/deep/ .el-tabs__item:hover {
  color: #333333;
}

/deep/ .el-tabs__item.is-active {
    color: #ffffff;
    background: #3e72fd;
}
</style>
<style scoped>

.copyright-div {
    width: 100%;
    margin-top: 40px;
    padding-bottom:40px;
    color: #999999;
    font-size: 14px;
    text-align: center;
}
.backTop{
    position: absolute;
    right: 18px;
    bottom: 20px;
    z-index: 999;
    cursor: pointer;
}
.reportTitle {
    width: 100%;
    height: 110px;
    background: url('../../../assets/img/fastReportheader.png');
    color: white;
    font-size: 36px;
    text-align: center;
    line-height: 110px;
}
</style>