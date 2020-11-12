<!--
 * @Author: Marlon
 * @Date: 2020-03-24 09:44:39
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-23 10:20:53
 * @Description: 项目管理
 -->
<template>
  <div class="region-management">
    <div class="left">
      <el-button
        @click="treeEdit({node:null,data:null,type:1})"
        style="margin-bottom: 10px;width: 99%;"
      >新增</el-button>
      <el-tree
        ref="pro-tree"
        :highlight-current="true"
        :data="projectList"
        node-key="id"
        accordion
        @node-click="handleNodeClick"
        :current-node-key="currentKey"
      >
        <span slot-scope="{ node, data }" class="tree-slot">
          <el-tooltip
            v-if="node.label.length > 15"
            effect="dark"
            :content="node.label"
            placement="left"
          >
            <span class="tree-text">{{node.label}}</span>
          </el-tooltip>
          <span v-else class="tree-text">{{ node.label }}</span>
          <span v-if="data.id ===treeActivId" class="tree-edit">
            <el-popover placement="right" width="80" trigger="hover" popper-class="pro-tree-edit">
              <ul>
                <li @click="treeEdit({node,data,type:1})">添加子节点</li>
                <li @click="treeEdit({node,data,type:3})">区域对比</li>
                <li @click="treeEdit({node,data,type:8})">移动</li>
                <li @click="treeEdit({node,data,type:4})">导入数据库结构</li>
                <li @click="treeEdit({node,data,type:5})">导入代码集结构</li>
                <li @click="treeEdit({node,data,type:6})">导入excel</li>
                <li @click="treeEdit({node,data,type:7})">导出excel</li>
                <li @click="treeEdit({node,data,type:2})">删除</li>
              </ul>
              <el-button slot="reference" type="text" size="mini">操作</el-button>
            </el-popover>

            <!-- <el-cascader-panel
              v-model="activeHandle"
              class="handle-list"
              :options="handleOptions"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"
            ></el-cascader-panel>-->
          </span>
        </span>
      </el-tree>
    </div>
    <!-- 右侧区域 -->
    <div class="right">
      <p>当前项目：{{activeTree_.name }}</p>
      <el-tabs v-model="activeIndex">
        <el-tab-pane label="基本信息" name="1">
          <basic-information :proTree="projectList" :parId="activeTree_"></basic-information>
        </el-tab-pane>
        <el-tab-pane label="统计信息" name="2">
          <statistics-information :parId="activeTree_"></statistics-information>
        </el-tab-pane>
        <el-tab-pane label="变更历史" name="3">
          <change-history :parId="activeTree_"></change-history>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 弹出框-表单 -->
    <FormDialog
      :FDId="FDId"
      :FDVisible="FDVisible"
      :FDTitle="FDTitle"
      FDWidth="500"
      :FDForm="FDForm"
      :FDFoot="FDFoot"
      :FDRules="FDRules"
      @editBtnCb="editBtnCb"
      @FDUploadFiles="FDUploadFiles"
    ></FormDialog>
    <!-- 弹出框-solt -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="600"
      @editBtnCb="editBtnCb"
    >
      <ul slot="soltDigContent" class="down_class">
        <li v-for="(item,index) in fixedSectorDic" :key="index">
          <span>{{item.label}}</span>
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="exporExcel(item.value)"
          ></el-button>
        </li>
      </ul>
    </SoltDialog>
  </div>
</template>

<script>
import basicInformation from "./basic-information";
import statisticsInformation from "./statistics-information";
import changeHistory from "./change-history";

import SoltDialog from "@/components/dialog/solt-dialog";
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { _ExportExcel } from "utils/index";
import { BaseUrl } from "api/data-standard-manage";

export default {
  mixins: [mixin],
  components: {
    basicInformation,
    statisticsInformation,
    changeHistory,
    SoltDialog,
  },
  data() {
    return {
      // 树形项目列表
      currentKey: "",
      treeActivId: "",
      projectList: [],
      activeTree_: {
        id: "",
        name: "",
      },
      // 激活标签
      activeIndex: "2",
      // 弹出框
      FDId: "form_dialog_2",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFoot: {
        button: [],
      },
      FDRules: {},
      // 数据源
      dataSourceOptions: [],
      // 弹出框-导出
      SoltDigShow: false,
      SoltDigTitle: "导出Excel-业务板块",
      soltDFootBtn: [
        {
          label: "关闭",
          css: "primary",
          cb: ({ Item }) => {
            this.SoltDigShow = false;
          },
        },
      ],
      fixedSectorDic: [],
    };
  },
  methods: {
    // 上传
    FDUploadFiles({ type }) {
      if ("success" === type) {
         this.activeTree_["id"] = "";
        setTimeout(() => {
          this.activeTree_["id"] = this.treeActivId;
        }, 1000);
      }
    },
    // 项目列表-点击
    handleNodeClick(data) {
      this.treeActivId = data.value || data.id;
      this.activeTree_ = {
        id: data.id,
        name: data.label,
      };
    },
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.SoltDigShow = this.FDVisible = editItem.close;
      }
    },
    // 关闭全局DOM
    hideDom() {
      if (document.getElementsByClassName("pro-tree-edit").length) {
        document.getElementsByClassName("pro-tree-edit")[0].style =
          "display: none;";
      }
    },
    // 左侧树形编辑
    treeEdit({ type, node, data }) {
      console.log(data);
      this.hideDom();
      switch (type) {
        case 1:
          {
            this.FDTitle = "创建项目";
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
                type: "select-tree",
                label: {
                  name: "继承",
                  width: "120",
                },
                width: "280",
                key: "parentId",
                defaultModel: null,
                placeholder: "",
                option: this.projectList,
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
                label: "确 定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.addPro(form);
                    }
                  });
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        case 2:
          {
            if (data.children && data.children.length) {
              this.$message({
                message: "该节点下存在子节点，不可删除!",
                type: "warning",
              });
              return;
            }
            this.$confirm("此操作将永久删除, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                API.deleteArea({
                  areaId: data.id,
                })
                  .then((res) => {
                    let Res = new ResDatas({
                      res,
                      code: 0,
                    }).state();
                    this.getProList();
                  })
                  .catch((err) => {
                    this.getProList();
                  });
              })
              .catch((_) => {});
          }
          return;
        case 3:
          {
            this.FDTitle = "区域对比";
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "源地区",
                  width: "120",
                },
                key: "sourceAreaId",
                clearable: true,
                disabled: true,
                width: "280",
                defaultModel: data.label,
                placeholder: "",
              },
              {
                type: "select-tree",
                label: {
                  name: "目标地区",
                  width: "120",
                },
                width: "280",
                key: "targetAreaId",
                defaultModel: null,
                placeholder: "",
                option: this.projectList,
              },
            ];
            this.FDRules = {
              targetAreaId: [
                { required: true, message: "请输入目标地区", trigger: "blur" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确 定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.FDVisible = false;
                      _ExportExcel(
                        BaseUrl +
                          `/area/diffArea?sourceAreaId=${data.id}&targetAreaId=${form.targetAreaId}`
                      );
                    }
                  });
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        case 4:
          {
            this.FDTitle = "选择数据源";
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "数据源",
                  width: "120",
                },
                width: "280",
                key: "targetAreaId",
                defaultModel: "",
                placeholder: "",
                option: this.dataSourceOptions,
              },
            ];
            this.FDRules = {};
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确 定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.FDVisible = false;
                      this.importDataSource(data.id, form.targetAreaId);
                    }
                  });
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        case 5:
          {
            this.FDTitle = "导入代码集";
            this.FDForm = [
              {
                type: "upload",
                label: {
                  name: "",
                  width: "120",
                },
                width: "280",
                key: "importDataSet",
                url: API.uploadDataSet(),
                defaultModel: [],
                placeholder: "",
                importDataSet: [],
                data: {
                  areaId: data.id,
                },
              },
            ];
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "关 闭",
                cb: (form, $this) => {
                  this.FDVisible = false;
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        case 6:
          {
            this.FDTitle = "导入Excel";
            this.FDForm = [
              {
                type: "upload",
                label: {
                  name: "",
                  width: "120",
                },
                width: "280",
                key: "importExcel",
                url: API.uploadImportExcel(),
                defaultModel: [],
                placeholder: "",
                importExcel: [],
                data: {
                  areaId: data.id,
                },
              },
            ];
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "关 闭",
                cb: (form, $this) => {
                  this.FDVisible = false;
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        case 7:
          {
            this.getdbjdList();
            this.SoltDigShow = true;
          }
          return;
        case 8:
          {
            this.FDTitle = "移动位置";
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                key: "name",
                disabled: true,
                clearable: true,
                width: "280",
                defaultModel: data.info.name,
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
                disabled: true,
                width: "280",
                defaultModel: data.info.code,
                placeholder: "",
              },
              {
                type: "select-tree",
                label: {
                  name: "移动到",
                  width: "120",
                },
                width: "280",
                key: "parentId",
                defaultModel: null,
                placeholder: "",
                option: this.projectList,
              },
            ];
            this.FDRules = {};
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确 定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      let parentId_ = 0;
                      if (form.parentId) {
                        parentId_ = form.parentId;
                      }
                      this.removeArea({
                        ...data.info,
                        parentId: parentId_,
                      });
                    }
                  });
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        default:
          break;
      }
    },

    /* 请求 */
    // 获取项目列表树
    getProList() {
      API.getAreaList().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        let proTree = [];
        if (
          Res &&
          Res.data &&
          Res.data.children &&
          Res.data.children.children
        ) {
          proTree = Res.data.children.children;
          if (proTree.length) {
            this.activeTree_ = {
              id: proTree[0].id,
              name: proTree[0].label,
            };
            this.currentKey = proTree[0].id;
            this.$nextTick(() => {
              this.$refs["pro-tree"].setCurrentKey(proTree[0].id);
            });
          }
        } else {
          proTree = [];
        }
        this.projectList = proTree;
      });
    },
    // 获取数据源
    getDataSourceList() {
      API.getDataSource().then((res) => {
        let Res = new ResDatas({
          res,
        }).init();
        if (Res) {
          Res.forEach((item) => {
            item["label"] = item.datasourceName;
            item["value"] = item.id;
          });
          this.dataSourceOptions = Res;
        } else {
          this.dataSourceOptions = [];
        }
      });
    },
    // 新增项目
    addPro(req) {
      API.addArea(req)
        .then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).state();
          this.FDVisible = false;
          this.getProList();
        })
        .catch((err) => {
          this.FDVisible = false;
        });
    },
    // 导入数据源
    importDataSource(areaId, dataSourceId) {
      const loading = this.$loading({
        lock: true,
        text: "正在导入请稍等......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      API.importDatabaseStructure({
        dataSourceId,
        areaId,
      })
        .then((res) => {
          loading.close();
          let Res = new ResDatas({
            res,
            code: 0,
          }).state();
          this.getProList();
        })
        .catch((err) => {});
    },
    // 导出Excel 获取定板业务阶段列表
    getdbjdList() {
      if (this.activeTree_ && this.activeTree_.id) {
        API.searchSectorListDict({
          areaId: this.activeTree_.id,
        }).then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          let arr = [];
          if (Res) {
            Res.forEach((item) => {
              arr.push({
                label: item.name,
                value: item.id,
              });
            });
          }
          this.fixedSectorDic = arr;
        });
      }
    },
    // 导出
    exporExcel(id) {
      _ExportExcel(BaseUrl + "/area/exportExcel?sectorId=" + id);
    },
    // 移动位置
    removeArea(req) {
      this.FDVisible = false;
      API.updateAreaBasic(req).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getProList();
      });
    },
  },
  mounted() {
    this.getDataSourceList();
    this.getProList();
  },
};
</script>
<style lang="scss" scoped>
.region-management {
  width: 100%;
  height: 100%;
  /deep/ .vue-treeselect--single {
    .vue-treeselect__input {
      border: 0 !important;
    }
  }

  p.text {
    width: 100%;
    padding: 10px 0 0 0;
    box-sizing: border-box;
  }

  .left,
  .right {
    box-sizing: border-box;
    float: left;
    height: 100%;
    padding: 10px 0;
    & > p {
      height: 30px;
      line-height: 28px;
      font-size: 16px;
      font-weight: bolder;
    }
  }

  .left {
    width: 300px;
    border-right: 1px solid #eee;
    overflow: auto;
    .tree-slot {
      position: relative;
      width: 240px;
      height: 34px;
      line-height: 32px;
    }
    .tree-text {
      font-size: 14px;
      display: inline-block;
      width: 210px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tree-edit {
      position: absolute;
      right: 0;
    }
  }

  .right {
    width: calc(100% - 300px);
    padding: 5px;
    /deep/ .el-tabs__header {
      margin: 0;
    }
    /deep/ .el-tabs__content {
      height: calc(100% - 60px);
    }
  }
}
.down_class {
  overflow: auto;
  li {
    padding: 2px;
    text-align: left;
    span {
      display: inline-block;
      width: 150px;
      margin-right: 10px;
      text-align: left;
      // margin-right: 100px;
    }
  }
}
</style>