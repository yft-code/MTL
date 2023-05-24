<template>
    <div style="margin-top: 20px;">
        <div v-for="item,index in itemData" :key="index">
            <div class="report-card">
                <div class="card-title">
                    <div class="title">{{ item.label }}</div>
                    <div class="other-span"></div>
                </div>
                
                <div class="card-body">
                    <div style="background-color:#f3f4f6; padding:5px; margin-bottom: 10px">
                        <span class="comment">{{ conclusionData[item.propName] }}</span>
                    </div>
                    <el-card style="margin-top: 10px;">
                        
                        <el-table 
                            stripe
                            border
                            :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
                            :data="handleTableData(item)">
                            <el-table-column v-for="child, k in item.children" :key="index+'_'+k" :label="child.titleName">
                                <template slot-scope="scope">
                                    <span class="comment">{{ scope.row[child.propName] }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
    
        }
    },
    props: {
        conclusionData: {}
    },
    computed: {
        itemData(){
            return this.$store.getters.getWeaknetPCConclusionItem;
        }
    },
    methods: {
        handleTableData(item){
            let tableData = []
            let cData = {}
            // console.log(this.conclusionData)
            item.children.forEach(child => {
                cData[child.propName] = this.conclusionData[child.propName]
            })
            tableData.push(cData)
            return tableData
        },
    },
}
</script>
<style scoped>
.report-card {
    width: 100%;
    margin-bottom: 20px;
    border-radius: 3px;
    overflow: hidden;
}

.report-card .card-title {
    cursor: pointer;
    height: 48px;
    background: #36495e;
    border: 5px 5px 0 0;
    display: flex;
    flex-direction: row;
}

.report-card .title {
    color: #ffffff;
    font-size: 16px;
    line-height: 48px;
    margin-left: 10px;
}

.report-card .other-span {
    color: #ffffff;
    font-size: 14px;
    line-height: 48px;
    margin-left: 20px;
    flex: 1;
}

.report-card .expand-div {
    display: flex;
    flex-direction: row;
    line-height: 48px;
    margin-right: 20px;
}

.report-card .expand-div .expand {
    color: #ffffff;
}

.report-card .expand-div .expand-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    margin-top: 14px;
    background: #5D6C7D;
    border-radius: 20px;
    text-align: center;
    line-height: 20px;
}

.report-card .card-body {
    background: #f5f5f5; 
    padding: 20px;
}
.comment{
    white-space:pre-wrap;
}
</style>