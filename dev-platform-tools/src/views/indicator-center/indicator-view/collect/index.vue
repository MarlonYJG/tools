<!--
 * @Author: Marlon
 * @Date: 2020-06-09 09:36:39
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-09 08:22:37
 * @Description: 我的收藏
--> 
<template>
  <div class="i-v-c">
    <el-tabs v-model="activeName">
      <el-tab-pane label="已收藏派生指标" name="1">
        <div class="i-v-c-edit-area">
          <ul class="i-v-c-edit-area-btn">
            <li>
              <el-button @click="qxsc(1)">取消收藏</el-button>
            </li>
            <li>
              <el-button @click="jumpMap">指标地图</el-button>
            </li>
          </ul>
          <ul class="i-v-c-edit-area-select">
            <li>
              <label for>选择项目：</label>
              <el-select
                v-model="tmSelectVal"
                filterable
                placeholder="--请选择--"
                size="small"
                clearable
                @change="changeclear(1)"
              >
                <el-option
                  v-for="(item,i) in tmSelectOpt"
                  :key="i"
                  :label="item.projectName"
                  :value="item.projectId"
                ></el-option>
              </el-select>
            </li>
            <li>
              <label for>业务板块：</label>
              <el-select
                v-model="tSelectVal"
                filterable
                placeholder="--请选择--"
                size="small"
                clearable
                @change="changeclear(2)"
              >
                <el-option
                  v-for="(item,i) in tywSelectOpt"
                  :key="i"
                  :label="item.businessSegmentName"
                  :value="item.businessSegmentId"
                ></el-option>
              </el-select>
            </li>
            <li>
              <label for>数据域：</label>
              <el-select
                v-model="tjSelectVal"
                clearable
                filterable
                placeholder="--请选择--"
                size="small"
              >
                <el-option
                  v-for="(item,i) in tjSelectOpt"
                  :key="i"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </li>
            <li>
              <el-input placeholder="请输入派生指标名称" v-model="inputVal" size="medium">
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="DSMCList"
                  style="cursor: pointer;"
                ></i>
              </el-input>
            </li>
          </ul>
        </div>
        <div class="i-v-c-table">
          <TableDefault
            :TLoading="TLoading"
            :TTitle="tableTitle"
            :TData="tableData"
            :TIsShowPage="true"
            :TIsShowCheckBox="true"
            :TTotal="TPage.total"
            :TCurrentPage="TPage.index"
            :TPageSize="TPage.size"
            :TEdit="TEdit"
            :TAlign="TAlign"
            @clickCell="lickCell"
            @changePage="changePage"
            @handleSelectionChange="handleSelectionChange"
          ></TableDefault>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { isPositiveInt, checkip } from "utils";
import { cellJump } from "utils/jump";
export default {
  mixins: [mixin],
  data() {
    return {
      activeName: "1",
      // 所选项目下拉选择
      tmSelectVal: "",
      tmSelectOpt: [],
      // 业务板块下拉选择
      tSelectVal: "",
      tywSelectOpt: [],
      // 数据域分类
      tjSelectVal: "",
      tjSelectOpt: [],
      // 编辑-表格配置
      TLoading: false,
      TEdit: {
        show: true,
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "查看值",
            css: "text",
          },
          {
            label: "取消收藏",
            css: "text",
          },
        ],
      },
      TAlign: [
        {
          key: "left",
          item: [],
        },
      ],
      tableTitle: [{ prop: "deriveIndicatorName", label: "派生指标名称" }],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      // 多选
      checkBoxArr: [],
      // 输入要查询的值
      inputVal: "",
    };
  },
  watch: {
    tmSelectVal(newVal) {
      if (newVal) {
        this.getPlateList_bos(newVal);
      }
      this.DSMCList();
    },
    tSelectVal(newVal) {
      if (newVal) {
        this.classification_bos(newVal);
      }
      this.DSMCList();
    },
    tjSelectVal() {
      this.DSMCList();
    },
  },
  methods: {
    changeclear(type) {
      switch (type) {
        case 1:
          {
            this.tSelectVal = "";
            this.tjSelectVal = "";
            this.tywSelectOpt = [];
            this.tjSelectOpt = [];
          }
          return;
        case 2:
          {
            this.tjSelectVal = "";
            this.tjSelectOpt = [];
          }
          return;
        default:
          break;
      }
    },
    // 指标地图
    jumpMap() {
      cellJump(this, {
        TClickItem: [
          {
            link: "/indicator/view/map",
            jump: {
              type: "push",
              mode: "int",
            },
          },
        ],
      });
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.DSMCList();
    },
    // 取消收藏
    qxsc(type, row) {
      if (1 === type && !this.checkBoxArr.length) {
        this.$message({
          message: "请选择要取消收藏的指标",
          type: "warning",
        });
        return;
      }
      this.$confirm(
        `是否取消收藏该派生指标，一旦取消就无法快速查询。`,
        "提示",
        {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning",
        }
      )
        .then(() => {
          if (1 === type) {
            let deriveIndicatorId = [];
            this.checkBoxArr.forEach((item) => {
              deriveIndicatorId.push(item.deriveIndicatorId);
            });
            this.cancelColect(deriveIndicatorId);
          } else if (2 === type) {
            // 单行
            this.cancelColect([row.deriveIndicatorId]);
          }
        })
        .catch(() => {});
    },
    // 多选
    handleSelectionChange(key, val) {
      if ("checkbox" === key) {
        this.checkBoxArr = val;
      }
    },
    lickCell({ row, column, id }) {
      const { deriveIndicatorName, deriveIndicatorId } = row;
      switch (column.label) {
        case "查看值":
          {
            cellJump(this, {
              row: {
                name: deriveIndicatorName,
                id: deriveIndicatorId,
              },
              TClickItem: [
                {
                  link: "/indicator/view/mapDetails",
                  jump: {
                    type: "push",
                    mode: "int",
                  },
                },
              ],
            });
          }
          return;
        case "取消收藏":
          {
            this.qxsc(2, row);
          }
          return;

        default:
          break;
      }
    },

    /* 请求 */
    // 获取所选项目下拉列表-接口请求
    getAreaList_bos() {
      API.getAreaList()
        .then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          if (Res) {
            this.tmSelectOpt = Res;
          } else {
            this.tmSelectOpt = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取业务板块下拉列表-接口请求
    getPlateList_bos(id) {
      API.getPlateList_classify({
        projectId: id,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          console.log(Res);
          this.tywSelectOpt = Res;
        } else {
          this.tywSelectOpt = [];
        }
      });
    },
    // 获取数据域下拉列表-接口请求
    classification_bos(id) {
      API.dataMany_send(id).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          this.tjSelectOpt = Res;
        } else {
          this.tjSelectOpt = [];
        }
      });
    },
    // 查询数据源列表
    DSMCList() {
      this.TLoading = true;
      API.indicatorCollectList({
        projectId: this.tmSelectVal,
        businessSegmentId: this.tSelectVal,
        dataDomainId: this.tjSelectVal,
        deriveIndicatorName: this.inputVal,
        pageNo: this.TPage.index,
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
            const { data, total, index, pageSize, title } = Res.formatData();
            this.tableData = data;
            this.tableTitle = title;
            this.TPage = {
              total,
              index,
              size: pageSize,
            };
          } else {
            this.TPage = {
              total: 10,
              index: 1,
              size: 10,
            };
          }
        })
        .catch((err) => {
          this.TLoading = false;
        });
    },
    // 取消收藏
    cancelColect(checkBoxArr) {
      if (checkBoxArr) {
        API.indicatorCollectCancel({ deriveIndicatorIds: checkBoxArr }).then(
          (res) => {
            let Res = new ResDatas({
              res,
              code: 0,
            }).state();
            this.DSMCList();
          }
        );
      }
    },
  },
  mounted() {
    this.DSMCList();
    this.getAreaList_bos();
  },
};
</script>

<style lang="scss" scoped>
.i-v-c {
  height: 100%;
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
