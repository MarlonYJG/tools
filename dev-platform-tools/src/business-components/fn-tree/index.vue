<!--
 * @Author: Marlon
 * @Date: 2020-05-27 14:00:44
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-02 10:56:55
 * @Description: 业务组件 - 算法规则树
--> 
<template>
  <el-dialog
    :title="TreeDigTitle"
    :visible.sync="treeDigVisible"
    :width="`${TreeDigWidth+''}px`"
    @close="close"
    :close-on-click-modal="false"
    class="fn-tree-dialog"
  >
    <div class="business-fn-tree">
      <ul class="conf-query">
        <li>
          <label for>字段名称：</label>
          <el-input placeholder="请输入内容" v-model="fieldName" clearable size="small"></el-input>
        </li>
        <li>
          <label for>字段类型：</label>
          <el-select v-model="fieldType" placeholder="请选择" size="small">
            <el-option
              v-for="item in fieldTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <label for>说明：</label>
          <el-input placeholder="请输入内容" v-model="fieldComent" clearable size="small"></el-input>
        </li>
      </ul>
      <div class="conf-area">
        <!-- 左侧列表 -->
        <ul class="lt">
          <li
            v-for="(item, index) in ltList"
            :key="index"
            @click="ltfn(item)"
            :class="index+1 == ltActive.value? 'lt-active':''"
          >{{item.label}}</li>
        </ul>
        <!-- 自定义算法 -->
        <div class="algorithm" v-if="ltActive.value ==1">
          <div class="fnTree">
            <el-tree
              :data="treeData"
              :props="treeDefaultProps"
              default-expand-all
              :highlight-current="true"
              @node-click="handleFnNodeClick"
              class="fnTree-bg"
            ></el-tree>
          </div>
          <div class="fnCof">
            <p>{{rtCfg.title}}</p>
            <el-form label-width="100px" size="small">
              <template v-for="(item, index) in rtCfg.list">
                <el-form-item
                  v-if="item.type == 'select'"
                  :key="index"
                  :label="`${item.label}：`"
                  :prop="item.prop"
                  style="padding-left: 15px;"
                >
                  <el-select
                    v-model="item.defaultVal"
                    :placeholder="item.placeholder"
                    style="width: 145px;float: left;margin-right: 11px;"
                  >
                    <el-option
                      v-for="(item_, i) in rtCfgOption"
                      :key="i"
                      :label="item_.label"
                      :value="item_.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-form>
          </div>
        </div>
        <!-- 分组赋值 -->
        <div class="group-init" v-if="ltActive.value ==3">
          <div class="field">
            <label for>赋值字段：</label>
            <el-select v-model="fieldsVal" placeholder="请选择">
              <el-option
                v-for="item in rtCfgOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="group">
            <el-button type="primary" @click="addGroup">添加分组</el-button>
            <ul class="group-list">
              <li v-for="(item, index) in groupList" :key="index">
                <el-input
                  v-model="item.dictName"
                  placeholder="请输入分组名称"
                  style="width: 200px;margin-right: 15px;"
                ></el-input>
                <el-input v-model="item.startVal" style="width: 110px;"></el-input>
                <span>
                  <span>&lt;</span>
                  <span style="margin: 0 15px;">值</span>
                  <span>&le;</span>
                </span>
                <el-input v-model="item.endVal" style="width: 110px;"></el-input>
                <b class="el-icon-remove-outline" @click="delGroup(index)"></b>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <template v-for="(item, index) in TreeDigFootBtn">
        <el-button
          size="medium"
          :key="index"
          :type="editButtonClassFn(item)"
          :class="editButtonClassFn(item)"
          @click="FDEdit(item)"
        >{{item.label}}</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import API from "api";
import { ResDatas } from "utils/res-format";

export default {
  props: {
    TreeDigShow: {
      type: Boolean,
      default: false,
    },
    TreeDigFootBtn: {
      type: Array,
      default: function () {
        return [
          {
            label: "确定",
            css: "primary",
          },
        ];
      },
    },
    TreeDigTitle: {
      type: String,
      default: "",
    },
    TreeDigWidth: {
      type: [String, Number],
      default: function () {
        return 800;
      },
    },
    TreeDigData: {
      type: [String, Object, Array],
      default: function () {
        return "";
      },
    },
  },
  data() {
    return {
      treeDigVisible: false,
      fieldName: "",
      fieldType: "",
      fieldComent: "",
      fieldTypeOptions: [],
      // 左侧列表
      treeData: [],
      treeDefaultProps: {
        children: "children",
        label: "label",
      },
      ltList: [
        {
          label: "自定义算法",
          value: 1,
        },
        {
          label: "公式/函数",
          value: 2,
        },
        {
          label: "分组赋值",
          value: 3,
        },
      ],
      ltActive: {
        label: "自定义算法",
        value: 1,
      },
      // 中间树
      midTree: [],
      treeActive: "",
      // 右侧配置
      rtCfg: {
        title: "",
        list: [],
      },
      // 右侧配置 下拉
      rtCfgOption: [],
      // 分组赋值
      fieldsVal: "",
      groupList: [],
    };
  },
  watch: {
    TreeDigShow(newVal, oldVal) {
      this.treeDigVisible = newVal;
    },
  },
  methods: {
    // 按钮颜色配置
    editButtonClassFn(item) {
      let BtnClass = "";
      this.TreeDigFootBtn.forEach((element, index) => {
        if (item.label === element.label) {
          BtnClass = element.css || "";
          return;
        } else {
          return BtnClass;
        }
      });
      return BtnClass;
    },
    // 激活树
    handleFnNodeClick(data) {
      this.treeActive = data;
      if (data.label) {
        this.$set(this.rtCfg, `title`, data.label);
      }
      console.log(data);
      if (data && data.paramList) {
        this.$set(
          this.rtCfg,
          `list`,
          JSON.parse(JSON.stringify(data.paramList))
        );
      }
    },
    // 左侧 激活
    ltfn(item) {
      this.ltActive = item;
    },
    loop(arr, functionId = "") {
      if (arr && arr.length) {
        arr.forEach((item) => {
          if (item.functionId) {
            item["id"] = item.functionId;
            item["label"] = item.functionName;
          } else {
            item["id"] = item.paramId + "_" + functionId;
            item["label"] = item.paramName;
            item["value"] = "";
            item["type"] = "select";
            item["prop"] = item.paramId + "_prop";
            item["defaultVal"] = "";
            item["option"] = [];
          }
          if (item.paramList && item.paramList.length) {
            this.loop(item.paramList, item.id);
          }
        });
      }
    },
    // 添加分组
    addGroup() {
      if (this.fieldsVal) {
        let fieldType = "";
        this.rtCfgOption.forEach((item) => {
          if (this.fieldsVal === item.value) {
            fieldType = item.dataType;
          }
        });
        if (
          "decimal" === fieldType ||
          "integer" === fieldType ||
          "long" === fieldType
        ) {
          const obj_ = {
            dictName: "",
            startVal: "",
            endVal: "",
          };
          this.groupList.push(obj_);
        } else {
          this.$message({
            message: "请选择数值类型字段进行分组",
            type: "warning",
          });
        }
      } else {
        this.$message({
          message: "请选择字段",
          type: "warning",
        });
      }
    },
    // 删除分组
    delGroup(i) {
      this.groupList.splice(i, 1);
    },

    /* 事件 */
    // 关闭弹出框
    close() {
      this.$emit("closeTreeDig", {
        label: "close",
        close: this.treeDigVisible,
      });
    },
    // 确定按钮
    FDEdit(edit) {
      if (edit.cb) {
        if (this.$route.query && this.$route.query.row) {
          const { id } = JSON.parse(this.$route.query.row);
          let children = this.TreeDigData[0].children;
          if (this.fieldName && this.fieldType && this.fieldComent) {
            if (children) {
              for (let index = 0; index < children.length; index++) {
                if (this.fieldName == children[index].columnCode) {
                  this.$message({
                    message: "字段名已存在",
                    type: "warning",
                  });
                  return;
                }
              }
              let cbVal = {};
              if (this.ltActive && this.ltActive.value == 1) {
                // 字段信息
                let functionParam = [];
                let selectValList = [];
                this.rtCfgOption.forEach((item) => {
                  this.rtCfg.list.forEach((item_) => {
                    if (item.columnName == item_.defaultVal) {
                      selectValList.push(item);
                    }
                  });
                });
                this.rtCfg.list.forEach((item, index) => {
                  functionParam.push({
                    paramId: item.prop.split("_prop")[0],
                    paramType: selectValList[index].dataType,
                    paramValue: item.defaultVal,
                  });
                });
                // 字段对应的表
                let originTableName = "";
                let originTableName_ = [];
                selectValList.forEach((item) => {
                  originTableName_.push(item.tableName);
                });
                originTableName = originTableName_.join();
                cbVal = {
                  analysisType: this.TreeDigData[0].label == "维度" ? 0 : 1,
                  columnCode: this.fieldName,
                  columnComment: this.fieldComent,
                  customColumn: 1,
                  dataSetId: id,
                  dataType: this.fieldType,
                  functionParam: JSON.stringify(functionParam),
                  originTableName,
                  relationFunction: this.treeActive.functionId,
                  columnName: this.fieldName,
                  label: this.fieldComent,
                  value: this.fieldName,
                  id: this.fieldName,
                };
              } else if (this.ltActive.value == 3) {
                let flag_ = true;
                if (this.groupList.length) {
                  this.groupList.forEach((item, index) => {
                    if (
                      ((index == 0 && item.endVal) || item.startVal) &&
                      ((index == this.groupList.length - 1 && item.startVal) ||
                        item.endVal)
                    ) {
                    } else {
                      flag_ = false;
                    }
                  });
                }
                if (flag_) {
                  let functionParam_ = {
                    selectedColumnName: this.fieldsVal,
                    groupInfoList: this.groupList,
                  };
                  cbVal = {
                    analysisType: this.TreeDigData[0].label == "维度" ? 0 : 1,
                    columnCode: this.fieldName,
                    columnComment: this.fieldComent,
                    customColumn: 1,
                    dataSetId: id,
                    dataType: this.fieldType,
                    functionParam: JSON.stringify(functionParam_),
                    relationFunction: "splitBy",
                    columnName: this.fieldName,
                    label: this.fieldComent,
                    value: this.fieldName,
                    id: this.fieldName,
                  };
                } else {
                  this.$message({
                    message: "分组值不能为空(除第一个值和最后一个值外)",
                    type: "warning",
                  });
                  return;
                }
              }
              edit.cb({
                Item: edit,
                field: cbVal,
              });
              this.fieldName = "";
              this.fieldComent = "";
              this.fieldType = "";
              this.fieldsVal = "";
              this.groupList = [];
              this.rtCfg.list.forEach((item) => {
                item.defaultVal = "";
              });
            }
          } else {
            this.$message({
              message: "请添加字段名、字段类型、说明",
              type: "warning",
            });
          }
        }
      } else {
        console.error("按钮配置中缺少回调函数(cb)");
      }
    },

    /* 请求 */
    // 字段类型
    getFieldType() {
      API.dataSetUpdateFieldType().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.fieldTypeOptions = [];
        if (Res) {
          Res.forEach((item) => {
            item["label"] = item.name;
            item["value"] = item.code;
          });
        }
        this.fieldTypeOptions = Res;
      });
    },
    // 算法树
    getFnTree() {
      API.dataSetUpdateFnTree().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.treeData = [];
        if (Res) {
          this.loop(Res);
        }
        this.treeData = Res;
      });
    },
    // 字段
    getField({ dataSetId }) {
      API.dataSetUpdateFieldsList({ dataSetId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.rtCfgOption = [];
        if (Res) {
          const { data } = Res;
          data.forEach((item) => {
            item["label"] = item.columnName + "(" + item.columnComment + ")";
            item["value"] = item.columnName;
          });
          this.rtCfgOption = data;
        }
      });
    },
  },
  mounted() {
    this.getFieldType();
    this.getFnTree();
    if (this.$route.query && this.$route.query.row) {
      const { dataSetTypeName, name, id } = JSON.parse(this.$route.query.row);
      this.name = name;
      this.dataSetTypeName = dataSetTypeName;
      this.getField({ dataSetId: id });
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.fn-tree-dialog {
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
  .business-fn-tree {
    overflow: hidden;
    .conf-query {
      overflow: hidden;
      margin-bottom: 25px;
      li {
        float: left;
        width: 240px;
        text-align: right;
        margin-right: 5px;
        & > div {
          width: 160px;
        }
      }
    }
    .conf-area {
      height: 400px;
      overflow: hidden;
      display: flex;
      .lt {
        overflow: hidden;
        float: left;
        box-sizing: border-box;
        width: 160px;
        text-align: center;
        background: $Fn_tree_bg_lt;
        padding-top: 15px;
        li {
          height: 25px;
          line-height: 25px;
          cursor: pointer;
          &:hover {
            background: $tree_bg_active;
          }
        }
        .lt-active {
          color: $lt_menu_bg_active;
          background: $tree_bg_active;
        }
      }
      // 自定义算法
      .algorithm {
        flex: 1;
        display: flex;
        overflow: hidden;
        .fnTree {
          padding-top: 15px;
          float: left;
          overflow: auto;
          box-sizing: border-box;
          width: 265px;
          background: $Fn_tree_bg_mid;
          &-bg {
            background: $Fn_tree_bg_mid;
          }
        }
        .fnCof {
          padding-top: 15px;
          float: left;
          overflow: auto;
          box-sizing: border-box;
          flex: 1;
          background: $Fn_tree_bg_rt;
          & > p {
            height: 30px;
            height: 25px;
            line-height: 25px;
            padding-left: 8px;
          }
          & > form {
            & > div {
              margin-bottom: 10px;
            }
          }
        }
      }
      // 分组赋值
      .group-init {
        width: 600px;
        box-sizing: border-box;
        overflow: hidden;
        .field {
          height: 40px;
          margin-left: 20px;
          overflow: hidden;
        }
        .group {
          height: calc(100% - 40px);
          overflow: hidden;
          & > button {
            margin-top: 15px;
            margin-left: 20px;
          }
          &-list {
            box-sizing: border-box;
            height: calc(100% - 60px);
            padding: 0 10px 0 10px;
            margin-top: 10px;
            overflow: auto;
            li {
              height: 40px;
              line-height: 40px;
              b {
                position: relative;
                font-size: 24px;
                top: 4px;
                left: 5px;
                &:hover {
                  cursor: pointer;
                  color: $table_edit_btn_color_focus;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
