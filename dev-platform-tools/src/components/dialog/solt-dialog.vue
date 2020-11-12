<!--
 * @Author: Marlon
 * @Date: 2020-04-29 11:08:11
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-09 14:35:26
 * @Description: 自定义弹出框内容
 -->
<template>
  <el-dialog
    :title="SoltDigTitle"
    :visible.sync="soltDigVisible"
    :width="`${SoltDigWidth+''}px`"
    @close="close"
    class="tabs-dialog"
    :close-on-click-modal="false"
  >
    <slot name="soltDigContent"></slot>
    <span slot="footer" class="dialog-footer">
      <template v-for="(item, index) in soltDFootBtn">
        <Debounce time="1500" :key="index">
          <el-button
            size="medium"
            :key="index"
            :type="editButtonClassFn(item)"
            :class="editButtonClassFn(item)"
            :plain="item.plain || null"
            @click="FDEdit(item)"
          >{{item.label}}</el-button>
        </Debounce>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import Debounce from "@/components/debounce/index";

export default {
  components: { Debounce },
  props: {
    SoltDigShow: {
      type: Boolean,
      default: false
    },
    soltDFootBtn: {
      type: Array,
      default: function() {
        return [
          {
            label: "确定",
            css: "primary"
          }
        ];
      }
    },
    SoltDigTitle: {
      type: String,
      default: ""
    },
    SoltDigWidth: {
      type: [String, Number],
      default: function() {
        return 800;
      }
    }
  },
  data() {
    return {
      soltDigVisible: false,
      disabled: false
    };
  },
  watch: {
    SoltDigShow(newVal, oldVal) {
      this.soltDigVisible = newVal;
    }
  },
  methods: {
    // 关闭弹出框
    close() {
      this.$emit("editBtnCb", {
        label: "close",
        close: this.soltDigVisible
      });
    },
    // 按钮颜色配置
    editButtonClassFn(item) {
      let BtnClass = "";
      this.soltDFootBtn.forEach((element, index) => {
        if (item.label === element.label) {
          BtnClass = element.css || "";
          return;
        } else {
          return BtnClass;
        }
      });
      return BtnClass;
    },
    // 确定按钮
    FDEdit(edit) {
      if (edit.cb) {
        // this.disabled = true;
        edit.cb({
          Item: edit
        });
      } else {
        console.error("按钮配置中缺少回调函数(cb)");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";

.tabs-dialog {
  // TODO 编辑按钮配色
  .edit-button-color {
    &-1 {
      background: $table_edit_btn_bg;
      color: $table_edit_btn_color;
      &:hover,
      &:focus {
        color: $table_edit_btn_color_focus;
        border-color: $table_edit_btn_border_color;
        background-color: $table_edit_btn_bg_focus;
      }
      &:active {
        color: $table_edit_btn_color_active;
        border-color: $table_edit_btn_border_color_active;
        outline: 0;
      }
    }
  }
  /deep/ .el-dialog__header {
    background: $form_dialog_header_bg;
    padding: 8px;
    .el-dialog__title {
      font-size: 16px;
      color: $form_dialog_header_color;
    }
    .el-dialog__headerbtn {
      top: 10px;
      .el-icon-close {
        color: $form_dialog_header_color;
      }
    }
  }
}
</style>