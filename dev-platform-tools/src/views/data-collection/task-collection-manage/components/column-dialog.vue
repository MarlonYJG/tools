<!--
 * @Author: Marlon
 * @Date: 2020-02-19 10:06:12
 * @LastEditors: Marlon
 * @LastEditTime: 2020-03-18 22:33:59
 * @Description: 设置数据源
 --> 
<template >
  <el-dialog
    title="设置数据源"
    :visible.sync="dialogTableVisible"
    width="600px"
    @close="close"
    class="column-dialog"
  >
    <!-- 操作行 -->
    <ul class="area-title-btn">
      <li v-for="(item, index) in HearderBtn" :key="index">
        <el-button
          size="small"
          :type="item.classType || null"
          @click="headerBtn(item)"
        >{{item.label}}</el-button>
      </li>
    </ul>
    <!-- 多列展示层 -->
    <el-form :model="form" class="ColDialog">
      <el-form-item label="数据来源：" label-width="100px">
        <ul class="area-change">
          <li>
            <el-select
              v-model="sourceTypeKey"
              filterable
              placeholder
              size="small"
              @change="handlechange({type:'source'},$event)"
            >
              <el-option
                v-for="(item, j) in sourceTypeList"
                :key="j"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <el-select v-model="sourceKey" filterable placeholder size="small">
              <el-option
                v-for="(item, j) in sourceList"
                :key="j"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="数据去向：" label-width="100px">
        <ul class="area-change">
          <li>
            <el-select
              v-model="targetTypeKey"
              filterable
              placeholder
              size="small"
              @change="handlechange({type:'target'},$event)"
            >
              <el-option
                v-for="(item, j) in sourceTypeList"
                :key="j"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <el-select v-model="targeKey" filterable placeholder size="small">
              <el-option
                v-for="(item, j) in targetList"
                :key="j"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="medium" type="primary" @click="submitBtn">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import API from "api/index";
import { ResDatas } from "utils/res-format";
export default {
  props: {
    ColDialogVisible: {
      type: Boolean,
      default: false
    },
    HearderBtn: {
      type: Array,
      defaultVal: function() {
        return [];
      }
    },
    SourceId: {
      type: [String, Number],
      defaultVal: 0
    },
    TargetId: {
      type: [String, Number],
      defaultVal: 0
    },
    SourceListId: {
      type: [String, Number],
      defaultVal: 0
    },
    TargeListId: {
      type: [String, Number],
      defaultVal: 0
    }
  },

  data() {
    return {
      // 控制弹出框显示
      dialogTableVisible: false,
      // 表单
      form: {},
      sourceTypeKey: "",
      sourceKey: "",
      targetTypeKey: "",
      targeKey: "",
      sourceTypeList: [],
      sourceList: [],
      targetList: []
    };
  },
  watch: {
    ColDialogVisible(newVal) {
      this.dialogTableVisible = newVal;
    },
    SourceId: function(newVal) {
      this.sourceTypeKey = newVal;
      this.sourceList = [];
      if (newVal === 0 || newVal) {
        this.getDataSourceList(newVal);
      }
    },
    TargetId: function(newVal) {
      this.targetTypeKey = newVal;
      this.targetList = [];
      if (newVal == 0 || newVal) {
        this.getDataTargetList(newVal);
      }
    },
    SourceListId: function(newVal) {
      if (newVal === 0 || newVal) {
        this.sourceKey = newVal;
      }
    },
    TargeListId: function(newVal) {
      if (newVal === 0 || newVal) {
        this.targeKey = newVal;
      }
    }
  },
  methods: {
    // 提交
    submitBtn() {
      this.$emit("submit", {
        sourceTypeKey: this.sourceTypeKey,
        targetTypeKey: this.targetTypeKey,
        sourceKey: this.sourceKey,
        targeKey: this.targeKey
      });
    },
    // 关闭弹出框
    close() {
      this.$emit("editBtnCb", {
        label: "close",
        close: this.dialogTableVisible
      });
    },
    // 头部操作
    headerBtn(btnObj) {
      if (btnObj.cb) {
        btnObj.cb();
        this.dialogTableVisible = false;
      } else {
        console.error("按钮配置中缺少回调函数(cb)");
      }
    },
    handlechange({ type }, value) {
      switch (type) {
        case "source":
          this.getDataSourceList(value);
          this.sourceKey = "";
          return;
        case "target":
          this.getDataTargetList(value);
          this.targeKey = "";
          return;
        default:
          break;
      }
    },
    // 数据源类型列表
    getSourceDataList() {
      API._sourceDataType({
        name: "datasource_type"
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 200,
          error: "获取数据源类型列表失败!"
        }).init();
        let sourceArr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            sourceArr.push({
              label: item.name,
              value: item.code
            });
          });
        }
        this.sourceTypeList = sourceArr;
      });
    },
    // 数据源列表(根据数据源类型请求)
    getDataSourceList(source) {
      API._publicSourceData({
        datasourceType: source
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 200
        }).init();
        let sourceArr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            sourceArr.push({
              label: item.datasourceName,
              value: item.id
            });
          });
        }
        this.sourceList = sourceArr;
      });
    },
    getDataTargetList(target) {
      API._publicSourceData({
        datasourceType: target
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 200
        }).init();
        let targetArr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            targetArr.push({
              label: item.datasourceName,
              value: item.id
            });
          });
        }
        this.targetList = targetArr;
      });
    }
  },
  mounted() {
    this.getSourceDataList();
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.column-dialog {
  // 操作行
  .area {
    &-title-btn {
      overflow: hidden;
      & > li {
        float: left;
        height: 36px;
        line-height: 35px;
        margin: 10px 10px;
        padding: 0 10px;
      }
    }
    &-change {
      overflow: hidden;
      & > li {
        float: left;
        height: 41px;
        box-sizing: border-box;
        margin: 0 10px;
        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  // 表单容器
  .ColDialog {
    max-height: 167px;
    overflow-x: hidden;
    overflow-y: auto;
    .input-n {
      overflow: hidden;
      display: flex;
      margin: 0 auto;
      text-align: center;
      & > li {
        float: left;
        flex: 1;
      }
    }
    .area-type {
      width: 100%;
      max-height: 126px;
      box-sizing: border-box;
      //   border: 1px solid red;
      overflow-x: hidden;
      overflow-y: auto;
      &-list {
        width: 35%;
        float: left;
      }
      &- {
        width: 10%;
        float: left;
      }
      &-icon-add {
        margin-right: 5px;
        font-size: 20px;
        cursor: pointer;
        margin-top: 10px;
        &:hover {
          color: green;
        }
      }
      &-icon-del {
        font-size: 20px;
        cursor: pointer;
        margin-top: 10px;
        &:hover {
          color: red;
        }
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