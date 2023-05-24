<template>
    <div class="self-table">   
        <el-table 
            :data="tableData"
            style="width: 100%"
            stripe
            border
            :cell-class-name="tableCellClassName"
            :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center', fontSize: '14px' }"
            >
            <el-table-column 
                v-for="(item,index) in basicColumnData"
                v-if="item.propName == 'date'"
                fixed="left"
                :key="index"
                :label="item.titleName"
                align="center"
                :width="item.width"
                >
                <template slot-scope="scope">
                    <span>{{ scope.row[item.propName].split(' ')[0] }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                v-else-if="item.propName !== 'pease_link'"
                :key="index"
                :label="item.titleName.split('(').join('||(').split('A').join('||A').split('GPU内存').join('||GPU内存')"
                :render-header="renderHeader"
                align="center"
                :width="item.width"
                >
                <template slot-scope="scope">
                    <span>{{ scope.row[item.propName] }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                v-else-if="!isPreview"
                :key="index"
                :label="item.titleName"
                align="center"
                :width="item.width"
                fixed="right"
                >
                <template slot-scope="scope">
                    <a :href="scope.row[item.propName]" target="_blank" style="color:blue"><span v-if="scope.row[item.propName]">查看</span></a>
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
        isPreview:{},
        basicColumnData: {},
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
        
    }

}
</script>

<style scoped>
</style>