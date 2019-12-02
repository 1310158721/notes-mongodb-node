/**
 * 集中管理所有的 axios 请求
 * 一旦接口请求失败，则会再次发起请求，最多三次
 */
import { httpGet, httpPost } from '@/http/packageAxios';

/**
 * 用户 USER 相关
 * @Login 用户登录接口
 * @GetUserInfos 获取用户信息接口
 * @UpdateUserInfos 更新用户信息接口
 */
class USER {
  async Login (params = {}) {
    const res = await httpGet('/login', params);
    return res;
  }
  async GetUserInfos (params = {}) {
    const res = await httpGet('/getUserInfos', params);
    return res;
  }
  async UpdateUserInfo (data = {}) {
    const res = await httpPost('/updateUserInfo', data);
    return res;
  }
}
export const User = new USER();

/**
 * 导航菜单栏 MENULIST 相关接口
 */
class MENULIST {
  async GetMenuList (params = {}) {
    const res = await httpGet('/getMenuList', params);
    return res;
  }
}
export const menuList = new MENULIST();

/**
 * 笔记 Dashboard 相关接口
 * @GetDashboardList 查询 Dashboard 列表
 * @InsertDashboards 新增/更新 Dashboard 接口
 */
class DASHBOARD {
  async InsertDashboard (data = {}) {
    const res = await httpPost('/insertDashboardListItem', data);
    return res;
  }
  async GetDashboardList (params = {}) {
    const res = await httpGet('/getDashboardList', params);
    return res;
  }
  async DeleteDashboardList (params = {}) {
    const res = await httpGet('/deleteDashboardItem', params);
    return res;
  }
}
export const Dashboard = new DASHBOARD();

/**
 * 笔记 FS 相关接口
 * @GetFsList 查询 Fs 列表
 * @InsertFs 新增/更新 Fs 接口
 */
class FS {
  async InsertFs (data = {}) {
    const res = await httpPost('/insertFsListItem', data);
    return res;
  }
  async GetFsList (params = {}) {
    const res = await httpGet('/getFsList', params);
    return res;
  }
  async DeleteFsList (params = {}) {
    const res = await httpGet('/deleteFsItem', params);
    return res;
  }
}
export const Fs = new FS();

/**
 * 笔记 Es5 相关接口
 * @GetEs5List 查询 Es5 列表
 * @InsertEs5 新增/更新 Es5 接口
 * @DeleteEs5List 删除 Es5 接口
 */
class ES5 {
  async InsertEs5 (data = {}) {
    const res = await httpPost('/insertEs5ListItem', data);
    return res;
  }
  async GetEs5List (params = {}) {
    const res = await httpGet('/getEs5List', params);
    return res;
  }
  async DeleteEs5List (params = {}) {
    const res = await httpGet('/deleteEs5Item', params);
    return res;
  }
}
export const Es5 = new ES5();

/**
 * 笔记 Es6 相关接口
 * @GetEs6List 查询 Es6 列表
 * @InsertEs6 新增/更新 Es6 接口
 * @DeleteEs6List 删除 Es6 接口
 */
class ES6 {
  async InsertEs6 (data = {}) {
    const res = await httpPost('/insertEs6ListItem', data);
    return res;
  }
  async GetEs6List (params = {}) {
    const res = await httpGet('/getEs6List', params);
    return res;
  }
  async DeleteEs6List (params = {}) {
    const res = await httpGet('/deleteEs6Item', params);
    return res;
  }
}
export const Es6 = new ES6();

/**
 * 笔记 Vue 相关接口
 * @GetVueList 查询 Vue 列表
 * @InsertVue 新增/更新 Vue 接口
 * @DeleteVueList 删除 Vue 接口
 */
class MYVUE {
  async InsertVue (data = {}) {
    const res = await httpPost('/insertVueListItem', data);
    return res;
  }
  async GetVueList (params = {}) {
    const res = await httpGet('/getVueList', params);
    return res;
  }
  async DeleteVueList (params = {}) {
    const res = await httpGet('/deleteVueItem', params);
    return res;
  }
}
export const VUE = new MYVUE();

/**
 * 笔记 BaiduMap 相关接口
 * @GetBaiduMapList 查询 BaiduMap 列表
 * @InsertBaiduMap 新增/更新 BaiduMap 接口
 * @DeleteBaiduMapList 删除 BaiduMap 接口
 */
class BAIDUMAP {
  async InsertBaiduMap (data = {}) {
    const res = await httpPost('/insertBaiduMapListItem', data);
    return res;
  }
  async GetBaiduMapList (params = {}) {
    const res = await httpGet('/getBaiduMapList', params);
    return res;
  }
  async DeleteBaiduMapList (params = {}) {
    const res = await httpGet('/deleteBaiduMapItem', params);
    return res;
  }
}
export const BaiduMap = new BAIDUMAP();

/**
 * 笔记 Echarts 相关接口
 * @GetEchartsList 查询 Echarts 列表
 * @InsertEcharts 新增/更新 Echarts 接口
 * @DeleteEchartsList 删除 Echarts 接口
 */
class ECHARTS {
  async InsertEcharts (data = {}) {
    const res = await httpPost('/insertEchartsListItem', data);
    return res;
  }
  async GetEchartsList (params = {}) {
    const res = await httpGet('/getEchartsList', params);
    return res;
  }
  async DeleteEchartsList (params = {}) {
    const res = await httpGet('/deleteEchartsItem', params);
    return res;
  }
}
export const Echarts = new ECHARTS();

/**
 * 笔记 Express 相关接口
 * @GetExpressList 查询 Express 列表
 * @InsertExpress 新增/更新 Express 接口
 * @DeleteExpressList 删除 Express 接口
 */
class EXPRESS {
  async InsertExpress (data = {}) {
    const res = await httpPost('/insertExpressListItem', data);
    return res;
  }
  async GetExpressList (params = {}) {
    const res = await httpGet('/getExpressList', params);
    return res;
  }
  async DeleteExpressList (params = {}) {
    const res = await httpGet('/deleteExpressItem', params);
    return res;
  }
}
export const Express = new EXPRESS();

/**
 * 笔记 Webpack 相关接口
 * @GetWebpackList 查询 Webpack 列表
 * @InsertWebpack 新增/更新 Webpack 接口
 * @DeleteWebpackList 删除 Webpack 接口
 */
class WEBPACK {
  async InsertWebpack (data = {}) {
    const res = await httpPost('/insertWebpackListItem', data);
    return res;
  }
  async GetWebpackList (params = {}) {
    const res = await httpGet('/getWebpackList', params);
    return res;
  }
  async DeleteEWebpackList (params = {}) {
    const res = await httpGet('/deleteWebpackItem', params);
    return res;
  }
}
export const Webpack = new WEBPACK();

/**
 * 笔记 ElementUI 相关接口
 * @GetElementUIList 查询 ElementUI 列表
 * @InsertElementUI 新增/更新 ElementUI 接口
 * @DeleteElementUIList 删除 ElementUI 接口
 */
class ELEMENTUI {
  async InsertElementUI (data = {}) {
    const res = await httpPost('/insertElementUIListItem', data);
    return res;
  }
  async GetElementUIList (params = {}) {
    const res = await httpGet('/getElementUIList', params);
    return res;
  }
  async DeleteElementUIList (params = {}) {
    const res = await httpGet('/deleteElementUIItem', params);
    return res;
  }
}
export const MyElementUI = new ELEMENTUI();

/**
 * 笔记 Eslint 相关接口
 * @GetEslintList 查询 Eslint 列表
 * @InsertEslint 新增/更新 Eslint 接口
 * @DeleteEslintList 删除 Eslint 接口
 */
class ESLINT {
  async InsertEslint (data = {}) {
    const res = await httpPost('/insertEslintListItem', data);
    return res;
  }
  async GetEslintList (params = {}) {
    const res = await httpGet('/getEslintList', params);
    return res;
  }
  async DeleteEslintList (params = {}) {
    const res = await httpGet('/deleteEslintItem', params);
    return res;
  }
}
export const Eslint = new ESLINT();

/**
 * 笔记 VueCli 相关接口
 * @GetVueCliList 查询 VueCli 列表
 * @InsertVueCli 新增/更新 VueCli 接口
 * @DeleteVueCliList 删除 VueCli 接口
 */
class VUECLI {
  async InsertVueCli (data = {}) {
    const res = await httpPost('/insertVueCliListItem', data);
    return res;
  }
  async GetVueCliList (params = {}) {
    const res = await httpGet('/getVueCliList', params);
    return res;
  }
  async DeleteVueCliList (params = {}) {
    const res = await httpGet('/deleteVueCliItem', params);
    return res;
  }
}
export const VueCli = new VUECLI();

/**
 * 笔记 Tslint 相关接口
 * @GetTslintList 查询 Tslint 列表
 * @InsertTslint 新增/更新 Tslint 接口
 * @DeleteTslintList 删除 Tslint 接口
 */
class TSLINT {
  async InsertTslint (data = {}) {
    const res = await httpPost('/insertTslintListItem', data);
    return res;
  }
  async GetTslintList (params = {}) {
    const res = await httpGet('/getTslintList', params);
    return res;
  }
  async DeleteTslintList (params = {}) {
    const res = await httpGet('/deleteTslintItem', params);
    return res;
  }
}
export const Tslint = new TSLINT();

/**
 * 笔记 Mongodb 相关接口
 * @GetMongodbList 查询 Mongodb 列表
 * @InsertMongodb 新增/更新 Mongodb 接口
 * @DeleteMongodbList 删除 Mongodb 接口
 */
class MONGODB {
  async InsertMongodb (data = {}) {
    const res = await httpPost('/insertMongodbListItem', data);
    return res;
  }
  async GetMongodbList (params = {}) {
    const res = await httpGet('/getMongodbList', params);
    return res;
  }
  async DeleteMongodbList (params = {}) {
    const res = await httpGet('/deleteMongodbItem', params);
    return res;
  }
}
export const Mongodb = new MONGODB();

/**
 * 笔记 Css 相关接口
 * @GetCssList 查询 Css 列表
 * @InsertCss 新增/更新 Css 接口
 */
class MYCSS {
  async InsertCss (data = {}) {
    const res = await httpPost('/insertCssListItem', data);
    return res;
  }
  async GetCssList (params = {}) {
    const res = await httpGet('/getCssList', params);
    return res;
  }
  async DeleteCssList (params = {}) {
    const res = await httpGet('/deleteCssItem', params);
    return res;
  }
}
export const Css = new MYCSS();

/**
 * 笔记 Less 相关接口
 * @GetLessList 查询 Less 列表
 * @InsertLess 新增/更新 Less 接口
 */
class MYLESS {
  async InsertLess (data = {}) {
    const res = await httpPost('/insertLessListItem', data);
    return res;
  }
  async GetLessList (params = {}) {
    const res = await httpGet('/getLessList', params);
    return res;
  }
  async DeleteLessList (params = {}) {
    const res = await httpGet('/deleteLessItem', params);
    return res;
  }
}
export const Less = new MYLESS();

/**
 * 笔记 Sass 相关接口
 * @GetSassList 查询 Sass 列表
 * @InsertSass 新增/更新 Sass 接口
 */
class MYSASS {
  async InsertSass (data = {}) {
    const res = await httpPost('/insertSassListItem', data);
    return res;
  }
  async GetSassList (params = {}) {
    const res = await httpGet('/getSassList', params);
    return res;
  }
  async DeleteSassList (params = {}) {
    const res = await httpGet('/deleteSassItem', params);
    return res;
  }
}
export const Sass = new MYSASS();

/**
 * 笔记 Dom 相关接口
 * @GetDomList 查询 Dom 列表
 * @InsertDom 新增/更新 Dom 接口
 */
class MYDOM {
  async InsertDom (data = {}) {
    const res = await httpPost('/insertDomListItem', data);
    return res;
  }
  async GetDomList (params = {}) {
    const res = await httpGet('/getDomList', params);
    return res;
  }
  async DeleteDomList (params = {}) {
    const res = await httpGet('/deleteDomItem', params);
    return res;
  }
}
export const Dom = new MYDOM();

/**
 * 笔记 Ubuntu 相关接口
 * @GetUbuntuList 查询 Ubuntu 列表
 * @InsertUbuntu 新增/更新 Ubuntu 接口
 */
class UBUNTU {
  async InsertUbuntu (data = {}) {
    const res = await httpPost('/insertUbuntuListItem', data);
    return res;
  }
  async GetUbuntuList (params = {}) {
    const res = await httpGet('/getUbuntuList', params);
    return res;
  }
  async DeleteUbuntuList (params = {}) {
    const res = await httpGet('/deleteUbuntuItem', params);
    return res;
  }
}
export const Ubuntu = new UBUNTU();

/**
 * 笔记 Terminal 相关接口
 * @GetTerminalList 查询 Terminal 列表
 * @InsertTerminal 新增/更新 Terminal 接口
 */
class TERMINAL {
  async InsertTerminal (data = {}) {
    const res = await httpPost('/insertTerminalListItem', data);
    return res;
  }
  async GetTerminalList (params = {}) {
    const res = await httpGet('/getTerminalList', params);
    return res;
  }
  async DeleteTerminalList (params = {}) {
    const res = await httpGet('/deleteTerminalItem', params);
    return res;
  }
}
export const Terminal = new TERMINAL();

/**
 * 笔记 Algorithm 相关接口
 * @GetAlgorithmList 查询 Algorithm 列表
 * @InsertAlgorithm 新增/更新 Algorithm 接口
 */
class ALGORITHM {
  async InsertAlgorithm (data = {}) {
    const res = await httpPost('/insertAlgorithmListItem', data);
    return res;
  }
  async GetAlgorithmList (params = {}) {
    const res = await httpGet('/getAlgorithmList', params);
    return res;
  }
  async DeleteAlgorithmList (params = {}) {
    const res = await httpGet('/deleteAlgorithmItem', params);
    return res;
  }
}
export const Algorithm = new ALGORITHM();
