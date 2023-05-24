<template>
    <div class="self-table">   
        <el-table 
            :data="tableData"
            style="width: 100%"
            stripe
            border
            :cell-class-name="tableCellClassName"
            :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
            >
            <el-table-column 
                v-for="(item,index) in basicColumnData"
                :key="index"
                :label="item.titleName"
                align="center"
                :width="item.width"
                >
                <template slot-scope="scope">
                    <div v-if="item.type == 'normal'">
                        <span>{{ scope.row[item.propName] }}</span>
                    </div>
                    <div v-else>
                        <span v-if="item.propName == 'date'">{{ scope.row[item.propName] }}</span>
                        <a v-else :href="scope.row[item.propName]" target="_blank" style="color:blue"><span v-if="scope.row[item.propName]">查看</span></a>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        
    </div>
</template>

<script>

export default {
    components: {
        
    },
    props: {
        tableData: [],
    },
    data() {
        return {
            basicColumnData:[
                {
                    titleName: '测试时间',
                    propName: 'date',
                    width: "100px",
                },
                {
                    titleName: '软件名称',
                    propName: 'app_name',
                    type: "normal",
                    // width: "100px",
                },
                {
                    titleName: '测试机',
                    propName: 'device_name',
                    type: "normal",
                    width: "150px",
                },
                {
                    titleName: '平台',
                    propName: 'platform',
                    type: "normal",
                },
                {
                    titleName: '原始包大小',
                    propName: 'origin_package_size',
                    type: "normal"
                }, 
                {
                    titleName: '实体包大小',
                    propName: 'real_package_size',
                    type: "normal",
                }, 
                {
                    titleName: '平均内存占用',
                    propName: 'memory_usage',
                    type: "normal",
                }, 
                {
                    titleName: '最大内存占用',
                    propName: 'memory_usage_max',
                    type: "normal",
                }, 
                {
                    titleName: 'CPU占用',
                    propName: 'cpu_usage',
                    type: "normal",
                }, 
                {
                    titleName: 'GPU使用率',
                    propName: 'gpu_use_rate',
                    type: "normal",
                }, 
                {
                    titleName: '帧率',
                    propName: 'fps',
                    type: "normal",
                }, 
                {
                    titleName: '流量',
                    propName: 'flow',
                    type: "normal",
                }, 
                {
                    titleName: '耗电量',
                    propName: 'power_consumption',
                    type: "normal",
                }, 
                {
                    titleName: '冷启动时间',
                    propName: 'cold_start_used',
                    type: "normal",
                },
                // {
                //     titleName: '测试人员',
                //     propName: 'test_qa',
                // },
                {
                    titleName: 'Pease链接',
                    propName: 'pease_link',
                },
                // {
                //     titleName: '测试时长',
                //     propName: 'test_time',
                //     type: "normal",
                // },
            ],
        }
    },
    computed: {
        
    },
    created() {
        
    },
    mounted() {

    },
    methods: {
        tableCellClassName({row, column, rowIndex, columnIndex}){
            row.index=rowIndex;
            column.index=columnIndex;
        },
        
    }

}
</script>

<style scoped>

</style>