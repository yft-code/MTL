<template>
    <div>
        <self-dialog 
            ref="transferMissionRef" 
            :dialog-data="{ title: '转单', width: '35%', confirmName: '确认', closeName: '取消' }" 
            style="text-align: left;"
            @confirm="confirmTransferMission"
            >
            <div class="split-card form-card">
                <!-- {{ scene }}
                {{ device }} -->
                将【{{ device.device + '(' + device.device_name + ')' }}{{ scene && scene.scene_name ? '-'+scene.scene_name : '' }}】
                {{ scene && scene.scene_name ? '' : '下所有' }}任务转给
                
                <el-select v-model="test_qa" placeholder="请选择">
                    <el-option
                    v-for="item in testerOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </self-dialog>
    </div>
</template>
<script>
import formRule from "@/utils/formRule.js"
export default {
    components:{
    },
    data(){
        return {
            scene: {},
            device: {},
            test_qa: '',
        }
    },
    props:{
        testerOption: {},
    },
    computed: {
        
    },
    created(){
    },
    methods: {
        openDialog(scene, device){
            // console.log(scene, device);
            this.scene = scene;
            this.device = device;
            this.$refs.transferMissionRef.openDialog();
        },

        confirmTransferMission(){
            let list = {
                id_list: this.scene && this.scene.scene_name ? JSON.stringify([this.scene.id]) : JSON.stringify(this.device.scene.map(item => item.id)),
                application_id: this.$route.query.id,
                test_qa: this.test_qa,
                // device_name: this.device.device_name,
            }
            this.$codePost("/mobilePerfTest/update_test_scene/", list, {operation: "转单", success:true, failed: true}).then(res => {
                this.$emit("afterTransferMission")
                this.$refs.transferMissionRef.closeDialog();
                this.initData()
            })
        },

        initData(){
            this.test_qa = '';
            this.device = {}
            this.scene = {}
        }
    }
}
</script>
<style scoped>
.split-card {
    display: inline-block;
    vertical-align: top;
}

.form-card {
    width: 98%;
    margin-right: 2%;
    text-align: center;
}

</style>