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
                :align="item.align ? item.align : 'center'"
                :width="item.width"
                >
                <template slot-scope="scope">
                        <div v-if="item.propName == 'msg'">
                            <span v-if="!scope.row[item.propName] || scope.row[item.propName] == 'null'">--</span>
                            <pre v-else style="font-family:Microsoft YaHei">{{ scope.row[item.propName] }}</pre>
                        </div>
                    <div v-else-if="item.type == 'normal'">
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
                    titleName: '延迟(ms)',
                    propName: 'delay',
                    type: "normal",
                    width: "130px"
                },
                {
                    titleName: '丢包率(%)',
                    propName: 'loss',
                    type: "normal",
                    width: "130px"
                },
                {
                    titleName: 'kcp',
                    propName: 'kcp',
                    type: "normal",
                    width: "100px"
                }, 
                {
                    titleName: 'tcp',
                    propName: 'tcp',
                    type: "normal",
                    width: "100px"
                }, 
                {
                    titleName: '表现',
                    propName: 'msg',
                    type: "normal",
                    align: 'left'
                }, 
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