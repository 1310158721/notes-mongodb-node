const mutations = {
  setMenuList (state, data) {
    state.menuList = data;
  },
  setGlobalMask (state, data) {
    const { loading, text = '' } = data;
    state.globalMask.loading = loading;
    state.globalMask.text = text;
  }
};

export default mutations;
