<!--
 * @Author: zhangxd-i
 * @Date: 2020-11-03 15:46:21
 * @LastEditTime: 2020-11-13 10:57:27
 * @LastEditors: zhangxd-i
 * @Description: 标讯查询
-->
<template>
  <div class="bx-search">
     <!-- 头部查询 -->
    <div class="header-search">
      <div>
        <span class="label-style">筛选结果：</span>
        <span v-show="dynamicTags.length === 0" class="defaultStyle">默认</span>
        <el-tag
          v-for="(tag, index) in dynamicTags"
          :key="index"
          closable
          @close="closeTag(tag)">
          {{tag.label}}
        </el-tag>
        <span 
          v-show="dynamicTags.length !== 0"
          @click="clearOption"
          class="el-icon-delete"
          style="cursor: pointer; color:#1F5191">
          清空
        </span>
      </div>
      <div>
        <el-input placeholder="请输入关键词内容" v-model="searchText" style="width:330px">
          <el-select v-model="selSeachType" slot="prepend" placeholder="请选择" style="width:90px">
            <el-option
              v-for="(item, index) in searchTypes"
              :key="index"
              :label="item.scopeName"
              :value="item.scopeCode">
            </el-option>
          </el-select>
          <el-button type="primary" slot="append" icon="el-icon-search" class="btn-seacrch" @click="getStandardTable"></el-button>
        </el-input>
      </div>
    </div>
    <!-- 筛选条件 -->
    <search-form
      :isClearTag="isClearTag"
      :formData="formData"
      :formOption="formOption"
      :isClearCheckBox="isClearCheckBox"
      @changeButton="changeButton"
      @upDataTime="upDataTime" />
    <div v-show="!isShowNoData">
      <div class="form-sort">
        <tipTitle :contentText="titleText"/>
        <el-radio-group v-model="tabSort" @change="changeSort">
          <el-radio-button label="ASC"><b class="el-icon-sort-up"></b>时间正序</el-radio-button>
          <el-radio-button label="DESC"><b class="el-icon-sort-down"></b>时间降序</el-radio-button>
        </el-radio-group>
      </div>
      <!-- table 表格 -->
      <gld-table
          :isCardTable="true"
          :isShowBorder="false"
          :tableLoading="tableLoading"
          :pagination="pagination"
          :pageSize="pageSize"
          :pageNum="pageNum"
          :soltName="soltName"
          :tableData="tableData"
          :tableName="tableName"
          :totalPage="totalCount"
          @changePage="changePage">
          <template v-for="column of tableName" slot="before">
              <el-table-column
                  align="center"
                  :key="column.prop"
                  :label="column.label"
                  :prop="column.prop"
                  show-overflow-tooltip
                  v-if="column.prop == 'title'"
                  width="200">
                  <template slot-scope="scope">
                    <span v-html="scope.row.title" @click="jumpDetail(scope.row)" style="cursor: pointer;"></span>
                  </template>
              </el-table-column>
          </template>
      </gld-table>
    </div>
    <!-- 无数据提示 -->
    <no-data-tip v-show="isShowNoData" >
      <div class="no-data-content">
        <h1>抱歉！未找到相关的数据</h1>
        <h6>建议您</h6>
        <p>1.切换筛选项；</p>
        <p>2.修改查询关键词。</p>
      </div>
    </no-data-tip>
  </div>
</template>

<script>
import api from 'api'
import SearchForm from './search-form'
import jsonData from '@/assets/json/bd.json'
import TipTitle from '@/components/bd/tip-title'
import GldTable from '@/components/bd/table'
import NoDataTip from '@/components/bd/no-data-tip'
export default {
  components:{
    GldTable,
    SearchForm,
    TipTitle,
    NoDataTip
  },
  props:{},
  data(){
    return {
      titleText: '',
      isClearTag: false,
      isClearCheckBox: false,
      searchText: '',
      selSeachType: '1',
      timeRange: [],
      // 折叠
      zdName: '收起',
      activeNames: ["1"],
      // table表格
      soltName: ['title'],
      isShowNoData: true,
      tableLoading: false,
      tableData: [],
      tableName: [],
      pageNum: 1,
      pageSize: 20,
      pagination: [20,30,40,50],
      totalCount: 0,
      // 标签数据
      dynamicTags: [],
      // 检索条件
      formData: [
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
          type: '2',
          label: '行业类型',
          prop: 'selIndustry',
          sort: '3',
          data: []
        },
        {
          type: '1',
          label: '公告类型',
          prop: 'selNotice',
          sort: '4',
          data: []
        },
        {
          type: '1',
          label: '时间范围',
          prop: 'selTimeType',
          sort: '5',
          data: []
        }
      ],
      // 条件数据
      provinceData: [],
      cityData: [],
      industryData: [],
      noticeData: [],
      timeTypeData: [],
      // 默认 条件
      formOption: {
        selProvince: '',
        selCity: '',
        selIndustry: [''],
        selNotice: '',
        selTimeType: '1',
      },
      currProvince: '',
      tabSort: 'ASC', // 排序
      searchTypes: []
    }
  },
  computed:{},
  async created(){
    await this.getOption();
    await this.getFormOptin();
    this.getStandardTable();
  },
  async mounted() {
    this.pageSizes = [20, 30]
    this.getStandardTable();
  },
  methods:{
    // 获取选项数据
    async getOption() {
      await this.getSearchType();
      await this.getProvinceList();
      await this.getCityList();
      await this.getInstriesList();
      await this.getAnnouncementTypeList();
      await this.getTimeType();
    },
    // 恢复默认
    clearOption() {
      this.formOption = {
        selProvince: '',
        selCity: '',
        selIndustry: [''],
        selNotice: '',
        selTimeType: '1',
      };
      this.dynamicTags = [];
      this.isClearTag = true;
      this.isClearCheckBox = true;
      this.getStandardTable();
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
          case 'selNotice':
            currItem.data = this.noticeData
            break;
          case 'selTimeType':
            currItem.data = this.timeTypeData
            break;
          default:
            break;
        }
      }
    },
    // 更改筛选条件
    changeButton(formOptin, selTagData, currPricData, arr2) {
      this.isClearTag = false;
      // 如果没有标签数据时 显示默认
      if(selTagData.length === 0) {
        this.dynamicTags = [];
        return;
      }
      // 当所在省 不是全国时，获取市
      let currTag = selTagData[selTagData.length-1]
      if(currPricData !== '' && currPricData.sort === '1') {
        // 切换省时 清空市
        this.formOption.selCity = '';
        if(arr2.length > 0) selTagData.splice(1,1);
        this.currProvince =currPricData.code;
        this.getCityList();
      }
      // 获取标签数据
      this.dynamicTags = [];
      for(let i=0; i<selTagData.length; i++) {
        this.dynamicTags.push(selTagData[i]);
      }
      // 获取更新后的 筛选条件
      this.formOptin = formOptin;
      this.getStandardTable();
    },
    // 更新时间
    upDataTime(timeRange) {
      this.timeRange = timeRange;
      this.getStandardTable();
    },
    // 关闭标签
    closeTag(tag) {
      if(tag.code === '') return;
      switch (tag.sort) {
        case '1':
          this.formOption.selProvince = '';
          break;
        case '2':
          this.formOption.selCity = '';
          break;
        case '3':
          let selIndustry = this.formOption.selIndustry;
          selIndustry.splice(selIndustry.indexOf(tag.code), 1);
          console.log(selIndustry.length)
          if(selIndustry.length === 1 && selIndustry[0] === ''){
            this.isClearCheckBox = true;
          }else {
            this.isClearCheckBox = false;
          };
          break;
        case '4':
          this.formOption.selNotice = '';
          break;
        case '5':
          this.formOption.selTimeType = '1';
          break;
        default:
          break;
      };
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.getStandardTable();
    },
    // 获取搜索类型
    async getSearchType() {
      api.getSearchScopeList().then(res=>{
        if(res.data.code === 0) {
          this.searchTypes = res.data.data;
        }
      }).catch(err=>{
        console.log(err)
      })
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
          this.formData[1].data = cityList;
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
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 获取公告类型
    async getAnnouncementTypeList() {
      await api.getAnnouncementTypeList().then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          let noticeList = [{label: '全部', code: ''}];
          for(let i = 0; i<resData.length; i++) {
            let currObj = {
              label: resData[i].name,
              code: resData[i].code
            };
            noticeList.push(currObj);
          }
          this.noticeData = noticeList;
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 获取时间类型
    async getTimeType() {
      await api.getTimeType().then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          let timeTypeData = [];
          for(let i = 0; i<resData.length; i++) {
            let currObj = {
              label: resData[i].scopeName,
              code: resData[i].scopeCode
            };
            timeTypeData.push(currObj);
          }
          timeTypeData.push({label: '自定义', code: 'auto'});
          this.timeTypeData = timeTypeData;
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 获取结果 列表
    getStandardTable() {
      this.tableLoading = true;
      let formOption = this.formOption;
      let params = {
        "provinceCode": formOption.selProvince !== '' ? [formOption.selProvince] : [''],
        "cityCode": formOption.selCity !== '' ? [formOption.selCity] : [''],
        "industriesType": formOption.selIndustry,
        "announcementType": formOption.selNotice !== '' ? [formOption.selNotice] : [''],
        "timeScope": formOption.selTimeType !== '' ? formOption.selTimeType : [''],
        "startTime": formOption.selTimeType !== '' ? this.timeRange[0] : '',
        "endTime": formOption.selTimeType !== '' ? this.timeRange[1] : '',
        "searchScope": this.searchText !== '' ? this.selSeachType : '',
        "keyword": this.searchText,
        "pageNum": this.pageNum,
        "pageSize": this.pageSize,
        "sortBy": this.tabSort
      }
      api.getStandardTable(params).then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          if(resData && resData.data && resData.data.length !== 0) {
            this.tableData = resData.data;
            this.tableName = resData.title;
            this.totalCount = resData.total;
            this.titleText = `为您搜索到以下符合条件的标讯：约为<span style="color:#1F5191">${this.totalCount}</span>个`;
            this.isShowNoData = false;
            this.tableLoading = false;
          }else{
            this.isShowNoData = true;
            this.tableLoading = false;
          }
        }
      }).catch(err=>{
        this.isShowNoData = true;
        console.log(err)
      })
    },
    // 更改排序
    changeSort(data) {
      this.tabSort = data;
      this.getStandardTable();
    },
    // 更改页数
    changePage(val) {
      this.pageNum = val.currentPage;
      this.pageSize = val.pageSize;
      this.getStandardTable();
    },
    // 跳转详情
    jumpDetail(rowData) {
      this.$router.push({
        query:{
          "id": rowData.id,
          "cityName": rowData.cityName,
          "industriesTypeName": rowData.industriesTypeName,
          "provinceName": rowData.provinceName,
          "releaseTime": rowData.releaseTime,
          "announcementTypeName": rowData.announcementTypeName
        },
        path: '/bd/bx-search-details'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/platform/bd/bx-search/index.scss';
</style>