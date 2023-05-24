<template>
    <div style="backgroundColor: #f3f4f6; padding: 15px;">
        <b>对比情况</b>
        <span>
            <el-tooltip effect="dark" 
                placement="right">
                <div slot="content">
                    变动范围在10%以内，备注无明显波动；≥10%，则根据各项指数标注<span class="red">红色</span>或<span class="green">绿色</span>变动，
                    <span class="red">红色</span>为性能变劣，<span class="green">绿色</span>为性能变优，其中内存、CPU、GPU升高为<span class="red">红色</span>，
                    降低为<span class="green">绿色</span>，帧率升高为<span class="green">绿色</span>，降低为<span class="red">红色</span>。
                </div>
                <i class="el-icon-info" style="color:#606266;margin-left:3px"><b>对比说明  </b></i>
            </el-tooltip>
        </span>
        <div v-for="msg,i in message" :key="i" style="margin-left: 12px;">
            <el-row>
              <el-col :span="3.5" style="margin-top: 5px; text-align:center;" v-if="msg.value.length > 0"><span>{{msg.label}}版本：</span></el-col>
              <el-col :span="20">
                <span v-for="item,k in msg.value" :key="i+'_'+k" class="msg-detail-span">
                    <span v-if="item.indexOf('帧数') !== -1">
                        <span v-if="item.indexOf('降低') !== -1">{{item.split('降低')[0]}}<b> 降低 </b>{{item.split('降低')[1]}}；</span>
                        <span v-else-if="item.indexOf('升高') !== -1">{{item.split('升高')[0]}}<b> 升高 </b>{{item.split('升高')[1]}}；</span>
                    </span>
                    <span v-else-if="item.indexOf('帧率') !== -1">
                        <span v-if="item.indexOf('降低') !== -1">{{item.split('降低')[0]}}<b style="color: red;"> 降低 </b>{{item.split('降低')[1]}}；</span>
                        <span v-else-if="item.indexOf('升高') !== -1">{{item.split('升高')[0]}}<b style="color: green"> 升高 </b>{{item.split('升高')[1]}}；</span>
                    </span>
                    <span v-else-if="item.indexOf('降低') !== -1">{{item.split('降低')[0]}}<b style="color: green;"> 降低 </b>{{item.split('降低')[1]}}；</span>
                    <span v-else-if="item.indexOf('升高') !== -1">{{item.split('升高')[0]}}<b style="color: red;"> 升高 </b>{{item.split('升高')[1]}}；</span>
                </span>
              </el-col>
            </el-row>
        </div>
    </div>
</template>
<script> 
export default {
    components: {

    },
    data() {
        return {
            message: [],
        }
    },
    props: {
        compareMessageData: {},
    },
    computed: {

    },
    created() {
        
    },
    mounted(){
        this.handleCompareMessage()
    },
    methods: {
        handleCompareMessage(){
            let message = []
            if(this.compareMessageData.length !== 0){
                this.compareMessageData.forEach(element => {
                    if(element.msg.length !== 0){
                        message.push({
                            label: element.key,
                            value: element.msg
                        })
                    }
                });
            }
            this.message = message
        }
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
