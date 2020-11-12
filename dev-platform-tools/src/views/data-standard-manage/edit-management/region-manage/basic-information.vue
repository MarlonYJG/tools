<!--
 * @Author: Marlon
 * @Date: 2020-07-20 10:30:45
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-28 15:54:06
 * @Description: 基本信息
--> 

<template>
  <div class="base-information">
    <div class="left">
      <ul>
        <li v-for="(item, i) in basicInforma" :key="i">
          <p class="name">{{item.label}}：</p>
          <p class="value">{{item.value}}</p>
        </li>
      </ul>
    </div>
    <div class="right" v-show="basicInforma.length">
      <el-button size="medium" type="primary" @click="handlerEdit">编辑</el-button>
    </div>
    <!-- 基本信息-编辑  -->
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
import API from "api";
import { ResDatas } from "utils/res-format";
import mixin from "mixin";

export default {
  mixins: [mixin],
  props: {
    parId: {
      type: Object,
      default: () => {
        return {};
      },
    },
    proTree: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      basicInforma: [],
      // 临时记录
      basicInformaOrigin: {},
      // 弹出框
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      // 弹出框配置
      FDForm: [],
      FDFoot: {
        button: [],
      },
      FDRules: {},
    };
  },
  watch: {
    parId: {
      handler(newVal) {
        if (newVal && newVal.id) {
          this.getBasicInfo(newVal.id);
        }
      },
      deep: true,
    },
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.FDVisible = editItem.close;
        this.FDForm = [];
      }
    },
    // 格式化基本信息
    filterBaseData(basicData) {
      let initBasic = [];
      Object.keys(basicData).forEach((key) => {
        let _label = "";
        switch (key) {
          case "name":
            _label = "名称";
            break;
          case "code":
            _label = "编码";
            break;
          case "parentName":
            _label = "继承";
            break;
          case "remark":
            _label = "备注";
            break;
        }
        if (_label) {
          initBasic.push({
            label: _label,
            value: basicData[key],
          });
        }
      });
      return initBasic;
    },
    // 编辑
    handlerEdit() {
      if (this.basicInformaOrigin) {
        const {
          code = "",
          name = "",
          parentId = null,
          remark = "",
        } = this.basicInformaOrigin;
        this.FDTitle = "编辑";
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
            defaultModel: name,
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
            defaultModel: code,
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
            defaultModel: parentId,
            placeholder: "",
            option: this.proTree,
          },
          {
            type: "textarea",
            label: {
              name: "备注",
              width: "120",
            },
            key: "remark",
            width: "280",
            defaultModel: remark,
            placeholder: "",
            autosize: {
              min: 2,
              max: 4,
            },
          },
        ];
        this.FDRules = {
          name: [{ required: true, message: "请输入名称", trigger: "blur" }],
          code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        };
        this.FDVisible = true;
      }
      this.$set(this.FDFoot, `button`, [
        {
          type: "ok",
          label: "确定",
          cb: (form, $this) => {
            $this.$refs[this.FDId].validate((valid) => {
              if (valid) {
                this.updateEdit(form);
              }
            });
          },
        },
      ]);
    },

    /* 请求 */
    // 获取地区基本信息
    getBasicInfo(id) {
      if (id) {
        API.getBasicInfo({
          areaId: id,
        }).then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          if (Res) {
            this.basicInformaOrigin = Res;
          } else {
            this.basicInformaOrigin = {};
          }
          this.basicInforma = this.filterBaseData(this.basicInformaOrigin);
        });
      }
    },
    // 编辑地区基本信息-提交
    updateEdit(req) {
      API.updateAreaBasic({
        ...this.basicInformaOrigin,
        ...req,
      })
        .then((res) => {
          this.FDVisible = false;
          let Res = new ResDatas({
            res,
            code: 0,
          }).state();
          this.getBasicInfo(this.basicInformaOrigin.id);
        })
        .catch((err) => {
          this.FDVisible = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.base-information {
  width: 100%;
  .left {
    width: 60%;
    float: left;
    ul {
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
      li {
        width: 100%;
        height: 30px;
        line-height: 30px;
        margin-top: 10px;
        p {
          font-size: 16px;
          &.name {
            width: 100px;
            float: left;
            text-align: right;
          }
          &.value {
            width: calc(100% - 100px);
            float: left;
            text-align: left;
          }
        }
      }
    }
  }
  .right {
    width: 40%;
    float: left;
    padding-top: 30px;
    box-sizing: border-box;
  }
}
</style>