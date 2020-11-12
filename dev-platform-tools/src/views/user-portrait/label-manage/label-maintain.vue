<!--
 * @Author: Marlon
 * @Date: 2020-05-13 08:22:37
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-13 09:30:13
 * @Description: 标签管理-标签定义
 -->
<template>
  <div class="label-definition">
    <div class="label-definition-edit-area">
      <ul class="label-definition-edit-area-btn">
        <li>
          <el-button size="medium" @click="showDialog({type:'标签定义'})">标签定义</el-button>
        </li>
        <li>
          <el-button size="medium" @click="del({type:'批量删除'})">删除</el-button>
        </li>
      </ul>
      <ul class="label-definition-edit-area-select">
        <li>
          <label for>业务板块：</label>
          <el-select
            v-model="tag_1_val"
            filterable
            clearable
            placeholder="请选择"
            size="medium"
            @change="getList"
          >
            <el-option
              v-for="item in tag_1_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <label for>标签分组：</label>
          <el-cascader
            v-model="tag_2_val"
            :options="tag_2_list"
            :props="{ expandTrigger: 'hover' }"
            @change="initTagType"
            style="width: 290px;"
            size="medium"
            clearable
          ></el-cascader>
        </li>
        <li>
          <label for>标签分类：</label>
          <el-select
            v-model="tag_3_val"
            filterable
            clearable
            placeholder="请选择"
            size="medium"
            @change="getList"
            style="width: 185px;"
          >
            <el-option
              v-for="item in labelCodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <el-input placeholder="请输入内容" v-model="searchVal" size="medium">
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
    <div class="label-definition-table">
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
        :TIsShowCheckBox="true"
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
        @changePage="changePage"
        @handleSelectionChange="handleSelectionChange"
      ></TableDefault>
    </div>
    <!-- 弹出框-标签 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="806"
      @editBtnCb="editBtnCb"
    >
      <div slot="soltDigContent" class="soltDigContent">
        <ul>
          <li>
            <label for>业务领域：</label>
            <el-select v-model="tag_1_val_" filterable placeholder="请选择" size="small">
              <el-option
                v-for="item in tag_1_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
        </ul>
        <p class="title">
          <i></i> 选择创建标签的方式
        </p>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-card
              class="tag"
              shadow="hover"
              @click.native="tagFn(1)"
              @mouseenter.native="handleEnter(1,true)"
              @mouseleave.native="handleEnter(1,false)"
            >
              <div class="tag-icons">
                <span class="tag-icons-1"></span>
                <span>简单标签</span>
              </div>
              <div class="tag-info">
                <p>可以直接通过取表中的字段信息生成的标签。</p>
                <p>示例：如纳税等级标签</p>
              </div>
              <i :class="tag_1 ? 'tag_active':''"></i>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card
              class="tag"
              shadow="hover"
              @click.native="tagFn(2)"
              @mouseenter.native="handleEnter(2,true)"
              @mouseleave.native="handleEnter(2,false)"
            >
              <div class="tag-icons">
                <span class="tag-icons-2"></span>
                <span>复杂标签</span>
              </div>
              <div class="tag-info">
                <p>通过设置标签相关的指标及其指标的值域生成的标签。</p>
                <p>示例：如投标效能标签</p>
              </div>
              <i :class="tag_2 ? 'tag_active':''"></i>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card
              class="tag"
              shadow="hover"
              @click.native="tagFn(3)"
              @mouseenter.native="handleEnter(3,true)"
              @mouseleave.native="handleEnter(3,false)"
            >
              <div class="tag-icons">
                <span class="tag-icons-3"></span>
                <span>模型标签</span>
              </div>
              <div class="tag-info">
                <p>通过设置标签相关的模型及模型参数生成的标签。</p>
                <p>示例：如企业竞争力标签</p>
              </div>
              <i :class="tag_3 ? 'tag_active':''"></i>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card
              class="tag"
              shadow="hover"
              @click.native="tagFn(4)"
              @mouseenter.native="handleEnter(4,true)"
              @mouseleave.native="handleEnter(4,false)"
            >
              <div class="tag-icons">
                <span class="tag-icons-4"></span>
                <span>自预测标签</span>
              </div>
              <div class="tag-info">
                <p>通过算法自预测生成的标签。</p>
                <p></p>
              </div>
              <i :class="tag_4 ? 'tag_active':''"></i>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </SoltDialog>
    <!-- 弹出框-表单 -->
    <SoltDialog
      :SoltDigShow="SoltDigShowForm"
      :SoltDigTitle="SoltDigTitleForm"
      :soltDFootBtn="soltDFootBtnForm"
      SoltDigWidth="900"
      @editBtnCb="editBtnCbForm"
    >
      <div slot="soltDigContent" class>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="130px"
          class="demo-ruleForm"
        >
          <el-form-item label="标签名称：" prop="labelValueName">
            <el-input v-model="ruleForm.labelValueName"></el-input>
          </el-form-item>
          <el-form-item label="标签描述：" prop="labelContent">
            <el-input v-model="ruleForm.labelContent"></el-input>
          </el-form-item>
          <el-form-item label="标签英文名称：" prop="labelPrefix">
            <el-select v-model="ruleForm.labelPrefix" placeholder="请选择" style="width: 395px;">
              <el-option
                v-for="(item,index) in labelPrefixList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input v-model="ruleForm.labelEnName" style="width: 330px;" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="标签分组：" prop="labelGroup">
            <el-cascader
              style="width: 290px;"
              v-model="ruleForm.labelGroup"
              :options="tag_2_list"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"
              size="medium"
            ></el-cascader>
            <el-form-item label="标签分类：" prop="labelCode" style="float: right;">
              <el-select v-model="ruleForm.labelCode" placeholder="请选择标签分类">
                <el-option
                  v-for="(item,index) in labelCodeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="标签状态：">
            <el-switch
              v-model="ruleForm.labelStatus"
              active-color="#13ce66"
              inactive-color="#DCDFE6"
            ></el-switch>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </SoltDialog>
  </div>
</template>

<script>
import jdTag from "@/assets/icon/jd@51_55.png";
import mixin from "mixin";
import API from "api/index";
import { ResDatas, reqFormatDic } from "utils/res-format";
import { openUrl, cellJump } from "utils/jump";
import SoltDialog from "@/components/dialog/solt-dialog";

export default {
  mixins: [mixin],
  components: {
    SoltDialog,
  },
  data() {
    return {
      // 查找
      searchVal: "",
      tag_1_val: "",
      tag_1_list: [],
      tag_2_val: [],
      tag_2_list: [],
      tag_3_val: "",
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
        slot: false,
        type: "popover",
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "查看",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
          },
        ],
      },
      tableTitle: [
        { prop: "labelType_value", label: "标签类型" },
        { prop: "labelName", label: "标签分类" },
        { prop: "labelValueName", label: "标签名称" },
        { prop: "businessType_value", label: "业务板块" },
        { prop: "labelGroups", label: "标签分组" },
        { prop: "createTime", label: "创建时间" },
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      checkBox: [],
      activeRow_: "",
      // 弹出框-标签(简单)
      tag_1: false,
      tag_2: false,
      tag_3: false,
      tag_4: false,
      tag_1_val_: "",
      SoltDigShow: false,
      SoltDigTitle: "",
      soltDFootBtn: [],
      changeTage: "",
      // 弹出框-表单
      SoltDigShowForm: false,
      SoltDigTitleForm: "",
      soltDFootBtnForm: [],
      ruleForm: {
        labelValueName: "",
        labelContent: "",
        labelPrefix: "",
        labelEnName: "",
        labelGroup: [],
        labelCode: "",
        labelStatus: true,
        remark: "",
      },
      rules: {
        labelValueName: [
          { required: true, message: "请输入标签名称", trigger: "change" },
        ],
        labelContent: [
          { required: true, message: "请输入标签描述", trigger: "change" },
        ],
        labelPrefix: [
          { required: true, message: "请选择英文名称", trigger: "change" },
        ],
        labelEnName: [{ required: true, message: "请输入", trigger: "change" }],
        labelGroup: [
          {
            type: "array",
            required: true,
            message: "请选择标签分组",
            trigger: "change",
          },
        ],
        labelCode: [
          { required: true, message: "请选择标签分类", trigger: "change" },
        ],
      },
      labelPrefixList: [],
      labelCodeList: [],
      // 弹出框-标签(复杂)
      SoltDigShow_2: false,
      SoltDigTitle_2: "",
      soltDFootBtn: [],
    };
  },
  watch: {
    "ruleForm.labelGroup": {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.getTagType(newVal[2]);
        }
      },
      deep: true,
    },
    tag_2_val: {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.getTagType(newVal[2]);
        }
        this.getList();
      },
      deep: true,
    },
    SoltDigShowForm(newVal) {
      if (!newVal && this.$refs["ruleForm"]) {
        this.$refs["ruleForm"].resetFields();
      }
    },
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
        this.del({ type: "单条删除", row });
      } else if (text === "close") {
        this.SoltDigShow = editItem.close;
        this.$set(this.ruleForm, `labelValueName`, "");
        this.$set(this.ruleForm, `labelContent`, "");
        this.$set(this.ruleForm, `labelEnName`, "");
        this.$set(this.ruleForm, `labelStatus`, false);
        this.$set(this.ruleForm, `remark`, "");
        this.$set(this.ruleForm, `labelPrefix`, "");
        this.$set(this.ruleForm, `labelCode`, "");
        this.$set(this.ruleForm, `labelGroup`, []);
      }
    },
    editBtnCbForm(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
        console.log("删除");
      } else if (text === "close") {
        this.SoltDigShowForm = editItem.close;
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null }) {
      switch (type) {
        case "标签定义":
          {
            this.SoltDigShow = true;
            this.SoltDigTitle = "创建标签界面";
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
        labelValueName,
        labelEnName,
        labelStatus,
        remark,
        labelCode,
        labelPrefix,
        labelGroup1,
        labelGroup2,
        labelGroup3,
        labelContent = "",
      } = row;
      switch (column.label) {
        case "查看": {
          // 赋值
          this.$set(this.ruleForm, `labelValueName`, labelValueName);
          this.$set(this.ruleForm, `labelContent`, labelContent);
          this.$set(this.ruleForm, `labelEnName`, labelEnName);
          this.$set(this.ruleForm, `labelStatus`, labelStatus ? true : false);
          this.$set(this.ruleForm, `remark`, remark);
          this.$set(this.ruleForm, `labelPrefix`, labelPrefix);
          this.$set(this.ruleForm, `labelCode`, labelCode);
          this.$set(this.ruleForm, `labelGroup`, [
            labelGroup1,
            labelGroup2,
            labelGroup3,
          ]);
          this.SoltDigShowForm = true;
          this.SoltDigTitleForm = "查看";
          this.soltDFootBtnForm = [];
          return;
        }
        case "编辑": {
          // 赋值
          this.$set(this.ruleForm, `labelValueName`, labelValueName);
          this.$set(this.ruleForm, `labelContent`, labelContent);
          this.$set(this.ruleForm, `labelEnName`, labelEnName);
          this.$set(this.ruleForm, `labelStatus`, labelStatus ? true : false);
          this.$set(this.ruleForm, `remark`, remark);
          this.$set(this.ruleForm, `labelPrefix`, labelPrefix);
          this.$set(this.ruleForm, `labelCode`, labelCode);
          this.$set(this.ruleForm, `labelGroup`, [
            labelGroup1,
            labelGroup2,
            labelGroup3,
          ]);

          this.SoltDigShowForm = true;
          this.SoltDigTitleForm = "编辑";
          this.soltDFootBtnForm = [
            {
              label: "确定",
              css: "primary",
              cb: () => {
                this.$refs["ruleForm"].validate((valid) => {
                  if (valid) {
                    this.upDate();
                  } else {
                    return false;
                  }
                });
              },
            },
          ];
          return;
        }
        default:
          break;
      }
    },
    // 多选
    handleSelectionChange(type, selectionArr) {
      if (type === "checkbox") {
        this.checkBox = selectionArr;
        console.log("多选", selectionArr);
      }
    },
    // TODO 标签选择
    tagFn(type) {
      this.changeTage = type;
      switch (type) {
        case 1:
          {
            if (this.tag_1_val_) {
              this.SoltDigShow = false;
              this.SoltDigShowForm = true;
              this.SoltDigTitleForm = "标签定义";
              this.soltDFootBtnForm = [
                {
                  label: "保存",
                  css: "primary",
                  cb: () => {
                    this.$refs["ruleForm"].validate((valid) => {
                      if (valid) {
                        this.add();
                      } else {
                        return false;
                      }
                    });
                  },
                },
              ];
            } else {
              this.$message({
                message: "请选择业务领域",
                type: "warning",
              });
            }
          }
          return;
        case 2:
          {
            if (this.tag_1_val_) {
              this.SoltDigShow = false;
              this.SoltDigShowForm = true;
              this.SoltDigTitleForm = "标签定义";
              this.soltDFootBtnForm = [
                {
                  label: "保存",
                  css: "primary",
                  cb: () => {
                    this.$refs["ruleForm"].validate((valid) => {
                      if (valid) {
                        this.add();
                      } else {
                        return false;
                      }
                    });
                  },
                },
              ];
            } else {
              this.$message({
                message: "请选择业务领域",
                type: "warning",
              });
            }
          }
          return;
        case 3:
          {
          }
          return;
        case 4:
          {
          }
          return;
        default:
          break;
      }
    },
    // 鼠标移入
    handleEnter(type, isShow) {
      this["tag_" + type] = isShow;
    },
    // 关联关系初始化
    handleChange(value) {
      this.$set(this.ruleForm, `labelCode`, "");
    },
    initTagType() {
      this.tag_3_val = "";
    },
    // 递归处理
    loop(arr) {
      if (arr && arr.length) {
        arr.forEach((item) => {
          item["label"] = item.typeName;
          item["value"] = item.treeId;
          if (item.children && item.children.length) {
            this.loop(item.children);
          }
        });
      }
    },

    /* 请求 */
    // 业务板块
    getYWBK(name) {
      API._publicYWBK({
        name,
      }).then((res) => {
        let Res = new ResDatas({
          res,
        }).init();
        if (name === "BUSINESS_TYPE") {
          let proArr = [];
          if (Res && Res.length) {
            Res.forEach((item) => {
              proArr.push({
                label: item.name,
                value: item.code,
              });
            });
          }
          this.tag_1_list = proArr;
        } else if (name === "LABEL_PREFIX") {
          let proArr = [];
          if (Res && Res.length) {
            Res.forEach((item) => {
              proArr.push({
                label: item.name,
                value: item.code,
              });
            });
          }
          this.labelPrefixList = proArr;
        }
      });
    },
    // 标签分组
    getTagGroup() {
      API._publicTagGroup({
        parentCode: "",
      }).then((res) => {
        let Res = new ResDatas({
          res,
        }).init();
        let labelTag_ = [];
        if (Res && Res.length) {
          this.loop(Res);
        }
        labelTag_ = Res;
        this.tag_2_list = labelTag_;
      });
    },
    // 标签分类
    getTagType(labelGroup3) {
      API._publicTagType({
        labelGroup: labelGroup3,
      }).then((res) => {
        let Res = new ResDatas({
          res,
        }).init();
        let tagGroup_ = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            tagGroup_.push({
              ...item,
              label: item.labelName,
              value: item.labelCode,
            });
          });
        }
        this.labelCodeList = tagGroup_;
      });
    },

    // 获取
    getList() {
      let label = {};
      this.labelCodeList.forEach((item) => {
        if (this.tag_3_val == item.value) {
          label["labelCode"] = item.value;
          label["labelName"] = item.label;
        }
      });
      this.TLoading = true;
      let group_ = {};
      if (this.tag_2_val && this.tag_2_val.length) {
        group_["labelGroup1"] = this.tag_2_val[0];
        group_["labelGroup2"] = this.tag_2_val[1];
        group_["labelGroup3"] = this.tag_2_val[2];
      }
      let query = {
        current: this.TPage.index,
        size: this.TPage.size,
        businessType: this.tag_1_val,
        labelValueName: this.searchVal,
      };
      API.labelDefinitionList(
        reqFormatDic(Object.assign({}, query, group_, label))
      )
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              fieldKey: {
                data: "records",
                title: "",
                total: "total",
                pageSize: "size",
              },
              titleKey: [],
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, total, pageSize } = Res.formatData();
            if (data && data.length) {
              data.forEach((item) => {
                item["labelGroups"] =
                  item.labelGroup1Name +
                  "/" +
                  item.labelGroup2Name +
                  "/" +
                  item.labelGroup3Name;
              });
            }
            this.tableData = data;
            this.TPage = {
              total,
              index: this.TPage.index,
              size: pageSize,
            };
          } else {
            this.tableData = [];
            this.$set(this.TPage, `total`, 0);
          }
        })
        .catch((error) => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 增加
    add() {
      // 获取表单中标签分类对应的name值
      let labelName = "";
      this.labelCodeList.forEach((item) => {
        if (this.ruleForm.labelCode === item.value) {
          labelName = item.label;
        }
      });
      API.labelDefinitionAdd({
        businessType: this.tag_1_val_,
        labelType: this.changeTage,
        labelValueName: this.ruleForm.labelValueName,
        labelContent: this.ruleForm.labelContent,
        labelPrefix: this.ruleForm.labelPrefix,
        labelEnName: this.ruleForm.labelEnName,
        labelGroup1: this.ruleForm.labelGroup[0],
        labelGroup2: this.ruleForm.labelGroup[1],
        labelGroup3: this.ruleForm.labelGroup[2],
        labelCode: this.ruleForm.labelCode,
        labelName: labelName,
        labelStatus: this.ruleForm.labelStatus ? 1 : 0,
        remark: this.ruleForm.remark,
      }).then((res) => {
        new ResDatas({
          res,
        }).state();
        this.SoltDigShowForm = false;
        this.getList();
      });
    },
    // 删除
    del({ type, row }) {
      switch (type) {
        case "批量删除":
          {
            if (this.checkBox.length) {
              let idList = "";
              this.checkBox.forEach((item) => {
                idList = idList + "," + item.id;
              });
              API.labelDefinitionDels({
                idList: idList.substr(1),
              }).then((res) => {
                new ResDatas({
                  res,
                }).state();
                this.getList();
              });
            }
          }
          return;
        case "单条删除":
          {
            API.labelDefinitionDel({ id: row.id }).then((res) => {
              new ResDatas({
                res,
              }).state();
              this.getList();
            });
          }
          return;
        default:
          break;
      }
    },
    // 更新
    upDate() {
      // 获取表单中标签分类对应的name值
      let labelName = "";
      this.labelCodeList.forEach((item) => {
        if (this.ruleForm.labelCode === item.value) {
          labelName = item.label;
        }
      });
      API.labelDefinitionUpdate({
        id: this.activeRow_.id,
        labelValueName: this.ruleForm.labelValueName,
        labelContent: this.ruleForm.labelContent,
        labelPrefix: this.ruleForm.labelPrefix,
        labelEnName: this.ruleForm.labelEnName,
        labelGroup1: this.ruleForm.labelGroup[0],
        labelGroup2: this.ruleForm.labelGroup[1],
        labelGroup3: this.ruleForm.labelGroup[2],
        labelCode: this.ruleForm.labelCode,
        labelName: labelName,
        labelStatus: this.ruleForm.labelStatus ? 1 : 0,
        remark: this.ruleForm.remark,
      }).then((res) => {
        new ResDatas({
          res,
        }).state();
        this.SoltDigShowForm = false;
        this.getList();
      });
    },
  },
  mounted() {
    this.getYWBK("BUSINESS_TYPE");
    this.getYWBK("LABEL_PREFIX");
    this.getTagGroup();
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.label-definition {
  font-size: 14px;
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
      margin: 4px;
      li {
        float: left;
        margin-right: 10px;
        & > div {
          width: 120px;
        }
        &:last-child {
          & > div {
            width: 150px;
          }
        }
      }
    }
  }
  &-table {
    margin: 20px 0;
  }
  .soltDigContent {
    .title {
      margin: 10px 0;
      margin-top: 15px;
      & > i {
        display: inline-block;
        width: 3px;
        height: 15px;
        background: $table_edit_btn_border_color_active;
        position: relative;
        top: 3px;
      }
    }
    .tag-4 {
      display: flex;
      margin-top: 7px;
      li {
        flex: 1;
        text-align: center;
      }
    }
    .tag-icons {
      height: 80px;
      text-align: center;
      cursor: pointer;
      & > span {
        &:first-child {
          display: block;
          margin: 10px 29px;
        }
      }
    }
    .tag-info {
      overflow: hidden;
      height: 100px;
      margin-top: 15px;
      cursor: pointer;
      p {
        &:first-child {
          margin-bottom: 8px;
        }
        &:nth-child(2) {
          color: #999999;
        }
      }
    }
    .tag-icons-1 {
      position: relative;
      left: 15px;
      width: 60px;
      height: 55px;
      background: url(../../../assets/icon/jd@51_55.png) no-repeat;
    }
    .tag-icons-2 {
      position: relative;
      left: 12px;
      width: 60px;
      height: 55px;
      background: url(../../../assets/icon/fz@60_54.png) no-repeat;
    }
    .tag-icons-3 {
      position: relative;
      left: 12px;
      width: 60px;
      height: 55px;
      background: url(../../../assets/icon/mx@60_54.png) no-repeat;
    }
    .tag-icons-4 {
      position: relative;
      left: 12px;
      width: 60px;
      height: 55px;
      background: url(../../../assets/icon/zyc@60_55.png) no-repeat;
    }
    /deep/ .el-card.is-always-shadow,
    .el-card.is-hover-shadow:focus,
    .el-card.is-hover-shadow:hover {
      -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 2px 12px 0 $card_shadow;
      border: 1px solid $card_border;
    }
    .tag {
      i {
        position: relative;
        right: -10px;
        float: right;
        width: 18px;
        height: 18px;
        background: url(../../../assets/icon/copy_default@18_18.png) no-repeat;
      }
      .tag_active {
        background: url(../../../assets/icon/copy_active@18_18.png) no-repeat;
      }
    }
  }
}
</style>

