<!--
 * @Author: Marlon
 * @Date: 2020-03-09 10:37:20
 * @LastEditors: Marlon
 * @LastEditTime: 2020-04-07 10:51:36
 * @Description: sql-弹出框
 -->
 <template>
  <el-dialog
    :title="SDTitle"
    :visible.sync="dialogVisible"
    :width="SDWidth?`${SDWidth}px`:null"
    @close="close"
    class="sql_dialog"
  >
    <el-input
      size="small"
      type="textarea"
      :autosize="{ minRows: SDAutosize.minRows, maxRows: SDAutosize.maxRows}"
      :placeholder="SDPlaceholder"
      v-model="textarea"
      disabled
    ></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button
        size="small"
        v-for="(item, index) in SDFoot"
        :key="index"
        :type="editButtonClassFn(item)"
        :class="editButtonClassFn(item)"
        @click="submit(item)"
      >{{item.label}}</el-button>
    </span>
  </el-dialog>
</template>
 
 <script>
import sqlFormatter from "sql-formatter";

export default {
  props: {
    SDTitle: {
      type: String,
      default: ""
    },
    SDVisible: {
      type: Boolean,
      default: false
    },
    SDWidth: {
      type: [String, Number],
      default: 0
    },
    SDAutosize: {
      type: Object,
      default: function() {
        return {
          minRows: 2,
          maxRows: 4
        };
      }
    },
    SDSql: {
      type: String,
      default: ""
    },
    SDSourceSql: {
      type: Array,
      default: function() {
        return [];
      }
    },
    SDPlaceholder: {
      type: String,
      default: ""
    },
    SDFoot: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      textarea: ""
    };
  },
  watch: {
    SDVisible: function(newVal) {
      this.dialogVisible = newVal;
    },
    SDSql: function(newVal) {
      this.textarea = sqlFormatter.format(newVal);
    }
  },
  methods: {
    // 编辑列按钮颜色配置
    editButtonClassFn(item) {
      let BtnClass = "";
      this.SDFoot.forEach((element, index) => {
        if (item.label === element.label) {
          BtnClass = element.css || "";
          return;
        } else {
          return BtnClass;
        }
      });
      return BtnClass;
    },
    // 关闭弹出框
    close() {
      this.$emit("editBtnCb", {
        label: "close",
        close: this.dialogVisible
      });
    },
    // 确定
    submit(item) {
      if (item.cb) {
        item.cb({ textarea: this.textarea, sourceSql: this.SDSourceSql });
      } else {
        console.error("按钮配置中缺少回调函数(cb)");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.sql_dialog {
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
