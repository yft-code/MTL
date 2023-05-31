<template>
    <div class="header-menu" :class="isDarkStyle ? 'dark-style' : ''">
        <div
            class="menu-item handle-sub-menu"
            :class="subMenuInfo.currentType === 'product' ? 'cur-menu-item' : ''"
            @mouseenter="setSubMenu('product')"
        >
            <span>产品服务</span>
        </div>
        <div
            v-if="isAdmin || isContact || !isTester"
            class="menu-item handle-sub-menu"
            :class="[
                subMenuInfo.currentType === 'service' ? 'cur-menu-item' : '',
                $route.path === '/mtl_test_platform/page/expertServices' ? 'active-menu' : '',
                ]"
            @mouseenter="setSubMenu('service')"
        >
            <span>专家服务</span>
        </div>
        <div
            v-if="isAdmin || isTester"
            class="menu-item"
            :class="[$route.path.indexOf('/mtl_test_platform/page/workstation') !== -1 ? 'is-active' : '']"
            @click="jumpToWorkstation"
        >
            <span>工作站</span>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        components: {},
        props: {
            isDarkStyle: {
                type: Boolean,
          },
        },
        create() {
        },
        mounted() {},
        computed: {
          isHover() {
              return this.$store.state.isHover;
          },
          isShowSubMenu() {
              return this.$store.state.isShowSubMenu;
          },
          subMenuInfo() {
              return this.$store.state.subMenuInfo;
          },
          isWorkstation() {
              return this.$route.path === "/mtl_test_platform/page/workstation";
          },
          isTester() {
              return this.$store.state.isTester;
          },
          isAdmin() {
              return this.$store.state.isAdmin;
          },
          isContact() {
              return this.$store.state.isContact;
          },
      },
      watch: {},
      methods: {
        // 设置子菜单显示状态
          setSubMenu(type) {
              let subMenuInfo = {
                product: false,
                service: false,
                currentType: type,
              };
              subMenuInfo[type] = true;
              this.$store.commit("setSubMenuInfo", subMenuInfo);
          },
          jumpToWorkstation() {
            this.$router.push({
              path: "/mtl_test_platform/page/workstation/myMission",
              });
            }
        }
    }
</script>
<style scoped>
.header-menu {
  display: flex;
  align-items: center;
  flex: 1;
  color: #fff;
  margin-left: 45px;
  box-shadow: none !important;
}
.dark-style {
  color: #333333;
}
.menu-item {
  font-size: 16px;
  cursor: pointer;
  padding: 0 25px;
  font-weight: 700;
}
.menu-item:hover,
.cur-menu-item {
  color: #03e2ef;
}
.dark-style .menu-item:hover,
.dark-style .cur-menu-item {
  color: #156eef;
}
.active-menu {
  color: #156eef;
  font-weight: 700;
  border-bottom: 2px solid #156eef;
}
.is-active {
  border-bottom: 2px solid #4876f2;
  color: #303133;
}
</style>