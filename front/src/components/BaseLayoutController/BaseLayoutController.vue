<!--
  全局的 base-layout 控制器
  可控制
  Header,
  tags-View,
  面包屑,
  菜单栏的伸缩按钮
  的显示状态等
-->
<template>
  <div>
    <div class="drawer" :class="[ isClick ? drawer ? 'show' : 'hide' : '', drawer ? 'has-shadow' : '' ]">
      <div  @click="handlerClick" class="handler">
        <i class="iconfont" :class="[drawer ? 'icon-shousuo' : 'icon-shousuo1']" />
      </div>
      <div class="drawer-body">
        <h3 class="body-title">系统布局配置</h3>
        <div class="drawer-item">
          <span class="left">
            开启 Tags-View
          </span>
          <span class="right">
            <el-switch class="switch" v-model="$store.state.isOpenTagsView" />
          </span>
        </div>
        <div class="drawer-item">
          <span class="left">
            固定 Header/View-Tags
          </span>
          <span class="right">
            <el-switch class="switch" v-model="$store.state.isFixedHeader" />
          </span>
        </div>
        <div class="drawer-item">
          <span class="left">
            显示导航栏伸缩按钮
          </span>
          <span class="right">
            <el-switch class="switch" v-model="$store.state.canMenuListCollapse" />
          </span>
        </div>
        <div class="drawer-item">
          <span class="left">
            显示面包屑功能
          </span>
          <span class="right">
            <el-switch class="switch" v-model="$store.state.isShowBreadcrumb" />
          </span>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div @click="handlerClick" class="mask" v-if="drawer"></div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BaseLayoutController',
  components: {},
  props: {},
  data () {
    return {
      drawer: false,
      isClick: false,
      isOPenTagsView: true,
      isFixedHeader: false
    };
  },
  computed: {},
  methods: {
    handlerClick () {
      this.isClick = true;
      this.drawer = !this.drawer;
    }
  },
  created () {},
  mounted () {},
  watch: {}
};
</script>

<style lang="less" scoped>
// 控制器的宽度
@width: 280px;

// 背景动画
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

// drawer 主题的动画
@keyframes show {
  0% { left: -@width; }
  100% { left: 0px; }
}
@keyframes hide {
  0% { left: -0px; }
  100% { left: -@width; }
}
.show {
  animation: show 250ms linear forwards;
}
.hide {
  animation: hide 250ms linear forwards;
}

.drawer {
  width: @width;
  height: 100vh;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left: -@width;
  z-index: 1500;
  &.has-shadow {
    box-shadow: 0 0 15px 0 rgba(0,0,0,.05);
  }
  .drawer-body {
    padding: 24px;
    .body-title {
      margin: 14px 0 12px;
    }
    .drawer-item {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 12px 0;
      .left {
        flex: 1;
        font-size: 14px;
        color: rgba(0,0,0,.65);
      }
      .right {
        width: 40px;
      }
    }
  }
}
.handler {
  width: 48px;
  height: 48px;
  background-color: rgb(24, 144, 255);
  position: absolute;
  right: -48px;
  bottom: 0;
  border-radius: 0px 6px 6px 0px;
  cursor: pointer;
  i {
    font-size: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
  }
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,.2);
  z-index: 1499;
}
</style>
