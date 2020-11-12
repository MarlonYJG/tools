<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-05-27 15:07:12
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-09-28 10:39:03
 * @Description: 项目名称
--> 
<template>
  <div>
    <el-dialog
      :title="FDTitle"
      :visible.sync="IsDialogVisible"
      :width="FDWidth===''? null:`${FDWidth}px`"
      class="form_dialog"
      @close="close"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" :ref="FDId" class="TDForm">
        <!-- threeSelect -->
        <div class="threeSelectBox">
          <el-form-item label="所属项目：" prop="selectProject">
            <el-select
              v-model="form.selectProject"
              @change="ProjectChange_log"
              class="w310_cell"
              :disabled="form.isdisabled"
            >
              <el-option
                v-for="(items, i) in areaListCenterArr"
                :key="i"
                :label="items.label"
                :value="items.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属业务板块：" prop="selectPlate">
            <el-select
              v-model="form.selectPlate"
              @change="PlateChange_log"
              class="w310_cell"
              :disabled="form.isdisabled"
            >
              <el-option
                v-for="(items, i) in plateListCenterArr"
                :key="i"
                :label="items.label"
                :value="items.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="数据域：" prop="selectYu" label-width="92px">
          <el-select
            v-model="form.selectYu"
            @change="YuChange_log"
            class="w310_cell"
            :disabled="form.isdisabled"
          >
            <el-option
              v-for="(items, i) in dataManyListCenter"
              :key="i"
              :label="items.label"
              :value="items.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 第一步 -->
        <div class="selectOneBox">
          <p class="font_cell">选择同域下的指标</p>
          <div class="selectOneBox-t flex_cell">
            <el-form-item label="指标来源名称：" prop="selectFinger">
              <el-select
                v-model="form.selectFinger"
                class="w310_cell"
                :disabled="isShow"
                @change="FingerChange_log"
              >
                <el-option
                  v-for="(items, i) in selectFingerArr"
                  :key="i"
                  :label="items.indicatorSourceName"
                  :value="items.indicatorSourceId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单位：" prop="company">
              <el-input
                v-model="form.company"
                placeholder="文本输入"
                class="w310_cell"
                :disabled="isShow"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <!-- 第二步 -->
        <div>
          <p class="font_cell">选择时间修饰词</p>
          <div class="selectTwoBox">
            <el-form-item label="时间值（可多选）：" prop="manyTime" :label-width="labelWidth">
              <el-checkbox-group v-model="form.manyTime" :disabled="form.isdisabled">
                <el-checkbox
                  v-for="(item,index) in slectTimeArr"
                  :label="item.value"
                  :key="index"
                >{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div class="flex_cell">
            <el-form-item label="选择时间口径：" prop="aftetTime" :label-width="labelWidth">
              <el-select
                v-model="form.aftetTime"
                class="w310_cell"
                :disabled="form.isdisabled"
                placeholder="请选择首次公告时间"
              >
                <el-option
                  v-for="(items, i) in aftetTimeArr"
                  :key="i"
                  :value="items.columnCode"
                  :label="items.columnComment ? items.columnComment: items.columnCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!-- 第三步 -->
        <div>
          <p class="font_cell">选择地域修饰词</p>
          <div class="flex_cell">
            <el-form-item
              label="地域修饰词（单选）："
              prop="domentDress"
              class="ctop10_cell"
              style="width:390px;height:45px;"
            >
              <el-select
                v-model="form.domentDress"
                style="200px"
                :disabled="form.isdisabled"
                @change="domentDressChange"
              >
                <el-option
                  v-for="items in domentDressArr"
                  :key="items.dimensionId"
                  :label="items.dimensionName"
                  :value="items.dimensionId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="checkBoxItem" v-if="cities.length">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="form.checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
              <el-checkbox-group v-model="form.checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox
                  v-for="city in cities"
                  :label="city.code"
                  :key="city.code"
                >{{city.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>
        <!-- 第四步 -->
        <div>
          <p class="font_cell">选择对应维度（默认维度值都纳入计算）</p>
          <el-form-item
            label="维度选择（多选）："
            prop="dimensionSelect"
            class="ctop10_cell"
            :label-width="labelWidth"
          >
            <div v-for="(item,index) in checkoutBoxArr" :key="index">
              <el-checkbox
                v-model="item.checkAll"
                :indeterminate="item.isIndeterminate"
                @change="handleCheckAllChangeEvent(item)"
              >{{item.dimensionName}}</el-checkbox>
              <span @click="showDev(item)" style="cursor:pointer;" v-if="item.dimensionValueList.length">{{item.isShowDev ? '收起' : '展开'}}</span>
              <div v-show="item.isShowDev">
                <el-checkbox-group
                  v-model="item.checkedCities"
                  @change="handleCheckedCitiesChangeEvent(item)"
                >
                  <el-checkbox
                    v-for="city in item.dimensionValueList"
                    :label="city.code"
                    :key="city.code"
                  >{{city.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="isShowFooter">
        <el-button type="primary" @click="btnSumit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
import { formatGetArr } from "utils";
import API from "api";
import { ResDatas } from "utils/res-format";
const forms = {
  selectProject: "", // 选择项目
  selectPlate: "", // 业务板块
  selectYu: "", // 数据域名称
  // 第一步
  selectFinger: "", // 指标来源名称
  company: "", // 单位
  // 第二步
  manyTime: [], // 时间值可多选
  aftetTime: "", // 公告时间 - 选择时间口径
  // 第三步
  domentDress: "", // 地域修饰词
  checkAll: true, // 全选
  checkedCities: [],
  // 第四步
  dimensionSelect: [], // 维度多选
  isdisabled: false // 是否禁用
};
export default {
  name: "derivedDialog",
  data() {
    return {
      form: {
        selectProject: "", // 选择项目
        selectPlate: "", // 业务板块
        selectYu: "", // 数据域名称
        // 第一步
        selectFinger: "", // 指标来源名称
        company: "", // 单位
        // 第二步
        manyTime: [], // 时间值可多选
        aftetTime: "", // 公告时间
        // 第三步
        domentDress: "", // 地域修饰词
        checkAll: true, // 全选
        checkedCities: [],
        // 第四步
        dimensionSelect: [], // 维度多选
        isdisabled: false // 是否禁用
      },
      // 第二部
      aftetTimeArr: [], // 事件口径之后的公告时间
      tmSelectOptArr: [],
      // 第三部
      isIndeterminate: true,
      domentDressArr: [], // 地域时间修饰词
      cities: [], // 多选框列表
      // 第四步
      // 选择维度
      checkoutBoxArr: [],
      newA: [], // 单独存放维度选择数据
      rules: {
        selectProject: [
          {
            required: true,
            message: "请选择所属项目",
            trigger: "change"
          }
        ],
        selectPlate: [
          {
            required: true,
            message: "请选择所属业务板块",
            trigger: "change"
          }
        ],
        selectYu: [
          {
            required: true,
            message: "请选择数据域",
            trigger: "change"
          }
        ],
        // 第一步
        selectFinger: [
          {
            required: true,
            message: "请选择指标来源名称",
            trigger: "change"
          }
        ],
        company: [
          {
            required: true,
            message: "请选择单位",
            trigger: "blur"
          }
        ],
        // 第二部
        manyTime: [
          {
            required: true,
            message: "请选择时间值",
            trigger: "change"
          }
        ],
        aftetTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        // 第四步
        // domentDress: [
        //   {
        //     required: true,
        //     message: "请选择地域修饰词",
        //     trigger: "change"
        //   }
        // ]
      },
      IsDialogVisible: false, // 控制弹出框显示
      labelWidth: "150px"
    };
  },
  watch: {
    FDVisible(newVal) {
      this.IsDialogVisible = newVal;
    },
    parForm: {
      handler(newVal, oldVal) {
        // TODO:优化
        this.checkoutBoxArr = [];
        this.$set(this.form, "domentDress", "");
        this.$set(this.form, "checkAll", true);
        this.$set(this.form, "checkedCities", []);

        this.isIndeterminate = true;
        this.domentDressArr = [];
        this.cities = [];

        if (_.isEmpty(newVal)) {
          this.form = _.cloneDeep(forms);
        } else {
          Object.assign(this.form, _.cloneDeep(newVal));
        }
      },
      deep: true
    },
    "form.selectFinger": {
      deep: true,
      handler() {
        // TODO:优化
        // 地域与维度选择清空
        this.checkoutBoxArr = [];
        this.$set(this.form, "domentDress", "");
        this.$set(this.form, "checkAll", true);
        this.$set(this.form, "checkedCities", []);

        this.isIndeterminate = true;
        this.domentDressArr = [];
        this.cities = [];
      }
    }
  },
  computed: {
    isShow() {
      return this.FDTitle == "查看派生指标"
        ? true
        : this.FDTitle == "编辑派生指标" || this.FDTitle == "新建派生指标"
        ? false
        : true;
    }
  },
  props: {
    // 标题
    FDTitle: {
      type: String,
      default: ""
    },
    // 显示隐藏
    FDVisible: {
      type: Boolean,
      default: false
    },
    // 弹出框宽度
    FDWidth: {
      type: String,
      default: ""
    },
    // 表单信息
    parForm: {
      type: Object,
      default: {}
    },
    // 表单ID
    FDId: {
      type: String,
      default: ""
    },
    // 弹框是否展示页脚
    isShowFooter: {
      type: Boolean,
      default: true
    },
    // 选择项目数组
    areaListCenterArr: {
      type: Array,
      default: []
    },
    // 业务板块
    plateListCenterArr: {
      type: Array,
      default: []
    },
    // 数据域
    dataManyListCenter: {
      type: Array,
      default: []
    },
    // 指标来源
    selectFingerArr: {
      type: Array,
      default: []
    },
    // 多选时间-时间修饰词
    slectTimeArr: {
      type: Array,
      default: []
    }
  },
  methods: {
    // 点击确定
    btnSumit() {
      this.$refs[this.FDId].validate(valid => {
        if (valid) {
          let newA = [];
          this.checkoutBoxArr &&
            this.checkoutBoxArr.forEach(item => {
              if(item.checkAll || item.isIndeterminate) {
                newA.push({
                  dimensionId: item.dimensionId,
                  dimensionValueList: item.checkedCities
                });
              }
            });
          this.newA = newA;
          this.$emit("submitForm", this.form, this.FDTitle, this.newA);
        }
      });
    },
    // 弹框关闭
    close() {
      if (this.FDId) this.$refs[this.FDId].resetFields();
      this.newA = [];
      this.$emit("editBtnCb", {
        label: "close",
        close: this.IsDialogVisible
      });
    },

    // 选择项目下拉发生改变时
    ProjectChange_log() {
      let val = this.form.selectProject;
      this.$set(this.form, "selectPlate", "");
      this.$set(this.form, "selectYu", "");
      this.$set(this.form, "selectFinger", "");
      if (val) {
        this.$emit("sunSelectChangeCallback", {
          val,
          type: "selectProject"
        });
      }
    },
    // 业务板块下拉列表改变时
    PlateChange_log() {
      let val = this.form.selectPlate;
      this.$set(this.form, "selectYu", "");
      this.$set(this.form, "selectFinger", "");
      if (val) {
        this.$emit("sunSelectChangeCallback", {
          val,
          type: "selectPlate"
        });
      }
    },
    // 数据域下拉列表改变时
    YuChange_log() {
      let val = this.form.selectYu;
      this.$set(this.form, "selectFinger", "");
      if (val) {
        this.$emit("sunSelectChangeCallback", {
          val,
          type: "selectYu"
        });
      }
    },
    // 选择指标来源名称下拉切换
    FingerChange_log() {
      let val = this.form.selectFinger;
      let str = null;
      this.selectFingerArr.forEach(item => {
        if (item.indicatorSourceId == val) {
          str = item.dataSetId;
        }
      });
      this.getAftetTime(str);
      this.getRegionQualifier();
      this.getDimension();
    },

    // ------------第二步----------------
    // 首次公共时间
    getAftetTime(str) {
      API.aftetTime_send({
        dataSetId: str, // 数据集id
        dimensionOrMeasure: 0, // 0维度 1 度量
        isGetDictData: 0, // 是否关联字典表
        isOnlyReturnTimeField: 1 //是否只返回时间字段
      })
        .then(res => {
          let Res = new ResDatas({
            res,
            code: 0
          }).init();
          if(Res){
            Res.map(item => {
              item.columnComment = `${item.columnCode}(${item.columnComment})`;
            });
            this.aftetTimeArr = Res;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // -------------第三步----------------
    // 地域修饰词下拉列表
    domentDressChange() {
      let val = this.form.domentDress;
      let arr = [];
      this.domentDressArr.forEach(item => {
        if (item.dimensionId == val) {
          arr = item.dimensionValueList;
        }
      });
      this.cities = arr;
      // 默认全选
      this.handleCheckAllChange(true);
      this.$set(this.form, "checkAll", true);
    },
    // 点击全选框操作
    handleCheckAllChange(val) {
      this.isIndeterminate = false;

      let vals = this.form.domentDress;
      let arr = [];
      let wrapArr = [];
      this.domentDressArr.forEach(item => {
        if (item.dimensionId == vals) {
          arr = item.dimensionValueList;
        }
      });
      arr.forEach(element => {
        wrapArr.push(element.code);
      });
      if (val) {
        this.$set(this.form, "checkedCities", wrapArr);
      } else {
        this.$set(this.form, "checkedCities", []);
      }
    },
    // 点击复选框操作
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      let ischeckAll = checkedCount == this.cities.length;
      this.$set(this.form, "checkAll", ischeckAll);

      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    // 新增派生指标--获取地域修饰词列表
    getRegionQualifier() {
      API.regionQualifier_send({
        dataDomainId: this.form.selectYu, // 数据域id
        indicatorSourceId: this.form.selectFinger // 原子复合指标id
      })
        .then(res => {
          let Res = new ResDatas({
            res,
            code: 0
          }).init();
          if(Res){
           this.domentDressArr = Res;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // ---------------第四步---------------
    // 新增派生指标--获取维度列表
    getDimension() {
      API.dimension_send({
        dataDomainId: this.form.selectYu, // 数据域id
        indicatorSourceId: this.form.selectFinger // 原子复合指标id
      })
        .then(res => {
          let Res = new ResDatas({
            res,
            code: 0
          }).init();
          if(Res){
           // 找出code值供全选使用
            let newDataArr = [];
            for (let i = 0; i < Res.length; i++) {
                let ResI = Res[i];
                let arrs = [];
                if(ResI.dimensionValueList.length) {
                  Res[i].dimensionValueList.forEach(items => {
                    arrs.push(items.code);
                  });
                } else {
                  arrs = [];
                }
                newDataArr.push({
                dimensionId: ResI.dimensionId,
                dimensionName: ResI.dimensionName,
                dimensionValueList: ResI.dimensionValueList,
                checkAll: arrs.length ? true : false, // 是否全选
                isIndeterminate: false, // 不确定状态
                checkedCities: arrs, // 默认选择状态
                newCheckedCities: arrs, // 全选默认状态
                isShowDev: false //是否展示下面的数据
              });
            }
            this.checkoutBoxArr = newDataArr;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //点击全选按钮
    handleCheckAllChangeEvent(item) {
      item.isIndeterminate = false;
      if (item.checkAll) {
        item.checkedCities = item.newCheckedCities;
      } else {
        item.checkedCities = [];
      }
    },
    // 点击复选框之后
    handleCheckedCitiesChangeEvent(item) {
      let checkedCount = item.checkedCities.length;
      item.checkAll = checkedCount == item.newCheckedCities.length;
      item.isIndeterminate =
        checkedCount > 0 && checkedCount < item.newCheckedCities.length;
    },
    // 点击展开
    showDev(item) {
      item.isShowDev = !item.isShowDev;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.form_dialog {
  .font_cell {
    height: 21px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: rgba(85, 85, 85, 1);
    line-height: 21px;
    position: relative;
  }
  .w310_cell {
    width: 310px;
  }
  .font_cell::before {
    content: "";
    width: 3px;
    height: 16px;
    background: rgba(1, 193, 223, 1);
    position: absolute;
    top: 3px;
    left: -10px;
  }
  .flex_cell {
    display: flex;
    align-items: center;
  }
  .ctop10_cell {
    margin-top: 10px;
  }
  .TDForm {
    .threeSelectBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-form-item {
        display: flex;
      }
    }
    .selectOneBox {
      display: flex;
      flex-direction: column;
      &-t {
        display: flex;
        margin-top: 15px;
        height: 50px;
        padding-left: 30px;
        box-sizing: border-box;
        & > .el-form-item {
          display: flex;
          margin-right: 20px;
        }
      }
    }
    .selectTwoBox {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      &-c {
        display: flex;
        flex-direction: column;
        height: 50px;
      }
    }
    // 底部信息
    .foot-info {
      overflow: hidden;
    }
  }
  /deep/ .el-dialog__header {
    background: $form_dialog_header_bg;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;;
    padding: 0 15px;
    .el-dialog__title {
      font-size: 16px;
      color: $form_dialog_header_color;
    }
    .el-dialog__headerbtn {
      top: 14px;
      .el-icon-close {
        color: $form_dialog_header_color;
      }
    }
  }
  /deep/ .el-dialog__body {
    padding: 20px;
    box-sizing: border-boxs;
  }
  /deep/ .checkBoxItem > .el-form-item__content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  /deep/ .checkBoxItem > .el-form-item__content > .el-checkbox {
    margin-right: 20px;
    height: 45px;
  }
}
</style>
