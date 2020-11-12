<!--
 * @Author: Marlon
 * @Date: 2020-02-24 21:50:15
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-02 08:15:27
 * @Description: 数据集编辑
 -->

<template>
  <div class="data-set-update">
    <div class="top">
      <ul class="top-lt">
        <li>
          当前数据集：
          <span>{{dataSetTypeName}}-{{name}}</span>
        </li>
      </ul>
      <ul class="top-rt">
        <li>
          <el-button type="primary" size="small" @click="save">保存</el-button>
        </li>
        <li>
          <span @click="back">返回数据集管理</span>
        </li>
      </ul>
    </div>
    <div class="area">
      <div class="area-lt">
        <div class="wd">
          <div class="wd-title">
            数据集
            <span>
              <!-- <i class="el-icon-d-arrow-left"></i> -->
            </span>
          </div>
          <div class="wd-tree-area">
            <div style="width: 350px;">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="medium" clearable>
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
            <el-tree
              class="filter-tree"
              :data="dlData"
              :props="dlDefaultProps"
              default-expand-all
              :filter-node-method="filterNode"
              :highlight-current="true"
              ref="wdTree"
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
              @node-click="handleNodeClick(1,$event)"
            >
              <span class="tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span v-if="data.id == activeTree_1.id">
                  <el-popover
                    v-if="data.label=='维度'"
                    placement="right"
                    popper-class="data-set-update-tree-edit"
                    trigger="hover"
                  >
                    <ul>
                      <li @click="()=>treeEditWD(node,data,1)">选择维度字段</li>
                      <li @click="()=>treeEditWD(node,data,2)">新建计算字段(维度)</li>
                    </ul>
                    <el-button slot="reference" type="text" size="mini">操作</el-button>
                  </el-popover>
                  <el-popover
                    v-else
                    placement="right"
                    popper-class="data-set-update-tree-edit"
                    trigger="hover"
                  >
                    <ul>
                      <li @click="()=>treeEditWD(node,data,3)">编辑</li>
                      <li @click="()=>treeEditWD(node,data,4)">删除</li>
                      <li @click="()=>treeEditWD(node,data,6)">维度字典</li>
                      <li @click="()=>treeEditWD(node,data,5)">转换为度量</li>
                    </ul>
                    <el-button slot="reference" type="text" size="mini">操作</el-button>
                  </el-popover>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
        <p class="area-lt-hr"></p>
        <div class="dl">
          <el-tree
            class="filter-tree"
            :data="vdData"
            :props="vDdefaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            :highlight-current="true"
            ref="dlTree"
            @node-drag-start="handleDragStart"
            @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave"
            @node-drag-over="handleDragOver"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            @node-click="handleNodeClick(2,$event)"
          >
            <span class="tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span v-if="data.id == activeTree_2.id">
                <el-popover
                  v-if="data.label=='度量'"
                  placement="right"
                  popper-class="data-set-update-tree-edit"
                  trigger="hover"
                >
                  <ul>
                    <li @click="()=>treeEditDL(node,data,1)">选择度量字段</li>
                    <li @click="()=>treeEditDL(node,data,2)">新建计算字段(度量)</li>
                  </ul>
                  <el-button slot="reference" type="text" size="mini">操作</el-button>
                </el-popover>
                <el-popover
                  v-else
                  placement="right"
                  popper-class="data-set-update-tree-edit"
                  trigger="hover"
                >
                  <ul>
                    <li @click="()=>treeEditDL(node,data,3)">编辑</li>
                    <li @click="()=>treeEditDL(node,data,4)">删除</li>
                    <li @click="()=>treeEditDL(node,data,5)">转换为维度</li>
                  </ul>
                  <el-button slot="reference" type="text" size="mini">操作</el-button>
                </el-popover>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="area-rt">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="height:auto;">
          <el-tab-pane label="数据预览" name="1"></el-tab-pane>
          <el-tab-pane label="关联模型" name="2"></el-tab-pane>
        </el-tabs>
        <div class="area-rt-view" v-if="activeName == 1">
          <ul class="area-rt-view-btn">
            <li>
              <el-button type="primary" size="medium" @click="getList">刷新预览</el-button>
            </li>
            <li>
              <el-button type="primary" size="medium">设置过滤条件</el-button>
            </li>
          </ul>
          <div class="area-rt-view-table">
            <TableDefault
              TId="table-view"
              :TLoading="TLoading_view"
              :TTitle="tableTitle_view"
              :TData="tableData_view"
              :TIsShowPage="false"
              :TTotal="total_view"
              :TCurrentPage="current_view"
              :TPageSize="pageSize_view"
              @changePage="changePage('view',$event)"
            ></TableDefault>
          </div>
        </div>
        <div v-else></div>
      </div>
    </div>
    <!-- 弹出框-表格 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="800"
      @editBtnCb="editBtnCb"
    >
      <div slot="soltDigContent" class="soltDigContent">
        <div class="soltDigContent-select">
          <label for>表过滤：</label>
          <el-select v-model="tableVal" clearable placeholder="请选择" size="small">
            <el-option
              v-for="item in tableOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="soltDigContent-table">
          <TableDefault
            TId="wdField_dig"
            :TLoading="TLoading_table"
            :TTitle="tableTitle_table"
            :TData="tableData_table"
            :TIsShowPage="false"
            :TTotal="total_table"
            :TCurrentPage="current_table"
            :TPageSize="pageSize_table"
            :TIsShowCheckBox="true"
            :TMultipleSelection="TMultipleSelection"
            @handleSelectionChange="handleSelectionChange"
            @changePage="changePage('table',$event)"
          ></TableDefault>
        </div>
      </div>
    </SoltDialog>
    <!-- 弹出框-表单 -->
    <FormDialog
      :FDId="FDId"
      :FDVisible="FDVisible"
      :FDTitle="FDTitle"
      FDWidth="500"
      :FDForm="FDForm"
      :FDFoot="FDFoot"
      :FDRules="FDRules"
      @editBtnCb="editBtnCb"
    ></FormDialog>
    <!-- 弹出框 配置 -->
    <FnTreeDialog
      :TreeDigShow="SoltDigShow_conf"
      :TreeDigTitle="SoltDigTitle_conf"
      :TreeDigFootBtn="soltDFootBtn_conf"
      TreeDigWidth="800"
      :TreeDigData="FnConfigTreeData"
      @closeTreeDig="editBtnCb"
    ></FnTreeDialog>
    <!-- 弹出框 维度字典 -->
    <SoltDialog
      :SoltDigShow="soltDigShowDir"
      :SoltDigTitle="soltDigTitleDir"
      :soltDFootBtn="soltDFootBtnDir"
      SoltDigWidth="800"
      @editBtnCb="editBtnCb"
    >
      <div slot="soltDigContent" class="wdzd">
        <ul class="title">
          <li>
            维度显示名称：
            <span>{{wdTitleName}}</span>
          </li>
          <li>
            物理字段名称：
            <span>{{wdTitleField}}</span>
          </li>
        </ul>
        <!-- 关联字典表 -->
        <ul class="type">
          <li>
            <label for>维度值设置类型：</label>
            <el-select v-model="wdType" filterable placeholder="请选择类型" size="small">
              <el-option
                v-for="item in wdTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
        </ul>
        <!-- 关联SQL -->
        <div v-if="isShowSQL">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3}"
            placeholder="请输入SQL"
            v-model="sql"
            style="width: 684px;"
          ></el-input>
          <el-button type="primary" size="mini" @click="getDic">执行</el-button>
        </div>
        <ul class="table" v-else>
          <li>
            <label for>关联表：</label>
            <el-select
              v-model="glTable"
              filterable
              placeholder="请选择关联表"
              size="small"
              style="width: 150px;"
              @change="getDicFieldInit"
            >
              <el-option
                v-for="(item,index) in glTableOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <label for>编码：</label>
            <el-select
              v-model="bmVal"
              filterable
              placeholder="请选择编码"
              size="small"
              style="width: 150px;"
            >
              <el-option
                v-for="item in bmOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <label for>名称：</label>
            <el-select
              v-model="mcVal"
              filterable
              placeholder="请选择名称"
              size="small"
              style="width: 150px;"
            >
              <el-option
                v-for="item in mcOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
        </ul>
        <TableDefault
          :THeight="450"
          TId="editWdField_dig"
          :TLoading="TLoading_table_wd"
          :TTitle="tableTitle_table_wd"
          :TData="tableData_table_wd"
          :TIsShowPage="false"
          :TTotal="total_table_wd"
          :TCurrentPage="current_table_wd"
          :TPageSize="pageSize_table_wd"
          @changePage="changePage('table',$event)"
        ></TableDefault>
      </div>
    </SoltDialog>
    
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api";
import { ResDatas } from "utils/res-format";
import SoltDialog from "@/components/dialog/solt-dialog";
import FnTreeDialog from "@/business-components/fn-tree";
import { cellJump } from "utils/jump";
export default {
  mixins: [mixin],
  components: {
    SoltDialog,
    FnTreeDialog
  },
  data() {
    return {
      dataSetTypeName: "",
      name: "",
      activeName: "1",
      // 表格
      TLoading_view: false,
      tableTitle_view: [
        {
          label: "字段"
        }
      ],
      tableData_view: [],
      current_view: 1,
      pageSize_view: 10,
      total_view: 0,
      // 维度 树
      filterText: "",
      dlData: [
        {
          id: 1,
          label: "维度",
          children: []
        }
      ],
      dlDefaultProps: {
        children: "children",
        label: "label"
      },
      activeTree_1: "",
      // 度量 树
      vdData: [
        {
          id: 1,
          label: "度量",
          children: []
        }
      ],
      vDdefaultProps: { children: "children", label: "label" },
      activeTree_2: "",
      // 弹出框-表格
      SoltDigShow: false,
      SoltDigTitle: "",
      soltDFootBtn: [],
      tableOptions: [],
      tableVal: "",
      TLoading_table: false,
      tableTitle_table: [
        { prop: "tableName", label: "表名称" },
        { prop: "columnName", label: "字段名称" },
        { prop: "dataType", label: "字段类型" },
        { prop: "columnComment", label: "字段描述" }
      ],
      tableData_table: [],
      tableData_tableSource: [],
      current_table: 1,
      pageSize_table: 10,
      total_table: 0,
      SoldCheckBox: [],
      TMultipleSelection: [],
      // 弹出框-表单
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFoot: {
        button: []
      },
      FDRules: {},
      dataSet: [],
      // 弹出框 - 配置
      SoltDigShow_conf: false,
      SoltDigTitle_conf: "",
      soltDFootBtn_conf: [],
      FnConfigTreeData: "",
      // 弹出框 维度字典
      soltDigShowDir: false,
      soltDigTitleDir: "",
      soltDFootBtnDir: [],
      wdTitleName: "",
      wdTitleField: "",
      wdType: 1,
      wdTypeOptions: [
        {
          label: "关联字典表",
          value: 1
        },
        {
          label: "关联SQL",
          value: 2
        }
      ],
      glTable: "",
      glTableOptions: [],
      bmVal: "",
      bmOptions: [],
      mcVal: "",
      mcOptions: [],
      TLoading_table_wd: false,
      tableTitle_table_wd: [{ label: "编码" }, { label: "名称" }],
      tableData_table_wd: [],
      current_table_wd: 1,
      pageSize_table_wd: 10,
      total_table_wd: 0,
      // 关联SQL
      isShowSQL: false,
      sql: ""
    };
  },
  watch: {
    filterText(val) {
      this.$refs.wdTree.filter(val);
    },
    tableVal(newVal) {
      if (newVal) {
        this.tableData_table = this.tableData_tableSource.filter(
          (item, index) => {
            return item.tableName == newVal;
          }
        );
      } else {
        this.tableData_table = JSON.parse(
          JSON.stringify(this.tableData_tableSource)
        );
      }
    },
    glTable(newVal) {
      if (newVal) {
        this.getDicField();
        this.getDic();
      }
    },
    wdType: {
      handler(newVal) {
        if (newVal == 2) {
          this.isShowSQL = true;
          this.tableTitle_table_wd = [{ label: "编码" }, { label: "名称" }];
          this.tableData_table_wd = [];
          this.current_table_wd = 1;
          this.pageSize_table_wd = 10;
          this.total_table_wd = 0;
          this.glTable = this.bmVal = this.mcVal = "";
        } else {
          this.isShowSQL = false;
          this.tableTitle_table_wd = [{ label: "编码" }, { label: "名称" }];
          this.tableData_table_wd = [];
          this.current_table_wd = 1;
          this.pageSize_table_wd = 10;
          this.total_table_wd = 0;
        }
      },
      immediate: true
    }
  },
  methods: {
    // 表格-回调
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.SoltDigShow_conf = this.FDVisible = this.SoltDigShow =
          editItem.close;
        this.SoldCheckBox = [];
        this.soltDigShowDir = editItem.close;
      } else if (text === "删除") {
      }
    },
    // 标签切换
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 分页操作
    changePage(type, { pageSize, currentPage }) {
      this.current = currentPage;
      this.pageSize = pageSize;
      this[`current_${type}`] = currentPage;
      this[`pageSize_${type}`] = pageSize;
      if (type == "table") {
        // TODO
      } else {
        // TODO
      }
    },
    // 模糊匹配
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 拖拽
    handleDragStart(node, ev) {
      console.log("drag start", node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log("tree drag enter: ", dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log("tree drag leave: ", dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log("tree drag over: ", dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end: ", dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", dropNode.label, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === "二级 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
    },
    // 树形 - 编辑 - 维度
    treeEditWD(node, data, type) {
      this.hideDom();
      console.log(data);
      const {
        columnComment,
        columnName,
        remake = "",
        columnCode,
        dictName = "",
        dictColumnCode = "",
        dictColumnName = ""
      } = data;
      console.log(data);
      switch (type) {
        case 1:
          {
            this.TMultipleSelection = [];
            this.SoltDigShow = true;
            this.SoltDigTitle = "选择维度字段";
            this.soltDFootBtn = [
              {
                label: "确定",
                css: "primary",
                cb: ({ Item }) => {
                  this.addDimension(1);
                }
              }
            ];
          }
          return;
        case 2:
          {
            this.FnConfigTreeData = this.dlData;
            this.SoltDigShow_conf = true;
            this.SoltDigTitle_conf = "新建计算字段(维度)";
            this.soltDFootBtn_conf = [
              {
                label: "确定",
                css: "primary",
                cb: ({ field }) => {
                  console.log(field, "新添加的字段");
                  this.dlData[0].children.push(field);
                  this.SoltDigShow_conf = false;
                }
              }
            ];
          }
          return;
        case 3:
          {
            this.FDTitle = `编辑${columnName + columnComment}标段名称`;
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "显示名称",
                  width: "120"
                },
                key: "columnComment",
                clearable: true,
                width: "280",
                defaultModel: columnComment,
                placeholder: ""
              },
              {
                type: "input",
                disabled: true,
                label: {
                  name: "物理字段名",
                  width: "120"
                },
                key: "columnName",
                clearable: true,
                width: "280",
                defaultModel: columnName,
                placeholder: ""
              },
              {
                type: "input",
                label: {
                  name: "备注",
                  width: "120"
                },
                key: "remake",
                clearable: true,
                width: "280",
                defaultModel: remake,
                placeholder: ""
              }
            ];
            this.FDRules = {
              columnComment: [
                { required: true, message: "请输入名称", trigger: "blur" }
              ]
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate(valid => {
                    if (valid) {
                      let children = JSON.parse(
                        JSON.stringify(this.dlData[0].children)
                      );
                      children.forEach(item => {
                        if (form.columnName == item.columnCode) {
                          item["columnComment"] = form.columnComment;
                          item["label"] = form.columnComment;
                          item["remake"] = form.remake;
                        }
                      });
                      this.$set(this.dlData[0], `children`, children);
                      this.FDVisible = false;
                    }
                  });
                }
              }
            ]);
          }
          return;
        case 4:
          {
            this.$confirm(
              `即将删除“${data.columnComment}”字段, 是否继续?`,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                this.del({ id: data.columnCode, type: 0 });
              })
              .catch(() => {});
          }
          return;
        case 5:
          {
            this.vdData[0].children.push({
              ...data,
              analysisType: 1
            });
            this.dlData[0].children.forEach((item, index) => {
              if (data.id == item.id) {
                this.dlData[0].children.splice(index, 1);
              }
            });
          }
          return;
        case 6:
          {
            this.soltDigShowDir = true;
            this.soltDigTitleDir = "编辑维度字典";
            this.wdTitleName = columnComment;
            this.wdTitleField = columnName;

            this.tableData_table_wd = [];
            this.sql = dictName;
            this.glTable = dictName;
            this.bmVal = dictColumnCode;
            this.mcVal = dictColumnName;

            this.soltDFootBtnDir = [
              {
                label: "确定",
                css: "primary",
                cb: () => {
                  if (this.wdType == 1) {
                    if (this.glTable && this.bmVal && this.mcVal) {
                      this.dlData[0].children.forEach(item => {
                        if (columnCode === item.columnCode) {
                          item["dictName"] = this.glTable;
                          item["dictColumnCode"] = this.bmVal;
                          item["dictColumnName"] = this.mcVal;
                        }
                      });
                      this.soltDigShowDir = false;
                    } else {
                      this.$message({
                        message: "请选择类型、关联表、编码、名称",
                        type: "warning"
                      });
                    }
                  } else {
                    this.soltDigShowDir = false;
                    this.dlData[0].children.forEach(item => {
                      if (columnCode === item.columnCode) {
                        item["dictName"] = this.sql;
                        item["dictColumnCode"] = "";
                        item["dictColumnName"] = "";
                      }
                    });
                  }
                }
              }
            ];
          }
          return;

        default:
          break;
      }
    },
    // 树形 - 编辑 - 度量
    treeEditDL(node, data, type) {
      this.hideDom();
      const { columnComment, columnName, remake = "" } = data;
      switch (type) {
        case 1:
          {
            this.TMultipleSelection = [];
            this.SoltDigShow = true;
            this.SoltDigTitle = "选择度量字段";
            this.soltDFootBtn = [
              {
                label: "确定",
                css: "primary",
                cb: ({ Item }) => {
                  this.addDimension(2);
                }
              }
            ];
          }
          return;
        case 2:
          {
            this.FnConfigTreeData = this.vdData;
            this.SoltDigShow_conf = true;
            this.SoltDigTitle_conf = "新建计算字段(度量)";
            this.soltDFootBtn_conf = [
              {
                label: "确定",
                css: "primary",
                cb: ({ field }) => {
                  console.log(field, "新添加的字段");
                  this.vdData[0].children.push(field);
                  this.SoltDigShow_conf = false;
                }
              }
            ];
          }
          return;
        case 3:
          {
            this.FDTitle = `编辑${columnName + columnComment}标段名称`;
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "显示名称",
                  width: "120"
                },
                key: "columnComment",
                clearable: true,
                width: "280",
                defaultModel: columnComment,
                placeholder: ""
              },
              {
                type: "input",
                disabled: true,
                label: {
                  name: "物理字段名",
                  width: "120"
                },
                key: "columnName",
                clearable: true,
                width: "280",
                defaultModel: columnName,
                placeholder: ""
              },
              {
                type: "input",
                label: {
                  name: "备注",
                  width: "120"
                },
                key: "remake",
                clearable: true,
                width: "280",
                defaultModel: remake,
                placeholder: ""
              }
            ];
            this.FDRules = {
              columnComment: [
                { required: true, message: "请输入名称", trigger: "blur" }
              ]
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  let children = JSON.parse(
                    JSON.stringify(this.vdData[0].children)
                  );
                  children.forEach(item => {
                    if (form.columnName == item.columnCode) {
                      item["columnComment"] = form.columnComment;
                      item["label"] = form.columnComment;
                      item["remake"] = form.remake;
                    }
                  });
                  this.$set(this.vdData[0], `children`, children);
                  this.FDVisible = false;
                }
              }
            ]);
          }
          return;
        case 4:
          {
            this.$confirm(
              `即将删除“${data.columnComment}”度量, 是否继续?`,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                this.del({ id: data.columnCode, type: 1 });
              })
              .catch(() => {});
          }
          return;
        case 5:
          {
            this.dlData[0].children.push({
              ...data,
              analysisType: 0
            });
            this.vdData[0].children.forEach((item, index) => {
              if (data.id == item.id) {
                this.vdData[0].children.splice(index, 1);
              }
            });
          }
          return;

        default:
          break;
      }
    },
    // 激活树
    handleNodeClick(type, data) {
      this[`activeTree_${type}`] = data;
    },
    // 关闭全局DOM
    hideDom() {
      if (document.getElementsByClassName("data-set-update-tree-edit").length) {
        let popover = document.getElementsByClassName(
          "data-set-update-tree-edit"
        );
        for (let index = 0; index < popover.length; index++) {
          popover[index].style = "display: none;";
        }
      }
    },
    // 多选
    handleSelectionChange(type, selectionArr) {
      if (type === "checkbox") {
        this.SoldCheckBox = selectionArr;
      }
    },
    // 添加维度\度量字段(前端)
    addDimension(type) {
      if (this.SoldCheckBox.length) {
        let arr = [];
        let dataSetId = "";
        if (this.$route.query && this.$route.query.row) {
          const { dataSetTypeName, name, id } = JSON.parse(
            this.$route.query.row
          );
          dataSetId = id;
        }
        if (type == 1) {
          this.SoldCheckBox.forEach(item => {
            arr.push({
              ...item,
              columnCode: item.columnName,
              id: item.columnCode,
              label: item.columnComment,
              analysisType: 0,
              customColumn: 0,
              dataSetId
            });
          });
          // 左侧数据
          let children = JSON.parse(JSON.stringify(this.dlData[0].children));
          let arr__ = [];
          children.forEach(item => {
            arr__.push(item.columnCode);
          });
          let flag = false;
          function loo(arr) {
            if (arr && arr.length) {
              for (let index = 0; index < arr.length; index++) {
                if (arr__.includes(arr[index].columnCode)) {
                  arr.splice(index, 1);
                  loo(arr);
                  flag = true;
                }
              }
            }
          }
          loo(arr);
          this.$set(this.dlData[0], `children`, children.concat(arr));
          if (flag) {
            this.$message({
              message: "已过滤重复字段",
              type: "warning"
            });
          }
        } else {
          this.SoldCheckBox.forEach(item => {
            arr.push({
              ...item,
              columnCode: item.columnName,
              id: item.columnCode,
              label: item.columnComment,
              analysisType: 1,
              customColumn: 0,
              dataSetId
            });
          });
          let children = JSON.parse(JSON.stringify(this.vdData[0].children));
          let arr__ = [];
          children.forEach(item => {
            arr__.push(item.columnCode);
          });
          let flag = false;
          function loo(arr) {
            if (arr && arr.length) {
              for (let index = 0; index < arr.length; index++) {
                if (arr__.includes(arr[index].columnCode)) {
                  arr.splice(index, 1);
                  loo(arr);
                  flag = true;
                }
              }
            }
          }
          loo(arr);
          this.$set(this.vdData[0], `children`, children.concat(arr));
          if (flag) {
            this.$message({
              message: "已过滤重复字段",
              type: "warning"
            });
          }
        }
      }
      this.SoltDigShow = false;
    },
    // 删除
    del({ id, type }) {
      switch (type) {
        case 0:
          {
            this.dlData[0].children.forEach((item, index) => {
              if (id == item.columnCode) {
                this.dlData[0].children.splice(index, 1);
              }
            });
          }
          return;
        case 1:
          {
            this.vdData[0].children.forEach((item, index) => {
              if (id == item.columnCode) {
                this.vdData[0].children.splice(index, 1);
              }
            });
          }
          return;
        default:
          break;
      }
    },
    loop(arr) {
      if (arr && arr.length) {
        arr.forEach(item => {
          if (item.children && item.children.length) {
            this.loop(item.children);
          } else {
            delete item.children;
          }
        });
      }
    },
    // 返回数据集管理
    back() {
      cellJump(this, {
        TClickItem: [
          {
            link: "/analysis/preparation/dataSet",
            jump: {
              type: "int",
              mode: "push"
            }
          }
        ]
      });
    },
    getDicFieldInit() {
      this.bmVal = this.mcVal = "";
      this.bmOptions = this.mcOptions = [];
    },

    /* 请求 */
    // 数据集
    getDataSetTree() {
      API._publicDataSetTree().then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        this.loop(Res.data.children.children);
        this.dataSet = Res.data.children.children;
      });
    },
    // 获取表
    getTable(dataSetId) {
      API.dataSetUpdateTable({ dataSetId }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let arr = [];
        if (Res) {
          Res.forEach(item => {
            arr.push({
              label: item,
              value: item
            });
          });
        }
        this.tableOptions = arr;
      });
    },
    // 字段
    getFields({ dataSetId }) {
      API.dataSetUpdateFieldsList({ dataSetId }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if (Res) {
          const { data, title } = Res;
          this.tableTitle_table = title;
          this.tableData_tableSource = data;
          this.tableData_table = data;
        }
      });
    },
    // 获取维度、度量 树
    getTreeLt({ dataSetId, dimensionOrMeasure }) {
      API.dataSetUpdateDimension({
        dataSetId,
        dimensionOrMeasure,
        isGetDictData: 0
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        Res.forEach(item => {
          item["columnName"] = item.columnCode;
          item["label"] = item.columnComment;
          item["value"] = item.id;
        });
        if (dimensionOrMeasure == 0) {
          this.$set(this.dlData[0], `children`, Res);
        } else {
          this.$set(this.vdData[0], `children`, Res);
        }
      });
    },
    // 保存
    save() {
      let dataSetDetails = [];
      let checkbox_ = this.dlData[0].children.concat(this.vdData[0].children);
      checkbox_.forEach(item => {
        if (item.dictName) {
          dataSetDetails.push({
            analysisType: item.analysisType,
            columnCode: item.columnName || item.columnCode,
            columnComment: item.columnComment,
            customColumn: item.customColumn,
            dataType: item.dataType,
            originTableName: item.tableName || item.originTableName,
            functionParam: item.functionParam || "",
            relationFunction: item.relationFunction || "",
            dictName: item.dictName,
            dictColumnCode: item.dictColumnCode,
            dictColumnName: item.dictColumnName
          });
        } else {
          dataSetDetails.push({
            analysisType: item.analysisType,
            columnCode: item.columnName || item.columnCode,
            columnComment: item.columnComment,
            customColumn: item.customColumn,
            dataType: item.dataType,
            originTableName: item.tableName || item.originTableName,
            functionParam: item.functionParam || "",
            relationFunction: item.relationFunction || ""
          });
        }
      });
      if (this.$route.query && this.$route.query.row) {
        const { id } = JSON.parse(this.$route.query.row);
        API.dataSetUpdateAddFields({
          dataSetId: id,
          dataSetDetails
        }).then(res => {
          new ResDatas({
            res,
            code: 0
          }).state();
          this.getTreeLt({ dataSetId: id, dimensionOrMeasure: 0 });
          this.getTreeLt({ dataSetId: id, dimensionOrMeasure: 1 });
        });
      }
    },

    // 获取(刷新预览)
    getList() {
      if (this.$route.query && this.$route.query.row) {
        this.TLoading_view = true;
        const { id } = JSON.parse(this.$route.query.row);
        API.dataSetUpdateList({
          dataSetId: id
        }).then(res => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title"
              }
            },
            "TLoading_view",
            this
          );
          if (Res.init()) {
            const { data, title } = Res.formatData();
            title.forEach(item => {
              if (title[title.length - 1].prop == item.prop) {
                item["fixed"] = "right";
              }
            });
            this.tableTitle_view = title;
            this.tableData_view = data;
          } else {
            this.tableData_view = [];
          }
        });
      }
    },
    // TODO 设置过滤条件
    // 字典表列表
    dicList(dataSetId) {
      API._publicDicList({ dataSetId }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let arr = [];
        if (Res) {
          Res.forEach(item => {
            arr.push({
              ...item,
              value: item.tableName,
              label: item.tableName
            });
          });
        }
        this.glTableOptions = arr;
      });
    },
    // 字典表字段
    getDicField() {
      if (this.$route.query && this.$route.query.row) {
        const { id } = JSON.parse(this.$route.query.row);
        API._publicDicFields({ dataSetId: id, dictName: this.glTable }).then(
          res => {
            let Res = new ResDatas({
              res,
              code: 0
            }).init();
            let arr = [];
            if (Res) {
              Res.forEach(item => {
                arr.push({
                  ...item,
                  label: item.columnName,
                  value: item.columnName
                });
              });
            }
            this.mcOptions = arr;
            this.bmOptions = arr;
          }
        );
      }
    },
    // 字典表数据预览
    getDic() {
      if (this.$route.query && this.$route.query.row) {
        const { id } = JSON.parse(this.$route.query.row);
        let dictName = "";
        if (this.wdType == 1) {
          dictName = this.glTable;
        } else if (this.wdType == 2) {
          dictName = this.sql;
        }
        if (dictName) {
          this.TLoading_table_wd = true;
          API._publicDic({ dataSetId: id, dictName }).then(res => {
            let Res = new ResDatas(
              {
                res,
                code: 0,
                fieldKey: {
                  data: "data",
                  title: "title"
                }
              },
              "TLoading_table_wd",
              this
            );
            if (Res.init()) {
              const { data, title } = Res.formatData();
              if (title) {
                title.forEach(item => {
                  if (title[title.length - 1].prop == item.prop) {
                    item["fixed"] = "right";
                  }
                });
              }
              this.tableTitle_table_wd = title;
              this.tableData_table_wd = data;
            } else {
              this.tableData_table_wd = [];
            }
          });
        } else {
          this.$message({
            message: "请输入要执行的SQL",
            type: "warning"
          });
        }
      }
    }
  },
  mounted() {
    this.getDataSetTree();
    if (this.$route.query && this.$route.query.row) {
      const { dataSetTypeName, name, id } = JSON.parse(this.$route.query.row);
      this.name = name;
      this.dataSetTypeName = dataSetTypeName;
      this.getFields({ dataSetId: id });
      this.getTreeLt({ dataSetId: id, dimensionOrMeasure: 0 });
      this.getTreeLt({ dataSetId: id, dimensionOrMeasure: 1 });
      this.getTable(id);
      this.getList();
      this.dicList(id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.data-set-update {
  padding: 20px;
  min-width: 1300px;
  width: calc(100% - 1px);
  height: 100%;
  box-sizing: border-box;
  .top {
    height: 55px;
    box-sizing: border-box;
    border-bottom: 2px solid $tree_bg;
    &-lt {
      float: left;
      li {
        float: left;
        font-size: 16px;
        height: 60px;
        line-height: 60px;
      }
    }
    &-rt {
      float: right;
      li {
        float: left;
        margin-right: 15px;
        height: 60px;
        line-height: 60px;
        & > span {
          font-size: 16px;
          cursor: pointer;
          color: $lt_menu_bg;
          margin-left: 20px;
          &:hover {
            color: $lt_menu_bg_active;
          }
        }
      }
    }
  }
  .area {
    width: 100%;
    height: calc(100% - 45px);
    box-sizing: border-box;
    overflow: hidden;
    box-sizing: border-box;
    &-lt {
      float: left;
      width: 360px;
      height: 100%;
      box-sizing: border-box;
      margin-right: 5px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid $tree_bg;
      &-hr {
        height: 10px;
        background: $tree_bg;
      }
      & > div {
        flex: 1;
        overflow: auto;
      }
      .tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 10px;
      }
      .wd {
        overflow: hidden;
        &-title {
          height: 38px;
          line-height: 37px;
          background: $tree_bg;
          font-size: 16px;
          padding-left: 20px;
          margin-bottom: 5px;
          span {
            float: right;
            i {
              font-size: 36px;
              cursor: pointer;
            }
          }
        }
        &-tree-area {
          width: 100%;
          height: calc(100% - 44px);
          overflow: auto;
        }
      }
      .dl {
      }
    }
    &-rt {
      float: left;
      width: calc(100% - 367px);
      height: 100%;
      &-view {
        width: 100%;
        height: calc(100% - 54px);
        &-btn {
          margin-bottom: 10px;
          overflow: hidden;
          li {
            float: left;
            margin: 0 10px 0 10px;
          }
        }
        &-table {
          height: calc(100% - 36px);

          padding-right: 4px;
          overflow: auto;
        }
      }
    }
  }
  .soltDigContent {
    overflow: hidden;
    &-select {
      float: right;
    }
    &-table {
      height: 400px;
      margin-top: 40px;
      overflow: auto;
    }
  }
  .wdzd {
    .title {
      overflow: hidden;
      li {
        float: left;
        margin-right: 35px;
      }
    }
    .type {
      overflow: hidden;
      margin: 10px 0;
      li {
        float: left;
      }
    }
    .table {
      overflow: hidden;
      li {
        float: left;
        margin-right: 25px;
      }
    }
    .viewTable {
      height: 450px;
      overflow: hidden;
    }
  }
}
</style>
