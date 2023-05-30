<template>
    <div class="document-center">
        <div class="banner-div">
            <img :src="bannerSrc" style="width: 100%;">
        </div>
        <div class="document-center-container">
            <div class="left-sidebar">
                <el-menu 
                    :default-active="activeMenu" 
                    :collapse="isCollapse"
                >
                    <el-submenu
                        v-for="(item, index) in documentData"
                        :key="index"
                        :index="String(index)"
                    >
                        <template slot="title">
                            <img :src="item.icon">
                            <span slot="title" style="margin-left: 8px">{{item.label}}</span>
                        </template>
                        <el-menu-item-group>
                            <a 
                                v-for="(childrenItem, childrenIndex) in item.children"
                                :key="childrenItem.label"
                                class="text-href" 
                                :href="'#' + childrenItem.value" 
                                @click="changeActive(item.children, childrenIndex)"
                            >
                                <el-menu-item :index="String(index) + '-' + String(childrenIndex)">
                                    {{childrenItem.label}}
                                </el-menu-item>
                            </a>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </div>
            <div class="document-center-content">
                <div
                    v-for="item in documentData"
                    :key="item.label"
                    class="service-item"
                >
                    <div class="service-item-title">{{item.label}}</div>
                    <div class="service-item-content">
                        <div
                            v-for="documentItem in item.children"
                            :key="documentItem.label"
                            class="document-item"
                            :id="documentItem.value"
                        >
                            <img class="document-item-img" :src="documentItem.icon">
                            <div class="document-item-content">
                                <div class="document-title" :class="documentItem.active ? 'active-title' : ''">{{documentItem.label}}</div>
                                <div class="document-link-div">
                                    <a :href="documentItem.documentUrl" target="_blank">使用说明</a>
                                    <div class="link-divider"></div>
                                    <a :href="documentItem.problemUrl" target="_blank">常见问题</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components: {
        },
        data() {
            return {
                bannerSrc: require('@/assets/img/banner_document_center.png'),
                activeMenu: '0-0',
                isCollapse: false,
                documentData: [
                    {
                        label: '专家服务',
                        value: 'expertServices',
                        icon: require('@/assets/img/expertServices.png'),
                        children: [
                            {
                                label: '兼容性',
                                value: 'compatibility',
                                icon: require('@/assets/img/compatibility-1.png'),
                                documentUrl: '',
                                problemUrl: '',
                                active: false
                            },
                            {
                                label: '性能',
                                value: 'performance',
                                icon: require('@/assets/img/performance-1.png'),
                                documentUrl: '',
                                problemUrl: '',
                                active: false
                            },
                            {
                                label: '弱网',
                                value: 'weaknet',
                                icon: require('@/assets/img/weaknet-1.png'),
                                documentUrl: '',
                                problemUrl: '',
                                active: false
                            },
                            {
                                label: '协议',
                                value: 'protocol',
                                icon: require('@/assets/img/protocol-1.png'),
                                documentUrl: '',
                                problemUrl: '',
                                active: false
                            },
                            {
                                label: '隐私合规',
                                value: 'privacy',
                                icon: require('@/assets/img/privacy-1.png'),
                                documentUrl: '',
                                problemUrl: '',
                                active: false
                            },
                            {
                                label: 'AppStore',
                                value: 'appstore',
                                icon: require('@/assets/img/appstore-1.png'),
                                documentUrl: '',
                                problemUrl: '',
                                active: false
                            },
                            {
                                label: '版署预审',
                                value: 'preliminary',
                                icon: require('@/assets/img/protocol-1.png'),
                                documentUrl: '',
                                problemUrl: '',
                                active: false
                            },
                        ]
                    },{
                        label: '产品服务',
                        value: 'productServices',
                        icon: require('@/assets/img/productServices.png'),
                        children: [
                            {
                                label: 'PEase',
                                value: 'pease',
                                icon: require('@/assets/img/_PEase.png'),
                                documentUrl: '',
                                problemUrl: '',
                                active: false
                            },
                            {
                                label: 'NetFree',
                                value: 'pease',
                                icon: require('@/assets/img/_NetFree.png'),
                                documentUrl: '',
                                problemUrl: '',
                                active: false
                            },
                            {
                                label: '云真机自动化',
                                value: 'autotest',
                                icon: require('@/assets/img/_autotest.png'),
                                documentUrl: '',
                                problemUrl: '',
                                active: false
                            },
                            {
                                label: '云真机',
                                value: 'cloudDevice',
                                icon: require('@/assets/img/_cloudDevice.png'),
                                documentUrl: '',
                                problemUrl: '',
                                active: false
                            },
                        ]
                    }
                ]
            }
        },
        props:{
            
        },
        created(){
        },
        mounted(){
            
        },
        computed:{
            
        },
        watch:{
        },
        methods:{
            changeActive(children, childrenIndex) {
                children.forEach((item, index) => {
                    if (index == childrenIndex) {
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                });
                this.$forceUpdate();
            }
        },
    }
</script>
    
<style lang="less" scoped>
    .document-center {
        margin-top: 64px;
        height: calc(100% - 60px);
        display: flex;
        flex-direction: column;
    }
    .banner-div {
        width: 100%;
        height: 297px;
    }
    .document-center-container {
        padding: 50px 280px 0 280px;
        flex: 1;
        display: flex;
        align-items: center;
    }
    .left-sidebar {
        width: 295px;
        height: 100%;
        box-shadow: 1px 0px 0px rgba(0, 0, 0, 0.1);
        padding: 0 50px;
    }
    .document-center-content {
        flex: 1;
        height: 100%;
    }
    .service-item {
        border-bottom: 1px solid rgba(97, 119, 255, 0.02);
        margin-bottom: 50px;
    }
    .service-item-title {
        width: 100%;
        padding-left: 80px;
        padding-bottom: 20px;
        font-size: 16px;
        font-weight: 700;
        color: #333333;
        line-height: 22px;
    }
    .service-item-content {
        background: rgba(21, 110, 239, 0.01);
        padding: 30px 74px 10px 74px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        border-top: 1px solid rgba(97, 119, 255, 0.1);
    }
    .document-item {
        width: 386px;
        height: 120px;
        border-radius: 10px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
    }
    .document-item:hover {
        box-shadow: 0px 0px 10px rgba(21, 110, 239, 0.15);
    }
    .document-item-img {
        margin-left: 24px;
        margin-right: 30px;
        height: 64px;
        width: 64px;
    }
    .document-item-content {
        flex: 1;
    }
    .document-title {
        color: #333333;
        font-size: 16px;
        font-weight: 700;
        line-height: 22px;
        margin-bottom: 10px;
    }
    .active-title {
        color: #156EEF;
    }
    .document-link-div {
        display: flex;
        align-items: center;
        
    }
    .document-link-div a {
        color: #156EEF;
        text-decoration: none;
        font-size: 14px;
    }
    .link-divider {
        margin: 0 23px;
        width: 1;
        height: 14px;
        border-left: 1px solid rgba(21, 110, 239, 0.2);
    }
    .text-href {
        text-decoration: none;
    }
</style>

<style>
    .document-center-container .el-menu {
        border-right: none;
    }
    .document-center-container .el-menu-item.is-active {
        background: rgba(21, 110, 239, 0.05);
        color: #333333;
    }
    .document-center-container .el-menu-item {
        color: #666666;
    }
    .document-center-container .el-menu-item, .document-center-container .el-submenu__title {
        margin: 4px 8px;
        border-radius: 3px;
    }
    .document-center-container .el-submenu.is-active .el-submenu__title {
        color: #156EEF;
        font-weight: 700;
    }
    .document-center-container .el-menu--collapse .el-submenu.is-active .el-submenu__title {
        background: #156EEF;
    }
    .document-center-container .el-menu--collapse .el-submenu__title, .document-center-container .el-menu--collapse .el-menu-item .el-tooltip {
        padding: 0 12px !important;
    }
    .document-center-container .el-menu-item, .document-center-container .el-submenu .el-menu-item, .document-center-container .el-submenu__title {
        height: 36px;
        line-height: 36px;
    }
    .document-center-container .el-menu-item-group__title {
        padding: 0;
    }
    .document-center-container .el-menu--collapse .el-submenu__title span, .document-center-container .el-menu--collapse .el-submenu__title i {
        display: none;
    }
</style>