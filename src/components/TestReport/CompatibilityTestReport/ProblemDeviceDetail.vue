<template>
    <div :class="{ 'container': true, 'deep-container': reportType == 'deep', 'report-detail': true }" style="margin-top: 90px;">
        <!-- 返回 -->
        <div class="back-page">
            <i class="el-icon-arrow-left"></i>
            <span v-if="lastPackageType == ''" class="page-span" @click="jumpQuestionDetail">返回问题详情页</span>
            <span v-else class="page-span" @click="jumpReportPage">返回{{ lastPackageType == 2 ? "问题报告":"终端报告" }}页</span>
        </div>

        <!-- 主体 -->
        <div class="detail-main" v-loading="isLoading">
            <div style="margin-bottom:20px;">
                <span class="gray-span" style="margin-right:1rem;">选择机型:</span>
                <el-select 
                    v-model="selectedDevice" 
                    @change="changeDevice(selectedDevice)" 
                    filterable 
                    placeholder="请选择机型">
                    <el-option
                        v-for="item in deviceList"
                        :key="item.device_uuid"
                        :label="item.device"
                        :value="reportType == 'deep' ? item.device_uuid : item.id">
                        <span style="float: left">{{ item.device }}</span>
                        <span v-if="item.is_pass == 0 || item.if_pass == '不通过'" class="option-icon"><i class="el-icon-error theme-red"></i></span>
                        <span v-else class="option-icon"><i class="el-icon-success theme-green"></i></span>
                    </el-option>
                </el-select>
            </div>

            <!-- 设备的信息 -->
            <device-item-show 
                v-if="deviceData" 
                :deviceData="deviceData" 
                :show-pass="true" 
                :report-type="reportType"
                />

            <!-- 设备出现问题的情况 -->
            <div v-if="questionData.length > 0" class="menu-and-slider">
                <div class="menu-and-slider-header">
                     <div class="menu-title">问题</div>
                     <div class="slider-title">问题表现</div>
                </div>
                <div class="slider">
                    <!-- <div class="menu-div">
                        <div 
                            v-for="(item, index) in questionData" 
                            :key="'menu_' + index" 
                            :class="{ 'choosed-menu': index == selectIndex, 'menu-item': true }"
                            >
                            <div v-if="index == selectIndex" class="tips-div"></div>
                            <div class="menu-item-span" @click="selectIndex = index">
                                <span class="aside-item">
                                     <span>{{ item.question.q_classification }}</span>
                                </span>
                                <div class="aside-level-div">
                                    <span :style="{color:qLevelList[item.question.q_level].color}">
                                        {{ qLevelList[item.question.q_level].content.split("-")[0] }}
                                    </span>
                                    <el-tooltip class="item" effect="dark" :content="qLevelList[item.question.q_level].content" placement="right">
                                        <img v-if="item.question.q_level==1" class="q-level-icon" src="@/assets/img/problemSerious.png">
                                        <img v-else-if="item.question.q_level==2" class="q-level-icon" src="@/assets/img/problemOrdinary.png">
                                        <img v-else-if="item.question.q_level==3" class="q-level-icon" src="@/assets/img/problemSecondary.png">
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="questionData != ''" class="slider-div">
                        <div class="question-img-text-div" :key="'question_' + selectIndex">
                            <div 
                                v-for="(item, index) in questionList" 
                                :key="selectIndex + '_' + index" 
                                class="question-img-text-item" 
                                :style="{ width: item.width }"
                                >
                                <div class="title">{{ item.label }}</div>
                                <div :class="{ content: true, 'description_content': item.value == 'q_description' }">
                                    <el-tooltip 
                                        v-if="item.value == 'q_description'" 
                                        class="item" 
                                        effect="light"
                                        placement="top"
                                        >   
                                        <pre slot="content">{{ questionData[selectIndex].question.q_description }}</pre>
                                        <div>{{ questionData[selectIndex].question.q_description }}</div>
                                    </el-tooltip>
                                    <span v-else>{{ questionData[selectIndex].question[item.value] }}</span>
                                </div>
                            </div>
                        </div>
                        <swiper-test 
                            style="height:333px" 
                            :imagePath="getPath(questionData[selectIndex].picture)" 
                            :show-title="reportType == 'expert'" 
                            />
                    </div> -->
                    <el-row style="max-height: 413px;">
                        <el-col :span="4">
                            <div 
                                v-for="(item, index) in questionData" 
                                :key="'menu_' + index" 
                                :class="{ 'choosed-menu': index == selectIndex, 'menu-item': true }"
                                >
                                <div v-if="index == selectIndex" class="tips-div"></div>
                                <div class="menu-item-span" @click="selectIndex = index">
                                    <span class="aside-item">
                                        <span>{{ item.question.q_classification }}</span>
                                    </span>
                                    <div class="aside-level-div">
                                        <span :style="{color:qLevelList[item.question.q_level].color}">
                                            {{ qLevelList[item.question.q_level].content.split("-")[0] }}
                                        </span>
                                        <el-tooltip class="item" effect="dark" :content="qLevelList[item.question.q_level].content" placement="right">
                                            <img v-if="item.question.q_level==1" class="q-level-icon" src="@/assets/img/problemSerious.png">
                                            <img v-else-if="item.question.q_level==2" class="q-level-icon" src="@/assets/img/problemOrdinary.png">
                                            <img v-else-if="item.question.q_level==3" class="q-level-icon" src="@/assets/img/problemSecondary.png">
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="20">
                            <div class="question-img-text-div" :key="'question_' + selectIndex">
                                <div 
                                    v-for="(item, index) in questionList" 
                                    :key="selectIndex + '_' + index" 
                                    class="question-img-text-item" 
                                    :style="{ width: item.width }"
                                    >
                                    <div class="title">{{ item.label }}</div>
                                    <div :class="{ content: true, 'description_content': item.value == 'q_description' }">
                                        <el-tooltip 
                                            v-if="item.value == 'q_description'" 
                                            class="item" 
                                            effect="light"
                                            placement="top"
                                            >   
                                            <pre slot="content">{{ questionData[selectIndex].question.q_description }}</pre>
                                            <div>{{ questionData[selectIndex].question.q_description }}</div>
                                        </el-tooltip>
                                        <span v-else>{{ questionData[selectIndex].question[item.value] }}</span>
                                    </div>
                                </div>
                            </div>
                            <swiper-test 
                                style="height:333px" 
                                :imagePath="getPath(questionData[selectIndex].picture)" 
                                :show-title="reportType == 'expert'" 
                                />
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SwiperTest from './SwiperTest.vue'
import DeviceItemShow from "./DeviceItemShow";
export default {
    components: {
        SwiperTest,
        DeviceItemShow
    },
    data() {
        return {
            lastPackageType: "",
            isLoading: true,
            reportType: "",
            axiosList: {
                table_name: this.$route.query.testRecordName,
                // test_type: this.$route.query.testType,
                test_type: '10',
            },
            deviceId: '',
            selectedDevice: '', //当前选择设备值
            deviceList: [], //可选择设备列表
            deviceData: '',
            questionData: [],
            selectIndex: 0,
            questionList: [],
            deepQuestionList: [
                {
                    value: "q_classification",
                    label: "问题类型",
                    width: "25%",
                },
                {
                    value: "q_description",
                    label: "问题描述",
                    width: "75%",
                },
            ],
            expertQuestionList: [
                {
                    value: "q_category",
                    label: "问题分类",
                    width: "21%",
                },
                {
                    value: "q_classification",
                    label: "问题类型",
                    width: "21%",
                },
                {
                    value: "recurrent_rate",
                    label: "问题重现率",
                    width: "21%",
                },
                {
                    value: "q_description",
                    label: "问题描述",
                    width: "34%",
                },
            ]
        }
    },
    computed: {
        qLevelList() {
            return this.$store.getters.getQLevelList;
        },
        routeList() {
            return this.$store.getters.getReportRouteList[this.reportType];
        },
    },
    watch: {
    },
    props: {
    },
    created() {
        this.questionList = this.expertQuestionList;
        this.reportType = 'expert'
        this.deviceId = this.$route.query.deviceId;
        //获取数据
        this.getData(this.deviceId);
        this.getLastPage();
    },
    mounted() {
        this.$store.commit("setPageIsLoading", false);
    },
    methods: {
        getPath(path){
            // console.log('selected',this.questionData[this.selectIndex])
            // console.log('path====',path)
            return path
        },
        //获取上一页的参数，控制返回XX页的显示
        getLastPage() {
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            if (queryList.packageType != undefined) {
                this.lastPackageType = queryList.packageType;
            }
        },

        //跳转到问题详情界面
        jumpQuestionDetail() {
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            this.$router.push({
                path: "/mtl_test_platform/page/questionDetail",
                query: queryList
            })
            let newPath = this.routeList.prefix + this.routeList.questionDetail;
            this.$publicJS.iframeParentPost(newPath, queryList, true, this);
        },

        //返回报告页
        jumpReportPage() {
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            queryList.packageType = this.lastPackageType;
            this.$router.push({
                path: "/mtl_test_platform/page/compatibilityTestReport",
                query: queryList
            })
            let newPath = this.routeList.prefix + this.routeList.testReport;
            this.$publicJS.iframeParentPost(newPath, queryList, true, this);
        },
        
        //获取数据
        getData(deviceId) {
            this.isLoading = true;
            let list = JSON.parse(JSON.stringify(this.axiosList));
            list.id = deviceId;

            this.$codePost("/expertCompatibility/test_terminal_detail/", list, { operation: "获取数据", failed: true }).then(res => {
                if (res.code == 200) {
                    // 这个数据后续渲染的时候存在问题，回头在页面上处理，先注释掉
                    this.deviceData = res.data.device_data;
                    this.selectedDevice = res.data.device_data.id;
                    this.deviceList = res.data.all_device;
                    // 这个数据后续渲染的时候存在问题，回头在页面上处理，先注释掉
                    this.questionData = res.data.question_data;
                }
                this.$publicJS.iframeLoadingPost(false);
                this.isLoading = false;
            })
        },
        
        //切换设备
        changeDevice(deviceId){
            this.selectIndex = 0;
            this.getData(deviceId);
            //修改网址，便于刷新网页时获取到切换后的设备
            //该段代码不能写在getData函数中，会导致初始的时候网址变化异常
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            queryList.deviceId = deviceId;
            this.$publicJS.iframeParentPost(top.location.pathname, queryList, this);
        }   
    },

}
</script>

<style scoped>
.container {
    width: 90%;
    min-width: 1200px;
    margin: 2rem auto;
}
.report-detail .back-page {
    color: #666;
}
.report-detail .back-page>.el-icon-arrow-left {
    margin: 0 3px;
}
.report-detail .back-page>.page-span {
    cursor: pointer;
}
.detail-main {
    margin-top: 1rem;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0px 2px 12px 0px #e1e1e1;
    border-radius: 5px;
    padding: 1rem;
}
.gray-span {
    color: #333333;
}

.option-icon {
    float: right;
    font-size: 14px;
}
.menu-and-slider {
    width: 100%;
    height: 480px;
    margin-top: 1rem;
    border: 1px solid #eaecf4;
}
.menu-and-slider-header {
    line-height: 40px;
    background-color: #e7e9ee;
    color: #333333;
}
.menu-and-slider-header>.menu-title {
    display: inline-block;
    width: 17%;
    text-align: center;
}
.menu-and-slider-header>.slider-title {
    display: inline-block;
    width: 83%;
    text-align: center;
}
.menu-and-slider .menu-div {
    display: inline-block;
    width: 17%;
    vertical-align: top;
    max-height: 413px;
    /*
    overflow-y: auto;
    */
}
.slider{
    max-height: 413px;
}
.choosed-menu {
    background-color: #F2F4F9;
}
.menu-item {
    width: 100%;
    height: 40px;
    position: relative;
}
.menu-item-span {
    width: 17%;
    height: 40px;
    /*
    padding-left: 30px;
    */
    cursor: pointer;
    line-height: 40px;
    color: #333333;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.slider-div {
    display: inline-block;
    width: 83%;
    margin-left: 17%;
    /*
    margin-top: -50px;
    */
    height: 413px;
    background-color: #fafbfc;
    vertical-align: top;
    border-left: 1px solid #eaecf4;
}
.question-img-text-div {
    width: 100%;
    padding: 0.5rem 1rem;
}

.question-img-text-item {
    display: inline-block;
    padding-right: 0.5rem;
    color: #555555;
}

.question-img-text-item>.title {
    display: inline-block;
    vertical-align: top;
}

.question-img-text-item>.title:after {
    content: "：";
}

.question-img-text-item>.content {
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: top;
}

.question-img-text-item>.content.description_content {
    max-width: calc(100% - 120px);
}

.question-img-text-item>.content.description_content>.item {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.aside-level-div {
    vertical-align: top;
    line-height: 40px;
    display: inline-block;
}

.aside-item {
    max-width: calc(100% - 42px);
    margin-right: 2px;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: top;
}
</style>
