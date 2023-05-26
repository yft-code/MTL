// 首页解决方法方案部分
<template>
  <div class="solution-div">
    <div class="solution-contianer">
      <div class="solution-title">解决方案</div>
      <div class="solution-content">
        <div
          v-for="solutionItem in solutionData"
          :key="solutionItem.type"
          class="solution-type-content"
          :class="
            solutionItem.type === curSolutionType ? 'cur-solution-type' : ''
          "
          @click="changecurSolutionType(solutionItem.type)"
        >
          <span>{{ solutionItem.type }}</span>
        </div>
      </div> 
      <div class="solution-des">{{ curSolutionDes }}</div>
      <div class="solution-item-container">
        <div
          v-for="listItem in curSolutionList"
          :key="listItem.title"
          class="solution-item-content"
        >
          <div class="solution-item-background"></div>
          <img class="solution-img" :src="solutionImg" />
          <div>
            <div class="solution-item-title">{{ listItem.title }}</div>
            <div class="solution-item-des">{{ listItem.des }}</div>
            <a :href="listItem.url" target="_blank" class="get-detail">
              <span>了解详情</span>
              <i class="el-icon-right" style="margin-left: 8px"></i>
            </a>
          </div>
          <img class="mark-icon" :src="markIcon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      curSolutionType: "通用解决方案",
      solutionData: [
        {
          type: "通用解决方案",
          des: "通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案",
          solutionList: [
            {
              title: "解决方案1",
              des: "方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍",
              url: "",
            },
            {
              title: "解决方案2",
              des: "方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍",
              url: "",
            },
            {
              title: "解决方案3",
              des: "方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍",
              url: "",
            },
            {
              title: "解决方案4",
              des: "方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍",
              url: "",
            },
          ],
        },
        {
          type: "通用解决方案1",
          des: "通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案通用解决方案",
          solutionList: [
            {
              title: "解决方案1",
              des: "方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍",
              url: "",
            },
            {
              title: "解决方案2",
              des: "方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍",
              url: "",
            },
            {
              title: "解决方案3",
              des: "方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍",
              url: "",
            },
            {
              title: "解决方案4",
              des: "方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍方案介绍",
              url: "",
            },
          ],
        },
      ],
      solutionImg: require("@/assets/img/solution.png"),
      markIcon: require("@/assets/img/DecorationJuju.png"),
    };
  },
  props: {},
  created() {},
  mounted() {},
  computed: {
    curSolutionList() {
      let res = this.solutionData.filter(
        (item) => item.type === this.curSolutionType
      );
      return res.length > 0 ? res[0].solutionList : [];
    },
    curSolutionDes() {
      let res = this.solutionData.filter(
        (item) => item.type === this.curSolutionType
      );
      return res.length > 0 ? res[0].des : "";
    },
  },
  watch: {},
  methods: {
    // 切换当前方案
    changecurSolutionType(type) {
      this.curSolutionType = type;
    },
  },
};
</script>
    
<style scoped>
.solution-div {
  width: 100%;
  position: relative;
  background: url("~@/assets/img/solution_background.png") no-repeat;
}
.solution-contianer {
  margin: 80px 360px 0 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.solution-title {
  font-size: 32px;
  font-weight: 700;
  color: #333333;
}
.solution-content {
  display: flex;
  align-items: center;
  margin-top: 35px;
  width: 100%;
}
.solution-type-content {
  height: 36px;
  color: #666666;
  border-radius: 8px;
  margin-right: 20px;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  line-height: 36px;
}
.solution-type-content span {
  padding: 8px 16px;
}
.solution-type-content:last-child {
  margin-right: 0;
}
.cur-solution-type {
  background: #156eef;
  color: #fff;
}
.solution-des {
  text-align: left;
  font-size: 14px;
  color: #999999;
  width: 100%;
  margin-top: 20px;
}
.solution-item-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 20px;
  width: 100%;
}
.solution-item-content {
  margin-top: 40px;
  margin-right: 35px;
  width: calc(50% - 35px);
  height: 195px;
  box-shadow: 0px 10px 40px rgba(21, 110, 239, 0.15);
  display: flex;
  align-items: flex-start;
  position: relative;
  background: url("~@/assets/img/solution_background.png") no-repeat;
  background-size: 100% 100%;
}
.solution-item-content:hover {
  box-shadow: 0px 6px 30px rgba(21, 110, 239, 0.15);
}
.solution-img {
  margin: 20px;
  vertical-align: top;
}
.mark-icon {
  width: 25px;
  height: 25px;
  position: absolute;
  right: -5px;
  bottom: -5px;
}
.solution-item-title {
  font-size: 14px;
  font-weight: 700;
  color: #666666;
  padding: 30px 30px 0 30px;
}
.solution-item-des {
  margin: 20px 0;
  font-size: 14px;
  color: #999999;
  padding: 0 30px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.get-detail {
  padding: 0 30px 30px 30px;
  font-size: 14px;
  color: #acadb6;
  cursor: pointer;
  text-decoration: none;
}
.get-detail:hover {
  color: #156eef;
}
</style>

<style>
</style>