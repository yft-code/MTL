<template>
    <div>   
        <div class="report-card">
            <div class="card-title" style="background: #f0f1f2">
                <div class="title" style="color: #303133">测试要求</div>
                <div class="other-span" style="color: #303133">
                    <span v-if="total_finished && total">共计已完成 {{ total_finished }} 条 / 总共 {{ total }} 条</span>
                </div>
                <div class="expand-div" @click="requestShow=!requestShow">
                    <div class="expand-icon"  style="background: #f0f1f2">
                        <i :class="[requestShow ? 'el-icon-arrow-up':'el-icon-arrow-down']"  style="color: #303133"></i>
                    </div>
                    <div class="expand"  style="color: #303133">{{ requestShow ? '收起':'展开' }}</div>
                </div>
            </div>
            <div class="card-body" v-if="requestShow" style="fontSize: 14px;">
                <!-- 手游兼容性 -->
                <div v-if="serverName == 'compatibility'">
                    <div v-if="testDetail.android_platform">
                        <div class="request-title">Android</div>
                        <div class="request-content">

                            <span v-for="item,i in testRequest.Android" :key="i" v-if="testDetail[item.propName]" class="request-item">
                                {{item.titleName}}：{{testDetail[item.propName]}}
                            </span>
                        </div>
                    </div>
                    <div v-if="testDetail.ios_platform" class="request-type">
                        <div class="request-title">iOS</div>
                        <div class="request-content">

                            <span v-for="item,i in testRequest.iOS" :key="i" v-if="testDetail[item.propName]" class="request-item">
                                {{item.titleName}}：{{testDetail[item.propName]}}
                            </span>
                        </div>
                    </div>
                    <div v-if="testDetail.simulator_platform" class="request-type">
                        <div class="request-title">模拟器</div>
                        <div class="request-content">
                            <span v-for="item,i in simulatorData" :key="i" v-if="testDetail[item.value] !== 0" class="request-item">
                                {{item.label}}
                            </span>
                        </div>
                    </div>
                    <div v-if="testDetail.pc_platform">
                        <div class="request-title">PC最低配置</div>
                        <div class="request-content">
                            <span v-for="item,i in testRequest.PC" :key="i" v-if="testDetail[item.propName]" class="request-item">
                                {{item.titleName}}：{{testDetail[item.propName]}}
                            </span>
                        </div>
                    </div>
                </div>
                <!-- 端游兼容性 -->
                <div v-else-if="serverName == 'compatibilityPC'">
                    <div class="request-content">
                        <span v-for="item,i in testRequest" :key="i" v-if="testDetail[item.propName]" class="request-item">
                            {{item.titleName}}：{{testDetail[item.propName]}}
                        </span>
                    </div>
                </div>
                <!-- 协议 -->
                <div v-else-if="serverName == 'protocol'">
                    <div v-if="testDetail.protocols || testDetail.protocols_file" style="margin-bottom: 5px;">
                        <span style="display: inline-block; vertical-align: top;">具体协议：</span>
                        <input-and-upload-read 
                            style="display: inline-block;"
                            :text="testDetail.protocols" 
                            :file="testDetail.protocols_file" 
                            fileSuffix="prePath.protocol" 
                        />
                    </div>
                    <div class="request-content">
                        <span v-for="item,i in testRequest" :key="i" v-if="testDetail[item.propName] && testDetail[item.propName] !== 'null'" class="request-item">
                            {{item.titleName}}：{{testDetail[item.propName]}}
                        </span>
                    </div>
                </div>
                <!-- 手游性能 -->
                <div v-else-if="serverName == 'performance'">
                    <!-- 测试设备 -->
                    <div v-if="testDetail.device && checkDevice(JSON.parse(testDetail.device))" style="margin-bottom: 5px;">
                        <span style="display: inline-block; vertical-align: top;">测试设备：</span>
                        <span v-for="item,i in JSON.parse(testDetail.device)" :key="i">
                            <span v-if="item.value !== ''">{{ item.value.split(',').join('，')}} {{i !== JSON.parse(testDetail.device).length - 1 ? '，' : '' }}</span>
                        </span>
                    </div>
                    <!-- 游戏画质 -->
                    <div v-if="testDetail.game_quality" style="margin-bottom: 5px;">
                        <span style="display: inline-block; vertical-align: top;">游戏画质：</span>
                        {{ testDetail.game_quality.split('_')[0] == '1' ? '指定画质【'+testDetail.game_quality.split('_')[1]+'】' : '装包后第一次进入的默认画质' }}
                    </div>
                    <!-- 测试内容 -->
                    <div v-if="testDetail.test_data_field && JSON.parse(testDetail.test_data_field).length !== 0" style="margin-bottom: 5px;">
                        <span style="display: inline-block; vertical-align: top;">测试内容：</span>
                        <span v-for="item,i in JSON.parse(testDetail.test_data_field)" :key="i">
                            {{ item.split('：')[0] + "【"+ item.split('：')[1] +"】" }} {{i !== JSON.parse(testDetail.test_data_field).length - 1 ? '；' : ''}}
                        </span>
                    </div>
                    <div class="request-content">
                        <span v-for="item,i in testRequest" :key="i" v-if="testDetail[item.propName]" class="request-item">
                            {{item.titleName}}：{{testDetail[item.propName]}}
                        </span>
                    </div>
                    
                </div>

                <!-- 通用 - 备注 -->
                <div v-if="testDetail.remarks" class="request-type">
                    <div class="request-content">
                        <span class="request-item">
                            备注：{{testDetail.remarks}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InputAndUploadRead from '@/components/Common/InputAndUploadRead'
export default {
    components: {
        InputAndUploadRead,
    },
    props: {
        testDetail: {},
        testRequest: {},
        simulatorData: {},
        serverName: {},
        total: {},
        total_finished: {},
    },
    data() {
        return {
            requestShow: true,
        }
    },
    computed: {
        prePath() {
            return this.$store.getters.getPrePath
        },
    },
    created() {
    },
    mounted() {
        

    },
    methods: {

        checkDevice(device){
            let result = true
            for(let i = 0; i < device.length; i++){
                if(device[i].value == ''){
                    result = false
                    break
                }
            }
            return result
        }
    }

}
</script>

<style scoped>
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
    border: 1px solid #EBEEF5;
}

.request-type{
    margin-top:10px;
}

.request-title{
    width:6%; 
    display:inline-block;
    vertical-align: top;
    /*
    font-weight: bold;
    */
}

.request-content{
    display:inline-block; 
    vertical-align: top;
    width: 93%;
}

.request-item{
    width: 20%; 
    display:inline-block;
    vertical-align: top;
}

.comment{
    white-space:pre-wrap;
}
</style>