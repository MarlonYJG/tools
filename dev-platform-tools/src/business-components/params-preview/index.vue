<!--
 * @Author: 徐伟
 * @Date: 2020-03-16 10:11:05
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-18 17:47:30
 * @Description: 
-->
<template>
  <!-- 参数预览-弹窗 -->
  <div class="params-preview">
    <el-dialog
      :title="titleName"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form :model="form">
        <el-row>
          <el-col :span="10">
            <!-- :default-expanded-keys="['1', activeRuleTypeId]"
            :default-checked-keys="[activeRuleTypeId]"-->
            <el-tree
              :data="ruleTreeDic"
              node-key="id"
              accordion
              :default-expanded-keys="[ruleId]"
              :default-checked-keys="[ruleId]"
              highlight-current
              @node-click="handleTreeClick"
            ></el-tree>
          </el-col>
          <el-col :span="14">
            <!-- <el-form-item
              v-for="(item,key) in paramsDic"
              :key="key"
              :label="item.label"
              :label-width="formLabelWidth"
              :prop="item.prop"
            >
              <el-radio-group
                v-if="(item.displayMode===1&&(item.paraType===2 || item.paraType===3)) || (item.displayMode===6&&(item.paraType===2 || item.paraType===3))"
                v-model="form[item.prop]"
              >
                <el-radio :label="i" v-for="i in `${item.range}`.split(',')" :key="i"></el-radio>
              </el-radio-group>
              <el-checkbox-group
                v-if="item.displayMode===2&&(item.paraType===2 || item.paraType===3)"
                v-model="form[item.prop]"
              >
                <el-checkbox :label="i" v-for="i in checkboxDic" :key="i" :name="item.prop"></el-checkbox>
              </el-checkbox-group>
              <el-input
                v-if="(item.displayMode===3&&item.paraType===1) || (item.displayMode===1&&item.paraType===1)"
                v-model="form[item.prop]"
                :readonly="ifReadOnly"
              ></el-input>
              <div class="search-input" v-if="item.displayMode===4&&item.paraType===4">
                <el-input v-model="form[item.prop]"></el-input>
                <el-button type="text" @click="add(item.range)">添加</el-button>
              </div>
              <el-input
                v-if="(item.displayMode===4&&item.paraType===1) || (item.displayMode===4&&item.paraType===5)"
                type="textarea"
                v-model="form[item.prop]"
              ></el-input>
              <el-select
                v-if="item.displayMode===6&&item.paraType===4"
                v-model="form[item.prop]"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in checkFormDic"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item
              v-for="(item,key) in paramsDic"
              :key="key"
              :label="item.label"
              :label-width="formLabelWidth"
              :prop="item.prop"
            >
              <!-- 单选 -->
              <el-radio-group v-if="item.displayMode===1" v-model="item.value">
                <el-radio :label="val.code" v-for="val in item.range" :key="val.code">{{val.name}}</el-radio>
              </el-radio-group>
              <!-- 多选 -->
              <el-checkbox-group v-if="item.displayMode===2" v-model="item.value">
                <el-checkbox
                  :label="val.code"
                  v-for="val in item.range"
                  :key="val.code"
                >{{val.name}}</el-checkbox>
              </el-checkbox-group>
              <!-- 文本 -->
              <el-input v-if="item.displayMode===3" v-model="item.value"></el-input>
              <!-- 纯文本域 -->
              <el-input
                v-if="item.displayMode===4 && item.paraType !== 4"
                type="textarea"
                v-model="item.value"
              ></el-input>
              <!-- 文本域+筛选 -->
              <div class="search-input" v-if="item.displayMode===4 && item.paraType === 4">
                <el-input v-model="item.value"></el-input>
                <el-button type="text" @click="add(item)">添加</el-button>
              </div>
              <!-- 下拉选 -->
              <el-select
                v-if="item.displayMode===6"
                v-model="item.value"
                placeholder="请选择"
                @change="selectDataSet($event,item)"
              >
                <el-option
                  v-for="item in item.range"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="previewSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :title="titleName1" :visible.sync="dialogVisible1" width="600px">
      <el-checkbox-group v-model="addCheckedVal" :min="1" :max="2">
        <el-checkbox v-for="city in addCheckedDic" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>-->
    <!-- 内嵌弹出框(复选框) -->
    <el-dialog
      width="30%"
      title="请选择"
      :visible.sync="innerVisible"
      append-to-body
      :close-on-click-modal="false"
      class="checkoutList"
    >
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="(item, index) in checkListOption"
          :key="index"
          :label="item.code"
        >{{item.name}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAll" size="small">全 选/取 消</el-button>
        <el-button type="primary" @click="innerVisible = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from "api/index";
import { dataRuleFormate } from "utils";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      define: () => false,
    },
    // 弹窗名
    titleName: {
      type: String,
      define: () => "新增规则",
    },
    // 编辑form数据
    formData: {
      type: Object,
      define: () => {},
    },
    // 规则id
    ruleId: {
      type: [String, Number],
      define: () => "",
    },
    // 规则id
    taskId: {
      type: [String, Number],
      define: () => "",
    },
  },
  data() {
    return {
      formLabelWidth: "120px",
      form: {},
      ruleTreeDic: [], // 规则树字典
      paramsDic: [], // 字段列表
      // checkFormDic: [], // 检查表字典
      // checkFormProp: "", // 检查表prop
      // activeRuleId: "", // 规则ID
      // checkboxDic: [], // 多选字典
      // titleName1: "添加规则",
      // dialogVisible1: false,
      // addCheckedVal: [],
      // addCheckedDic: [],
      // activeRuleObj: {}, // 当前活跃的规则,
      curRuleParams: {}, //选中规则参数
      innerVisible: false,
      checkList: [],
      checkListOption: [],
    };
  },
  mounted() {
    console.log("this.formData", this.formData);
    this.getRuleTypePreviewTree();
  },
  watch: {
    checkList: {
      handler(newVal) {
        this.paramsDic.forEach((item) => {
          if (item.displayMode == 4 && item.paraType == 4) {
            item.value = newVal.length ? newVal.join() : "";
          }
        });
      },
      deep: true,
      immediate: true,
    },
    // async handleType (type) {
    // 	console.log('type========',type);
    //     if (type === "bj") {
    //         Object.assign(this.$data.form, this.$options.data().form);
    //         let params = {
    //             ruleId: this.formData.rulesId
    //         };
    //         await this.getParamsDic(params);
    //         this.againAppear();
    //     }
    // }
    // ruleId: {
    //     handler (newId, oldId) {
    //         if (!newId) {
    //             return false;
    //         }
    //         switch (this.titleName) {
    //             case "编辑规则":
    //                 console.log('nnnnnn------', newId);
    //                 this.getParamsDic({
    //                     ruleId: newId
    //                 });
    //                 break;
    //             default:
    //                 break;
    //         }
    //     },
    //     immediate: true
    // }
  },
  methods: {
    // dialog-close
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    // 编辑-字段复现
    // againAppear () {
    //     Object.keys(this.formData).forEach(item => {
    //         if (item === "rulesId" || item === "areaId") return;
    //         this.$set(this.form, item, this.formData[item]);
    //     });
    // },
    // 对象deep-clone
    deepClone(obj) {
      var result = Array.isArray(obj) ? [] : {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            result[key] = deepClone(obj[key]);
          } else {
            result[key] = obj[key];
          }
        }
      }

      return result;
    },
    // 添加
    // add (paraRange) {
    //     // /getFideList?id=$checkTable$
    //     let url = `/ds/dataSet${paraRange.split("?")[0]}`;
    //     console.log(url, "url-添加");
    //     let params =
    //         this.handleType === "xz"
    //             ? {
    //                 areaId: this.activeAreaId
    //             }
    //             : {
    //                 areaId: this.formData.areaId
    //             };
    //     this.$axios.get(url, params).then(data => {
    //         if (data.code === "0") {
    //             data = data.data;
    //             this.addCheckedDic = data && data.length ? data : [];
    //         }
    //     });
    // },
    // 获取规则类型预览树-字典
    getRuleTypePreviewTree() {
      API.getRuleTypePreviewTree().then((res) => {
        let data = res.data;
        if (data.code === "0") {
          data = data.data;
          let dic = data && data.type === "tree" ? data.data : [];
          this.ruleTreeDic =
            dic && dic.children ? [{ ...dic.children, label: "规则" }] : [];
          if (this.titleName === "编辑规则") {
            this.getParamsDic({
              ruleId: this.ruleId,
            });
          }
        }
      });
    },
    // 获取字段列表
    getParamsDic(params) {
      API.rulePreview(params).then((res) => {
        let data = res.data;
        if (data.code === "0") {
          data = data.data ? data.data : [];
          let curSelectId = this.formData.dataSetId
            ? this.formData.dataSetId
            : this.formData.id;
          if (
            this.titleName === "编辑规则" &&
            params.ruleId == this.formData.ruleId
          ) {
            dataRuleFormate({
              data,
              type: 1,
              id: this.taskId,
              formData: this.formData,
            }).then((ret) => {
              this.paramsDic = ret.data;
              console.log("编辑规则", this.paramsDic);
              this.selectDataSet(curSelectId, ret.item);
            });
          } else {
            dataRuleFormate({
              data,
              id: this.taskId,
              formData: this.formData,
            }).then((ret) => {
              this.paramsDic = ret.data;
              console.log("ret", ret);
              console.log("非编辑规则", this.paramsDic);
              this.selectDataSet(curSelectId, ret.item);
            });
          }
          console.log("this.paramsDic", this.paramsDic);
          // this.form = {};
          // this.paramsDic.forEach(async item => {
          //   if (item.displayMode === 6 && item.paraType === 4) {
          //     // 检查表
          //     await this.getCheckDic(item.range);
          //     this.checkFormProp = item.prop;
          //   }
          //   if (
          //     item.displayMode === 2 &&
          //     (item.paraType === 2 || item.paraType === 3)
          //   ) {
          //     // 多选框
          //     this.$set(this.form, item.prop, []);
          //     this.checkboxDic = [...`${item.range}`.split(",")];
          //   }
          // });
        }
      });
    },
    //下拉选触发带url的label获取数据
    selectDataSet(val, item) {
      console.log("val--------", val, item);
      let data = this.paramsDic;
      for (let i = 0; i < data.length; i++) {
        const ele = data[i];
        if (ele.paramsType == item.prop) {
          API.useUrlGetData(ele.urlPath, { [ele.urlParam]: val }).then(
            (res) => {
              console.log("res666", res);
              this.paramsDic[i].range = res.data.data;
            }
          );
        }
        // if (ele.paraType==4&&ele.currentField) {
        //   {paramsType}
        // }
      }
    },
    // 获取检查表字典
    // getCheckDic (range) {
    //     let url = `/ds/dataSet${range.split("?")[0]}`;
    //     let params =
    //         this.handleType === "xz"
    //             ? {
    //                 areaId: this.activeAreaId
    //             }
    //             : {
    //                 areaId: this.formData.areaId
    //             };
    //     this.Axios.get(url, params).then(data => {
    //         if (data.code === "0") {
    //             data = data.data;
    //             this.checkFormDic = data && data.length ? data : [];
    //         }
    //     });
    // },
    // 规则树-点击
    handleTreeClick(data) {
      console.log("tree", data);
      if (data && data.info) {
        this.curRuleParams = {
          ruleId: data.info.id,
          ruleType: data.info.ruleTypeName,
          ruleTypeId: data.info.ruleTypeId,
          impInterface: data.info.impInterface,
        };
        this.$emit("changeRuleId", data.info.id);
      }
      // this.activeRuleObj = data;
      // this.activeRuleId = data.id;
      this.getParamsDic({
        ruleId: data.id,
      });
    },
    // 提交添加
    previewSubmit() {
      if (!this.paramsDic.length) {
        return false;
      }
      let ruleValue = {},
        _params = {};
      for (let i = 0; i < this.paramsDic.length; i++) {
        const item = this.paramsDic[i];
        if (
          !item.value &&
          (item.prop === "name" ||
            item.prop === "code" ||
            item.prop === "checkTable")
        ) {
          this.$message({
            message:
              item.prop === "checkTable"
                ? `请选择${item.label}`
                : `请输入${item.label}`,
            type: "warning",
          });
          return false;
        }
        console.log("item", item);
        if (item.displayMode === 1 || item.displayMode === 6) {
          //单选，下拉选
          let temp = {};
          for (let j = 0; j < item.range.length; j++) {
            if (
              item.value == item.range[j].id ||
              item.value == item.range[j].code
            ) {
              temp = {
                code: item.value,
                name: item.range[j].name || item.range[j].name,
              };
              break;
            }
          }
          ruleValue = { ...ruleValue, [item.prop]: temp };
        } else if (item.displayMode === 2) {
          //多选
          let temp = [];
          for (let j = 0; j < item.range.length; j++) {
            for (let k = 0; k < item.value.length; k++) {
              if (
                item.value[k] == item.range[j].code ||
                item.value[k] == item.range[j].id
              ) {
                temp.push({
                  code: item.value[k],
                  name: item.range[j].name || item.range[j].name,
                });
              }
            }
          }
          ruleValue = { ...ruleValue, [item.prop]: temp };
        } else if (item.displayMode == 4 && item.paraType == 4) {
          let temp = [];
          let checkbox_ = [];
          if (item.value.indexOf(",") !== -1) {
            checkbox_ = item.value.split(",");
          }
          item.range.forEach((ele) => {
            checkbox_.forEach((ch) => {
              if (ele.code == ch) {
                temp.push(ele);
              }
            });
          });
          ruleValue = { ...ruleValue, [item.prop]: temp };
        } else {
          ruleValue = { ...ruleValue, [item.prop]: item.value };
        }
      }
      _params = {
        ruleContent: JSON.stringify(this.paramsDic),
        ruleValue: JSON.stringify(ruleValue),
        ...this.curRuleParams,
        id: this.formData.dataSetId ? this.formData.id : "",
      };
      console.log(_params, "请求");
      API.ruleSaveDataSetRule(_params).then((res) => {
        console.log("addHandle", res);
        if (res.data.code === 200) {
          this.$emit("addHandle", { flag: true, handleType: this.handleType });
          // this.$emit("clickRow");
        } else {
          this.$emit("addHandle", { flag: false, handleType: this.handleType });
        }
      });
      // if (this.ifReadOnly) {
      //   this.$emit("closeDialog");
      //   return;
      // }
      // // 删选当前选择的检查表item
      // let _aItem = {};
      // // 行规则
      // this.checkFormDic.forEach(item => {
      //   if (item.id === this.form[this.checkFormProp]) {
      //     _aItem = { ...item };
      //   }
      // });
      // // 字段规则
      // let {
      //   areaId,
      //   businessSectorId,
      //   dataSetId,
      //   businessStageId,
      //   dataSetAttrId,
      //   id
      // } = this.formData;
      // _aItem = {
      //   ..._aItem,
      //   areaId,
      //   businessSectorId,
      //   dataSetId,
      //   id,
      //   businessStageId,
      //   dataSetAttrId
      // };

      // if (_aItem && !Object.keys(_aItem).length) {
      //   this.$message({
      //     message: "请选择检查表",
      //     type: "error"
      //   });
      //   return;
      // }
      // let params = {
      //   id: _aItem.id,
      //   rulesParentId: 123,
      //   areaId: _aItem.areaId ? _aItem.areaId : "",
      //   businessSectorId: _aItem.businessSectorId
      //     ? _aItem.businessSectorId
      //     : "",
      //   businessStageId: _aItem.businessStageId ? _aItem.businessStageId : "",
      //   dataSetId: _aItem.dataSetId ? _aItem.dataSetId : "",
      //   dataSetAttrId: _aItem.dataSetAttrId ? _aItem.dataSetAttrId : "",
      //   rulesId:
      //     this.handleType === "xz" ? this.activeRuleId : this.formData.rulesId,
      //   rulesContent: JSON.stringify({
      //     ...this.form
      //   })
      // };
      // console.log(params, "params");
      // if (this.handleType === "xz") {
      //   switch (this.type) {
      //     // 质量规则
      //     case "zl":
      //       API.addQualityRules(params).then(data => {
      //         if (data.code === "0") {
      //           this.$emit("addHandle", true);
      //         } else {
      //           this.$emit("addHandle", false);
      //         }
      //       });
      //       break;
      //     // 行规则
      //     case "hang":
      //       API.addRowRules(params).then(data => {
      //         if (data.code === "0") {
      //           this.$emit("addHandle", true);
      //         } else {
      //           this.$emit("addHandle", false);
      //         }
      //       });
      //       break;
      //     // 字段规则
      //     case "zd":
      //       API.addFieldRules(params).then(data => {
      //         if (data.code === "0") {
      //           this.$emit("addHandle", true);
      //         } else {
      //           this.$emit("addHandle", false);
      //         }
      //       });
      //       break;
      //     // 数据集
      //     case "sjj":
      //       let _params = {
      //         dataSetId: this.formData.id,
      //         ruleId: this.activeRuleObj.id,
      //         ruleType: this.activeRuleObj.info.ruleTypeName,
      //         ruleTypeId: this.activeRuleObj.info.ruleTypeId,
      //         ruleValue: JSON.stringify({
      //           ...this.form
      //         }),
      //         ruleContent: `${this.paramsDic}`,
      //         impInterface: this.activeRuleObj.info.impInterface
      //       };
      //       API.ruleSaveDataSetRule(_params).then(res => {
      //         let data = res.data;
      //         if (data.code === 200) {
      //           this.$emit("addHandle", true);
      //         } else {
      //           this.$emit("addHandle", false);
      //         }
      //       });
      //       break;
      //     default:
      //       break;
      //   }
      // }
      // if (this.handleType === "bj") {
      //   API.updateRules(params).then(data => {
      //     if (data.code === "0") {
      //       this.$emit("addHandle", true);
      //       this.$message({
      //         message: "编辑成功",
      //         type: "success"
      //       });
      //     } else {
      //       this.$emit("addHandle", false);
      //       this.$message({
      //         message: "编辑失败",
      //         type: "error"
      //       });
      //     }
      //   });
      // }
    },
    // handleClose () {
    //     this.$emit("closeDialog");
    // }
    // 添加-文本域+远程获取
    add(item) {
      this.innerVisible = true;
      this.checkListOption = [];
      if (item.range && item.range.length) {
        this.checkListOption = item.range;
      }
      console.log(this.checkListOption);
    },
    handleAll() {
      if (this.checkList.length) {
        // 取消
        this.checkList = [];
      } else {
        // 全选
        this.checkListOption.forEach((item) => {
          this.checkList.push(item.code);
        });
      }
      this.innerVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.params-preview {
  .search-input {
    width: auto;
    height: auto;
    position: relative;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    padding-bottom: 30px;
    border-radius: 4px;
    /deep/ .el-input__inner {
      border: 0;
    }
    .el-button--text {
      position: absolute;
      bottom: -5px;
      right: 5px;
    }
  }
  form {
    min-height: 60px;
  }
  /deep/ .el-form-item__label {
    padding-right: 10px;
  }
  /deep/ .el-dialog__header {
    height: 40px;
    line-height: 40px;
    background-color: #01c1df;
  }
}
</style>