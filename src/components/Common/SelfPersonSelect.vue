<template>
    <div class="pinyin-filter-person-select">
        <el-select 
            :class="prefix!=undefined?'has-prefix':''"
            style="overflow:hidden;" 
            filterable
            v-model="personValue" 
            :filter-method="filterMethod"
            :size="size" 
            :multiple="multiple" 
            :disabled="disabled"
            :clearable="clearable"
            :collapse-tags="collapseTags"
            :multiple-limit="multipleLimit"
            :autocomplete="autocomplete"
            :placeholder="placeholder" 
            :allow-create="allowCreate"
            :loading="loading"
            :loading-text="loadingText"
            :no-data-text="noDataText"
            :popper-class="popperClass"
            :reserve-keyword="reserveKeyword"
            :default-first-option="defaultFirstOption"
            @visible-change="visibleChange"
            @change="change"
            @remove-tag="removeTag"
            @clear="clear"
            @blur="blur"
            @focus="focus"
        >
            <span 
                v-if="prefix!=undefined" 
                slot="prefix" 
                v-html="prefix"
            >
            </span>
            <span 
                v-if="empty!=undefined" 
                slot="empty" 
                v-html="empty"
            >
            </span>
            <slot :option="filterOption"></slot>
        </el-select>
    </div>
</template>
<script>
export default {
    name: 'person-select',
    props: {
        person: {
            required: true,
        },
        optionData: {
            type: Array,
            required: true,
        },
        emailKey: {
            type: String,
        },
        cnNameKey: {
            type: String,
            required: true,
        },
        groupOptionKey: {
            type: String,
        },
        size: {
            type: String
        },
        multiple: {
            type: Boolean
        },
        disabled: {
            type: Boolean
        },
        clearable: {
            type: Boolean
        },
        collapseTags: {
            type: Boolean
        },
        multipleLimit: {
            type: Number
        },
        autocomplete: {
            type: String
        },
        placeholder: {
            type: String
        },
        allowCreate: {
            type: Boolean
        },
        loading: {
            type: Boolean
        },
        loadingText: {
            type: String
        },
        noDataText: {
            type: String
        },
        popperClass: {
            type: String
        },
        reserveKeyword: {
            type: Boolean
        },
        defaultFirstOption: {
            type: Boolean
        },
        prefix: {},
        empty: {}
    },
    data() {
        return {
            pinyin: require("pinyin"),
            dealedPersonArr: [],
            filterOption: [],
        }
    },
    computed: {
        personValue: {
            get: function() {
                return this.person;
            },
            set: function(val) {
                this.$emit("update:person", val);
                this.$emit("changePerson", val);
            }
        },
    },
    watch: {
        optionData(newValue) {
            this.getDealedPersonArr(newValue);
        }
    },
    created() {
        this.getDealedPersonArr(this.optionData);
    },
    mounted() {
    },
    methods: {
        //自定义人员搜索为模糊搜索
        filterMethod(filterValue) {
            let filterOption = [];
            if (filterValue == "") {
                filterOption = JSON.parse(JSON.stringify(this.optionData));
            } else {
                //获取正则表达式
                let filterArr = filterValue.toUpperCase().split("");
                let reg = "/";
                for (let i = 0; i < filterArr.length; i++) {
                    if (i != filterArr.length - 1) {
                        reg += filterArr[i] + ".*";
                    } else {
                        reg += filterArr[i];
                    }
                }
                reg += "/g";
                reg = eval(reg);
                if (this.groupOptionKey == undefined) {
                    //选项没有分组
                    //遍历查询
                    for (let i = 0; i < this.dealedPersonArr.length; i++) {
                        let item = this.dealedPersonArr[i];
                        let canShow = this.getItemCanShow(reg, item);
                        let option = JSON.parse(JSON.stringify(this.optionData[i]));
                        option.canShow = canShow;
                        filterOption.push(option);
                    }
                } else {
                    //选项有分组
                    for (let i = 0; i < this.dealedPersonArr.length; i++) {
                        let options = this.dealedPersonArr[i];
                        let newOptions = [];
                        for (let j = 0; j < options.length; j++) {
                            let item = options[j];
                            let canShow = this.getItemCanShow(reg, item);
                            if (canShow) {
                                newOptions.push(this.optionData[i][this.groupOptionKey][j]);
                            }
                        }
                        //如果当前分组下有符合筛选的选项
                        if (newOptions.length > 0) {
                            let group = JSON.parse(JSON.stringify(this.optionData[i]));
                            group[this.groupOptionKey] = newOptions;
                            filterOption.push(group);
                        }
                    }
                }
            }
            this.filterOption = filterOption;
        },

        //获取当前项是否符合筛选条件
        getItemCanShow(reg, item) {
            let canShow = false;
            //匹配value（邮箱）和label（姓名）
            if (item.value.split("@")[0].toUpperCase().match(reg) != null || item.label.toUpperCase().match(reg) != null) {
                canShow = true;
            } else {
                //匹配拼音，因为存在多音字，所以需要循环处理
                for (let j = 0; j < item.pinyin.length; j++) {
                    if (item.pinyin[j].toUpperCase().match(reg) != null) {
                        canShow = true;
                        break;
                    }
                }
            }
            return canShow;
        },

        //获取处理后的带拼音的数据，以及初始化筛选后的人员数据（初始等同于父组件赋予的选项本身）
        getDealedPersonArr(arr) {
            let pinyin = require("pinyin");
            let dealedPersonArr = [];
            //获取处理后的带拼音的数据
            if (this.groupOptionKey == undefined) {
                //如果没有分组
                for (let i = 0; i < arr.length; i++) {
                    let cnName = arr[i][this.cnNameKey];
                    let currentPersonPinyin = pinyin(cnName, { heteronym: true, style: pinyin.STYLE_NORMAL });//.STYLE_NORMAL(普通风格，即不带声调。)
                    let list = {
                        label: cnName,
                        pinyin: this.getPersonPinyin(currentPersonPinyin)
                    }
                    if (this.emailKey != undefined) {
                        list["value"] = arr[i][this.emailKey];
                    } else {
                        list["value"] = "";
                    }
                    dealedPersonArr.push(list);
                }
                this.dealedPersonArr = dealedPersonArr;
                //初始化筛选后的人员数据（初始等同于父组件赋予的选项本身）
                this.filterOption = JSON.parse(JSON.stringify(arr));
            } else {
                //如果有分组
                for (let i = 0; i < arr.length; i++) {
                    //循环所有组别
                    let currentGroupOptions = [];
                    let options = arr[i][this.groupOptionKey];
                    for (let j = 0; j < options.length; j++) {
                        //循环组别下的所有选项
                        let option = options[j];
                        let cnName = option[this.cnNameKey];
                        let currentPersonPinyin = pinyin(cnName, { heteronym: true, style: pinyin.STYLE_NORMAL });//.STYLE_NORMAL(普通风格，即不带声调。)
                        let list = {
                            label: cnName,
                            pinyin: this.getPersonPinyin(currentPersonPinyin)
                        }
                        if (this.emailKey != undefined) {
                            list["value"] = option[this.emailKey];
                        } else {
                            list["value"] = "";
                        }
                        currentGroupOptions.push(list);
                    }
                    dealedPersonArr.push(currentGroupOptions);
                }
                this.dealedPersonArr = dealedPersonArr;
                //初始化筛选后的人员数据（初始等同于父组件赋予的选项本身）
                this.filterOption = JSON.parse(JSON.stringify(arr));
            }
        },

        //将[["ceng","zeng"],["min"],["xia"]]的格式转为["cengminxia","zengminxia"]
        getPersonPinyin(personPinyin) {
            let result = [''];
            let temp = [];
            for (let i = 0; i < personPinyin.length; i++) {
                temp = [];
                let t = personPinyin[i];
                for (let j = 0; j < t.length; j++) {
                    for (var k = 0; k < result.length; k++) {
                        temp.push(result[k] + t[j]);
                    }
                }
                result = temp;
            }
            return result;
        },

        //change
        change(value) {
            this.$emit("change", value)
        },

        //清空筛选
        visibleChange(value) {
            if (value == true) {
                this.filterMethod("");
            }
            this.$emit("visibleChange", value)
        },

        //移除tag
        removeTag(value) {
            this.$emit("removeTag", value)
        },

        //清空选中值
        clear() {
            this.$emit("clear")
        },

        //失去焦点
        blur(event) {
            this.$emit("blur", event)
        },

        //聚焦
        focus(event) {
            this.$emit("focus", event)
        }
    },
}
</script>
<style>
.pinyin-filter-person-select .has-prefix .el-select__tags {
    padding-left: 20px;
    margin-right: 20px;
    box-sizing: border-box;
}
</style>

