<template>
    <div style="margin-top: 80px; margin-bottom: 15px; margin-left:15px; margin-right:15px">
        <el-table :data="cpuData" stripe border >
            <el-table-column 
                label="等级" 
                prop="level" 
                align="center" 
                sortable
            ></el-table-column>
            <el-table-column 
                v-for="brand in cpuBrand" 
               :label="brand" 
               :prop="brand" 
               :key="brand" 
               align="center">
                <template v-slot="scope">
                    <!-- {{scope.row[brand].join('/')}} -->
                    <div v-for="(item,index) in scope.row[brand]" :key="index">{{item}}</div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    components: {
    },
    props: {},
    data() {
        return {
            cpuData: [],
            cpuBrand: [],
            max_level: "",
        }
    },
    computed: {
    },
    created() {
        this.getCPUData()
    },
    mounted() {

    },
    methods: {
        getCPUData(){
            this.$codePost("/expertCompatibility/get_cpu_ladder/", { operation: "获取CPU天梯数据", failed: true }).then(res => {
                if (res.code == 200) {
                    console.log('Get CPU Ladder Data Success');
                    this.max_level = res.data.max_level 
                    this.handleCPUData(res.data.data)
                    this.handleCpuBrand(res.data.brand)
                }
            })
        },

        handleCPUData(data){
            let cpuData = []
            for (let i=1; i<=this.max_level; i++){
                data[i].level = i
                cpuData.push(data[i])
            }
            this.cpuData = cpuData.reverse()
        },

        handleCpuBrand(data){
            let brandList = []
            data.forEach(item => {
                brandList.push(item.name)
            })
            this.cpuBrand = brandList
        },
    },
}
</script>
<style lang="less" scoped>

</style>
