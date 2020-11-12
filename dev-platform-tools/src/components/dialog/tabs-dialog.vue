<!--
 * @Author: Marlon
 * @Date: 2020-04-27 15:36:43
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-09 14:37:45
 * @Description: 标签页弹出框
 -->

<template>
  <el-dialog
    :title="TabsDigTitle"
    :visible.sync="dialogTableVisible"
    width="800px"
    @close="close"
    class="tabs-dialog"
    :close-on-click-modal="false"
  >
    <slot name="tabs"></slot>
    <slot name="tabContent"></slot>
    <span slot="footer" class="dialog-footer">
      <template v-for="(item, index) in TabsDFootBtn">
        <Debounce time="1500" :key="index">
          <el-button
            size="medium"
            :key="index"
            :type="editButtonClassFn(item)"
            :class="editButtonClassFn(item)"
            @click="FDEdit(item)"
          >{{item.label}}</el-button>
        </Debounce>
      </template>
    </span>
    <slot name="table"></slot>
  </el-dialog>
</template>

<script>
import API from "api";
import Debounce from "@/components/debounce/index";
import { ResDatas } from "utils/res-format";

export default {
  components: { Debounce },
  props: {
    TabsDigShow: {
      type: Boolean,
      default: false
    },
    TabsDFootBtn: {
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
    TabsDigTitle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogTableVisible: false
    };
  },
  watch: {
    TabsDigShow(newVal, oldVal) {
      this.dialogTableVisible = newVal;
    }
  },
  methods: {
    // 关闭弹出框
    close() {
      this.$emit("editBtnCb", {
        label: "close",
        close: this.dialogTableVisible
      });
    },
    // 按钮颜色配置
    editButtonClassFn(item) {
      let BtnClass = "";
      this.TabsDFootBtn.forEach((element, index) => {
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
  .tabs {
    // height: 375px;
  }

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
  //  分页
  .pagination {
    margin: 15px 0;
  }
}
</style>