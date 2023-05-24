<template>
    <div>
        <self-dialog 
            ref="coverRef" 
            :dialog-data="{ title: '兼容性覆盖情况', width: '70rem', closeName: '关闭' }">
            <div v-loading="coverData == ''" class="cover-div">
                <!-- 标志说明 -->
                <div class="status-div">  
                    <div class="span-state" style="color: green;">√</div>已测试 
                    <div class="span-state" style="color: red;">×</div>未测试 
                    <!-- <div class="state" style="background: #909399;"></div>非必测
                    <div style="margin-left:15px;margin-right:5px">/</div>不用测 -->
                </div>
                <el-card style="margin-bottom: 1rem">
                    <div class="type-item" v-for="(coverType, typeIndex) in coverData" :key="typeIndex">
                        <div class="type-title">{{ coverType.label }}</div>
                        <div class="type-content">
                            <div v-for="(coverageItem, coverageIndex) in coverType.coverage" :key="typeIndex + '_' + coverageIndex" class="every-coverage">
                                <div>
                                    <span>{{ coverageItem.type }}</span>
                                    <span class="coverage-state">
                                        <span v-if="coverageItem.state == 0" style="color: red">×</span>
                                        <span v-else-if="coverageItem.state == 1" style="color: green">√</span>
                                        <span v-else-if="coverageItem.state == 2">
                                           /
                                        </span>
                                        <span v-else-if="coverageItem.state == 3">
                                            <div class="cover-state" style="background-color:#909399" />
                                        </span>
                                    </span>
                                </div> 
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import SelfDialog from "@/components/Common/SelfDialog.vue"
import "@/css/cover.css"
export default {
    components: {
        SelfDialog,
    },
    props: {
        tableName: {}
    },
    data() {
        return {
            coverData: "",        
        }
    },
    computed: {
    },
    created() {
    },
    mounted() {

    },
    methods: {
        //获得兼容性覆盖情况
        async getCover() {
            this.$refs.coverRef.openDialog();
            let list = { 
                table_name: this.tableName,
                // type: 1,
            };
            this.$codePost("/expertCompatibilityPC/record_coverage/", list, { operation: "获取兼容性覆盖情况", failed: true }).then(res => {
                if (res.code == 200) {
                    this.coverData = res.data;
                }
            })
        },

    },
}
</script>
<style lang="less" scoped>

.status-div {
    display: flex;
    direction: row;
    margin-bottom: 10px;
    height: 20px;
    line-height: 20px;
    justify-content: flex-end;
    margin-right: 10px;
}

.span-state {
    margin: 0 5px 0 15px;
    font-size: 18px;
    font-weight: bold;
}

.state {
    width: 15px;
    height: 15px;
    border-radius: 8px;
    margin-right: 5px;
    margin-top: 2px;
    margin-left: 15px;
    display: inline-block;
}

.cover-state {
    vertical-align: middle;
    width: 11px;
    height: 11px;
    border-radius: 7px;
    display: inline-block;
}

</style>
