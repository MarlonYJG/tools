<!--
 * @Author: Marlon
 * @Date: 2020-04-26 14:57:55
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-12 14:26:09
 * @Description: ETL-任务列表
 -->
<template>
  <div class="task-list">
    <div class="task-list-edit-area">
      <ul class="task-list-edit-area-btn">
        <li>
          <AddButton text="新增任务" @click="showDialog" :clickArgs="{type:'新增任务'}"></AddButton>
        </li>
      </ul>
      <ul class="task-list-edit-area-select">
        <li>
          <label for>项目：</label>
          <el-select v-model="proVal" filterable placeholder="请选择" size="small" @change="getList">
            <el-option
              v-for="item in proOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <div class="task-list-table">
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
      :FDFootInfo="FDFootInfo"
      :FDRules="FDRules"
      @editBtnCb="editBtnCb"
      @FDhandlerSelect="FDhandlerSelect"
      @FDUploadFiles="FDUploadFiles"
    ></FormDialog>
    <!-- 导入(隐藏域) -->
    <el-upload
      v-show="false"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-success="handleSuccess"
      :on-error="handleError"
      multiple
      :file-list="fileList"
    >
      <el-button size="small" type="primary" id="importFile">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { openUrl, cellJump } from "utils/jump";
import { _ExportExcel, _DownLoadExcelGet } from "utils";

export default {
  mixins: [mixin],
  data() {
    return {
      // 导入
      fileList: [],
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: [
            "projectName",
            "code",
            "name",
            "sourceDataSourceName",
            "targetDataSourceName",
            "remark",
          ],
        },
      ],
      TEdit: {
        show: true,
        slot: true,
        type: "popover",
        title: "操作",
        width: 280,
        fixed: "right",
        editTypes: [
          {
            label: "编辑转换",
            css: "success",
          },
          {
            label: "执行",
            css: "warning",
          },
          {
            label: "查看结果",
            css: "warning",
          },
          {
            label: "其他",
            css: "warning",
            select: [
              {
                label: "编辑",
                css: "warning",
              },
              {
                label: "同步标准清洗规则",
                css: "danger",
              },
              {
                label: "删除",
                css: "danger",
                pass: true,
              },
              {
                label: "复制",
                css: "danger",
              },
              {
                label: "导入",
                css: "danger",
              },
              {
                label: "导出",
                css: "danger",
              },
              {
                label: "导出配置清单",
                css: "danger",
              },
              {
                label: "对比配置",
                css: "danger",
              },
            ],
          },
        ],
      },
      tableTitle: [
        { prop: "projectName", label: "项目" },
        { prop: "code", label: "编码" },
        { prop: "name", label: "名称" },
        { prop: "typeName", label: "类型" },
        { prop: "sourceDataSourceName", label: "数据来源" },
        { prop: "targetDataSourceName", label: "数据去向" },
        { prop: "remark", label: "备注" },
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      activeRow_: "",
      // 弹出框
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFootInfo: "",
      FDFoot: {
        button: [],
      },
      FDRules: {},
      // 项目列表
      proOption: [],
      proVal: "",
      // 数据源
      sourceData: [],
      // 获取上传文件之后的临时地址
      uploadFilesUrl_: [],
      // 数据标准
      sourceOption: [],
    };
  },
  watch: {
    proVal: function (newVal) {
      if (newVal == 0 || !!newVal) {
        this.getList();
      }
    },
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
      } else if (text === "close") {
        this.FDVisible = editItem.close;
        this.uploadFilesUrl_ = [];
        this.FDForm = [];
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null }) {
      switch (type) {
        case "编辑":
          {
            this.FDTitle = "编辑任务";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "选择项目",
                  width: "120",
                },
                width: "200",
                key: "projectId",
                defaultModel: "",
                placeholder: "",
                option: this.proOption,
              },
              {
                type: "input",
                label: {
                  name: "编码",
                  width: "120",
                },
                width: "280",
                key: "code",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                width: "280",
                key: "name",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "类型",
                  width: "120",
                },
                width: "200",
                key: "type",
                defaultModel: 1,
                placeholder: "",
                option: [
                  {
                    label: "转换",
                    value: 1,
                  },
                  { label: "kettle任务", value: 2 },
                ],
              },
              {
                type: "select",
                show: (() => {
                  if (initDig.type === 1) {
                    return false;
                  }
                  return true;
                })(),
                label: {
                  name: "数据来源",
                  width: "120",
                },
                width: "200",
                key: "sourceDataSourceId",
                defaultModel: "",
                placeholder: "",
                option: this.sourceData,
              },
              {
                type: "select",
                show: (() => {
                  if (initDig.type === 1) {
                    return false;
                  }
                  return true;
                })(),
                label: {
                  name: "数据去向",
                  width: "120",
                },
                width: "200",
                key: "targetDataSourceId",
                defaultModel: "",
                placeholder: "",
                option: this.sourceData,
              },
              {
                type: "switch",
                show: (() => {
                  if (initDig.type === 1) {
                    return false;
                  }
                  return true;
                })(),
                label: {
                  name: "是否增量",
                  width: "120",
                },
                width: "200",
                key: "incrFlag",
                defaultModel: !!initDig.incrFlag,
                placeholder: "",
                off: {
                  label: "全量",
                },
                on: {
                  label: "增量",
                  color: "#13ce66",
                },
              },
              {
                type: "switch",
                show: (() => {
                  if (initDig.type === 1) {
                    return false;
                  }
                  return true;
                })(),
                label: {
                  name: "是否删除",
                  width: "120",
                },
                width: "200",
                key: "truncateFlag",
                defaultModel: !!initDig.truncateFlag,
                placeholder: "",
                off: {
                  label: "不删除",
                },
                on: {
                  label: "删除",
                  color: "#13ce66",
                },
              },
              {
                type: "upload",
                show: (() => {
                  if (initDig.type === 1) {
                    return true;
                  }
                  return false;
                })(),
                label: {
                  name: "ktr文件",
                  width: "120",
                },
                width: "280",
                key: "kettleFileUrl",
                url: API.uploadKtr(),
                defaultModel: [],
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "120",
                },
                width: "280",
                key: "remark",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.FDRules = {
              projectId: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
              code: [
                { required: true, message: "请输入编码", trigger: "blur" },
              ],
              name: [
                { required: true, message: "请输入名称", trigger: "blur" },
              ],
              type: [
                { required: true, message: "请选择类型", trigger: "change" },
              ],
            };
            if (initDig && JSON.stringify(initDig) !== "{}") {
              for (const key in initDig) {
                if (initDig.hasOwnProperty(key)) {
                  // TODO 优化
                  this.FDForm.forEach((item) => {
                    if (key === item.key) {
                      item["key"] = key;
                      if (key === "kettleFileUrl") {
                        let defaultArr = [];
                        initDig[key].forEach((item_) => {
                          let flag_ = item_.split("\\");
                          defaultArr.push({
                            name: flag_[flag_.length - 1],
                            url: item_,
                          });
                        });
                        item["defaultModel"] = defaultArr;
                      } else {
                        item["key"] = key;
                        item["defaultModel"] = initDig[key];
                      }
                    }
                  });
                }
              }
            }
            if (initDig.type === 1) {
              this.$set(this.FDFoot, `button`, [
                {
                  type: "button",
                  label: "添加数据源",
                  cb: () => {
                    this.FDVisible = false;
                    setTimeout(() => {
                      openUrl({
                        type: "open",
                        url: "/data-manage/#/dataSource/list",
                      });
                    }, 200);
                  },
                },
                {
                  type: "ok",
                  label: "确定",
                  cb: (form, $this) => {
                    $this.$refs[this.FDId].validate((valid) => {
                      if (valid) {
                        if (form.type === 1) {
                          if (
                            form.sourceDataSourceId &&
                            form.targetDataSourceId
                          ) {
                            this.upDate(form, 1);
                          } else {
                            this.$message({
                              message: "请选择数据来源和数据去向",
                              type: "warning",
                            });
                          }
                        } else if (form.type === 2) {
                          if (this.uploadFilesUrl_.length) {
                            this.upDate(form, 2);
                          } else {
                            this.$message({
                              message: "请选择并上传Ktr文件",
                              type: "warning",
                            });
                          }
                        }
                      }
                    });
                  },
                },
              ]);
            } else if (initDig.type === 2) {
              this.$set(this.FDFoot, `button`, [
                {
                  type: "ok",
                  label: "确定",
                  cb: (form, $this) => {
                    $this.$refs[this.FDId].validate((valid) => {
                      if (valid) {
                        if (form.type === 1) {
                          if (
                            form.sourceDataSourceId &&
                            form.targetDataSourceId
                          ) {
                            this.upDate(form, 1);
                          } else {
                            this.$message({
                              message: "请选择数据来源和数据去向",
                              type: "warning",
                            });
                          }
                        } else if (form.type === 2) {
                          if (this.uploadFilesUrl_.length) {
                            this.upDate(form, 2);
                          } else {
                            this.$message({
                              message: "请选择并上传Ktr文件",
                              type: "warning",
                            });
                          }
                        }
                      }
                    });
                  },
                },
              ]);
            }
          }
          return;
        case "同步标准清洗规则":
          {
            this.FDTitle = "同步数据标准清洗规则";
            this.FDVisible = true;
            this.FDFootInfo =
              "说明：根据数据标准和元数据匹配情况，同步相应数据集的清洗规则。";
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "选择数据标准",
                  width: "160",
                },
                width: "200",
                key: "standardsId",
                defaultModel: "",
                placeholder: "",
                option: this.sourceOption,
              },
              {
                type: "select",
                label: {
                  name: "选择元数据库",
                  width: "160",
                },
                width: "200",
                key: "metaDataId",
                defaultModel: "",
                placeholder: "",
                option: [],
              },
            ];
            this.FDRules = {
              standardsId: [
                {
                  required: true,
                  message: "请选择数据标准",
                  trigger: "change",
                },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.syncInfo(form);
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "新增任务":
          {
            this.FDTitle = "新增任务";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "选择项目",
                  width: "120",
                },
                width: "200",
                key: "projectId",
                defaultModel: this.proVal,
                placeholder: "",
                option: this.proOption,
              },
              {
                type: "input",
                label: {
                  name: "编码",
                  width: "120",
                },
                width: "280",
                key: "code",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                width: "280",
                key: "name",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "类型",
                  width: "120",
                },
                width: "200",
                key: "type",
                defaultModel: 1,
                placeholder: "",
                option: [
                  {
                    label: "转换",
                    value: 1,
                  },
                  { label: "kettle任务", value: 2 },
                ],
              },
              {
                type: "select",
                show: false,
                label: {
                  name: "数据来源",
                  width: "120",
                },
                width: "200",
                key: "sourceDataSourceId",
                defaultModel: "",
                placeholder: "",
                option: this.sourceData,
              },
              {
                type: "select",
                show: false,
                label: {
                  name: "数据去向",
                  width: "120",
                },
                width: "200",
                key: "targetDataSourceId",
                defaultModel: "",
                placeholder: "",
                option: this.sourceData,
              },
              {
                type: "switch",
                show: false,
                label: {
                  name: "是否增量",
                  width: "120",
                },
                width: "200",
                key: "incrFlag",
                defaultModel: false,
                placeholder: "",
                off: {
                  label: "全量",
                },
                on: {
                  label: "增量",
                  color: "#13ce66",
                },
              },
              {
                type: "switch",
                show: false,
                label: {
                  name: "是否删除",
                  width: "120",
                },
                width: "200",
                key: "truncateFlag",
                defaultModel: false,
                placeholder: "",
                off: {
                  label: "不删除",
                },
                on: {
                  label: "删除",
                  color: "#13ce66",
                },
              },
              {
                type: "upload",
                show: true,
                label: {
                  name: "ktr文件",
                  width: "120",
                },
                width: "280",
                key: "kettleFileUrl",
                url: API.uploadKtr(),
                defaultModel: [],
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "120",
                },
                width: "280",
                key: "remark",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.FDRules = {
              projectId: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
              code: [
                { required: true, message: "请输入编码", trigger: "blur" },
              ],
              name: [
                { required: true, message: "请输入名称", trigger: "blur" },
              ],
              type: [
                { required: true, message: "请选择类型", trigger: "change" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "button",
                label: "添加数据源",
                cb: () => {
                  this.FDVisible = false;
                  setTimeout(() => {
                    openUrl({
                      type: "open",
                      url: "/data-manage/#/dataSource/list",
                    });
                  }, 200);
                },
              },
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      if (form.type === 1) {
                        if (
                          form.sourceDataSourceId &&
                          form.targetDataSourceId
                        ) {
                          this.add(form, 1);
                        } else {
                          this.$message({
                            message: "请选择数据来源和数据去向",
                            type: "warning",
                          });
                        }
                      } else if (form.type === 2) {
                        console.log(form, "添加2");
                        if (this.uploadFilesUrl_.length) {
                          this.add(form, 2);
                        } else {
                          this.$message({
                            message: "请选择并上传Ktr文件",
                            type: "warning",
                          });
                        }
                      }
                    }
                  });
                },
              },
            ]);
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
      this.activeRow_ = row;
      const {
        code,
        incrFlag = 0,
        kettleFileUrl = "",
        name,
        projectId = "",
        remark,
        sourceDataSourceId,
        targetDataSourceId,
        truncateFlag = 0,
        type,
      } = row;
      switch (column.label) {
        case "编辑转换": {
          cellJump(this, {
            row,
            column,
            TClickItem: [
              {
                link: "/etl/manage/config",
                jump: {
                  type: "int",
                  mode: "push",
                },
              },
            ],
          });
          return;
        }
        case "删除": {
          this.$confirm(`即将删除“${name}”任务, 是否继续?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.del({ id: row.id });
            })
            .catch(() => {});
          return;
        }
        case "查看结果": {
          cellJump(this, {
            row,
            column,
            TClickItem: [
              {
                link: "/etl/list/resultsList",
                jump: {
                  type: "int",
                  mode: "push",
                },
              },
            ],
          });
          return;
        }
        case "执行": {
          this.runTask({ taskId: this.activeRow_.id });
          return;
        }
        case "编辑": {
          let _kettleFileUrl = [];
          if (kettleFileUrl) {
            _kettleFileUrl = kettleFileUrl.split(";");
          }
          this.uploadFilesUrl_ = _kettleFileUrl;
          this.popoverHide();
          this.showDialog({
            type: column.label,
            initDig: {
              projectId,
              code,
              name,
              type,
              sourceDataSourceId,
              targetDataSourceId,
              incrFlag: !!incrFlag,
              truncateFlag: !!truncateFlag,
              kettleFileUrl: _kettleFileUrl,
              remark,
            },
          });
          return;
        }
        case "同步标准清洗规则": {
          this.popoverHide();
          this.showDialog({
            type: column.label,
          });
          return;
        }
        case "复制": {
          this.popoverHide();
          this.copy(row);
          return;
        }
        case "导入": {
          this.popoverHide();
          document.getElementById("importFile").click();
          return;
        }
        case "导出":
          {
            this.popoverHide();
            // TODO
          }
          return;
        case "导出配置清单": {
          this.popoverHide();
          this.exportFn(row);
          return;
        }
        case "对比配置":
          {
            this.popoverHide();
            this.FDTitle = "导出对比配置";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "源任务",
                  width: "120",
                },
                width: "280",
                disabled: true,
                key: "sourceTaskId",
                defaultModel: name,
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "项目",
                  width: "120",
                },
                width: "200",
                key: "PidDiffCompared",
                defaultModel: projectId,
                placeholder: "",
                option: this.proOption,
              },
              {
                type: "select",
                label: {
                  name: "目标任务",
                  width: "120",
                },
                width: "200",
                key: "targetTaskId",
                defaultModel: "",
                placeholder: "",
                option: [],
              },
            ];
            this.getTaskList(projectId);
            this.FDRules = {
              PidDiffCompared: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
              targetTaskId: [
                {
                  required: true,
                  message: "请选择目标任务",
                  trigger: "change",
                },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.FDVisible = false;
                      this.exportDiffCompared({
                        sourceTaskId: row.id,
                        targetTaskId: form.targetTaskId,
                      });
                    }
                  });
                },
              },
            ]);
          }
          return;
        default:
          break;
      }
    },
    // popover隐藏
    popoverHide() {
      let popoverArr = document.getElementsByClassName(
        "table_custom_edit_popover"
      );
      if (popoverArr && popoverArr.length) {
        for (let index = 0; index < popoverArr.length; index++) {
          popoverArr[index].style.cssText = "display: none;";
        }
      }
    },
    // 下拉关联-回调
    FDhandlerSelect({ item, form, val }) {
      if (item.key === "type") {
        this.$set(this.FDForm[3], `defaultModel`, form[item.key]);
        if (this.FDForm.length) {
          this.FDForm.forEach((item_, index) => {
            for (const key in form) {
              if (form.hasOwnProperty(key)) {
                if (item_.key === key) {
                  // TODO 添加初始化状态，根据特定的key
                  this.$set(this.FDForm[index], `defaultModel`, form[key]);
                }
              }
            }
          });
        }
        if (form[item.key] === 1) {
          this.$set(this.FDForm[4], `show`, false);
          this.$set(this.FDForm[5], `show`, false);
          this.$set(this.FDForm[6], `show`, false);
          this.$set(this.FDForm[7], `show`, false);
          this.$set(this.FDForm[8], `show`, true);
          this.FDFoot.button.splice(0, 0, {
            type: "button",
            label: "添加数据源",
            cb: () => {
              this.FDVisible = false;
              setTimeout(() => {
                openUrl({
                  type: "open",
                  url: "/data-manage/#/dataSource/list",
                });
              }, 200);
            },
          });
        } else if (form[item.key] === 2) {
          this.$set(this.FDForm[4], `show`, true);
          this.$set(this.FDForm[5], `show`, true);
          this.$set(this.FDForm[6], `show`, true);
          this.$set(this.FDForm[7], `show`, true);
          this.$set(this.FDForm[8], `show`, false);
          if (this.FDFoot.button.length >= 2) {
            this.FDFoot.button.splice(0, 1);
          }
        }
      } else if (item.key === "standardsId") {
        let arr_ = [];
        this.$set(this.FDForm[0], `defaultModel`, val);
        this.sourceOption.forEach((ele) => {
          if (ele.id === val) {
            if (ele.children && ele.children.length) {
              ele.children.forEach((element) => {
                arr_.push({
                  label: element.label,
                  value: element.id,
                });
              });
            }
          }
        });
        this.$set(this.FDForm[1], `option`, arr_);
      } else if (item.key === "PidDiffCompared") {
        if (this.FDForm.length) {
          this.FDForm.forEach((item_, index) => {
            for (const key in form) {
              if (form.hasOwnProperty(key)) {
                if (item_.key === key) {
                  // TODO 添加初始化状态，根据特定的key
                  this.$set(this.FDForm[index], `defaultModel`, form[key]);
                }
              }
            }
          });
        }
        this.getTaskList(val);
      }
    },
    // 文件上传回调
    FDUploadFiles({
      type,
      file,
      response = null,
      err = null,
      fileList = null,
    }) {
      switch (type) {
        case "success":
          {
            this.uploadFilesUrl_.push(response.data.kettleFileUrl);
          }
          return;
        case "error":
          {
            this.$message.error("上传失败");
            console.error(err);
          }
          return;
        default:
          break;
      }
    },

    /* 请求 */
    // 获取数据源
    getSourceData() {
      API._publicSourceData().then((res) => {
        let Res = new ResDatas({
          res,
        }).init();
        if (Res && Res.length) {
          Res.forEach((item) => {
            this.sourceData.push({
              ...item,
              label: item.datasourceName,
              value: item.id,
            });
          });
        }
      });
    },
    // 获取数据标准列表
    getDataStandard() {
      API._publicStandardsData().then((res) => {
        let Res = new ResDatas({
          res,
        }).init();
        let dcAtt_ = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            dcAtt_.push({
              ...item,
              label: item.label,
              value: item.id,
            });
          });
        }
        this.sourceOption = dcAtt_;
      });
    },
    // 获取元数据库列表
    getMetaDb() {
      // TODO
      // API._publicMetaData().then(res => {
      //   console.log(res);
      // });
    },
    // 项目列表
    getProjectList({ init }) {
      API._publicProject().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        let proArr = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            proArr.push({
              label: item.name,
              value: item.id,
            });
          });
          if (init) {
            this.proVal = proArr[0].value;
          }
        }
        this.proOption = proArr;
      });
    },
    // 获取 任务列表
    getTaskList(projectId) {
      API._publicTask({ projectId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        let taskArr = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            taskArr.push({
              ...item,
              label: item.name,
              value: item.id,
            });
          });
        }
        if (taskArr.length) {
          this.$set(this.FDForm[2], `defaultModel`, taskArr[0].value);
        } else {
          this.$set(this.FDForm[2], `defaultModel`, "");
        }

        this.$set(this.FDForm[2], `option`, taskArr);
      });
    },

    // 获取
    getList() {
      this.TLoading = true;
      API.getTaskList({
        pageNum: this.TPage.index,
        pageSize: this.TPage.size,
        projectId: this.proVal,
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
            const { data, total, pageSize, title, index } = Res.formatData();
            this.tableTitle = title;
            if (data && data.length) {
              data.forEach((item) => {
                item["edit"] = this.TEdit;
              });
            }
            this.tableData = data;
            this.TPage = {
              total,
              index,
              size: pageSize,
            };
          } else {
            this.tableData = [];
            this.TPage = {
              total: 0,
              index: 1,
              size: 10,
            };
          }
        })
        .catch((error) => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 增加
    add(req, _type) {
      const {
        remark,
        projectId,
        code,
        name,
        sourceDataSourceId,
        targetDataSourceId,
        type,
        incrFlag,
        truncateFlag,
      } = req;
      let required = {};
      if (_type === 1) {
        required = {
          remark,
          projectId,
          code,
          name,
          sourceDataSourceId,
          targetDataSourceId,
          type,
          incrFlag: incrFlag ? 1 : 0,
          truncateFlag: truncateFlag ? 1 : 0,
        };
      } else {
        let kettleFileUrl_ = "";
        if (this.uploadFilesUrl_.length) {
          this.uploadFilesUrl_.forEach((item) => {
            kettleFileUrl_ = kettleFileUrl_ + ";" + item;
          });
        }
        required = {
          remark,
          projectId,
          code,
          name,
          type,
          kettleFileUrl: kettleFileUrl_.substr(1),
        };
      }
      // 添加额外参数(数据源名称)
      this.sourceData.forEach((item) => {
        if (sourceDataSourceId === item.id) {
          required["sourceDataSourceName"] = item.datasourceName;
        }
        if (targetDataSourceId === item.id) {
          required["targetDataSourceName"] = item.datasourceName;
        }
      });
      API.addTask(required).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 删除
    del({ id }) {
      API.delTask({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 更新
    upDate(req, _type) {
      const {
        remark,
        projectId,
        code,
        name,
        sourceDataSourceId,
        targetDataSourceId,
        type,
        incrFlag,
        truncateFlag,
      } = req;
      let required = {};
      if (_type === 1) {
        required = {
          id: this.activeRow_.id,
          remark,
          projectId,
          code,
          name,
          sourceDataSourceId,
          targetDataSourceId,
          type,
          incrFlag: incrFlag ? 1 : 0,
          truncateFlag: truncateFlag ? 1 : 0,
        };
      } else {
        let kettleFileUrl_ = "";
        if (this.uploadFilesUrl_.length) {
          this.uploadFilesUrl_.forEach((item) => {
            kettleFileUrl_ = kettleFileUrl_ + ";" + item;
          });
        }
        required = {
          id: this.activeRow_.id,
          remark,
          projectId,
          code,
          name,
          type,
          kettleFileUrl: kettleFileUrl_.substr(1),
        };
      }
      this.sourceData.forEach((item) => {
        if (sourceDataSourceId === item.id) {
          required["sourceDataSourceName"] = item.datasourceName;
        }
        if (targetDataSourceId === item.id) {
          required["targetDataSourceName"] = item.datasourceName;
        }
      });
      API.updateTask(required).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 执行
    runTask({ taskId }) {
      API.impTask({ id: taskId }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 同步标准清洗规则
    syncInfo({ metaDataId, standardsId }) {
      API.rulesSync({
        id: this.activeRow_.id,
        metaDataId,
        standardsId,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 复制
    copy({ id }) {
      API.copyTask({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 导出配置清单
    exportFn({ id }) {
      _ExportExcel(API.expTask() + `?id=${id}`, {
        text: "正在导出...",
      });
    },
    // 导入-成功
    handleSuccess(response, file, fileList) {
      this.$message({
        message: "导入成功",
        type: "success",
      });
    },
    // 导入-失败
    handleError(err, file, fileList) {
      this.$message({
        message: "导入失败",
        type: "error",
      });
    },
    // 对比配置-导出
    exportDiffCompared(req) {
      _DownLoadExcelGet({
        url: API.expDiff(),
        data: req,
        cfg: { text: "正在导出..." },
      });
    },
  },
  mounted() {
    this.getSourceData();
    this.getDataStandard();
    if (this.$route.query && this.$route.query.row) {
      let paramsUrl = JSON.parse(this.$route.query.row);
      this.proVal = paramsUrl.id;
      this.getProjectList({ init: false });
    } else {
      this.getProjectList({ init: true });
    }
  },
};
</script>

<style lang="less" scoped>
.task-list {
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
    }
  }
  &-table {
    margin: 20px 0;
  }
}
</style>
