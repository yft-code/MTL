<template>
    <div>
        <self-dialog 
            ref="compareRef" 
            :dialog-data="{ title: '编辑对比策略', width: '45%', closeName: '关闭' }" 
            style="text-align: left;"
            @close="compareDialogClose">
                <div style="width: 80%; margin: auto;">
                    <div>
                        <span class="title-div">当前测试名称：</span>
                        <span v-if="!edit">{{ tableName }}</span>
                        <el-input ref="tableNameRef" v-if="edit" v-model="tableName" style="width: 60%; display:inline-block;"></el-input>
                        <i class="el-icon-edit" v-if="!edit" style="cursor:pointer; margin-left: 5px;" @click="edit=!edit"></i>
                        <i class="el-icon-error" v-if="edit" style="cursor:pointer; margin-left: 5px;" @click="edit=!edit"></i>
                        <i class="el-icon-success" v-if="edit" style="cursor:pointer; margin-left: 5px;" @click="editDisplayName"></i>
                    </div> 
                    <!-- 选择对比记录 -->
                    <div class="order-div">
                        <span class="title-div">选择对比记录</span>
                        <el-select v-model="selectCompareList" @change="addCompareRecord" placeholder="选择对比记录" filterable multiple class="corpselect" :popper-append-to-body="false" style="width: 70%; margin-left: 10px;">
                            <el-option v-for="item,index in oldRecordList" :label="item.name" :value="item.id" :key="index">{{ item.name }}</el-option>
                        </el-select>
                        <!-- <el-button type="primary" size="mini" @click="addCompareRecord" style="margin-left: 5px;">确认</el-button> -->
                    </div>

                    <!-- <div class="order-div">
                        <span class="title-div">选择对比策略</span>
                        <el-select v-model="selectCompareList" placeholder="选择对比记录" filterable multiple class="corpselect" :popper-append-to-body="false" style="width: 70%; margin-left: 10px;">
                            <el-option v-for="item,index in oldRecordList" :label="item.name" :value="item.id" :key="index">{{ item.name }}</el-option>
                        </el-select>
                        <el-button type="primary" size="mini" @click="addCompareRecord" style="margin-left: 5px;">确认</el-button>
                    </div> -->

                    <div v-if="comparerecordList && comparerecordList.length > 0" class="order-div">
                        <div class="title-div">已选择</div>
                        <div v-for="item,k in comparerecordList" :key="k" style="margin-left: 20px; margin-bottom: 5px;"><el-tag closable @close="deleteCompareRecord(item)">{{item.display_name || item.test_name}}</el-tag></div>
                    </div>

                    <!-- 选择对比策略 -->
                    <div class="order-div">
                        <span class="title-div">选择对比策略</span>
                        <el-select v-model="compareStratege" @change="updateOrder" placeholder="选择对比策略" style="margin-left: 10px;">
                            <el-option v-for="item,index in contrastStrategies" :key="index" :value="item.label" :label="item.value">{{ item.value }}</el-option>
                        </el-select>
                    </div>
                    
                    <!-- 设备顺序 -->
                    <div class="order-div">
                        <div class="title-div">设备顺序</div>
                        <draggable v-model="deviceOrder" tag="ul" class="order-drag" @change="updateDeviceOrder">
                            <li v-for="(item, index) in deviceOrder" :key="index" class="li-item">
                                <el-tag>{{ item }}</el-tag>
                                <!-- {{ item }} -->
                            </li>
                        </draggable>
                    </div>


                    <!-- 场景顺序 -->
                    <div class="order-div">
                        <div class="title-div">场景顺序</div>
                        <draggable v-model="sceneOrder" tag="ul" class="order-drag" @change="updateSceneOrder">
                            <li v-for="(item, index) in sceneOrder" :key="index" class="li-item">
                                <el-tag>{{ item }}</el-tag>
                                <!-- {{ item }} -->
                            </li>
                        </draggable>
                    </div>

                    <!-- 组别顺序 -->
                    <div class="order-div">
                        <div class="title-div">组别顺序</div>
                        <draggable v-model="classOrder" tag="ul" class="order-drag" @change="updateClassOrder">
                            <li v-for="(item, index) in classOrder" :key="index" class="li-item">
                                <el-tag>{{ item }}</el-tag>
                                <!-- {{ item }} -->
                            </li>
                        </draggable>
                    </div>
                </div>

        </self-dialog>
    </div>
</template>

<script>
import formRule from "@/utils/formRule.js"
import draggable from 'vuedraggable'
export default {
    components: {
        draggable
    },
    data() {
        return {
            selectCompareList:[],
            deviceOrder: [],
            sceneOrder: [],
            classOrder: [],
            tableName: '',
            edit: false,
            oldRecordList: [],
            comparerecordList: [],
            compareData: {},
            compareStratege: "",
        }
    },
    computed:{
        contrastStrategies(){
            return this.$store.getters.getConTrastStrategies
        }
    },
    created() {
        this.getCompareData()
    },
    props: {
        axiosList: {},
    },
    methods: {
        getCompareData(){
            this.$codePost("/mobilePerfTest/get_compare_set/", {id: this.$route.query.id}).then(res => {
                if(res.code == "200"){
                    this.compareData = res.data
                    this.initData()
                }
            })
        },
        handleEditClick(){
            this.edit = !this.edit
            this.$nextTick(() => {
                this.$refs.tableNameRef.focus()
            })
        },
        editDisplayName(){
            let list = {
                id: this.axiosList.id,
                display_name: this.tableName
            }
            this.$codePost('/service/update_application_process/', list, {operation: '编辑测试名称', success: true, failed: true}).then(res => {
                if (res.code == 200) {
                    this.edit = !this.edit
                }
            })
        },
        updateDeviceOrder(val){
            this.swapArray(this.deviceOrder.slice(0),val.moved.newIndex,val.moved.oldIndex)
            this.updateOrder()
        },
        updateSceneOrder(val){
            this.swapArray(this.sceneOrder.slice(0),val.moved.newIndex,val.moved.oldIndex)
            this.updateOrder()
        },
        updateClassOrder(val){
            this.swapArray(this.classOrder.slice(0),val.moved.newIndex,val.moved.oldIndex)
            this.updateOrder()
        },

        // 列表元素交换位置
        swapArray(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            // return arr;
        },

        // 更新排序
        updateOrder(){
            let list = {
                id: this.axiosList.id,
                device_order: this.deviceOrder.join(','),
                scene_order: this.sceneOrder.join(','),
                record_order: this.classOrder.join(','),
                compare_set: this.compareStratege ? this.compareStratege : ""
            }
            this.$codePost("/mobilePerfTest/update_compare_set/", list)
        },

        compareDialogClose(){
            this.selectCompareList = []
        },

        addCompareRecord(){
            // console.log(this.selectCompareList)
            if(this.selectCompareList.length == 0){
                return
            }
            this.editCompareRecord()
        },

        editCompareRecord(){
            let id_list = []
            this.comparerecordList.forEach(item => {
                id_list.push(item.id)
            })
            id_list = id_list.concat(this.selectCompareList)
            let list = {
                id: this.axiosList.id,
                compare_ids: id_list.join(',')
            }
            this.$codePost("/mobilePerfTest/update_compare_set/", list, { operation: "修改对比记录", failed: true }).then(res => {
                if (res.code == 200) {
                    this.getCompareData()
                }
            })
        },

        openDialog(){
            // console.log(this.contrastStrategies)
            this.$refs.compareRef.openDialog();
        },

        initData(){
            // console.log(this.compareData)
            // 对比策略
            this.compareStratege = this.compareData.data[0].compare_set ? this.compareData.data[0].compare_set : ""
            this.deviceOrder = this.compareData.data[0].device_order ? this.compareData.data[0].device_order.split(','): this.compareData.device
            this.sceneOrder = this.compareData.data[0].scene_order ? this.compareData.data[0].scene_order.split(','): this.compareData.scene
            this.classOrder = this.compareData.data[0].record_order ? this.compareData.data[0].record_order.split(','):this.compareData.class
            this.tableName = this.compareData.display_name
            // 当前已选的对比记录
            this.comparerecordList = this.compareData.select_compare_data
            // 当前已选对比记录的id
            let selectIdList = this.comparerecordList.map(item => {
                return item.id
            })
            // 去除但钱id和已选id的记录
            this.oldRecordList = this.compareData.compare_data.filter(item => {
                return item.id != this.$route.query.id && selectIdList.indexOf(item.id) == -1
            })
            this.selectCompareList = []
        },

        deleteCompareRecord(item){
            let confirmText = "确定删除【<b>"
            if(item.display_name){
                confirmText += item.display_name + "</b>】吗？"
            }else{
                confirmText += item.test_name + "</b>】吗？"
            }
            this.$selfConfirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
                let id_list = []
                this.comparerecordList.forEach(record => {
                    if(item.id != record.id){
                        
                        id_list.push(record.id)
                    }
                })
                let list = {
                    id: this.axiosList.id,
                    compare_ids: id_list.join(',')
                }
                this.$codePost("/mobilePerfTest/update_compare_set/", list, { operation: "修改对比记录", failed: true }).then(res => {
                    if (res.code == 200) {
                        this.getCompareData()
                    }
                })
            }).catch(() => { });
        },
    },
}
</script>

<style scoped>
.corpselect {
    width: 95%;
}
/deep/ .el-select__tags-text {
    display: inline-block;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
/deep/ .el-select .el-tag__close.el-icon-close {
    top: -7px;
}
.li-item{
    cursor:pointer; 
    display: inline-block; 
    margin-right: 20px;
}
.order-div{
    margin-top: 20px;
}
.title-div{
    font-size: 16px;
}
.order-drag{
    margin-top: 10px;
    margin-left: 20px;
}
</style>