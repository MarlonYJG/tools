<!--
 * @Author: Marlon
 * @Date: 2020-07-22 10:20:50
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-28 16:01:24
 * @Description: 业务板块
--> 
<template>
  <div class="business-block">
    <div class="business-block-top">
      <div class="business-block-top-edit-area">
        <ul class="business-block-top-edit-area-btn">
          <li>
            <el-button size="small" @click="showFormDialog({type:'新增业务板块'})">新增业务板块</el-button>
          </li>
        </ul>
        <ul class="business-block-top-edit-area-select">
          <li>
            <label for>项目：</label>
            <el-select v-model="proVal" clearable filterable placeholder="请选择项目" size="small">
              <el-option
                v-for="item in proList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <label for>板块名称：</label>
            <el-input placeholder="请输入板块" v-model="blockVal" size="small" style="width: 195px;">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="getTableList"
                style="cursor: pointer;"
              ></i>
            </el-input>
          </li>
        </ul>
      </div>
      <div class="business-block-top-table">
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
    <div v-show="fold" class="business-block-bot">
      <p
        style="margin: 10px 5px;font-size: 14px;"
      >业务板块“{{this.activeRow_ && this.activeRow_.name}}”的数据集分类</p>
      <ul class="bot-data-set-edit">
        <li>
          <el-button size="small" @click="showFormDialog({type:'新增数据集分类'})">新增</el-button>
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
    ></FormDialog>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import Sortable from "sortablejs";

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      activeIndex: "a",
      fold: true,
      // 查询条件
      proVal: "",
      proList: [],
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
        { label: "编码", prop: "code" },
        { label: "业务板块名称", prop: "name" },
        { label: "数据集分类个数", prop: "countStage" },
        { label: "数据集个数", prop: "countDataSet" },
        { label: "属性个数", prop: "countDataSetAttr" },
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
          link: "/dataStandardManage/editManage/dataSet",
          cells: ["countDataSet"],
        },
        {
          link: "/dataStandardManage/editManage/dataStandAttr",
          cells: ["countDataSetAttr"],
        },
      ],
      //   数据集列表
      TId: "table-data-set",
      TableData: [],
      TableTitle: [
        { label: "数据集分类名称", prop: "name" },
        { label: "数据集分类编码", prop: "code" },
        { label: "数据集个数", prop: "countDataSet" },
        { label: "属性个数", prop: "countDataSetAttr" },
        { label: "备注", prop: "remark" },
        { label: "操作", prop: "operating" },
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
          link: "/dataStandardManage/editManage/dataSet",
          cells: ["countDataSet"],
        },
        {
          link: "/dataStandardManage/editManage/dataStandAttr",
          cells: ["countDataSetAttr"],
        },
      ],
      // 获取点击值的信息
      // 弹出框
      FDVisible: false,
      FDId: "form_dialog_1",
      FDForm: [],
      FDTitle: "",
      FDFoot: {
        button: [],
      },
      FDRules: {},
      activeRow_: "",
    };
  },
  watch: {
    proVal(newVal) {
      this.getTableList();
    },
    activeRow_: {
      handler(newVal) {
        if (newVal) {
          this.getList();
        }
      },
      deep: true,
    },
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.FDVisible = editItem.close;
        this.TabsDigShow = editItem.close;
        this.TableDigVisible = editItem.close;
        this.FDForm = [];
      }
    },
    // 表格弹出框-
    showFormDialog({ type, initDig = null, row = null }) {
      switch (type) {
        case "新增业务板块":
          {
            this.FDTitle = "新增业务板块";
            this.FDRules = {
              name: [
                { required: true, message: "请输入名称", trigger: "blur" },
              ],
              code: [
                { required: true, message: "请输入编码", trigger: "blur" },
              ],
              areaId: [
                { required: true, message: "请选项目", trigger: "change" },
              ],
            };
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
                defaultModel: this.proVal || "",
                placeholder: "",
                option: this.proList,
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

            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.addSectorDialog(form);
                    }
                  });
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        case "新增数据集分类":
          {
            this.FDTitle = "新增数据集分类";
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
            if (this.activeRow_) {
              this.FDVisible = true;
            }
          }
          return;
        case "业务板块-编辑":
          {
            this.FDTitle = "编辑业务板块";
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
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.updateSector({
                        ...form,
                        id: row.id,
                        areaId: row.areaId,
                      });
                    }
                  });
                },
              },
            ]);

            if (initDig && JSON.stringify(initDig) !== "{}") {
              for (const key in initDig) {
                if (initDig.hasOwnProperty(key)) {
                  // TODO 优化
                  this.FDForm.forEach((item) => {
                    if (key === item.key) {
                      item["key"] = key;
                      item["defaultModel"] = initDig[key];
                    }
                  });
                }
              }
            }
            this.FDVisible = true;
          }
          return;
        case "数据集分类-编辑":
          {
            this.FDTitle = "编辑数据集分类";
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
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.updateDataSet({
                        ...row,
                        ...form,
                      });
                    }
                  });
                },
              },
            ]);

            if (initDig && JSON.stringify(initDig) !== "{}") {
              for (const key in initDig) {
                if (initDig.hasOwnProperty(key)) {
                  // TODO 优化
                  this.FDForm.forEach((item) => {
                    if (key === item.key) {
                      item["key"] = key;
                      item["defaultModel"] = initDig[key];
                    }
                  });
                }
              }
            }
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
      this.getTableList();
    },
    changePage_1({ pageSize, currentPage }) {
      this.$set(this.TPage_1, `index`, currentPage);
      this.$set(this.TPage_1, `size`, pageSize);
      this.getList();
    },
    lickCell({ row, column, id }) {
      this.activeRow_ = row;
      const { name, code, areaId, remark } = row;
      switch (column.label) {
        case "编辑":
          {
            this.showFormDialog({
              type: "业务板块-编辑",
              initDig: {
                name,
                code,
                areaId,
                remark,
              },
              row,
            });
          }
          return;
        case "删除":
          {
            if (row.countDataSet && row.countDataSetAttr) {
              this.$message({
                message: `业务板块“${name}”已经设置了数据集和数据标准属性，不能删除。`,
                type: "warning",
              });
              return;
            } else {
              this.$confirm(`即将删除“${name}”, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  this.delSector({ id: row.id });
                })
                .catch(() => {});
            }
          }
          return;
        default:
          break;
      }
    },
    lickCellDataSet({ row, column, id }) {
      const { remark, name, code } = row;
      switch (column.label) {
        case "编辑":
          {
            this.showFormDialog({
              type: "数据集分类-编辑",
              initDig: {
                name,
                code,
                remark,
              },
              row,
            });
          }
          return;
        case "删除":
          {
            if (row.countDataSet && row.countDataSetAttr) {
              this.$message({
                message: `数据集“${name}”已经设置了数据集和数据标准属性，不能删除。`,
                type: "warning",
              });
              return;
            } else {
              this.$confirm(`即将删除“${name}”, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  this.delDataSet({ id: row.id });
                })
                .catch(() => {});
            }
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
              _this.getList();
            })
            .catch((err) => {
              _this.getList();
            });
        },
      });
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
    // 获取业务板块列表
    getTableList() {
      this.TLoading = true;
      // this.tableData = [];
      API.searchSectorList({
        areaId: this.proVal,
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
            data.forEach((item) => {
              item["jumpName"] = "业务板块";
            });
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
    // 获取数据集分类
    getList() {
      if (this.activeRow_) {
        this.TableData = [];
        let req = {
          sectorId: this.activeRow_.id,
          pageNum: this.TPage_1.index,
          pageSize: this.TPage_1.size,
        };
        this.TableDigLoading = true;
        API.searchStageList(req)
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
              if (data && data.length) {
                data.forEach((item) => {
                  item["jumpName"] = "数据集分类";
                });
              }
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
    // 新增 业务板块
    addSectorDialog(req) {
      API.addSector(req).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getTableList();
      });
    },
    // 编辑 业务板块
    updateSector(req) {
      this.FDVisible = false;
      API.updateSector(req).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.getTableList();
      });
    },
    // 删除 业务板块
    delSector({ id }) {
      API.deleteSector({ id }).then((res) => {
        new ResDatas({ res, code: 0 }).state();
        this.getTableList();
      });
    },
    // 删除 数据集
    delDataSet({ id }) {
      API.deleteStage({ id }).then((res) => {
        new ResDatas({ res, code: 0 }).state();
        this.getList();
      });
    },
    // 新增 数据集分类
    addDataSet(req) {
      this.FDVisible = false;
      if (this.activeRow_ && this.activeRow_.id) {
        API.addStage({
          ...req,
          areaId: this.activeRow_.areaId,
          businessSectorId: this.activeRow_.id,
        }).then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).state();
          this.getList();
        });
      }
    },
    // 编辑 数据集
    updateDataSet(req) {
      this.FDVisible = false;
      API.updateStage(req).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      let { areaId } = JSON.parse(this.$route.query.row);
      this.proVal = areaId;
      this.getTableList();
    } else {
      this.getTableList();
    }
    this.getProList({ init: true });
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.business-block {
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
