<template>
    <div v-loading="loading" style="margin-bottom:30px;">
        <div class="btn-group">
            <el-button v-for="item, index in btnContent" :key="index" @click="handleChooseClick(item.label)">{{item.value}}</el-button>
        </div>

        <!-- 品牌分析数据 -->
        <div v-if="currentName == 'brand'" class="chart-group">
            <el-row>
                <el-col :span="12">
                    <div class="test-device-static-div" ref="allChartRef"></div>
                </el-col>
                <el-col :span="12">
                    <div class="test-device-static-div" ref="probleChartmRef"></div>
                </el-col>
            </el-row>
        </div>

        <!-- 系统版本数据 -->
        <div v-else-if="currentName == 'os'" class="chart-group">
            <el-row>
                <el-col :span="12">
                    <div class="test-device-static-div" ref="allOsRef"></div>
                </el-col>
                <el-col :span="12">
                    <div class="test-device-static-div" ref="probleOsRef"></div>
                </el-col>
            </el-row>
        </div>

        <!-- 分辨率分析数据 -->
        <div v-else-if="currentName == 'resolution'" class="chart-group">
            <el-row>
                <el-col :span="12">
                    <div class="test-device-static-div" ref="allResolutionRef"></div>
                </el-col>
                <el-col :span="12">
                    <div class="test-device-static-div" ref="probleResolutionRef"></div>
                </el-col>
            </el-row>
        </div>

        <!-- 内存分析数据 -->
        <div v-else-if="currentName == 'ram'" class="chart-group">
            <el-row>
                <el-col :span="12">
                    <div class="test-device-static-div" ref="allRamRef"></div>
                </el-col>
                <el-col :span="12">
                    <div class="test-device-static-div" ref="probleRamRef"></div>
                </el-col>
            </el-row>
        </div>

        <!-- 屏幕尺寸分析数据 -->
        <div v-else-if="currentName == 'screen_size'" class="chart-group">
            <el-row>
                <el-col :span="12">
                    <div class="test-device-static-div" ref="allScreenSizeRef"></div>
                </el-col>
                <el-col :span="12">
                    <div class="test-device-static-div" ref="probleScreenSizeRef"></div>
                </el-col>
            </el-row>
        </div>

        <!-- CPU型号分析数据 -->
        <div v-else class="chart-group">
            <div class="cpu-static-bar-div" ref="allCpuRef"></div>
            <div class="cpu-static-bar-div" ref="problemCpuRef"></div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        axiosList: {
            required: true,
            type: Object
        },
    },
    data() {
        return {
            loading: 'true',
            staticData: '',
            currentName: "brand",
            btnContent: [
                {
                    label: 'brand',
                    value: '品牌分析',
                },
                {
                    label: 'os',
                    value: '系统版本分析'
                },
                {
                    label: 'resolution',
                    value: '分辨率分析'
                },
                {
                    label: 'ram',
                    value: '内存分析'
                },
                {
                    label: 'screen_size',
                    value: '屏幕尺寸分析'
                },
                {
                    label: 'apu',
                    value: 'CPU型号分析'
                },
            ],
        }
    },
    created() {
        // this.drawStaticAll("test")
        // this.drawStaticProblem("test")
        this.getStaticData()
    },
    watch: {
        currentName(newName, oldName){
            if(newName == 'brand'){
                this.drawStaticAll(this.staticData.brand.detail_info)
                this.drawStaticProblem(this.staticData.fail_brand.detail_info)
            }
            else if(newName == 'os'){
                this.drawOsAll(this.staticData.os.detail_info)
                this.drawOsFailed(this.staticData.fail_os.detail_info)
            }
            else if(newName == 'resolution'){
                this.drawResolutionAll(this.staticData.resolution.detail_info)
                this.drawResolutionFailed(this.staticData.fail_resolution.detail_info)
            }
            else if(newName == 'ram'){
                this.drawRamAll(this.staticData.ram.detail_info)
                this.drawRamFailed(this.staticData.fail_ram.detail_info)
            }
            else if(newName == 'screen_size'){
                this.drawScreenSizeAll(this.staticData.screen_size.detail_info)
                this.drawScreenSizeFailed(this.staticData.fail_screen_size.detail_info)
            }
            else{
                this.drawCpuAll(this.staticData.cpu)
                this.drawCpuFailed(this.staticData.fail_cpu)
            }
        }
    },
    mounted(){

    },
    methods: {
        // 获取设备的统计数据
        getStaticData(){
            let list = JSON.parse(JSON.stringify(this.axiosList));
            list.system = "all";

            this.$codePost("/expertCompatibility/expert_test_terminal_static/", list, { operation: "获取统计数据", failed: true }).then(res => {
                if (res.code == 200) {
                    // console.log(res.data)
                    this.staticData = res.data
                    this.loading = false
                    this.drawStaticAll(this.staticData.brand.detail_info)
                    this.drawStaticProblem(this.staticData.fail_brand.detail_info)
                }
            })
        },

        // 处理点击分析项按钮
        handleChooseClick(name){
            // console.log(name)
            this.currentName = name
        },


        // 全部机型-品牌
        drawStaticAll(data){
            this.$nextTick(() => {
                this.drawPieCommon(data, this.$refs.allChartRef, '所有机型')
            })
        },

        // 问题机型-品牌
        drawStaticProblem(data){
            this.$nextTick(() => {
                this.drawPieCommon(data, this.$refs.probleChartmRef, '问题机型')
            })
        },

        // 全部机型-系统版本
        drawOsAll(data){
            this.$nextTick(() => {
                this.drawPieCommon(data, this.$refs.allOsRef, '所有机型')
            })
        },

        // 问题机型-系统版本
        drawOsFailed(data){
            this.$nextTick(() => {
                this.drawPieCommon(data, this.$refs.probleOsRef, '问题机型')
            })
        },

        // 全部机型-分辨率
        drawResolutionAll(data){
            this.$nextTick(() => {
                this.drawPieCommon(data, this.$refs.allResolutionRef, '所有机型')
            })
        },

        // 问题机型-分辨率
        drawResolutionFailed(data){
            this.$nextTick(() => {
                this.drawPieCommon(data, this.$refs.probleResolutionRef, '问题机型')
            })
        },

        // 全部机型-内存
        drawRamAll(data){
            this.$nextTick(() => {
                this.drawPieCommon(data, this.$refs.allRamRef, '所有机型')
            })
        },

        // 问题机型-内存
        drawRamFailed(data){
            this.$nextTick(() => {
                this.drawPieCommon(data, this.$refs.probleRamRef, '问题机型')
            })
        },

        // 全部机型-屏幕尺寸
        drawScreenSizeAll(data){
            this.$nextTick(() => {
                this.drawPieCommon(data, this.$refs.allScreenSizeRef, '所有机型')
            })
        },

        // 问题机型-屏幕尺寸
        drawScreenSizeFailed(data){
            this.$nextTick(() => {
                this.drawPieCommon(data, this.$refs.probleScreenSizeRef, '问题机型')
            })
        },

        // 通用饼图的绘制
        drawPieCommon(pieData, refName, text){
            let myChart = this.$echarts.init(refName);
            let option = {
                title: {
                    show: true,
                    text: text,
                    textStyle: {
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: '16',
                    },
                    left: 'center',
                    top: 'bottom',
                },
                tooltip: {
                    axisPointer: { 
                        type: 'shadow'
                    },
                    formatter : function(params){  
  						var res = params.name + ":" + params.value + "台(" + params.percent + "%)"
  						return res;
					}
                },
                series: [
                    {
                        type: 'pie',
                        data: pieData,
                        radius: ['40%', '60%'],
                        label: {
                            show: true,
                            formatter: function(arg){
                                return arg.name + " (" + arg.value + ' 台)\n' + arg.percent + '%'
                            }
                        },
                    }
                ]
            };
            myChart.setOption(option);
            window.addEventListener('resize', function() { myChart.resize() });
        },

        // 全部机型-CPU
        drawCpuAll(data){
            this.$nextTick(() => {
                this.drawBarCommon(data, this.$refs.allCpuRef, '所有机型')
            })
        },

        // 问题机型-CPU
        drawCpuFailed(data){
            this.$nextTick(() => {
                this.drawBarCommon(data, this.$refs.problemCpuRef, '问题机型')
            })
        },

        // 通用柱状图绘制
        drawBarCommon(data, refName, text){
            let myChart = this.$echarts.init(refName);
            let option = {
                title: {
                    show: true,
                    text: text,
                    textStyle: {
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: '16',
                    },
                    left: 'center',
                    top: 'top',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { 
                        type: 'shadow'
                    },
                },
                dataZoom: [
                    {
                        type: 'inside',
                        xAxisIndex: [0],
                    },
                    {
                        type: 'slider',
                        xAxisIndex: [0],
                    }
                ],
                grid: {
                    // left: "20%",
                    bottom: '30%',
                },
                xAxis: {
                    type: 'category',
                    data: data.x_data,
                    axisLabel: {
                        interval:0,
                        rotate:20,
                    }
                },
                yAxis: {
                    type: 'value',
                    // splitLine: {
                    //     show: false
                    // },
                },
                series: [
                    {
                        type: 'bar',
                        barMaxWidth: '30',
                        data: data.y_data,
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function(arg){
                                return arg.value + ' 台'
                            },
                            color: '#333333',
                        },
                    },
                ]
            };
            if(text == '所有机型'){
                option.color = '#3e71fd';
            }else{
                option.color = '#c23531';
            }
            myChart.setOption(option);
            window.addEventListener('resize', function() { myChart.resize() });
        }
    }
}
</script>

<style lang="less" scoped>
.btn-group {
    margin-top: 15px;
    text-align: center;
    .el-button {
        margin-left: 20px;
    }
}
.chart-group {
    margin-top: 20px;
}
.test-device-static-div {
    width: 450px;
    height: 300px;
    margin: auto;
}
.cpu-static-bar-div{
    width: 1800px;
    height: 400px;
}
</style>