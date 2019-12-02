import Vue from 'vue';
import VueRouter from 'vue-router';
import Cookie from 'js-cookie';
import asyncRouter from './asyncBaseRouters';
import subRouter from './subRouter';
import store from '@/store';
import { menuList } from '@/apis';

// 页面加载进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// NProgress 的简单配置
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false });

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/login',
      meta: {
        title: '登录界面'
      },
      component: () => import('@/layout/login-layout/index.vue')
    },
    {
      path: '/',
      redirect: { path: '/base-layout' }
    }
  ]
});

// base-layout 基础路由
const asyncRouterFirst = asyncRouter[0];

const loop = item => {
  if (item.children) {
    item.children.map((i) => {
      loop(i);
    });
  } else {
    asyncRouter.filter((item, index) => index > 0).map((i) => {
      if (i.title === item.title) {
        asyncRouterFirst.children.push(Object.assign(item, i));
        // 更新result, 用于menuList菜单
        item = Object.assign(item, i);
      }
    });
  }
  return asyncRouterFirst;
};

// 进入路由前钩子
router.beforeEach((to, from, next) => {
  NProgress.start();

  // base-layout tabs栏
  const tabs = JSON.parse(window.sessionStorage.getItem('Tabs')) || [{
    path: '/Dashboard',
    title: 'Dashboard'
  }];

  const isLogin = Boolean(Cookie.get('Token'));
  if (!isLogin && to.path !== '/login') {
    window.sessionStorage.removeItem('Tabs');
    next({
      path: '/login',
      replace: true
    });
  } else {
    if (to.path === '/login') {
      window.sessionStorage.removeItem('Tabs');
      next();
    } else {
      if (!store.state.menuList) {
        menuList.GetMenuList().then((res) => {
          const { result } = res.data;

          // 添加 base-layout 的固定子路由
          if (process.env.NODE_ENV !== 'production') {
            result.push({
              title: '方便测试',
              children: null
            });
          };

          // 递归处理路由/菜单相关数据
          result.map((item) => {
            loop(item);
          });

          // vuex 保存 menuList
          store.commit('setMenuList', result);

          // 动态添加路由
          router.addRoutes([asyncRouterFirst, ...subRouter]);

          next({
            path: to.fullPath,
            replace: true
          });
        });
        return;
      }

      if (!tabs.filter((i) => i.path === to.path).length) {
        tabs.push({
          path: to.path,
          title: to.meta && to.meta.title
        });
      };

      // 设置浏览器标签的标题
      document.title = to.meta && to.meta.title;

      window.sessionStorage.setItem('Tabs', JSON.stringify(tabs));
      next();
    }
  }
});

// 进入路由后钩子
router.afterEach(() => {
  NProgress.done();
});

export default router;
