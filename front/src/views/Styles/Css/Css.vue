<template>
  <div class="total-wrapper" v-loading='!list'>
    <div class="conditions-wrapper">
      <div class="other-condition">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size='small'
          :picker-options='pickerOptions'
          @change='pickerChange'
        />
      </div>
      <div class="search">
        <el-input size='small'
          type='text'
          placeholder='搜索标题/描述/标签/内容'
          v-model="postParams.keyword"
          @keyup.enter.native='search'
        />
        <el-button size='small' type='primary' @click='search'>搜索</el-button>
      </div>
    </div>
    <div class="collapse-wrapper">
      <div class="no-data" v-if='list && !list.length'>
        <div>暂无数据</div>
        <el-button type='success' size='mini' @click='addItem'>新 增</el-button>
      </div>
      <el-collapse v-if='list && list.length' accordion>
        <template v-for='(i, index) in list'>
          <el-collapse-item :key='i.id'>
              <template slot="title">
                <!-- onselectstart 禁止双击选中文本 -->
                <div class="collapse-title" onselectstart="return false;">
                  <span class="title-text">{{ i.Title }}</span>
                  <span class="title-operation">
                    <el-button type='text' size='mini' @click.stop='delItem(i._id)'>删除</el-button>
                    <el-button type='text' size='mini' @click.stop='editing(i, index)'>修改</el-button>
                  </span>
                </div>
              </template>
              <div>
                简要描述：{{ i.Desc }}
              </div>
              <div>
                标签分类：<el-tag type="success" size='mini' v-for=' tag in i.Tag' :key='tag.id'>{{ tag }}</el-tag>
              </div>
              <div>
                创建时间：{{ i.CreatedTime | format }}
              </div>
              <div class="content" v-html="i.Content" v-viewer></div>
            </el-collapse-item>
        </template>
      </el-collapse>
    </div>
    <div class="pagination-wrapper" v-if='list && list.length'>
      <el-button type='primary' size='small' @click='addItem'>新增</el-button>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="postParams.Page"
        :page-sizes="[10, 20, 50]"
        :page-size="postParams.Size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listCount">
      </el-pagination>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="800px"
      append-to-body
      modal-append-to-body
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :before-close="handleClose"
      :show-close='!isPushing'
    >
      <el-form
        :model='formData'
        label-position='left'
        label-width="90px"
        hide-required-asterisk
        ref='Form'
      >
        <el-form-item prop="Title" size='small'>
          <span slot='label'>
            标题
          </span>
          <el-input size='small' v-model="formData.Title" />
        </el-form-item>
        <el-form-item prop="Desc" size='small'>
          <span slot='label'>
            描述
          </span>
          <el-input size='small' v-model="formData.Desc" />
        </el-form-item>
        <el-form-item prop="Tag" size='small'>
          <span slot='label'>
            标签
          </span>
          <template>
            <el-tag
              :key="tag.id"
              v-for="tag in formData.Tag"
              closable
              :disable-transitions="false"
              @close="tagHandleClose(tag)"
              :type='randomTagType()'
            >
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-if='!inputVisible && formData.Tag.length < 3' class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </template>
        </el-form-item>
        <el-form-item size='small' v-if='id'>
          <span slot='label'>
            创建时间
          </span>
          <el-input disabled size='small' v-model="formData.CreatedTime" />
        </el-form-item>
        <el-form-item prop="Content" size='small'>
          <span slot='label'>
            内容
          </span>
          <editor
            id='dialog'
            :defaultText='formData.Content'
            @editorChange='dialogEditorChange'
            :params='{directory: "Css"}'
            v-if="dialogVisible"
          />
        </el-form-item>
        <div class="dialog-save">
          <el-button type='primary' size='small' @click='dialogSave' :loading='isPushing'>保 存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Css } from '@/apis';
import Editor from '@/components/Editor/Editor';
import moment from 'moment';
export default {
  name: 'Css',
  components: {
    Editor
  },
  props: {},
  data () {
    return {
      // 列表请求参数
      postParams: {
        Page: 1,
        Size: 20,
        keyword: null,
        startTime: null,
        endTime: null
      },
      list: null,
      listCount: null,
      dialogVisible: false,
      id: null,
      // 列表单行数据的原内容，用户撤销修改的数据恢复
      freezeRow: null,
      // 列表单行数据的下表
      rowIndex: null,
      inputVisible: false,
      inputValue: '',
      // 列表单行数据的当前内容
      formData: {
        Title: '',
        Desc: '',
        Tag: [],
        CreatedTime: '',
        Content: '<p>默认文本</p>'
      },
      // 是否上传数据中
      isPushing: false
    };
  },
  computed: {
    // 弹窗标题
    dialogTitle () {
      return this.id ? '编辑' : '新增';
    },
    // 日期控件的限制筛选参数
    pickerOptions () {
      return {
        disabledDate (time) {
          return new Date().getTime() < time.getTime();
        },
        // 指定日期追加类名
        cellClassName (time) {
          if (moment(new Date()).format('YYYY-MM-DD') === moment(time).format('YYYY-MM-DD')) {
            return 'date-picker-current';
          }
        }
      };
    },
    date: {
      get () {
        if (!this.postParams.startTime || !this.postParams.endTime) {
          return null;
        }
        return [ this.postParams.startTime, this.postParams.endTime ];
      },
      set (val) {
        if (val) {
          this.postParams.startTime = moment(val[0]).format('YYYY-MM-DD');
          this.postParams.endTime = moment(val[1]).format('YYYY-MM-DD');
        } else {
          this.postParams.startTime = null;
          this.postParams.endTime = null;
        }
      }
    }
  },
  methods: {
    // 获取list数据
    getList () {
      this.list = null;
      Css.GetCssList(this.postParams).then((res) => {
        // 模拟接口请求延时
        setTimeout(() => {
          if (res.data.status === 0) {
            this.list = res.data.result;
            this.listCount = res.data.count;
            this.formData = {
              Title: '',
              Desc: '',
              Tag: [],
              CreatedTime: '',
              Content: '<p>默认文本</p>'
            };
          } else {
            this.$message.warning(res.data.msg);
          }
        }, 500);
      });
    },
    // 改变分页器的Size
    handleSizeChange (val) {
      this.postParams.Size = val;
      this.getList();
    },
    // 改变分页器的Page
    handleCurrentChange (val) {
      this.postParams.Page = val;
      this.getList();
    },
    // 关闭新增/编辑弹窗
    handleClose () {
      this.dialogVisible = false;
      this.$set(this.list, this.rowIndex, JSON.parse(this.freezeRow));
    },
    // 删除Tag标签
    tagHandleClose (tag) {
      this.formData.Tag.splice(this.formData.Tag.indexOf(tag), 1);
    },
    // Tag 的随机 type
    randomTagType () {
      const random = Math.ceil(Math.random() * 4);
      switch (random) {
        case 1:
          return 'success';
        case 2:
          return 'info';
        case 3:
          return 'warning';
        case 4:
          return 'danger';
        default:
          return null;
      }
    },
    // 显示标签的input输入框
    showInput () {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 确认标签的输入狂内容
    handleInputConfirm () {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.formData.Tag.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 弹窗 Editor 内容改变
    dialogEditorChange (editor) {
      this.$set(this.formData, 'Content', editor.txt.html());
    },
    // 检查参数是否符合条件
    checkFormData () {
      return new Promise((resolve) => {
        if (this.formData.Title === '') {
          this.$message.warning('标题不能为空');
          return false;
        }
        if (this.formData.Desc === '') {
          this.$message.warning('描述不能为空');
          return false;
        }
        if (!this.formData.Tag.length) {
          this.$message.warning('标签不能为空');
          return false;
        }
        if (this.formData.Content === '') {
          this.$message.warning('内容不能为空');
          return false;
        }
        resolve();
      });
    },
    // 新增/编辑弹窗内容上传按钮
    dialogSave () {
      this.checkFormData().then(() => {
        this.isPushing = true;
        // 是否为编辑模式，id来判断
        Css.InsertCss(Object.assign({}, this.formData, { id: this.id })).then((res) => {
          setTimeout(() => {
            this.isPushing = false;
            this.dialogVisible = false;
            if (!this.id) {
              this.postParams = {
                Page: 1,
                Size: 20,
                keyword: null,
                startTime: null,
                endTime: null
              };
            }
            this.getList();
          }, 1000);
        });
      });
    },
    // 新增按钮
    addItem () {
      this.dialogVisible = true;
      this.formData = {
        Title: '',
        Desc: '',
        Tag: [],
        CreatedTime: '',
        Content: '<p>默认文本</p>'
      };
      this.id = null;
    },
    // 删除列表数据
    delItem (id) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Css.DeleteCssList({ id })
          .then((res) => {
            this.dialogVisible = false;
            this.postParams = {
              Size: 20,
              Page: 1,
              keyword: null,
              startTime: null,
              endTime: null
            };
            this.getList();
          })
          .catch((err) => {
            console.log(err);
          });
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 编辑列表内容
    editing (item, index) {
      const row = item;
      this.rowIndex = index;
      this.freezeRow = JSON.stringify(row);
      this.id = row._id;
      this.dialogVisible = true;
      this.formData = Object.assign({}, row);
    },
    // 关键子搜索
    search () {
      this.date = null;
      this.postParams.Page = 1;
      this.postParams.Size = 20;
      this.getList();
    },
    // 时间段筛选
    pickerChange () {
      this.postParams.keyword = null;
      this.postParams.Page = 1;
      this.postParams.Size = 20;
      this.getList();
    }
  },
  created () {
    this.getList();
  },
  filters: {
    // 时间过滤器
    format (val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss');
    }
  }
};
</script>

<style lang="less" scoped>
.total-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px rgba(0,0,0,.2);
  .conditions-wrapper {
    height: 52px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    position: relative;
    z-index: 1000;
    box-shadow: 0px 0px 10px rgba(0,0,0,.2);
    .other-condition {
      flex: 1;
      .el-date-editor {
        width: 250px;
      }
    }
    .search {
      width: 300px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .el-input {
        flex: 1;
      }
      .el-button {
        width: 80px;
        margin-left: 10px;
      }
    }
  }
  .collapse-wrapper {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    position: relative;
    .no-data {
      display: inline-block;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      div {
        margin-bottom: 10px;
      }
    }
    /deep/.el-collapse-item__header {
      &:hover, &.is-active {
        .collapse-title {
          background-color: rgba(0,0,255,.1);
          box-shadow: 0px 0px 10px rgba(0,0,0,.15);
        }
      }
      i {
        display: none;
      }
      .collapse-title {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        padding: 0px 10px;
        .title-text {
          flex: 1;
        }
      }
    }
    /deep/.el-collapse-item__content {
      padding: 20px;
      background-color: rgba(0,0,255,.02);
      & > div {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .content {
        box-shadow: 0px 0px 10px rgba(0,0,0,.2);
        padding: 10px;
        border-radius: 3px;
        img {
          height: 200px;
          display: block;
          margin: 5px 0;
          cursor: pointer;
        }
      }
    }
  }
  .pagination-wrapper {
    height: 52px;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    z-index: 1000;
    box-shadow: 0px 0px 10px rgba(0,0,0,.2);
    .el-pagination {
      float: right;
    }
  }
}

.el-dialog {
  .dialog-save {
    text-align: center;
    .el-button {
      width: 200px;
    }
  }
}

/deep/.el-tag {
  margin-right: 10px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}
</style>
