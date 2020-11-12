<!--
 * @Author: Marlon
 * @Date: 2020-02-18 10:29:39
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-08 16:09:49
 * @Description: 数据库结构同步
 -->
 <template>
  <div class="db-structure">
    <div class="db-structure-top">
      <div class="area-query">
        <label for>项目：</label>
        <el-select v-model="proVal" filterable placeholder="请选择" size="small" @change="getList">
          <el-option
            v-for="item in proList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="area-table">
        <TableDefault
          TId="1"
          :TAlign="TAlign"
          :TLoading="TLoading"
          :TTitle="tableTitle"
          :TEdit="TEdit"
          :TData="tableData"
          :TIsShowPage="true"
          :TTotal="TPage.total"
          :TCurrentPage="TPage.index"
          :TPageSize="TPage.size"
          @editBtnCb="editBtnCb"
          @clickCell="lickCell"
          @changePage="changePage"
          @clickRow="clickRow"
        ></TableDefault>
      </div>
    </div>
    <span class="db-structure-mid" @click="fold = !fold">
      <i v-show="fold" class="el-icon-arrow-down up-dow"></i>
      <i v-show="!fold" class="el-icon-arrow-up up-dow"></i>
    </span>
    <div v-show="fold" class="db-structure-bot">
      <div
        class="bot-title"
      >数据库"{{dbItme ? dbItme.projectName:''}}-{{dbItme? dbItme.dbName : ''}}"的维护日志：</div>
      <div class="bot-table">
        <TableDefault
          TId="2"
          :TLoading="TLoading_1"
          :TTitle="tableTitleBot"
          :TData="tableDataBot"
          :TIsShowPage="true"
          :TTotal="TPage_1.total"
          :TCurrentPage="TPage_1.index"
          :TPageSize="TPage_1.size"
          @changePage="changePage_1"
        ></TableDefault>
      </div>
    </div>
    <!-- 弹出框 -->
    <FormDialog
      :FDId="FDId"
      :FDVisible="FDVisible"
      :FDTitle="FDTitle"
      :FDForm="FDForm"
      FDWidth="500"
      :FDFoot="FDFoot"
      :FDRules="FDRules"
      @editBtnCb="editBtnCb"
    ></FormDialog>
    <SqlDialog
      :SDTitle="SDTitle"
      :SDVisible="SDVisible"
      :SDWidth="SDWidth"
      :SDAutosize="SDAutosize"
      :SDSql="SDSql"
      :SDSourceSql="SDSourceSql"
      :SDFoot="SDFoot"
      @editBtnCb="editBtnCb"
    ></SqlDialog>
    <TableDialog
      TableDigId="aaa"
      :TableDigTitle="'差异对比'"
      :TableDigVisible="TableDigVisible"
      :TableDigLoading="TableDigLoading"
      :TableDigWidth="800"
      :TableData="TableData"
      :TableTitle="TableTitle"
      :TabledigHeight="452"
      :TableDigPage="TableDigPage"
      :TableDigFoot="TableDigFoot"
      @editBtnCb="editBtnCb"
    ></TableDialog>
  </div>
</template>
 
 <script>
import mixin from "mixin";
import API from "api/index";
import { openUrl } from "utils/jump";
import { ResDatas } from "utils/res-format";
import { _ExportExcel } from "utils/index";
import SqlDialog from "../components/sql-dialog";
import TableDialog from "@/components/dialog/table-dialog";
export default {
  mixins: [mixin],
  components: {
    SqlDialog,
    TableDialog
  },
  data() {
    return {
      fold: false,
      // 项目名称
      proVal: "",
      // 项目列表
      proList: [],
      // 表格配置
      TLoading: false,
      TLoading_1: false,
      TAlign: [
        {
          key: "left",
          item: ["projectName", "dbNameRemark"]
        }
      ],
      TEdit: {
        show: true,
        title: "操作",
        width: "420",
        fixed: "right",
        editTypes: [
          {
            label: "设置数据源",
            css: "text"
          },
          {
            label: "生成建库SQL",
            css: "text"
          },
          {
            label: "差异对比",
            css: "text"
          },
          {
            label: "生成差异SQL",
            css: "text"
          },
          {
            label: "同步字典表",
            css: "text"
          }
        ]
      },
      tableTitle: [
        { prop: "dbName", label: "库名" },
        { prop: "dbNameRemark", label: "中文名称" },
        { prop: "projectName", label: "所属项目" },
        { prop: "dataSourceName", label: "对应数据源（物理库）" },
        { prop: "firstCreateDbTime", label: "首次建库时间" },
        { prop: "updateCount", label: "共维护更新次数" },
        { prop: "manager", label: "负责人" },
        { prop: "gmtCreate", label: "创建时间" }
      ],
      tableData: [],
      tableTitleBot: [
        { prop: "operationLog", label: "维护日志" },
        { prop: "manager", label: "负责人" },
        { prop: "gmtCreate", label: "创建时间" }
      ],
      tableDataBot: [],
      TClickItem: [],
      TPage: {
        index: 1,
        total: 0,
        size: 10
      },
      TPage_1: {
        index: 1,
        total: 0,
        size: 10
      },
      dbItme: "",
      // 弹出框
      FDId: "1",
      FDRules: {},
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFoot: {
        button: []
      },
      /* SQL弹出框 */
      SDTitle: "",
      SDVisible: false,
      SDWidth: 700,
      SDAutosize: {
        minRows: 10,
        maxRows: 10
      },
      SDSql: "",
      SDSourceSql: [],
      SDFoot: [],
      // 差异SQL
      TableDigVisible: false,
      TableDigLoading: false,
      TableData: [],
      TableTitle: [],
      TableDigPage: {
        show: false,
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      TableDigFoot: {
        show: false,
        data: [
          {
            type: "button",
            classType: "primary",
            class: "",
            label: "确定"
          }
        ]
      },
      // 临时变量
      tableActive_: ""
    };
  },
  watch: {
    dbItme: function(newVal) {
      if (newVal) {
        this.getLog(newVal.id);
      }
    }
  },
  methods: {
    // 表格-回调
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
        console.log("删除");
      } else if (text === "close") {
        this.FDVisible = editItem.close;
        this.SDVisible = editItem.close;
        this.TableDigVisible = editItem.close;
        this.SDSql = "";
        this.SDSourceSql = [];
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null }) {
      switch (type) {
        case "设置数据源":
          {
            this.FDTitle = "设置数据源";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "数据源",
                  width: "120"
                },
                width: "200",
                key: "dataSourceId",
                defaultModel: initDig.dataSourceId || "",
                placeholder: "",
                option: []
              }
            ];
            this.FDRules = {
              dataSourceId: [
                { required: true, message: "请选择数据源", trigger: "change" }
              ]
            };
            if (initDig && JSON.stringify(initDig) !== "{}") {
              for (const key in initDig) {
                if (initDig.hasOwnProperty(key)) {
                  // TODO 优化
                  this.FDForm.forEach(item => {
                    item["key"] = key;
                    item["defaultModel"] = initDig[key];
                  });
                }
              }
            }
            this.getSourceList();
            this.$set(this.FDFoot, `button`, [
              {
                type: "button",
                label: "添加数据源",
                cb: () => {
                  this.FDVisible = false;
                  setTimeout(() => {
                    openUrl({
                      type: "open",
                      url: "/data-manage/"
                    });
                  }, 120);
                }
              },
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate(valid => {
                    if (valid) {
                      this.setSource(form);
                    }
                  });
                }
              }
            ]);
          }
          return;
        default:
          break;
      }
    },
    showSqlDialog({ type, initDig = null }) {
      switch (type) {
        case "生成建库SQL":
          {
            this.SDTitle = "生成建库SQL";
            this.SDVisible = true;
            this.creatDbSql();
            this.SDFoot = [
              {
                label: "导出",
                css: "",
                cb: (sql, sourceSql) => {
                  API.dbExportCreate({
                    syncInfoId: initDig.id
                  }).then(res => {
                    _ExportExcel(res.config.url + `?syncInfoId=${initDig.id}`);
                  });
                  this.SDVisible = false;
                }
              },
              {
                label: "同步库",
                css: "primary",
                cb: sql => {
                  this.syncDb();
                }
              }
            ];
          }
          return;
        case "生成差异SQL":
          {
            this.SDTitle = "生成差异SQL";
            this.SDVisible = true;
            this.generateDifferenceSql();
            this.SDFoot = [
              {
                label: "导出",
                css: "",
                cb: (sql, sourceSql) => {
                  API.dbExportDifference({
                    syncInfoId: initDig.id
                  }).then(res => {
                    _ExportExcel(res.config.url + `?syncInfoId=${initDig.id}`);
                  });
                  this.SDVisible = false;
                }
              },
              {
                label: "同步库",
                css: "primary",
                cb: sql => {
                  this.executeDifferenceSql();
                }
              }
            ];
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
      this.getList();
    },
    changePage_1({ pageSize, currentPage }) {
      this.$set(this.TPage_1, `index`, currentPage);
      this.$set(this.TPage_1, `size`, pageSize);
      if (this.dbItme && this.dbItme.id) {
        this.getLog(this.dbItme.id);
      }
    },
    // 单元格
    lickCell({ row, column, id }) {
      this.tableActive_ = row;
      const { dataSourceId } = row;
      switch (column.label) {
        case "设置数据源":
          {
            this.showDialog({
              type: column.label,
              initDig: {
                dataSourceId
              }
            });
          }
          return;
        case "生成建库SQL":
          {
            this.showSqlDialog({
              type: column.label,
              initDig: {
                id: row.id
              }
            });
          }
          return;
        case "差异对比":
          {
            this.TableDigVisible = true;
            this.dbDifferenceComparison();
          }
          return;
        case "生成差异SQL":
          {
            this.showSqlDialog({
              type: column.label,
              initDig: {
                id: row.id
              }
            });
          }
          return;
        case "同步字典表":
          {
            this.syncDictionValue(row);
          }
          return;
        default:
          break;
      }
    },
    // 点击行
    clickRow({ row, column, id }) {
      this.dbItme = row;
    },

    /* 请求 */
    // 获取所有项目列表
    getProjectList() {
      API._publicTree({
        level: 1
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0,
          error: "获取项目列表失败!"
        }).init();
        let projectArr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            projectArr.push({
              label: item.nodeName,
              value: item.projectId
            });
          });
        } else {
          projectArr = [];
        }
        this.proList = projectArr;
      });
    },
    // 获取
    getList() {
      this.TLoading = true;
      API.dbList({
        pageNo: this.TPage.index,
        pageSize: this.TPage.size,
        projectId: this.proVal
      })
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
              }
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize } = Res.formatData();
            this.tableTitle = title;
            this.tableData = data;
            this.$set(this.TPage, `total`, total);
            this.$set(this.TPage, `size`, pageSize);
            this.dbItme = data[0];
          } else {
            this.$set(this.TPage, `total`, total);
          }
        })
        .catch(error => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 获取维护日志
    getLog(syncInfoId) {
      this.TLoading_1 = true;
      API.dbLog({
        pageNo: this.TPage_1.index,
        pageSize: this.TPage_1.size,
        syncInfoId
      })
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
              }
            },
            "TLoading_1",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize } = Res.formatData();
            this.tableTitleBot = title;
            this.tableDataBot = data;
            this.$set(this.TPage_1, `total`, total);
            this.$set(this.TPage_1, `size`, pageSize);
          } else {
            this.$set(this.TPage_1, `total`, total);
          }
        })
        .catch(error => {
          this.TLoading_1 = false;
          console.error(error);
        });
    },
    // 获取数据源
    getSourceList() {
      API._publicDataSourceList().then(res => {
        let Res = new ResDatas({
          res,
          code: 200,
          error: "数据源列表获取失败"
        }).init();
        let sourceArr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            sourceArr.push({
              label: item.datasourceName,
              value: item.id
            });
          });
        }
        this.$set(this.FDForm[0], `option`, sourceArr);
      });
    },
    // 设置数据源
    setSource({ dataSourceId }) {
      API.dbSetSource({
        syncInfoId: this.tableActive_.id,
        dataSourceId
      }).then(res => {
        new ResDatas({
          res,
          code: 0
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 生成建库SQL
    creatDbSql() {
      API.dbCreateSql({
        syncInfoId: this.tableActive_.id
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if (Res && Res.length) {
          this.SDSourceSql = Res;
          Res.forEach(item => {
            this.SDSql += item;
          });
        }
      });
    },
    // 同步建库SQL
    syncDb() {
      const loading = this.$loading({
        lock: true,
        text: "正在执行同步操作...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      API.dbSyncSql({
        syncInfoId: this.tableActive_.id
      }).then(res => {
        loading.close();
        if (res.data && Number(res.data.code) === 0) {
          let Res = res.data.data;
          if (Res && Res.length) {
            this.SDSourceSql = Res;
            Res.forEach(item => {
              this.SDSql += item;
            });
          }
          this.$message({
            message: res.data.message,
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
        this.SDVisible = false;
      });
    },
    // 生成差异SQL
    generateDifferenceSql() {
      API.dbCreateDifferenceSql({
        syncInfoId: this.tableActive_.id
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if (Res && Res.length) {
          this.SDSourceSql = Res;
          Res.forEach(item => {
            this.SDSql += item;
          });
        }
      });
    },
    // 同步差异SQL
    executeDifferenceSql() {
      const loading = this.$loading({
        lock: true,
        text: "正在执行同步操作...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      API.dbSyncDifferenceSql({
        syncInfoId: this.tableActive_.id
      }).then(res => {
        loading.close();
        if (res.data && Number(res.data.code) === 0) {
          let Res = res.data.data;
          if (Res && Res.length) {
            this.SDSourceSql = Res;
            Res.forEach(item => {
              this.SDSql += item;
            });
          }
          this.$message({
            message: res.data.message,
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
        this.SDVisible = false;
      });
    },
    // 差异对比
    dbDifferenceComparison() {
      this.TableDigLoading = true;
      API.dbDifferenceComparison({
        syncInfoId: this.tableActive_.id
      }).then(res => {
        let Res = new ResDatas(
          {
            res,
            code: 0
          },
          "TableDigLoading",
          this
        ).init();
        if (Res) {
          const { data, title } = Res;
          if (data && data.length) {
            this.TableData = data;
          }
          if (title && title.length) {
            this.TableTitle = title;
          }
        } else {
          this.TableData = [];
        }
      });
    },
    // 同步字典表
    syncDictionValue(row) {
      API.dbSyncDictionValue({
        syncInfoId: row.id
      }).then(res => {
        new ResDatas({
          res,
          code: 0
        }).state();
      });
    }
  },
  mounted() {
    this.getProjectList();
    this.getList();
  }
};
</script>
 
<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.db-structure {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &-top {
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    // border: 1px solid red;
    flex: 1;
    overflow: auto;
    .area-query {
      float: right;
      margin: 0px 30px;
    }
    .area-table {
      margin-top: 40px;
      width: 100%;
      height: calc(100% - 40px);
      overflow: auto;
    }
  }
  &-mid {
    display: inline-block;
    height: 30px;
    width: 100%;
    box-sizing: border-box;
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
    height: 100px;
    box-sizing: border-box;
    // border: 1px solid red;
    flex: 1;
    overflow: auto;
    .bot-title {
      float: left;
      height: 32px;
      line-height: 30px;
      margin: 0px 30px;
      font-size: 15px;
      margin-top: 7px;
    }
    .bot-table {
      margin-top: 40px;
      width: 100%;
      height: calc(100% - 40px);
      overflow: auto;
    }
  }
}
</style>
