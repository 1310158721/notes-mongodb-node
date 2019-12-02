<template>
  <div class="header">
    <span v-if='$store.state.canMenuListCollapse' class="menu-handle" @click='collapseMenu'>
      <i class="iconfont" :class="[isCollapse ? 'icon-shousuo1' : 'icon-shousuo']" />
    </span>
    <breadcrumb v-if='breadcrumbList && breadcrumbList.length && $store.state.isShowBreadcrumb' :breadcrumbList='breadcrumbList' />
    <header-avatar class='header-avatar' />
  </div>
</template>

<script>
import EventBus from '@/utils/EventBus';
import Breadcrumb from './breadcrumb';
import HeaderAvatar from './avatar';
export default {
  name: 'MyHeader',
  components: {
    Breadcrumb,
    HeaderAvatar
  },
  data () {
    return {
      isCollapse: false,
      breadcrumbList: []
    };
  },
  methods: {
    // 获取面包屑数据（递归获取多维数组中的每一级的信息）
    getBreadcrumbList (menuListItem) {
      if (menuListItem.children && menuListItem.children.length) {
        this.breadcrumbList.push({ title: menuListItem.title, path: menuListItem.path || null });
        menuListItem.children.map((i) => {
          this.getBreadcrumbList(i);
        });
      } else {
        if (this.$route.path === menuListItem.path) {
          this.breadcrumbList.push({ title: menuListItem.title, path: menuListItem.path || null });
        }

        // 添加 Dashboard
        if (!this.breadcrumbList.filter((i) => i.path === '/Dashboard').length) {
          this.breadcrumbList.unshift({ title: 'Dashboard', path: '/Dashboard' });
        }
      }
    },
    // 递归函数，用于查找当前路由所在的是导航栏数组中的哪一个元素
    loop (item, index, array) {
      if (item.children && item.children.length) {
        item.children.map((i) => {
          // 用于面包屑的重定向
          if (!i.children || !i.children.length) {
            item.path = item.children[0].path;
          }
          this.loop(i, index, array);
        });
      } else {
        if (item.path === this.$route.path) {
          // 找到所属的元素后，开始获取面包屑的数据
          this.getBreadcrumbList(array[index]);
        }
      }
    },
    // 递归匹配当前生效的路由是属于导航栏数组中的哪一个元素
    matchMenuList (list) {
      list.map((i, index, array) => {
        this.loop(i, index, array);
      });
    },
    // 获取 vuex 中的导航栏数据
    getMenuList () {
      this.breadcrumbList = [];
      const menuList = this.$store.state.menuList;
      this.matchMenuList(menuList);
    },
    // 收缩菜单
    collapseMenu () {
      this.isCollapse = !this.isCollapse;
      // 触发事件中心中的 collapse-menu 事件
      EventBus.$emit('collapse-menu', this.isCollapse);
    }
  },
  created () {
    this.getMenuList();
  },
  watch: {
    '$route.path' () {
      this.getMenuList();
    }
  }
};

</script>
<style lang='scss' scoped>
.header {
  height: 50px;
  background-color: #ffffff;
  box-shadow: 0 0px 4px rgba(0,21,41,.08);
  position: relative;
  z-index: 10;
  padding: 0 10px;
  .menu-handle {
    display: inline-block;
    width: 50px;
    height: 50px;
    text-align: center;
    vertical-align: top;
    position: relative;
    cursor: pointer;
    &:hover {
      background-color: rgba(0,0,0,.025);
      i {
        color: #409EFF;
      }
    }
    i {
      font-size: 30px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #2d3a4b;
    }
  }
  .header-avatar {
    position: absolute;
    right: 10px;
    top: 0;
  }
}
</style>
