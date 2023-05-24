<template>
    <div v-loading="isLoading">   
        <div :ref="'result_histogram_' + index" style="height: 400px;" :style="this.$route.path=='/mtl_test_platform/page/performancePCTestReport' ? {'width': '1700px','height':'400px'} : {'height':'400px'}"></div>
    </div>
</template>

<script> 
const dataInterval = [0, 0.2, 1, 5, 10, 100, 1000, 5000, 10000, 50000];
export default {
    components: {
        
    },
    data() {
        return {
            isLoading: false,
            chartData: {
                x_data: [],
                y_data: [],
            },
        }
    },
    props: {
        tableData: {},
        index: {},
        basicColumnData: {},
    },
    computed: {
        
    },
    watch: {
    },
    created() {
        this.handleChartDate();
        this.$nextTick(()=>{
            this.drawChart(this.getBarOption(this.chartData))
        })
    },
    mounted() {
    },
    methods: {
        handleChartDate(){
            let x_data = []
            let y_data = []
            this.tableData.forEach(record => {
                this.basicColumnData.forEach(item => {
                    x_data.push(item.titleName)
                    y_data.push(record[item.propName])
                })
            })
            this.chartData.x_data = x_data
            this.chartData.y_data = y_data
            this.chartData.y_data1 = this.Standardize(y_data)
        },

        // 处理数据使坐标不等
        Standardize(y_data){
            let y_data1 = []
            for (var i = 0; i < y_data.length; i++) {
                //console.log(y_data[i])
                // 1.寻找在数据间隔里小于y_data的最大值
                const min_v = Math.max(...dataInterval.filter((v) => v <= y_data[i]));
                //console.log(y_data[i] + '-' + min_v);
                // 2.寻找在数据间隔里大于y_data的最小值
                const max_v = Math.min(...dataInterval.filter((v) => v > y_data[i]));
                //console.log(y_data[i] + '--' + max_v);
                //  3.寻找 min_v 所在的下标
                const index = dataInterval.findIndex((v) => v === min_v);
                //console.log(y_data[i] + '---' + index);
                //  4.计算该amount在y轴上应该展示的位置
                const y_value = ((y_data[i] - min_v) / (max_v - min_v)) * 10 + index * 10;
                //console.log(y_data[i] + '----' + y_value);
                y_data1[i] = y_value;
            }
            return y_data1
        },

        drawChart(option) {
            let _this = this
            let myChart = this.$echarts.init(this.$refs[`result_histogram_${this.index}`]);
            myChart.clear();
            myChart.setOption(option)
            window.addEventListener('resize', function() {
                myChart.resize()
            });
            myChart.on('click', function(param) {
                if (_this.filterType.length > 0) {//存在则跳转
                    _this.$set(_this.filterType[0].data[0],'value',param.name)
                    _this.$set(_this.filterType[0].data[0],'label',param.name)
                    _this.$store.commit("setProblemFilter", _this.filterType);
                }
            })
        },

        //柱状图选项
        getBarOption(chartData) {
            let xLabelData= []
            chartData.x_data.forEach(item => {
                xLabelData.push(item.split('(').join('\n('))
            })
            let dataLength = chartData.x_data.length;
            let endZoom = Math.floor(5000 / dataLength);
            if (endZoom > 100) {
                endZoom = 100;
            }
            let dataZoom = [];
            if (dataLength > 10) {
                dataZoom = [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: endZoom
                    },
                    {
                        type: "inside",
                        realtime: true,
                        start: 0,
                        end: endZoom
                    }
                ];
            }
            let _this = this;
            let option = {
                title: {
                    text: "",
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: (v) => {
                        return `<div>
                                <div>${v[0].axisValue}：${chartData.y_data[v[0].dataIndex]}</div>
                                </div>`;
                    }
                },
                legend: {
                    show: false,
                    x: '0',
                    y: '5',
                },
                dataZoom: dataZoom,
                grid: {
                    left: '20',
                    right: '20',
                    bottom: '10%',
                    containLabel: true
                },
                color: ['#5084fe'],
                xAxis: [
                    {
                        type: 'category',
                        name: "",
                        data: xLabelData,
                        axisLabel: {
                            rotate: 0,
                            interval: 0,
                        },
                        splitLine: {//去除网格线
                            show: false,
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                        formatter: (v, i) => {
                            if (i === 0) {
                                v = '0';
                            }
                            if (i === 1) {
                                v = '0.2';
                            }
                            if (i === 2) {
                                v = '1';
                            }
                            if (i === 3) {
                                v = '5';
                            }
                            if (i === 4) {
                                v = '10';
                            }
                            if (i === 5) {
                                v = '100';
                            }
                            if (i === 6) {
                                v = '1000';
                            }
                            if (i === 7) {
                                v = '5000';
                            }
                            if(i === 8){
                                v = '10000';
                            }
                            if(i === 9){
                                v = '50000';
                            }
                            return v;
                            }
                        }
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        barMaxWidth: '20',
                        data: chartData.y_data1,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'top',
                                    verticalAlign: 'middle',
                                    textStyle: {	    //数值样式
                                        color: 'black',
                                        fontSize: 12,
                                        fontWeight: 500,
                                    },
                                    formatter: function(params) {
                                        if(chartData.y_data[params.dataIndex] == "" || chartData.y_data[params.dataIndex] == null){
                                            return ""
                                        }
                                        return chartData.y_data[params.dataIndex]
                                    }
                                }
                            }
                        }
                    }
                ]
            }
            return option;
        },
        
    },

}
</script>
<style lang="less" scoped>

</style>
