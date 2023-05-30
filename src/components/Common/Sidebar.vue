<template>
    <div class="sidebar-container">
        <el-menu 
            :default-active="activeMenu" 
            :collapse="isCollapse"
            class="sidebar-content" 
            >
            <div
                v-for="(menuItem, menuIndex) in sidebarData[curSidebarType]"
                :key="menuItem.label"
            >
                <!-- 有子菜单的菜单栏 -->
                <el-submenu v-if="menuItem.children" :index="String(menuIndex)">
                    <template slot="title">
                        <img :src="menuItem.icon">
                        <span slot="title" style="margin-left: 8px">{{menuItem.label}}</span>
                    </template>
                    <div v-for="(itemChild,childrenIndex) in menuItem.children" :key="itemChild.label">
                        <el-submenu v-if="itemChild.children" :index="String(menuIndex) + '-' + String(childrenIndex)">
                            <template slot="title">
                                <img :src="itemChild.icon">
                                <span slot="title" style="margin-left: 8px">{{itemChild.label}}</span>
                            </template>
                            <el-menu-item 
                                v-for="(itemChild_Child, grandSonIndex) in itemChild.children"
                                :key="itemChild_Child.label"  
                                :index="String(menuIndex) + '-' + String(childrenIndex) + '-' + String(grandSonIndex)" 
                                @click="jumpToPage(itemChild_Child)"
                            >
                                {{itemChild_Child.label}}
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item 
                            v-else 
                            :index="String(menuIndex) + '-' + String(childrenIndex)" 
                            @click="jumpToPage(itemChild)"
                        >
                            <img :src="itemChild.icon">
                            <span slot="title" style="margin-left: 8px">{{itemChild.label}}</span>
                        </el-menu-item>
                    </div>
                </el-submenu>
                <!-- 没有子菜单的菜单栏 -->
                <el-menu-item 
                    v-else 
                    :index="String(menuIndex)"
                    @click="jumpToPage(menuItem)"
                    >
                    <img :src="menuItem.icon">
                    <span slot="title" style="margin-left: 8px">{{menuItem.label}}</span>
                </el-menu-item>
            </div>
        </el-menu>
        <!-- 侧边菜单栏的收和关按钮 -->
        <div class="sidebar-expander" @click="isCollapse = !isCollapse"></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                miniLogo: require('@/assets/img/mtl_logo_mini.png'),
                isCollapse: false,
                sidebarData: {
                    // 专家服务
                    expertServices: [
                        {
                            label: '专家服务',
                            icon: require('@/assets/img/services_item.png'),
                            children: [
                                {
                                    label: '兼容性测试',
                                    value: 'compatibility',
                                    url: '/mtl_test_platform/page/expertServices/compatibility',
                                    editType: 'add',
                                },
                                {
                                    label: '性能测试',
                                    children: [
                                        {
                                            label: '手游性能测试',
                                            value: 'performance',
                                            url: '/mtl_test_platform/page/expertServices/performance',
                                            editType: 'add',
                                        } 
                                    ]
                                },
                                {
                                    label: '协议测试',
                                    value: 'protocol',
                                    url: '/mtl_test_platform/page/expertServices/protocol',
                                    editType: 'add',
                                },
                            ]
                        },
                        {
                            label: '服务单列表',
                            value: 'serviceOrdersList',
                            url: '/mtl_test_platform/page/expertServices/serviceOrdersList',
                            icon: require('@/assets/img/service_orders_list.png')
                        }
                    ],
                    // 工作台
                    workstation: [
                        {
                            label: '我的任务',
                            icon: require('@/assets/img/specialServices.png'),
                            value: 'myMission',
                            url: '/mtl_test_platform/page/workstation/myMission'
                        }
                    ]
                },
                activeMenu: ''
            }
        },
        props:{
            
        },
        created(){
            this.checkIsMTL()
            this.judgeAdmin()
        },
        mounted(){
            
        },
        computed:{
            curSidebarType() {
                let path = this.$route.path;
                let type = path.indexOf('expertServices') >= 0 ? 'expertServices' : 'workstation';
                let queryValue = ""
                queryValue = path.split('/')[path.split('/').length - 1]
                this.activeMenu = '';
                this.sidebarData[type].forEach((menuItem, menuIndex) => {
                    if (menuItem.value === queryValue || queryValue.indexOf(menuItem.value) !== -1) {
                        this.activeMenu = String(menuIndex);
                    }
                    if (menuItem.children) {
                        menuItem.children.forEach((childrenItem, childrenIndex) => {
                            if (childrenItem.value === queryValue || queryValue.indexOf(childrenItem.value) !== -1) {
                                this.activeMenu = String(menuIndex) + '-' + String(childrenIndex);
                            }
                            if (childrenItem.children){
                                childrenItem.children.forEach((grandSon, grandSonIndex) => {
                                    if(grandSon.value === queryValue || queryValue.indexOf(grandSon.value) !== -1){
                                        this.activeMenu = String(menuIndex) + '-' + String(childrenIndex) + '-' + String(grandSonIndex);
                                    }
                                })
                            }
                        })
                    }
                });
                return type;
            },
            isTester() {
                return this.$store.getters.getIsTester
            },
            isAdmin() {
                return this.$store.getters.getIsAdmin
            },
        },
        watch:{ 
        },
        methods:{
            jumpToPage(item) {
                if (!item.url) {
                    return;
                }
                this.$router.push(item.url);
            },

            // 判断-临时管理员
            checkIsMTL(){
                if(this.isTester){
                    let addList = []
                }
            },

            judgeAdmin(){
                if(this.isAdmin){
                    this.sidebarData.workstation.push({
                        label: '分配接口人',
                        icon: require('@/assets/img/manager-list.png'),
                        value: 'assignContactPerson',
                        url: '/mtl_test_platform/page/workstation/assignContactPerson'
                    })
                }else{
                    this.sidebarData.workstation.push({
                        label: '查看接口人',
                        icon: require('@/assets/img/manager-list.png'),
                        value: 'assignContactPerson',
                        url: '/mtl_test_platform/page/workstation/assignContactPerson'
                    })
                }

                if(this.isAdmin || this.isTester){
                    this.sidebarData.workstation.push(
                        {
                            label: '测试设备管理',
                            icon: require('@/assets/img/device-manage.png'),
                            children: [
                                {
                                    label: '手机设备',
                                    value: 'phoneManage',
                                    url: '/mtl_test_platform/page/workstation/phoneManage'
                                },
                                {
                                    label: '电脑设备',
                                    value: 'pcManage',
                                    url: '/mtl_test_platform/page/workstation/pcManage'
                                }
                            ]
                        }
                    )
                }
            },
        },
    }
</script>
<style lang='less' scoped>
    .sidebar-container {
        height: 100%;
        background: #F9FBFF;
        position: relative;
    }
    .sidebar-title {
        padding: 25px 68px;
        font-size: 20px;
        color: #333333;
        font-weight: 700;
        border-bottom: 1px solid #156EEF;
    }
    .sidebar-title-mini {
        width: 64px;
        height: 64px;
        line-height: 64px;
        border-bottom: 1px solid #156EEF;
        text-align: center;
    }
    .sidebar-content {
        background: #F9FBFF;
    }
    .sidebar-content:not(.el-menu--collapse) {
        width: 216px;
    }
    .sidebar-expander {
        height: 32px;
        width: 32px;
        margin: 9px 16px;
        background-image: url('~@/assets/img/expander.png');
        cursor: pointer;
        position: absolute;
        left: 0;
        bottom: 0;
    }
    .sidebar-expander:hover {
        background-image: url('~@/assets/img/expander_hover.png');
    }
</style>

<style>
    .sidebar-container .el-menu {
        border-right: none;
    }
    .sidebar-container .el-menu-item.is-active {
        background: #156EEF;
        color: #fff;
    }
    .sidebar-container .el-menu-item, .sidebar-container .el-submenu__title {
        margin: 4px 8px;
        border-radius: 3px;
    }
    
    .el-submenu.is-active > .el-submenu__title {
        color: #156EEF !important;
        font-weight: 700;
    }
    .sidebar-container .el-menu--collapse .el-submenu.is-active .el-submenu__title {
        background: #156EEF;
    }
    .sidebar-container .el-menu--collapse .el-submenu__title, .sidebar-container .el-menu--collapse .el-menu-item .el-tooltip {
        padding: 0 12px !important;
    }
    .sidebar-container .el-menu-item, .sidebar-container .el-submenu .el-menu-item, .sidebar-container .el-submenu__title {
        height: 36px;
        line-height: 36px;
    }
    .sidebar-container .el-menu-item-group__title {
        padding: 0;
    }
    .sidebar-container .el-menu--collapse .el-submenu__title span, .sidebar-container .el-menu--collapse .el-submenu__title i {
        display: none;
    }
</style> 