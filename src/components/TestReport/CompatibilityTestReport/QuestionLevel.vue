<template>
    <div>
        <div style="margin-bottom:1rem;display:flex;">
            <div>
                <span class="title-span">评级说明</span>
            </div>
            <!-- <div v-if="!isPreview" style="margin-left: 10px;line-height: 25px;">
                <a @click="jumpPage">点击查看</a>
            </div> -->
        </div>
        <div style="margin-bottom:1rem;">
            <div class="level-item" v-for="item, index in qLevelList" :key="index">
                <!-- <el-tag :class="tagClass(item)" style="color:white;border-radius:50%;width:45px; text-align: center;">{{item.label}}</el-tag> -->
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
                    content: "会造成破坏性后果，导致多个职能工作无法正常进行如会引起editor崩溃、打包失败等",
                },
                {
                    label: "紧急",
                    value: "P1",
                    content: "会造成破坏性后果，导致游戏主流程、QA测试无法进行如明确的崩溃、导致QA无法继续测试流程的BUG",
                },
                {
                    label: "高",
                    value: "P2",
                    content: "存在于该系统主流程用例中，明显的功能性BUG；普通玩家正常体验就会遇到，且主观认定是BUG未提及为后续优化补全内容的复现概率较高的",
                },
                {
                    label: "普通",
                    value: "P3",
                    content: "功能性、或明显的表现类BUG，出现后不会对游戏流程造成影响，可以继续游戏，后果严重但复现概率较低，一般游戏体验较少遇到",
                },
                {
                    label: "低",
                    value: "P4",
                    content: "影响较轻微、很难注意到的，后续有优化计划留bug单备忘的",
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