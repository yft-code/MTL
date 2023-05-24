<template>
    <div>
        <self-dialog 
            ref="testStaticRef" 
            :dialog-data="{ title: '测试数据统计', width: '50%', closeName: '关闭' }"
            >
            <div v-for="v,k,index in testStaticData" :key="k">
                <div class="report-card">
                    <div class="card-title">
                        <div class="title">{{ testStaticData[k].name }}</div>
                        <div class="other-span"></div>
                        <div class="expand-div" @click="changeExpand(k)">
                            <div class="expand-icon">
                                <i :class="[testStaticData[k].show ? 'el-icon-arrow-up':'el-icon-arrow-down']" style="color:#ffffff"></i>
                            </div>
                            <div class="expand">{{ testStaticData[k].show ? '收起':'展开' }}</div>
                        </div>
                    </div>
                    <div v-if="testStaticData[k].show" class="card-body">   
                        <static-chart v-if="testStaticData[k].x_data" :chartData="testStaticData[k]" :ref="k" :curRef="k"></static-chart>
                    </div>
                </div>
            </div>

        </self-dialog>
    </div>
</template>
<script>
import StaticChart from '@/components/StartTest/Common/StaticChart'
export default {
    components: {
        StaticChart
    },
    props: {
        appUrl: {}
    },
    data() {
        return {
            testStaticData: {},
        }
    },
    computed: {
    },
    watch: {

    },
    created() {
        
    },
    mounted() {
    },
    methods: {
        // 获取测试统计信息
        getTestStaticData(){
            let list = { table_name: this.$route.query.testRecordName };
            if(this.appUrl == 'protocolTest'){
                list.id = this.$route.query.id
            }
            this.$codePost("/" + this.appUrl + "/get_statistics_data/", list, { operation: "获取测试统计数据", failed: true }).then(res => {
                if (res.code == 200) {
                    this.testStaticData = res.data
                }
            })
        },

        openDialog(){
            this.getTestStaticData()
            this.$refs.testStaticRef.openDialog()
        },

        changeExpand(index){
            // this.$set(this.testStaticData[index], 'show', !item.show);
            this.testStaticData[index].show = !this.testStaticData[index].show
        },
        
    },

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
</style>
