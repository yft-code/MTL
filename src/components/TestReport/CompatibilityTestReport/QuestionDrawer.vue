<template>
    <div>
        <self-drawer  ref="questionDrawerRef" :title="'问题详情'">
            <div v-if="questionDetailList" class="detail-main">
                <div class="gray-div">
                    <div class="question-text">
                        <div class="question-text-item" v-for="(item,index) in questionDetailList.textArr" :key="'text_'+index">
                            <span class="title">{{ item.label }}</span>
                            <span class="text" style="display:inline-block;">{{ questionData[item.value] }}</span>
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
                            <swiper-test :imagePath="allPicture" :isPc="false" :show-title="true"/>
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
                <div v-if="deviceData.length > 0" >
                    <div style="margin: 1rem 1rem;">
                        <!-- <span style="font-size: 16px;color: #333333;">设备详情</span> -->
                        <span style="font-size: 16px;color: #333333;">相关设备</span>
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
                    <device-item-show-drawer :deviceData="deviceData[selectIndex].device" 
                        :show-detail="true" 
                        :report-type="reportType"
                        />
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
            questionDetailList: {
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
            questionData: '',
            reportType: 'expert',
            deviceData: [],
            allPicture: [],
            selectIndex: 0,
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
        prePath(){
            return this.$store.getters.getPrePath
        },
    },
    created() {
    },
    methods: {
        openDrawer(item){
            // console.log(item)
            this.getQuestionData(item)
            this.$refs.questionDrawerRef.openDrawer()
        },

        async getQuestionData(item){
            let list = {
                question_id: item.id,
                table_name: this.$route.query.testRecordName,
                test_type: 10,
            }
            await this.$codePost("/expertCompatibility/expert_test_question_detail/", list, { operation: "获取问题数据", failed: true }).then(res => {
                if (res.code == 200) {
                    // console.log(res.data)
                    this.questionData = res.data.question_data;
                    this.deviceData = res.data.device_data;
                    // console.log(res.data.all_picture)
                    this.allPicture = res.data.all_picture;
                    // this.allPicture = this.getPicturePath(res.data.all_picture);
                    this.selectIndex = 0;
                    // console.log(this.deviceData)
                }
            })
        },

        async getPicturePath(list){
            let arr = [];
            for(let i = 0; i < list.length; i++){
                let item = list[i];
                let pic = {}
                pic['device_name'] = item.device_name;
                await this.$codePost('/service/get_driver_file/', {
                    pre_path: this.prePath.pic,
                    path: item.picture,
                }).then(res=>{
                    pic['picture'] = res.data
                })
                arr.push(pic);
            }
            console.log(arr)
            return arr;
        },
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
    width: 20%;
    font-size: 16px;
    color: rgb(85, 85, 85);
}

.question-text-item>.title::after {
    content: "：";
}

.question-text-item>.text {
    width: 80%;
    font-size: 14px;
    color: rgb(51, 51, 51);
    display: inline-block;
    vertical-align: top;
    text-align: left;
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
