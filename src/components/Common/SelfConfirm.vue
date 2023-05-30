<template>
    <div>
        <el-dialog
            class="public-model self-confirm" 
            width="25rem"
            :title="title" 
            :visible.sync="visible" 
            :close-on-click-modal="false" 
            @close="handleAction('cancel')"
        >
            <div class="tip-content">
                <i class="el-icon-warning-outline confirm-icon"></i>
                <span v-html="content"></span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button 
                    type="primary" 
                    size="small" 
                    @click="handleAction('confirm')"
                >
                    {{ confirmButtonText }}
                </el-button>
                <el-button 
                    size="small" 
                    @click="visible = false"
                >
                    {{ cancelButtonText }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            title: '',
            content: '',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            promiseStatus: null,
        }
    },
    watch: {
    },
    methods: {
        confirm() {
            let _this = this;
            this.visible = true;
            return new Promise(function(resolve, reject) {
                _this.promiseStatus = { resolve, reject };
            });
        },
        
        handleAction(action) {
            this.visible = false;
            if (action == 'confirm') {
                this.promiseStatus.resolve();
            } else {
                this.promiseStatus.reject();
            }
        }
    }
}
</script>
<style scoped>
.tip-content {
    text-align:center;
}

.public-model>>>.el-dialog__header {
    text-align:center;
}

</style>