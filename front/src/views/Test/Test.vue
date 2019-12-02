<template>
  <div>
    <el-button @click='dialogVisible = true'>click</el-button>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="840px">
      <div class="editor-wrapper">
        <Editor
          id='editor'
          :menus='menus'
          ref='editor'
        />
      </div>
      <el-button @click='handleClick'>show</el-button>
    </el-dialog>
  </div>
</template>

<script>
import Editor from '@/components/Editor/Editor';
export default {
  name: 'Note',
  components: {
    Editor
  },
  data () {
    return {
      dialogVisible: false,
      menus: ['image']
    };
  },
  methods: {
    handleClick () {
      const editor = this.$refs.editor.editor;
      console.log(editor.txt.html());
    }
  }
};

</script>
<style lang='less' scoped>
.editor-wrapper {
  width: 800px;
  height: 500px;
  position: relative;
}
</style>
