<template>
    <div id="compatibilityTestReportPC" style="backgroundColor: #f3f4f6; margin-bottom: 5rem;" ref="content">
        <!-- 报告标题 -->
        <div class="reportTitle" :style="this.$route.path=='/mtl_test_platform/page/compatibilityPCTestReport' ? {'padding-top':'67px'} : {}">
            <span>{{ taskDetail['test_report_title'] || "" }}</span>
        </div>

        <div class="compatibility-div" style="padding-top: 8px;">
            <!-- 测试任务详情 -->
            <task-detail 
                :axios-list="axiosList" 
                :staticData="staticData" 
                :isPreview="isPreview" 
                :taskDetail="taskDetail" 
                @afterEdit="afterEditMethod"
                :taskDetailList="taskDetailList"
                :exportUrl="'/expertCompatibilityPC/export_report/'"
                :editUrl="'/expertCompatibility/update_report_message/'"
                :taskFormItemList="taskFormItemList"
                :taskFormList="taskFormList"
                @changeAppIcon="changeAppIcon"
                />

            <!-- 备注 -->
            <remark :isPreview="isPreview" :taskDetail="taskDetail" :updateUrl="'/expertCompatibility/update_report_message/'" @cancelEditRemark="cancelEditRemark" @updateRemark="getPageData"></remark>

            <!-- 高风险项 -->
            <!-- <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <div class="decorate-div"></div>
                    <div class="decorate-title">
                        高风险项
                        <i 
                            v-if="!highRiskFlag && projectCode !=='all' && !isPreview" 
                            class='el-icon-edit-outline edit-icon' 
                            style="margin-top:0;" 
                            @click="editRemark('highRisk')"
                        ></i>
                    </div>
                </div>
                <div class="card-content-div">
                    <div class="task-content-div">
                        <div v-if="!highRiskFlag" style="margin-left: 10px">
                            <span class="comment">{{taskDetail['high_risk_items'] ? taskDetail['high_risk_items'] : '无'}}</span>
                        </div>
                        <div v-else  style="margin-left: 10px">
                            <el-input v-model="taskDetail['high_risk_items']" type="textarea" :autosize="{ minRows: 2}" style="width: 90%" placeholder="请填入备注"></el-input>
                            <el-button type="primary" size="mini" style="margin-left: 10px;" @click="updateRemark('highRisk')">确定</el-button>
                            <el-button size="mini" @click="cancelEditRemark('highRisk')">取消</el-button>
                        </div>
                    </div> 
                </div>
            </el-card> -->

            <div v-if="isPreview">
                <!-- 通过率 -->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <div class="decorate-div"></div>
                        <div class="decorate-title">
                            测试覆盖内容
                        </div>
                    </div>
                    <div class="card-content-div">
                        <!-- 数据部分 -->
                        <div class="rate-text">
                            <div class="rate-text-div">
                                <el-row>
                                    <el-col :span="16">
                                        <div class="item">
                                            <div class="title">本次测试覆盖内容</div>
                                            <el-row>
                                                <el-col :span="8">
                                                    <span>操作系统</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.os }}&nbsp;</span>
                                                    <span>个</span><br/>
                                                </el-col>
                                                <el-col :span="8">
                                                    <span>显卡</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.gpu }}&nbsp;</span>
                                                    <span>张</span><br/>
                                                </el-col>
                                                <el-col :span="8">
                                                    <span>输入法</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.input }}&nbsp;</span>
                                                    <span>款</span><br/>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="8">
                                                    <span>游戏语言</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.game_language }}&nbsp;</span>
                                                    <span>种</span><br/>
                                                </el-col>
                                                <el-col :span="8">
                                                    <span>系统语言</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.os_language }}&nbsp;</span>
                                                    <span>种</span><br/>
                                                </el-col>
                                                <el-col :span="8">
                                                    <span>杀毒软件</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.antivirus_software }}&nbsp;</span>
                                                    <span>种</span><br/>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="8">
                                                    <span>游戏平台</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.game_platform }}&nbsp;</span>
                                                    <span>个</span><br/>
                                                </el-col>
                                                <el-col :span="8">
                                                    <span>显示器分辨率</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.pc_resolution }}&nbsp;</span>
                                                    <span>个</span><br/>
                                                </el-col>
                                                <el-col :span="8">
                                                    <span>游戏分辨率</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.game_resolution }}&nbsp;</span>
                                                    <span>个</span><br/>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="8">
                                                    <span>游戏存储位置</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.game_location }}&nbsp;</span>
                                                    <span>个</span><br/>
                                                </el-col>
                                                <el-col :span="8">
                                                    <span>画质</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.display_quality }}&nbsp;</span>
                                                    <span>个</span><br/>
                                                </el-col>
                                                <el-col :span="8">
                                                    <span>画面模式</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.picture_mode }}&nbsp;</span>
                                                    <span>个</span><br/>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="8">
                                                    <span>CPU</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.cpu }}&nbsp;</span>
                                                    <span>个</span><br/>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </el-col>
                                    <el-col :span="4" style="margin-top: 10px;">
                                        <div class="item">
                                            <div class="title">共测试</div>
                                            <span class="num">{{ staticData.all_record_num }}</span>
                                            <span>项</span>
                                        </div>
                                        <div class="item">
                                            <div class="title">通过</div>
                                            <span class="num">{{ staticData.pass_num }}</span>
                                            <span>项</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="4" style="margin-top: 10px;">
                                        <div class="item">
                                            <div class="title">不通过</div>
                                            <span class="num">{{ staticData.not_pass_num }}</span>
                                            <span>项</span>
                                        </div>
                                        <div class="item">
                                            <div class="title">通过率</div>
                                            <span class="num">{{ staticData.pass_rate ? parseFloat(staticData.pass_rate).toFixed(2) : '' }}</span>
                                            <span>%</span>
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
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <div class="decorate-div"></div>
                        <div class="decorate-title">
                            问题概述
                        </div>
                    </div>
                    <div class="card-content-div">
                        <el-row v-show="totalProblemCount != 0">
                            <el-col :span="6" style="margin-top: 30px;">
                                <div>
                                    本次测试共发现问题数 {{ totalProblemCount }} 个
                                </div>
                                <div style="margin-top: 8px;" v-if="statisData.questionLevel && statisData.questionLevel.y_data">
                                    其中，
                                    <span v-for="item,index in statisData.questionLevel.y_data" :key="index">
                                        {{ statisData.questionLevel.x_data[index] }}问题有 {{ item }} 个，占比 {{ Number(item / totalProblemCount * 100).toFixed(1) }}% ；
                                    </span>
                                </div>
                                <div style="margin-top: 8px;">
                                    其中，
                                    <span v-for="item,index in statisData.questionType" :key="index">
                                        {{ item.name }}问题有 {{ item.value }} 个，占比 {{ Number(item.value / totalProblemCount * 100).toFixed(1) }}% ；
                                    </span>
                                </div>
                            </el-col>
                            <!-- 问题分布 -->
                            <el-col :span="9">
                                <div class="problem-chart-div" ref="problemDistributionRef" style="height: 250px; width: 500px; margin: auto;"></div>

                            </el-col>
                            <!-- 级别分布 -->
                            <el-col :span="9">
                                <div class="problem-chart-div" ref="problemLevelRef"></div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>

                <!-- 测试统计 -->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <div class="decorate-div"></div>
                        <div class="decorate-title">
                                测试统计
                            （<span style="color: green;">√</span>通过 
                            <span style="color: red; margin-left:10px;">×</span>不通过 ）
                        </div>
                    </div>
                    <div class="card-content-div">
                        <test-static-group-p-c :axios-list="axiosList" :display-name="displayName"></test-static-group-p-c>
                    </div>
                </el-card>
                <problem-detail style="margin-top: 15px;" :axios-list="axiosList" :report-type="reportType" :display-name="displayName" :is-preview="isPreview"></problem-detail>
            </div>
            <div v-else>
                <div class="selectPackage">
                    <el-radio-group v-model="packageType" @change="changePackageType">
                        <el-radio-button :label="0">测试概况</el-radio-button>
                        <el-radio-button :label="1">问题列表</el-radio-button>
                    </el-radio-group>
                </div> 

                <div v-if="packageType == '0'" style="margin-top:15px;">
                    <!-- 通过率 -->
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <div class="decorate-div"></div>
                            <div class="decorate-title">
                                测试覆盖内容
                            </div>
                        </div>
                        <div class="card-content-div">
                            <!-- 数据部分 -->
                            <div class="rate-text">
                                <div class="rate-text-div">
                                    <el-row>
                                        <el-col :span="16">
                                            <div class="item">
                                                <div class="title">本次测试覆盖内容</div>
                                                <el-row>
                                                    <el-col :span="8">
                                                        <span>操作系统</span>
                                                        <span class="num">&nbsp;{{ staticRecordNum.os }}&nbsp;</span>
                                                        <span>个</span><br/>
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span>显卡</span>
                                                        <span class="num">&nbsp;{{ staticRecordNum.gpu }}&nbsp;</span>
                                                        <span>张</span><br/>
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span>输入法</span>
                                                        <span class="num">&nbsp;{{ staticRecordNum.input }}&nbsp;</span>
                                                        <span>款</span><br/>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col :span="8">
                                                        <span>游戏语言</span>
                                                        <span class="num">&nbsp;{{ staticRecordNum.game_language }}&nbsp;</span>
                                                        <span>种</span><br/>
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span>系统语言</span>
                                                        <span class="num">&nbsp;{{ staticRecordNum.os_language }}&nbsp;</span>
                                                        <span>种</span><br/>
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span>杀毒软件</span>
                                                        <span class="num">&nbsp;{{ staticRecordNum.antivirus_software }}&nbsp;</span>
                                                        <span>种</span><br/>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col :span="8">
                                                        <span>游戏平台</span>
                                                        <span class="num">&nbsp;{{ staticRecordNum.game_platform }}&nbsp;</span>
                                                        <span>个</span><br/>
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span>显示器分辨率</span>
                                                        <span class="num">&nbsp;{{ staticRecordNum.pc_resolution }}&nbsp;</span>
                                                        <span>个</span><br/>
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span>游戏分辨率</span>
                                                        <span class="num">&nbsp;{{ staticRecordNum.game_resolution }}&nbsp;</span>
                                                        <span>个</span><br/>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col :span="8">
                                                        <span>游戏存储位置</span>
                                                        <span class="num">&nbsp;{{ staticRecordNum.game_location }}&nbsp;</span>
                                                        <span>个</span><br/>
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span>画质</span>
                                                        <span class="num">&nbsp;{{ staticRecordNum.display_quality }}&nbsp;</span>
                                                        <span>个</span><br/>
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span>画面模式</span>
                                                        <span class="num">&nbsp;{{ staticRecordNum.picture_mode }}&nbsp;</span>
                                                        <span>个</span><br/>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                <el-col :span="8">
                                                    <span>CPU</span>
                                                    <span class="num">&nbsp;{{ staticRecordNum.cpu }}&nbsp;</span>
                                                    <span>个</span><br/>
                                                </el-col>
                                            </el-row>
                                            </div>
                                        </el-col>
                                        <el-col :span="4" style="margin-top: 10px;">
                                            <div class="item">
                                                <div class="title">共测试</div>
                                                <span class="num">{{ staticData.all_record_num }}</span>
                                                <span>项</span>
                                            </div>
                                            <div class="item">
                                                <div class="title">通过</div>
                                                <span class="num">{{ staticData.pass_num }}</span>
                                                <span>项</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="4" style="margin-top: 10px;">
                                            <div class="item">
                                                <div class="title">不通过</div>
                                                <span class="num">{{ staticData.not_pass_num }}</span>
                                                <span>项</span>
                                            </div>
                                            <div class="item">
                                                <div class="title">通过率</div>
                                                <span class="num">{{ staticData.pass_rate ? parseFloat(staticData.pass_rate).toFixed(2) : '' }}</span>
                                                <span>%</span>
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
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <div class="decorate-div"></div>
                            <div class="decorate-title">
                                问题概述
                            </div>
                        </div>
                        <div class="card-content-div">
                            <el-row v-show="totalProblemCount != 0">
                                <el-col :span="6" style="margin-top: 30px;">
                                    <div>
                                        本次测试共发现问题数 {{ totalProblemCount }} 个
                                    </div>
                                    <div style="margin-top: 8px;" v-if="statisData.questionLevel && statisData.questionLevel.y_data">
                                        其中，
                                        <span v-for="item,index in statisData.questionLevel.y_data" :key="index">
                                            {{ statisData.questionLevel.x_data[index] }}问题有 {{ item }} 个，占比 {{ Number(item / totalProblemCount * 100).toFixed(1) }}% ；
                                        </span>
                                    </div>
                                    <div style="margin-top: 8px;">
                                        其中，
                                        <span v-for="item,index in statisData.questionType" :key="index">
                                            {{ item.name }}问题有 {{ item.value }} 个，占比 {{ Number(item.value / totalProblemCount * 100).toFixed(1) }}% ；
                                        </span>
                                    </div>
                                </el-col>
                                <!-- 问题分布 -->
                                <el-col :span="9">
                                    <div class="problem-chart-div" ref="problemDistributionRef" style="height: 250px; width: 500px; margin: auto;"></div>

                                </el-col>
                                <!-- 级别分布 -->
                                <el-col :span="9">
                                    <div class="problem-chart-div" ref="problemLevelRef"></div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>

                    <!-- 测试统计 -->
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <div class="decorate-div"></div>
                            <div class="decorate-title">
                                 测试统计
                                （<span style="color: green;">√</span>通过 
                                <span style="color: red; margin-left:10px;">×</span>不通过 ）
                            </div>
                        </div>
                        <div class="card-content-div">
                            <test-static-group-p-c :axios-list="axiosList" :display-name="displayName"></test-static-group-p-c>
                        </div>
                    </el-card>
                </div>

                <div v-if="packageType == '1'" style="margin-top:15px;">
                    <problem-detail :axios-list="axiosList" :report-type="reportType" :display-name="displayName" :is-preview="isPreview"></problem-detail>
                </div>
            </div>
        </div>
        <!-- 回到顶部的按钮 -->
        <!-- <div class="backTop" @click="toTop">
            回到顶部<i class="el-icon-arrow-up"></i>
        </div> -->
        <!-- 底部的标志 -->
        <!-- <div class="copyright-div" style="backgroundColor: #f3f4f6;">
            <div style="font-weight: 700">雷火MTL</div>
            <div style="margin-top: 18px;">网易公司版权所有 ©雷火测试中心 Copyright Leihuo. All Rights Reserved</div>
        </div> -->
    </div>
</template>

<script>
import ProblemDetail from '@/components/TestReport/CompatibilityTestReportPC/ProblemDetailPC'
import TestStaticGroupPC from '@/components/TestReport/CompatibilityTestReportPC/TestStaticGroupPC'
import TaskDetail from '@/components/TestReport/Common/TaskDetail'
import Remark from '@/components/TestReport/Common/Remark'
export default {
    components: {
        ProblemDetail,
        TestStaticGroupPC,
        TaskDetail,
        Remark
    },
    data() {
        return {
            taskDetailList: {
                commonItemArr: [
                    {
                        value: "app_name",
                        label: "App名称",
                        width: "20%",
                    },
                    {
                        value: "start_date",
                        label: "开始时间",
                        width: "20%",
                    },
                    {
                        value: "end_date",
                        label: "结束时间",
                        width: "20%",
                    },
                    {
                        value: "app_version",
                        label: "App版本",
                        width: "30%",
                    },
                    {
                        value: "test_content",
                        label: "测试内容",
                        width: "90%",
                    },
                ]
            },
            taskFormList: {
                test_report_title: "",
                app_name: "",
                app_version: "",
                test_content: "",
                high_risk_items:"",
                icon: "",
                smart_compatibility_report:'',
                report_remarks: '',
                end_date: "",
            },
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
                }, 
                {
                    label: '结束日期',
                    name: 'end_date',
                    type: 'input',
                    class: 'public-dialog-form-item'
                }, 
                // {
                //     label: '高风险项',
                //     name: 'high_risk_items',
                //     type: 'input',
                //     class: 'public-dialog-form-item'
                // },
                {
                    label: '测试内容',
                    name: 'test_content',
                    type: 'input',
                    class: 'public-dialog-form-item'
                },
                // {
                //     label: '备注',
                //     name: 'report_remarks',
                //     type: 'input',
                //     class: 'public-dialog-form-item'
                // }
            ],
            remarkFlag: 0,
            highRiskFlag: 0,
            projectCode: '',
            isLoading: false,
            oldRemark: "",
            oldHighRisk: "",
            displayName: "",
            failRecord: "",
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
                report_remarks: '',
                end_date: "",
            },
            itemRules: {
                test_report_title: [{ required: true, message: '请输入测试报告标题', trigger: 'blur' }],
            },
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
            statisData: {},
            passRateData:[],
            activeName: 'first',
            // 测试任务详情
            taskDetail: {},
            staticData: "",
            staticRecordNum: "",
            axiosList: {
                table_name: this.$route.query.testRecordName,
                // test_type: this.$route.query.testType,
                test_type: '11',
            },
            reportType: "expert",
            packageType: 0, //0:测试概况,1:问题详情,2:设备详情
            testDialogVisible: false,
            reportTitle: '',
            isExporting: false,
            nameToLevel: {
                '立刻': 'P0',
                '紧急': 'P1',
                '高': 'P2',
                '普通': 'P3',
                '低': 'P4',
            },
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
        if (this.$route.query.project != undefined) {
            this.projectCode = this.$route.query.project;
        }
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
        changeAppIcon(msg, list){
            if(msg === 'icon'){

                this.$set(this.taskFormList, msg, list);
            }else{
                this.taskFormList = list
            }
        },
        changePackageType(){
            let queryList = JSON.parse(JSON.stringify(this.$route.query))
            queryList.packageType = this.packageType
            this.$publicJS.iframeParentPost(top.location.pathname, queryList, this)
            this.timer = new Date().getTime()
            if(queryList.packageType == 0){
                this.getPageData()
                this.getChartData()
            }
        },
        editRemark(msg){
            if(msg == 'remark'){
                this.remarkFlag = 1
            }else{
                this.highRiskFlag = 1
            }
        },
        afterEditMethod(){
            this.getPageData()
        },
        updateRemark(msg){
            let list = {
                id: this.$route.query.applicationId,
                report_remarks: this.taskDetail['report_remarks'],
                project: this.$route.query.project,
            }
            let info = ""
            if(msg == 'remark'){
                list.report_remarks = this.taskDetail['report_remarks']
                info = "编辑备注"
            }else{
                list.high_risk_items = this.taskDetail['high_risk_items']
                info = "编辑高风险项"
            }
            this.$codePost('/expertCompatibility/update_report_message/', list, { operation: "编辑备注", success: true, failed: true }).then(res => {
                if (res.code == 200) {
                    this.getPageData()
                    if(msg == 'remark'){
                        this.remarkFlag = 0
                    }else{
                        this.highRiskFlag = 0
                    }
                }
            })
        },
        cancelEditRemark(msg){
            if(msg == 'remark'){
                this.remarkFlag = !this.remarkFlag
                this.taskDetail['report_remarks'] = this.oldRemark
            }else{
                this.highRiskFlag = !this.highRiskFlag
                this.taskDetail['high_risk_items'] = this.oldHighRisk
            }
        },

        // 获取页面信息
        getPageData() {
            this.isLoading = true;
            this.$codePost('/expertCompatibilityPC/test_basic_info_report/', this.axiosList, { operation: "获取报告数据", failed: true }).then(res => {
                if (res.code == 200) {
                    this.taskDetail = res.data.task_detail;
                    if(this.taskDetail['end_date'] == 'null' || this.taskDetail['end_date'] == null){
                        this.taskDetail['end_date'] = ''
                    }
                    this.oldRemark = this.taskDetail['report_remarks']
                    this.oldHighRisk = this.taskDetail['high_risk_items']
                    // console.log(this.taskDetail)
                    this.staticData = res.data.statistics_data;
                    this.staticRecordNum = res.data.statistics_data.record_num
                    this.failRecord = this.handleFailRecord(res.data.statistics_data.not_pass_record)
                    this.displayName = res.data.display_name
                    this.passRateData = this.getPassPieData(res.data.statistics_data)
                    this.drawPassRateData(this.passRateData)
                    // this.testStaticTable = res.data.form_data        // 端游没有form_data
                    // this.testStaticTableLoading = false              // 也就没有表格的加载
                    this.isLoading = false;
                }
                this.$publicJS.iframeLoadingPost(false);
            })
        },

        handleFailRecord(data){
            let failRecord = {}
            data.forEach(item => {
                if(failRecord[item[0]] == undefined || failRecord[item[0]].length == 0){
                    failRecord[item[0]] = [item[1]]
                }else{
                    failRecord[item[0]].push(item[1])
                }
            })
            // console.log(failRecord)
            return failRecord
        },

        getPassPieData(data){
            let pieData = [
                {
                    "name": "通过",
                    "value": data.pass_num
                },
                {
                    "name": "不通过",
                    "value": data.not_pass_num
                }
            ]
            return pieData
        },

        // 绘制通过率饼图
        drawPassRateData(data){
            let failRecord = this.failRecord
            let displayName = this.displayName
            // console.log(displayName)
            let myChart = this.$echarts.init(this.$refs.passRateRef);
            let option = {
                graphic: {
                    type: 'text', // 添加文本类型的图形元素
                    left: 'center', // 水平居中
                    top: 'middle', // 垂直居中
                    style: {
                        text: this.staticData.pass_rate.toFixed(2) + '%\n覆盖项通过率', // 显示的文本内容
                        textAlign: 'center', // 文本水平对齐方式
                        fontSize: 15 // 字体大小
                    },
                    formatter: function(params) {
                        return params.data.value + "%";
                    }
                },
                tooltip: {
                    axisPointer: { 
                        type: 'shadow'
                    },
                    formatter : function(params){  
  						var res = params.name + ": " + params.value + "项(" + params.percent + "%)"
                        if(params.data.name == '不通过'){
                            for(var i in failRecord){
                                // console.log(i)
                                res = res + '<br/>' + displayName[i] + "：" + failRecord[i].join('，')
                            }
                        }
  						return res;
					},
                    confine: true
                },
                color: ['#26c190', '#fd6d8e'],
                series: [
                    {
                        type: 'pie',
                        data: data,
                        radius: ['40%', '60%'],
                        label: {
                            show: true,
                            formatter: function(arg){
                                return arg.name + arg.value + '项\n' + arg.percent + '%'
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
            this.$codePost("/expertCompatibilityPC/test_report_info1/", list, { operation: "获取报告标题", failed: true }).then(res => {
                if (res.code == 200) {
                    this.reportTitle = res.data.test_report_title;
                }
            })
        },

        //导出报告
        exportExcel() {
            this.isExporting = true;
            // 导出测试报告接口
            this.$codePost("/expertCompatibilityPC/export_report/", this.axiosList, { operation: "导出报告", failed: true }).then(res => {
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
            this.$codePost("/expertCompatibilityPC/expert_test_question_static/", this.axiosList, { operation: "获取统计数据", failed: true }).then(res => {
                if (res.code == 200) {
                    // this.showPage = true;
                    this.statisData = {
                        questionType: res.data.question_type.detail_info,
                        affectDevice: res.data.affect_device,
                        affectUser: res.data.affect_user,
                        questionLevel: this.handleLevelData(res.data.question_level),
                    }
                    this.drawProblemLevelChart(this.statisData.questionLevel);
                    this.drawProblemDistributionChart(res.data.question_type.detail_info)
                }
                this.$publicJS.iframeLoadingPost(false);
            })
        },

        // 处理问题级别数据
        handleLevelData(data){
            let p0Num = 0
            let levelData = {}
            levelData.y_data = data.y_data
            levelData.max_parameter = data.max_parameter
            let x_data = []
            let levelName = data.x_data
            let levelList = []
            for(let i = 0; i < levelName.length; i++){
                x_data.push(this.nameToLevel[levelName[i]])
                if(this.nameToLevel[levelName[i]] == 'P0' || this.nameToLevel[levelName[i]] == 'P1'){
                    p0Num += data.y_data[i]
                }
            }
            levelData.x_data = x_data
            // console.log(p0Num)
            this.p0Num = p0Num
            return levelData
            // console.log(levelData)
        },


        // 遍历求和方法
        eachSum(data, sum){
            data.forEach(item => {
                sum += item
            })
            return sum
        },

        // 绘制问题级别的柱状图
        drawProblemLevelChart(data){
            this.totalProblemCount = 0
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
                        top: 'bottom',
                        left: 'center',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: ''        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    // grid: {
                    //     left: "20%",
                    // },
                    yAxis: {
                        type: 'value',
                        splitLine: {//去除网格线
                            show: false
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: data.x_data,
                    },
                    series: [
                        {
                            name: '问题数量',
                            type: 'bar',
                            barMaxWidth: '25',
                            stack: '总量',
                            data: data.y_data,
                            label: {
                                show: true,
                                position: 'top',
                                formatter: function(arg){
                                    return arg.value + ' 个'
                                },
                                color: '#333333',
                            },
                        },
                    ]
                };
                myChart.setOption(option);
                window.addEventListener('resize', function() { myChart.resize() });
            })
        },

        // 绘制问题分布柱状图
        drawProblemDistributionChart(data){
            // let x_data = []
            // let y_data = []
            // data.forEach((item) => {
            //     x_data.push(item.name)
            //     y_data.push(item.value)
            // })
            // this.$nextTick(() => {
            //     let _this = this
            //     let myChart = this.$echarts.init(this.$refs.problemDistributionRef);
            //     let option = {
            //         title: {
            //             show: true,
            //             text: '问题分布',
            //             textStyle: {
            //                 fontStyle: 'normal',
            //                 fontWeight: 'normal',
            //                 fontSize: '16',
            //             },
            //             top: 'top',
            //             left: 'center',
            //         },
            //         tooltip: {
            //             trigger: 'axis',
            //             axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            //                 type: ''        // 默认为直线，可选为：'line' | 'shadow'
            //             }
            //         },
            //         // grid: {
            //         //     left: '25%',
            //         // },
            //         yAxis: {
            //             // name: '问题个数',
            //             type: 'value',
            //             minInterval: 1,
            //             nameTextStyle: {
            //                 fontSize: 10
            //             },
            //             splitLine: {
            //                 show: false
            //             }
            //         },
            //         xAxis: {
            //             type: 'category',
            //             nameTextStyle: {
            //                 fontSize: 12
            //             },
            //             data: x_data,
            //             axisLabel: {
            //                 //x轴文字的配置
            //                 show: true,
            //                 interval: 0,//使x轴文字显示全
            //             },
            //         },
            //         series: [
            //             {
            //                 name: '问题数量',
            //                 type: 'bar',
            //                 barMaxWidth: '25',
            //                 stack: '总量',
            //                 data: y_data,
            //                 label: {
            //                     show: true,
            //                     position: 'top',
            //                     formatter: function(arg){
            //                         return arg.value + ' 个'
            //                     },
            //                     color: '#333333',
            //                 },
            //             },
            //         ]
            //     };
            //     myChart.setOption(option);
            //     window.addEventListener('resize', function() { myChart.resize() });
            // })
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
                    top: 'bottom',
                    left: 'center',
                },
                graphic: {
                    type: 'text', // 添加文本类型的图形元素
                    left: 'center', // 水平居中
                    top: 'middle', // 垂直居中
                    style: {
                        text: '问题分布', // 显示的文本内容
                        textAlign: 'center', // 文本水平对齐方式
                        fontSize: 15 // 字体大小
                    },
                    formatter: function(params) {
                        return params.data.value + "%";
                    }
                },
                tooltip: {
                    axisPointer: { 
                        type: 'shadow'
                    },
                    formatter : function(params){  
                        var res = '<div>';
  						res += params.name + ": " + params.value + "个 (" + params.percent + "%)"
  						// res += params.name + "(" + params.percent + "%)"
                        res += '</div>';
  						return res;
					},
                    confine: false,
                    position: 'inside'
                },
                series: [
                    {
                        type: 'pie',
                        data: data,
                        radius: ['40%', '60%'],
                        label: {
                            show: true,
                            formatter: function(arg){
                                // return arg.name + arg.value + '个\n' + arg.percent + '%'
                                return arg.name + '\n(' + arg.percent + '%)'
                            }
                        },
                    }
                ]
            };
            myChart.setOption(option);
            window.addEventListener('resize', function() { myChart.resize() });
        },

        toTop(){
            this.$refs.content.scrollIntoView(
                {
                    behavior: "smooth",  // 平滑过渡
                    block:    "start"  // 上边框与视窗顶部平齐。默认值
                }
            )
            // this.$emit('ToTop')
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
    margin: auto;
    height: 250px; 
    width: 80%;
}
.rate-text {
    width: 60%;
    margin-left: 4%;
    display: inline-block;
    vertical-align: top;
    padding-top: 1.5rem;
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
    width: 36%;
    height: 250px;
    display: inline-block;
    vertical-align: top;
    margin-top: -2%;
}
.item-title {
    font-size: 18px;
    margin-left: 25px;
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
    width: 500px;
    height: 250px;
}
</style>
<style scoped>
/deep/ .el-tabs__item:hover {
  color: #333333;
}

/deep/ .el-tabs__item.is-active {
    color: #ffffff;
    background: #3e72fd;
}
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
.box-card {
    margin: 1rem auto;
    box-sizing: border-box;
}

.el-card /deep/ .el-card__header {
    background-color: #f6f9fc;
    padding: 10px 20px;
}
.edit-icon {
    color: #4876F2;   
    font-weight: bold;
    height: 20px;
    vertical-align: middle;
    cursor: pointer;
    margin-left: -3px;
    margin-top: -3px;
}
.decorate-div {
    width: 3px;
    height: 20px;
    background: #4876f2;
    display: inline-block;
    margin-right: 8px;
    vertical-align: sub;
}

.decorate-title {
    display: inline-block;
    color: #333333;
    font-size: 20px;
}
.type-card {
    margin-top: 18px;
}
.comment{
    white-space:pre-wrap;
    font-size: 14px;
}
#compatibilityTestReportPC{
    font-family: "Microsoft Yahei", sans-serif;
}
</style>