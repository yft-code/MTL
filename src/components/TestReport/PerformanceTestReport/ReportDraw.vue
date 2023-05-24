<template>
    <div v-loading="isLoading" v-if="tableData.length !== 0">   
        <div :ref="'result_histogram_' + index" style="height: 400px;"></div>
    </div>
</template>

<script> 
const dataInterval = [0, 0.2, 1, 5, 10, 100, 1000, 2000, 5000];
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
            charts: {},
        }
    },
    props: {
        tableData: {},
        index: {},
        basicColumnData: {}
    },
    computed: {
        
    },
    watch: {
    },
    created() {
        this.handleChartData();
    },
    mounted() {
        if(this.tableData.length !== 0){
            this.drawChart(this.getBarOption(this.chartData))
        }
    },
    methods: {
        handleChartData(){
            let y_data = []
            let x_data = []
            this.basicColumnData.forEach(item => {
                x_data.push(item.titleName)
            })
            this.tableData.forEach((record,index) => {
                let y_tem = []
                
                this.basicColumnData.forEach(item => {
                    y_tem.push(record[item.propName])
                })
                y_tem.push(record.date+'_'+record.class_name)
                y_data.push(y_tem)
            })
            
            this.chartData.x_data = x_data
            this.chartData.y_data = y_data
            this.chartData.y_data1 = this.Standardize(y_data)
        },

        // 处理数据使坐标不等
        Standardize(y_data){
            let y_data1 = []
            for(var j = 0; j < y_data.length; j++){
                let y_tem =[]
                for (var i = 0; i < y_data[j].length; i++) {
                    //console.log(y_data[i])
                    // 1.寻找在数据间隔里小于y_data的最大值
                    const min_v = Math.max(...dataInterval.filter((v) => v <= y_data[j][i]));
                    //console.log(y_data[i] + '-' + min_v);
                    // 2.寻找在数据间隔里大于y_data的最小值
                    const max_v = Math.min(...dataInterval.filter((v) => v > y_data[j][i]));
                    //console.log(y_data[i] + '--' + max_v);
                    //  3.寻找 min_v 所在的下标
                    const index = dataInterval.findIndex((v) => v === min_v);
                    //console.log(y_data[i] + '---' + index);
                    //  4.计算该amount在y轴上应该展示的位置
                    const y_value = ((y_data[j][i] - min_v) / (max_v - min_v)) * 10 + index * 10;
                    //console.log(y_data[i] + '----' + y_value);
                    y_tem[i] = y_value;
                }
                y_data1.push(y_tem)
            }
            return y_data1
        },

        drawChart(option) {
            let _this = this
            let myChart = this.$echarts.init(this.$refs[`result_histogram_${this.index}`]);
            this.charts = myChart
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
            let series1 = []
            let legend_data = []
            for(var i = 0; i < chartData.y_data1.length; i++){
                let real_y = chartData.y_data[i]
                series1.push({
                    type: 'bar',
                    // barGap: '70%',
                    barMaxWidth: chartData.y_data1.length >= 3 ? '12' : '20',
                    data: chartData.y_data1[i],
                    name: chartData.y_data[i][chartData.y_data[i].length-1],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'top',
                                verticalAlign: 'middle',
                                // rotate: chartData.y_data1.length >= 3 ? 90 : 0,
                                // rotate: 0,
                                rotate: 90,
                                distance: 16,
                                // distance: 5,
                                textStyle: {	    //数值样式
                                    color: 'black',
                                    fontSize: 12,
                                    fontWeight: 500,
                                },
                                formatter: function(params) {
                                    let value = real_y[params.dataIndex]
                                    if(value >= 100){
                                        value = value + ""
                                        let arr = value.split('.')
                                        return arr[0]
                                    }else{
                                        return value
                                    }
                                    // return value
                                }
                            }
                        }
                    }
                })
                legend_data.push(chartData.y_data[i][chartData.y_data[i].length-1])
            }

            let _this = this;
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: (v) => {
                        let result = `<div>`
                        for(let i=0; i<v.length; i++){
                            result = result + `<div>${chartData.y_data[i][chartData.y_data[i].length-1]}-${v[i].axisValue}：${chartData.y_data[i][v[i].dataIndex]}</div>`
                        }
                        result = result + `</div>`
                        return result
                    }
                },
                legend: {
                    data: legend_data,
                    x:'center',      //可设定图例在左、右、居中
                    y:'top',
                    padding:[30,0,0,0], // 上右下左
                },
                dataZoom: dataZoom,
                grid: {
                    left: '30',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                color: ['#5084fe'],
                xAxis: [
                    {
                        type: 'category',
                        name: "",
                        data: chartData.x_data,
                        axisLabel: {
                            rotate: 0,
                            interval: 0,
                        },
                        splitLine: {//去除网格线
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: (v, i) => {
                                if(dataInterval[i]){
                                    return dataInterval[i]
                                }
                                else{
                                    return v;
                                }
                            }
                        },
                        axisTick: {
                            show: false,
                        },
                        // splitLine: {
                        //     show: true,
                        //     lineStyle: {
                        //         type: 'dashed',
                        //         interval: 2,
                        //         color: '#8384A4',
                        //     },
                        // },
                    }
                ],
                series: series1
            }
            return option;
        },
        
    },

}
</script>
<style lang="less" scoped>

</style>
