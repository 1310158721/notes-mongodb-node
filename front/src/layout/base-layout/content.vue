<template>
  <div class="base-layout-content-wrapper">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'MyContent',
  data () {
    return {
    };
  }
};

</script>
<style lang='less' scoped>
.base-layout-content-wrapper {
  // height: 100%;
  flex: 1;
  padding: 10px;
}
</style>
