<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-11-10 23:51:25
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-07 09:38:20
 * @Description: 弹框
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    :before-close="handleClose"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @close="close"
  >
    <slot></slot>
    <span slot="footer" class="dialog-footer" :isShow="isShow">
      <el-button class="dialog-submit" size="small" @click="submit_cz()">{{submitText}}</el-button>
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: this.propsDialogVisible
    };
  },
  watch: {
    propsDialogVisible() {
      this.dialogVisible = this.propsDialogVisible;
    }
  },
  props: {
    title: {
      type: String,
      default: "标题"
    },
    propsDialogVisible: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: [String, Number],
      default: "30%"
    },
    isShow: {
      type: Boolean,
      default: true
    },
    submitText: {
      type: String,
      default: '确 定'
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    handleClose(done) {
      done();
    },
    submit_cz() {
      this.$emit('submit');
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/platform/bd/config.scss";

/deep/ .el-dialog__header {
  height: 40px;
  background: $main_color;
}
/deep/ .el-dialog__footer{
  padding: 0 20px 20px;
}

.dialog-submit {
  background: $main_color;
  color: #fff;
}
</style>
