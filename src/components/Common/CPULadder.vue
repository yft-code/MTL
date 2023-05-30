<template>
 <div class="cup-container">
    <el-table :data="cpuData" stripe border >
        <el-table-column 
            label="等级" 
            prop="level" 
            align="center" 
            sortable
        />
        <el-table-column 
            v-for="brand in cpuBrand" 
            :key="brand" 
            :label="brand" 
            :prop="brand" 
             align="center"
        >
            <template v-slot="scope">
                <div v-for="(item,index) in scope.row[brand]" :key="index">
                    {{item}}
                </div>
            </template>
        </el-table-column>
    </el-table>
 </div>
</template>
<script>
import {getCpuLadder} from '@/api/common'
export default {
    components: {
    },
    props: {},
    data() {
        return {
            cpuData: [],
            cpuBrand: [],
            maxLevel: "",
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

        async  getCpuData(){
            let res=await getCpuLadder({},{ operation: "获取CPU天梯数据", failed: true })
            if (res.code == 200) {
                console.log('Get CPU Ladder Data Success');
                this.maxLevel = res.data.max_level 
                this.handleCpuData(res.data.data)
                this.handleCpuBrand(res.data.brand)
            }
        },

        handleCpuData(data){
            let cpuData = []
            for (let i=1; i<=this.maxLevel; i++){
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
.cup-container{
    margin:80px 15px 80px 15px;
}
</style>
