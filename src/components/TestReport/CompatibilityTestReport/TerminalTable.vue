<template>
    <div>
        <!--filterPost-{{filterPost}}-->
        <picture-view ref="pictureViewRef" :img-path="imgPath" :show-title="reportType == 'expert'" />
        <el-table class="border-div report-el-table" ref="elTableRef" :data="tableData" style="width: 100%" :max-height="tableHeight" stripe border :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }" v-loading="isLoading" :cell-class-name="addTdClass" @sort-change="sortTable">
            <el-table-column 
                v-for="(item,index) in tableList.columnData" 
                :key="index" :prop="item.propName" 
                :label="item.titleName" 
                :sortable="item.sortFlag ? 'custom' : false" 
                :min-width="item.minWidth || 120" 
                :align="item.align || 'center'" 
                :fixed="item.fixed || false" 
                v-if="item.type == 'normal'">
            </el-table-column>
            <el-table-column v-else-if="item.propName == 'questionList'" :prop="item.propName" :label="item.titleName" :min-width="150" :align="item.align || 'center'">
                <template slot="header" slot-scope="scope">
                    <div class='question-detail-item'>
                        <!-- <div v-if="reportType == 'expert'" class="item" style="width:20%">
                            问题分类
                        </div> -->
                        <div class="item" style="width:40%">
                            问题类型
                        </div>
                        <!-- <div class="item" style="width:5%">
                            问题级别
                        </div> -->
                        <div class="item" style="width:60%">
                            问题描述
                        </div>
                        <!-- <div class="item" style="width:10%">
                            问题图片
                        </div> -->
                    </div>
                </template>
                <template slot-scope="scope">
                    <div v-html="getQuestionList(scope.row.question_detail)"></div>
                </template>
            </el-table-column>
            <el-table-column :prop="item.propName" :label="item.titleName" :sortable="item.sortFlag ? 'custom' : false" :min-width="70" :align="item.align || 'center'" :fixed="item.fixed || false" v-else>
                <template slot-scope="scope">
                    <div v-if="item.propName == 'log_file'">
                        <span v-if="scope.row.log_file" class="blue-a" @click="downloadFile(scope.row.log_file)">下载</span>
                    </div>
                    <div v-else-if="item.propName == 'deviceDetail'">
                        <!-- <el-button size="mini" @click="jumpDeviceDetail(scope.row, scope.row[item.idKey])">查看详情</el-button> -->
                        <span style="cursor: pointer; color: #156eef;" @click="jumpDeviceDetail(scope.row, scope.row[item.idKey])">查看详情</span>
                    </div>
                    <div v-else-if="item.propName == 'if_pass'">
                        <span :style="{ color: scope.row.if_pass == '不通过' ? 'red' : ''}">{{ scope.row.if_pass }}</span>
                    </div>
                    <div v-else-if="item.propName == 'test_qa'">
                        <span>{{ scope.row.test_qa_name || scope.row.test_qa }}</span>
                        <self-popo v-if="!$checkStrIsNull(scope.row.test_qa)" :email="scope.row.test_qa" />
                    </div>
                    <div v-else-if="item.propName == 'is_pass'">
                        {{ scope.row.is_pass == 1 ? "通过" : "不通过" }}
                    </div>
                    <div v-else>{{scope.row[item.propName]}}</div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination" style="margin-top:0.5rem;" background align="right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 30, 50, 100, 200]" :page-size="tableKeyList.rows" :current-page="tableKeyList.page" layout="prev, pager, next, jumper, sizes, total" :total="sizeTotal">
        </el-pagination>

        <device-drawer ref="deviceDetailRef"></device-drawer>
    </div>
</template>

<script>
import $ from "jquery"
import DeviceDrawer from '@/components/TestReport/CompatibilityTestReport/DeviceDrawer'
export default {
    components: {
        DeviceDrawer,
    },
    props: {
        axiosList: {
            required: true,
            type: Object
        },
        tableList: {
            required: true,
            type: Object
        },
        routeList: {
            required: true,
            type: Object
        },
        reportType: String,
        filterPost:Array,

    },
    data() {
        return {
            tableHeight: 500,
            isLoading: true,
            tableKeyList: {
                page: 1,
                rows: 30,
                sort: "",
                order: "",
                filter_condition:[],
            },
            tableData: [],
            sizeTotal: 0,
            picDict: {},
            imageIcon: require('@/assets/img/tupian.png'),
            imgPath: [],
            //筛选条件 后端获取
            filterOriginal: [],
           
        }
    },
    computed: {
        qLevelList() {
            return this.$store.getters.getQLevelList;
        },
       
       

    },
    watch: {
        filterPost: {
            handler: function(newVal) {
                this.getTableData()
            },
            deep: true,
            // immediate: true,
        }
    },
    created() {
        this.getTableData();
    },
    mounted() {
        let _this = this;
        $(".report-el-table").on("click", ".question-detail-item-href", function() {
            let questionId = $(this).attr("questionId");
            _this.jumpQuestionDetail(questionId);
        })
        $(".report-el-table").on("click", ".image-icon", function() {
            let questionId = $(this).attr("questionId");
            _this.showPicture(questionId);
        })
        this.$nextTick(function() {
            this.resizeTable();
            // 监听窗口大小变化
            window.onresize = function() {
                _this.resizeTable();
            }
        })
    },
    destroyed() {
        window.onresize = "";
    },
    methods: {
        // 列class（在el-table-column中写入无效）
        addTdClass({ row, column }) {
            if (column.property == "questionList") {
                return "question-detail-column";
            }
        },
        //获取图片数组
        getPicArr(picList) {
            return picList.map((v) => {
                return v.picture;
            })
        },

        // //获取问题列表html
        // getQuestionList(questionList) {
        //     let html = "<div class='question-item'>";
        //     if (this.reportType == 'expert') {
        //         html += `<div class='self-border' style='left: 20%'></div>
        //         <div class='self-border' style='left: 40%'></div>
        //         <div class='self-border' style='left: 45%'></div>
        //         <div class='self-border' style='left: 90%'></div>`;
        //     } else {
        //         html += `<div class='self-border' style='left: 20%'></div>
        //         <div class='self-border' style='left: 25%'></div>
        //         <div class='self-border' style='left: 90%'></div>`;
        //     }
        //     questionList.map((question) => {
        //         html += "<div class='question-detail-item'>"
        //         let descWidth = "65%";
        //         if (this.reportType == 'expert') {
        //             html += `<div class="item" style="width:20%;">${question.q_category}</div>`;
        //             descWidth = "45%"
        //         }
        //         html += `<div class="item" style="width:20%"><span class="question-detail-item-href blue-a" questionId="${question.id}">${question.q_classification}</span></div>`
        //         html += `<div class="item" style="width:5%;color: ${this.qLevelList[question.q_level].color}">P${question.q_level}</div>`
        //         html += `<div class="item" style="width:${descWidth}; white-space: pre-line">${question.q_description}</div>`
        //         html += `<div class="item" style="width:10%">`;
        //         if (this.picDict[question.id] != undefined) {
        //             html += `<img class="image-icon" src="${this.imageIcon}" questionId="${question.id}" />
        //             <div>共${this.picDict[question.id].length}张</div>`;
        //         }
        //         html += "</div></div>";
        //     })
        //     html += "</div>"
        //     return html;
        // },

        //获取问题列表html
        getQuestionList(questionList) {
            let html = "<div class='question-item'>";

            html += `<div class='self-border' style='left: 40%'></div>`;

            questionList.map((question) => {
                html += "<div class='question-detail-item'>"
                html += `<div class="item" style="width:40%"><span class="question-detail-item-href blue-a" questionId="${question.id}">${question.q_classification}</span></div>`
                html += `<div class="item" style="width:60%; white-space: pre-line">${question.q_description}</div>`
                html += "</div>";
            })
            html += "</div>"
            return html;
        },

        //展示图片  zeng
        showPicture(questionId) {
            this.imgPath = this.picDict[questionId];
            this.$nextTick(() => {
                this.$refs.pictureViewRef.showPicture(0);
            })
        },

        //调整表格高度
        resizeTable() {
            let tableHeight = window.innerHeight * 0.9 - 100;
            if (tableHeight < 200) {
                tableHeight = 200;
            }
            this.tableHeight = tableHeight;
            //处理表格渲染错位的问题（当resize时，表头高度发生变化，固定列的表头和普通表头可能高度不一致）
            this.$refs.elTableRef.doLayout();
        },

        //排序
        sortTable(column) {
            this.tableKeyList.sort = column.prop;
            this.tableKeyList.order = column.order == 'ascending' ? 'asc' : 'desc';
            this.getTableData();
        },

        //切换分页显示几条数据
        handleSizeChange(val) {
            this.tableKeyList.page = 1;
            this.tableKeyList.rows = val;
            this.getTableData();
        },

        //切换页码
        handleCurrentChange(val) {
            this.tableKeyList.page = val;
            this.getTableData();
        },

        //获取表格数据
        getTableData() {
            this.isLoading = true;
            let list = JSON.parse(JSON.stringify(this.axiosList));
            for (let k in this.tableKeyList) {
                if (k == 'filter_condition') {
                    list[k] = JSON.stringify(this.filterPost)
                } else {
                    list[k] = this.tableKeyList[k];
                }
            }
            
            this.$codePost('/expertCompatibility/' + this.tableList.postApp + '/', list, { operation: "获取数据", failed: true }).then(res => {
                if (res.code == 200) {
                    //表格数据
                    this.tableData = res.data[this.tableList.tableDataKey];
                    //数据总数
                    this.sizeTotal = res.data[this.tableList.tableTotalKey];
                    if(list['filter_condition'].length == 0){//没有筛选条件
                        this.$emit("afterGetTable", res.data);
                    }
                    if(this.tableData.length == 0 && this.tableKeyList.page != 1){
                        this.tableKeyList.page = 1;
                        this.getTableData()
                    }
                    this.picDict = res.data.picture_dict;
                    //筛选条件
                    this.$nextTick(() => {
                        this.filterOriginal = res.data[this.tableList.filter];
                        this.$emit("getFilterOriginal", this.filterOriginal);
                    })
                }
                this.isLoading = false;
                let time1 = new Date().getTime();
                this.$nextTick(() => {
                    let time2 = new Date().getTime();
                })
            })
        },

        //下载log文件
        downloadFile(href) {
            this.$publicJS.downloadFile(this, href);
        },

        //跳转到问题详情
        jumpQuestionDetail(questionId) {
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            queryList.questionId = questionId;
            // 新页面打开 zeng
            let routeUrl = this.$router.resolve({
                path: "/mtl_test_platform/page/questionDetail",
                query: queryList
            })
            window.open(routeUrl.href, '_blank');
            // let newPath = this.routeList.prefix + this.routeList.questionDetail;
            // this.$publicJS.iframeParentPost(newPath, queryList, true);
        },

        //跳转到设备详情
        jumpDeviceDetail(item, deviceId) {
            // 打开抽屉
            // console.log(item)
            this.$refs.deviceDetailRef.openDrawer(item)


            // // 打开新页面
            // let queryList = JSON.parse(JSON.stringify(this.$route.query));
            // queryList.deviceId = deviceId;
            // let routeUrl = this.$router.resolve({
            //     path: "/mtl_test_platform/page/problemDeviceDetail",
            //     query: queryList
            // })
            // window.open(routeUrl.href, '_blank');
        },
        
    },
}
</script>
<style scoped>
.report-el-table>>>.question-detail-item {
    width: 100%;
    border-bottom: 1px solid #EBEEF5;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
}

.report-el-table>>>.question-detail-item:last-child {
    border-bottom: none;
}

.report-el-table>>>.question-detail-item>.item {
    display: inline-block;
    text-align: center;
    align-self: center;
    vertical-align: middle;
}

.report-el-table>>>.question-detail-column {
    padding: 0;
    position: relative;
}

.report-el-table>>>.question-item>.self-border {
    position: absolute;
    top: 0;
    bottom: 0;
    border-left: 1px solid #EBEEF5;
}

.report-el-table>>>.question-detail-column>.cell {
    padding: 0;
}

.report-el-table>>>.gutter {
    background-color: #e7e9ee;
}
</style>
