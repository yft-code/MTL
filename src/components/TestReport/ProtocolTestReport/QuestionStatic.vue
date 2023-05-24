<template>  
    <div>
        <div style="height: 300px" v-if="questionStatic">
            <div class="bar-div">
                <div ref="levelRef" class="pass-rate-div"></div>
            </div>
            <div class="bar-div">
                <div ref="classifyRef" class="pass-rate-div"></div>
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
        questionStatic:{},
    },
    computed: {
        
    },
    watch:{

    },
    created() {
        this.$nextTick(() => {
            this.drawBar(this.handleBarData(this.questionStatic, 'q_level'), 'levelRef')
            this.drawBar(this.handleBarData(this.questionStatic, 'q_category'), 'classifyRef')
        })
    },
    mounted(){
        this.$nextTick(() => {
            this.drawBar(this.handleBarData(this.questionStatic, 'q_level'), 'levelRef')
            this.drawBar(this.handleBarData(this.questionStatic, 'q_category'), 'classifyRef')
        })
    },
    methods: {
        handleBarData(data, msg){
            // console.log(data[msg])
            return data[msg]
        },
        // 绘制通过率饼图
        drawBar(data, refStr){
            if(this.$refs[refStr]){
                let myChart = this.$echarts.init(this.$refs[refStr]);
                let option = {
                    tooltip: {
                        axisPointer: { 
                            type: 'shadow'
                        },
                        formatter : function(params){  
                            var res = params.name + ":" + params.value + "条"
                            return res;
                        },
                        confine: true
                    },
                    xAxis: {
                        type: 'category',
                        data: data.x_data
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series: [
                        {
                            type: 'bar',
                            data: data.y_data,
                            // label: {
                            //     show: true,
                            //     formatter: function(arg){
                            //         return arg.name + arg.value + '条'
                            //     }
                            // },
                            barWidth: '20',
                        }
                    ]
                };
                myChart.setOption(option);
                window.addEventListener('resize', function() { myChart.resize() });
            }
        },
    },

}
</script>

<style lang="less" scoped>
.bar-div{
    display: inline-block;
    width: 50%;
}
.pass-rate-div{
    width: 400px;
    height: 300px;
    margin: auto;
}
</style>
