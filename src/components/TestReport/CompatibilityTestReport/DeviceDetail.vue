<template>
    <div>
        <el-tabs 
            v-if="deviceCount.all_device_number > 0" 
            v-model="platform" 
            type="border-card"
            @tab-click="changePlatform"
            >
            <el-tab-pane 
                v-for="(item, index) in platformArr" 
                :key="item.value" 
                v-if="deviceCount[item.value]"
                :label="item.label"
                :name="item.value"
                >
                <terminal-show 
                    v-if="platform == item.value" 
                    :platform="platform" 
                    :axios-list="axiosList" 
                    :report-type="reportType"
                    :show-nav.sync="showNav"
                    />
            </el-tab-pane>
        </el-tabs>
        <el-card v-else>暂无数据</el-card>
    </div>
</template>

<script>
import TerminalShow from '@/components/TestReport/CompatibilityTestReport/TerminalShow'
export default {
    components: {
        TerminalShow
    },
    props: {
        axiosList: {
            required: true,
            type: Object
        },
        reportType: {
            required: true,
            type: String,
        },
    },
    data() {
        return {
            platformArr:[
                {
                    value:"android",
                    label:"Android",
                },
                {
                    value:"ios", 
                    label:"iOS",  
                },
                {
                    value:"as",
                    label:"Android模拟器",
                }
            ],
            platform: "android",//当前选中了哪个平台
            deviceCount: {},
            showNav: true,
        }
    },
    created() {
        this.getDeviceCount();
    },
    methods: {
        //获取测试机型总数
        getDeviceCount() {
            this.$codePost("/expertCompatibility/test_report_info2/", this.axiosList, { operation: "获取测试机型", failed: true }).then(res => {
                if (res.code == 200) {
                    this.deviceCount = res.data;
                    this.getInitPlat();
                }
            })
        },

        //获取初始platform值
        getInitPlat() {
            let platform = this.$route.query.platform;
            if (this.deviceCount.all_device_number > 0) {
                //如果网址上给的platform值有效
                if (platform != undefined && this.deviceCount[platform]) {
                    this.platform = platform;
                } else {
                    //否则遍历获得第一个有效的
                    for (let i = 0; i < this.platformArr.length; i++) {
                        let value = this.platformArr[i].value;
                        if (this.deviceCount[value]) {
                            this.platform = value;
                            break;
                        }
                    }
                }
            }
        },

        //切换Tab
        changePlatform() {
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            queryList.platform = this.platform;
            queryList.packageType = 2;
            this.$store.commit("setProblemFilter", []);
            this.$publicJS.iframeParentPost1(top.location.pathname, queryList, this);
        },
    },
}
</script>

<style lang="less" scoped>
    
</style>