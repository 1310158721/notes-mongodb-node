<!-- 全局的富文本编辑器 -->
<template>
  <div class="editor" :id="id" />
</template>

<script>
import E from 'wangeditor';
import { mapMutations } from 'vuex';
export default {
  name: 'Editor',
  props: {
    // 避免同一页面有两个地方有 editor 而造成有相同的ID
    id: {
      type: String,
      default: 'editor'
    },
    // 初始文本，可接受带标签的形式
    defaultText: {
      type: String,
      default: `<p>欢迎使用<b>wangEditor</b> 富文本编辑器</p>`
    },
    // 额外添加菜单
    menus: {
      type: Array,
      default: () => []
    },
    // 图片上传服务器地址
    uploadPath: {
      type: String,
      default: '/api/uploadContent'
    },
    // 自定义上传参数
    params: {
      type: Object,
      default: null
    },
    // editor 的 zIndex，默认 100
    zIndex: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      // 固定的菜单配置
      fixedMunes: [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'justify', // 对齐方式
        'undo', // 撤销
        'redo', // 重复
        'image',
        'code'
      ],
      // 自定义字体
      fontNames: [
        '宋体',
        '微软雅黑',
        'Arial',
        'Tahoma',
        'Verdana'
      ]
    };
  },
  methods: {
    // 改变全局遮罩弹窗状态的函数
    ...mapMutations(['setGlobalMask'])
  },
  mounted () {
    this.editor = new E(`#${this.id}`);

    // 自定义菜单配置
    this.editor.customConfig.menus = [...this.fixedMunes, ...this.menus];

    // 隐藏“网络图片”tab
    this.editor.customConfig.showLinkImg = false;
    // 有上传服务器的地址则以图片形式保存，没有则以 base64 的形式保存
    if (this.uploadPath) {
      // 图片上传服务器地址
      this.editor.customConfig.uploadImgServer = this.uploadPath;
    } else {
      this.editor.customConfig.uploadImgShowBase64 = true;
    }
    // 通过 url 参数配置 debug 模式
    this.editor.customConfig.debug = location.href.indexOf('wangeditor_debug_mode=1') > 0;

    // editor 改变时
    this.editor.customConfig.onchange = () => {
      this.$emit('editorChange', this.editor);
    };

    // editor 获取焦点
    this.editor.customConfig.onfocus = () => {
      this.$emit('editorFocus', this.editor);
    };

    // editor 失焦
    this.editor.customConfig.onblur = () => {
      this.$emit('editorBlur', this.editor);
    };

    // 自定义字体
    this.editor.customConfig.fontNames = this.fontNames;

    this.editor.customConfig.uploadFileName = 'file';

    // 限制单次上传个数
    this.editor.customConfig.uploadImgMaxLength = 1;

    // 将图片大小限制为 1M
    this.editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024;

    // 自定义上传参数
    this.editor.customConfig.uploadImgParams = this.params;

    // 上传图片监控函数
    this.editor.customConfig.uploadImgHooks = {
      // 图片上传之前触发
      before: (xhr, editor, files) => {
        this.setGlobalMask({ loading: true, text: '图片上传中...' });
      },
      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // 但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错
      customInsert: (insertImg, result, editor) => {
        const url = result.result.url;
        insertImg(url);
        setTimeout(() => {
          this.setGlobalMask({ loading: false });
        }, 300);
      }
    };

    // 启动 editor
    this.editor.create();

    // 设置 editor 初始化文本
    this.editor.txt.html(this.defaultText);

    // editor 的 zIndex
    this.editor.customConfig.zIndex = this.zIndex;
  }
};
</script>

<style lang="less" scoped>
.editor {
  display: flex;
  height: 100%;
  min-width: 440px;
  flex-direction: column;
  /deep/.w-e-text-container {
    flex: 1;
    .w-e-text {
      overflow: auto;
    }
    img {
      width: 300px !important;
      display: block;
      margin: 5px 0;
    }
  }
}
</style>
