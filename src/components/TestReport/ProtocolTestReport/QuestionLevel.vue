<template>
    <div>
        <div style="margin-bottom:1rem;display:flex;">
            <div>
                <span class="title-span">评级说明</span>
            </div>
        </div>
        <div style="margin-bottom:1rem;">
            <div class="level-item" v-for="item, index in qLevelList" :key="index">
                <el-tag :class="tagClass(item)" style="color:white;border-radius:50%; text-align: center;">{{item.value}}</el-tag>
                <span class="content-span">{{item.content}}</span>
            </div>
            <div class="note-div">注：功能性问题会影响本次测试的所有设备，但是不影响评分结果</div>
        </div>    
    </div>
</template>

<script>
export default {
    computed: {
        isPreview() {
            if (this.$route.query.isPreview != undefined && this.$route.path == "/mtl_test_platform/page/compatibilityTestReport") {
                return this.$route.query.isPreview;
            } else {
                return 0;
            }
        }
    },
    data() {
        return {
            qLevelList: [
                {
                    label: "立刻",
                    value: "P0",
                    content: "影响非常严重，例如，服务器崩溃卡死等影响范围广的问题；刷道具刷金等玩家可以获得额外收益的问题。",
                },
                {
                    label: "紧急",
                    value: "P1",
                    content: "影响严重，非常影响游戏体验，例如，数据损坏，客户端崩溃/卡死的问题；CD、距离等影响游戏平衡的问题。",
                },
                {
                    label: "高",
                    value: "P2",
                    content: "影响较严重，但可正常游戏，例如，突破游戏限制但不影响游戏平衡；泄漏游戏功能；游戏报错；敏感词等问题。",
                },
                {
                    label: "普通",
                    value: "P3",
                    content: "影响一般，对玩家基本没有影响，例如，参数不匹配；提示类问题；描述错误；轻微的UI错误等问题。",
                },
                {
                    label: "低",
                    value: "P4",
                    content: "建议级别，例如，测试人员的一些建议；疑似问题记录等。",
                },
            ]
        }
    },
    methods: { 
        jumpPage() {
            let pdfUrl = 'http://mtl-compatibility.leihuo.netease.com:8015/apis/site_media/file/compatibilityTest/rating_description.pdf'
            let version = new Date()
            version = version.getTime();
            window.open(pdfUrl + '?v=' + version, '_blank');
        },
        tagClass(item){
            if(item.value === 'P0') return 'tag-1'
            else if(item.value === 'P1') return 'tag-2'
            else if(item.value === 'P2') return 'tag-3'
            else if(item.value === 'P3') return 'tag-4'
            else if(item.value === 'P4') return 'tag-5'
        }
    }
}
</script>

<style lang="less" scoped>
.tag-1 {
    background-color: red;
}
.tag-2 {
    background-color: #ff355f;
}
.tag-3 {
    background-color: #e6a23c;
}
.tag-4 {
    background-color: #4876f2;
}
.tag-5 {
    background-color: #909399;
}
.title-span {
    height: 30px;
    width: 65px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    display: inline-block;
    border-bottom: 3px solid #4E7AF2;
}
.level-item {
    margin: 5px 0;
    img {
        vertical-align: middle;
        margin-right: 10px;
    }
    span {
        color: #333333;
    }
} 
.content-span {
    margin-left: 8px;
    font: 14px 'Microsoft YaHei';
    color: #333333;
}
.note-div {
    margin-left: 41px;
    font: 14px 'Microsoft YaHei';
    color: #303133;
}
</style>