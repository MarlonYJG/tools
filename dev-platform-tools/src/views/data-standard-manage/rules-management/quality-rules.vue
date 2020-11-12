<!--
 * @Author: Marlon
 * @Date: 2020-07-24 20:13:47
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-07 09:24:16
 * @Description: 数据标准-规则管理-质量规则
--> 

<template>
  <div class="quality-ruler">
    <div class="quality-ruler-edit-area">
      <ul class="quality-ruler-edit-area-btn">
        <li>
          <AddButton text="新增" @click="addRules" :clickArgs="{type:'新增'}"></AddButton>
        </li>
      </ul>
      <ul class="quality-ruler-edit-area-select">
        <li>
          <label for>项目：</label>
          <el-select
            v-model="proVal"
            clearable
            filterable
            placeholder="请选择项目"
            size="small"
            @change="clearVals(1)"
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
          <label for>业务板块：</label>
          <el-select
            v-model="blockVal"
            filterable
            clearable
            placeholder="请选择业务板块"
            size="small"
            @change="clearVals(2)"
          >
            <el-option v-for="item in blockList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </li>
        <li>
          <label for>数据集分类：</label>
          <el-select
            v-model="classifyVal"
            clearable
            filterable
            placeholder="请选择分类"
            size="small"
            @change="clearVals(3)"
          >
            <el-option
              v-for="item in classifyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </li>
        <li>
          <label for>数据集：</label>
          <el-select
            v-model="dataSetValList"
            clearable
            filterable
            placeholder="请选择数据集"
            size="small"
          >
            <el-option
              v-for="item in dataSetList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <div class="quality-ruler-table">
      <TableDefault
        TId="qr"
        :TAlign="TAlign"
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TEdit="TEdit"
        :TIsShowPage="true"
        :TTotal="TPage.total"
        :TCurrentPage="TPage.index"
        :TPageSize="TPage.size"
        :TClickItem="TClickItem"
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
        @changePage="changePage"
      ></TableDefault>
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
import Sortable from "sortablejs";
import API from "api/index";
import { ResDatas, reqFormatDic } from "utils/res-format";
import rulesPreview from "@/business-components/rules-preview";

export default {
  mixins: [mixin],
  components: { rulesPreview },
  data() {
    return {
      // 查询条件
      proVal: "",
      proList: [],
      classifyList: [],
      classifyVal: "",
      blockList: [],
      blockVal: "",
      dataSetList: [],
      dataSetValList: "",
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: [],
        },
      ],
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
      tableTitle: [
        { label: "规则编码", prop: "code" },
        { label: "规则名称", prop: "name" },
        { label: "内容描述", prop: "rulesContent" },
        { label: "创建人", prop: "createPerson" },
        { label: "创建时间", prop: "createTime" },
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
      // 动态规则
      DigRVisible: false,
      DigRId: "dig_rules_1",
      DigRTitle: "",
      DigRTree: [],
      DigRFormInit: {},
      DigRFoot: [],
      DigRcurrenKey: {
        parentIds: [],
        expandedKey: "3",
        currentKey: "",
      },
      DigRForm: [],
      objItem: {},
    };
  },
  watch: {
    proVal(newVal) {
      if (newVal) {
        this.getSectorList({ areaId: newVal });
      }
      this.getList();
    },
    blockVal(newVal) {
      if (newVal) {
        this.getSortList({ sectorId: newVal });
      }
      this.getList();
    },
    classifyVal(newVal) {
      if (newVal) {
        this.getDataSet({ stageId: newVal });
      }
      this.getList();
    },
    dataSetValList(newVal) {
      this.getList();
    },
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
          expandedKey: "3",
          currentKey: "",
          parentIds: [],
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
    // 单元格事件
    lickCell({ row, column, id }) {
      const { name } = row;
      switch (column.label) {
        case "编辑":
          {
            this.DigRVisible = true;
            this.DigRTitle = "编辑规则";
            this.DigRFormInit = {
              DigRFormInit: JSON.parse(row.rulesContent),
              row,
            };
            let rulesParentIdArr = row.rulesParentId.split(",");
            this.DigRcurrenKey = {
              parentIds: rulesParentIdArr,
              expandedKey: rulesParentIdArr[rulesParentIdArr.length - 2],
              currentKey: rulesParentIdArr[rulesParentIdArr.length - 1],
            };
            this.objItem = {
              areaId: row.areaId,
              businessSectorId: row.businessSectorId,
              dataClassifyId: row.businessStageId,
              dataSetId: row.dataSetId,
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
                                if (form[k] && typeof form[k] === "string") {
                                  if (form[k].indexOf(",") !== -1) {
                                    let fieldsArr = form[k].split(",");
                                    options[key].forEach((item) => {
                                      fieldsArr.forEach((ele) => {
                                        if (item.code === ele) {
                                          arr_.push({
                                            code: item.code,
                                            name: item.name,
                                          });
                                        }
                                      });
                                    });
                                    form[k] = arr_;
                                  }
                                }
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
                  // 请求参数
                  let req = Object.assign(
                    {},
                    reqParams,
                    { rulesContent: JSON.stringify(form) },
                    { rulesId: rulesId, rulesParentId: rulesParentId },
                    { id: row.id }
                  );
                  this.update(req);
                },
              },
            ];
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
                this.del(row.id);
              })
              .catch(() => {});
          }
          return;
        default:
          break;
      }
    },
    // 初始化查询值
    clearVals(type) {
      if (1 == type) {
        this.blockVal = "";
        this.blockList = [];
        this.classifyVal = "";
        this.classifyList = [];
        this.dataSetList = [];
        this.dataSetValList = "";
      } else if (2 == type) {
        this.classifyVal = "";
        this.classifyList = [];
        this.dataSetList = [];
        this.dataSetValList = "";
      } else {
        this.dataSetList = [];
        this.dataSetValList = "";
      }
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
    // 新增
    addRules() {
      if (
        this.proVal &&
        this.blockVal &&
        this.classifyVal &&
        this.dataSetValList
      ) {
        this.objItem = {
          areaId: this.proVal,
          businessSectorId: this.blockVal,
          dataClassifyId: this.classifyVal,
          dataSetId: this.dataSetValList,
        };
        console.log(this.objItem);
        this.DigRVisible = true;
        this.DigRTitle = "新增质量检测规则";
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
              if (activeTree.info.parentIds.length) {
                rulesParentId = activeTree.info.parentIds.join(",");
              }
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
                // 多选
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
              // 请求参数
              let req = Object.assign(
                {},
                reqParams,
                { rulesContent: JSON.stringify(form) },
                { rulesId: rulesId, rulesParentId: rulesParentId }
              );
              console.log("请求参数", form, reqParams, activeTree);
              this.add(req);
            },
          },
        ];
      } else {
        this.$message({
          message: "请选择",
          type: "warning",
        });
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
    // 业务板块
    getSectorList({ areaId, type = "", initVal = "" }) {
      API.searchSectorDic({ areaId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if ("dig" == type) {
          if (Res) {
            this.businessSectorDic = Res;
          } else {
            this.businessSectorDic = [];
          }
        } else {
          if (Res) {
            this.blockList = Res;
          } else {
            this.blockList = [];
          }
        }
      });
    },
    // 数据集分类
    getSortList({ sectorId, type = "", initVal = "" }) {
      API.getStageClassifyDic({
        sectorId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if ("dig" == type) {
          if (Res) {
            this.dataClassifyDic = Res;
          } else {
            this.dataClassifyDic = [];
          }
        } else {
          if (Res) {
            this.classifyList = Res;
          } else {
            this.classifyList = [];
          }
        }
      });
    },
    // 数据集
    getDataSet({ stageId, type = "", initVal = "" }) {
      API.getStageDic({
        stageId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if ("dig" == type) {
          if (Res) {
            this.dataSetDic = Res;
          } else {
            this.dataSetDic = [];
          }
        } else {
          if (Res) {
            Res.forEach((item) => {
              item["label"] = item.name;
              item["value"] = item.id;
            });
            this.dataSetList = Res;
          } else {
            this.dataSetList = [];
          }
        }
      });
    },
    // 获取
    getList() {
      this.TLoading = true;
      API.qualityRulesList({
        areaId: this.proVal,
        businessSectorId: this.blockVal,
        businessStageId: this.classifyVal,
        dataSetId: this.dataSetValList,
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
            this.tableTitle = title;
            this.tableData = data;
            this.$set(this.TPage, `total`, total);
          } else {
            this.tableData = [];
            this.$set(this.TPage, `total`, 0);
          }
        })
        .catch((err) => {
          this.TLoading = false;
        });
    },
    // 新增
    add(req) {
      this.DigRVisible = false;
      API.addQualityRules(req).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    del(id) {
      API.deleteRules({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    update(req) {
      this.DigRVisible = false;
      API.updateRules(req).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 获取对应节点的规则——DOM结构
    getTreeItemDom({ ruleId, setValRes = false }) {
      API.rulePreview({ ruleId })
        .then((data) => {
          console.log(data);
          if (data.data.code === "0") {
            let Res = [];
            if (data.data && data.data.data) {
              Res = data.data.data;
            }
            if (Object.keys(this.DigRFormInit).length) {
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
              this.DigRForm = Res;
            } else {
              // 新增
              Res.forEach((item) => {
                // 默认值的格式初始化
                if (item.displayMode === 2) {
                  if (item.paraType === 2) {
                    if (item.paraRange) {
                      // console.log(item.paraRange,'/')
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
                  } else if (item.paraType === 4) {
                    // 数据集设置默认值
                    if (item.prop === "checkTable") {
                      item["value"] = this.dataSetValList;
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
        .catch((error) => {
          this.DigRForm = [];
          console.error(error);
        });
    },
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      const { name } = JSON.parse(this.$route.query.column);
      if ("项目管理" === name) {
        const { areaId } = JSON.parse(this.$route.query.row);
        this.proVal = areaId;
      } else {
      }
    }
    this.getProList({ init: true });
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.quality-ruler {
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
        margin-right: 10px;
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
