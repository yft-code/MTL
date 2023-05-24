<template>
    <div class="gray-div">
        <div class="device-text">
            <div v-if="deviceData.device_pic != undefined && deviceData.device_type != 'AS'" class="deviceImg">
                <img style="width:100%;height:100%;" :src="deviceData.device_pic">
            </div>
            <div class="device-text-div">
                <div class="device-name">{{ deviceData.device }}</div>
                <div v-if="deviceData.device_type != 'AS'">
                    <div 
                        class="device-text-item" 
                        v-for="(item,index) in deviceDetail" 
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
                <el-button 
                    v-if="reportType == 'deep'" 
                    size="mini" 
                    @click="jumpDeviceDetail(deviceData.device_uuid)"
                >设备详情</el-button>
                <el-button 
                    v-else 
                    size="mini" 
                    @click="jumpDeviceDetail(deviceData.id)">设备详情</el-button>
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
                    value: "device_id",
                    label: "设备编号",
                    width: "25%",
                }, 
                {
                    value: "os",
                    label: "系&emsp;统",
                    width: "20%",
                }, 
                {
                    value: "cpuCore",
                    label: "CPU核数",
                    width: "35%",
                }, 
                {
                    value: "ram",
                    label: "内&emsp;&emsp;存",
                    width: "25%",
                }, 
                {
                    value: "resolution",
                    label: "分辨率",
                    width: "20%",
                }, 
                {
                    value: "cpuFreq",
                    label: "CPU主频",
                    width: "40%",
                },
                {
                    value: "cpuModel",
                    label: "CPU",
                    width: "25%",
                },
                {
                    value: "gpuModel",
                    label: "GPU",
                    width: "20%",
                },
                {
                    value: "deviceBrand",
                    label: "厂商",
                    width: "20%",
                },
                {
                    value: "marketShare",
                    label: "覆盖率",
                    width: "20%",
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
        }
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
</style>
