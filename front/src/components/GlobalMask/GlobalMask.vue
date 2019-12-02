<!--
  全局的 遮罩组件
  参数可在 vuex state globalMask 中设置
-->
<template>
  <div
    v-if='$store.state.globalMask.loading'
    class="global-mask"
    v-loading='$store.state.globalMask.loading'
    :element-loading-text="$store.state.globalMask.text"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  />
</template>

<script>
export default {
  name: 'GlobalMask',
  data () {
    return {};
  }
};

</script>
<style lang='less' scoped>
.global-mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 9999;
}
</style>
