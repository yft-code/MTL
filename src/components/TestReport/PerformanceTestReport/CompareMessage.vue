<template>
    <div >
        <el-table :data="compareMessageData" :show-header="false" border :cell-style="{padding:2+'px'}" :span-method="objectSpanMethod" @row-click="handleRowClick">
            <el-table-column v-for="item,index in compareFieldList" :key="index" :label="item.titleName" :align="item.align" :prop="item.propName" :width="item.width">
                <template slot-scope="scope">
                    <div v-if="item.propName == 'remark'">
                        <span>{{scope.row[item.propName]}}</span>
                        <el-tooltip effect="dark" 
                            placement="right">
                            <div slot="content">
                                变动范围在10%以内，备注无明显波动；≥10%，则根据各项指数标注<span class="red">红色</span>或<span class="green">绿色</span>变动，
                                <span class="red">红色</span>为性能变<span class="red">劣</span>，<span class="green">绿色</span>为性能变<span class="green">优</span>，其中内存、CPU、GPU升高为<span class="red">红色</span>，
                                降低为<span class="green">绿色</span>，帧率升高为<span class="green">绿色</span>，降低为<span class="red">红色</span>；帧数单周变动≥2，或4周内变动≥2时，需特别注明并告知项目组；
                            </div>
                            <i class="el-icon-info" style="color:#606266;margin-left:3px"></i>
                        </el-tooltip>
                    </div>
                    <div v-else-if="item.propName == 'msg'">
                        <span v-if="scope.row[item.propName] == '无对比数据' || scope.row[item.propName] == '与上次对比： 无明显变化'">
                            {{scope.row[item.propName]}}
                        </span>
                        <span v-else v-for="m,i in scope.row[item.propName].split('，')" :key="index+'_'+i">
                            <span v-if="m.indexOf('平均帧数') !== -1">
                                <span v-if="m.indexOf('升高') != -1">
                                    {{ m.split('升高')[0] }}<span class="green"> 升高 </span>{{ m.split('升高')[1] }}
                                </span>
                                <span v-else-if="m.indexOf('降低') != -1">
                                    {{ m.split('降低')[0] }}<span class="red"> 降低 </span>{{ m.split('降低')[1] }}
                                </span>
                                <span v-else>{{ m }}</span>;
                            </span>
                            <span v-else>
                                <span v-if="m.indexOf('升高') != -1">
                                    {{ m.split('升高')[0] }}<span class="red"> 升高 </span>{{ m.split('升高')[1] }}
                                </span>
                                <span v-else-if="m.indexOf('降低') != -1">
                                    {{ m.split('降低')[0] }}<span class="green"> 降低 </span>{{ m.split('降低')[1] }}
                                </span>
                                <span v-else>{{ m }}</span>;
                            </span>
                        </span>
                    </div>
                    <span v-else>{{scope.row[item.propName]}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script> 
export default {
    components: {

    },
    data() {
        return {
            msgData: [],
            compareFieldList: [
                {
                    propName: 'remark',
                    titleName: '变动备注',
                    width: '100px',
                    align: 'center',
                },
                {
                    propName: 'first_name',
                    titleName: '第一层',
                    width: '110px',
                    align: 'center',
                },
                {
                    propName: 'next_name',
                    titleName: '第二层',
                    width: '130px',
                    align: 'center',
                },
                {
                    propName: 'msg',
                    titleName: '变动',
                    align: 'left',
                }
            ],
        }
    },
    props: {
        compareMessageData: {},
        type: {}
    },
    computed: {

    },
    created() {

    },
    mounted(){
    },
    methods: {
        mergingRows(categoryName) { 
            // 表格数据列合并预处理,生成一个与行数相同的数组记录每一行设置的合并数
            // 如果是第一条记录（索引为0），向数组中加入1，并设置索引位置；
            // 如果不是第一条记录，则判断它与前一条记录是否相等，如果相等，
            // 则向mergingRows中添入元素0，并将前一位元素+1，表示合并行数+1，
            // 以此往复，得到所有行的合并数，0即表示该行不显示。
            const mergingRows = []
            let mergingPos = 0
            for (let i = 0; i < this.compareMessageData.length; i++) { // tabledata 表格数据源
                if (i === 0) {
                    mergingRows.push(1)
                    mergingPos = 0
                } else {
                    if (this.compareMessageData[i][categoryName] === this.compareMessageData[i - 1][categoryName]) { 
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
            if(columnIndex === 1){ // 第二列
                const _row = this.mergingRows(column.property)[rowIndex]
                const _col = _row > 0 ? 1 : 0
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        },

        handleRowClick(row, column, event){
            this.$emit('handleRowClick', row, this.type)
        },
    },

}
</script>

<style scoped>
.msg-detail-span{
    margin-top: 5px;
    display: inline-block;
    margin-left: 5px;
}
.red{
    color:red;
}
.green{
    color:green;
}
</style>
