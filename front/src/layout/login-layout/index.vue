<!-- 登录界面 -->
<template>
  <div class="login-layout">
    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px" class="login-form">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="Account">
        <el-input type="text" placeholder="账号" v-model="loginForm.Account">
          <i slot="prefix" class="iconfont icon-zhanghao" />
        </el-input>
      </el-form-item>
      <el-form-item prop="Password">
        <el-input :type="canSeePsw ? 'text' : 'password'" placeholder="密码" v-model="loginForm.Password">
          <i slot="prefix" class="iconfont icon-mima" />
          <i class="handle-password iconfont" @click.prevent='handlePassword' slot="suffix" :class="canSeePsw ? 'icon-yanjing-biyan' : 'icon-kaiyanjing'" />
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Cookie from 'js-cookie';
import { User } from '@/apis';
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        Account: '',
        Password: ''
      },
      loginRules: {
        Account: [
          { required: true, message: '请输入账号名称' },
          { pattern: /^[A-z][0-9A-z]{0,}$/g, message: '只能输入数字和字母的组合，以字母开头' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符' }
        ],
        Password: [
          { required: true, message: '请输入账号密码' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符' }
        ]
      },
      canSeePsw: false
    };
  },
  methods: {
    handlePassword () {
      this.canSeePsw = !this.canSeePsw;
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          User.Login(this.loginForm).then((res) => {
            if (res.data.status === 0) {
              this.$router.push('/Dashboard');
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  created () {
    // 设置浏览器标签的标题
    document.title = this.$route.meta && this.$route.meta.title;
  }
};

</script>
<style lang='less' scoped>
.login-layout {
  width: 100vw;
  height: 100vh;
  background-color: #2d3a4b;
  position: relative;
  /deep/.login-form {
    width: 520px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .title {
      color: #eeeeee;
      font-size: 26px;
      text-align: center;
      font-weight: 700;
      margin-bottom: 40px;
    }
    .el-form-item {
      border: 1px solid hsla(0,0%,100%,.1);
      background: rgba(0,0,0,.1);
      border-radius: 5px;
      color: #454545;
    }
    .el-input__inner {
      background-color: transparent;
      border: none;
      outline: none;
    }
    .handle-password {
      cursor: pointer;
    }
    .iconfont {
      color: #2d3a4b;
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>
