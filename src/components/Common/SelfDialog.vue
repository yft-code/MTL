<template>
    <el-dialog
        class="public-model"
        :width="dialogData.width"
        :top="dialogData.top||'15vh'" 
        :title="dialogData.title" 
        :visible.sync="dialogFlag" 
        :close-on-click-modal="false"  
        :modal-append-to-body="dialogData.modalAppendToBody != undefined ? dialogData.modalAppendToBody : true"
        @close="closeDialog"
    >
        <slot v-if="dialogFlag"></slot>
        <span slot="footer" class="dialog-footer">
            <el-button 
                v-if="dialogData.saveName" 
                size="small" 
                @click="save"
            >
                {{ dialogData.saveName }}
            </el-button>
            <el-button 
                v-if="dialogData.confirmName" 
                type="primary" 
                size="small" 
                @click="confirm"
            >
                {{ dialogData.confirmName }}
            </el-button>
            <!--关闭按钮的操作必须写成dialogFlag=false，而不是直接调用closeDialog事件，否则closeDialog之后，会触发@close=closeDialog，导致事件二次触发-->
            <el-button 
                v-if="dialogData.closeName" 
                size="small" 
                @click="closeDialog"
            >
                {{dialogData.closeName}}
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialogFlag:false,
        }
    },
    props: {
        dialogData:{}

    },
    computed: {

    },
    mounted() {

    },
    components: {
    },
    methods: {
        openDialog(){
            this.dialogFlag = true;
        },
        //确定
        confirm(){
            this.$emit("confirm");
        },
        save(){
            this.$emit("save");
        },
        closeDialog(){
            this.$emit("close");
            this.dialogFlag = false;
        },
    },
    
    watch: {

    }
}
</script>
