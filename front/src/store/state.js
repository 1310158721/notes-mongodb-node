const state = {
  // 导航菜单参数
  menuList: undefined,
  // 全局Mask参数
  globalMask: {
    loading: false,
    text: ''
  },
  // 是否开启 Tags-View 组件
  isOpenTagsView: true,
  // 是否固定 Header Tags 组件
  isFixedHeader: true,
  // 菜单栏是否可伸缩
  canMenuListCollapse: true,
  // 是否显示面包屑功能
  isShowBreadcrumb: true
};

export default state;
