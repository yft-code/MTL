<template>
    <div class="self-table">   
        <el-table 
            :data="tableData"
            style="width: 100%"
            stripe
            :span-method="objectSpanMethod"
            border
            :cell-class-name="tableCellClassName"
            :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
            >
            <el-table-column 
                v-for="(item,index) in basicColumnData"
                :key="index"
                :prop="item.propName"
                :label="item.titleName.split('（').join('||（').split('GPU内存').join('||GPU内存')"
                align="center"
                :width="item.width"
                :render-header="renderHeader"
                >
                <template slot-scope="scope">
                    <div v-if="item.type == 'normal'">
                        <span v-if="item.propName == 'date'">{{ scope.row[item.propName].split(' ')[0] }}</span>
                        <span v-else>{{ scope.row[item.propName] ?  scope.row[item.propName] : '/'}}</span>
                    </div>
                    <div v-else>
                        <div>
                            <div v-for="url,i in scope.row[item.propName]" :key="index+'_'+i">
                                <a :href="url" target="_blank" style="color:blue">查看</a>
                            </div>
                        </div>
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
        tableData: {},
        basicColumnData: {}
    },
    data() {
        return {

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

        renderHeader(h, { column, $index }) {
            let columnArr = column.label.split("||");//此处换行标志
            if (columnArr.length >= 2) {
                let divArr = [];
                columnArr.map((item) => {
                    divArr.push(h("div", { style: "text-align: center " }, item));
                });
                return h("div", {}, divArr);
            }
            return h("div", {}, column.label);
        },

        mergingRows(categoryName) { 
            // 表格数据列合并预处理,生成一个与行数相同的数组记录每一行设置的合并数
            // 如果是第一条记录（索引为0），向数组中加入1，并设置索引位置；
            // 如果不是第一条记录，则判断它与前一条记录是否相等，如果相等，
            // 则向mergingRows中添入元素0，并将前一位元素+1，表示合并行数+1，
            // 以此往复，得到所有行的合并数，0即表示该行不显示。
            const mergingRows = []
            let mergingPos = 0
            for (let i = 0; i < this.tableData.length; i++) { // tabledata 表格数据源
                if (i === 0) {
                    mergingRows.push(1)
                    mergingPos = 0
                } else {
                    if (this.tableData[i][categoryName] === this.tableData[i - 1][categoryName]) { 
                        // 哪些数据是要合并的 合并的条件是什么 此处合并条件为categoryName 相同则进行合并
                        mergingRows[mergingPos] += 1
                        mergingRows.push(0)
                    } else {
                        mergingRows.push(1)
                        mergingPos = i
                    }
                }
            }
            return mergingRows
        },

        objectSpanMethod({ row, column, rowIndex, columnIndex }){
            // console.log(column)
            if (columnIndex === 0) { // 第一列
                const _row = this.mergingRows(column.property)[rowIndex]
                const _col = _row > 0 ? 1 : 0
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
            // if(columnIndex === 1){ // 第二列
            //     const _row = this.mergingRows(column.property)[rowIndex]
            //     const _col = _row > 0 ? 1 : 0
            //     return {
            //         rowspan: _row,
            //         colspan: _col
            //     }
            // }
        },
        
    }

}
</script>

<style scoped>

</style>