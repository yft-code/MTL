<template>
    <div>
        <self-dialog 
            ref="editColumnRef" 
            :dialog-data="{title:'编辑',width:'36rem',confirmName:'确定',closeName:'取消'}" 
            @confirm="confirmEdit">
            <el-form ref="editColumnFormRef" :model="editColumnForm" :show-message="false" label-width="5rem">
                <el-form-item 
                    v-for="(item, index) in editColumnForm.update_cols" 
                    :key="'update' + index" 
                    label="名称" 
                    :prop="'update_cols.' + index + '.col_cn_name'" 
                    :rules="colRule"
                    >
                    <el-input v-model="item.col_cn_name" class="col-name-input"></el-input>
                    <el-button type="danger" size="mini" icon="el-icon-minus" @click="removeColumn(item,index)" circle>
                    </el-button>
                </el-form-item>
                <el-form-item 
                    v-for="(item, index) in editColumnForm.add_cols" 
                    :key="'add'+index" 
                    label="名称" 
                    :prop="'add_cols.' + index + '.col_cn_name'" 
                    :rules="colRule"
                    >
                    <el-input v-model="item.col_cn_name" class="col-name-input"></el-input>
                    <el-button type="danger" size="mini" icon="el-icon-minus" @click="removeNewColumn(index)" circle>
                    </el-button>
                </el-form-item>
                <el-form-item label="">
                    <div class="col-name-input"></div>
                    <el-button type="primary" size="mini" class="circle-icon" icon="el-icon-plus" circle @click="addColumn"></el-button>
                </el-form-item>
            </el-form> 
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
import SelfDialog from "@/components/Common/SelfDialog.vue"
export default {
    components: {
        SelfDialog,
    },
    props: {
        tableName: {}
    },
    data() {
        return {
            editColumnForm: {
                update_cols: [],
                delete_cols: [],
                add_cols: [],
            },
            colRule: [{ required: true, validator: formRule.validateStr, trigger: 'blur' }],

        }
    },
    computed: {
    },
    created() {
        // console.log("pc")
    },
    mounted() {

    },
    methods: {
        //打开编辑模态框
        openEditDialog() {
            this.editColumnForm = {
                update_cols: [],
                delete_cols: [],
                add_cols: [],
            };
            this.getCustomCols();
            this.$refs.editColumnRef.openDialog();
        },

        //获取自定义列
        async getCustomCols() {
            let list = { table_name: this.tableName };
            await this.$codePost("/expertCompatibilityPC/get_custom_cols/", list, { operation: "获取自定义列", failed: true }).then(res => {
                if (res.code == 200) {
                    this.$set(this.editColumnForm, "update_cols", res.data);
                    if (res.data.length == 0) {
                        this.addColumn();
                    }
                }
            })
        },

        //移除已有的列
        removeColumn(item, index) {
            this.editColumnForm.update_cols.splice(index, 1);
            this.editColumnForm.delete_cols.push({ col_name: item.col_name });
        },

        //新增列
        addColumn() {
            this.editColumnForm.add_cols.push({ col_cn_name: "" });
        },

        //移除新增的列
        removeNewColumn(index) {
            this.editColumnForm.add_cols.splice(index, 1);
        },

        //确认修改
        confirmEdit() {
            let hasError = this.$publicJS.checkFormData(this, "editColumnFormRef", "您有必填项未填！");
            if (!hasError) {
                let list = {
                    table_name: this.tableName,
                    edit_data: JSON.stringify(this.editColumnForm),
                }
                this.$codePost("/expertCompatibilityPC/edit_cols/", list, { operation: "编辑列", success: true, failed: true }).then(res => {
                    if (res.code == 200) {
                        this.$emit("afterEdit");
                        this.$refs.editColumnRef.closeDialog();
                    }
                })
            }
        },

    },
}
</script>
<style scoped>
.col-name-input{
    display:inline-block;
    width: calc(95% - 40px);
    margin-right:10px;
}
.el-icon-minus{
    background-color:#ff557d;
    padding:0.3rem;
    font-weight:bold;
    font-size:1rem;
}
</style>
