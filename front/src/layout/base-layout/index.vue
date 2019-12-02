<template>
  <el-container class="base-layout-wrapper">
    <my-aside />
    <el-container class="right-aside" :class="[$store.state.isFixedHeader ? 'right-aside-fixed' : 'right-aside-not-fixed']">
      <div class="right-aside-wrapper">
        <my-header />
        <my-tabs v-if='$store.state.isOpenTagsView' />
        <my-content :class="{ 'right-aside-fixed-content': $store.state.isFixedHeader }" />
      </div>
    </el-container>
    <global-mask />
    <base-layout-controller />
  </el-container>
</template>

<script>
import MyAside from './aside';
import MyHeader from './header';
import MyContent from './content';
import MyTabs from './tabs';
import GlobalMask from '@/components/GlobalMask/GlobalMask';
import BaseLayoutController from '@/components/BaseLayoutController/BaseLayoutController';
export default {
  components: {
    MyAside, MyHeader, MyContent, MyTabs, GlobalMask, BaseLayoutController
  },
  data () {
    return {
      fixed: false
    };
  }
};

</script>
<style lang='scss' scoped>
.base-layout-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  .right-aside-fixed {
    .right-aside-wrapper {
      width: 100% !important;
      display: flex;
      flex-direction: column;
      .right-aside-fixed-content {
        overflow-y: auto;
      }
    }
  }
  .right-aside-not-fixed {
    overflow: hidden;
    .right-aside-wrapper {
      width: 100% !important;
      overflow: auto;
    }
  }
}
</style>
