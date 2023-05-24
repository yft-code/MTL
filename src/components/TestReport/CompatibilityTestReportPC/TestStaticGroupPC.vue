<template>
    <div v-loading="loading" style="margin-bottom:15px;margin-top: 15px;">
        <div v-for="v,k,index in displayName" :key="index" class="type-item" v-if="staticData[k]">
            <div class="type-title">{{v}}</div>
            <div class="type-content">
                <span v-for="item,key,i in staticData[k]" :key="index+'_'+i" style="display: inline-block;">
                    <span v-if="item=='通过'" style="margin-right: 20px;">{{key}}√</span>
                    <span v-else style="color:red; margin-right: 20px;">{{key}}×</span>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        axiosList: {
            required: true,
            type: Object
        },
        displayName: {
            required: true,
        }
    },
    data() {
        return {
            loading: 'true',
            staticData: '',
            currentName: "os",
            tableData: "",
            listData: "",
            colNum: 0,
        }
    },
    created() {
        this.getStaticData()
    },
    watch: {
    },
    mounted(){

    },
    methods: {
        // 获取设备的统计数据
        getStaticData(){
            let list = JSON.parse(JSON.stringify(this.axiosList));

            this.$codePost("/expertCompatibilityPC/expert_test_terminal_static/", list, { operation: "获取统计数据", failed: true }).then(res => {
                if (res.code == 200) {
                    // console.log(res.data)
                    // console.log(this.displayName)
                    this.staticData = res.data
                    this.tableData = this.staticData[this.currentName]
                    this.handleDicToArr(this.tableData)
                    this.loading = false
                }
            })
        },

        handleDicToArr(data){
            this.listData = []
            for (var v in data){
                this.listData.push(v + "：" + data[v])
            }
            this.colNum = Math.ceil(this.listData.length / 4)
            // console.log(this.colNum)
        },

        // 处理点击分析项按钮
        handleChooseClick(name){
            this.currentName = name
            this.tableData = this.staticData[this.currentName]
            this.handleDicToArr(this.tableData)
        },
    }
}
</script>

<style lang="less" scoped>
.btn-group {
    margin-top: 15px;
    text-align: center;
    .el-button {
        margin-left: 10px;
    }
}
.passCss {
    color: blue;
}
.failCss {
    color: red;
}
.type-item {
    margin-top: 1rem;
    width: 95%;
    margin-left: 4rem;
    font-size: 16px;
    margin-bottom: 1rem;
    color: #666666;
}
.type-item .type-title {
    width: 8rem;
    margin-right: 0.5rem;
    font-weight: bold;
    vertical-align: top;
    display: inline-block;
}
.type-item .type-content {
    width: 90%;
    vertical-align: top;
    display: inline-block;
}
.status-div {
    display: flex;
    direction: row;
    margin-bottom: 10px;
    height: 20px;
    line-height: 20px;
    justify-content: flex-end;
    margin-right: 10%;
}
</style>