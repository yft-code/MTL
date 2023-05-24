<template>
    <div class="filter-condition-div">
        <div class="selected-filter-list" v-if="selectedData.length > 0">
            <div class="filter-list-title">已筛选：</div>
            <div class="filter-list-content">
                <el-tooltip 
                    v-for="(selectedItem, itemIndex) in selectedData"
                    :key="itemIndex"
                    effect="light" 
                    placement="top-start"
                >
                    <!-- tooltip内容 -->
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
                    <!-- 已筛选标签 -->
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
            <div 
                v-for="(item, itemIndex) in filterData"
                :key="itemIndex"
                class="filter-content"

                v-show="item.isExpand"
            >
                <!-- 筛选项 -->
                <div 
                    class="filter-title" 
                    :style="{
                        borderRadius: itemIndex == 0 ? '5px 0 0 0' : itemIndex == filterData.length - 1 ? '0 0 0 5px': 0
                    }"
                >
                    {{item.label}}
                </div>
                <!-- 多选 -->
                <div 
                    v-if="item.isMultiple"
                    class="filter-data-div"
                >
                    <div
                        v-for="(data, dataIndex) in item.data"
                        :key="dataIndex"
                        :style="{
                            display: !data.inMultiple ? 'none' : data.children ? 'block' : 'inline-block', 
                            margin: data.children ? '5px' : '0 5px'
                        }"
                    >
                        <!-- 有子项的筛选项 -->
                        <div v-if="data.children && data.inMultiple" style="display: flex; min-height: 32px">
                            <!-- 父项 -->
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
                            <!-- 子项 -->
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
                        <!-- 没有子项的筛选项 -->
                        <div v-else-if="data.inMultiple" class="filter-item">
                            <el-checkbox v-model="totalData[item.value][data.value].value" @change="$forceUpdate()">
                                {{data.label}}
                            </el-checkbox>
                        </div>
                    </div>
                </div>
                <!-- 单选 -->
                <div 
                    v-else 
                    class="filter-data-div"
                    style="display: flex; flex-wrap: wrap;"
                >
                    <div
                        v-for="(data, dataIndex) in item.data"
                        :key="dataIndex"
                        :style="{display: data.children ? 'block' : 'inline-block'}"
                    >
                        <!-- 有子项的筛选项 -->
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
                        <!-- 没有子项的筛选项 -->
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
                    <el-button size="mini" @click="item.isMultiple = true">多选</el-button>
                </div>
            </div>
        </div>

        <!-- 展开其他筛选项 -->
        <div v-if="filterData.length > 0 && isShowExpandOrFold" id="expandOtherConditionDiv">
            <el-button type="primary" size="mini" @click="expandOtherCondition" v-if="isShowOtherCondition == false">更多筛选条件 <i class="el-icon-arrow-down"></i></el-button>
            <el-button type="primary" size="mini" @click="expandOtherCondition" v-else>收起 <i class="el-icon-arrow-up"></i></el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            totalData: {},
            selectedData: [],
            isShowOtherCondition: false,
            filterData: [],
        }
    },
    props: {
        filterList: {
            type: Array,
            required: true
        },
        defaultConditionList: {
            type: Array,
            required: true,
        },
        isShowExpandOrFold: {
            type: Boolean,
            required: true,
        }
    },
    mounted () {
        
    },
    computed:{
        checkHasSelect(){
            return this.$store.getters.getProblemFilter
        }
    },
    watch: {
        filterList :{
            handler:function(newValue){
                this.filterData = JSON.parse(JSON.stringify(this.filterList));
                this.initData();
            },
            immediate: true,
        },
        // selectedData:{
            //还需要判断是否 筛选type 问题报告 - 终端报告  
            // handler:function(newVal,oldVal){
            //     console.log('newVal,oldVal',newVal,oldVal);
            //     if(newVal.length > 0){
            //         this.$store.commit("setProblemFilter", newVal);
            //     }
            // },
            // immediate: true,
        // },
        checkHasSelect: {
            handler: function(newVal) {
                if (newVal.length > 0) {
                    this.selectedData = [];
                    this.selectedData = JSON.parse(JSON.stringify(newVal));
                    //需要滚动到表格
                    this.getFilterData();
                }
            },
            deep:true,
            immediate: true,

        }
    },
    methods: {
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
        // 全选筛选项
        selectAllFilter (filterName, item) {
            this.$forceUpdate();
            let isSelectAll = this.totalData[filterName][item].isSelectAll
            for (let i = 0; i < this.totalData[filterName][item].value.length; i ++) {
                this.totalData[filterName][item].value[i].value = isSelectAll;
            }
        },
        // 多选时改成子项选项
        changeChildrenFilter (filterName, item) {
            this.$forceUpdate();
            let selectedCount = 0;
            let childrenLength = this.totalData[filterName][item].value.length;
            for (let i = 0; i < this.totalData[filterName][item].value.length; i ++) {
                let childrenItem = this.totalData[filterName][item].value[i];
                if (childrenItem.value) {
                    selectedCount ++;
                }
            }
            // 如果一个都没选，则将全选取消
            if (selectedCount == 0) {
                this.totalData[filterName][item].isSelectAll = false;
            // 如果全选了则将全选选中
            } else if (selectedCount == childrenLength) {
                this.totalData[filterName][item].isSelectAll = true;
            }
        },
        // 选择单项筛选项
        addFilter (filterItem, dataItem, childrenItem) {
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
            // 向父组件提交筛选数据回调
            this.getFilterData();
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
                        // 向父组件提交筛选数据回调
                        this.getFilterData();
                    }
                }
            })
           
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
            // 向父组件提交筛选数据回调
            this.getFilterData();
        },
        // 清空筛选项
        clearFilter () {
            this.selectedData = [];
            this.$store.commit("setProblemFilter", []);
            
            // 向父组件提交筛选数据回调
            this.getFilterData();
        },
        // 向父组件提交筛选数据回调
        getFilterData () {
            this.$emit('getFilterData', this.selectedData);
        },

        //展开其他筛选项
        expandOtherCondition(){
            if(this.isShowOtherCondition == true){
                // 使折叠起来
                this.isShowOtherCondition = false;
                for (let m = 0; m < this.filterData.length; m++) {
                    this.filterData[m].isExpand = false;
                }
                for (let k = 0; k < this.defaultConditionList.length; k++) {
                    for (let m = 0; m < this.filterData.length; m++) {
                        if (this.filterData[m].value === this.defaultConditionList[k] && this.filterData[m]['data'].length > 0) {
                            this.filterData[m].isExpand = true;
                        } 
                    }
                }
            }else{
                // 使展开
                this.isShowOtherCondition = true;
                for (let m = 0; m < this.filterData.length; m++) {
                    this.filterData[m].isExpand = true;
                }
            }
        },
    },
    
}
</script>

<style scoped>
.filter-condition-div {
    width: 100%;
    /*padding-right: 5px;*/
    border-radius: 5px;
}
.selected-filter-list {
    border-radius: 5px 0 0 0;
    min-height: 32px;
    margin-bottom: 2px;
    display: flex;
    padding-right: 5px;
    background: #fff;
}
.ellipsis-item {
    max-width: 350px; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap;
}
.filter-list-title {
    padding-left: 5px;
    line-height: 36px; 
    /*border-left: 2px solid #3e72fd;*/
}
.selected-filter-tag {
    margin: 2px 5px;
    display: flex;
}
.filter-list-content {
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.filter-div {
    padding-right: 5px;
    border: 1px solid #e5e8e9;
    border-radius: 5px;
    background: #fff;
    font-size: 14px;
}
.filter-content:first-child {
    border-top: none;
}
.filter-content {
    border-top: 1px solid #eceef2;
    width: 100%;
    display: flex;
}
.filter-title {
    width: 100px;
    min-height: 36px;
    background: #3e72fd;
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
.filter-item:hover {
    background: #e4e7ed;
}
.multiple-itme-title {
    border: 1px solid #eceef2;
    border-radius: 5px;
}
.multiple-itme-content {
    display: flex; 
    flex-wrap: wrap;
    border-left: 1px solid #eceef2;
    padding-left: 15px;
}

/* 展开、收缩 */
#expandOtherConditionDiv{
    display: flex;
    justify-content: flex-end;
    /* float:right; */
    margin:0.625rem 0;
}
</style>

<style>
.selected-filter-tag .el-icon-close {
    top: 3px !important;
}
.multiple-itme-title .el-checkbox__label {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    font-weight: 700;
}
.multiple-itme-title .el-checkbox__input {
    line-height: 12px;
}
.el-dropdown-menu {
    max-width: 800px;
}
.el-dropdown-menu__item {
    display: inline-block;
}
</style>