<!--
 * @Author: zhangxd-i
 * @Date: 2020-11-03 15:46:21
 * @LastEditTime: 2020-11-13 09:48:37
 * @LastEditors: zhangxd-i
 * @Description: 标讯查询组件

   1. 传入 formData的数据格式 
      type 状态 1：单选，2：多选
      prop 与 formOption 中的 字段名保持一致
      sort 当前选项 排在第几个 （有标签时有用）
      [
          {
            type: '1',
            label: '所在省市',
            prop: '自定义',
            sort: '1',
            data: []
          },
          {
            type: '2',
            label: '行业类型',
            prop: '自定义',
            sort: '3',
            data: []
          },
      ]
   2. 选择的 筛选条件（字段名自定义，与formData 保持一致）
      formOption: {
        '单选': 'all',
        '多选': ['all']
      },
-->
<template>
  <div class="search-form">
    <div>
      <!-- 省 -->
      <div class="screen-item">
        <el-radio-group 
            v-model="formOption.selProvince" 
            fill="#1F5191" 
            class="item-group"
            @change="changeButton($event, formData[0].data, formData[0].type, formData[0].prop, formData[0].sort)">
            <el-radio-button
                v-for="(item, index) in formData[0].data"
                :key="index"
                :label="item.code">
                {{item.label}}
            </el-radio-button>
        </el-radio-group>
      </div>
      <!-- 市 -->
      <div class="screen-item" v-if="formData[1].data && formData[1].data.length !==0">
        <el-radio-group 
            v-model="formOption.selCity" 
            fill="#1F5191" 
            class="item-group"
            @change="changeButton($event, formData[1].data, formData[1].type, formData[1].prop, formData[1].sort)">
            <el-radio-button
                v-for="(item, index) in formData[1].data"
                :key="index"
                :label="item.code">
                {{item.label}}
            </el-radio-button>
        </el-radio-group>
      </div>
      <el-collapse v-model="activeNames" class="own-collapse" @change="handleChange">
        <el-collapse-item name="1">
          <!-- 行业类型 -->
          <div class="screen-item">
            <el-checkbox-group
                v-model="formOption.selIndustry" 
                fill="#1F5191" 
                class="item-group" 
                @change="changeButton($event, formData[2].data, formData[2].type, formData[2].prop, formData[2].sort)">
              <span :class="{'all-base-style': true, 'all-select': isSelectAll}" @click="allSelect">全部</span>
              <el-checkbox-button 
                  v-for="(item, index) in formData[2].data" 
                  :label="item.code" 
                  :key="index">
                {{item.label}}
              </el-checkbox-button>
              <el-checkbox-button :disabled="true">(可多选)</el-checkbox-button>
            </el-checkbox-group>
          </div>
          <!-- 公告类型 -->
          <div class="screen-item">
            <el-radio-group 
                v-model="formOption.selNotice" 
                fill="#1F5191" 
                class="item-group"
                @change="changeButton($event, formData[3].data, formData[3].type, formData[3].prop, formData[3].sort)">
                <el-radio-button
                    v-for="(item, index) in formData[3].data"
                    :key="index"
                    :label="item.code">
                    {{item.label}}
                </el-radio-button>
            </el-radio-group>
          </div>
          <!-- 时间类型 -->
          <div class="screen-item">
            <el-radio-group 
                v-model="formOption.selTimeType" 
                fill="#1F5191" 
                class="item-group"
                @change="changeButton($event, formData[4].data, formData[4].type, formData[4].prop, formData[4].sort)">
                <el-radio-button
                    v-for="(item, index) in formData[4].data"
                    :key="index"
                    :label="item.code">
                    {{item.label}}
                </el-radio-button>
            </el-radio-group>
            <el-date-picker
              v-show="formOption.selTimeType === 'auto'"
              v-model="selTimeRange"
              :unlink-panels="true"
              :clearable="false"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeTime">
            </el-date-picker>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="click-collapse">{{zdName}}选项</div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{
    // form数据
    formData: {
      type: Array,
      default: []
    },
    // form 选择条件
    formOption: {
      type: Object,
      default: {}
    },
    // 是否清空标签
    isClearTag: {
      type: Boolean,
      defalut: false
    },
    // 是否取消多选
    isClearCheckBox: {
      type: Boolean,
      defalut: false
    }
  },
  data(){
    return {
      isSelectAll: true,
      isShowAutoTime: false, // 是否显示自定义时间
      selFormData: [],
      historyProp: '',
      // 折叠
      zdName: '收起',
      activeNames: ["1"],

      // 时间范围
      selTimeRange: [],

      // 仅限 有标签使用
      arr1: [],
      arr2: [],
      arr3: [],
      arr4: [],
      arr5: []
    }
  },
  watch:{
    isClearTag(data) {
      if(data) {
        this.isSelectAll = true;
        this.arr1 = [];
        this.arr2 = [];
        this.arr3 = [];
        this.arr4 = [];
        this.arr5 = [];
      }
    },
    isClearCheckBox(data) {
      if(data) {
        this.isSelectAll = true;
      }
    }
  },
  methods:{
    // 伸缩栏文案展示
    handleChange(val) {
      this.zdName = val.length !== 0 ? '收起' : '展开'
    },
    // 多选框 选择全部
    allSelect() {
      this.isSelectAll = true;
      this.arr3 = [];
      this.formOption.selIndustry = [''];
    },
    // 更改条件 selData: 选中的数据；optionData: 选项数据；type: 类型；prop: 字段; sort:次序
    changeButton(selData, optionData, type, prop, sort) {
      // ------- 当与标签 联动时， 使用此代码处理数据（start）-------
      let lastData = '';
      let currPricData = '';
      // 当为 多选时 处理数据
      if(type === '2') {
        this.arr3 = [];
        lastData = selData[selData.length-1];
        let formData = this.formOption[prop];
        // 当选择其他时，去掉全部, 否则选择全部
        if(lastData !== '') {
          this.isSelectAll = false;
          // 获取选中标签
          for(let i=0; i<selData.length; i++) {
            for(let j=0; j<optionData.length; j++) {
              if(selData[i] === optionData[j].code) {
                optionData[j].sort = '3';
                this.arr3.push(optionData[j]);
              }
            }
          }
        }else {
          this.isSelectAll = true;
        };
      }else {
        // 如果为 单选时 处理数据
        for(let i=0; i< optionData.length; i++) {
          let current = optionData[i];
          if(type === '1' && sort==='1' && current.code === selData) {
            current.sort = '1';
            this.arr1 = selData !== '' ? [current] : [];
            currPricData = current;
            continue;
          }else if(type === '1' && sort==='2' && current.code === selData) {
            current.sort = '2';
            this.arr2 = selData !== '' ? [current] : [];
            continue;
          }else if(type === '1' && sort==='4' && current.code === selData) {
            current.sort = '4';
            this.arr4 = selData !== '' ? [current] : [];
            continue;
          }else if(type === '1' && sort==='5' && current.code === selData) {
            current.sort = '5';
            this.arr5 = selData !== '' ? [current] : [];
            continue;
          }
        }
      }
      let newArr = this.arr1.concat(this.arr2,this.arr3,this.arr4,this.arr5);
      // console.log('111', lastData)
      // ------- 当与标签 联动时， 使用此代码处理数据（end）------- 
      this.$emit('changeButton', this.formOption, newArr, currPricData, this.arr2)
    },
    // 更新时间
    changeTime(data) {
      this.$emit('upDataTime', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.search-form{
  .screen-item {
    display: flex;
    margin-bottom: 15px;
    border-bottom: 1px dashed #D2D2D2;
    >span { 
      width: 80px;
      height: 32px;
      line-height: 32px;
    }
    .item-group {
      width: 1000px;
      padding-bottom: 15px;
    }
    .item-grop-time {
      width: auto;
    }
  }
  .label-style {
    font-weight: 600;
  }
  .own-collapse {
    position: relative;
  }
  .click-collapse {
    position: relative;
    left: 50%;
    top: -14px;
    transform: translateX(-50%);
    padding-left: 18px;
    width: 100px;
    height: 33px;
    line-height: 35px;
    text-align: center;
    box-sizing: border-box;
    background: #EFEFEF;
  }
  .all-base-style {
    display: inline-block;
    vertical-align: bottom;
    padding: 4px 20px;
    margin-right: 10px;
    font-size: 14px;
    cursor: pointer;
  }
  .all-select {
    color: #ffffff;
    background-color: #1F5191;
  }
  // 单选框 样式
  /deep/ .el-radio-button {
    margin-right: 10px;
  }
  /deep/ .el-radio-button__inner {
    border: none;
  }
  // 多选框样式
  /deep/ .el-checkbox-button__inner {
    border: none;
  }
  /deep/ .el-checkbox-button {
    margin-right: 10px;
  }
  // 下拉样式
  /deep/ .el-collapse {
    border: none;
    .el-collapse-item__arrow {
      position: absolute;
      transform: rotate(270deg);
    }
    .el-collapse-item__wrap {
      border: none;
    }
    .el-collapse-item__arrow.is-active {
      position: absolute;
      transform: rotate(90deg);
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
    .el-collapse-item__header {
      position: absolute;
      left: 47%;
      bottom: -12px;
      width: 74px;
      height: 20px;
      border: none;
      background: transparent;
      z-index: 1000;
    }
  }
}
</style>