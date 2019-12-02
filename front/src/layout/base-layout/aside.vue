<!-- 最多兼容到 三级导航 -->
<template>
  <el-menu
    :default-active="activeRouter"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    unique-opened
    :default-openeds='defaultOpeneds'
    background-color='rgb(48, 65, 86)'
    text-color='rgb(191, 203, 217)'
  >
    <template v-for='(item, index) in menuList'>
      <template v-if='!item.children'>
        <el-menu-item :index="item.path" :key='index' @click='goRouter(item.path)'>
          <i class="el-icon-setting"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </template>
      <template v-else>
        <el-submenu :index="index + ''" :key='index'>
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">{{ item.title }}</span>
          </template>
          <template v-for='(_item, _index) in item.children'>
            <template v-if='!_item.children'>
              <el-menu-item class="cycle-menuitem" :index="_item.path" :key='_index' @click='goRouter(_item.path)'>
                <i class="el-icon-setting"></i>
                <span slot="title">{{ _item.title }}</span>
              </el-menu-item>
            </template>
            <template v-else class="cycle-menuitem">
              <el-submenu :index="_index + ''" :key="_index">
                <span slot="title">{{ _item.title }}</span>
                <template v-for='(__item, __index) in _item.children'>
                  <el-menu-item class="cycle-menuitem" :index="__item.path" :key="__index" @click='goRouter(__item.path)'>{{ __item.title }}</el-menu-item>
                </template>
              </el-submenu>
            </template>
          </template>
        </el-submenu>
      </template>
    </template>
  </el-menu>
</template>

<script>
import EventBus from '@/utils/EventBus';
export default {
  name: 'MyAside',
  data () {
    return {
      isCollapse: false,
      menuList: null,
      defaultOpeneds: []
    };
  },
  computed: {
    // 当前生效的路由路径
    activeRouter () {
      return this.$route.path;
    }
  },
  methods: {
    // 菜单栏跳转路由，若跳转的是当前路由，则 return false
    goRouter (path) {
      if (path === this.activeRouter) {
        return false;
      }
      this.$router.push({ path });
    }
  },
  created () {
    // 往事件中心中添加一个 collapse-menu 事件
    EventBus.$on('collapse-menu', isCollapse => {
      this.isCollapse = isCollapse;
    });
    // 获取 vuex 中的菜单栏
    const list = this.$store.state.menuList;
    this.menuList = list;
  },
  watch: {
    '$route' (val) {
      // 是否为单个的导航栏，是则执行收缩菜单栏
      if (val.meta && val.meta.isSingle) {
        this.defaultOpeneds = [];
      }
    }
  }
};

</script>
<style lang='less' scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
  border-right: none;
  li {
    &:hover {
      background-color: #263445 !important;
    }
    /deep/.el-submenu__title {
      &:hover {
        background-color: #263445 !important;
      }
    }
    li {
      background-color: #1f2d3d !important;
      &:hover {
        background-color: #001528 !important;
      }
      /deep/.el-submenu__title {
        background-color: #1f2d3d !important;
        &:hover {
          background-color: #001528 !important;
        }
      }
      li {
        background-color: #1f2d3d !important;
        &:hover {
          background-color: #001528 !important;
        }
      }
    }
  }
}
.el-menu-vertical-demo.el-menu--collapse {
  /deep/.el-menu-item, /deep/.el-submenu__title {
    &:hover {
      background-color: #263445 !important;
    }
  }
}
</style>
