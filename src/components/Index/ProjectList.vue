<template>
    <div class="project-list">
        <div class="project-list-title">已支持项目</div>
        <vue-marquee 
            class="project-list-content" 
            direction="left"
            :showProgress="false"
        >
            <div class="left-opacity"></div>
            <vue-marquee-slide
                v-for="(item, index) in projectListData"
                :key="index"
                class="project-item"
            >
                <img :src="item.icon">
                <div style="margin-top: 12px">{{item.label}}</div>
            </vue-marquee-slide>
            <div class="right-opacity"></div>
        </vue-marquee>
    </div>
</template>

<script>
    export default {
        components: {
        },
        data() {
            return {
                projectListData: [
                    {
                        "label": "仓颉",
                        "id": "cangjie",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/cangjie.png?t=1653143216"
                    },
                    {
                        "label": "天音",
                        "id": "cm",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/cm.png?t=1653143216"
                    },
                    {
                        "label": "新倩女幽魂",
                        "id": "d10",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/d10.png?t=1653143216"
                    },
                    {
                        "label": "倩女互通版",
                        "id": "d10h",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/d10h.png?t=1653143216"
                    },
                    {
                        "label": "倩女口袋版",
                        "id": "d10p",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/d10p.png?t=1653143216"
                    },
                    {
                        "label": "逆水寒",
                        "id": "d30",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/d30.png?t=1653143216"
                    },
                    {
                        "label": "匣中逆水寒",
                        "id": "d30p",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/d30p.png?t=1653143216"
                    },
                    {
                        "label": "超激斗梦境",
                        "id": "d41",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/d41.png?t=1653143216"
                    },
                    {
                        "label": "归唐",
                        "id": "dj01",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/dj01.png?t=1653143216"
                    },
                    {
                        "label": "瑶台",
                        "id": "fu351",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/fu351.png?t=1653143216"
                    },
                    {
                        "label": "伏羲全员日报组",
                        "id": "fuxi",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/fuxi.png?t=1653143216"
                    },
                    {
                        "label": "倩女幽魂手游",
                        "id": "l10",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/l10.png?t=1653143216"
                    },
                    {
                        "label": "流星群侠传",
                        "id": "l12",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/l12.png?t=1653143216"
                    },
                    {
                        "label": "风云岛行动",
                        "id": "l17",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/l17.png?t=1653143216"
                    },
                    {
                        "label": "倩女幽魂隐世录",
                        "id": "l18",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/l18.png?t=1653143216"
                    },
                    {
                        "label": "遇见逆水寒",
                        "id": "l20",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/l20.png?t=1653143216"
                    },
                    {
                        "label": "永劫无间",
                        "id": "l22",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/l22.png?t=1653143216"
                    },
                    {
                        "label": "永劫无间手游",
                        "id": "l22sy",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/l22sy.png?t=1653143216"
                    },
                    {
                        "label": "Fplus",
                        "id": "l26",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/l26.png?t=1653143216"
                    },
                    {
                        "label": "绝对演绎",
                        "id": "l30",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/l30.png?t=1653143216"
                    },
                    {
                        "label": "逆水寒手游",
                        "id": "l36",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/l36.png?t=1653143216"
                    },
                    {
                        "label": "潮人篮球",
                        "id": "lh01",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/lh01.png?t=1653143216"
                    },
                    {
                        "label": "洪荒文明",
                        "id": "lh2",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/lh2.png?t=1653143216"
                    },
                    {
                        "label": "漫威对决",
                        "id": "lh3",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/lh3.png?t=1653143216"
                    },
                    {
                        "label": "妖与秋梁",
                        "id": "lx10",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/lx10.png?t=1653143216"
                    },
                    {
                        "label": "NBA篮球",
                        "id": "lx33",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/lx33.png?t=1653143216"
                    },
                    {
                        "label": "光与影",
                        "id": "mini09",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/mini09.png?t=1653143216"
                    },
                    {
                        "label": "子龙救我",
                        "id": "mini20210706",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/mini20210706.png?t=1653143216"
                    },
                    {
                        "label": "热气球乱斗",
                        "id": "minirqq",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/minirqq.png?t=1653143216"
                    },
                    {
                        "label": "UNO App",
                        "id": "mn01",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/mn01.png?t=1653143216"
                    },
                    {
                        "label": "phase10",
                        "id": "mn02",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/mn02.png?t=1653143216"
                    },
                    {
                        "label": "Skip-Bo",
                        "id": "mn04",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/mn04.png?t=1653143216"
                    },
                    {
                        "label": "天谕手游",
                        "id": "pm02",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/pm02.png?t=1653143216"
                    },
                    {
                        "label": "忘川风华录",
                        "id": "pm03",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/pm03.png?t=1653143216"
                    },
                    {
                        "label": "天谕",
                        "id": "ty",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/ty.png?t=1653143216"
                    },
                    {
                        "label": "UNO H5",
                        "id": "uno",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/uno.jpg?t=1653143216"
                    },
                    {
                        "label": "UNO 国服",
                        "id": "uno_cn",
                        "icon": "http://qa.leihuo.netease.com:9714/static/icon/uno_cn.png?t=1653143216"
                    }
                ]
            }
        },
        props: {
        },
        create(){
        },
        mounted() {
        },
        computed:{
        },
        watch:{
        },
        methods: {
        },
    }
</script>
<style scoped>
.project-list {
    width: 100%;
    padding-top: 80px;
    background: #fff;
}
.project-list-title {
    text-align: center;
    color: #333333;
    font-size: 32px;
}
.project-list-content {
    position: relative;
    margin-top: 40px;
    height: 158px !important;
    padding: 38px 50px 0 50px;
    overflow: hidden;
    white-space: nowrap;
    background: rgb(17, 33, 128, 0.8);
    text-align: center;
}
/* .left-opacity {
    position: absolute;
    left: 0;
    top: 0;
    width: 50px;
    height: 100%;
    background: linear-gradient(
        to left,
        rgba(21, 110, 239, 0) 0%,
        rgba(21, 110, 239, 0.3) 30%,
        rgba(21, 110, 239, 0.7) 60%,
        rgba(21, 110, 239, 1) 100%);
    z-index: 1;
}
.right-opacity {
    position: absolute;
    right: 0;
    top: 0;
    width: 50px;
    height: 100%;
    background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 30%,
        rgba(255, 255, 255, 0.7) 60%,
        rgba(255, 255, 255, 1) 100%);
    z-index: 1;
} */
.project-item {
    padding-left: 40px;
    text-align: center;
}
.project-item img {
    height: 78px;
    width: 78px;
    border-radius: 40px;
    overflow: hidden;
}
</style>
<style>
</style>