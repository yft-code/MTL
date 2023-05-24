<template>
    <div class="gray-div">
        <div class="device-text">
            <div v-if="deviceData.device_pic != undefined && deviceData.device_type != 'AS'" class="deviceImg">
                <img style="width:100%;height:100%;" :src="deviceData.device_pic">
            </div>
            <div class="device-text-div">
                <!-- <div class="device-name">{{ deviceData.device }}</div> -->
                <div>
                    <div 
                        class="device-text-item" 
                        v-for="(item,index) in deviceDetail" 
                        v-if="deviceData[item.value]"
                        :key="'text_' + index" 
                        :style="{ width:item.width }"
                        >
                        <span class="title" v-html="item.label"></span>
                        <span class="text">
                            {{ deviceData[item.value] }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="device-right-item">
            <div v-if="showDetail">
            </div>
            <div v-else class="circle-text-item" >
                <div class="content">
                    <div>适配结果</div>
                    <div 
                        v-if="reportType == 'deep'" 
                        :class="{ 'theme-green': deviceData.is_pass, 'theme-red': !deviceData.is_pass }"
                    >
                        {{deviceData.is_pass?"通过":"不通过"}}
                    </div>
                    <div 
                        v-else 
                        :class="{ 'theme-green': deviceData.if_pass == '通过', 'theme-red': deviceData.if_pass != '通过' }"
                    >
                        {{deviceData.if_pass=='通过'?"通过":"不通过"}}
                    </div>
                </div>
            </div>
        </div>

        <div class="device-text" style="margin-top: 10px;" v-if="deviceData.log_file">
            <div style="display: inline-block; margin-left: 10px;">日志：</div>
            <div style="display: inline-block;">
                <a ref="logRef" download style="display: none;">{{deviceData.log_file}}</a>
                <span style="color: blue; cursor: pointer;" @click="downloadLog">{{deviceData.log_file}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            deviceDetail: "",
            expertDeviceDetail: [
                {
                    label: '操作系统',
                    value: 'os',
                    width: "30%",
                }, 
                {
                    label: '显卡',
                    value: 'gpu',
                    width: "30%",
                }, 
                {
                    label: '输入法',
                    value: 'input',
                    width: "30%",
                }, 
                {
                    label: '杀毒软件',
                    value: 'antivirus_software',
                    width: "30%",
                }, 
                {
                    label: '游戏内分辨率',
                    value: 'game_resolution',
                    width: "30%",
                }, 
                {
                    label: '显示器分辨率',
                    value: 'pc_resolution',
                    width: "30%",
                }, 
                {
                    label: '游戏画质',
                    value: 'display_quality',
                    width: "30%",
                }, 
                {
                    label: '画面模式',
                    value: 'picture_mode',
                    width: "30%",
                }, 
                {
                    label: '游戏存储位置',
                    value: 'game_location',
                    width: "30%",
                }, 
                {
                    label: '游戏内语言',
                    value: 'game_language',
                    width: "30%",
                }, 
                {
                    label: '系统语言',
                    value: 'os_language',
                    width: "30%",
                }, 
                {
                    label: '游戏平台',
                    value: 'game_platform',
                    width: "30%",
                }, 
                {
                    label: '其他',
                    value: 'other_set',
                    width: "30%",
                }, 
            ],
            deepDeviceDetail: [
                {
                    value: "os",
                    label: "系&emsp;统",
                    width: "25%",
                }, {
                    value: "cpuCore",
                    label: "CPU核数",
                    width: "35%",
                }, {
                    value: "ram",
                    label: "内存",
                    width: "25%",
                }, {
                    value: "resolution",
                    label: "分辨率",
                    width: "25%",
                }, {
                    value: "cpuFreq",
                    label: "CPU主频",
                    width: "35%",
                }
            ]
        }
    },
    computed: {
        routeList() {
            return this.$store.getters.getReportRouteList[this.reportType];
        },
        prePath(){
            return this.$store.getters.getPrePath
        },
    },
    props: {
        deviceData: {
            required: true,
            type: Object
        },
        showDetail: {
            type: Boolean,
        },
        reportType: {
            required: true,
            type: String
        }
    },
    created() {
        if (this.reportType == "deep") {
            this.deviceDetail = this.deepDeviceDetail;
        } else {
            this.deviceDetail = this.expertDeviceDetail;
        }
    },
    mounted() {

    },
    methods: {
        downloadLog(){
            this.$codePost('/service/get_driver_file/', {
                pre_path: this.prePath.log,
                path: this.deviceData.log_file
            }).then(res=>{
                if(res.code == 200){
                    this.$refs.logRef.href = res.data;
                    this.$refs.logRef.click();
                }
            })
        },
        //跳转设备详情页
        jumpDeviceDetail(deviceId) {
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            queryList.deviceId = deviceId;
            //从问题详情进入设备详情时，参数中删除packageType项，因为设备详情中需要通过判断packageType的值确定上一页是什么
            delete(queryList.packageType);
            // console.log(queryList)

            this.$router.push({
                path: "/mtl_test_platform/page/problemDeviceDetail",
                query: queryList
            })

            let newPath = this.routeList.prefix + this.routeList.deviceDetail;

            // console.log(newPath)
            // this.$publicJS.iframeParentPost(newPath, queryList, true, this);
        }
    },

}
</script>

<style scoped>
.device-text {
    width: calc(100% - 120px);
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
}

.device-right-item {
    width: 120px;
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    text-align: right;
}

.deviceImg {
    width: 60px;
    display: inline-block;
    vertical-align: middle;
}

.device-text-div {
    width: calc(100% - 70px);
    margin-left: 10px;
    display: inline-block;
    vertical-align: middle;
}

.device-name {
    font-size: 18px;
    color: #333333;
    margin-bottom: 0.5rem;
}

.device-text-item {
    display: inline-block;
    margin-right: 3%;
    vertical-align: middle;
    color: #333333;
}

.device-text-item>.text::before {
    content: "：";
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
</style>
