<!--
 * @Author: Marlon
 * @Date: 2020-07-24 13:59:27
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-07 09:21:22
 * @Description: 字段规则
--> 
<template>
  <div class="field-rules">
    <div class="field-rules-top">
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
        @clickRow="clickRow"
        @changePage="changePage"
      ></TableDefault>
    </div>
    <span class="field-rules-mid" @click="fold = !fold">
      <i v-if="fold" class="el-icon-arrow-down up-dow"></i>
      <i v-else class="el-icon-arrow-up up-dow"></i>
    </span>
    <div v-show="fold" class="field-rules-bot">
      <p
        style="margin: 10px 5px;font-size: 14px;"
      >字段“{{this.activeRow_ && this.activeRow_.name}}”的清洗规则</p>
      <ul class="bot-data-set-edit">
        <li>
          <el-button size="small" @click="addRules">新增</el-button>
        </li>
      </ul>
      <div>
        <TableDefault
          :TId="TId"
          :TCurrentTid="TId"
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
          @changePage="changePage_1"
        ></TableDefault>
      </div>
    </div>
    <!-- 动态添加规则 -->
    <rulesPreview
      :DigRVisible="DigRVisible"
      :DigRId="DigRId"
      :DigRTitle="DigRTitle"
      DigRWidth="800"
      :DigRForm="DigRForm"
      :DigRFoot="DigRFoot"
      :DigRcurrenKey="DigRcurrenKey"
      :DigRSearch="objItem"
      @editBtnCb="editBtnCb"
      @getTreeItemDom="getTreeItemDom"
    ></rulesPreview>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { isPositiveInt, checkip } from "utils";
import { openUrl, cellJump } from "utils/jump";
import Sortable from "sortablejs";
import rulesPreview from "@/business-components/rules-preview";

export default {
  mixins: [mixin],
  components: {
    rulesPreview
  },
  props: {
    activeIndex: {
      type: String,
      default: ""
    },
    areaId: {
      type: [String, Number],
      default: () => {
        return "";
      }
    },
    businessSectorId: {
      type: [String, Number],
      default: () => {
        return "";
      }
    },
    businessStageId: {
      type: [String, Number],
      default: () => {
        return "";
      }
    },
    dataSetId: {
      type: [String, Number],
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      fold: true,
      activeRow_: "",
      // 字段 表格
      TId_y: "bussiness",
      TLoading: false,
      TActiveRow: 0,
      TEdit: {
        show: false,
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "text"
          },
          {
            label: "删除",
            css: "text",
            pass: true
          }
        ]
      },
      TAlign: [
        {
          key: "left",
          item: []
        }
      ],
      tableTitle: [
        { label: "业务板块名称", prop: "sectorName" },
        { label: "数据集名称", prop: "dataSetName" },
        { label: "英文名称", prop: "code" },
        { label: "中文名称", prop: "name" }
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10
      },
      TClickItem: [
        {
          link: "",
          cells: []
        }
      ],
      //  字段规则列表
      TId: "table-data-set",
      TableData: [],
      TableTitle: [
        { label: "规则编码", prop: "code" },
        { label: "规则名称", prop: "name" },
        { label: "内容描述", prop: "rulesContent" },
        { label: "创建人", prop: "createPerson" },
        { label: "创建时间", prop: "createTime" },
        { label: "备注", prop: "remark" }
      ],
      TableDigLoading: false,
      TPage_1: {
        total: 0,
        index: 1,
        size: 10
      },
      TEdit_1: {
        show: true,
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "text"
          },
          {
            label: "删除",
            css: "text",
            pass: true
          }
        ]
      },
      TAlign_1: [
        {
          key: "left",
          item: []
        }
      ],
      TClickItem_1: [
        {
          link: "",
          cells: []
        }
      ],
      // 动态规则
      DigRVisible: false,
      DigRId: "dig_rules_1",
      DigRTitle: "",
      DigRTree: [],
      DigRFormInit: {},
      DigRFoot: [],
      // 当前激活的值
      DigRcurrenKey: {
        parentIds: [],
        expandedKey: "2",
        currentKey: ""
      },
      DigRForm: [],
      objItem: {}
    };
  },
  watch: {
    activeIndex: {
      handler(newVal) {
        if (newVal) {
          this.getList();
        }
      },
      immediate: true
    },
    areaId() {
      this.getList();
    },
    businessSectorId() {
      this.getList();
    },
    businessStageId() {
      this.getList();
    },
    dataSetId() {
      this.getList();
    },
    activeRow_: {
      handler(newVal) {
        if (newVal) {
          this.getFieldRules();
        }
      },
      deep: true
    }
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.DigRVisible = editItem.close;
        this.DigRTitle = "";
        this.DigRForm = [];
        this.DigRFoot = [];
        this.DigRcurrenKey = {
          expandedKey: "1",
          currentKey: "",
          parentIds: []
        };
        this.DigRFormInit = {};
        this.objItem = {};
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    changePage_1({ pageSize, currentPage }) {
      this.$set(this.TPage_1, `index`, currentPage);
      this.$set(this.TPage_1, `size`, pageSize);
      this.getFieldRules();
    },
    lickCellDataSet({ row, column, id }) {
      const { name } = row;
      switch (column.label) {
        case "编辑":
          {
            this.DigRVisible = true;
            this.DigRTitle = "编辑字段清洗规则";
            this.DigRFormInit = {
              DigRFormInit: JSON.parse(row.rulesContent),
              row
            };
            let rulesParentIdArr = row.rulesParentId.split(",");
            this.DigRcurrenKey = {
              parentIds: rulesParentIdArr,
              expandedKey: rulesParentIdArr[rulesParentIdArr.length - 2],
              currentKey: rulesParentIdArr[rulesParentIdArr.length - 1]
            };
            this.objItem = {
              areaId: row.areaId,
              businessSectorId: row.businessSectorId,
              dataClassifyId: row.businessStageId,
              dataSetId: row.dataSetId
            };
            this.DigRFoot = [
              {
                type: "ok",
                label: "确定",
                cb: (form, domForm, activeTree) => {
                  // 构建非JSON参数
                  let reqParams = {};
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
                                if (form[k] && typeof form[k] == "string") {
                                  if (form[k].indexOf(",") !== -1) {
                                    let fieldsArr = form[k].split(",");
                                    options[key].forEach(item => {
                                      fieldsArr.forEach(ele => {
                                        if (item.code === ele) {
                                          arr_.push({
                                            code: item.code,
                                            name: item.name
                                          });
                                        }
                                      });
                                    });
                                    form[k] = arr_;
                                  }
                                }
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
                  if (activeTree.info.parentIds.length) {
                    rulesParentId = activeTree.info.parentIds.join(",");
                  }
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
                  // 请求参数
                  let req = Object.assign(
                    {},
                    reqParams,
                    { rulesContent: JSON.stringify(form) },
                    { rulesId: rulesId, rulesParentId: rulesParentId },
                    { id: row.id }
                  );
                  this.update(req);
                }
              }
            ];
          }
          return;
        case "删除":
          {
            this.$confirm(`即将删除“${name}”, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.del({ id: row.id });
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
    // 新增清洗规则
    addRules() {
      if (
        this.areaId &&
        this.businessSectorId &&
        this.businessStageId &&
        this.dataSetId
      ) {
        this.objItem = {
          areaId: this.areaId,
          businessSectorId: this.businessSectorId,
          dataClassifyId: this.businessStageId,
          dataSetId: this.dataSetId
        };
        this.DigRVisible = true;
        this.DigRTitle = "新增字段清洗规则";
        this.DigRFoot = [
          {
            type: "ok",
            label: "确定",
            cb: (form, domForm, activeTree) => {
              // 构建非JSON参数
              let reqParams = {};
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
                                    if (
                                      form[k].toString().indexOf(",") !== -1
                                    ) {
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
              if (activeTree.info.parentIds.length) {
                rulesParentId = activeTree.info.parentIds.join(",");
              }
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
              // 请求参数
              let req = Object.assign(
                {},
                reqParams,
                { rulesContent: JSON.stringify(form) },
                { rulesId: rulesId, rulesParentId: rulesParentId }
              );
              console.log("请求参数", form, reqParams, activeTree);
              this.add(req);
            }
          }
        ];
      } else {
        this.$message({
          message: "请选择",
          type: "warning"
        });
      }
    },

    /* 请求 */
    // 字段列表
    getList() {
      this.TLoading = true;
      // this.tableData = [];
      API.fieldRulesList({
        areaId: this.areaId,
        businessSectorId: this.businessSectorId,
        businessStageId: this.businessStageId,
        dataSetId: this.dataSetId,
        pageSize: this.TPage.size,
        pageNum: this.TPage.index
      }).then(res => {
        let Res = new ResDatas(
          {
            res,
            code: 0,
            fieldKey: {
              data: "data",
              title: "title",
              total: "totalCount"
            },
            titleKey: []
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
    // 字段规则列表
    getFieldRules() {
      if (this.activeRow_) {
        this.TableData = [];
        let req = {
          dataSetAttrId: this.activeRow_.id,
          pageNum: this.TPage_1.index,
          pageSize: this.TPage_1.size
        };
        this.TableDigLoading = true;
        API.subFieldRulesList(req)
          .then(res => {
            let Res = new ResDatas(
              {
                res,
                code: 0,
                fieldKey: {
                  data: "data",
                  title: "title",
                  total: "totalCount"
                },
                titleKey: []
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
          .catch(error => {
            this.TableDigLoading = false;
          });
      }
    },
    // 获取对应节点的规则——DOM结构
    getTreeItemDom({ ruleId, setValRes = false }) {
      API.rulePreview({ ruleId })
        .then(data => {
          if (data.data.code === "0") {
            let Res = [];
            if (data.data && data.data.data) {
              Res = data.data.data;
            }
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
            } else {
              // 新增
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
                  } else if (item.paraType === 4) {
                    // 数据集设置默认值
                    if (item.prop === "checkTable") {
                      item["value"] = this.dataSetId;
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
    // 新增 清洗规则
    add(req) {
      if (this.activeRow_ && this.activeRow_.id) {
        this.DigRVisible = false;
        API.addFieldRules({
          ...req,
          dataSetAttrId: this.activeRow_.id
        }).then(res => {
          new ResDatas({
            res,
            code: 0
          }).state();
          this.getFieldRules();
        });
      }
    },
    // 编辑
    update(req) {
      if (this.activeRow_ && this.activeRow_.id) {
        API.updateRules({
          ...req,
          dataSetAttrId: this.activeRow_.id
        }).then(res => {
          new ResDatas({
            res,
            code: 0
          }).state();
          this.getFieldRules();
        });
      }
    },
    del({ id }) {
      API.deleteRules({ id }).then(res => {
        new ResDatas({
          res,
          code: 0
        }).state();
        this.getFieldRules();
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.field-rules {
  width: 100%;
  height: 100%;
  overflow: auto;
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
  &-mid {
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
}
</style>
