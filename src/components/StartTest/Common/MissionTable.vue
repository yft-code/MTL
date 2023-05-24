<template>
    <div class="self-table">   
        <!-- <el-table
            :data="currentPageData"
            style="width: 100%"
            stripe
            border
            :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
            > -->
        <el-table
            :data="tableData"
            style="width: 100%"
            stripe
            border
            :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
            >
            <el-table-column 
                v-for="(item,index) in basicColumnData"
                :key="index"
                :label="item.titleName"
                align="center"
                >
                <template slot-scope="scope">
                    <span v-if="item.propName !== 'operation'">{{scope.row[item.propName]}}</span>
                    <span v-if="item.propName == 'operation' && (isTester || isAdmin)">
                        <el-button type="primary" size="mini" @click="editDevice(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="deleteDevice(scope.row)">删除</el-button>
                    </span>
                </template>
            </el-table-column>
            
        </el-table>
        <!-- <el-pagination
            style="margin-top: 10px;"
            background
            align="right"
            :page-size="pageSize"
            :current-page="currentPage"
            :total="tableData.length"
            :page-sizes="[10, 20, 50, 100]"
            layout="prev, pager, next, jumper, sizes, total"
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange">
        </el-pagination> -->
        
    </div>
</template>

<script>

export default {
    components: {
        
    },
    props: {
        basicColumnData: {
            required: true,
        },
        tableData: {
            required: true,
        },
    },
    data() {
        return {
            pageSize: 10,
            currentPage: 1
        }
    },
    computed: {
        currentPageData() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.tableData.slice(start, start + this.pageSize);
        },
        isTester() {
            return this.$store.getters.getIsTester
        },
        isAdmin() {
            return this.$store.getters.getIsAdmin
        },
    },
    created() {
    },
    mounted() {
        

    },
    methods: {
        handleCurrentChange  (val) {
            this.currentPage = val;
        },

        //切换分页显示几条数据
        handleSizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
        },

        deleteDevice(row){
            // console.log(row)
            this.$emit('deleteDevice', row)
        },

        editDevice(row){
            this.$emit('editDevice', row)
        },
    }

}
</script>

<style scoped>

</style>