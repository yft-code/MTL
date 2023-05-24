<template>
    <div :class="{ 'container': true, 'deep-container': reportType == 'deep', 'report-detail': true }" style="margin-top:90px;">
        <div class="back-page">
            <i class="el-icon-arrow-left"></i>
            <span class="page-span" @click="jumpQuestionPage(lastPackageType)">
                返回{{ lastPackageType == 2 ? '设备详情页' : lastPackageType == 1 ? '问题详情页' : '测试概况页' }}
                <!-- 返回问题详情页 -->
            </span>
        </div>
        <div v-if="questionDetailList" class="detail-main" v-loading="isLoading">
            <div class="gray-div">
                <div class="question-text">
                    <div class="question-text-item" v-for="(item,index) in questionDetailList.textArr" :key="'text_'+index">
                        <span class="title">{{ item.label }}</span>
                        <pre class="text" style="display:inline-block;">{{ questionData[item.value] }}</pre>
                    </div>
                </div>
                <div class="question-circle-text">
                    <div 
                        v-for="(item,index) in questionDetailList.curcleTextArr" 
                        v-if="item.value != 'device_number' || questionData.device_number !== ''"
                        :key="'text_'+index" 
                        :style="{ display: 'inline-block', width: parseInt(100/questionDetailList.curcleTextArr.length) + '%' }"
                        >
                        <div class="circle-text-item" >
                            <div class="content">
                                <div>{{ item.label }}</div>
                                <div>
                                    <span v-if="item.value == 'q_level' && questionData.q_level" :style="{ color: qLevelList[questionData.q_level].color }">
                                        <!-- P{{ questionData[item.value] }}{{ qLevelList[questionData.q_level].content.split("-")[0] }} -->
                                        {{ qLevelList[questionData.q_level].content.split("-")[0] }}
                                    </span>
                                    <span v-else-if="item.value == 'question_cover_user'">{{ questionData.question_cover_user }}</span>
                                    <span v-else-if="item.value == 'device_number'">{{ questionData.device_number }}台</span>
                                    <span v-else-if="item.value == 'record_number'">{{ questionData.record_number }}条</span>
                                    <span v-else>{{ questionData[item.value] }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="reportType == 'expert'">
                <div class="menu-and-slider">
                    <div class="menu-and-slider-header" style="text-align: center;">
                        问题表现
                    </div>
                    <div class="slider-div" style="width: 100%; height: 350px;">
                        <swiper-test :imagePath="allPicture" :isPc="isPC" :show-title="true"/>
                    </div>
                </div>
            </div>
            <div v-else-if="deviceData.length > 0">
                <div class="menu-and-slider">
                    <div class="menu-and-slider-header">
                        <div class="menu-title">涉及设备</div>
                        <div class="slider-title">问题表现</div>
                    </div>
                    <div>
                        <div class="menu-div">
                            <div 
                                v-for="(item, index) in deviceData" 
                                :key="'menu_' + index" 
                                :class="{ 'choosed-menu': index == selectIndex, 'menu-item': true }">
                                <div v-if="index == selectIndex" class="tips-div"></div>
                                <div class="menu-item-span" @click="selectIndex = index">
                                    <el-tooltip 
                                        class="item" 
                                        effect="light" 
                                        :content="item.device.device" 
                                        placement="top"
                                        :disabled="hasOver('deviceName' + index, showOverK)">
                                        <span :id="'deviceName' + index" :class="{ 'select-item': index == selectIndex }">{{ item.device.device }}</span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        <div class="slider-div" style="height:350px;">
                            <swiper-test :imagePath="deviceData[selectIndex].picture" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!isPC && deviceData.length > 0" >
                <div style="margin: 1rem 0;">
                    <span style="font-size: 16px;color: #333333;">设备详情</span>
                </div>
                <div v-if="reportType == 'expert'" class="device-radio">
                    <el-radio-group v-model="selectIndex" size="small">
                        <el-radio 
                            v-for="(item, index) in deviceData" 
                            :key="'device_' + index" 
                            :label="index" 
                            border
                        >{{ item.device.device }}</el-radio>
                    </el-radio-group>
                </div>
                <device-item-show 
                    :deviceData="deviceData[selectIndex].device" 
                    :show-detail="true" 
                    :report-type="reportType"
                    />
            </div>
        </div>
    </div>
</template>

<script>
import SwiperTest from "./SwiperTest";
import DeviceItemShow from "./DeviceItemShow";
import $ from "jquery";
export default {
    components: {
        SwiperTest,
        DeviceItemShow
    },
    data() {
        return {
            isPC: false,
            showOverK: 0,
            isLoading: false,
            lastPackageType: 2,
            reportType: "",
            questionData: '',
            deviceData: [],
            allPicture: [],
            selectIndex: 0,
            questionDetailList: "",
            deepQuestionDetailList: {
                textArr: [
                    { value: "q_classification", label: "问题类型" },
                    { value: "q_description", label: "问题描述" }
                ],
                curcleTextArr: [
                    { value: "q_level", label: "问题级别" },
                    { value: "question_cover_user", label: "影响用户" },
                    { value: "device_number", label: "机型" }
                ]
            },
            expertQuestionDetailList: {
                textArr: [
                    { value: "q_category", label: "问题分类" },
                    { value: "q_classification", label: "问题类型" },
                    { value: "q_description", label: "问题描述" }
                ],
                curcleTextArr: [
                    { value: "q_level", label: "问题级别" },
                    { value: "recurrent_rate", label: "问题重现率" },
                    { value: "question_cover_user", label: "影响用户" },
                    { value: "device_number", label: "机型" }
                ]
            },
            expertQuestionDetailListPC : {
                textArr: [
                    { value: "q_category", label: "问题分类" },
                    { value: "q_classification", label: "问题类型" },
                    { value: "q_description", label: "问题描述" }
                ],
                curcleTextArr: [
                    { value: "q_level", label: "问题级别" },
                    { value: "recurrent_rate", label: "问题重现率" },
                    { value: "record_number", label: "记录" }
                ]
            },
        }
    },
    props: {
    },
    computed: {
        qLevelList() {
            return this.$store.getters.getQLevelList;
        },
        routeList() {
            return this.$store.getters.getReportRouteList[this.reportType];
        },
        axiosList(){
            let test_type = ""
            if(this.isPC){
                test_type = "11"
            }else {
                test_type = "10"
            }
            return{
                table_name: this.$route.query.testRecordName,
                test_type: test_type,
                question_id: this.$route.query.questionId
            }
        },
    },
    watch: {

    },
    created() {
        this.reportType = 'expert'
        if(this.$route.path == '/mtl_test_platform/page/questionDetailPC'){
            this.isPC = true
            this.questionDetailList = this.expertQuestionDetailListPC
        }else {
            this.isPC = false
            this.questionDetailList = this.expertQuestionDetailList
        }
        this.getLastPage();
    },
    mounted() {
        this.$store.commit("setPageIsLoading", false);
        //获取数据
        this.getData();
        let _this = this;
        $(window).resize(() => {
            this.showOverK++;
        })
    },
    methods: {
        //获取上一页数据
        //问题详情界面的入口有两个，1.问题报告页签，2.终端报告页 3：问题跟踪管理页 
        getLastPage() {
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            if (queryList.packageType != undefined) {
                this.lastPackageType = queryList.packageType;
            }
        },

        //返回问题汇总页
        jumpQuestionPage(packageType) {
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            queryList.packageType = packageType;
            let minApp = ""
            if(this.isPC){
                minApp = "/mtl_test_platform/page/compatibilityPCTestReport"
            }else{
                minApp = "/mtl_test_platform/page/compatibilityTestReport"
            }
            this.$router.push({
                path: minApp,
                query: queryList
            })
            let newPath = this.routeList.prefix + this.routeList.testReport;
            this.$publicJS.iframeParentPost(newPath, queryList, true, this);
        },

        //获取问题数据
        getData() {
            let list = JSON.parse(JSON.stringify(this.axiosList));
            let minApp = ""
            if(this.isPC){
                minApp = "expertCompatibilityPC"
            }else{
                minApp = "expertCompatibility"
            }
            this.$codePost("/"+ minApp +"/expert_test_question_detail/", list, { operation: "获取问题数据", failed: true }).then(res => {
                if (res.code == 200) {
                    console.log(res.data)
                    this.questionData = res.data.question_data;
                    this.deviceData = res.data.device_data;
                    this.allPicture = res.data.all_picture;
                    this.selectIndex = 0;
                    console.log(this.deviceData)
                }
            })
        },

        //设备标题内容是否超出
        hasOver(id, k) {
            if (k != 0) {
                let textWidth = $("#" + id).width();
                let divWidth = $(".menu-div").width();
                return textWidth < divWidth - 32;
            } else {
                return true;
            }
        }
    },
}
</script>

<style scoped>
.aside-item {
    width: 100%;
    height: 40px;
    display: flex;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.question-text {
    width: 40%;
    display: inline-block;
    vertical-align: middle;
}

.question-text-item>.title {
    font-size: 16px;
    color: rgb(85, 85, 85);
}

.question-text-item>.title::after {
    content: "：";
}

.question-text-item>.text {
    font-size: 18px;
    color: rgb(51, 51, 51);
    display: inline-block;
    vertical-align: top;
}

.question-circle-text {
    width: 60%;
    display: inline-block;
    vertical-align: middle;
}

.deviceDetailModel {
    margin-top: 1rem;
}

.device-radio {
    margin-bottom: 1rem;
}

.device-radio>>>.el-radio {
    margin: 0 4px 4px 0 !important;
}
</style>

