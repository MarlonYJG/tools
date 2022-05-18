<!--
 * @Author: zhangxd-i
 * @Date: 2020-11-03 15:46:21
 * @LastEditTime: 2020-12-14 16:43:25
 * @LastEditors: Marlon
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
    <div v-for="(searchItem, index) in formData" :key="index">
      <div class="screen-item" v-if="searchItem.type !== '3' && searchItem.data && searchItem.data.length !== 0">
        <span class="item-label">{{searchItem.label !== '' ? searchItem.label+'：' : ''}}</span>
        <!-- 单选框 -->
        <el-radio-group
            v-if="searchItem.type === '1'"
            v-model="formOption[searchItem.prop]" 
            fill="#1F5191"
            class="item-group"
            @change="changeButton($event, searchItem)">
            <el-radio-button
                v-for="(item, index) in searchItem.data"
                :key="index"
                :label="item.code">
                {{item.label}}
            </el-radio-button>
        </el-radio-group>
        <!-- 多选框 -->
        <el-checkbox-group
            v-if="searchItem.type === '2'"
            v-model="formOption[searchItem.prop]" 
            fill="#1F5191"
            class="item-group" 
            @change="changeButton($event, searchItem)">
          <span :class="{'all-base-style': true, 'all-select': isSelectAll}" @click="changeButton($event, searchItem)">全部</span>
          <el-checkbox-button 
              v-for="(item, index) in formData[2].data" 
              :label="item.code" 
              :key="index">
            {{item.label}}
          </el-checkbox-button>
          <el-checkbox-button :disabled="true">(可多选)</el-checkbox-button>
        </el-checkbox-group>
      </div>
      <!-- 时间范围 -->
      <div v-if="searchItem.type === '3'" class="screen-item">
        <span class="item-label">{{searchItem.label !== '' ? searchItem.label+'：' : ''}}</span>
        <div class="item-group">
          <el-radio-group
              v-model="formOption[searchItem.prop]" 
              fill="#1F5191"
              @change="changeButton($event, searchItem)">
              <el-radio-button
                  v-for="(item, index) in searchItem.data"
                  :key="index"
                  :label="item.code">
                  {{item.label}}
              </el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="selTime"
            :type="timeType"
            :format="quarterFormat"
            :value-format="valueFormat"
            :placeholder="placeholder"
            @change="changeTime">
          </el-date-picker>
        </div>
        
      </div>
    </div>
    
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
    },
    // 关闭标签
    closeTag: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      isSelectAll: true,
      isShowAutoTime: false, // 是否显示自定义时间
      selFormData: [],
      historyProp: '',
      timeType: 'month',
      placeholder: '选择月',
      quarterFormat: '',
      valueFormat: 'yyyy-MM',
      // 时间范围
      selTime: '',
    }
  },
  methods:{
    changeButton(selData, itemData) {
      // 判断时间类型
      if(itemData.type === '3') {
        this.selTime = '';
        this.quarterFormat = '';
        switch (selData) {
          case 'natural_week':
            this.timeType = 'month';
            this.placeholder = '选择月';
            this.valueFormat = 'yyyy-MM';
            break;
          case 'natural_month':
            this.timeType = 'quarter';
            this.placeholder = '选择季度';
            this.valueFormat = 'yyyy-MM';
            this.quarterFormat = 'yyyy 第 Q 季度'
            
            break;
          case 'natural_quarter':
            this.timeType = 'year';
            this.placeholder = '选择年';
            this.valueFormat = 'yyyy';
          default:
            break;
        }
      }
      this.$emit('changeButton', selData, itemData, this.formOption);
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
  }
  .label-style {
    font-weight: 600;
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