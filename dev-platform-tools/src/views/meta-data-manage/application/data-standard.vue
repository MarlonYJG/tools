<!--
 * @Author: Marlon
 * @Date: 2020-02-18 10:29:16
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-08 16:11:57
 * @Description: 数据标准匹配
 -->
<template>
  <div class="dt-standard">
    <div class="area-query">
      <label for>项目：</label>
      <el-select v-model="proVal" filterable placeholder="请选择" size="small" @change="dsMappingList">
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
      ></TableDefault>
    </div>
    <!-- 弹出框 -->
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
import { cellJump } from "@/utils/jump";
export default {
  mixins: [mixin],
  data() {
    return {
      // 项目名称
      proVal: "",
      proList: [],
      // 编辑-表格配置
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: ["projectName", "dbNameRemark", "dsName"]
        }
      ],
      TEdit: {
        show: true,
        title: "操作",
        width: "200",
        fixed: "right",
        editTypes: [
          {
            label: "匹配数据标准",
            css: "text"
          },
          {
            label: "查看匹配详情",
            css: "text"
          }
        ]
      },
      tableTitle: [
        { prop: "projectName", label: "所属项目" },
        { prop: "dbName", label: "库名" },
        { prop: "dbNameRemark", label: "中文名称" },
        { prop: "tableCount", label: "数据表个数" },
        { prop: "columnCount", label: "数据字段个数" },
        { prop: "dsName", label: "关联数据标准" },
        { prop: "dcCount", label: "数据集个数" },
        { prop: "dcAttrCount", label: "属性个数" },
        { prop: "mappingTime", label: "数据标准匹配时间" },
        { prop: "gmtCreate", label: "创建时间" }
      ],
      tableData: [],
      TPage: {
        index: 1,
        total: 0,
        size: 10
      },
      // 弹出框
      FDId: "1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFoot: {
        button: []
      },
      FDRules: {},
      // 数据标准列表
      standardList: [],
      // 临时变量
      tableActive_: ""
    };
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
        console.log("删除");
      } else if (text === "close") {
        this.FDVisible = editItem.close;
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null }) {
      switch (type) {
        case "匹配数据标准":
          this.FDTitle = "匹配数据标准";
          this.FDVisible = true;
          this.FDForm = [
            {
              type: "select",
              label: {
                name: "选择数据标准",
                width: "150"
              },
              width: "200",
              key: "dataStandardId",
              defaultModel: initDig.dsId,
              placeholder: "",
              option: this.standardList
            }
          ];
          this.FDRules = {
            dataStandardId: [
              { required: true, message: "请选择数据标准", trigger: "change" }
            ]
          };
          this.$set(this.FDFoot, `button`, [
            {
              type: "ok",
              label: "确定",
              cb: (form, $this) => {
                $this.$refs[this.FDId].validate(valid => {
                  if (valid) {
                    this.setDataStand(form);
                  }
                });
              }
            }
          ]);

          return;
        default:
          return;
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.dsMappingList();
    },
    // 单元格
    lickCell({ row, column, id }) {
      this.tableActive_ = row;
      // TODO
      const { dsId } = row;
      switch (column.label) {
        case "匹配数据标准":
          {
            this.showDialog({
              type: column.label,
              initDig: {
                dsId
              }
            });
          }
          return;
        case "查看匹配详情":
          {
            if (row.dsId) {
              cellJump(this, {
                row,
                column,
                TClickItem: [
                  {
                    link: "/other/dataDetails",
                    jump: {
                      type: "push",
                      mode: "int"
                    }
                  }
                ]
              });
            } else {
              this.$message({
                message: "请先配置数据集标准",
                type: "warning"
              });
            }
          }
          return;
        default:
          break;
      }
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
    // 数据标准列表
    getDataStand() {
      API._publicDataStandardList().then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let dataStand_ = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            dataStand_.push({
              label: item.versionName,
              value: item.id
            });
          });
        }
        this.standardList = dataStand_;
      });
    },
    // 获取
    dsMappingList() {
      this.TLoading = true;
      API.dsMappingList({
        projectId: this.proVal,
        pageNo: this.TPage.index,
        pageSize: this.TPage.size
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
          } else {
            this.$set(this.TPage, `total`, total);
          }
        })
        .catch(error => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 数据标准-修改
    setDataStand(req) {
      API.invokeDsMapping({
        dsMappingId: this.tableActive_.id,
        dataStandardId: req.dataStandardId
      }).then(res => {
        new ResDatas({
          res,
          code: 0
        }).state();
        this.FDVisible = false;
        this.dsMappingList();
      });
    }
  },
  mounted() {
    this.getDataStand();
    this.getProjectList();
    this.dsMappingList();
  }
};
</script>

<style lang="scss" scoped>
.dt-standard {
  width: 100%;
  height: 100%;
  .area {
    &-query {
      float: right;
      margin: 0px 30px;
    }
    &-table {
      margin-top: 40px;
      width: 100%;
      height: calc(100% - 40px);
      overflow: auto;
    }
  }
}
</style>