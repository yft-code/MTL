<template>
    <div>   
        <div :ref="curRef" style="width: 100%; height: 400px;"></div>
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
        curRef:{},
        chartData:{},
    },
    created() {

    },
    mounted() {
        this.$nextTick(()=>{
            this.drawChart()
        })
    },
    
    methods: {
        drawChart(){
            let _this = this;
            let myChart = this.$echarts.init(this.$refs[`${this.curRef}`]);
            let chartData = this.chartData
            myChart.clear();
            let option = {
                animation: false,
                tooltip: {
                    backgroundColor: "rgba(53,53,56,0.7)", //设置背景图片 rgba格式
                    borderColor: "rgba(53,53,56,0.7)", //设置边框颜色
                    textStyle: {
                        align: "left",
                        color: "#fff",
                    },
                    trigger: 'axis',
                    transitionDuration: 0,
                    confine: true,
                    position: function(point, params, dom, rect, size){
                        let contentWidth = size.contentSize[0];
                        let contentHeight = size.contentSize[1];
                        point[0] = point[0] - contentWidth - 20;
                        point[1] = point[1] + 50;
                        return point;
                    },
                    formatter: function(params) {
                        let result = ""
                        if(params.length == 1){
                            if(chartData.t_data){
                                result += `测试人员：${chartData.t_data[params[0].dataIndex]}</br>`
                            }
                            // params[0].dataIndex
                            result += `${params[0].axisValue}：`;
                            
                            result += params[0].data
                        }else if(params.length > 1){
                            params.forEach(item => {
                                result += `${chartData.legend[item.seriesIndex]}：${chartData.series[item.seriesIndex][item.dataIndex]}</br>`
                            })
                        }
                        return result;
                    }
                },
                grid: {
                    left: this.curRef =='device_time_bar_data' ? '20%': '10%',
                },
                xAxis: {
                    type: this.curRef =='device_time_bar_data' ? 'value':'category',
                    data: this.curRef =='device_time_bar_data' ? [] : chartData.x_data,
                    axisLabel: {
                        show: true,
                        interval: 0,//使x轴文字显示全
                    }
                },
                yAxis: {
                    type: this.curRef =='device_time_bar_data' ? 'category': 'value',
                    data: this.curRef =='device_time_bar_data' ? chartData.x_data : [],
                    axisLabel: {
                        show: true,
                        interval: 0,//使y轴文字显示全
                    }
                },    
            }
            if(this.curRef =='device_time_bar_data'){
                option.dataZoom = [
                    {
                        type: 'slider',
                        show: true,
                        yAxisIndex: [0],
                        left: '93%',
                        start: chartData.x_data.length > 15 ? (chartData.x_data.length - 15)/chartData.x_data.length * 100 : 0,
                        end: 100,
                        zoomLock: true,
                    },
                    {
                        type: 'inside',
                        yAxisIndex: [0],
                        start: 50,
                        end: 100,
                        zoomLock: true,
                    }
                ]

            }
            if(chartData.legend){
                option.legend = {
                    show: true,
                    data:chartData.legend,
                }
                option.series = []
                chartData.series.forEach((element,index) => {
                    option.series.push({
                        name: chartData.legend[index],
                        data: element,
                        type: 'bar',
                        barWidth: '20',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    position: 'top', //在上方显示
                                    textStyle: { //数值样式
                                        color: 'black',
                                        fontSize: 14
                                    }
                                }
                            }
                        }
                    })
                });
            }else{
                option.series = {
                    data: chartData.y_data,
                    type: 'bar',
                    barWidth: chartData.x_data.length > 15 ? '10':'15',
                    // barWidth: '10',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                position: 'right', //在上方显示
                                textStyle: { //数值样式
                                    color: 'black',
                                    fontSize: 14
                                }
                            }
                        }
                    }
                }
            }
            myChart.resize()
            myChart.setOption(option, true)
            window.addEventListener('resize', function() {
                myChart.resize()
            });
        }
    },

}
</script>
<style lang="less" scoped>

</style>
