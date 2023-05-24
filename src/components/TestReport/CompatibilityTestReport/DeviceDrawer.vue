<template>
    <div>
        <self-drawer  ref="deviceDrawerRef" :title="'设备详情'">
            <!-- 主体 -->
            <div class="detail-main">
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
                <device-item-show-drawer
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
                        <el-row style="max-height: 600px;">
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
                                <!-- <div class="question-img-text-div" :key="'question_' + selectIndex">
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
                                </div> -->
                                <swiper-test 
                                    style="height:333px" 
                                    :imagePath="questionData[selectIndex].picture" 
                                    :show-title="reportType == 'expert'" 
                                    />
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </self-drawer>
    </div>
</template>


<script> 
import SelfDrawer from '@/components/Common/SelfDrawer'
import SwiperTest from '@/components/TestReport/CompatibilityTestReport/SwiperTest'
import DeviceItemShowDrawer from '@/components/TestReport/CompatibilityTestReport/DeviceItemShowDrawer'
export default {
    components: {
        SelfDrawer,
        SwiperTest,
        DeviceItemShowDrawer
    },
    data() {
        return {
            selectedDevice: '', //当前选择设备值
            deviceList: [], //可选择设备列表
            deviceData: '',
            questionData: [],
            selectIndex: 0,
            questionList: [
                {
                    value: "q_category",
                    label: "问题分类",
                    width: "80%",
                },
                {
                    value: "q_classification",
                    label: "问题类型",
                    width: "80%",
                },
                {
                    value: "recurrent_rate",
                    label: "问题重现率",
                    width: "80%",
                },
                {
                    value: "q_description",
                    label: "问题描述",
                    width: "80%",
                },
            ],
            reportType: 'expert',
        }
    },
    props: {
    },
    mounted(){

    },
    computed: {
        qLevelList() {
            return this.$store.getters.getQLevelList;
        },
    },
    created() {
    },
    methods: {
        openDrawer(item){
            // console.log(item)
            this.getDeviceData(item.id)
            this.$refs.deviceDrawerRef.openDrawer()
        },

        getDeviceData(id){
            let list = {
                id: id,
                table_name: this.$route.query.testRecordName,
                test_type: 10,
            }
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
                
            })
        },

        //切换设备
        changeDevice(deviceId){
            this.selectIndex = 0;
            this.getDeviceData(deviceId);
            // //修改网址，便于刷新网页时获取到切换后的设备
            // //该段代码不能写在getData函数中，会导致初始的时候网址变化异常
            // let queryList = JSON.parse(JSON.stringify(this.$route.query));
            // queryList.deviceId = deviceId;
            // this.$publicJS.iframeParentPost(top.location.pathname, queryList, this);
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
    width: 95%;
    margin:auto;
    /*
    display: inline-block;
    */
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
.question-text-item{
    /*
    display: inline-block;
    width: 45%;
    */
    margin-bottom: 5px;
}
.question-circle-text {
    width: 80%;
    /*
    margin: auto;
    display: inline-block;
    */
    margin-top: 10px;
    margin-left: 10%;
    vertical-align: middle;
}

.deviceDetailModel {
    margin-top: 1rem;
}

.device-radio {
    margin-top: 0.5rem;
}

.device-radio>>>.el-radio {
    margin: 0 4px 4px 0 !important;
}

.circle-text-item{
    text-align: center;
    width: 7rem;
    height: 5rem;
    background-color: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 50%;
    display: inline-block;
    vertical-align: top;
    margin-right: 1rem;
    color: rgb(102, 102, 102);
    font-size: 16px;
    padding-top: 2rem;
}
:deep(.el-drawer__header){
    background-color: rgb(245,245,245);
    padding:0px 20px;
    height: 50px;
    color: #000000;
    margin-bottom: 0px;
}
:deep(.el-drawer__title){
    font-size: 20px;
}
.gray-div {
    width: 100%;
    background-color: #fafbfc;
    border-radius: 4px;
    border: 1px solid #e5e5e5;
    padding: 1rem;
    box-sizing: border-box;
}
.menu-and-slider {
    width: 100%;
    height: 454px;
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
.menu-and-slider-header .slider-title {
    display: inline-block;
    width: 83%;
    text-align: center;
}
.menu-and-slider .menu-div {
    display: inline-block;
    width: 17%;
    vertical-align: top;
    max-height: 413px;
    overflow-y: auto;
}
.menu-and-slider>.slider-div {
    display: inline-block;
    width: 83%;
    height: 413px;
    background-color: #fafbfc;
    vertical-align: top;
    border-left: 1px solid #eaecf4;
}
.menu-and-slider .tips-div {
    position: absolute;
    width: 3px;
    height: 40px;
    background-color: #3e71fd;
}
.menu-and-slider .menu-item {
    width: 100%;
    height: 40px;
    position: relative;
}
.menu-and-slider .choosed-menu {
    background-color: #F2F4F9;
}
.menu-and-slider .menu-item .menu-item-span {
    width: 100%;
    height: 40px;
    padding-left: 30px;
    cursor: pointer;
    line-height: 40px;
    color: #333333;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.menu-and-slider .menu-item .menu-item-span .select-item {
    color: #3e71fd;
}
.detail-main {
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0px 2px 12px 0px #e1e1e1;
    border-radius: 5px;
    padding: 1rem;
}
</style>
