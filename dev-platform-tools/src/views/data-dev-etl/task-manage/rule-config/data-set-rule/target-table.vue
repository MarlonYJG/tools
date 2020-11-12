<!--
 * @Author: Marlon
 * @Date: 2020-04-27 14:12:06
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-22 10:36:28
 * @Description: 目标表
 -->

 <template>
  <div class="etl-target">
    <div class="etl-target-top">
      <div class="etl-target-top-edit-area">
        <ul class="etl-target-top-edit-area-btn">
          <li>
            <el-button size="small" @click="showTableDialog({type:'新增目标表'})">新增目标表</el-button>
          </li>
        </ul>
        <ul class="etl-target-top-edit-area-select">
          <li>
            <label for>项目：</label>
            <el-select
              v-model="proVal"
              filterable
              placeholder="请选择项目"
              size="small"
              @change="proChange"
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
            <label for>任务：</label>
            <el-select v-model="taskVal" filterable placeholder="请选择任务" size="small">
              <el-option
                v-for="item in taskList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
        </ul>
      </div>
      <div class="etl-target-top-table">
        <TableDefault
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
          @editBtnCb="editBtnCb"
          @clickCell="lickCell"
          @clickRow="clickRow"
          @changePage="changePage"
        ></TableDefault>
      </div>
      <!-- 弹出框：添加目标表 -->
      <TableDialog
        TableDigId="aaa"
        :TableDigTitle="'添加目标表'"
        :TableDigVisible="TableDigVisible"
        :TableDigLoading="TableDigLoading"
        :TableDigWidth="800"
        :TableData="TableData"
        :TableTitle="TableTitle"
        :TabledigHeight="452"
        :TableDigShowCheckBox="true"
        :TableDigShowCheckBoxData="TableDigShowCheckBoxData"
        :TableDigPage="TableDigPage"
        :TableDigFoot="TableDigFoot"
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
      ></TableDialog>
      <!-- 弹出框：编辑源数据集 -->
      <TabsDialog
        :TabsDigShow="TabsDigShow"
        :TabsDigTitle="TabsDigTitle"
        :TabsDFootBtn="TabsDFootBtn"
        @editBtnCb="editBtnCb"
      >
        <template slot="tabs">
          <el-tabs v-model="tabActiveName" @tab-click="handleClickTabs">
            <el-tab-pane
              v-for="(item, index) in TabsDig"
              :key="index"
              :label="item.label"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
        </template>
        <template slot="tabContent">
          <div v-if="tabActiveName==='1'">
            <el-form ref="tabsDigform_1" :model="tabsDigform_1" label-width="120px">
              <el-form-item label="表：">
                <el-select
                  v-model="tableVal"
                  style="margin-left: 20px;"
                  placeholder="请选择表"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in tableOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="数据过滤：">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 10}"
                  placeholder="请参考相应SQL语法填写where过滤语句，该过滤语句可做数据筛选用，或做数据增量采集用。"
                  v-model="sqlField"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="tabs-btn">
              <el-button size="medium" type="primary" @click="viewData">数据预览</el-button>
            </div>
          </div>
          <div v-else-if="tabActiveName==='2'">
            <el-form ref="tabsDigform_2" :model="tabsDigform_2" label-width="120px">
              <el-form-item label="数据集名称：">
                <el-input v-model="sqlSetDataVal" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="SQL语句：">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 10}"
                  placeholder="请填写SQL语句"
                  v-model="sqlText"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注说明：">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6}"
                  placeholder="请输入"
                  v-model="sqlRemake"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="tabs-btn">
              <el-button size="medium" type="primary" @click="viewData">数据预览</el-button>
            </div>
          </div>
          <div v-else-if="tabActiveName==='3'"></div>
          <div v-else-if="tabActiveName==='4'"></div>
        </template>

        <el-dialog title="数据预览" slot="table" :visible.sync="isShowViewTable">
          <TableDefault
            :TLoading="TLoading_viewData"
            :TTitle="tableTitle_viewData"
            :TData="tableData_viewData"
            :TIsShowPage="true"
            :TTotal="TPage_viewData.total"
            :TCurrentPage="TPage_viewData.index"
            :TPageSize="TPage_viewData.size"
            :TEdit="TEdit_viewData"
            :TAlign="TAlign_viewData"
            @changePage="changePage_viewData"
          ></TableDefault>
        </el-dialog>
      </TabsDialog>
    </div>
    <span class="data-detail-mid" @click="fold = !fold">
      <i v-if="fold" class="el-icon-arrow-down up-dow"></i>
      <i v-else class="el-icon-arrow-up up-dow"></i>
    </span>
    <!-- 字段映射/清洗规则 -->
    <div v-show="fold" class="etl-target-bot">
      <el-tabs v-model="activeIndex" @tab-click="handleClick" style="height: auto;">
        <el-tab-pane
          v-for="item in tabs"
          :index="item.id"
          :key="item.id"
          :label="item.name"
          :name="item.id"
        ></el-tab-pane>
      </el-tabs>
      <Fiels v-if="activeIndex==='a'" :Item="activeRow_" :taskVal="taskVal"></Fiels>
      <Rules v-else :Item="activeRow_" :taskVal="taskVal"></Rules>
    </div>
  </div>
</template>
 
 <script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { isPositiveInt, checkip } from "utils";
import { openUrl, cellJump } from "utils/jump";

import Fiels from "./field";
import Rules from "./rules";
import TableDialog from "@/components/dialog/table-dialog";
import TabsDialog from "@/components/dialog/tabs-dialog";

const TABS = [
  {
    id: "a",
    name: "字段映射"
  },
  {
    id: "b",
    name: "清洗规则"
  }
];
const TabsDig = [
  {
    label: "单表选择",
    name: "1"
  },
  {
    label: "SQL数据集",
    name: "2"
  }
  // {
  //   label: "多表关联构造数据集",
  //   name: "3"
  // },
  // {
  //   label: "相似数据集（知识库推荐）",
  //   name: "4"
  // }
];

export default {
  mixins: [mixin],
  components: {
    Fiels,
    Rules,
    TableDialog,
    TabsDialog
  },
  data() {
    return {
      activeIndex: "a",
      tabs: TABS,
      fold: true,
      // 编辑源数据集
      TabsDig,
      // 查询条件
      proVal: "",
      proList: [],
      taskVal: "",
      taskList: [],
      // 弹出框-tabs
      isShowViewTable: false,
      tabActiveName: "1",
      tabsDigform_1: {},
      tableVal: "",
      tableOption: [],
      sqlField: "",
      // SQL数据集
      sqlText: "",
      tabsDigform_2: {},
      sqlRemake: "",
      sqlSetDataVal: "",
      // 表格
      TLoading: false,
      TActiveRow: 0,
      TEdit: {
        show: true,
        title: "操作",
        width: 250,
        fixed: "right",
        editTypes: [
          {
            label: "编辑源数据集",
            property: "edit",
            css: "success"
          },
          {
            label: "执行",
            css: "warring"
          },
          {
            label: "查看结果",
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
        { prop: "projectName", label: "项目" },
        { prop: "code", label: "编码" },
        { prop: "name", label: "名称" },
        { prop: "typeName", label: "类型" },
        { prop: "sourceDataSourceName", label: "数据来源" },
        { prop: "targetDataSourceName", label: "数据去向" },
        { prop: "remark", label: "备注" }
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10
      },
      // 数据预览-表格
      TLoading_viewData: false,
      tableTitle_viewData: [],
      tableData_viewData: [],
      TPage_viewData: {
        total: 0,
        index: 1,
        size: 10
      },
      TEdit_viewData: { show: false },
      TAlign_viewData: [],
      // 弹出框-添加目标表
      TableDigVisible: false,
      TableData: [],
      TableTitle: [
        {
          label: "目标表",
          prop: "target_tableName_tableComment"
        },
        {
          label: "源表",
          prop: "source_tableName_tableComment"
        }
      ],
      TableDigLoading: false,
      TableDigFoot: {
        show: true,
        data: [
          {
            type: "button",
            classType: "primary",
            class: "",
            label: "确定",
            cb: obj => {
              this.taskItemAdd(obj);
            }
          }
        ]
      },
      TableDigPage: {
        show: false,
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      TableDigShowCheckBoxData: [],
      // 弹出框-编辑源数据集
      TabsDigShow: false,
      TabsDFootBtn: [],
      TabsDigTitle: "",
      // 获取点击值的信息
      activeRow_: "",
      // 获取对应行为的弹出框
      dialogActiveItem: ""
    };
  },
  watch: {
    proVal: function(newVal) {
      if (newVal) {
        this.getTaskList(newVal);
      }
    },
    taskVal: function(newVal) {
      if (newVal) {
        this.getList();
      } else {
        this.tableData = [];
        this.activeRow_ = "";
      }
    }
  },
  methods: {
    // 标签页
    handleClickTabs(val) {
      console.log(val);
    },
    handleClick(val) {
      this.activeIndex = val.name;
    },
    // 选择项目
    proChange() {
      this.taskVal = "";
      this.taskList = [];
    },
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
        this.del(row);
      } else if (text === "close") {
        this.FDVisible = editItem.close;
        this.TabsDigShow = editItem.close;
        this.TableDigVisible = editItem.close;
      }
    },
    // 表格弹出框-添加目标表
    showTableDialog({ type }) {
      switch (type) {
        case "新增目标表":
          {
            if (this.taskVal) {
              this.TableDigVisible = true;
              this.getTargetList();
            } else {
              this.$message({
                message: "请选择要添加的任务",
                type: "warning"
              });
            }
          }
          return;
        default:
          break;
      }
    },
    // Tag弹出框-编辑源数据集
    showTabsDialog({ type, initDig, row }) {
      switch (type) {
        case "编辑源数据集":
          {
            this.getTableList(this.taskVal);
            // 单表
            this.tableVal = row.type == 2 ? "" : initDig.sourceTableCode;
            this.sqlField = initDig.condition;
            // SQL数据集
            this.sqlSetDataVal = initDig.sourceTableName;
            this.sqlRemake = initDig.remark;
            this.sqlText = row.type == 1 ? "" : initDig.sourceTableCode;

            this.TabsDigShow = true;
            this.TabsDigTitle = "编辑";
            this.TabsDFootBtn = [
              {
                type: "ok",
                label: "确定",
                css: "primary",
                cb: form => {
                  this.setDatas();
                }
              }
            ];
          }
          break;

        default:
          break;
      }
    },
    // 数据预览
    viewData() {
      this.isShowViewTable = true;
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    changePage_viewData({ pageSize, currentPage }) {
      this.$set(this.TPage_viewData, `index`, currentPage);
      this.$set(this.TPage_viewData, `size`, pageSize);
      this.getViewData();
    },
    lickCell({ row, column, id }) {
      this.activeRow_ = row;
      const { remark, sourceTableCode, sourceTableName, condition = "" } = row;
      switch (column.label) {
        case "编辑源数据集":
          {
            this.showTabsDialog({
              row: row,
              type: column.label,
              initDig: {
                sourceTableCode,
                condition,
                sourceTableName,
                remark
              }
            });
          }
          return;
        case "执行":
          {
            this.targetTableRun(row);
          }
          return;
        case "查看结果":
          {
            cellJump(this, {
              row,
              column,
              TClickItem: [
                {
                  link: "/etl/list/resultsList",
                  jump: {
                    type: "int",
                    mode: "push"
                  }
                }
              ]
            });
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

    /* 请求 */
    // 获取 项目列表
    getProList({ init }) {
      API._publicProject().then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let proArr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            proArr.push({
              ...item,
              label: item.name,
              value: item.id
            });
          });
          if (init) {
            this.proVal = proArr[0].value;
          }
        }
        this.proList = proArr;
      });
    },
    // 获取 任务列表
    getTaskList(projectId) {
      API._publicTask({ projectId }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let taskArr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            taskArr.push({
              ...item,
              label: item.name,
              value: item.id
            });
          });
        }
        if (!this.taskVal) {
          if (taskArr.length) {
            this.taskVal = taskArr[0].id;
          }
        }
        this.taskList = taskArr;
      });
    },
    // 获取表列表
    getTableList(id) {
      let sourceDataSourceId = "";
      this.taskList.forEach(item => {
        if (item.id === id) {
          sourceDataSourceId = item.sourceDataSourceId;
        }
      });
      this.tableOption = [];
      API.ruleConfigTableList({ sourceDataSourceId }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if (Res && Res.length) {
          Res.forEach(item => {
            item["label"] = item.tableName_tableComment;
            item["value"] = item.tableName;
          });
          this.tableOption = Res;
        }
      });
    },
    // 获取
    getList(row) {
      if (this.taskVal) {
        let req = {
          pageNum: this.TPage.index,
          pageSize: this.TPage.size,
          taskId: this.taskVal
        };
        this.TLoading = true;
        API.ruleConfigGetList(req)
          .then(res => {
            let Res = new ResDatas(
              {
                res,
                code: 0,
                fieldKey: {
                  data: "data",
                  title: "title",
                  total: "total",
                  pageSize: "pageSize"
                },
                titleKey: []
              },
              "TLoading",
              this
            );
            if (Res.init()) {
              const { data, total, title, pageSize } = Res.formatData();
              if (data && data.length) {
                if (row) {
                  this.TActiveRow = row.id;
                  this.activeRow_ = row;
                } else {
                  this.TActiveRow = data[0].id;
                  this.activeRow_ = data[0];
                }
              } else {
                this.activeRow_ = "";
              }
              this.tableTitle = title;
              this.tableData = data;
              this.$set(this.TPage, `size`, pageSize);
              this.$set(this.TPage, `total`, total);
            } else {
              this.activeRow_ = "";
              this.tableData = [];
              this.$set(this.TPage, `total`, 0);
            }
          })
          .catch(error => {
            this.TLoading = false;
          });
      }
    },
    // 获取-目标表
    getTargetList() {
      this.TableData = [];
      let sourceDataSourceId = "";
      let targetDataSourceId = "";
      this.taskList.forEach(item => {
        if (this.taskVal === item.id) {
          sourceDataSourceId = item.sourceDataSourceId;
          targetDataSourceId = item.targetDataSourceId;
        }
      });
      this.TableDigLoading = true;
      API.ruleConfigTargetList({
        sourceDataSourceId,
        targetDataSourceId,
        taskId: this.taskVal
      }).then(res => {
        let Res = new ResDatas(
          {
            res,
            code: 0
          },
          "TableDigLoading",
          this
        ).init();
        if (Res && Res.length) {
          // Res.forEach(item => {
          //   item["isTrue"] = false;
          // });
          this.TableData = Res;
        }
      });
    },
    // 保存-目标表
    taskItemAdd(list) {
      let etlTableMappings = [];
      if (list.multipleSelection && list.multipleSelection.length) {
        list.multipleSelection.forEach(item => {
          etlTableMappings.push({
            taskId: this.taskVal,
            sourceTableCode: item.source_tableName,
            sourceTableName: item.source_tableComment,
            targetTableCode: item.target_tableName,
            targetTableName: item.target_tableComment
          });
        });
      }
      API.ruleConfigAdd({
        etlTableMappings
      })
        .then(res => {
          let Res = new ResDatas({
            res,
            code: 0
          }).state();
          this.TableDigVisible = false;
          this.getList();
        })
        .catch(error => {
          this.TableDigVisible = false;
          console.error(error);
        });
    },
    // 编辑源数据集
    setDatas() {
      let req = {};
      if (this.tabActiveName === "1") {
        req = {
          type: 1,
          id: this.activeRow_.id,
          condition: this.sqlField,
          sourceTableCode: this.tableVal
        };
        this.tableOption.forEach(item => {
          if (item.value === this.tableVal) {
            req["sourceTableName"] = item.label;
          }
        });
      } else if (this.tabActiveName === "2") {
        req = {
          type: 2,
          id: this.activeRow_.id,
          sourceTableName: this.sqlSetDataVal,
          sourceTableCode: this.sqlText,
          remark: this.sqlRemake
        };
      }
      API.ruleConfigUpdate(req)
        .then(res => {
          this.TabsDigShow = false;
          new ResDatas({
            res,
            code: 0
          }).state();
          this.getList();
        })
        .catch(error => {
          this.TabsDigShow = false;
        });
    },
    // 执行
    targetTableRun(row) {
      API.ruleConfigRun({ id: row.id }).then(res => {
        new ResDatas({
          res,
          code: 0
        }).state();
        this.getList(row);
      });
    },
    // 删除
    del({ id }) {
      API.ruleConfigDel({ id }).then(res => {
        new ResDatas({ res, code: 0 }).state();
        this.getList();
      });
    },
    // 数据预览
    getViewData() {}
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      let paramsUrl = JSON.parse(this.$route.query.row);
      this.proVal = paramsUrl.projectId;
      this.taskVal = paramsUrl.id;
      this.getProList({ init: false });
    } else {
      this.getProList({ init: true });
    }
  }
};
</script>
 
<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.etl-target {
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
  }
  .tabs-btn {
    text-align: center;
    margin-top: 22px;
  }
}
</style>
