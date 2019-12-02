/**
 * 主要是用于保存导航栏上面这些可见的路由
 * asyncRouter 为 base-layout 页面下的一些子路由
 */

const asyncRouter = [
  {
    // 属于 base-layout 界面的子路由（后期可能有其他界面的）
    path: '/base-layout',
    component: () => import('@/layout/base-layout/index.vue'),
    redirect: { path: '/Dashboard' },
    children: []
  },
  {
    path: '/Dashboard',
    title: 'Dashboard',
    component: () => import('@/views/Dashboard/Dashboard.vue'),
    meta: {
      title: 'Dashboard',
      isSingle: true
    },
    children: null
  },
  {
    path: '/Fs',
    title: 'Fs',
    component: () => import('@/views/Node/Fs/Fs.vue'),
    meta: {
      title: 'FS',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Es5',
    title: 'Es5',
    component: () => import('@/views/Js/Es5/Es5.vue'),
    meta: {
      title: 'Es5',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Es6',
    title: 'Es6',
    component: () => import('@/views/Js/Es6/Es6.vue'),
    meta: {
      title: 'Es6',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Echarts',
    title: 'Echarts',
    component: () => import('@/views/Plugins/Echarts/Echarts.vue'),
    meta: {
      title: 'Echarts',
      isSingle: false
    },
    children: null
  },
  {
    path: '/BaiduMap',
    title: '百度地图',
    component: () => import('@/views/Plugins/BaiduMap/BaiduMap.vue'),
    meta: {
      title: '百度地图',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Express',
    title: 'Express',
    component: () => import('@/views/Plugins/Express/Express.vue'),
    meta: {
      title: 'Express',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Webpack',
    title: 'Webpack',
    component: () => import('@/views/Plugins/Webpack/Webpack.vue'),
    meta: {
      title: 'Webpack',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Vue',
    title: 'VUE',
    component: () => import('@/views/Frames/Vue/Vue.vue'),
    meta: {
      title: 'VUE',
      isSingle: false
    },
    children: null
  },
  {
    path: '/ElementUI',
    title: 'ElementUI',
    component: () => import('@/views/Frames/ElementUI/ElementUI.vue'),
    meta: {
      title: 'ElementUI',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Eslint',
    title: 'Eslint',
    component: () => import('@/views/Deploy/Eslint/Eslint.vue'),
    meta: {
      title: 'Eslint',
      isSingle: false
    },
    children: null
  },
  {
    path: '/VueCli',
    title: 'VueCli',
    component: () => import('@/views/Deploy/VueCli/VueCli.vue'),
    meta: {
      title: 'VueCli',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Tslint',
    title: 'Tslint',
    component: () => import('@/views/Deploy/Tslint/Tslint.vue'),
    meta: {
      title: 'Tslint',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Mongodb',
    title: 'Mongodb',
    component: () => import('@/views/DataBase/Mongodb/Mongodb.vue'),
    meta: {
      title: 'Mongodb',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Css',
    title: 'Css',
    component: () => import('@/views/Styles/Css/Css.vue'),
    meta: {
      title: 'Css',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Less',
    title: 'Less',
    component: () => import('@/views/Styles/Less/Less.vue'),
    meta: {
      title: 'Less',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Sass',
    title: 'Sass',
    component: () => import('@/views/Styles/Sass/Sass.vue'),
    meta: {
      title: 'Sass',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Dom',
    title: 'Dom操作',
    component: () => import('@/views/Html/Dom/Dom.vue'),
    meta: {
      title: 'Dom操作',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Ubuntu',
    title: 'Ubuntu服务器',
    component: () => import('@/views/Server/Ubuntu/Ubuntu.vue'),
    meta: {
      title: 'Ubuntu服务器',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Terminal',
    title: '终端命令',
    component: () => import('@/views/Server/Terminal/Terminal.vue'),
    meta: {
      title: '终端命令',
      isSingle: false
    },
    children: null
  },
  {
    path: '/Algorithm',
    title: '算法',
    component: () => import('@/views/Algorithm/Algorithm.vue'),
    meta: {
      title: '算法',
      isSingle: true
    },
    children: null
  },
  {
    path: '/Test',
    title: '方便测试',
    component: () => import('@/views/Test/Test.vue'),
    meta: {
      title: '方便测试',
      isSingle: true
    },
    children: null
  }
];

export default asyncRouter;
