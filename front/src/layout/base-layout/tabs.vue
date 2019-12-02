<template>
  <el-tabs v-if='tabs' class="tabs-wrapper" v-model="activeName" type="card" @tab-remove='tabRemove' @tab-click='TabClick'>
    <el-tab-pane v-for='i in tabs' :label="i.title" :name="i.path" :key='i.path' :closable='i.path !== "/Dashboard"' />
  </el-tabs>
</template>

<script>
export default {
  data () {
    return {
      // 默认生效的 tab
      activeName: '/Dashboard',
      // tab 的数组
      tabs: null
    };
  },
  methods: {
    getTabs () {
      this.tabs = JSON.parse(window.sessionStorage.getItem('Tabs'));
      this.activeName = this.$route.path;
    },
    TabClick ({ name }) {
      if (name !== this.$route.path) {
        this.$router.push(name);
      }
    },
    tabRemove (name) {
      // 删除的是当前激活的tabs
      if (name === this.$route.path) {
        this.tabs = this.tabs.filter((item, index, array) => {
          if (name === item.path) {
            if (index + 1 === array.length) {
              this.$router.push(this.tabs[index - 1]);
            } else {
              this.$router.push(this.tabs[index + 1]);
            }
            return false;
          } else {
            return true;
          }
        });
      } else {
        this.tabs = this.tabs.filter((item) => item.path !== name);
      }
      window.sessionStorage.setItem('Tabs', JSON.stringify(this.tabs));
    }
  },
  created () {
    this.getTabs();
  },
  watch: {
    '$route.path' () {
      this.getTabs();
    }
  }
};

</script>
<style lang='less' scoped>
.tabs-wrapper {
  width: 100%;
  height: 30px;
  background-color: #ffffff;
  border-bottom: 1px solid #d8dce5;
  overflow: hidden;
  /deep/.el-tabs__header {
    border-bottom: none;
    margin: 2px 0px 0px;
  }
  /deep/.el-tabs__nav {
    border: none;
  }
  /deep/.el-tabs__item {
    outline: none;
    border: 1px solid #E4E7ED !important;
    height: 26px;
    line-height: 26px;
    border-radius: 4px;
    margin-left: 5px;
    font-size: 12px;
    color: #495060;
    &.is-active {
      color: #409EFF;
    }
  }
  /deep/.el-tabs__nav-prev, /deep/.el-tabs__nav-next {
    line-height: 26px;
  }
}
</style>
