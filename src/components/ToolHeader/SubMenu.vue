<template>
    <div v-if="subMenuInfo[subMenuInfo.currentType]" class="sub-menu handle-sub-menu" >
        <div class="sub-menu-content">
            <div class="menu-type-div">
                <div
                    v-for="typeItem in menuData[subMenuInfo.currentType]"
                    :key="typeItem.type"
                    class="menu-type-item"
                    :class="typeItem.isCurrentType ? 'cur-menu-type-item' : ''"
                    @mouseenter="changeCurItem(typeItem.type)"
                >
                    <span>{{typeItem.type}}</span>
                </div>
            </div>
            <div class="list-content">
                <div
                    v-for="listItem in menuList"
                    :key="listItem.name"
                    class="list-item"
                    @click="jumpPage(listItem.url)"
                >
                    <div class="list-item-content">
                        <div class="list-item-title">
                            <span>{{listItem.name}}</span>
                            <!-- 显示每一项产品或服务的状态 -->
                            <state-tag :state="listItem.state" />
                        </div>
                        <div class="list-item-des">{{listItem.des}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import stateTag from '@/components/ToolHeader/StateTag.vue'
    export default {
        data() {
            return {
            }
        },
        components: {
            stateTag
        },
        props: {
        },
        create(){
        },
        mounted() {
            this.handleSubMenuVisible();
        },
        beforeDestroy() {
            document.onmousemove = null;
        },
        computed:{
            subMenuInfo() {
                return this.$store.state.subMenuInfo;
            },
            menuList() {
                let res = this.menuData[this.subMenuInfo.currentType].filter(item => item.isCurrentType );
                return res.length > 0 ? res[0].list : [];
            },
            menuData() {
                return this.$store.state.menuData;
            }
        },
        watch:{
        },
        methods: {
            // 处理子菜单显示状态
            handleSubMenuVisible() {
                document.onmousemove = ((e)=> {
                    if ($(e.target).closest(".handle-sub-menu").length == 0) {
                        let subMenuInfo = {
                            product: false,
                            service: false,
                            currentType: ''
                        }
                        this.$store.commit('setSubMenuInfo', subMenuInfo);
                    }
                })
            },
            // 切换当前服务或者产品类型
            changeCurItem(type) {
                this.menuData[this.subMenuInfo.currentType].forEach(item => {
                    // 给每个服务或产品添加isCurrentType属性
                    this.$set(item, 'isCurrentType', item.type === type ? true : false);
                });
            },
            jumpPage(url) {
                window.location.href = url;
            }
        },
    }
</script>
<style scoped>
    .sub-menu {
        position: fixed;
        top: 64px;
        left: 0;
        width: 100%;
        background: #F7F8FF;
    }
    .sub-menu-content {
        padding: 0 360px;
        display: flex;
    }
    .menu-type-div {
        padding: 10px 20px 10px 0;
        border-right: 1px solid rgba(97, 119, 255, 0.25);
    }
    .menu-type-item {
        height: 60px;
        width: 180px;
        line-height: 60px;
        white-space: nowrap;
        cursor: pointer;
    }
    .menu-type-item span {
        padding: 20px 35px;
    }
    .cur-menu-type-item {
        color: #156EEF;
        font-weight: 700;
    }
    .list-content {
        flex: 1;
    }
    .list-item {
        height: 90px;
        width: 229px;
        margin: 20px 0 0 20px;
        background: rgba(97, 119, 255, 0.02);
        border-radius: 5px;
        display: inline-block;
        cursor: pointer;
    }
    .list-item-content {
        padding: 20px 10px;
        font-size: 14px;
        line-height: 20px;
    }
    .list-item-title {
        display: flex; 
        align-items: center;
        color: #666666;
        font-weight: 700;
        margin-bottom: 8px;
    }
    .list-item-des {
        color: #999999;
        font-weight: 400;
    }
    .list-item:hover {
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    }
    .list-item:hover .list-item-title {
        color: #156EEF;
    }
    .list-item:hover .list-item-des {
        color: rgba(21, 110, 239, 0.8);;
    }
</style>