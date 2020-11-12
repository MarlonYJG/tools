<!--
 * @Author: Marlon
 * @Date: 2020-07-20 22:08:16
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-28 16:25:03
 * @Description: 数据集
--> 
<template>
  <div class="data-set">
    <div class="data-set-edit-area">
      <ul class="data-set-edit-area-btn">
        <li>
          <AddButton text="新增数据集" @click="showDialog" :clickArgs="{type:'新增数据集'}"></AddButton>
        </li>
      </ul>
      <ul class="data-set-edit-area-select">
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
          <el-select v-model="classifyVal" clearable filterable placeholder="请选择分类" size="small">
            <el-option
              v-for="item in classifyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </li>
        <li>
          <el-input
            placeholder="请输入属性集名称(编码)"
            v-model="dataSetVal"
            size="small"
            style="width: 195px;"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              style="cursor: pointer;"
              @click="getList"
            ></i>
          </el-input>
        </li>
      </ul>
    </div>
    <div class="data-set-table">
      <TableDefault
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
    <!-- 弹出框 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="500"
      @editBtnCb="editBtnCb"
    >
      <el-form slot="soltDigContent" :model="dataSetForm" :rules="rules" ref="form_1">
        <el-form-item label="项目：" :label-width="'100px'" prop="areaId">
          <el-select
            v-model="dataSetForm.areaId"
            placeholder="请选择项目"
            @change="handleChange('areaId',$event)"
          >
            <el-option v-for="item in proList" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务板块：" :label-width="'100px'" prop="businessSectorId">
          <el-select
            v-model="dataSetForm.businessSectorId"
            placeholder="请选择"
            @change="handleChange('businessSectorId',$event)"
          >
            <el-option
              v-for="item in businessSectorDic"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据集分类：" :label-width="'100px'" prop="businessStageId">
          <el-select v-model="dataSetForm.businessStageId" placeholder="请选择">
            <el-option
              v-for="item in dataClassifyDic"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据集名称：" :label-width="'100px'" prop="name">
          <el-input v-model="dataSetForm.name"></el-input>
        </el-form-item>
        <el-form-item label="数据集编码：" :label-width="'100px'" prop="code">
          <el-input v-model="dataSetForm.code"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="'100px'">
          <el-input type="textarea" v-model="dataSetForm.remark"></el-input>
        </el-form-item>
      </el-form>
    </SoltDialog>
  </div>
</template>

<script>
import mixin from "mixin";

import API from "api/index";
import { ResDatas } from "utils/res-format";
import SoltDialog from "@/components/dialog/solt-dialog";

export default {
  mixins: [mixin],
  components: { SoltDialog },
  data() {
    return {
      // 查询条件
      proVal: "",
      proList: [],
      classifyList: [],
      classifyVal: "",
      blockList: [],
      blockVal: "",
      dataSetVal: "",
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
            label: "复制",
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
        { label: "项目", prop: "areaName" },
        { label: "业务板块名称", prop: "sectorName" },
        { label: "数据集分类名称", prop: "stageName" },
        { label: "数据集编码", prop: "code" },
        { label: "数据集名称", prop: "name" },
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
          link: "/dataStandardManage/editManage/dataStandAttr",
          cells: ["countDataSetAttr"],
        },
      ],
      // 弹出框
      SoltDigShow: false,
      SoltDigTitle: "",
      soltDFootBtn: [],
      dataSetForm: {
        areaId: "",
        businessSectorId: "",
        businessStageId: "",
        name: "",
        code: "",
        remark: "",
      },
      rules: {
        areaId: [{ required: true, message: "请选择项目", trigger: "change" }],
        businessSectorId: [
          { required: true, message: "请选择业务板块", trigger: "change" },
        ],
        businessStageId: [
          { required: true, message: "请选择数据集分类", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入数据集名称", trigger: "blur" },
        ],
        code: [
          { required: true, message: "请输入数据集编码", trigger: "blur" },
        ],
      },
      businessSectorDic: [],
      dataClassifyDic: [],
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
      this.getList();
    },
    "dataSetForm.areaId": {
      handler(newVal) {
        if (newVal) {
          this.getSectorList({
            areaId: newVal,
            type: "dig",
          });
        }
      },
    },
    "dataSetForm.businessSectorId": {
      handler(newVal) {
        if (newVal) {
          this.getSortList({
            sectorId: newVal,
            type: "dig",
          });
        }
      },
    },
    SoltDigShow(newVal) {
      if (!newVal && this.$refs["form_1"]) {
        this.$refs["form_1"].resetFields();
      }
    },
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.SoltDigShow = editItem.close;
        this.dataSetForm = {
          areaId: "",
          businessSectorId: "",
          businessStageId: "",
          name: "",
          code: "",
          remark: "",
        };
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null, row = null }) {
      switch (type) {
        case "新增数据集":
          {
            this.SoltDigTitle = "新增数据集";
            this.$set(this.dataSetForm, `areaId`, this.proVal);
            this.$set(this.dataSetForm, `businessSectorId`, this.blockVal);
            this.$set(this.dataSetForm, `businessStageId`, this.classifyVal);
            this.SoltDigShow = true;
            this.soltDFootBtn = [
              {
                label: "确定",
                css: "primary",
                cb: ({ Item }) => {
                  this.$refs["form_1"].validate((valid) => {
                    if (valid) {
                      this.add();
                    }
                  });
                },
              },
            ];
          }
          return;
        case "编辑":
          {
            const {
              areaId,
              businessSectorId,
              businessStageId,
              name,
              code,
              remark,
            } = initDig;
            this.SoltDigTitle = "编辑数据集";
            this.dataSetForm = {
              areaId,
              businessSectorId,
              businessStageId,
              name,
              code,
              remark,
            };
            this.SoltDigShow = true;
            this.soltDFootBtn = [
              {
                label: "确定",
                css: "primary",
                cb: ({ Item }) => {
                  this.$refs["form_1"].validate((valid) => {
                    if (valid) {
                      this.update(row);
                    }
                  });
                },
              },
            ];
          }
          return;
        case "复制":
          {
            const {
              areaId,
              businessSectorId,
              businessStageId,
              name,
              code,
              remark,
            } = initDig;
            this.SoltDigTitle = "复制到";
            this.dataSetForm = {
              areaId,
              businessSectorId,
              businessStageId,
              name,
              code,
              remark,
            };
            this.SoltDigShow = true;
            this.soltDFootBtn = [
              {
                label: "确定",
                css: "primary",
                cb: ({ Item }) => {
                  this.$refs["form_1"].validate((valid) => {
                    if (valid) {
                      this.copy(row);
                    }
                  });
                },
              },
            ];
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
    // 单元格事件
    lickCell({ row, column, id }) {
      const {
        areaId,
        businessSectorId,
        businessStageId,
        name,
        code,
        remark,
      } = row;
      switch (column.label) {
        case "编辑":
          {
            this.showDialog({
              type: column.label,
              initDig: {
                id: row.id,
                areaId,
                businessSectorId,
                businessStageId,
                name,
                code,
                remark,
              },
              row,
            });
          }
          return;
        case "复制":
          {
            this.showDialog({
              type: column.label,
              initDig: {
                id: row.id,
                areaId,
                businessSectorId,
                businessStageId,
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
      } else {
        this.classifyVal = "";
        this.classifyList = [];
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
    // 下拉初始化值
    handleChange(type, value) {
      switch (type) {
        case "areaId":
          {
            this.$set(this.dataSetForm, `businessSectorId`, "");
            this.$set(this.dataSetForm, `businessStageId`, "");
            this.businessSectorDic = [];
            this.dataClassifyDic = [];
          }
          return;
        case "businessSectorId":
          {
            this.$set(this.dataSetForm, `businessStageId`, "");
            this.dataClassifyDic = [];
          }
          return;
        default:
          break;
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
            Res.forEach((item) => {
              item["label"] = item.name;
              item["value"] = item.id;
            });
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
            Res.forEach((item) => {
              item["label"] = item.name;
              item["value"] = item.id;
            });
            this.dataClassifyDic = Res;
          } else {
            this.classifyList = Res;
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
    // 获取
    getList() {
      //   this.tableData = [];
      this.TLoading = true;
      API.getDataSetList({
        areaId: this.proVal,
        businessSectorId: this.blockVal,
        businessStageId: this.classifyVal,
        pageNum: this.TPage.index,
        pageSize: this.TPage.size,
        likeStr: this.dataSetVal,
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
            if (data && data.length) {
              data.forEach((item) => {
                item["jumpName"] = "数据集";
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
    add() {
      this.SoltDigShow = false;
      const {
        areaId,
        businessSectorId,
        businessStageId,
        name,
        code,
        remark,
      } = this.dataSetForm;
      API.addDataSet({
        areaId,
        businessSectorId,
        businessStageId,
        name,
        code,
        remark,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    del(id) {
      API.deleteDataSet({ dataSetId: id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    update(row) {
      this.SoltDigShow = false;
      API.updataDataSet({
        ...this.dataSetForm,
        id: row.id,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 复制到
    copy(row) {
      this.SoltDigShow = false;
      API.copyDataSet({ ...this.dataSetForm, id: row.id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      const { name } = JSON.parse(this.$route.query.column);
      const { areaId, id, businessSectorId = "" } = JSON.parse(
        this.$route.query.row
      );
      if ("项目管理" === name) {
        this.proVal = areaId;
      } else if (businessSectorId) {
        // 分类集分类
        this.proVal = areaId;
        this.blockVal = businessSectorId;
        this.classifyVal = id;
      } else {
        // 业务板块
        this.proVal = areaId;
        this.blockVal = id;
      }
    } else {
    }
    this.getProList({ init: true });
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.data-set {
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