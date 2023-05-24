<template>
    <div>
        <el-table 
            :data="tableData"  
            border
            stripe 
            :header-cell-style="{ backgroundColor: '#F5F7F9', color: '#414350', textAlign: 'center' }"
            style="width: 100%; margin-bottom: 2rem;"
        >
            <el-table-column
                v-for="(item,index) in columnData"
                :key="index"
                :prop="item.propName"
                :label="item.titleName"
                :min-width="item.minWidth/2 || 45"
                align="center"
                v-if="item.propName != 'log_file'"
            >
            </el-table-column>
            <el-table-column
                v-else
                :prop="item.propName"
                :label="item.titleName"
                :min-width="item.minWidth/2 || 45"
                align="center"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.log_file" class="blue-a" @click="downloadFile(scope.row.log_file)">下载</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>


export default {
    data() {
        return {
            
        }
    },
    components: {
    },
    props: {
        tableData: Array,
        columnData: Array
    },
    computed: {
        

    },
    methods: {
        //下载log文件
        downloadFile(href) {
            this.$publicJS.downloadFile(this, href);
        },
    },
    created() {
    },
    mounted() {

    },
    watch: {
    }
}
</script>
