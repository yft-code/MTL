<template>  
    <div>
        <!-- {{passRate}} -->
        <div style="height: 200px" v-if="passRate">
            <!-- 数据部分 -->
            <div class="rate-text">
                <div class="rate-text-div">
                    <el-row>
                        <el-col :span="8">
                            <div class="item">
                                <div class="title">本次测试协议数</div>
                                <span class="num">{{ passRate.protocol_num }}</span>
                                <span> 条</span>
                            </div>
                            <div class="item">
                                <div class="title">协议通过率</div>
                                <span class="num">{{ passRate.pass_protocol_num == 0 ? 0 : (passRate.pass_protocol_num/passRate.protocol_num*100).toFixed(2) }}%</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="item">
                                <div class="title">通过</div>
                                <span class="num">{{ passRate.pass_protocol_num }}</span>
                                <!-- <span class="num">{{ passRate.not_pass_protocol_num }}</span> -->
                                <span> 条</span>
                            </div>
                            <div class="item">
                                <div class="title">不通过</div>
                                <span class="num">{{ passRate.not_pass_protocol_num }}</span>
                                <!-- <span class="num">{{ passRate.pass_protocol_num }}</span> -->
                                <span> 条</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="item">
                                <div class="title">发现问题数</div>
                                <span class="num">{{questionData.length}}</span>
                                <span> 个</span>
                            </div>
                            <!-- <div class="item">
                                <div class="title">问题协议数</div>
                                <span class="num">{{ passRate.pass_protocol_num == 0 ? 0 : (passRate.pass_protocol_num/passRate.protocol_num*100).toFixed(2) }}%</span>
                            </div> -->
                        </el-col>
                    </el-row>
                </div>
            </div>
            <!-- 饼图部分 -->
            <div v-if="passRate" class="rate-pie" id="pie-div">
                <div v-if="passRate" ref="passRateRef" class="pass-rate-div"></div>
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

        }
    },
    props: {
        passRate:{},
        questionData: {},
    },
    computed: {
        
    },
    watch:{
    },
    created() {
        this.$nextTick(() => {
            this.drawPassRateData(this.handlePieData(this.passRate))
        })
    },
    mounted(){
        this.$nextTick(() => {
            this.drawPassRateData(this.handlePieData(this.passRate))
        })
    },
    methods: {
        handlePieData(data){
            let pieData = []
            pieData.push({
                name: "通过",
                value: data.pass_protocol_num
            })
            pieData.push({
                name: "不通过",
                value: data.not_pass_protocol_num
            })
            // console.log(pieData)
            return pieData
        },
        // 绘制通过率饼图
        drawPassRateData(data){
            if(this.$refs.passRateRef){
                this.$nextTick(() => {
    
                    let myChart = this.$echarts.init(this.$refs.passRateRef);
                    let option = {
                        graphic: {
                            type: 'text', // 添加文本类型的图形元素
                            left: 'center', // 水平居中
                            top: 'middle', // 垂直居中
                            style: {
                                text: (this.passRate.pass_protocol_num == 0 ? 0 : (this.passRate.pass_protocol_num/this.passRate.protocol_num*100).toFixed(2)) + '%\n协议通过率', // 显示的文本内容
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
                                var res = params.name + ":" + params.value + "条(" + params.percent + "%)"
                                return res;
                            },
                            confine: true
                        },
                        color: ['#3e71fd', '#ff355f'],
                        series: [
                            {
                                type: 'pie',
                                data: data,
                                radius: ['40%', '60%'],
                                label: {
                                    show: true,
                                    formatter: function(arg){
                                        return arg.name + arg.value + '条\n' + arg.percent + '%'
                                    }
                                },
                            }
                        ]
                    };
                    myChart.setOption(option);
                    window.addEventListener('resize', function() { myChart.resize() });
                })
            }
        },
    },

}
</script>

<style lang="less" scoped>
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
    width: 30%;
    height: 200px;
    display: inline-block;
    vertical-align: top;
}
.pass-rate-div{
    width: 400px;
    height: 200px;
}
</style>
