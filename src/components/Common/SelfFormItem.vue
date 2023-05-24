<template>
    <el-form-item class="self-form-item" :label="formItem.label" :prop="formItem.name" :class="formItem.class">
        <el-input
            v-if="formItem.type == 'input'"
            v-model="value" 
            :placeholder="formItem.placeholder"
            clearable
            >
        </el-input>
        <el-select
            v-else-if="formItem.type == 'select'"
            v-model="value" 
            :placeholder="formItem.placeholder"
            @change="changeValue"
            clearable
            >
            <el-option 
                v-for="(item,index) in formItem.options" 
                :key="index" 
                :value="item[formItem.valueKey]" 
                :label="item[formItem.labelKey]">
            </el-option>
        </el-select>
        <el-date-picker
            v-else-if="formItem.type == 'date'"
            v-model="value" 
            :placeholder="formItem.placeholder"
            type="date"
            clearable
            value-format="yyyy-MM-dd"
            >
        </el-date-picker>
        <self-cascader 
            v-else-if="formItem.type == 'cascader'"
            :placeholder="formItem.placeholder"
            :select-value.sync="value"
            :options="formItem.options"
            :valueKey="formItem.valueKey"     
            @change="changeValue"                              
            />
        <self-person-select 
            v-else-if="formItem.type == 'personSelect'"
            :person.sync="value" 
            :option-data="formItem.options" 
            :email-key="formItem.emailKey"
            :cn-name-key="formItem.cnNameKey"
            clearable
            >
            <template slot-scope="personSelect">
                <el-option 
                    v-for="(item,index) in personSelect.option" 
                    :key="index" 
                    v-if="item.canShow != false"
                    :value="item[formItem.valueKey]" 
                    :label="item[formItem.cnNameKey]">
                </el-option>
            </template>
        </self-person-select> 
        <self-rich-editor 
            v-else-if="formItem.type == 'richEditor'"
            :can-upload-pic="formItem.canUploadPic"   
            :value.sync="value" 
            style="color:black;" 
            />
        
    </el-form-item>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
        }
    },
    props: {
        formItem: {},
        formValue: {},
    },
    computed: {
        value: {
            get: function() {
                return this.formValue;
            },
            set: function(val) {
                this.$emit("update:formValue", val);
            }
        }
    },
    mounted() {

    },
    methods: {
        //change事件
        changeValue() {
            this.$emit("change");
        },
    },
}
</script>
<style scoped>

</style>
<style>
.self-form-item .el-select,
.self-form-item .el-date-editor{
    width:100% !important;
}
</style>
