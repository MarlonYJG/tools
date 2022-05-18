<!--
 * @Author: Marlon
 * @Date: 2020-11-05 09:12:07
 * @LastEditors: zhangxd-i
 * @LastEditTime: 2020-11-25 14:45:34
 * @Description: 指标查询
-->
<template>
  <div class="index-query">
      <!-- 筛选条件 -->
    <search-form
      :formData="formData"
      :formOption="formOption"
      @changeButton="changeButton"
      @upDataTime="upDataTime" />
    <div class="zb-item">
      <span class="zb-query" @click="queryInfo">查询指标</span>
    </div>
    <tipTitle :contentText="titleText" style="margin: 20px 0;"/>
    <!-- table 表格 -->
    <gld-table
          v-show="!isShowNoData"
          :isCardTable="true"
          :isShowBorder="false"
          :isShowPage="false"
          :tableLoading="tableLoading"
          :pagination="pagination"
          :pageSize="pageSize"
          :pageNum="pageNum"
          :tableData="tableData"
          :tableName="tableName"
          :totalPage="totalCount" />
    <!-- 无数据提示 -->
    <no-data-tip v-show="isShowNoData" alignment="column">
      <div class="no-data-content">
        <h1>暂无指标数据！</h1>
      </div>
    </no-data-tip>
  </div>
</template>

<script>
import api from 'api'
import SearchForm from './search-form'
import TipTitle from '@/components/bd/tip-title'
import GldTable from '@/components/bd/table'
import NoDataTip from '@/components/bd/no-data-tip'
export default {
  components: {
    SearchForm,
    TipTitle,
    GldTable,
    NoDataTip
  },
  data() {
    return {
      // form 条件数据
      formData: [
          {
            type: '1',
            label: '指标类型',
            prop: 'selIndexType',
            sort: '1',
            data: [
              {label: '交易额', code: 'tradeAmount'},
              {label: '交易量', code: 'tradeCount'}
            ]
          },
          {
            type: '1',
            label: '所在省市',
            prop: 'selProvince',
            sort: '1',
            data: []
          },
          {
            type: '1',
            label: '',
            prop: 'selCity',
            sort: '2',
            data: []
          },
          {
            type: '1',
            label: '行业类型',
            prop: 'selIndustry',
            sort: '3',
            data: []
          },
          {
            type: '3',
            label: '时间周期',
            prop: 'selTimeType',
            sort: '3',
            data: [
              {label: '自然周', code: 'natural_week'},
              {label: '自然月', code: 'natural_month'},
              {label: '自然季度', code: 'natural_quarter'}
            ]
          },
      ],
      formOption: {
        selIndexType: 'tradeAmount',
        selProvince: '',
        selCity: '',
        selIndustry: '',
        selTimeType: 'natural_week',
      },
      selTime: '',
      // table 数据
      isShowNoData: true,
      tableLoading: false,
      tableData: [],
      tableName: [],
      pageNum: 1,
      pageSize: 20,
      pagination: [20,30,40,50],
      totalCount: 0,
      
      titleText: '指标查询结果',
      // 筛选条件
      provinceData: [],
      cityList: [],
      industryData: []
    }
  },
  async created() {
    await this.getOption();
    await this.getFormOptin();
  },
  methods: {
    queryInfo() {
      if(this.selTime === '') {
        this.$message({
          message: '请选择时间！',
          type: 'warning'
        });
        return false;
      }
      this.getTableData();
    },
    // 更改筛选条件
    changeButton(selData, itemData, formOption) {
      if(itemData.prop === 'selProvince') {
        this.formOption.selCity = '';
        this.currProvince = selData;
        this.getCityList();
      }
      // 重置时间
      if(itemData.type === '3') this.selTime = '';
      // 获取更新后的 筛选条件
      this.formOption = formOption;
    },
    // 获取table 数据
    getTableData() {
      this.tableLoading = true;
      let formOption = this.formOption;
      let params = {
        "IndustryType": formOption.selIndustry,
        "provinceCode": formOption.selProvince,
        "cityOrAreaCode": formOption.selCity,
        "indicatorType": formOption.selIndexType,
        "timeType": formOption.selTimeType,
        "timeString": this.selTime
      };
      api.indexSearch(params).then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          this.tableData = resData.data;
          this.tableName = resData.title;
          this.totalCount = resData.total;
          this.isShowNoData = resData.total === 0 ? true : false;
          this.tableLoading = false;
        }
      }).catch(err=>{
        this.tableLoading = false;
        console.log(err);
      })
    },
    // 更新时间
    upDataTime(time) {
      this.selTime = time;
    },
    // 初始化页数
    initPage() {
      this.pageNum = 1;
      this.pageSize = 20;
    },
    // 获取选项数据
    async getOption() {
      await this.getProvinceList();
      await this.getCityList();
      await this.getInstriesList();
    },
    // 获取 选中筛选条件
    getFormOptin() {
      for(let i=0; i<this.formData.length; i++) {
        let currItem = this.formData[i];
        switch (currItem.prop) {
          case 'selProvince':
            currItem.data = this.provinceData
            break;
          case 'selCity':
            currItem.data = this.cityData
            break;
          case 'selIndustry':
            currItem.data = this.industryData
            break;
          default:
            break;
        }
      };
    },
     // 获取 省
    async getProvinceList() {
      await api.getProvinceList().then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          let provinceList = [{label: '全国', code: ''}];
          for(let i = 0; i<resData.length; i++) {
            let currObj = {
              label: resData[i].provinceName,
              code: resData[i].provinceCode
            };
            provinceList.push(currObj);
          }
          this.provinceData = provinceList;
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    // 获取 市
    async getCityList() {
      await api.getCityList({"provinceCode": this.currProvince}).then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          let cityList = [];
          for(let i = 0; i<resData.length; i++) {
            let currObj = {
              label: resData[i].cityName,
              code: resData[i].cityCode
            };
            cityList.push(currObj);
          }
          if (cityList.length !== 0) cityList.unshift({label: '全部', code: ''});
          // 更新 市级数据
          this.cityData = cityList;
          this.formData[2].data = cityList;
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 获取 行业类型
    async getInstriesList() {
      await api.getInstriesList().then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          let instriesList = [];
          for(let i = 0; i<resData.length; i++) {
            let currObj = {
              label: resData[i].name,
              code: resData[i].code
            };
            instriesList.push(currObj);
          }
          this.industryData = instriesList;
          this.formOption.selIndustry = instriesList[0].code;
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  }
  
}
</script>

<style lang="scss" scope>
@import "~@/assets/css/platform/bd/index-query/index.scss";
</style>