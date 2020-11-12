<!--
 * @Author: Marlon
 * @Date: 2020-07-20 22:10:57
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-28 15:51:46
 * @Description: 代码集
--> 
<template>
  <div class="code-set">
    <div class="code-set-top">
      <div class="code-set-top-edit-area">
        <ul class="code-set-top-edit-area-btn">
          <li>
            <el-button size="small" @click="showFormDialog({type:'新增字典表'})">新增字典表</el-button>
          </li>
        </ul>
        <ul class="code-set-top-edit-area-select">
          <li>
            <label for>项目：</label>
            <el-select
              v-model="proVal"
              clearable
              filterable
              placeholder="请选择项目"
              size="small"
              @change="clearVals"
            >
              <el-option
                v-for="item in proList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <label for>分类：</label>
            <el-select v-model="classifyVal" clearable filterable placeholder="请选择分类" size="small">
              <el-option
                v-for="item in classifyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <el-input placeholder="请输入名称(编码)" v-model="blockVal" size="small" style="width: 195px;">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="getDicList"
                style="cursor: pointer;"
              ></i>
            </el-input>
          </li>
        </ul>
      </div>
      <div class="code-set-top-table">
        <TableDefault
          :TId="TId_y"
          :TLoading="TLoading"
          :TTitle="tableTitle"
          :TData="tableData"
          :TIsShowPage="true"
          :TTotal="TPage.total"
          :TCurrentPage="TPage.index"
          :TPageSize="TPage.size"
          :TEdit="TEdit"
          :TAlign="TAlign"
          :TActiveRow="TActiveRow"
          TRowKey="id"
          :TClickItem="TClickItem"
          @editBtnCb="editBtnCb"
          @clickCell="lickCell"
          @clickRow="clickRow"
          @changePage="changePage"
        ></TableDefault>
      </div>
    </div>
    <span class="data-detail-mid" @click="fold = !fold">
      <i v-if="fold" class="el-icon-arrow-down up-dow"></i>
      <i v-else class="el-icon-arrow-up up-dow"></i>
    </span>
    <div v-show="fold" class="code-set-bot">
      <p
        style="margin: 10px 5px;font-size: 14px;"
      >字典表“{{this.activeRow_ && this.activeRow_.name}}”的枚举值</p>
      <ul class="bot-data-set-edit">
        <li>
          <el-button size="small" @click="showFormDialog({type:'新增枚举值'})">新增枚举值</el-button>
        </li>
      </ul>
      <div>
        <TableDefault
          :TId="TId"
          :TCurrentTid="TId"
          :TRowDrop="true"
          :TLoading="TableDigLoading"
          :TTitle="TableTitle"
          :TData="TableData"
          :TIsShowPage="true"
          :TTotal="TPage_1.total"
          :TCurrentPage="TPage_1.index"
          :TPageSize="TPage_1.size"
          :TEdit="TEdit_1"
          :TAlign="TAlign_1"
          :TClickItem="TClickItem_1"
          @editBtnCb="editBtnCb"
          @clickCell="lickCellDataSet"
          @rowDrop="rowDrop"
          @changePage="changePage_1"
        ></TableDefault>
      </div>
    </div>
    <!-- 表单 -->
    <FormDialog
      :FDId="FDId"
      :FDVisible="FDVisible"
      :FDTitle="FDTitle"
      FDWidth="500"
      :FDForm="FDForm"
      :FDFoot="FDFoot"
      :FDRules="FDRules"
      @editBtnCb="editBtnCb"
      @FDhandlerSelect="FDhandlerSelect"
    ></FormDialog>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import Sortable from "sortablejs";

const hierarchyDicList = [
  { label: 1, value: 1 },
  { label: 2, value: 2 },
  { label: 3, value: 3 },
  { label: 4, value: 4 },
];

export default {
  mixins: [mixin],
  data() {
    return {
      fold: true,
      // 查询条件
      proVal: "",
      proList: [],
      classifyList: [],
      classifyVal: "",
      blockVal: "",
      // 表格
      TId_y: "bussiness",
      TLoading: false,
      TActiveRow: 0,
      TEdit: {
        show: true,
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
            pass: true,
          },
        ],
      },
      TAlign: [
        {
          key: "left",
          item: [],
        },
      ],
      tableTitle: [
        { label: "项目", prop: "areaName" },
        { label: "分类", prop: "codeTypeName" },
        { label: "编码", prop: "code" },
        { label: "名称", prop: "name" },
        { label: "备注", prop: "remark" },
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      TClickItem: [
        {
          link: "",
          cells: [],
        },
      ],
      //   数据集列表
      TId: "table-data-set",
      TableData: [],
      TableTitle: [
        { label: "编码", prop: "code" },
        { label: "名称", prop: "name" },
        { label: "层级", prop: "hierarchy" },
        { label: "顺序", prop: "oder" },
        { label: "说明", prop: "instructions" },
        { label: "备注", prop: "remark" },
      ],
      TableDigLoading: false,
      TPage_1: {
        total: 0,
        index: 1,
        size: 10,
      },
      TEdit_1: {
        show: true,
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
            pass: true,
          },
        ],
      },
      TAlign_1: [
        {
          key: "left",
          item: [],
        },
      ],
      TClickItem_1: [
        {
          link: "",
          cells: [],
        },
      ],
      // 弹出框
      FDVisible: false,
      FDId: "form_dialog_1",
      FDForm: [],
      FDTitle: "",
      FDFoot: {
        button: [],
      },
      FDRules: {},
      // 获取点击值的信息
      activeRow_: "",
    };
  },
  watch: {
    activeRow_: {
      handler(newVal) {
        if (newVal) {
          this.getMuList();
        } else {
          this.TableData = [];
        }
      },
      deep: true,
    },
    proVal: {
      handler(newVal) {
        this.getDicList();
        if (newVal) {
          this.getSortList(newVal);
        }
      },
    },
    classifyVal: {
      handler(newVal) {
        this.getDicList();
      },
    },
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.FDVisible = editItem.close;
        this.FDForm = [];
      }
    },
    // 表格弹出框-
    showFormDialog({ type, initDig = null, row = null }) {
      switch (type) {
        case "新增字典表":
          {
            this.FDTitle = "新增字典表";
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
                type: "input",
                label: {
                  name: "编码",
                  width: "120",
                },
                key: "code",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "项目",
                  width: "120",
                },
                width: "280",
                key: "areaId",
                defaultModel: this.proVal,
                placeholder: "",
                option: this.proList,
              },
              {
                type: "select",
                label: {
                  name: "分类",
                  width: "120",
                },
                width: "280",
                key: "codeTypeId",
                defaultModel: this.classifyVal,
                placeholder: "",
                option: [],
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "120",
                },
                key: "remark",
                width: "280",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            if (this.proVal) {
              this.getSortList(this.proVal, "dig", this.classifyVal);
            }

            this.FDRules = {
              name: [
                { required: true, message: "请输入名称", trigger: "blur" },
              ],
              code: [
                { required: true, message: "请输入编码", trigger: "blur" },
              ],
              areaId: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
              codeTypeId: [
                { required: true, message: "请选择分类", trigger: "change" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.addDic(form);
                    }
                  });
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        case "新增枚举值":
          {
            this.FDTitle = "新增枚举值";
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
                type: "input",
                label: {
                  name: "编码",
                  width: "120",
                },
                key: "code",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "项目",
                  width: "120",
                },
                width: "280",
                key: "proId",
                defaultModel: "",
                placeholder: "",
                option: this.proList,
              },
              {
                type: "select",
                label: {
                  name: "层级",
                  width: "120",
                },
                width: "280",
                key: "hierarchy",
                defaultModel: "",
                placeholder: "",
                option: hierarchyDicList,
              },
              {
                type: "input",
                label: {
                  name: "顺序",
                  width: "120",
                },
                width: "280",
                key: "oder",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "说明",
                  width: "120",
                },
                width: "280",
                key: "instructions",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "120",
                },
                key: "remark",
                width: "280",
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
              code: [
                { required: true, message: "请输入编码", trigger: "blur" },
              ],
              proId: [
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
                      const {
                        name,
                        code,
                        proId,
                        hierarchy,
                        oder,
                        instructions,
                        remark,
                      } = form;
                      this.addMu({
                        name,
                        code,
                        areaId: proId,
                        hierarchy,
                        oder,
                        instructions,
                        remark,
                      });
                    }
                  });
                },
              },
            ]);
            if (this.activeRow_) {
              this.FDVisible = true;
            }
          }
          return;
        case "字典表-编辑":
          {
            this.FDTitle = "编辑字典表";
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
                defaultModel: initDig.name,
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "编码",
                  width: "120",
                },
                key: "code",
                clearable: true,
                width: "280",
                defaultModel: initDig.code,
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "项目",
                  width: "120",
                },
                width: "280",
                key: "areaId",
                defaultModel: initDig.areaId,
                placeholder: "",
                option: this.proList,
              },
              {
                type: "select",
                label: {
                  name: "分类",
                  width: "120",
                },
                width: "280",
                key: "codeTypeId",
                defaultModel: initDig.codeTypeId,
                placeholder: "",
                option: [],
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "120",
                },
                key: "remark",
                width: "280",
                defaultModel: initDig.remark,
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
              code: [
                { required: true, message: "请输入编码", trigger: "blur" },
              ],
              areaId: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
              codeTypeId: [
                { required: true, message: "请选择分类", trigger: "change" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.updateDic({
                        ...form,
                        id: row.id,
                        areaId: row.areaId,
                      });
                    }
                  });
                },
              },
            ]);
            this.FDVisible = true;
            this.getSortList(initDig.areaId, "dig", initDig.codeTypeId);
          }
          return;
        case "枚举值-编辑":
          {
            this.FDTitle = "编辑枚举值";
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
                defaultModel: initDig.name,
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "编码",
                  width: "120",
                },
                key: "code",
                clearable: true,
                width: "280",
                defaultModel: initDig.code,
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "项目",
                  width: "120",
                },
                width: "280",
                key: "proId",
                defaultModel: initDig.areaId,
                placeholder: "",
                option: this.proList,
              },
              {
                type: "select",
                label: {
                  name: "层级",
                  width: "120",
                },
                width: "280",
                key: "hierarchy",
                defaultModel: initDig.hierarchy,
                placeholder: "",
                option: hierarchyDicList,
              },
              {
                type: "input",
                label: {
                  name: "顺序",
                  width: "120",
                },
                width: "280",
                key: "oder",
                defaultModel: initDig.oder,
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "说明",
                  width: "120",
                },
                width: "280",
                key: "instructions",
                defaultModel: initDig.instructions,
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "120",
                },
                key: "remark",
                width: "280",
                defaultModel: initDig.remark,
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
              code: [
                { required: true, message: "请输入编码", trigger: "blur" },
              ],
              proId: [
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
                      const {
                        name,
                        code,
                        proId,
                        hierarchy,
                        oder,
                        instructions,
                        remark,
                      } = form;
                      this.updateMu({
                        codeSetId: this.activeRow_.id,
                        id: row.id,
                        name,
                        code,
                        areaId: proId,
                        hierarchy,
                        oder,
                        instructions,
                        remark,
                      });
                    }
                  });
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        default:
          break;
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getDicList();
    },
    changePage_1({ pageSize, currentPage }) {
      this.$set(this.TPage_1, `index`, currentPage);
      this.$set(this.TPage_1, `size`, pageSize);
      this.getMuList();
    },
    lickCell({ row, column, id }) {
      this.activeRow_ = row;
      const { name, code, areaId, codeTypeId, remark = "" } = row;
      switch (column.label) {
        case "编辑":
          {
            this.showFormDialog({
              type: "字典表-编辑",
              initDig: {
                name,
                code,
                areaId,
                remark,
                codeTypeId,
              },
              row,
            });
          }
          return;
        case "删除":
          {
            this.$confirm(`即将删除“${name}”, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.delDic({ id: row.id });
              })
              .catch(() => {});
          }
          return;
        default:
          break;
      }
    },
    lickCellDataSet({ row, column, id }) {
      const {
        remark,
        name,
        code,
        areaId,
        hierarchy = "",
        oder = "",
        instructions = "",
      } = row;
      switch (column.label) {
        case "编辑":
          {
            this.showFormDialog({
              type: "枚举值-编辑",
              initDig: {
                name,
                code,
                areaId,
                hierarchy,
                oder,
                instructions,
                remark,
              },
              row,
            });
          }
          return;
        case "删除":
          {
            this.$confirm(`即将删除“${name}”, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.delMu({ id: row.id });
              })
              .catch(() => {});
          }
          return;
        default:
          break;
      }
    },
    clickRow({ row, column, id }) {
      this.TActiveRow = row.id;
      this.activeRow_ = row;
    },
    loop(arr, newArr) {
      if (arr && arr.length) {
        arr.forEach((item) => {
          if (item.children && item.children.length) {
            item.children.forEach((item_) => {
              newArr.push({
                ...item_,
                value: item_.id,
              });
            });
          }
          newArr.push({
            ...item,
            value: item.id,
          });
        });
      }
    },
    rowDrop({ $el }) {
      const _this = this;
      Sortable.create($el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.TableData.splice(oldIndex, 1)[0];
          _this.TableData.splice(newIndex, 0, currRow);
          let idList = [];
          _this.TableData.forEach((item) => {
            idList.push(item.id);
          });
          API.ywbkSort({
            idList,
          })
            .then((res) => {
              let Res = new ResDatas({
                res,
                code: 0,
              }).state();
              _this.getMuList();
            })
            .catch((err) => {
              _this.getMuList();
            });
        },
      });
    },
    // 初始化查询值
    clearVals() {
      this.classifyVal = "";
      this.classifyList = [];
    },
    // 下拉关联
    FDhandlerSelect({ item, form, val }) {
      if ("areaId" === item.key) {
        this.getSortList(val, "dig", "");
        if (this.FDForm.length) {
          this.FDForm.forEach((item_, index) => {
            for (const key in form) {
              if (form.hasOwnProperty(key)) {
                if (item_.key === key) {
                  // TODO 添加初始化状态，根据特定的key
                  this.$set(this.FDForm[index], `defaultModel`, form[key]);
                }
              }
            }
          });
        }
      }
    },

    /* 请求 */
    // 获取 项目列表
    getProList({ init }) {
      API.getAreaList().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        let proArr = [];
        if (
          Res &&
          Res.data &&
          Res.data.children &&
          Res.data.children.children
        ) {
          this.loop(Res.data.children.children, proArr);
          if (init) {
            // this.proVal = proArr[0].value;
          }
        }
        this.proList = proArr;
      });
    },
    // 分类列表
    getSortList(areaId, type, initVal) {
      API.getClassifyDic({
        areaId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if ("dig" == type) {
          let classify_ = [];
          if (Res) {
            Res.forEach((item) => {
              item["value"] = item.id;
              item["label"] = item.name;
            });
            classify_ = Res;
          } else {
            classify_ = [];
          }
          this.$set(this.FDForm[3], `defaultModel`, initVal || "");
          this.$set(this.FDForm[3], `option`, classify_);
        } else {
          if (Res) {
            Res.forEach((item) => {
              item["value"] = item.id;
              item["label"] = item.name;
            });
            this.classifyList = Res;
          } else {
            this.classifyList = [];
          }
        }
        // TODO
      });
    },
    // 字典表列表
    getDicList() {
      this.TLoading = true;
      // this.tableData = [];
      API.getCodeSetList({
        areaId: this.proVal,
        codeSetTypeId: this.classifyVal,
        pageNum: this.TPage.index,
        pageSize: this.TPage.size,
        likeStr: this.blockVal,
      }).then((res) => {
        let Res = new ResDatas(
          {
            res,
            code: 0,
            fieldKey: {
              data: "data",
              title: "title",
              total: "totalCount",
            },
            titleKey: [],
          },
          "TLoading",
          this
        );
        if (Res.init()) {
          const { data, total, title } = Res.formatData();
          if (title && title.length) {
            title.forEach((item, i) => {
              if (item.label === "操作") {
                title.splice(i, 1);
              }
            });
          }
          if (data && data.length) {
            this.TActiveRow = data[0].id;
            this.activeRow_ = data[0];

            // if (row) {
            // //   this.TActiveRow = row.id;
            // //   this.activeRow_ = row;
            // } else {

            // }
          } else {
            this.activeRow_ = "";
          }
          this.tableTitle = title;
          this.tableData = data;
          this.$set(this.TPage, `total`, total);
        } else {
          this.activeRow_ = "";
          this.tableData = [];
          this.$set(this.TPage, `total`, 0);
        }
      });
    },
    // 枚举值列表
    getMuList() {
      if (this.activeRow_) {
        this.TableData = [];
        let req = {
          codeSetId: this.activeRow_.id,
          pageNum: this.TPage_1.index,
          pageSize: this.TPage_1.size,
        };
        this.TableDigLoading = true;
        API.getCodeSetAttrList(req)
          .then((res) => {
            let Res = new ResDatas(
              {
                res,
                code: 0,
                fieldKey: {
                  data: "data",
                  title: "title",
                  total: "totalCount",
                },
                titleKey: [],
              },
              "TableDigLoading",
              this
            );
            if (Res.init()) {
              const { data, total, title } = Res.formatData();
              if (title && title.length) {
                title.forEach((item, i) => {
                  if (item.label === "操作") {
                    title.splice(i, 1);
                  }
                });
              }
              this.TableTitle = title;
              this.TableData = data;
              this.$set(this.TPage_1, `total`, total);
            } else {
              this.TableData = [];
              this.$set(this.TPage_1, `total`, 0);
            }
          })
          .catch((error) => {
            this.TableDigLoading = false;
          });
      }
    },
    // 新增 字典表
    addDic(req) {
      API.addCodeSet(req).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getDicList();
      });
    },
    // 编辑 字典表
    updateDic(req) {
      this.FDVisible = false;
      API.updateCodeSet(req).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.getDicList();
      });
    },
    // 删除 字典表
    delDic({ id }) {
      API.deleteCodeSet({ id }).then((res) => {
        new ResDatas({ res, code: 0 }).state();
        this.getDicList();
      });
    },
    // 删除 枚举值
    delMu({ id }) {
      API.deleteCodeSetAttr({ id }).then((res) => {
        new ResDatas({ res, code: 0 }).state();
        this.getMuList();
      });
    },
    // 新增 枚举值
    addMu(req) {
      this.FDVisible = false;
      if (this.activeRow_ && this.activeRow_.id) {
        API.addCodeSetAttr({
          ...req,
          codeSetId: this.activeRow_.id,
        }).then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).state();
          this.getMuList();
        });
      }
    },
    // 编辑 枚举值
    updateMu(req) {
      this.FDVisible = false;
      API.updateCodeSetAttr(req).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.getMuList();
      });
    },
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      const { areaId, codeSetBusinessSectorId = "" } = JSON.parse(
        this.$route.query.row
      );
      this.proVal = areaId;
      this.classifyVal = codeSetBusinessSectorId;
    }
    this.getProList({ init: true });
    this.getDicList();
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.code-set {
  height: calc(100% - 54px);
  width: 100%;
  display: flex;
  flex-direction: column;
  &-top {
    width: 100%;
    // height: 44%;
    box-sizing: border-box;
    // border: 1px solid red;
    flex: 1;
    &-edit-area {
      overflow: hidden;
      &-btn {
        float: left;
        overflow: hidden;
        li {
          float: left;
          margin: 2px 15px;
        }
      }
      &-select {
        float: right;
        overflow: hidden;
        margin: 4px 55px;
        li {
          float: left;
          margin-right: 20px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    &-table {
      margin: 20px 0;
    }
  }
  .data-detail-mid {
    display: inline-block;
    height: 30px;
    width: 100%;
    box-sizing: border-box;
    // border: 1px solid red;
    text-align: center;
    cursor: pointer;
    background: $fold_bg;
    .up-dow {
      font-weight: bolder;
      font-size: 30px;
    }
  }
  &-bot {
    width: 100%;
    // height: 44%;
    box-sizing: border-box;
    // border: 1px solid red;
    flex: 1;
    .bot-data-set-edit {
      margin-left: 15px;
    }
  }
  .tabs-btn {
    text-align: center;
    margin-top: 22px;
  }
}
</style>
