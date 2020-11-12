<!--
 * @Author: Marlon
 * @Date: 2020-05-12 14:36:21
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-07 15:07:58
 * @Description: 数据源
 -->
 <template>
  <div class="any-data-source">
    <div class="task-tree">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        style="margin-bottom: 5px;"
        @click="showSlotDig({type:'添加数据源'})"
      >添加数据源</el-button>
      <span class="source-total">共{{sourceTotal}}条</span>
      <el-input placeholder="搜索数据源" v-model="likeDataSource" size="small" clearable>
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-tree
        class="tree"
        ref="tree"
        :highlight-current="true"
        node-key="id"
        :current-node-key="activeTreeNodeKey"
        :default-expanded-keys="defaultTree"
        :data="sourceTree"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <el-tooltip
            v-if="node.label.length >20"
            class="item"
            effect="dark"
            :content="`${node.label}`"
            placement="top-start"
          >
            <span class="tree-text">{{ node.label }}</span>
          </el-tooltip>
          <span v-else class="tree-text">{{ node.label }}</span>
          <span v-if="data.id == activeTree.id">
            <el-popover placement="right" popper-class="source-tree-edit" trigger="hover">
              <ul>
                <li @click="()=>treeEdit(node,data)">编辑</li>
                <li @click="()=>treeDel(node,data)">删除</li>
              </ul>
              <el-button slot="reference" type="text" size="mini">操作</el-button>
            </el-popover>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="task-view">
      <div class="M-title">
        <p>
          <i></i>
          <span>
            当前数据源:
            <span>{{activeTree ? activeTree.name:''}}</span>
          </span>
        </p>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="task-view-title">
        <el-tab-pane label="表" name="1"></el-tab-pane>
        <el-tab-pane label="即席查询SQL" name="2"></el-tab-pane>
      </el-tabs>
      <!-- 表 -->
      <div class="view-area" v-if="activeName ==1">
        <el-input class="table-query" placeholder="搜索名称" v-model="likeTable" size="small">
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="likeGetListTable"
            style="cursor: pointer;"
          ></i>
        </el-input>
        <div class="table">
          <TableDefault
            TId="table"
            :TLoading="TLoading"
            :TTitle="tableTitle"
            :TData="tableData"
            :TIsShowPage="true"
            :TTotal="TPage_1.total"
            :TCurrentPage="TPage_1.index"
            :TPageSize="TPage_1.size"
            :TEdit="TEdit"
            :TAlign="TAlign"
            @editBtnCb="editBtnCb"
            @clickCell="lickCell"
            @changePage="changePage(1,$event)"
          ></TableDefault>
        </div>
      </div>
      <div class="view-area" v-else-if="activeName ==2">
        <div class="sql">
          <el-button type="primary" size="small" @click="runSQL">执行</el-button>
          <el-button
            v-if="isShowSave"
            type="primary"
            size="small"
            @click="showFormDig({type:'SQL-创建数据集'})"
          >创建数据集</el-button>
          <el-button v-else type="primary" size="small" @click="saveDataSet">保存</el-button>
        </div>
        <el-input
          class="textarea"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 10}"
          placeholder="请输入SQL"
          v-model="sql"
        ></el-input>
        <el-tabs v-model="activeSql" @tab-click="handleClickSql" class="task-view-title">
          <el-tab-pane label="执行结果" name="1"></el-tab-pane>
          <el-tab-pane label="历史记录" name="2"></el-tab-pane>
        </el-tabs>
        <div class="sql-table" v-if="activeSql == 1">
          <TableDefault
            TId="sqlResult"
            :TLoading="TLoading_1"
            :TTitle="tableTitle_1"
            :TData="tableData_1"
            :TIsShowPage="false"
            :TEdit="TEdit_1"
            :TAlign="TAlign_1"
            @editBtnCb="editBtnCb"
          ></TableDefault>
        </div>
        <div class="sql-table" v-else>
          <TableDefault
            :TId="historyTableId"
            :TLoading="TLoading_2"
            :TTitle="tableTitle_2"
            :TData="tableData_2"
            :TIsShowPage="true"
            :TTotal="TPage_2.total"
            :TCurrentPage="TPage_2.index"
            :TPageSize="TPage_2.size"
            :TEdit="TEdit_2"
            :TAlign="TAlign_2"
            @editBtnCb="editBtnCb"
            @clickCell="lickCell"
            @changePage="changePage(2,$event)"
          ></TableDefault>
        </div>
      </div>
    </div>
    <!-- 弹出框-数据源 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="600"
      @editBtnCb="editBtnCb"
    >
      <div slot="soltDigContent" class="soltDigContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="124px" size="medium">
          <el-form-item label="数据源显示名称：" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="选择数据源：" prop="dataSourceType">
            <el-select v-model="ruleForm.dataSourceType" placeholder="请选择数据源类型">
              <el-option
                v-for="(item, index) in sourceType"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-form-item prop="dataSourceId" style="float: right;width: 200px;">
              <el-select v-model="ruleForm.dataSourceId" placeholder="请选择数据源">
                <el-option
                  v-for="(item, index) in source"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </SoltDialog>
    <!-- 弹出框 - 表单 -->
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
    <!-- 弹出框 - 表格 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow_table"
      :SoltDigTitle="SoltDigTitle_table"
      :soltDFootBtn="soltDFootBtn_table"
      SoltDigWidth="800"
      @editBtnCb="editBtnCb"
    >
      <div slot="soltDigContent" class="soltDigContent">
        <p class="table-title">
          <span class="table-title-name">
            表名称：
            <span>{{SoltDigTitle_tableTitle}}</span>
          </span>
          <span class="table-title-desc">
            表描述：
            <span>{{SoltDigTitle_tableDes}}</span>
          </span>
        </p>
        <TableDefault
          :THeight="400"
          :TLoading="TLoading_3"
          :TTitle="tableTitle_3"
          :TData="tableData_3"
          :TIsShowPage="false"
          :TTotal="TPage_3.total"
          :TCurrentPage="TPage_3.index"
          :TPageSize="TPage_3.size"
          :TEdit="TEdit_3"
          :TAlign="TAlign_3"
          @editBtnCb="editBtnCb"
          @changePage="changePage(3,$event)"
        ></TableDefault>
      </div>
    </SoltDialog>
  </div>
</template>
 
<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { openUrl } from "utils/jump";
import SoltDialog from "@/components/dialog/solt-dialog";

export default {
  mixins: [mixin],
  components: {
    SoltDialog,
  },
  data() {
    return {
      // 数据源
      likeDataSource: "",
      activeTreeNodeKey: "",
      sourceTree: [], // 左侧 数据源列表
      defaultProps: {
        children: "children",
        label: "name",
      },
      defaultTree: [],
      activeTree: "",
      // 标签
      activeName: "1",
      // 表1
      likeTable: "",
      TLoading: false,
      TEdit: {
        show: true,
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "创建数据集",
            css: "text",
          },
          {
            label: "详情",
            css: "text",
          },
        ],
      },
      TAlign: [
        {
          key: "left",
          item: ["datasourceName", "remark"],
        },
      ],
      tableTitle: [
        { prop: "tableName", label: "名称" },
        { prop: "tableComment", label: "说明" },
      ],
      tableData: [],
      TPage_1: {
        total: 0,
        index: 1,
        size: 10,
      },
      tableDataSource: [],
      dataSet: [], // 数据集 树
      SoltDigTitle_tableTitle: "",
      SoltDigTitle_tableDes: "",
      //   表2
      sql: "",
      activeSql: "1",
      TLoading_1: false,
      TEdit_1: {
        show: false,
      },
      TAlign_1: [
        {
          key: "left",
          item: ["datasourceName", "remark"],
        },
      ],
      tableTitle_1: [
        {
          label: "字段名",
        },
      ],
      tableData_1: [],
      isShowSave: true,
      // 历史记录
      historyTableId: "historyTable",
      TLoading_2: false,
      TEdit_2: {
        show: true,
        title: "操作",
        width: 180,
        fixed: "right",
        editTypes: [
          {
            label: "创建数据集",
            css: "text",
          },
          {
            label: "复制",
            css: "text",
          },
        ],
      },
      TAlign_2: [
        {
          key: "left",
          item: ["datasourceName", "remark"],
        },
      ],
      tableTitle_2: [
        { prop: "executeTime", label: "查询时间" },
        { prop: "executionSql", label: "SQL语句" },
        { prop: "timeConsuming", label: "耗时" },
      ],
      tableData_2: [],
      TPage_2: {
        total: 0,
        index: 1,
        size: 10,
      },
      // 弹出框-数据源
      SoltDigShow: false,
      SoltDigTitle: "",
      soltDFootBtn: [],
      ruleForm: {
        name: "",
        dataSourceType: "",
        dataSourceId: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入数据源名称", trigger: "blur" },
        ],
        dataSourceType: [
          { required: true, message: "请选择数据源类型", trigger: "change" },
        ],
        dataSourceId: [
          {
            required: true,
            message: "请选择数据源",
            trigger: "change",
          },
        ],
      },
      sourceType: [
        {
          label: "mysql",
          value: 1,
        },
      ], // 数据源类型
      source: [], // 数据源列表
      sourceTotal: 0,
      // 弹出框-表单
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFoot: {
        button: [],
      },
      FDRules: {
        projectCode: [
          { required: true, message: "请输入编码", trigger: "blur" },
        ],
        projectName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
      },
      // 弹出框 - 表格
      SoltDigShow_table: false,
      SoltDigTitle_table: "表详情",
      soltDFootBtn_table: [],
      TLoading_3: false,
      TEdit_3: {
        show: false,
      },
      TAlign_3: [
        {
          key: "left",
          item: ["datasourceName", "remark"],
        },
      ],
      tableTitle_3: [
        { prop: "columnName", label: "字段名称" },
        { prop: "dataType", label: "字段类型" },
        { prop: "columnComment", label: "字段描述" },
      ],
      tableData_3: [],
      TPage_3: {
        total: 0,
        index: 1,
        size: 10,
      },
      // 激活的表格行对象
      tableActive_: "",
    };
  },
  watch: {
    likeDataSource(val) {
      this.$refs.tree.filter(val);
    },
    SoltDigShow(newVal) {
      if (!newVal && this.$refs["ruleForm"]) {
        this.$refs["ruleForm"].resetFields();
      }
    },
  },
  methods: {
    // 表格-回调
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.SoltDigShow_table = this.FDVisible = this.SoltDigShow =
          editItem.close;
        this.ruleForm = {
          name: "",
          dataSourceType: "",
          dataSourceId: "",
        };
        this.FDForm = [];
      } else if (text === "删除") {
      }
    },
    // 左侧 树操作
    treeEdit(node, data) {
      this.hideDom();
      this.showSlotDig({ type: "编辑数据源", initDig: data });
    },
    treeDel(node, data) {
      this.hideDom();
      this.$confirm(`即将删除“${data.name}”数据源, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.del(data);
        })
        .catch(() => {});
    },
    // 关闭全局DOM
    hideDom() {
      if (document.getElementsByClassName("source-tree-edit").length) {
        let popover = document.getElementsByClassName("source-tree-edit");
        for (let index = 0; index < popover.length; index++) {
          popover[index].style = "display: none;";
        }
      }
    },
    // 左侧点击事件
    handleNodeClick(data) {
      this.activeTreeNodeKey = data.id;
      this.activeTree = data;
      this.getListTable();
      this.getHistory();
    },
    // 过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 标签切换
    handleClick(tab, event) {},
    // SQL 标签
    handleClickSql(tab, event) {
      switch (this.activeSql) {
        case "2":
          {
            this.getHistory();
          }
          return;

        default:
          break;
      }
    },
    // 弹出框-插槽模式(添加数据源)
    showSlotDig({ type, initDig = null }) {
      switch (type) {
        case "添加数据源":
          {
            this.SoltDigShow = true;
            this.SoltDigTitle = "添加数据源";
            this.$set(this.ruleForm, `name`, name);
            this.soltDFootBtn = [
              {
                label: "新增数据源",
                css: "",
                cb: ({ Item }) => {
                  this.SoltDigShow = false;
                  setTimeout(() => {
                    openUrl({
                      type: "open",
                      url: "/data-manage/#/dataSource/list",
                      obj: {},
                    });
                  }, 200);
                },
              },
              {
                label: "确定",
                css: "primary",
                cb: ({ Item }) => {
                  this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                      this.add();
                    } else {
                      return false;
                    }
                  });
                },
              },
            ];
          }
          return;
        case "编辑数据源":
          {
            const {
              id,
              dataSourceId = "",
              dataSourceType = "",
              name,
            } = initDig;
            console.log(initDig);
            this.$set(this.ruleForm, `name`, name);
            this.$set(this.ruleForm, `dataSourceType`, dataSourceType);
            this.$set(this.ruleForm, `dataSourceId`, dataSourceId);
            this.SoltDigTitle = "编辑数据源";
            this.SoltDigShow = true;
            this.soltDFootBtn = [
              {
                label: "新增数据源",
                css: "",
                cb: ({ Item }) => {
                  this.SoltDigShow = false;
                  setTimeout(() => {
                    openUrl({
                      type: "open",
                      url: "/metadata-manage/#/metaData/index",
                      obj: {},
                    });
                  }, 200);
                },
              },
              {
                label: "确定",
                css: "primary",
                cb: ({ Item }) => {
                  this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                      this.update(id);
                    } else {
                      return false;
                    }
                  });
                },
              },
            ];
          }
          return;
        default:
          break;
      }
    },
    // 弹出框-表单模式
    showFormDig({ type, initDig = null }) {
      switch (type) {
        case "创建数据集":
          {
            if (this.activeTree) {
              this.FDTitle = "创建数据集";
              this.FDVisible = true;
              this.FDForm = [
                {
                  type: "input",
                  label: {
                    name: "中文名称",
                    width: "120",
                  },
                  key: "comment",
                  clearable: true,
                  width: "280",
                  defaultModel: initDig.comment,
                  placeholder: "",
                },
                {
                  type: "input",
                  label: {
                    name: "英文名称",
                    width: "120",
                  },
                  key: "name",
                  clearable: true,
                  width: "280",
                  defaultModel: initDig.tableName,
                  placeholder: "",
                },
                {
                  type: "select-tree",
                  label: {
                    name: "位置",
                    width: "120",
                  },
                  width: "280",
                  key: "dataSetTypeId",
                  defaultModel: null,
                  placeholder: "",
                  option: this.dataSet,
                },
              ];
              this.FDRules = {
                dataSetTypeId: [
                  {
                    required: true,
                    message: "请选择数据集位置",
                    trigger: "change",
                  },
                ],
                name: [
                  {
                    required: true,
                    message: "请输入英文名称",
                    trigger: "blur",
                  },
                ],
                comment: [
                  {
                    required: true,
                    message: "请输入中文名称",
                    trigger: "blur",
                  },
                ],
              };
              this.$set(this.FDFoot, `button`, [
                {
                  type: "ok",
                  label: "确定",
                  cb: (form, $this) => {
                    $this.$refs[this.FDId].validate((valid) => {
                      if (valid) {
                        this.addDataSet(form);
                      }
                    });
                  },
                },
              ]);
            } else {
              this.$message({
                message: "请选择数据源",
                type: "warning",
              });
            }
          }
          return;
        case "SQL-创建数据集":
          {
            if (this.activeTree) {
              this.FDTitle = "创建数据集";
              this.FDVisible = true;
              this.FDForm = [
                {
                  type: "input",
                  label: {
                    name: "中文名称",
                    width: "120",
                  },
                  key: "comment",
                  clearable: true,
                  width: "280",
                  defaultModel: "",
                  placeholder: "",
                },
                {
                  type: "input",
                  label: {
                    name: "英文名称",
                    width: "120",
                  },
                  key: "name",
                  clearable: true,
                  width: "280",
                  defaultModel: "",
                  placeholder: "",
                },
                {
                  type: "select-tree",
                  label: {
                    name: "位置",
                    width: "120",
                  },
                  width: "280",
                  key: "dataSetTypeId",
                  defaultModel: null,
                  placeholder: "",
                  option: this.dataSet,
                },
                {
                  type: "textarea",
                  label: {
                    name: "SQL",
                    width: "120",
                  },
                  width: "280",
                  key: "codeOrSql",
                  defaultModel: this.sql,
                  placeholder: "",
                  autosize: {
                    min: 7,
                    max: 7,
                  },
                },
              ];
              this.FDRules = {
                dataSetTypeId: [
                  {
                    required: true,
                    message: "请选择数据集",
                    trigger: "change",
                  },
                ],
                name: [
                  {
                    required: true,
                    message: "请输入英文名称",
                    trigger: "blur",
                  },
                ],
                comment: [
                  {
                    required: true,
                    message: "请输入中文名称",
                    trigger: "blur",
                  },
                ],
                codeOrSql: [
                  { required: true, message: "请输入SQL", trigger: "blur" },
                ],
              };
              this.$set(this.FDFoot, `button`, [
                {
                  type: "ok",
                  label: "确定",
                  cb: (form, $this) => {
                    $this.$refs[this.FDId].validate((valid) => {
                      if (valid) {
                        this.SQLcreatDataSet(form);
                      }
                    });
                  },
                },
              ]);
            } else {
              this.$message({
                message: "请选择数据源",
                type: "warning",
              });
            }
          }
          return;
        case "操作-创建数据集":
          {
            if (this.activeTree) {
              this.FDTitle = "创建数据集";
              this.FDVisible = true;
              this.FDForm = [
                {
                  type: "input",
                  label: {
                    name: "中文名称",
                    width: "120",
                  },
                  key: "comment",
                  clearable: true,
                  width: "280",
                  defaultModel: "",
                  placeholder: "",
                },
                {
                  type: "input",
                  label: {
                    name: "英文名称",
                    width: "120",
                  },
                  key: "name",
                  clearable: true,
                  width: "280",
                  defaultModel: "",
                  placeholder: "",
                },
                {
                  type: "select-tree",
                  label: {
                    name: "位置",
                    width: "120",
                  },
                  width: "280",
                  key: "dataSetTypeId",
                  defaultModel: null,
                  placeholder: "",
                  option: this.dataSet,
                },
                {
                  type: "textarea",
                  label: {
                    name: "SQL",
                    width: "120",
                  },
                  width: "280",
                  key: "codeOrSql",
                  defaultModel: initDig.executionSql,
                  placeholder: "",
                  autosize: {
                    min: 7,
                    max: 7,
                  },
                },
              ];
              this.FDRules = {
                dataSetTypeId: [
                  {
                    required: true,
                    message: "请选择数据集位置",
                    trigger: "change",
                  },
                ],
                name: [
                  {
                    required: true,
                    message: "请输入英文名称",
                    trigger: "blur",
                  },
                ],
                comment: [
                  {
                    required: true,
                    message: "请输入中文名称",
                    trigger: "blur",
                  },
                ],
                codeOrSql: [
                  { required: true, message: "请输入SQL", trigger: "blur" },
                ],
              };
              this.$set(this.FDFoot, `button`, [
                {
                  type: "ok",
                  label: "确定",
                  cb: (form, $this) => {
                    $this.$refs[this.FDId].validate((valid) => {
                      if (valid) {
                        this.SQLcreatDataSet(form);
                      }
                    });
                  },
                },
              ]);
            } else {
              this.$message({
                message: "请选择数据源",
                type: "warning",
              });
            }
          }
          return;
        default:
          break;
      }
    },
    // 分页操作
    changePage(type, { pageSize, currentPage }) {
      this.$set(this[`TPage_${type}`], `index`, currentPage);
      this.$set(this[`TPage_${type}`], `size`, pageSize);
      if (type == 1) {
        this.likeGetListTable();
      } else if (type == 2) {
        this.getHistory();
      }
    },
    lickCell({ row, column, id }) {
      this.tableActive_ = row;
      const { tableName = "", tableComment = "", executionSql = "" } = row;
      switch (column.label) {
        case "创建数据集":
          {
            if (id == this.historyTableId) {
              this.showFormDig({
                type: "操作-创建数据集",
                initDig: {
                  executionSql,
                },
              });
            } else {
              this.showFormDig({
                type: column.label,
                initDig: { tableName },
              });
            }
          }
          return;
        case "详情":
          {
            this.SoltDigShow_table = true;
            this.SoltDigTitle_tableTitle = tableName;
            this.SoltDigTitle_tableDes = tableComment;
            this.tableDetail(row);
          }
          return;
        case "复制":
          {
            this.sql = executionSql;
          }
          return;
        default:
          break;
      }
    },
    // 执行
    runSQL() {
      this.activeSql = "1";
      this.getResul();
    },
    loop(arr) {
      if (arr && arr.length) {
        arr.forEach((item) => {
          if (item.children && item.children.length) {
            this.loop(item.children);
          } else {
            delete item.children;
          }
        });
      }
    },

    /* 请求 */
    // 获取 数据源
    getSource() {
      API._publicSourceData().then((res) => {
        let Res = new ResDatas({
          res,
        }).init();
        let arr = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            arr.push({
              ...item,
              label: item.datasourceName,
              value: item.id,
            });
          });
        }
        this.source = arr;
      });
    },
    // 获取 数据集树
    getDataSetTree() {
      API._publicDataSetTree().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.loop(Res.data.children.children);
        this.dataSet = Res.data.children.children;
      });
    },
    // 获取数据源列表-左侧
    getSourceList() {
      API.dataSourceList().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.sourceTree = Res;
        this.sourceTotal = Res.length;
      });
    },
    // 编辑 - 数据源
    update(id) {
      const { name, dataSourceType, dataSourceId } = this.ruleForm;
      API.dataSourceUpdate({
        id,
        name,
        dataSourceType,
        dataSourceId,
      })
        .then((res) => {
          new ResDatas({ res, code: 0 }).state();
          this.SoltDigShow = false;
          this.getSourceList();
        })
        .catch((error) => {
          this.SoltDigShow = false;
        });
      console.log("编辑");
    },
    // 删除 - 数据源
    del({ id }) {
      API.dataSourceDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getSourceList();
      });
    },
    // 添加 - 数据源
    add() {
      const { name, dataSourceType, dataSourceId } = this.ruleForm;
      API.dataSourceSave({
        name,
        dataSourceType,
        dataSourceId,
      })
        .then((res) => {
          new ResDatas({
            res,
            code: 0,
          }).state();
          this.SoltDigShow = false;
          this.getSourceList();
        })
        .catch((error) => {
          this.SoltDigShow = false;
        });
    },
    /* 表 */
    // 获取 表 列表
    getListTable() {
      if (this.activeTree && this.activeTree.dataSourceId) {
        this.TLoading = true;
        API.dataSourceTableList({
          dataSourceId: this.activeTree.dataSourceId,
        }).then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          this.tableTitle = Res.title;
          this.tableDataSource = Res.data;
          this.likeGetListTable();
        });
      }
    },
    // 模糊查询(前端)
    likeGetListTable() {
      this.TLoading = true;
      this.$set(this.TPage_1, `size`, this.TPage_1.size);
      setTimeout(() => {
        if (this.likeTable) {
          this.tableData = this.tableDataSource.filter((val, index) => {
            return val.tableName.indexOf(this.likeTable) !== -1;
          });
        } else {
          this.tableData = this.tableDataSource;
        }
        this.$set(this.TPage_1, `total`, this.tableData.length);
        this.tableData = this.tableData.slice(
          (this.TPage_1.index - 1) * this.TPage_1.size,
          (this.TPage_1.index - 1) * this.TPage_1.size + this.TPage_1.size
        );
        this.TLoading = false;
      }, 500);
    },
    // 添加 - 数据集
    addDataSet({ dataSetTypeId, name, comment }) {
      if (this.activeTree && this.activeTree.id && this.tableActive_) {
        API.dataSourceTableSetDataSet({
          type: 1,
          name,
          dataSetTypeId,
          dataSourceId: this.activeTree.id,
          codeOrSql: this.tableActive_.tableName,
          comment,
        })
          .then((res) => {
            new ResDatas({
              res,
              code: 0,
            }).state();
            this.FDVisible = false;
            this.getListTable();
          })
          .catch((error) => {
            this.FDVisible = false;
          });
      }
    },
    // 表 - 详情
    tableDetail({ tableName }) {
      this.TLoading_3 = true;
      if (this.activeTree && this.activeTree.dataSourceId) {
        API.dataSourceTableDetail({
          tableName,
          dataSourceId: this.activeTree.dataSourceId,
        })
          .then((res) => {
            this.TLoading_3 = false;
            let Res = new ResDatas({
              res,
              code: 0,
            }).init();
            if (Res) {
              const { data, title } = Res;
              this.tableTitle_3 = title;
              this.tableData_3 = data;
            } else {
              this.tableData_3 = [];
            }
          })
          .catch((error) => {
            this.TLoading_3 = false;
          });
      }
    },
    /* 即席查询SQL */
    // 获取  执行结果 列表
    getResul() {
      if (this.activeTree && this.activeTree.id) {
        if (this.sql) {
          this.TLoading_1 = true;
          API.dataSourceSQLRun({
            dataSourceId: this.activeTree.id,
            executionSql: this.sql,
          })
            .then((res) => {
              let Res = new ResDatas(
                {
                  res,
                  code: 0,
                  fieldKey: {
                    data: "data",
                    title: "title",
                    total: "total",
                    pageSize: "pageSize",
                  },
                  titleKey: [],
                },
                "TLoading_1",
                this
              );
              if (Res.init()) {
                const { data, title } = Res.formatData();
                if (title.length) {
                  title.forEach((item) => {
                    if (title[title.length - 1].prop == item.prop) {
                      item["fixed"] = "right";
                    }
                  });
                }
                this.tableTitle_1 = title;
                this.tableData_1 = data;
              } else {
                this.tableData_1 = [];
              }
            })
            .catch((error) => {
              this.TLoading_1 = false;
            });
        } else {
          this.$message({
            message: "请输入要执行的SQL",
            type: "warning",
          });
        }
      } else {
        this.$message({
          message: "请选择数据源",
          type: "warning",
        });
      }
    },
    // 创建数据集
    SQLcreatDataSet({ name, dataSetTypeId, codeOrSql, comment }) {
      if (this.activeTree && this.activeTree.id) {
        API.dataSourceTableSetDataSet({
          name,
          dataSetTypeId,
          codeOrSql,
          type: 2,
          dataSourceId: this.activeTree.id,
          comment,
        }).then((res) => {
          new ResDatas({
            res,
            code: 0,
          }).state();
          this.FDVisible = false;
        });
      }
    },
    // 获取 历史记录 列表
    getHistory() {
      if (this.activeTree && this.activeTree.id) {
        this.TLoading_2 = true;
        API.dataSourceSQLHistory({
          dataSourceId: this.activeTree.id,
          pageNum: this.TPage_2.index,
          pageSize: this.TPage_2.size,
        })
          .then((res) => {
            let Res = new ResDatas(
              {
                res,
                code: 0,
                fieldKey: {
                  data: "data",
                  title: "title",
                  total: "total",
                  pageSize: "pageSize",
                },
                titleKey: [],
              },
              "TLoading_2",
              this
            );
            if (Res.init()) {
              const { data, total, pageSize, title } = Res.formatData();
              this.tableTitle_2 = title;
              this.tableData_2 = data;
              this.$set(this.TPage_2, `total`, total);
            } else {
              this.tableData_2 = [];
              this.$set(this.TPage_2, `total`, 0);
              this.$set(this.TPage_2, `index`, 1);
            }
          })
          .catch((error) => {
            this.TLoading_2 = false;
          });
      }
    },
    // 即时查询SQL-保存
    saveDataSet() {
      if (this.$route.query && this.$route.query.row) {
        const { id } = JSON.parse(this.$route.query.row);
        API.dataSourceSQLSave({
          codeOrSql: this.sql,
          id,
          type: 2,
        }).then((res) => {
          new ResDatas({
            res,
            code: 0,
          }).state();
        });
      }
    },
  },
  mounted() {
    this.getSourceList();
    this.getSource();
    this.getDataSetTree();
    if (this.$route.query && this.$route.query.row) {
      const { codeOrSql, dataSourceId, dataSourceName } = JSON.parse(
        this.$route.query.row
      );
      this.activeName = "2";
      this.sql = codeOrSql;
      this.isShowSave = false;
      this.activeTreeNodeKey = dataSourceId;
      this.activeTree = {
        name: dataSourceName,
        id: dataSourceId,
      };
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(dataSourceId);
      });
    } else {
      this.isShowSave = true;
    }
  },
  created() {
    if (this.$route.query && this.$route.query.row) {
      const { codeOrSql, dataSourceId } = JSON.parse(this.$route.query.row);
      this.activeTreeNodeKey = dataSourceId;
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(dataSourceId);
      });
    }
  },
};
</script>
 
<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.any-data-source {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .task {
    &-tree {
      float: left;
      width: 260px;
      height: 100%;
      box-sizing: border-box;
      border-right: 1px solid #e4e7ed;
      padding: 5px;
      overflow: auto;
      /deep/
        .el-tree--highlight-current
        .el-tree-node.is-current
        > .el-tree-node__content {
        color: $lt_menu_bg_active;
      }
    }
    &-view {
      float: left;
      height: 100%;
      width: calc(100% - 260px);
      box-sizing: border-box;
      padding: 5px;
      &-title {
        margin: 5px 0 -10px 13px;
        height: 50px;
      }
      .view-area {
        height: calc(100% - 72px);
        box-sizing: border-box;
        overflow: auto;
        .table {
          width: 100%;
          height: calc(100% - 40px);
          overflow: auto;
        }
      }
    }
  }
  .M-title {
    box-sizing: border-box;
    p {
      position: relative;
      overflow: hidden;
      i {
        position: absolute;
        top: 2px;
        width: 3px;
        height: 15px;
        background: $table_edit_btn_color_active;
      }
      span {
        display: inline-block;
        height: 18px;
        line-height: 18px;
        margin-left: 12px;
        font-size: 14px;
      }
    }
  }
  .tree {
    margin-top: 10px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .soltDigContent {
    // height: 400px;
    // overflow: hidden;
    .tree {
      max-height: 400px;
      overflow: auto;
      overflow-x: auto;
    }
    .table-title {
      &-name {
        margin-left: 30px;
        overflow: hidden;
      }
      &-desc {
        margin-left: 45px;
      }
    }
  }
  .tree-text {
    display: inline-block;
    width: 175px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tree-text-search {
    display: inline-block;
    width: 485px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  //   数据源总数
  .source-total {
    float: right;
    margin-top: 9px;
  }
  //   表 查询
  .table-query {
    width: 250px;
    float: right;
    margin-bottom: 10px;
    margin-right: 10px;
  }
  // sql文本
  .sql {
    margin-left: 15px;
    margin-top: 5px;
  }
  // sql数据集
  .textarea {
    margin-top: 10px;
  }
  // SQL 表格
  .sql-table {
    height: calc(100% - 318px);
    overflow: auto;
  }
}
</style>
