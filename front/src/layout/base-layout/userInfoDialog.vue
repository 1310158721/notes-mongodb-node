<template>
  <el-dialog
    title="用户个人信息"
    append-to-body
    modal-append-to-body
    :visible.sync="UserInfosDialog"
    :close-on-click-modal='false'
    :close-on-press-escape='false'
    width="800px"
    :before-close="hideDialog"
    @open='openDialog'
  >
    <div class="is-editing">
      <h1 class="tip-text">是否编辑</h1>
      <el-switch class="switch" v-model="isEditing" active-text="编辑" inactive-text="查看" />
    </div>

    <!-- 仅查看 form -->
    <el-form
      v-if="infos && !isEditing"
      class="check-user-info-wrapper"
      ref="form"
      :model="infos"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="账号：">
        <span>{{ infos.Account }}</span>
      </el-form-item>
      <el-form-item label="密码：">
        <span>{{ infos.Password }}</span>
      </el-form-item>
      <el-form-item label="电话：">
        <span>{{ infos.Phone }}</span>
      </el-form-item>
      <el-form-item label="头像：">
        <span v-if="!infos.Avatar">暂无头像</span>
        <div v-else ref="viewer" class="v-viewer" v-viewer="{ movable: false }">
          <img @click="showViewer" class="avatar-pic" :src="infos.Avatar" />
        </div>
      </el-form-item>
      <el-form-item label="格言：">
        <span>{{ infos.Desc }}</span>
      </el-form-item>
    </el-form>

    <!-- 可编辑 form -->
    <div v-if="infos && isEditing">
      <el-form
        class="edit-user-info-wrapper"
        ref="editForm"
        :model="infos"
        label-width="80px"
        label-position="left"
        :rules="editRules"
        hide-required-asterisk
      >
        <el-form-item label="账号">
          <el-input v-model="infos.Account" disabled />
        </el-form-item>
        <el-form-item prop='Password'>
          <span slot='label'>
            密码<span class="red-star">*</span>
          </span>
          <el-input v-model="infos.Password" />
        </el-form-item>
        <el-form-item prop='Phone'>
          <span slot='label'>
            电话<span class="red-star">*</span>
          </span>
          <el-input v-model="infos.Phone" maxlength="11" />
        </el-form-item>
        <el-form-item prop='Avatar'>
          <span slot='label'>
            头像<span class="red-star">*</span>
          </span>
          <el-upload
            class="avatar-uploader"
            action="/api/uploadAvatar"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="infos.Avatar" :src="infos.Avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop='Desc'>
          <span slot='label'>
            格言<span class="red-star">*</span>
          </span>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="infos.Desc"
            :autosize="{ minRows: 5, maxRows: 10 }"
            maxlength="100"
            show-word-limit
            resize="none"
          />
        </el-form-item>
        <el-button type="primary" @click="updateUserInfo('editForm')">上传</el-button>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import { User } from '@/apis';
import { mapMutations } from 'vuex';
export default {
  name: 'UserInfosDialog',
  components: {},
  props: {
    infos: {
      type: Object,
      default: null
    },
    UserInfosDialog: {
      type: Boolean,
      default: false
    }
  },
  data  () {
    return {
      isEditing: false,
      originInfos: null,
      editRules: {
        Password: [
          { required: true, message: '请输入账号密码' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符' }
        ],
        Phone: [
          { required: true, message: '请输入手机号码' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确' }
        ],
        Avatar: [
          { required: true, message: '请上传一张图片作为头像' }
        ],
        Desc: [
          { required: true, message: '格言不能为空哦' },
          { max: 100, min: 2, message: '请输入2 ～ 100 个子的格言' }
        ]
      }
    };
  },
  methods: {
    // 改变全局遮罩弹窗状态的函数
    ...mapMutations(['setGlobalMask']),
    // 关闭弹窗
    hideDialog () {
      this.$emit('hideUserInfosDialog', JSON.parse(this.originInfos));
    },
    // 上传图片回调
    handleAvatarSuccess (res, file) {
      if (res.status === 0) {
        this.$emit('resetAvatar', res.result.url);
        setTimeout(() => {
          this.setGlobalMask({ loading: false });
        }, 500);
      }
    },
    // 图片上传前回调
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      this.setGlobalMask({ loading: true, text: '图片上传中...' });
      return isJPG && isLt2M;
    },
    // 弹窗上传信息按钮点击事件
    updateUserInfo (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.setGlobalMask({ loading: true, text: '保存中...' });
          User.UpdateUserInfo(this.infos).then(res => {
            setTimeout(() => {
              this.setGlobalMask({ loading: false });
              this.$emit('hideUserInfosDialog', this.infos);
            }, 500);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 显示 v-viewer，浏览头像
    showViewer () {
      const viewer = this.$el.querySelector('.v-viewer').$viewer;
      viewer.show();
    },
    // 打开弹窗
    openDialog () {
      this.isEditing = false;
    }
  },
  created () {
    // 保存初始信息，用于在不更新用户信息时回置
    this.originInfos = JSON.stringify(this.infos);
  }
};
</script>
<style lang='less' scoped>
/deep/.el-dialog__header {
  padding: 18px 20px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3);
}
/deep/.el-dialog__body {
  height: 599px;
  .is-editing {
    height: 40px;
    line-height: 40px;
    margin-bottom: 22px;
    display: flex;
    flex-direction: row;
    .tip-text {
      width: 80px;
      margin-right: 22px;
    }
    .switch {
      margin-top: 10px;
      flex: 1;
    }
  }
  .check-user-info-wrapper {
    /deep/.el-form-item__content {
      line-height: 0px;
      span {
        display: inline-block;
        min-height: 40px;
        line-height: 40px;
      }
    }
    .avatar-pic {
      display: block;
      width: 90px;
      height: 90px;
      background-color: black;
      border-radius: 6px;
      cursor: pointer;
    }
  }
  .edit-user-info-wrapper {
    .red-star {
      color:#F56C6C;
      margin-left: 4px;
    }
    /deep/.el-form-item__content {
      line-height: 0px;
    }
    .avatar-pic {
      display: block;
      width: 90px;
      height: 90px;
      background-color: black;
      margin-top: 10px;
    }
    /deep/.el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    /deep/.el-upload:hover {
      border-color: #409eff;
    }
    /deep/.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 88px;
      height: 88px;
      line-height: 88px;
      text-align: center;
    }
    /deep/.avatar {
      width: 88px;
      height: 88px;
      display: block;
    }
    .el-button {
      display: block;
      width: 200px;
      margin: 20px auto 0px;
    }
    /deep/.el-input__count {
      line-height: normal;
    }
  }
}
</style>
