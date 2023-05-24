<template>
    <div>
        <el-card v-loading="tableDataLoading" class="box-card" :style="{'margin-top' : `${isPreview ? '20px' : '0'}`}" id="problemTotal">
            <div slot="header" class="clearfix">
                <div class="decorate-div"></div>
                <div class="decorate-title">
                    问题详情
                </div>
            </div>
            <div class="card-content-div">
                <!-- 1，筛选模块 -->
                <div v-if="!isPreview" class="filter-condition-div">
                    <!-- 已筛选 -->
                    <div class="selected-filter-list" v-if="selectedData.length > 0">
                        <div class="filter-list-title">已筛选：</div>
                        <div class="filter-list-content">
                            <el-tooltip 
                                v-for="(selectedItem, itemIndex) in selectedData"
                                :key="itemIndex"
                                effect="light" 
                                placement="top-start"
                                >
                                <div slot="content" style="max-width: 20rem">
                                    <span>{{selectedItem.label}}：</span>
                                    <span v-for="(dataItem, dataIndex) in selectedItem.data" :key="dataItem.value">
                                        <span>{{dataIndex > 0 ? '，': ''}}</span>
                                        <span v-if="dataItem.data">
                                            <span>{{dataItem.label}} (</span>
                                            <span v-for="(childrenItem, childrenIndex) in dataItem.data" :key="childrenItem.label">
                                                {{childrenIndex > 0 ? '，' + childrenItem.label : childrenItem.label}}
                                            </span>
                                            <span>)</span>
                                        </span>
                                        <span v-else>{{dataItem.label}}</span>
                                    </span>
                                </div>
                                <el-tag
                                    @close="removeFilter(selectedItem)"
                                    size="small"
                                    class="selected-filter-tag"
                                    closable
                                    >
                                    <div class="ellipsis-item">
                                        <span>{{selectedItem.label}}：</span>
                                        <span v-for="(dataItem, dataIndex) in selectedItem.data" :key="dataItem.value">
                                            <span>{{dataIndex > 0 ? '，': ''}}</span>
                                            <span v-if="dataItem.data">
                                                <span>{{dataItem.label}} (</span>
                                                <span v-for="(childrenItem, childrenIndex) in dataItem.data" :key="childrenItem.label">
                                                    {{childrenIndex > 0 ? '，' + childrenItem.label : childrenItem.label}}
                                                </span>
                                                <span>)</span>
                                            </span>
                                            <span v-else>{{dataItem.label}}</span>
                                        </span>
                                    </div>
                                </el-tag>
                            </el-tooltip>
                        </div>
                        <div class="operation-div">
                            <el-button size="mini" @click="clearFilter">清空</el-button>
                        </div>
                    </div>

                    <div class="filter-div" v-if="filterData.length > 0">
                        <div v-for="(item, itemIndex) in filterData"
                            class="filter-content"
                            :key="itemIndex"
                            v-show="item.isExpand">
                            <div
                                class="filter-title" 
                                :style="{
                                    borderRadius: itemIndex == 0 ? '5px 0 0 0' : itemIndex == filterData.length - 1 ? '0 0 0 5px': 0
                                }"
                                >
                                {{item.label}}
                            </div>

                            <!-- 多选 -->
                            <div v-if="item.isMultiple" class="filter-data-div">
                                <div v-for="(data, dataIndex) in item.data"
                                    :key="dataIndex"
                                    :style="{
                                        display: !data.inMultiple ? 'none' : data.children ? 'block' : 'inline-block', 
                                        margin: data.children ? '5px' : '0 5px'
                                    }">

                                    <div v-if="data.children && data.inMultiple" style="display: flex; min-height: 32px">
                                        <el-tooltip 
                                            effect="light" 
                                            :content="data.label" 
                                            placement="top-start"
                                            >
                                            <el-checkbox 
                                                class="multiple-itme-title filter-item" 
                                                v-model="totalData[item.value][data.value].isSelectAll"
                                                @change="selectAllFilter(item.value, data.value)"
                                                >
                                                {{data.label}}
                                            </el-checkbox>
                                        </el-tooltip>
                                        <div class="multiple-itme-content">
                                            <el-checkbox
                                                v-for="(children,childrenIndex) in data.children"
                                                :key="childrenIndex"
                                                class="filter-item"
                                                v-model="totalData[item.value][data.value].value[childrenIndex].value"
                                                @change="changeChildrenFilter(item.value, data.value)"
                                                >
                                                {{children.label}}
                                            </el-checkbox>
                                        </div>
                                    </div>

                                    <div v-else-if="data.inMultiple" class="filter-item">
                                        <el-checkbox v-model="totalData[item.value][data.value].value" @change="$forceUpdate()">
                                            {{data.label}}
                                        </el-checkbox>
                                    </div>
                                </div>
                            </div>

                            <!-- 单选 -->
                            <div v-else 
                                class="filter-data-div"
                                style="display: flex; flex-wrap: wrap;">
                                <div
                                    v-for="(data, dataIndex) in item.data"
                                    :key="dataIndex"
                                    :style="{display: data.children ? 'block' : 'inline-block'}"
                                    >
                                    <el-dropdown
                                        v-if="data.children"
                                        @click.native.prevent="addFilter(item, data)"
                                        >
                                        <span class="filter-item">
                                            <span>{{data.label}}</span>
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item
                                                v-for="(children, childrenIndex) in data.children"
                                                :key="childrenIndex"
                                                @click.native.prevent="addFilter(item, data, children)"
                                                >
                                                {{children.label}}
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                    <div 
                                        v-else
                                        class="filter-item"
                                        @click="addFilter(item, data)"
                                        >
                                        {{data.label}}
                                    </div>
                                </div>
                            </div>

                            <!-- 操作栏 -->
                            <div v-if="item.isMultiple" class="operation-div">
                                <el-button 
                                    type="primary" 
                                    size="mini"
                                    @click="submitMultipleFilter(item)"
                                    >
                                    确定
                                </el-button>
                                <el-button size="mini" @click="cancelMultiple(item)">取消</el-button>
                            </div>
                            <div v-else class="operation-div">
                                <el-button size="mini" @click="item.isMultiple=true">多选</el-button>
                            </div>
                        </div>
                    </div>

                    <!-- <div>
                        <el-input
                            class="search-input"
                            placeholder="搜索问题"
                            suffix-icon="el-icon-search"
                            v-model="tableKeyList.key"
                            >
                        </el-input>
                    </div> -->
                </div>

                <!-- 2，表格模块 -->
                <div class="table-div">
                    <!-- 一键统一开单按钮 -->
                    <el-button class="orderBtn" type="primary" size="mini" v-if="projectCode != 'all' && !isPreview" @click="createIssues(tableSelectItem)">一键统一开单</el-button>
                    <el-table 
                        class="border-div report-el-table"
                        ref="elTableRef"
                        :data="tableData"
                        style="width: 100%"
                        stripe 
                        :header-cell-style="{ backgroundColor: '#e7e9ee', color: '#414350', textAlign: 'center' }"
                        :row-class-name="tableRowClassName"
                        :expand-row-keys="expands"
                        row-key="id"
                        @sort-change="sortTable" 
                        @selection-change="handleSelectionChange"
                        @row-click="openDetails">
                        <!-- 选择框 -->
                        <el-table-column v-if="projectCode != 'all' && !isPreview" align="center" type="selection" width="55">
                        </el-table-column>
                        
                        <!-- 问题分类、问题重现率 -->
                        <el-table-column
                            v-for="(item,index) in problemTableList.columnData"
                            :key="index"
                            :prop="item.propName"
                            :label="item.titleName"
                            :sortable="isPreview ? false : item.sortFlag ? 'custom' : false"
                            :align="item.align || 'center'"
                            v-if="item.type == 'normal' && item.propName != 'remark'"
                            >
                            <template v-slot="scope">
                                <!-- <div v-if="item.propName == 'q_category'" class="q-category-div" @click="viewDetail(scope.row)">{{scope.row[item.propName]}}</div>
                                <div v-else>{{scope.row[item.propName]}}</div> -->
                                <div >{{scope.row[item.propName]}}</div>
                            </template>
                        </el-table-column>

                        <!-- 备注 -->
                        <el-table-column 
                            :prop="item.propName"
                            :label="item.titleName"
                            :sortable="isPreview ? false : item.sortFlag ? 'custom' : false"
                            :align="item.align || 'center'"
                            v-else-if="item.propName == 'remarks' && !isPreview">
                            <template v-slot="scope">
                                <div>
                                    <span v-if="scope.row[item.propName]">{{scope.row[item.propName]}}</span>
                                    <span v-else>暂无</span>
                                    <i v-if="projectCode != 'all'" @click="editRemark(scope.row)" style="color: #4876f2;cursor: pointer" class="el-icon-edit-outline"></i>
                                </div>
                            </template>
                        </el-table-column>

                        <!-- 问题级别 -->
                        <el-table-column 
                            :prop="item.propName"
                            :label="item.titleName"
                            :sortable="isPreview ? false : item.sortFlag ? 'custom' : false"
                            :align="item.align || 'center'"
                            v-else-if="item.propName == 'q_level'">
                            <template v-slot="scope">
                                <!-- <div :style="{color:qLevelList[scope.row[item.propName]].color}">{{qLevelDict[scope.row[item.propName]]}}</div> -->
                                <div :style="{color:qLevelList[scope.row[item.propName]].color}">{{'(P' + scope.row[item.propName] + ')' + qLevelDict[scope.row[item.propName]]}}</div>
                                <!-- <div>{{'(P' + scope.row[item.propName] + ')' + qLevelDict[scope.row[item.propName]]}}</div> -->
                            </template>
                        </el-table-column>
                        <!-- MTL接口人 -->
                        <el-table-column 
                            :prop="item.propName"
                            :label="item.titleName"
                            :sortable="isPreview ? false : item.sortFlag ? 'custom' : false"
                            :align="item.align || 'center'"
                            v-else-if="item.propName == 'test_qa' && !isPreview">
                            <template v-slot="scope">
                                <span>{{scope.row.test_qa_name}}</span>
                                <self-popo v-if="!$checkStrIsNull(scope.row.test_qa_name)" :email="scope.row[item.propName]"/>
                            </template>
                        </el-table-column>
                        
                        <!-- 影响设备 -->
                        <el-table-column
                            :label="item.titleName"
                            v-else-if="item.propName == 'allDevice'"
                            :minWidth="item.minWidth || '100'"
                            :align="isPreview ? 'left' : 'center'">
                            <template v-slot="scope">
                                <div v-for="item,index in scope.row.phoneList" :key="index">
                                    <span class="device-info-span" @click="handleDeviceClick(item)">{{item.device}}</span><span v-if="item.os">（{{item.os}}）</span>
                                </div>
                            </template>
                        </el-table-column>

                        <!-- 问题图片 -->
                        <el-table-column
                            :label="item.titleName"
                            v-else-if="item.propName == 'questionPic'"
                            align="center">
                            <template slot-scope="scope">
                                <span v-if="pictureDict[scope.row.id] != undefined">
                                    <self-picture-show 
                                        :img-path="pictureDict[scope.row.id]" 
                                        img-type="showFirst"
                                        :show-title="reportType == 'expert'"/>
                                    <div>共{{pictureDict[scope.row.id].length}}张</div>
                                </span>
                            </template>
                        </el-table-column>

                        <!-- 跟进QA -->
                        <el-table-column
                            :label="item.titleName"
                            v-else-if="item.propName == 'follow_qa' && !isPreview"
                            align="center">
                            <template v-slot="scope">
                                <div>
                                    <span v-if="scope.row[item.propName]">
                                        {{scope.row.follow_qa_name}}<self-popo v-if="!$checkStrIsNull(scope.row.follow_qa_name)" :email="scope.row[item.propName]"/>
                                    </span>
                                    <span v-else>暂无</span>
                                    <i v-if="projectCode != 'all'" @click="editFollowQA(scope.row)" style="color: #4876f2; cursor: pointer" class="el-icon-edit-outline"></i>
                                </div>
                            </template>
                        </el-table-column>

                        <!-- 查看问题详情 -->
                        <el-table-column
                            :label="'问题详情'"
                            v-else-if="item.propName == 'questionDetail' && !isPreview"
                            align="center">
                            <template v-slot="scope">
                                <span class="q-category-div" @click="viewDetail(scope.row)">查看</span>
                            </template>
                        </el-table-column>

                        <!-- 操作 -->
                        <el-table-column
                            :label="item.titleName"
                            v-else-if="item.propName == 'operation' && !isPreview"
                            align="center"
                            width="250px">
                            <template v-slot="scope">
                                <div v-if="item.canToIssueLink && scope.row.list_link != null && scope.row.list_link != '' ">
                                    <a :href="scope.row.list_link" target="_blank" @click.stop>
                                        <el-button size="mini">查看任务单</el-button>
                                    </a>
                                </div>
                                <div v-else-if="item.canIgnoreIssue && scope.row.qa_confirmed != '' && scope.row.qa_confirmed != null ">
                                    <el-button size="mini" @click.stop="confirmEditIssue('cancelIgnore',scope.row.id)">
                                        &nbsp;取消忽略&nbsp;
                                    </el-button>
                                </div>
                                <div v-else>
                                    <el-button v-if="item.canCreateIssues" type="primary" size="mini" @click.stop="createIssues([scope.row])">一键开单</el-button>
                                    <el-button v-if="item.canIgnoreIssue" size="mini" @click.stop="confirmEditIssue('ignore',scope.row.id)">忽略</el-button>
                                    <el-button v-if="item.canHadIssue" type="primary" size="mini" @click.stop="hadIssues(scope.row.id)">已开单</el-button>
                                </div>
                            </template>
                        </el-table-column>

                        <!-- 除上面几个之外的 -->
                        <el-table-column 
                            :prop="item.propName"
                            :label="item.titleName"
                            :sortable="isPreview ? false : item.sortFlag ? 'custom' : false"
                            :align="item.align || 'center'"
                            v-else-if="item.propName == 'q_classification'">
                            <template v-slot="scope">
                                <div>{{scope.row[item.propName]}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 页脚 -->
                    <el-pagination 
                        v-if="!isPreview"
                        class="pagination" 
                        style="margin-top:0.5rem;" 
                        background 
                        align="right" 
                        @size-change="handleSizeChange" 
                        @current-change="handleCurrentChange" 
                        :page-sizes="[2, 5, 10, 30, 50, 100, 200]" 
                        :page-size="tableKeyList.rows" 
                        :current-page="tableKeyList.page" 
                        layout="prev, pager, next, jumper, sizes, total" 
                        :total="sizeTotal">
                    </el-pagination>
                </div>

                

                <!-- 问题级别说明 -->
                <div class="question-level">
                    <question-level></question-level>
                </div>


                <!-- 一件开单啥 -->
                <create-issues 
                    v-if="problemTableList.canOneKeyCreateIssues" 
                    ref="createIssuesRef" 
                    :axios-list="axiosList" 
                    :picture-dict="pictureDict"
                    :report-type="reportType"
                    @afterCreateIssue="getTableData"
                    />

                <!-- 跟进qa的编辑对话框 -->
                <self-dialog
                    v-if="problemTableList.canEditFollowQA" 
                    ref="changeFollowQaRef" 
                    :dialog-data="{ title: '修改跟进QA', width: '15rem', confirmName: '确认', closeName: '取消' }" 
                    @confirm="confirmChangeFollowQa" 
                    >
                    <template>
                        <self-person-select 
                            :person.sync="followQa" 
                            :option-data="personOptions" 
                            email-key="userEmail"
                            cn-name-key="userName"
                            clearable
                            >
                            <template slot-scope="personSelect">
                                <el-option 
                                    v-for="(item,index) in personSelect.option" 
                                    :key="item.userEmail" 
                                    v-if="item.canShow != false"
                                    :value="item.userEmail" 
                                    :label="item.userName">
                                </el-option>
                            </template>
                        </self-person-select> 
                    </template>
                </self-dialog>

                <!--单号填写-->
                <self-dialog
                    v-if="problemTableList.canEditIssue" 
                    ref="editIssueRef" 
                    :dialog-data="{ title: '填写单号', width: '20rem', confirmName: '确认', closeName: '取消' }" 
                    @confirm="confirmEditIssue('hadIssue')" 
                    >
                    <template>
                        <div style="display:flex;flex-direction:row;margin-bottom:10px">
                            <span style="margin-right:5px;color:#F56C6C">*</span>
                            <el-cascader
                                style="width:100%"
                                v-model="projectSelect"
                                :options="projectArr"
                                :props="{ children: 'children', label: 'label', emitPath: false, expandTrigger: 'hover' }"
                                :show-all-levels="false"
                            ></el-cascader>
                        </div>
                        <div style="display:flex;flex-direction:row;">
                            <span style="margin-right:5px;color:#F56C6C">*</span>
                            <el-input  
                                @keyup.native="limitNumber()"
                                @input="limitNumber()" 
                                v-model="curIssueId" 
                                placeholder="请输入单号(仅支持输入数字)"
                            ></el-input>
                        </div>
                    </template> 
                </self-dialog>

                <!-- 修改备注对话框 -->
                <self-dialog
                    v-if="problemTableList.canEditRemark" 
                    ref="editeRemarksRef" 
                    :dialog-data="{ title: '修改备注', width: '20rem', confirmName: '确认', closeName: '取消' }" 
                    @confirm="confirmEditRemarks" 
                    >
                    <template>
                        <el-input v-model="remarks"></el-input>
                    </template>
                </self-dialog>

                <question-drawer ref="questionDetailRef"></question-drawer>
            </div>
        </el-card>
    </div>
</template>

<script>
import QuestionLevel from '@/components/TestReport/CompatibilityTestReport/QuestionLevel.vue'
import CreateIssues from '@/components/TestReport/CompatibilityTestReport/CreateIssues'
import SelfDialog from '@/components/Common/SelfDialog'
import SelfPersonSelect from '@/components/Common/SelfPersonSelect'
import QuestionDrawer from '@/components/TestReport/CompatibilityTestReport/QuestionDrawer'
import $ from 'jquery'
export default {
    components: {
        QuestionLevel,
        CreateIssues,
        SelfDialog,
        SelfPersonSelect,
        QuestionDrawer
    },
    data() {
        return {
            followQa: "",       // 跟进qa
            personOptions: [],  // qa选项
            currenRow: "",   // 当前问题行
            projectCode: "",        // 当前项目组
            remarks: "",        // 备注
            tableDataLoading: true,
            positionStyle: {top:'600px',left:'1020px'},
            qLevelDict: {
                "0": "立刻",
                "1": "紧急",
                "2": "高",
                "3": "普通",
                "4": "低",
            },
            tableKeyList: {
                page: 1,
                rows: 30,
                sort: "",
                key: "",    // 关键字搜索的关键字
                order: "",
                filter_condition:[],
            },
            sizeTotal: 0,
            // 表格是否处于加载
            pictureDict: {},
            selectedData: [],
            filterData: [],
            totalData: {},
            isShowExpandOrFold: false,
            problemTableList: {
                postApp: "expert_test_question_report",
                tableDataKey: "data",
                tableTotalKey: "data_num",
                columnData: "",
                filter:"filter_condition",
                canOneKeyCreateIssues: false,
                qClassificationCanClick: true,
            },
            columnData: [],
            filterOriginal: [],
            projectArr:[],
            projectSelect:'',
            curIssueId: '',
            confirmStatus:{"ignore":"忽略","cancelIgnore":"取消忽略","hadIssue":"已开单"},
            // 表格数据
            tableData: [],
            expands: [],
            // 表格选中行
            tableSelectItem: [],
            canExpand: true,
            // expertProblemColArr: ["q_category", "q_classification", "q_level", "q_description", "recurrent_rate", "test_qa", "follow_qa", "remark", "questionPic", "allDevice"],
            expertProblemColArr: ["q_category", "q_classification", "q_level", "q_description", "recurrent_rate", "allDevice","questionPic", "test_qa", "follow_qa", "remarks", "questionDetail"],
        }
    },
    props: {
        axiosList: {
            required: true,
            type: Object
        },
        reportType: {
            required: true,
            type: String,
        },
        isPreview: {
            required: true,
        }
    },
    computed:{
        qLevelList() {
            return this.$store.getters.getQLevelList;
        },
        filterPost() {
            let res = [];
            let curFilter = this.selectedData;
            if (curFilter.length > 0) {
                for (let i = 0; i < curFilter.length; i++) {
                    let curItem = { "item": "", "item_value": [] };
                    curItem.item = curFilter[i].value;
                    for (let j = 0; j < curFilter[i].data.length; j++) {
                        let childData = curFilter[i].data[j]
                        if (curFilter[i].data[j].data) {//说明还有多个
                            let child = curFilter[i].data[j].data
                            for (let k = 0; k < child.length; k++) {
                                curItem.item_value.push(child[k].label);
                            }
                        } else {
                            if (curItem.item == 'q_level') {
                                // let levelArr = childData.value.split('P')
                                // curItem.item_value.push(levelArr[1]);
                                curItem.item_value.push(childData.value);
                            } else {
                                curItem.item_value.push(childData.label);
                            }
                        }
                    }
                    res.push(curItem)
                }
            }
            return res
        },
    },
    watch: {
        projectArr(newValue, oldValue) {
            this.cascaderKey++;
        }
    },
    created() {
        this.projectCode = this.$route.query.project
        this.initData()
        this.getTableData()
        this.getProjectArr()
        this.problemTableList.columnData = this.getColumnData(this.expertProblemColArr);
        // this.problemTableList.columnData = this.$publicJS.getReportColumnData1(this.expertProblemColArr);
        // console.log('this.problemTableList:',this.problemTableList)
    },
    methods: {
        //获取项目组名
        getProjectName(project) {
            let projectList = this.$publicJS.getCascacaderChoosed(this.projectArr, project);
            if (projectList.label == "") {
                //如果当前项目组无效，则默认选中第一个项目组
                this.projectSelect = this.projectArr[0].children[0].value;
            } else {
                this.projectSelect = project;
            }
        },

        //获取项目组选项
        getProjectArr() {
            this.$codePost("/service/get_create_task_project/", {}, { operation: "获取项目组数据", failed: true }).then(res => {
                if(res.code == 200){
                    this.projectArr = res.data;
                    let project = this.$route.query.project;
                    this.getProjectName(project);
                }
            })
        },

        //限制输入数字
        limitNumber() {
            this.curIssueId = this.curIssueId.replace(/[^\.\d]/g,'');
            this.curIssueId = this.curIssueId.replace('.','');
        },
        getColumnData(colArr) {
            // colArr.unshift("expand");
            // if(this.$route.query.project != "all"){
            //     //不是全部项目组，最前面加入选择列
            //     colArr.unshift("checkbox");
            // }
            let columnData = this.$publicJS.getReportColumnData1(colArr);
            if(this.$route.query.project != "all"){
                columnData.push({
                    propName: "operation",
                    titleName: "操作",
                    minWidth: 200,
                    align: "center",
                    canCreateIssues: true,
                    canToIssueLink: true,
                    canIgnoreIssue: true,
                    canHadIssue: true,
                })
                this.problemTableList.canOneKeyCreateIssues = true;
                this.problemTableList.canEditFollowQA = true;
                this.problemTableList.canEditRemark = true;
                this.problemTableList.canEditIssue = true;
            }
            return columnData;
        },
        // 初始化筛选值
        initData () {
            this.totalData = {};
            // 遍历筛选项
            for (let i = 0; i < this.filterData.length; i++) {
                // 需要展开折叠功能
                if (this.isShowExpandOrFold) {
                    if (this.defaultConditionList.length === 0) {
                        this.filterData[i].isExpand = false;
                    } else {
                        // 默认显示的筛选项
                        for (let k = 0; k < this.defaultConditionList.length; k++) {
                            if (this.filterData[i].value === this.defaultConditionList[k] && this.filterData[i]['data'].length > 0) {
                                this.filterData[i].isExpand = true;
                            } 
                        }
                    }
                } else { // 不需要展开折叠功能
                    this.filterData[i].isExpand = true;
                }
                let filterItem = this.filterData[i].value;
                this.totalData[filterItem] = {};
                let data = this.filterData[i].data;
                // 遍历筛选项的值
                for (let j = 0; j < data.length; j ++) {
                    let filterValue = data[j].value;
                    let filterLabel = data[j].label;
                    let childrenList = data[j].children;
                    this.totalData[filterItem][filterValue] = {};
                    if (childrenList) {
                        this.totalData[filterItem][filterValue] = {
                            isSelectAll: false,
                            value: [],
                            label: filterLabel
                        }
                        // 遍历筛选项值的子项
                        for (let k = 0; k < childrenList.length; k ++) {
                            let children = childrenList[k].value;
                            let item = {
                                label: childrenList[k].label,
                                value: false
                            };
                            this.totalData[filterItem][filterValue].value.push(item);
                        }
                    } else {
                        this.totalData[filterItem][filterValue] = {
                            value: false,
                            label: filterLabel
                        };
                    }
                }
            }
        },

        //设置行class
        tableRowClassName({row, rowIndex}){
            if(this.canExpand){
                if(row.phoneList.length > 0){
                    return "can-expand-row expand-row-" + row.id;
                }else{
                    return "no-expand-row";
                }
            }else{
                return "";
            }
        },

        // 获取表格数据
        getTableData() {
            let list = JSON.parse(JSON.stringify(this.axiosList));
            for (let k in this.tableKeyList) {
                if(k == 'filter_condition'){
                    list[k] = JSON.stringify(this.filterPost)
                }else{
                    list[k] = this.tableKeyList[k];
                }
            }
            // console.log('申请表格数据的参数：',list)
            this.$codePost('/expertCompatibility/' + this.problemTableList.postApp + '/', list, { operation: "获取数据", failed: true }).then(res => {
                if (res.code == 200) {
                    //表格数据
                    this.tableData = res.data.data;
                    // console.log("表格数据:", this.tableData)
                    this.tableDataLoading = false
                    this.pictureDict = res.data.picture_dict;
                    //数据总数
                    this.sizeTotal = res.data.data_num;
                    if(this.tableData.length == 0 && this.tableKeyList.page != 1){
                        this.tableKeyList.page = 1;
                        this.getTableData()
                    }
                    //筛选条件
                    this.filterOriginal = res.data.filter_condition;
                    this.filterOriginal = this.filterDataQLevel(this.filterOriginal)
                    // console.log(res.data)
                    this.filterData = this.filterOriginal
                    // console.log('this.filterData:', this.filterData)
                    this.initData()
                }
                this.isLoading = false;
            })
        },


        // 处理filterData中的问题级别
        filterDataQLevel(filter_condition){
            filter_condition.forEach(item => {
                if(item.value == 'q_level'){
                    let data = item.data
                    data.forEach(d => {
                        if(d.label == '0') {
                            d.label = "立刻"
                        }else if(d.label == '1'){
                            d.label = "紧急"
                        }else if(d.label == '2'){
                            d.label = "高"
                        }else if(d.label == '3'){
                            d.label = "普通"
                        }else if(d.label == '4'){
                            d.label = "低"
                        }
                    })
                }
            })
            // console.log(filter_condition)
            return filter_condition
        },

        addFilter (filterItem, dataItem, childrenItem) {
            // console.log('this.selectedData:',this.selectedData)
            // 检查是否有该筛选项，没有则初始化数据
            if (!this.isHasSelectedFilter(this.selectedData, filterItem.value)) {
                this.selectedData.push(
                    {
                        value: filterItem.value,
                        label: filterItem.label,
                        data: []
                    }
                );
            }
            let selectedItem = this.selectedData.filter( item => item.value == filterItem.value)[0];
            // 检查是否有该筛选项的值，没有则初始化数据
            if (!this.isHasSelectedFilter(selectedItem.data, dataItem.value)) {
                selectedItem.data.push(
                    {
                        value: dataItem.value,
                        label: dataItem.label,
                    }
                )
            }
            // 点击子筛选项
            if (childrenItem) {
                let selectedDataItem = selectedItem.data.filter( item => item.value == dataItem.value)[0];
                // 检查是否有自筛选项，没有则初始化数据
                if (!selectedDataItem.data) {
                    selectedDataItem.data = [];
                }
                // 检查是否有该筛选项的值
                if (!this.isHasSelectedFilter(selectedDataItem.data, childrenItem.value)) {
                    selectedDataItem.data.push(childrenItem);
                }
            }
            this.$forceUpdate();
            this.getTableData();
        },

        // 检查是否有该筛选项
        isHasSelectedFilter (data,value) {
            let result = data.filter( item => item.value == value);
            if (result.length > 0) {
                return true;
            } else {
                return false;
            }
        },

        // 全选筛选项
        selectAllFilter (filterName, item) {
            this.$forceUpdate();
            let isSelectAll = this.totalData[filterName][item].isSelectAll
            for (let i = 0; i < this.totalData[filterName][item].value.length; i ++) {
                this.totalData[filterName][item].value[i].value = isSelectAll;
            }
        },

        // 多选提交
        submitMultipleFilter (filterItem) {
            let data = this.totalData[filterItem.value];
            // 检查是否有该筛选项，没有则初始化数据
            if (!this.isHasSelectedFilter(this.selectedData, filterItem.value)) {
                this.selectedData.push(
                    {
                        value: filterItem.value,
                        label: filterItem.label,
                        data: [],
                    }
                );
            }
            let selectedItem = this.selectedData.filter( item => item.value == filterItem.value)[0];
            for (let key in data) {
                let item = data[key].value;
                // 如果没有自筛选项
                if (typeof(item) == 'boolean') {
                    // 如果选中了，则加入该值
                    if (item) {
                        selectedItem.data.push(
                            {
                                value: key,
                                label: data[key].label,
                            }
                        );
                    }
                // 如果有子筛选项
                } else {
                    let selectedArr = [];
                    for (let i = 0; i < item.length; i ++) {
                        let value = item[i].value
                        // 如果选中了则加入改值
                        if (value) {
                            // 没有选过该筛选项则初始化数据
                            if (!this.isHasSelectedFilter(selectedItem.data, key)) {
                                selectedItem.data.push(
                                    {
                                        value: key,
                                        label: data[key].label,
                                        data: []
                                    }
                                );
                            }
                            selectedArr.push(item[i]);
                        }
                    }

                    let selectedDataItem = selectedItem.data.filter( item => item.value == key)[0];
                    if (selectedDataItem) {
                        // 如果全选了则去掉自筛选项，留父筛选项即可
                        if (item.length > 0 && item.length == selectedArr.length) {
                            delete selectedDataItem.data;
                        } else {
                            selectedDataItem.data = selectedArr;
                        }
                    }
                }
            }
            this.selectedData.map((item,index)=>{
                if(item.value ==  filterItem.value){
                    if(item.data.length == 0){
                        this.$message.error('内容不能为空');
                        this.selectedData.splice(index,1)
                    }else{
                        filterItem.isMultiple = false;
                        this.$forceUpdate();
                    }
                }
            })
            this.getTableData()
           
        },

        // 取消多选
        cancelMultiple (item) {
            let filterItemData = this.totalData[item.value];
            for (let key in filterItemData) {
                // 如果存在子筛选项，则将子筛选项都设为未选中
                if (typeof(filterItemData[key].value) == 'object') {
                    // 将全选设为未选中
                    filterItemData[key].isSelectAll = false;
                    let childrenData = filterItemData[key].value
                    for (let i = 0; i < childrenData.length; i ++) {
                        childrenData[i].value = false;
                    }
                } else {
                    // 如果没有子筛选项，则直接设为未选中
                    filterItemData[key].value = false;
                }
            }
            item.isMultiple = false;
            this.$forceUpdate();
        },

        //排序
        sortTable(column) {
            this.tableKeyList.sort = column.prop;
            this.tableKeyList.order = column.order == 'ascending' ? 'asc' : 'desc';
            this.getTableData();
        },

        //选中行变化
        handleSelectionChange(val) {
            this.tableSelectItem = JSON.parse(JSON.stringify(val));
        },

        //行点击展开设备详情
        openDetails(row){
            if(this.canExpand){
                if(row.phoneList.length){
                    let index = this.expands.indexOf(row.id);
                    if(index == -1){
                        let oldDomTop = $(".expand-row-" + row.id).offset().top;
                        this.expands = [row.id];
                        this.$nextTick(()=>{
                            let rowDomTop = $(".expand-row-" + row.id).offset().top;
                            if(rowDomTop < 0){
                                $('.el-main').animate({
                                    scrollTop: $(".el-main").scrollTop() + rowDomTop - oldDomTop - $('.el-main').offset().top
                                }, 0);
                            }
                        })
                    }else{
                        this.expands = [];
                    }
                }
            }
        },

        // 清空筛选项
        clearFilter () {
            this.selectedData = [];
            this.getTableData()
            this.$store.commit("setProblemFilter", []);
        },

        // 删除筛选项
        removeFilter (selectedItem) {
            this.$store.commit("setProblemFilter", []);
            for (let i = 0; i < this.selectedData.length; i ++) {
                if (this.selectedData[i].value == selectedItem.value) {
                    this.selectedData.splice(i, 1);
                    break;
                }
            }
            this.getTableData()
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

        // 查看详情事件
        viewDetail(item){
            // 打开抽屉
            // console.log(item)
            this.$refs.questionDetailRef.openDrawer(item)

            // 打开新页面
            // const h = window.location.href.split('?')[1].split('&')
        
            // let queryList = JSON.parse(JSON.stringify(this.$route.query));
            // queryList.questionId = item.id;
            // h.forEach(item => {
            //     let packageList = item.split('=')
            //     if(packageList[0] == 'packageType') {
            //         queryList.packageType = packageList[1]
            //     }
            // })
            // console.log(queryList)
            // let routeUrl = this.$router.resolve({
            //     path: "/mtl_test_platform/page/questionDetail",
            //     query: queryList
            // })
            // window.open(routeUrl.href, '_blank');
        },



        // 点击设备名称事件
        handleDeviceClick(item){
            let queryList = JSON.parse(JSON.stringify(this.$route.query));
            queryList.deviceId = item.id;
            // console.log(queryList)
            // console.log(item)
            this.$router.push({
                path: "/mtl_test_platform/page/problemDeviceDetail",
                query: queryList
            })
        },

        // 编辑备注
        editRemark(row){
            this.remarks = row.remarks
            this.currenRow = row
            this.$refs.editeRemarksRef.openDialog()
        },
        // 确认修改备注
        confirmEditRemarks(){
            let list = {
                table_name: this.currenRow.content_name,
                question_id: this.currenRow.id,
                remarks: this.remarks
            }
            // console.log(list)
            this.$codePost('/expertCompatibility/update_question_remarks/', list, { operation: "修改问题备注", failed: true }).then(res => {
                if (res.code == 200) {
                    this.getTableData()
                    this.$refs.editeRemarksRef.closeDialog()
                }
            })
        },

        // 编辑跟进qa
        editFollowQA(row){
            this.currenRow = row
            this.getQaList()
            this.$refs.changeFollowQaRef.openDialog()         
        },

        getQaList(){
            let list = {
                project: this.projectCode
            }
            this.$codePost('/service/get_project_user/', list, { operation: "获取项目组人员信息", failed: true }).then(res => {
                if (res.code == 200) {
                    this.personOptions = res.data
                }
            })
        },

        emailToName(qaList){
            let emailName = {}
            qaList.forEach(item => {
                emailName[item.userEmail] = item.userName
            })
            return emailName
        },

        // 确认修改编辑qa
        confirmChangeFollowQa(){
            let list = {
                table_name: this.currenRow.content_name,
                question_id: this.currenRow.id,
                follow_qa: this.followQa
            }
            this.$codePost('/expertCompatibility/update_follow_qa/', list, { operation: "修改问题备注", failed: true }).then(res => {
                if (res.code == 200) {
                    this.getTableData()
                    this.$refs.changeFollowQaRef.closeDialog()
                }
            })
        },

        confirmEditIssue(type,id){
            let list = { table_name: this.axiosList.table_name, qa_confirmed: this.confirmStatus[type], question_id: id, test_type: this.axiosList.test_type}
            let hasError = false
            if(type == 'hadIssue') {
                if(this.curIssueId.trim() == ""){
                    hasError = true
                    this.$message.error('请输入单号')
                }else{
                    list['question_id'] = this.editIssueId;
                    list['project_id'] = this.projectSelect
                    list['issue_id'] = this.curIssueId;
                }
               
            }
            if(!hasError){
                this.$codePost("/service/qa_confirm_status/", list).then(res => {
                    if (res.code == 200) {
                        this.$message.success(res.msg)
                        this.getTableData();
                        this.$refs.editIssueRef.closeDialog();
                    }else {
                        this.$message.error(res.msg)
                    }
                })
            }
        },

        //一键开单
        createIssues(itemArr) {
            if (itemArr.length == 0) {
                this.$message.error("请至少选中一项！");
            } else {
                console.log(itemArr)
                this.$refs.createIssuesRef.startCreateIssues(itemArr);
            }
        },

        //已有单号
        hadIssues(id){
            this.editIssueId = id
            this.$refs.editIssueRef.openDialog();
        },
    }
}
</script>

<style lang="less" scoped>
.item-content {
    margin-top: 15px;
    .filter-condition-div {
        width: 100%;
        /*padding-right: 5px;*/
        border-radius: 5px;
    }
}

.selected-filter-list {
    border-radius: 5px 0 0 0;
    min-height: 32px;
    margin-bottom: 2px;
    display: flex;
    padding-right: 5px;
    background: #fff;
}

.filter-div {
    padding-right: 5px;
    border: 1px solid #e5e8e9;
    border-radius: 5px;
    background: #fff;
    font-size: 14px;
}

.filter-content {
    border-top: 1px solid #eceef2;
    width: 100%;
    display: flex;
}

.filter-title {
    width: 100px;
    min-height: 36px;
    background: #156eef;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.filter-data-div {
    flex: 1;
    padding: 2px 10px;
}
.operation-div {
    width: 150px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.filter-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 32px;
    margin-right: 10px;
    padding: 0 5px;
    color:#606266;
}

.search-input {
    margin-top: 15px;
    width: 25%;
}
.table-div {
    position: relative;
    margin-top: 40px;
}

.filter-list-title {
    padding-left: 5px;
    line-height: 36px; 
    /*border-left: 2px solid #3e72fd;*/
}
.filter-list-content {
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.ellipsis-item {
    max-width: 350px; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap;
}
.selected-filter-tag {
    margin: 2px 5px;
    display: flex;
}
.selected-filter-tag .el-icon-close {
    top: 3px !important;
}
.question-level {
    margin-top: 20px;
    margin-bottom: 20px;
}
.hover_con{
    position: fixed;
    padding: 10px;
    border: 1px solid #eee;
    background: #fff;
    z-index: 999 !important;
}
.device-info-span {
    cursor: pointer;
    color: #4876f2;
}
.orderBtn {
    position: absolute;
    right: 0;
    top: -35px;
    z-index: 999;
}
.q-category-div {
    cursor: pointer;
    color: #156eef;
}
.q-category-div:hover { 
    text-decoration: underline; 
}
.el-card /deep/ .el-card__header {
    background-color: #f6f9fc;
    padding: 10px 20px;
}
.decorate-div {
    width: 3px;
    height: 20px;
    background: #4876f2;
    display: inline-block;
    margin-right: 8px;
    vertical-align: sub;
}
.decorate-title {
    display: inline-block;
    color: #333333;
    font-size: 20px;
}
</style>


<style>
/*隐藏没有设备的行的展开隐藏*/
.report-el-table>>>.no-expand-row .el-table__expand-column .el-table__expand-icon {
    display: none;
}
.report-el-table>>>.el-table__expanded-cell {
    background-color: #EEEEEE !important;
}
.report-el-table>>>.can-expand-row {
    cursor: pointer;
}

.report-el-table>>>.el-table-column--selection>.cell,
.report-el-table>>>.el-table__expand-column>.cell {
    padding-left: 7px;
    padding-right: 7px;
}
</style>