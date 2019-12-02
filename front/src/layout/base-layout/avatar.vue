<template>
  <div>
    <el-dropdown v-if='infos' trigger='click' @command='selectDropdown'>
      <img class="el-dropdown-link" :src='infos.Avatar' />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command='1'>个人中心</el-dropdown-item>
        <el-dropdown-item command='2'>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <user-infos-dialog
      v-if='infos'
      :infos='infos'
      :UserInfosDialog='UserInfosDialog'
      @hideUserInfosDialog='hideUserInfosDialog'
      @resetAvatar='resetAvatar'
    />
  </div>
</template>

<script>
import Cookie from 'js-cookie';
import { User } from '@/apis';
import UserInfosDialog from '@/layout/base-layout/userInfoDialog';
export default {
  name: 'HeaderAvatar',
  components: {
    UserInfosDialog
  },
  data () {
    return {
      UserInfosDialog: false,
      infos: null
    };
  },
  methods: {
    // 获取用户信息
    getUserInfos () {
      return new Promise((resolve) => {
        User.GetUserInfos().then((res) => {
          if (res.data.status === 0) {
            this.infos = res.data.result;
            resolve();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      });
    },
    // 选中下拉项
    selectDropdown (val) {
      switch (val) {
        case '1':
          this.goUserCenter();
          break;
        case '2':
          this.loginOut();
          break;
      }
    },
    // 跳转个人中心
    goUserCenter () {
      this.UserInfosDialog = true;
    },
    // 退出登录
    loginOut () {
      // 清除缓存并跳转登录界面
      Cookie.remove('TOKEN');
      this.$router.replace('/login');
    },
    // 重置头像地址
    resetAvatar (url) {
      this.infos.Avatar = url;
    },
    // 子组件关闭弹窗回调
    hideUserInfosDialog (infos) {
      this.infos = infos;
      this.UserInfosDialog = false;
    }
  },
  created () {
    this.getUserInfos();
  }
};

</script>
<style lang='less' scoped>
.el-dropdown {
  width: 98px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  box-sizing: border-box;
  position: relative;
  .el-dropdown-link {
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: black;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -25px 0 0 -25px;
    cursor: pointer;
  }
}
/deep/.el-dropdown-menu {
  left: 800px !important;
}
</style>
