<template>
  <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
    <transition-group name='breadcrumb'>
      <el-breadcrumb-item
        v-for='(i) in breadcrumbList'
        :key='i.title'
      >
        <span class="breadcrumb-list-item" :class="{ 'can-redirect': i.path && i.path !== $route.path }" @click='breadcrumbClick(i.path)'>{{ i.title }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    breadcrumbList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 面包屑路由跳转
    breadcrumbClick (path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    }
  }
};

</script>
<style lang='scss' scoped>
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all .5s;
}

.breadcrumb-leave-active {
  position: absolute;
}

.breadcrumb {
  height: 50px;
  padding: 15px 0px;
  box-sizing: border-box;
  display: inline-block;
  .breadcrumb-list-item {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    color: #97a8be;
  }
  .can-redirect {
    color: #303133;
    &:hover {
      color: #409EFF;
      cursor: pointer;
    }
  }
}
</style>
