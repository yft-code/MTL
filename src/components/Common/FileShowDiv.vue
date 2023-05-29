<template>
  <div class="file-show-div">
    <div class="show-title">查看区</div>
    <div v-if="oldData.length == 0 && newData.length == 0" class="no-content">
      <img class="no-content-img" :src="nofilePic" />
      <div>{{ noDataLabel }}</div>
    </div>
    <div v-else class="show-content">
      <div
        v-for="(item, index) in oldData"
        :key="'old' + index"
        class="select-item"
        @mouseenter="showCloseIndex = 'old' + index"
        @mouseleave="showCloseIndex = -1"  
      >
        <span class="select-name">{{ item }}</span>
        <i
          v-if="showCloseIndex == 'old' + index"
          class="el-icon-close"
          @click="removeOld(index)"
        >
        </i>
      </div>
      <div
         v-for="(item, index) in newData"
            :key="'new' + index"
            class="select-item"
            @mouseenter="showCloseIndex = 'new' + index"
            @mouseleave="showCloseIndex = -1"
      >
        <span class="select-name" v-if="typeof item == 'object'">
            {{item[fileNameKey]}}
        </span>
        <span class="select-name" v-else>
            {{ item }}
        </span>
        <i
            v-if="showCloseIndex == 'new' + index"
            class="el-icon-close"
            @click="removeNew(index)"
        >
        </i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    oldData: {},
    newData: {},
    noDataLabel: {},
    fileNameKey: {},
  },
  data() {
    return {
      nofilePic: require("@/assets/img/emptyState.png"),
      showCloseIndex: -1,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    removeOld(index) {
      this.$emit("removeOld", index);
    },

    removeNew(index) {
      this.$emit("removeNew", index);
    },
  },

  watch: {},
};
</script>
<style lang="less" scoped>
.file-show-div {
  width: 50%;
  box-sizing: border-box;
  display: inline-block;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  text-align: center;
  vertical-align: top;
  padding: 0.5rem;
  min-height: 180px;
  .show-title {
    text-align: left;
    border-bottom: 1px solid #d0d0d0;
  }
  .no-content {
    .no-content-img {
      margin-top: 1.5rem;
    }
  }
  .show-content {
    padding: 0.5rem;
    .select-item {
      text-align: left;
      background-color: #f5f7fa;
      margin: 3px;
      border-radius: 3px;
      .select-name {
        width: calc(100% - 20px);
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
      .el-icon-close {
        text-align: right;
        vertical-align: middle;
        cursor: pointer;
      }
    }
  }
}
</style>
