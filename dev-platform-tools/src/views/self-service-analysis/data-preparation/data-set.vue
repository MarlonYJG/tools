<!--
 * @Author: Marlon
 * @Date: 2020-05-26 08:36:20
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-29 09:27:30
 * @Description: 数据集
--> 
 <template>
  <div class="any-data-source">
    <div class="task-tree">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        style="margin-bottom: 5px;width:100%;"
        @click="showFormDialog({type:'创建根目录'})"
      >创建根目录</el-button>
      <el-tree
        class="tree"
        ref="tree"
        :highlight-current="true"
        node-key="id"
        :current-node-key="'1'"
        :default-expanded-keys="defaultTree"
        :data="sourceTree"
        :props="defaultProps"
        @node-click="handleNodeClick"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <el-tooltip
            v-if="node.label.length >10"
            class="item"
            effect="dark"
            :content="`${node.label}`"
            placement="top-start"
          >
            <span class="tree-text">{{ node.label }}</span>
          </el-tooltip>
          <span v-else class="tree-text">{{ node.label }}</span>
          <span v-if="data.id == activeTree.id">
            <el-popover placement="right" popper-class="data-set-tree-edit" trigger="hover">
              <ul>
                <li @click="()=>treeEdit(node,data,1)">添加子分类</li>
                <li @click="()=>treeEdit(node,data,2)">重命名</li>
                <li @click="()=>treeEdit(node,data,3)">删除</li>
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
            当前分类:
            <span>建设工程</span>
          </span>
        </p>
      </div>
      <div class="view-area">
        <div class="view-area-title">
          <el-button type="primary" size="small" style="margin-bottom: 5px;" @click="jumpTo">新建数据集</el-button>
          <el-input class="table-query" placeholder="搜索" v-model="likeTable" size="small" clearable>
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              style="cursor: pointer;"
              @click="getDataSet"
            ></i>
          </el-input>
        </div>
        <div class="view-area-table">
          <TableDefault
            TId="table"
            :TLoading="TLoading"
            :TTitle="tableTitle"
            :TData="tableData"
            :TIsShowPage="true"
            :TTotal="TPage.total"
            :TCurrentPage="TPage.index"
            :TPageSize="TPage.size"
            :TEdit="TEdit"
            :TAlign="TAlign"
            @editBtnCb="editBtnCb"
            @clickCell="lickCell"
            @changePage="changePage"
          ></TableDefault>
        </div>
      </div>
    </div>
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
    <!-- 弹出框-插槽 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="600"
      @editBtnCb="editBtnCb"
    >
      <div slot="soltDigContent" class="soltDigContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="124px" size="medium">
          <el-form-item label="已有数据源：" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择数据源类型">
              <el-option
                v-for="(item, index) in sourceType"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-form-item prop="region" style="float: right;width: 200px;">
              <el-select v-model="ruleForm.region" placeholder="请选择数据源">
                <el-option
                  v-for="(item, index) in source"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="删除同名表：">
            <el-checkbox v-model="ruleForm.del"></el-checkbox>
            <el-form-item label="表名称：" prop="name" style="float: right;">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </SoltDialog>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { cellJump, openUrl } from "utils/jump";
import SoltDialog from "@/components/dialog/solt-dialog";

export default {
  mixins: [mixin],
  components: {
    SoltDialog,
  },
  data() {
    return {
      // 数据集分类
      sourceTree: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      defaultTree: [],
      activeTree: "",
      // 数据集-表
      likeTable: "",
      TLoading: false,
      TEdit: {
        show: true,
        slot: true,
        type: "popover",
        title: "操作",
        width: 280,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "仪表盘",
            css: "text",
          },
          {
            label: "电子表格",
            css: "text",
          },
          {
            label: "分析挖掘",
            css: "text",
          },
          {
            label: "其他",
            css: "text",
            select: [
              {
                label: "属性",
                css: "text",
              },
              {
                label: "移动",
                css: "text",
              },
              {
                label: "复制",
                css: "text",
              },
              {
                label: "缓存设置",
                css: "text",
              },
              {
                label: "清除缓存",
                css: "text",
              },
              {
                label: "数据同步",
                css: "text",
              },
              {
                label: "删除",
                css: "text",
                pass: true,
              },
              {
                label: "修改SQL",
                css: "text",
              },
            ],
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
        { prop: "dataSetTypeName", label: "分类名称" },
        { prop: "name", label: "数据集名称" },
        { prop: "codeOrSql", label: "数据集编码" },
        { prop: "typeName", label: "数据集类型" },
        { prop: "dataSourceName", label: "对应数据源" },
        { prop: "createTime", label: "创建时间" },
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      // 弹出框
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFoot: {
        button: [],
      },
      FDRules: {},
      // 弹出框-插槽
      SoltDigShow: false,
      SoltDigTitle: "数据同步到",
      soltDFootBtn: [
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
                // TODO
              } else {
                return false;
              }
            });
          },
        },
      ],
      ruleForm: {
        name: "",
        region: "",
        del: false,
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
      },
      sourceType: [],
      source: [],
      tableActive_: "",
    };
  },
  watch: {
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
        this.SoltDigShow = this.FDVisible = editItem.close;
        this.FDForm = [];
        this.ruleForm = {
          name: "",
          region: "",
          del: false,
        };
      } else if (text === "删除") {
      }
    },
    // 左侧 树操作
    treeEdit(node, data, type) {
      this.hideDom();
      switch (type) {
        case 1:
          {
            this.FDVisible = true;
            this.FDTitle = "添加子分类";
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                key: "name",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
            ];
            this.FDRules = {
              name: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.saveDataSetType({ id: data.id, name: form.name });
                    }
                  });
                },
              },
            ]);
          }
          return;
        case 2:
          {
            this.FDVisible = true;
            this.FDTitle = "重命名";
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                key: "name",
                clearable: true,
                width: "280",
                defaultModel: data.label,
                placeholder: "",
              },
            ];
            this.FDRules = {
              name: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.updateDataSetType({ id: data.id, name: form.name });
                    }
                  });
                },
              },
            ]);
          }
          return;
        case 3:
          {
            this.$confirm(`即将删除“${data.label}”数据集, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.delDataSetType(data.id);
              })
              .catch(() => {});
          }
          return;
        default:
          break;
      }
    },
    // 表单弹出框
    showFormDialog({ type }) {
      switch (type) {
        case "创建根目录":
          {
            this.FDVisible = true;
            this.FDTitle = "创建根目录";
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                key: "name",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
            ];
            this.FDRules = {
              name: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.saveDataSetType({ id: 1, name: form.name });
                    }
                  });
                },
              },
            ]);
          }
          return;

        default:
          break;
      }
    },
    // 关闭全局DOM
    hideDom() {
      if (document.getElementsByClassName("data-set-tree-edit").length) {
        document.getElementsByClassName("data-set-tree-edit")[0].style =
          "display: none;";
      }
      if (document.getElementsByClassName("table_custom_edit_popover").length) {
        let popover = document.getElementsByClassName(
          "table_custom_edit_popover"
        );
        for (let index = 0; index < popover.length; index++) {
          popover[index].style = "display: none;";
        }
      }
    },
    // 激活树
    handleNodeClick(data) {
      this.activeTree = data;
      this.getDataSet();
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getDataSet();
    },
    lickCell({ row, column, id }) {
      this.tableActive_ = row;
      const { name, comment } = row;
      switch (column.label) {
        case "编辑":
          {
            cellJump(this, {
              row,
              column,
              TClickItem: [
                {
                  link: "/other/dataSetUpdate",
                  jump: {
                    type: "push",
                    mode: "int",
                  },
                },
              ],
            });
          }
          return;
        case "仪表盘":
          {
            // TODO
          }
          return;
        case "电子表格":
          {
            // TODO
          }
          return;
        case "分析挖掘":
          {
            // TODO
          }
          return;
        case "属性":
          {
            this.hideDom();
            this.FDVisible = true;
            this.FDTitle = "属性";
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                key: "name",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "描述",
                  width: "120",
                },
                width: "280",
                key: "description",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.FDRules = {
              name: [
                { required: true, message: "请输入名称", trigger: "blur" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.dataSetAttr(form);
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "移动":
          {
            this.hideDom();
            this.FDVisible = true;
            this.FDTitle = "移动到";
            this.FDForm = [
              {
                type: "select-tree",
                label: {
                  name: "位置",
                  width: "120",
                },
                width: "200",
                key: "dataSetTypeId",
                defaultModel: null,
                placeholder: "",
                option: this.sourceTree,
              },
            ];
            this.FDRules = {
              dataSetTypeId: [
                { required: true, message: "请选择数据集", trigger: "change" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.dataSetMove(form);
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "复制":
          {
            this.hideDom();
            this.FDVisible = true;
            this.FDTitle = "复制到";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "英文名称",
                  width: "120",
                },
                key: "name",
                clearable: true,
                width: "280",
                disabled: true,
                defaultModel: name,
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "中文名称",
                  width: "120",
                },
                key: "comment",
                clearable: true,
                width: "280",
                defaultModel: comment,
                placeholder: "",
              },
              {
                type: "select-tree",
                label: {
                  name: "分类",
                  width: "120",
                },
                width: "280",
                key: "dataSetTypeId",
                defaultModel: null,
                placeholder: "",
                option: this.sourceTree,
              },
            ];
            this.FDRules = {
              dataSetTypeId: [
                { required: true, message: "请选择数据集", trigger: "change" },
              ],
              comment: [
                { required: true, message: "请输入名称", trigger: "blur" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.saveAsReq(form);
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "缓存设置":
          {
            this.hideDom();
            this.FDVisible = true;
            this.FDTitle = "缓存配置";
            this.FDForm = [
              {
                type: "switch",
                show: false,
                label: {
                  name: "开启缓存",
                  width: "120",
                },
                width: "200",
                key: "incrFlag",
                defaultModel: false,
                placeholder: "",
                off: {
                  label: "关闭",
                },
                on: {
                  label: "开启",
                  color: "#13ce66",
                },
              },
              {
                type: "select",
                label: {
                  name: "缓存时间",
                  width: "120",
                },
                width: "200",
                key: "type",
                defaultModel: "",
                placeholder: "",
                option: [],
              },
            ];
            this.FDRules = {
              name: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      // TODO
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "清除缓存":
          {
            this.hideDom();
            this.$confirm(`您确认清除缓存吗?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                // TODO
              })
              .catch(() => {});
          }
          return;
        case "数据同步":
          {
            this.hideDom();
            this.SoltDigShow = true;
          }
          return;
        case "删除":
          {
            this.hideDom();
            this.$confirm(`即将删除“${name}”数据集, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.dataSetDel(row);
              })
              .catch(() => {});
          }
          return;
        case "修改SQL":
          {
            this.hideDom();
            cellJump(this, {
              row,
              column,
              TClickItem: [
                {
                  link: "/analysis/preparation/dataSource",
                  jump: {
                    type: "push",
                    mode: "int",
                  },
                },
              ],
            });
          }
          return;
        default:
          break;
      }
    },
    // 新建数据集
    jumpTo() {
      cellJump(this, {
        TClickItem: [
          {
            link: "/analysis/preparation/dataSource",
            jump: {
              type: "push",
              mode: "int",
            },
          },
        ],
      });
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
    // 获取数据集 分类树
    getDataSetTree() {
      API._publicDataSetTree().then((res) => {
        let Res = new ResDatas({ res, code: 0 }).init();
        if (Res) {
          const {
            data: {
              children: { children },
            },
          } = Res;
          this.loop(children);
          this.sourceTree = children;
        }
      });
    },
    // 数据集分类 保存
    saveDataSetType({ id, name }) {
      API.dataSetTypeSave({
        name,
        parentId: id,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getDataSetTree();
      });
    },
    // 数据集分类 修改
    updateDataSetType({ id, name }) {
      API.dataSetTypeUpdate({
        id,
        name,
      }).then((res) => {
        new ResDatas({ res, code: 0 }).state();
        this.FDVisible = false;
        this.getDataSetTree();
      });
    },
    // 数据集分类 删除
    delDataSetType(id) {
      API.dataSetTypeDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getDataSetTree();
      });
    },
    // 数据集 列表
    getDataSet() {
      if (this.activeTree) {
        this.TLoading = true;
        API.dataSetList({
          dataSetTypeId: this.activeTree.id,
          name: this.likeTable,
          pageNum: this.TPage.index,
          pageSize: this.TPage.size,
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
                  index: "pageNo",
                },
              },
              "TLoading",
              this
            );
            if (Res.init()) {
              const { data, total, pageSize, title, index } = Res.formatData();
              this.tableTitle = title;
              data.forEach((item) => {
                if (item.type == 1) {
                  item["edit"] = {
                    show: true,
                    slot: true,
                    type: "popover",
                    title: "操作",
                    width: 280,
                    fixed: "right",
                    editTypes: [
                      {
                        label: "编辑",
                        css: "success",
                      },
                      // {
                      //   label: "仪表盘",
                      //   css: "warning"
                      // },
                      // {
                      //   label: "电子表格",
                      //   css: "warning"
                      // },
                      // {
                      //   label: "分析挖掘",
                      //   css: "warning"
                      // },
                      {
                        label: "其他",
                        css: "warning",
                        select: [
                          {
                            label: "属性",
                            css: "warning",
                          },
                          {
                            label: "移动",
                            css: "warning",
                          },
                          {
                            label: "复制",
                            css: "warning",
                          },
                          // {
                          //   label: "缓存设置",
                          //   css: "warning"
                          // },
                          // {
                          //   label: "清除缓存",
                          //   css: "warning"
                          // },
                          // {
                          //   label: "数据同步",
                          //   css: "warning"
                          // },
                          {
                            label: "删除",
                            css: "danger",
                            pass: true,
                          },
                        ],
                      },
                    ],
                  };
                } else {
                  item["edit"] = {
                    show: true,
                    slot: true,
                    type: "popover",
                    title: "操作",
                    width: 280,
                    fixed: "right",
                    editTypes: [
                      {
                        label: "编辑",
                        css: "success",
                      },
                      // {
                      //   label: "仪表盘",
                      //   css: "warning"
                      // },
                      // {
                      //   label: "电子表格",
                      //   css: "warning"
                      // },
                      // {
                      //   label: "分析挖掘",
                      //   css: "warning"
                      // },
                      {
                        label: "其他",
                        css: "warning",
                        select: [
                          {
                            label: "属性",
                            css: "warning",
                          },
                          {
                            label: "移动",
                            css: "warning",
                          },
                          {
                            label: "复制",
                            css: "warning",
                          },
                          // {
                          //   label: "缓存设置",
                          //   css: "warning"
                          // },
                          // {
                          //   label: "清除缓存",
                          //   css: "warning"
                          // },
                          // {
                          //   label: "数据同步",
                          //   css: "warning"
                          // },
                          {
                            label: "删除",
                            css: "danger",
                            pass: true,
                          },
                          {
                            label: "修改SQL",
                            css: "danger",
                          },
                        ],
                      },
                    ],
                  };
                }
              });
              this.tableData = data;
              this.$set(this.TPage, `total`, total);
              this.$set(this.TPage, `size`, pageSize);
              this.$set(this.TPage, `index`, index);
            } else {
              this.tableData = [];
              this.$set(this.TPage, `total`, 0);
              this.$set(this.TPage, `size`, 10);
              this.$set(this.TPage, `index`, 1);
            }
          })
          .catch((error) => {
            this.TLoading = false;
          });
      }
    },
    // 数据集 属性
    dataSetAttr({ description, name }) {
      if (this.tableActive_) {
        API.dataSetAttr({
          dataSetId: this.tableActive_.id,
          description,
          name,
        }).then((res) => {
          new ResDatas({ res, code: 0 }).state();
          this.FDVisible = false;
          this.getDataSet();
        });
      }
    },
    // 数据集 移动
    dataSetMove({ dataSetTypeId }) {
      if (this.activeTree) {
        API.dataSetMove({
          dataSetTypeId,
          id: this.tableActive_.id,
        }).then((res) => {
          new ResDatas({
            res,
            code: 0,
          }).state();
          this.FDVisible = false;
          this.getDataSet();
        });
      }
    },
    // 数据集 缓存设置
    // 数据集 清除缓存
    // 数据集 数据同步
    // 数据集 删除
    dataSetDel({ id }) {
      API.dataSetDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getDataSet();
      });
    },
    // 复制
    saveAsReq({ name, dataSetTypeId, comment }) {
      if (this.tableActive_) {
        API.dataSetUpdateSaveAs({
          id: this.tableActive_.id,
          dataSetTypeId,
          name,
          comment,
        }).then((res) => {
          new ResDatas({
            res,
            code: 0,
          }).state();
          this.getDataSet();
          this.FDVisible = false;
        });
      }
    },
    // 数据集 修改SQL
  },
  mounted() {
    this.getDataSetTree();
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.any-data-source {
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: row;
  .task {
    &-tree {
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
      height: 100%;
      flex: 1;
      box-sizing: border-box;
      //   border: 1px solid red;
      padding: 5px;
      &-title {
        margin: 5px 0 -10px 13px;
      }
      .view-area {
        height: calc(100% - 10px);
        box-sizing: border-box;
        overflow: hidden;
        &-title {
          margin-top: 10px;
        }
        &-table {
          width: 100%;
          height: calc(100% - 53px);
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
    width: 158px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tree-text-search {
    display: inline-block;
    width: 485px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  //   表 查询
  .table-query {
    width: 250px;
    float: right;
    margin-bottom: 10px;
  }
}
</style>
