<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-11-03 10:49:08
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-07 09:27:52
 * @Description: 标道首页-添加订阅/修改订阅
-->
<template>
  <div v-if="dialogVisible">
    <Dialog
      :title="headerTitle"
      :propsDialogVisible="dialogVisible"
      dialogWidth="709px"
      @close="resetForm"
      @submit="submit"
    >
      <div class="dialog-content">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <!-- 订阅名称 -->
          <el-form-item
            label="订阅名称："
            class="form-input ruleNoneIcon"
            prop="dyName"
            :class="[isShowWord ? 'noneMargin' : '']"
          >
            <input
              v-model="ruleForm.dyName"
              placeholder="请输入订阅名称，不超过10个字"
              class="input-dy"
              @input="FormInputEvent"
              :class="[isShowWord ? 'input-dy-waring' : '']"
            />
            <span v-show="isShowWord" class="ruleWord">不超过10个字</span>
          </el-form-item>
          <!-- 关键词 -->
          <el-form-item
            label="关键词："
            label-width="70px"
            prop="importWord"
            class="ruleIcon"
          >
            <el-row class="form-import">
              <el-col>
                <input
                  placeholder="关键词1"
                  v-model="ruleForm.importWord1"
                  class="input-dy"
                  :class="[
                    ruleForm.importWord1.trim().length > 10
                      ? 'input-dy-waring1'
                      : ''
                  ]"
                  @input="FormInputEventGc"
                />
              </el-col>
              <el-col>
                <input
                  placeholder="关键词2"
                  v-model="ruleForm.importWord2"
                  class="input-dy"
                  :class="[
                    ruleForm.importWord2.trim().length > 10
                      ? 'input-dy-waring2'
                      : ''
                  ]"
                  @input="FormInputEventGc"
                />
              </el-col>
              <el-col>
                <input
                  placeholder="关键词3"
                  v-model="ruleForm.importWord3"
                  class="input-dy"
                  :class="[
                    ruleForm.importWord3.trim().length > 10
                      ? 'input-dy-waring3'
                      : ''
                  ]"
                  @input="FormInputEventGc"
                />
              </el-col>
            </el-row>
            <el-row class="form-import">
              <el-col>
                <input
                  placeholder="关键词4"
                  v-model="ruleForm.importWord4"
                  class="input-dy"
                  :class="[
                    ruleForm.importWord4.trim().length > 10
                      ? 'input-dy-waring4'
                      : ''
                  ]"
                  @input="FormInputEventGc"
                />
              </el-col>
              <el-col>
                <input
                  placeholder="关键词5"
                  v-model="ruleForm.importWord5"
                  class="input-dy"
                  :class="[
                    ruleForm.importWord5.trim().length > 10
                      ? 'input-dy-waring5'
                      : ''
                  ]"
                  @input="FormInputEventGc"
                />
              </el-col>
              <el-col>
                <input
                  placeholder="关键词6"
                  v-model="ruleForm.importWord6"
                  class="input-dy"
                  :class="[
                    ruleForm.importWord6.trim().length > 10
                      ? 'input-dy-waring6'
                      : ''
                  ]"
                  @input="FormInputEventGc"
                />
              </el-col>
            </el-row>
            <el-row class="form-word">
              <el-col>
                <p :class="[isShowGc ? 'input-waring' : '']">
                  注：至少填写一个，每个关键词不超过10个字。
                </p>
              </el-col>
              <el-col>
                <p>
                  可通过"+"号来设置复合词，表示两者均包含的关系，例如：高铁+建筑。
                </p>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 所在省市 -->
          <el-form-item label="所在省市：" class="form-cascader" prop="cityAll">
            <el-cascader
              v-model="ruleForm.cityAll"
              :options="optionsCity"
              :props="defaultParams"
              clearable
              collapse-tags
              :collapse-tags-max-num="2"
            >
            </el-cascader>
          </el-form-item>
          <!-- 行业类型 -->
          <el-form-item
            label="行业类型："
            prop="industryType"
            class="ruleIcon itemError"
          >
            <el-row :gutter="20">
              <el-col :span="2" class="form-checkAll">
                <el-checkbox
                  :indeterminate="isIndeterminateIntype"
                  v-model="checkAllIntype"
                  @change="handleCheckAllChangeIntype"
                  >全选</el-checkbox
                >
              </el-col>
              <el-col :span="18">
                <el-checkbox-group
                  v-model="ruleForm.industryType"
                  @change="handleCheckedCitiesChangeIntype"
                >
                  <el-checkbox
                    v-for="item in citiesIntypeArr"
                    :label="item.code"
                    :key="item.code"
                    >{{ item.name }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 公告类型 -->
          <el-form-item
            label="公告类型："
            prop="noticeType"
            class="ruleIcon itemError"
          >
            <el-row :gutter="20">
              <el-col :span="2" class="form-checkAll">
                <el-checkbox
                  :indeterminate="isIndeterminateNotice"
                  v-model="checkAllNotice"
                  @change="handleCheckAllChangeNotice"
                  >全选</el-checkbox
                >
              </el-col>
              <el-col :span="18">
                <el-checkbox-group
                  v-model="ruleForm.noticeType"
                  @change="handleCheckedCitiesChangeNotice"
                >
                  <el-checkbox
                    v-for="item in citiesNoticeArr"
                    :label="item.code"
                    :key="item.code"
                    >{{ item.name }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 搜索范围 -->
          <el-form-item
            label="搜索范围："
            prop="searchRange"
            class="ruleNoneIcon_fw"
          >
            <el-radio-group v-model="ruleForm.searchRange">
              <el-radio :label="item.scopeCode" v-for="item in searchRangeArr" :key="item.scopeCode">{{item.scopeName}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
import Dialog from "@/components/bd/dialog";
import api from "api";

export default {
  computed: {
    ...mapGetters({
      dialogVisible: "dialogVisible_ter",
      headerTitle: "dialogTitle_ter",
      defaultRuleForm: "ruleForm_ter"
    }),
    cityOptionsIntype() {
      let arr = [];
      this.citiesIntypeArr.length && this.citiesIntypeArr.forEach((item)=>{
        arr.push(item.code);
      })
      return arr;
    },
    cityOptionsNotice() {
      let arr = [];
      this.citiesNoticeArr.length && this.citiesNoticeArr.forEach((item)=>{
        arr.push(item.code);
      })
      return arr;
    }
  },
  data() {
    return {
      // 弹框订阅信息
      ruleForm: {},
      // 订阅名称
      isShowWord: false,
      // 所在省市
      defaultParams: {
        value: 'id',
        multiple: true
      },
      // 关键词
      isShowGc: false,
      // 行业类型
      isIndeterminateIntype: false,
      checkAllIntype: false,
      // 公告类型
      isIndeterminateNotice: false,
      checkAllNotice: false,
      // 规则
      rules: {
        cityAll: [{ required: true, message: "请选择地区", trigger: "change" }],
        industryType: [
          { required: true, message: "至少选择一项", trigger: "change" }
        ],
        noticeType: [
          { required: true, message: "至少选择一项", trigger: "change" }
        ]
      }
    };
  },
  props: {
    optionsCity: {
      type: Array,
      default: function() {
        return []
      }
    },
    citiesIntypeArr: {
      type: Array,
      default: function() {
        return []
      }
    },
    citiesNoticeArr: {
      type: Array,
      default: function() {
        return []
      }
    },
    searchRangeArr: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  components: {
    Dialog
  },
  methods: {
    ...mapMutations([
      'DY_OPRN_DIALOG'
    ]),
    // 弹框提交
    submit() {
      // 判断
      let {
        importWord1,
        importWord2,
        importWord3,
        importWord4,
        importWord5,
        importWord6,
        industryType,
        noticeType
      } = this.ruleForm;

      this.$refs["ruleForm"].validate(valid => {
        if (
          importWord1 ||
          importWord2 ||
          importWord3 ||
          importWord4 ||
          importWord5 ||
          importWord6
        ) {
          // console.log('至有填写一个');
        } else {
          this.isShowGc = true;
          return false;
        }

        if (industryType.length === 0) {
          return false;
        }

        if (noticeType.length === 0) {
          return false;
        }

        if (valid) {
          this.subscribeGroupAdd();
        }
      });
    },
    // 添加订阅
    subscribeGroupAdd() {
      let { 
        dyName, 
        importWord, 
        importWord1, 
        importWord2, 
        importWord3, 
        importWord4, 
        importWord5, 
        importWord6,
        cityAll,
        industryType, 
        noticeType,
        searchRange
      } = this.ruleForm;

      // 订阅名称
      let subscribeGroupName = "";
      if (dyName.trim()) {
        subscribeGroupName = dyName.trim();
      } else {
        if (importWord1.trim()) {
          subscribeGroupName = importWord1.trim();
        } else {
          if(importWord2.trim()) {
            subscribeGroupName = importWord2.trim();
          } else {
            if(importWord3.trim()) {
              subscribeGroupName = importWord3.trim();
            } else {
              if(importWord4.trim()) {
                subscribeGroupName = importWord4.trim();
              } else {
                if(importWord5.trim()) {
                  subscribeGroupName = importWord5.trim();
                } else {
                  if(importWord6.trim()) {
                    subscribeGroupName = importWord6.trim();
                  } else {
                    subscribeGroupName = "";
                  }
                }
              }
            }
          }
        }
      }

      // 关键词
      importWord = [];
      if (importWord1 && importWord1.trim()) {
        importWord.push(importWord1.trim());
      }
      if (importWord2 && importWord2.trim()) {
        importWord.push(importWord2.trim());
      }
      if (importWord3 && importWord3.trim()) {
        importWord.push(importWord3.trim());
      }
      if (importWord4 && importWord4.trim()) {
        importWord.push(importWord4.trim());
      }
      if (importWord5 && importWord5.trim()) {
        importWord.push(importWord5.trim());
      }
      if (importWord6 && importWord6.trim()) {
        importWord.push(importWord6.trim());
      }

      // 所在省市
      let provinceArr = [];
      let arrCityArr = [];
      cityAll.length && cityAll.forEach((item)=>{
        item.length && item.forEach((items, index)=>{
          if(index === 2) {
            provinceArr.push(items);
          } 
          if (index === 3) {
            arrCityArr.push(items);
          }
        })
      })

      let params = {
        subscribeGroupName, // 订阅名称
        keywordList: importWord, // 关键词列表
        provinceCodeList: Array.from(new Set(provinceArr)), // 省
        cityCodeList: Array.from(new Set(arrCityArr)), // 市
        industriesTypeList: industryType, // 行业类型
        announcementTypeList: noticeType, // 公告类型
        searchScope: searchRange // 搜索范围
      };

      api.subscribeGroupAdd(params).then(res=>{
        if (res.data.code === 0) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.resetForm();
          this.$emit('changeComponent');
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 重置
    resetForm() {
      this.DY_OPRN_DIALOG({
        type: false,
        isReset: true
      });

      this.isShowWord = false;
      this.isShowGc = false;
      this.radio = "1";

      this.isIndeterminateIntype = false;
      this.checkAllIntype = false;

      this.isIndeterminateNotice = false;
      this.checkAllNotice = false;
    },
    /* form-dialog */
    // 订阅名称
    async FormInputEvent(e) {
      let value = e.target.value.trim();
      if (value) {
        if (value.length > 10) {
          this.isShowWord = true;
        } else {
          this.isShowWord = false;
        }
      } else {
        this.isShowWord = false;
      }
    },
    // 关键词
    async FormInputEventGc(e) {
      let value = e.target.value.trim();
      if (value) {
        if (value.length > 10) {
          this.isShowGc = true;
        } else {
          this.isShowGc = false;
        }
      } else {
        this.isShowGc = false;
      }
    },
    // 行业类型
    handleCheckAllChangeIntype(val) {
      this.ruleForm.industryType = val ? this.cityOptionsIntype : [];
      this.isIndeterminateIntype = false;
    },
    handleCheckedCitiesChangeIntype(value) {
      let checkedCount = value.length;
      this.checkAllIntype = checkedCount === this.citiesIntypeArr.length;
      this.isIndeterminateIntype =
        checkedCount > 0 && checkedCount < this.citiesIntypeArr.length;
    },
    // 公告类型
    handleCheckAllChangeNotice(val) {
      this.ruleForm.noticeType = val ? this.cityOptionsNotice : [];
      this.isIndeterminateNotice = false;
    },
    handleCheckedCitiesChangeNotice(value) {
      let checkedCount = value.length;
      this.checkAllNotice = checkedCount === this.citiesNoticeArr.length;
      this.isIndeterminateNotice =
        checkedCount > 0 && checkedCount < this.citiesNoticeArr.length;
    }
  },
  created() {
    this.ruleForm = JSON.parse(JSON.stringify(this.defaultRuleForm));
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/bd/config.scss";
$px_12: 12px;
$color_999: #999;
$color_f00: #f00;

/* 弹框 */
.dialog-content {
  width: 100%;

  // 输入框样式
  .input-dy {
    width: 100%;
    height: 34px;
    border: 1px solid #d2d2d2;
    outline: 0;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .input-waring {
    color: $color_f00 !important;
  }
  .input-dy-waring {
    border-color: $color_f00 !important;
  }
  @for $i from 1 through 6 {
    .input-dy-waring#{$i} {
      border-color: $color_f00 !important;
    }
  }

  // 订阅名称
  .noneMargin {
    margin-bottom: 0 !important;
  }
  .form-input {
    .ruleWord {
      font-size: $px_12;
      color: $color_f00;
    }
  }

  // 关键词
  .ruleIcon {
    /deep/ .el-form-item__label:before {
      content: "*";
      color: #ff4b53;
      margin-right: 4px;
    }
  }
  .ruleNoneIcon {
    /deep/ .el-form-item__label:before {
      content: "";
      // margin-right: 4px;
    }
  }
  .ruleNoneIcon_fw {
    /deep/ .el-form-item__label:before {
      content: "";
      margin-left: 12px;
    }
  }
  .form-import {
    .el-col {
      width: 32.2%;
      margin-right: 10px;
    }
    .el-col:last-child {
      margin-right: 0;
    }
  }
  .form-import:first-child {
    margin-bottom: 10px;
  }
  .form-word {
    margin-top: 5px;
    .el-col {
      p {
        color: $color_999;
        line-height: 18px;
        font-size: 12px;
      }
    }
  }

  // 复选框
  /deep/ .el-col {
    padding: 0 !important;
  }
  .form-checkAll {
    margin-right: 6px;
  }
  .itemError {
    /deep/ .el-form-item__error {
      top: 33px;
      left: 73px;
    }
  }
  // 所在省市
  .form-input,
  .form-cascader {
    display: flex;
    /deep/ .el-form-item__content {
      flex: 1;
    }
    /deep/ .el-cascader {
      width: 100%;
    }
  }
}
</style>
