<template>
    <div>
        <el-cascader
            v-model="value" 
            :options="dealOptions"
            :key="cascaderKey"
            :props="{ children: 'children', value: valueKey ? valueKey : 'label', label: 'label', emitPath: false, expandTrigger: 'hover' }"
            :show-all-levels="false" 
            :filter-method="filterMethodCustomize" 
            filterable
            :popper-class="popperClass"
            :placeholder="placeholder"
            @change="changeValue"
            :clearable="clearable"
            style="width:100%"
        >
        </el-cascader>
    </div>
</template>
 
<script>
export default {
    props: {
        selectValue: {},
        valueKey: {},
        options: {},
        popperClass: {},
        placeholder: {},
        clearable: {},
    },
    computed: {
        value: {
            get: function() {
                return this.selectValue;
            },
            set: function(val) {
                this.$emit('update:selectValue', val)
            }
        },
        dealOptions: {
            get: function() {
                if (this.options == undefined) {
                    return [];
                } else {
                    let options = this.options.map((value, index) => {
                        let item = {
                            label: value.label + " ",
                            children: JSON.parse(JSON.stringify(value.children))
                        }
                        return item;
                    })
                    return options;
                }

            },
        }
    },
    watch: {
        //cascaderKey很重要，选项发生变化时cascader会报错，加上key就不会报错
        options(newValue, oldValue) {
            this.cascaderKey++;
        }
    },
    data() {
        return {
            cascaderKey: 1
        };
    },
    created() {
    },
    methods: {
        //自定义项目组搜索为不区分大小写
        filterMethodCustomize(node, keywords) {
            let result = false;
            if (node.text.toUpperCase().indexOf(keywords.toUpperCase()) !== -1) {
                result = true;
            }
            return result;
        },
        
        changeValue(val) {
            this.$emit("change", val);
        },

    }
};
</script>
<style scoped>

</style>
<style>

</style>


