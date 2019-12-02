<!-- 表格无数据组件 -->
<template>
  <el-button type="primary" @click='$emit("NoDataClickCallBack")'>添加数据</el-button>
</template>

<script>
export default {
  name: 'NoData',
  components: {},
  props: {},
  data () {
    return {};
  },
  computed: {},
  methods: {},
  created () {},
  mounted () {},
  watch: {}
};
</script>

<style lang="less" scoped></style>
