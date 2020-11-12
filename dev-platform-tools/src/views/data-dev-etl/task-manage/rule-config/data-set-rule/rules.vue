<!--
 * @Author: Marlon
 * @Date: 2020-04-27 14:12:45
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-13 10:54:39
 * @Description: 清洗规则
 -->

<template>
  <div class="etl-rules-list">
    <div class="etl-rules-list-edit-area">
      <ul class="etl-rules-list-edit-area-btn">
        <li>
          <el-button size="small" @click="showDialog({type:'新增'})">新增</el-button>
        </li>
      </ul>
      <ul class="etl-rules-list-edit-area-select">
        <li>
          <label for>类型：</label>
          <el-select v-model="ruleType" filterable placeholder="请选择" size="small" @change="getList">
            <el-option
              v-for="item in ruleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <!-- <li>
          <el-button type="primary" size="small" @click="getList">搜索</el-button>
        </li>-->
      </ul>
    </div>
    <div class="etl-rules-list-table">
      <TableDefault
        :TId="TId"
        :TCurrentTid="TId"
        :TRowDrop="true"
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TIsShowPage="false"
        :TTotal="TPage.total"
        :TCurrentPage="TPage.index"
        :TPageSize="TPage.size"
        :TEdit="TEdit"
        :TAlign="TAlign"
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
        @rowDrop="rowDrop"
      ></TableDefault>
    </div>
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
      @editBtnCb="editBtnCb"
      :params="taskVal"
      :DigRow="DigRow"
      @getTreeItemDom="getTreeItemDom"
    ></RulesPreview>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { isPositiveInt, checkip } from "utils";

import RulesPreview from "@/business-components/etl-rules-preview/index";

export default {
  mixins: [mixin],
  props: {
    Item: {
      type: [String, Object],
      default: function () {
        return "";
      },
    },
    taskVal: {
      type: [String, Number],
      default: function () {
        return "";
      },
    },
  },
  components: {
    Sortable,
    RulesPreview,
  },
  data() {
    return {
      // 查询条件
      ruleType: "",
      ruleList: [],
      // 编辑-表格配置
      TId: "rules_table",
      TLoading: false,
      TEdit: {
        show: true,
        title: "操作",
        width: 180,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "删除",
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
        { prop: "ruleCode", label: "规则编码" },
        { prop: "ruleName", label: "规则名称" },
        { prop: "rulesContent", label: "规则内容" },
        { prop: "ruleLogicTypeName", label: "规则类型" },
        { prop: "tableMappingName", label: "对应表" },
        { prop: "columnMappingName", label: "对应字段" },
        { prop: "creator", label: "创建人" },
        { prop: "createTime", label: "创建时间" },
      ],
      tableData: [],
      TPage: {
        total: 100,
        index: 1,
        size: 10,
      },
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
        currentKey: "",
      },
      DigRForm: [],
      DigRSearch: {},
      // 获取点击值的信息
      tableActive_: "",
      DigRow: {},
    };
  },
  watch: {
    Item: {
      handler(newVal) {
        if (newVal && newVal.id) {
          this.getType();
          this.getList();
        } else {
          this.tableData = [];
        }
      },
      immediate: true,
      deep: true,
    },
    ruleType: function (newVal) {
      if (newVal) {
        this.getList();
      }
    },
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
        this.del(row);
      } else if (text === "close") {
        this.DigRVisible = editItem.close;
        this.DigRTitle = "";
        this.DigRForm = [];
        this.DigRFoot = [];
        this.DigRcurrenKey = {
          expandedKey: "",
          currentKey: "",
          parentIds: [],
        };
        this.DigRFormInit = {};
        this.DigRSearch = {};
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null, row = null }) {
      switch (type) {
        case "新增":
          {
            this.DigRow = {};
            this.DigRVisible = true;
            this.DigRTitle = "清洗规则";
            this.DigRFormInit = {
              DigRFormInit: {
                checkTable: {
                  id: this.Item.id,
                  code: this.Item.targetTableCode,
                  name: this.Item.targetTableName,
                },
              },
              // row
            };
            //  let rulesParentIdArr = row.rulesParentId.split(",");
            //  this.DigRcurrenKey = {
            //   parentIds: rulesParentIdArr,
            //   expandedKey: rulesParentIdArr[rulesParentIdArr.length - 2],
            //   currentKey: rulesParentIdArr[rulesParentIdArr.length - 1]
            // };
            this.DigRSearch = {
              areaId: this.taskVal,
              businessSectorId: "", //row.businessSectorId,
              dataClassifyId: "", //row.businessStageId,
              dataSetId: "", //row.dataSetId
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
                                options[key].forEach((item) => {
                                  if (item.id === form[k]) {
                                    form[k] = {
                                      id: item.id,
                                      code: item.code,
                                      name: item.name,
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
                                // 字段多选处理
                                let arr_ = [];
                                if (form[k]) {
                                  domForm.forEach((domProp) => {
                                    if (domProp.prop == k) {
                                      // 判断每个值所对应的的类型
                                      if (domProp.displayMode == 4) {
                                        // 多选(一个值、多个值)
                                        if (
                                          form[k].toString().indexOf(",") !== -1
                                        ) {
                                          // 多选
                                          let fieldsArr = form[k]
                                            .toString()
                                            .split(",");
                                          options[key].forEach((item) => {
                                            fieldsArr.forEach((ele) => {
                                              if (item.code === ele) {
                                                arr_.push({
                                                  id: item.id,
                                                  code: item.code,
                                                  name: item.name,
                                                });
                                              }
                                            });
                                          });
                                          form[k] = arr_;
                                        } else {
                                          options[key].forEach((item) => {
                                            if (item.code === form[k]) {
                                              arr_.push({
                                                id: item.id,
                                                code: item.code,
                                                name: item.name,
                                              });
                                            }
                                          });
                                          form[k] = arr_;
                                        }
                                      } else {
                                        // 下拉处理(处理为code+name)
                                        options[key].forEach((item) => {
                                          if (form[k] === item.id) {
                                            form[k] = {
                                              id: item.id,
                                              code: item.code,
                                              name: item.name,
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
                      domForm.forEach((item) => {
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
                  domForm.forEach((item) => {
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
                                    name: item.paraRange[k],
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
                                  form[key].forEach((ele) => {
                                    if (k === ele) {
                                      arr_.push({
                                        code: ele,
                                        name: item.paraRange[k],
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
                            item.paraRange.forEach((k) => {
                              if (form[key] === k.value) {
                                radio_[item.prop] = {
                                  code: k.value,
                                  name: k.label,
                                };
                              }
                            });
                          }
                        }
                      }
                    }
                  });
                  form = Object.assign({}, form, {
                    ...radio_,
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
                      rulesContent: JSON.stringify(form),
                    },
                    fromForm,
                    {
                      ruleId: rulesId,
                      ruleImpl: ruleImpI,
                      ruleLogicType,
                      rulePanrentIds: rulesParentId,
                    },
                    {
                      taskId: this.taskVal,
                    }
                  );
                  console.log(req, "请求");
                  this.add(req);
                },
              },
            ];
          }
          return;
        case "编辑":
          {
            this.DigRow = row;
            this.DigRVisible = true;
            this.DigRTitle = "编辑规则";
            console.log(row, "行信息");
            /* 
                      DigRFormInit: {
                checkTable: {
                  id: this.Item.id,
                  code: this.Item.targetTableCode,
                  name: this.Item.targetTableName
                }
              }
            */
            console.log(JSON.parse(row.rulesContent), "~~~~~~~~");
            this.DigRFormInit = {
              DigRFormInit: JSON.parse(row.rulesContent),
              row,
            };
            let rulesParentIdArr = row.rulePanrentIds.split(",");
            this.DigRcurrenKey = {
              parentIds: rulesParentIdArr,
              expandedKey: rulesParentIdArr[rulesParentIdArr.length - 2],
              currentKey: rulesParentIdArr[rulesParentIdArr.length - 1],
            };
            this.DigRSearch = {
              areaId: row.taskId,
              businessSectorId: "",
              dataClassifyId: "",
              dataSetId: "",
            };
            this.DigRFoot = [
              {
                type: "ok",
                label: "确定",
                cb: (form, domForm, activeTree) => {
                  console.log(activeTree, "点击树");
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
                                options[key].forEach((item) => {
                                  if (item.id === form[k]) {
                                    form[k] = {
                                      id: item.id,
                                      code: item.code,
                                      name: item.name,
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
                                  domForm.forEach((domProp) => {
                                    if (domProp.prop == k) {
                                      // 判断每个值所对应的的类型
                                      if (domProp.displayMode == 4) {
                                        // 多选(一个值、多个值)
                                        if (
                                          form[k].toString().indexOf(",") !== -1
                                        ) {
                                          // 多选
                                          let fieldsArr = form[k]
                                            .toString()
                                            .split(",");
                                          options[key].forEach((item) => {
                                            fieldsArr.forEach((ele) => {
                                              if (item.code === ele) {
                                                arr_.push({
                                                  id: item.id,
                                                  code: item.code,
                                                  name: item.name,
                                                });
                                              }
                                            });
                                          });
                                          form[k] = arr_;
                                        } else {
                                          options[key].forEach((item) => {
                                            if (item.code === form[k]) {
                                              arr_.push({
                                                id: item.id,
                                                code: item.code,
                                                name: item.name,
                                              });
                                            }
                                          });
                                          form[k] = arr_;
                                        }
                                      } else {
                                        // 下拉处理(处理为code+name)
                                        options[key].forEach((item) => {
                                          if (form[k] === item.id) {
                                            form[k] = {
                                              id: item.id,
                                              code: item.code,
                                              name: item.name,
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
                      domForm.forEach((item) => {
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
                  domForm.forEach((item) => {
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
                                    name: item.paraRange[k],
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
                                  form[key].forEach((ele) => {
                                    if (k === ele) {
                                      arr_.push({
                                        code: ele,
                                        name: item.paraRange[k],
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
                            item.paraRange.forEach((k) => {
                              if (form[key] === k.value) {
                                radio_[item.prop] = {
                                  code: k.value,
                                  name: k.label,
                                };
                              }
                            });
                          }
                        }
                      }
                    }
                  });
                  form = Object.assign({}, form, {
                    ...radio_,
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
                  // 请求参数
                  let req = Object.assign(
                    {},
                    {
                      rulesContent: JSON.stringify(form),
                    },
                    fromForm,
                    {
                      ruleId: rulesId,
                      ruleImpl: ruleImpI,
                      ruleLogicType,
                      rulePanrentIds: rulesParentId,
                    },
                    {
                      taskId: this.taskVal,
                    }
                  );
                  console.log(req, "请求");
                  this.update(req);
                },
              },
            ];
          }
          return;
        default:
          return;
      }
    },
    lickCell({ row, column, id }) {
      this.tableActive_ = row;
      switch (column.label) {
        case "编辑":
          {
            this.showDialog({
              type: column.label,
              row,
            });
          }
          return;

        default:
          break;
      }
    },
    // 行拖拽
    rowDrop({ $el }) {
      const _this = this;
      Sortable.create($el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
          let etlRuleMappings = [];
          _this.tableData.forEach((item) => {
            etlRuleMappings.push({
              id: item.id,
            });
          });
          _this.order({ etlRuleMappings });
        },
      });
    },

    /* 请求 */
    // 获取对应节点的规则——DOM结构
    getTreeItemDom({ ruleId, setValRes = false }) {
      API._publicTreeItemDom({ ruleId })
        .then((res) => {
          let Res = new ResDatas({
            code: 0,
            res,
          }).init();
          if (Res) {
            if (this.DigRFormInit.row) {
              // 编辑
              console.log(this.DigRFormInit, "初始化", this.DigRForm, Res);
              Res.forEach((item) => {
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
                            value: key,
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
                          initObj[key].forEach((ele) => {
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
                        initObj[key].forEach((ele) => {
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
              console.log(Res, "准备渲染");
              this.DigRForm = Res;
            } else {
              // 新增
              Res.forEach((item) => {
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
                            value: key,
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
                // 设置数据集
                let initObj = this.DigRFormInit.DigRFormInit.checkTable;
                if (item.prop == "checkTable") {
                  item["value"] = initObj.id;
                }
              });
              console.log("新增", this.DigRForm, Res);
              this.DigRForm = Res;
            }
          } else {
            this.DigRForm = [];
          }
        })
        .catch((error) => {
          this.DigRForm = [];
          console.error(error);
        });
    },
    // 类型
    getType() {
      this.ruleList = [];
      API._publicRuleType().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res && Res.length) {
          Res.forEach((item) => {
            this.ruleList.push({
              label: item.name,
              value: item.id,
            });
          });
          if (this.ruleList.length) {
            // this.ruleType = this.ruleList[0].value;
          }
        }
      });
    },
    // 获取
    getList() {
      this.TLoading = true;
      API.ruleConfigCleanRulesList({
        ruleLogicType: this.ruleType,
        tableMappingId: this.Item.id,
      }).then((res) => {
        let Res = new ResDatas(
          {
            res,
            code: 0,
          },
          "TLoading",
          this
        ).init();
        if (Res) {
          this.tableTitle = Res.title;
          this.tableData = Res.data;
        } else {
          this.tableData = [];
        }
      });
    },
    // 新增
    add(req) {
      API.ruleConfigCleanRulesAdd(req).then((res) => {
        new ResDatas({ res, code: 0 }).state();
        this.DigRVisible = false;
        this.getList();
      });
    },
    // 修改
    update(req) {
      API.ruleConfigCleanRulesUpdate({
        ...req,
        id: this.tableActive_.id,
      }).then((res) => {
        new ResDatas({ res, code: 0 }).state();
        this.DigRVisible = false;
        this.getList();
      });
    },
    // 删除
    del({ id }) {
      API.ruleConfigCleanRulesDel({ id }).then((res) => {
        new ResDatas({ res, code: 0 }).state();
        this.getList();
      });
    },
    // 拖拽保存
    order(req) {
      API.ruleConfigCleanRulesOrder(req).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.tableData = [];
        this.getList();
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.etl-rules-list {
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