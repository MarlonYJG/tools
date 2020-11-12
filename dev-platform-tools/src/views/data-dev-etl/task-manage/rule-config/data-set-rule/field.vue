<!--
 * @Author: Marlon
 * @Date: 2020-04-27 14:12:29
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-13 10:55:00
 * @Description: 字段映射
 -->

<template>
  <div class="etl-field-list">
    <div class="etl-field-list-edit-area">
      <ul class="etl-field-list-edit-area-btn">
        <li>
          <el-button size="small" @click="showSoltDig({type:'新增字段'})">新增字段</el-button>
        </li>
      </ul>
    </div>
    <div class="etl-field-list-table">
      <TableDefault
        :TId="TId"
        :TCurrentTid="TId"
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
        @cellTypeChange="cellTypeChange"
        @columnContentType="columnContentType"
      ></TableDefault>
    </div>
    <!-- 弹出框 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      @editBtnCb="editBtnCb"
    >
      <TableDefault
        slot="soltDigContent"
        :TId="SoldTId"
        :THeight="450"
        :TMaxHeight="450"
        :TIsShowIndex="TIsShowIndex"
        :TIsShowCheckBox="true"
        :TCurrentTid="SoldTId"
        :TLoading="SoldTLoading"
        :TTitle="SoldtableTitle"
        :TData="SoldtableData"
        :TIsShowPage="false"
        :TTotal="SoldTPage.total"
        :TCurrentPage="SoldTPage.index"
        :TPageSize="SoldTPage.size"
        :TEdit="SoldTEdit"
        :TAlign="SoldTAlign"
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
        @changePage="changePage"
        @cellTypeChange="cellTypeChange"
        @handleSelectionChange="handleSelectionChange"
        @columnContentType="columnContentType"
      ></TableDefault>
    </SoltDialog>
    <!-- 动态规则 -->
    <RulesPreview
      :DigRVisible="DigRVisible"
      :DigRId="DigRId"
      :DigRTitle="DigRTitle"
      DigRWidth="600"
      :DigRForm="DigRForm"
      :DigRFoot="DigRFoot"
      :DigRcurrenKey="DigRcurrenKey"
      :DigRSearch="DigRSearch"
      :params="taskVal"
      @editBtnCb="editBtnCb"
      @getTreeItemDom="getTreeItemDom"
    ></RulesPreview>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { isPositiveInt, checkip } from "utils";
import SoltDialog from "@/components/dialog/solt-dialog";
import RulesPreview from "@/business-components/etl-rules-preview/index";

export default {
  mixins: [mixin],
  components: {
    SoltDialog,
    RulesPreview
  },
  props: {
    Item: {
      type: [String, Object],
      default: function() {
        return "";
      }
    },
    taskVal: {
      type: [String, Number],
      default: function() {
        return "";
      }
    }
  },
  data() {
    return {
      // 表格
      TLoading: false,
      TId: "table_field",
      TEdit: {
        show: true,
        title: "操作",
        width: 180,
        fixed: "right",
        editTypes: [
          {
            label: "添加清洗规则",
            css: "warring"
          },
          {
            label: "删除",
            css: "danger"
          }
        ]
      },
      TAlign: [
        {
          key: "left",
          item: ["datasourceName", "remark"]
        }
      ],
      tableTitle: [
        { prop: "targetColumnCode", label: "目标字段" },
        { prop: "targetColumnName", label: "目标字段中文名" },
        { prop: "sourceColumnCode", label: "源字段", randerOption: [] },
        { prop: "ruleDescription", label: "规则描述" }
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10
      },
      sourceType: [],
      sourceField: [],
      // 弹出框-插槽
      SoldTId: "soldId",
      SoldTLoading: false,
      SoltDigShow: false,
      SoltDigTitle: "新增字段",
      TIsShowIndex: {
        show: true
        // fixed:'left'
      },
      soltDFootBtn: [
        {
          label: "确定",
          css: "primary",
          cb: ({ Item }) => {
            this.add();
          }
        }
      ],
      SoldtableTitle: [
        {
          label: "目标字段",
          prop: "target_columnName_columnComment"
        },
        {
          label: "源字段",
          prop: "source_columnName_columnComment"
        }
      ],
      SoldtableData: [],
      SoldTPage: {
        total: 0,
        index: 1,
        size: 10
      },
      SoldTEdit: {
        show: true,
        title: "操作",
        width: 80,
        // fixed: "right",
        editTypes: [
          {
            label: "清空",
            css: "danger"
          }
        ]
      },
      SoldTAlign: [
        {
          key: "left",
          item: ["datasourceName", "remark"]
        }
      ],
      SoldCheckBox: [],
      // 弹出框-动态规则
      DigRVisible: false,
      DigRId: "dig_rules_1",
      DigRTitle: "",
      DigRTree: [],
      DigRFormInit: {},
      DigRFoot: [],
      DigRcurrenKey: {
        // 当前激活的值
        parentIds: [],
        expandedKey: "3",
        currentKey: ""
      },
      DigRForm: [],
      DigRSearch: {}
    };
  },
  watch: {
    Item: {
      handler(newVal, oldVal) {
        this.SoldtableData = [];
        if (newVal && newVal.id) {
          this.getList();
        } else {
          this.tableData = [];
          this.$set(this.TPage, `total`, 0);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
        this.del(row);
      } else if (text === "close") {
        this.SoltDigShow = editItem.close;
        this.DigRVisible = editItem.close;
        this.DigRTitle = "";
        this.DigRForm = [];
        this.DigRFoot = [];
        this.DigRcurrenKey = {
          expandedKey: "",
          currentKey: "",
          parentIds: []
        };
        this.DigRFormInit = {};
        this.DigRSearch = {};
      }
    },
    // 显示弹出框并修改配置
    showSoltDig({ type, initDig = null }) {
      switch (type) {
        case "新增字段":
          {
            this.ruleConfigFieldAddList(this.Item);
            this.SoltDigShow = true;
          }
          return;
        default:
          return;
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    lickCell({ row, column, id }) {
      switch (column.label) {
        case "添加清洗规则":
          {
            this.clearRule(row);
          }
          return;
        case "清空":
          {
            this.SoldtableData.forEach((item, index) => {
              if (
                row.source_columnName === item.source_columnName &&
                row.target_columnName === item.target_columnName
              ) {
                this.SoldtableData.splice(index, 1);
              }
            });
            if (this.SoldCheckBox.length) {
              this.SoldCheckBox.forEach((item, index) => {
                if (
                  row.source_columnName === item.source_columnName &&
                  row.target_columnName === item.target_columnName
                ) {
                  this.SoldCheckBox.splice(index, 1);
                }
              });
            }
          }
          return;
        default:
          break;
      }
    },
    // 自定义列类型 值变化时的 回调
    cellTypeChange({ column, row }) {
      // console.log(this.tableData, column, row);
      if (column.prop === "sourceColumnCode") {
        this.update(row);
      }
    },
    // 自定义列类型 自定义关联逻辑
    columnContentType(propType, { scope, type, item, column }, cb) {
      if (this.TId === "table_field") {
        switch (propType) {
          case "propsType": // 显示自定义类型列
            {
              if (column.prop === "sourceColumnCode") {
                cb(true);
              }
            }
            return;
          case "propItemType": // 渲染相对应的列的内容类型
            {
              if (column.prop === "sourceColumnCode") {
                if (type === "select") {
                  return cb(true);
                }
                return cb(false);
              }
            }
            return;
          default:
            return;
        }
      }
    },
    // 多选
    handleSelectionChange(type, selectionArr) {
      if (type === "checkbox") {
        this.SoldCheckBox = selectionArr;
      }
    },
    // 清洗规则转换
    clearRule(row) {
      this.DigRVisible = true;
      this.DigRTitle = "清洗规则";
      this.DigRFormInit = {
        DigRFormInit: {
          checkTable: {
            id: this.Item.id,
            code: this.Item.targetTableCode,
            name: this.Item.targetTableName
          },
          checkField: {
            id: row.id,
            code: row.targetColumnCode,
            name: row.targetColumnName
          }
        }
      };
      this.DigRSearch = {
        areaId: this.taskVal,
        businessSectorId: "",
        dataClassifyId: "",
        dataSetId: ""
      };
      this.DigRFoot = [
        {
          type: "ok",
          label: "确定",
          cb: (form, domForm, activeTree) => {
            // 构建非JSON参数
            let reqParams = {};
            console.log(form);
            // 解析数据并构建请求字典(JSON)
            let options = {};
            if (Object.keys(form).length) {
              for (const key in form) {
                if (form.hasOwnProperty(key)) {
                  if (key.indexOf("_option") >= 0) {
                    if (key.split("_option")[0]) {
                      options[key.split("_option")[0]] = form[key];
                      delete form[key];
                    }
                  }
                }
              }
            }
            if (Object.keys(options).length) {
              for (const key in options) {
                if (options.hasOwnProperty(key)) {
                  for (const k in form) {
                    if (form.hasOwnProperty(k)) {
                      if (key === k) {
                        if (k === "checkTable") {
                          // 数据集 根据Id构建
                          options[key].forEach(item => {
                            if (item.id === form[k]) {
                              form[k] = {
                                id: item.id,
                                code: item.code,
                                name: item.name
                              };
                              reqParams["areaId"] = item.areaId;
                              reqParams["businessSectorId"] =
                                item.businessSectorId;
                              reqParams["businessStageId"] =
                                item.businessStageId;
                              reqParams["dataSetId"] = item.id;
                            }
                          });
                        } else {
                          let arr_ = [];
                          if (form[k]) {
                            domForm.forEach(domProp => {
                              if (domProp.prop == k) {
                                // 判断每个值所对应的的类型
                                if (domProp.displayMode == 4) {
                                  // 多选(一个值、多个值)
                                  if (form[k].toString().indexOf(",") !== -1) {
                                    // 多选
                                    let fieldsArr = form[k]
                                      .toString()
                                      .split(",");
                                    options[key].forEach(item => {
                                      fieldsArr.forEach(ele => {
                                        if (item.code === ele) {
                                          arr_.push({
                                            id: item.id,
                                            code: item.code,
                                            name: item.name
                                          });
                                        }
                                      });
                                    });
                                    form[k] = arr_;
                                  } else {
                                    options[key].forEach(item => {
                                      if (item.code === form[k]) {
                                        arr_.push({
                                          id: item.id,
                                          code: item.code,
                                          name: item.name
                                        });
                                      }
                                    });
                                    form[k] = arr_;
                                  }
                                } else {
                                  // 下拉处理(处理为code+name)
                                  options[key].forEach(item => {
                                    if (form[k] === item.id) {
                                      form[k] = {
                                        id: item.id,
                                        code: item.code,
                                        name: item.name
                                      };
                                    }
                                  });
                                }
                              }
                            });
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            for (const key in form) {
              if (form.hasOwnProperty(key)) {
                if (key === "undefined") {
                  delete form[key];
                }
              }
            }
            // 树节点解析
            let rulesParentId = "";
            let rulesId = activeTree.id;
            let ruleImpI = "";
            let ruleLogicType = "";
            if (activeTree.info.parentIds.length) {
              rulesParentId = activeTree.info.parentIds.join(",");
              ruleImpI = activeTree.info.impInterface;
              ruleLogicType = activeTree.info.ruleLogicType;
            }

            console.log(form, domForm);
            // 初始化字段
            for (const key in form) {
              if (form.hasOwnProperty(key)) {
                let flag_ = false;
                domForm.forEach(item => {
                  if (key === item.prop) {
                    flag_ = true;
                  }
                });
                if (!flag_) {
                  console.log(key, "==========");
                  delete form[key];
                }
              }
            }
            // 单选、多选、结构转换
            let radio_ = {};
            let arr_ = [];
            domForm.forEach(item => {
              // 单选
              if (item.displayMode === 1) {
                for (const key in form) {
                  if (form.hasOwnProperty(key)) {
                    if (item.prop === key) {
                      for (const k in item.paraRange) {
                        if (item.paraRange.hasOwnProperty(k)) {
                          if (k === form[key]) {
                            radio_[item.prop] = {
                              code: k,
                              name: item.paraRange[k]
                            };
                          }
                        }
                      }
                    }
                  }
                }
              }
              // 多选+url
              if (item.displayMode === 2) {
                for (const key in form) {
                  if (form.hasOwnProperty(key)) {
                    if (item.prop === key) {
                      for (const k in item.paraRange) {
                        if (item.paraRange.hasOwnProperty(k)) {
                          if (form[key] && form[key].length) {
                            form[key].forEach(ele => {
                              if (k === ele) {
                                arr_.push({
                                  code: ele,
                                  name: item.paraRange[k]
                                });
                              }
                            });
                          }
                          radio_[item.prop] = arr_;
                        }
                      }
                    }
                  }
                }
              }
              // 下拉
              if (item.displayMode === 6 && item.paraType === 2) {
                for (const key in form) {
                  if (form.hasOwnProperty(key)) {
                    if (item.prop === key) {
                      item.paraRange.forEach(k => {
                        if (form[key] === k.value) {
                          radio_[item.prop] = {
                            code: k.value,
                            name: k.label
                          };
                        }
                      });
                    }
                  }
                }
              }
            });
            form = Object.assign({}, form, {
              ...radio_
            });
            console.log(form, "表单数据");
            // 从form表单中抽取的请求字段
            let fromForm = {};
            if (form && Object.keys(form).length) {
              for (const key in form) {
                if (form.hasOwnProperty(key)) {
                  if (key === "code") {
                    fromForm["ruleCode"] = form[key];
                  }
                  if (key === "name") {
                    fromForm["ruleName"] = form[key];
                  }
                  if (key === "checkTable") {
                    if (form[key]) {
                      fromForm["tableMappingId"] = form[key].id;
                    } else {
                      fromForm["tableMappingId"] = "";
                    }
                  }
                  // 是否取字段
                  if (ruleLogicType) {
                    if (
                      Number(ruleLogicType) === 3 ||
                      Number(ruleLogicType) === 7
                    ) {
                      if (key === "checkField") {
                        if (form[key]) {
                          fromForm["columnMappingId"] = form[key].id;
                        } else {
                          fromForm["columnMappingId"] = "";
                        }
                      }
                    }
                  }
                }
              }
            }
            console.log(fromForm);
            // 请求参数
            let req = Object.assign(
              {},
              // reqParams,
              // { rulesContent: JSON.stringify(form) },
              // { rulesId: rulesId, rulesParentId: rulesParentId },
              // { id: row.id },
              {
                rulesContent: JSON.stringify(form)
              },
              fromForm,
              {
                ruleId: rulesId,
                ruleImpl: ruleImpI,
                ruleLogicType,
                rulePanrentIds: rulesParentId
              },
              {
                taskId: this.taskVal
              }
            );
            console.log(req, "请求");
            this.addCleanRule(req);
          }
        }
      ];
    },

    /* 请求 */
    // 获取对应节点的规则——DOM结构
    getTreeItemDom({ ruleId, setValRes = false }) {
      API._publicTreeItemDom({ ruleId })
        .then(res => {
          let Res = new ResDatas({
            code: 0,
            res
          }).init();
          if (Res) {
            if (Object.keys(this.DigRFormInit).length) {
              // 编辑
              console.log(this.DigRFormInit, "初始化", this.DigRForm, Res);
              Res.forEach(item => {
                // 默认值的格式初始化
                if (item.displayMode === 2) {
                  if (item.paraType === 2) {
                    if (item.paraRange) {
                      item.paraRange = JSON.parse(item.paraRange);
                    }
                  }
                  if (item.value) {
                    if (!Array.isArray(item.value)) {
                      item["value"] = item.value.split(",");
                    }
                  } else {
                    item["value"] = [];
                  }
                } else if (item.displayMode === 6) {
                  if (item.paraType === 2) {
                    let arr = [];
                    try {
                      item.paraRange = JSON.parse(item.paraRange);
                      for (const key in item.paraRange) {
                        if (item.paraRange.hasOwnProperty(key)) {
                          arr.push({
                            label: item.paraRange[key],
                            value: key
                          });
                        }
                      }
                      item.paraRange = arr;
                    } catch (error) {
                      console.error(error);
                    }
                  }
                } else if (item.displayMode === 1) {
                  // 单选
                  if (item.paraType === 2) {
                    if (item.paraRange) {
                      item.paraRange = JSON.parse(item.paraRange);
                    }
                  }
                }

                // 匹配
                let initObj = this.DigRFormInit.DigRFormInit;
                for (const key in initObj) {
                  if (initObj.hasOwnProperty(key)) {
                    if (item.prop === key) {
                      if (item.displayMode === 6) {
                        if (item.paraType === 4) {
                          // 下拉+url
                          item.value = initObj[key] ? initObj[key].id : "";
                        } else if (item.paraType === 2) {
                          item.value = initObj[key] ? initObj[key].code : "";
                        }
                      } else if (
                        item.displayMode === 4 &&
                        item.paraType === 4
                      ) {
                        // 文本域+url
                        let arr_ = [];
                        if (initObj[key]) {
                          initObj[key].forEach(ele => {
                            arr_.push(ele.code);
                          });
                          item.value = arr_.join(",");
                        }
                      } else if (item.displayMode === 1) {
                        // 单选
                        item.value = initObj[key].code;
                      } else if (item.displayMode === 2) {
                        // 多选
                        let obj_ = [];
                        initObj[key].forEach(ele => {
                          obj_.push(ele.code);
                        });
                        item.value = obj_;
                      } else {
                        if (!setValRes) {
                          // 如果进行了节点树的点击操作，则初始值设置为后端返回的值
                          item.value = initObj[key];
                        }
                      }
                    }
                  }
                }
              });
              this.DigRForm = Res;
            }
          } else {
            this.DigRForm = [];
          }
        })
        .catch(error => {
          this.DigRForm = [];
          console.error(error);
        });
    },
    // 获取目标字段列表
    ruleConfigFieldAddList({ id }) {
      if (id) {
        this.SoldTLoading = true;
        API.ruleConfigFieldAddList({ tableMappingId: id }).then(res => {
          let Res = new ResDatas(
            {
              res,
              code: 0
            },
            "SoldTLoading",
            this
          ).init();
          this.SoldtableData = Res;
        });
      }
    },
    // 源类型
    ruleConfigSourceTypeList() {
      this.sourceType = [];
      API.ruleConfigSourceTypeList().then(res => {
        let Res = new ResDatas({
          code: 0,
          res
        }).init();
        if (Res && Res.length) {
          Res.forEach(item => {
            this.sourceType.push({
              label: item.name,
              value: Number(item.id)
            });
          });
        }
      });
    },
    // 源字段
    ruleConfigSourceFieldList() {
      this.sourceField = [];
      API.ruleConfigSourceFieldList({
        tableMappingId: this.Item.id
      }).then(res => {
        let Res = new ResDatas({
          code: 0,
          res
        }).init();
        if (Res && Res.length) {
          Res.forEach(item => {
            this.sourceField.push({
              label: item.source_columnName_columnComment,
              value: item.source_columnName
            });
          });
        }
      });
    },
    // 获取
    async getList() {
      // await this.ruleConfigSourceTypeList();
      await this.ruleConfigSourceFieldList();
      this.TLoading = true;
      await API.ruleConfigFieldList({
        pageNum: this.TPage.index,
        pageSize: this.TPage.size,
        tableMappingId: this.Item.id
      }).then(res => {
        let Res = new ResDatas(
          {
            res,
            code: 0,
            fieldKey: {
              data: "data",
              title: "title",
              total: "total",
              pageSize: "size"
            },
            titleKey: []
          },
          "TLoading",
          this
        );
        if (Res.init()) {
          const { data, total, title, pageSize } = Res.formatData();
          title.forEach(item => {
            if ("sourceColumnCode" === item.prop) {
              item["randerOption"] = this.sourceField;
            }
          });
          this.tableTitle = title;
          this.tableData = data;
          this.$set(this.TPage, `total`, total);
        } else {
          this.tableData = [];
          this.$set(this.TPage, `total`, 0);
        }
      });
    },
    // 新增
    add() {
      let etlColumnMappings = [];
      if (this.SoldCheckBox.length && this.Item.id) {
        this.SoldCheckBox.forEach(item => {
          etlColumnMappings.push({
            tableMappingId: this.Item.id,
            sourceColumnCode: item.source_columnName,
            sourceColumnName: item.source_columnComment,
            targetColumnCode: item.target_columnName,
            targetColumnName: item.target_columnComment
          });
        });
      }
      API.ruleConfigFieldAdd({
        etlColumnMappings
      })
        .then(res => {
          new ResDatas({ res, code: 0 }).state();
          this.SoltDigShow = false;
          this.getList();
        })
        .catch(error => {
          this.SoltDigShow = false;
        });
    },
    // 修改
    update(req) {
      const { id, sourceColumnCode } = req;
      let sourceColumnName = "";
      this.sourceField.forEach(item => {
        if (sourceColumnCode === item.value) {
          sourceColumnName = item.label;
        }
      });
      API.ruleConfigFieldUpdate({
        id,
        sourceColumnCode,
        sourceColumnName
      }).then(res => {
        new ResDatas({ res, code: 0 }).state();
        this.getList();
      });
    },
    del({ id }) {
      API.ruleConfigFieldDel({ id }).then(res => {
        new ResDatas({ res, code: 0 }).state();
        this.getList();
      });
    },
    // 添加清洗规则
    addCleanRule(req) {
      API.ruleConfigCleanRulesAdd(req)
        .then(res => {
          new ResDatas({
            res,
            code: 0
          }).state();
          this.DigRVisible = false;
          this.getList();
        })
        .catch(error => {
          this.DigRVisible = false;
          console.error(error);
        });
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.etl-field-list {
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
</style>