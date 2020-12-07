<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-11-03 10:49:08
 * @LastEditors: zhangxd-i
 * @LastEditTime: 2020-11-16 16:47:45
 * @Description: 个人中心=》我的收藏
-->
<template>
  <div class="my-collection">
    <div v-if="!isShowNoData">
      <el-row justify="start" align="top" :gutter="12" >
        <el-col :span="24" :offset="0" :push="0" :pull="0" >
          <el-row justify="start" align="top" :gutter="10" class="collection-header">
            <el-col :span="12" :offset="0" :push="0" :pull="0">
              <tip-title :contentText="titleText" />
            </el-col>
            <el-col :span="12" :offset="0" :push="0" :pull="0" class="hearder-right">
              <div>
                <span>公告类型：</span>
                <el-select v-model="selNotice" placeholder="请选择" class="ui-w118" @change="upDataTable">
                  <el-option
                    v-for="item in noticeData"
                    :key="item.code"
                    :label="item.label"
                    :value="item.code">
                  </el-option>
                </el-select>
              </div>
              <div>
                <span>行业类型：</span>
                <el-select v-model="selIndustry" placeholder="请选择" class="ui-w118" @change="upDataTable">
                  <el-option
                    v-for="item in industryData"
                    :key="item.code"
                    :label="item.label"
                    :value="item.code">
                  </el-option>
                </el-select>
              </div>
              <el-input placeholder="请输入标讯关键词" v-model="searchText" class="search">
                <el-button type="primary" slot="append" icon="el-icon-search" class="btn-seacrch" @click="upDataTable" />
              </el-input>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-row justify="start" align="top" :gutter="10" >
        <!-- table 表格 -->
        <gld-table
            :isCardTable="true"
            :isShowBorder="false"
            :isDynamicSort="true"
            :sortProp="sortProp"
            :tableLoading="tableLoading"
            :soltName="soltName"
            :tableData="tableData"
            :tableName="tableName"
            :totalPage="totalCount"
            :pagination="pagination"
            :pageSize="pageSize"
            :pageNum="pageNum"
            @sortChange="sortChange"
            @changePage="changePage">
            <template v-for="column of tableName" slot="after">
                <el-table-column
                    align="center"
                    :key="column.prop"
                    :label="column.label"
                    :prop="column.prop"
                    show-overflow-tooltip
                    v-if="column.prop == 'operation'"
                    >
                    <template slot-scope="scope">
                      <span @click="delData(scope.row)" style="cursor: pointer; color:#1F5191">删除</span>
                    </template>
                </el-table-column>
            </template>
        </gld-table>
      </el-row>
      
    </div>
    <!-- 无数据提示 -->
    <no-data-tip v-if="isShowNoData" alignment="column">
      <div class="no-data-content">
        <h1>您未收藏任何标讯！</h1>
        <el-button type="primary" @click="jumpBx">立即查看标讯</el-button>
      </div>
    </no-data-tip>
  </div>
</template>

<script>
import api from 'api'
import { getUserInfo } from '@/utils/common'
import TipTitle from "@/components/bd/tip-title"
import GldTable from '@/components/bd/table'
import NoDataTip from '@/components/bd/no-data-tip'
export default {
  //接收传入数据
  props: [],
  //引入混淆js
  mixins: [],
  //import引入的组件需要注入到对象中才能使用
  components: {
    TipTitle,
    GldTable,
    NoDataTip
  },
  data() {
    //这里存放数据
    return {
      titleText: '',
      // 公告类型
      selNotice: '',
      noticeData: [], 
      // 行业类型
      selIndustry: '',
      industryData: [],
      searchText: '', // 搜索内容
      // table数据
      soltName: ['operation'],
      sortProp: ['releaseTime', 'updatedTime'],
      tableData: [],
      tableName: [],
      totalCount: 0,
      tableLoading: false,
      pageSize: 10,
      pageNum: 1,
      pagination: [10, 20, 30, 40, 50],
      sortValue: '',
      sortName: '',
      isShowNoData: false,
      isDelete: 0,
      deleteId: ''
    };
  },
  //方法集合
  methods: {
    // 是否新用户 （2：新用户；4：不是新用户） 
    getCode() {
      api.getCode({"userId": getUserInfo().userId}).then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          if(resData.code === '2') {
            this.isShowNoData = true;
          }else {
            this.isShowNoData = false;
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 更新页数
    changePage(pageData) {
      this.pageNum = pageData.currentPage;
      this.pageSize = pageData.pageSize;
      this.getTable();
    },
    // 排序
    sortChange(name, sortType) {
      this.sortName = name === 'releaseTime' ? '1' : '2';
      this.sortValue = sortType;
      this.pageNum = 1;
      this.pageSize = 10;
      this.getTable();
    },
    // 获取 行业类型
    async getInstriesList() {
      await api.getInstriesList().then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          let instriesList = [{label: '全部', code: ''}];
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
    // 更新 table
    upDataTable() {
      // 初始化页数
      this.pageNum = 1;
      this.pageSize = 10;
      this.isDelete = 0;
      this.getTable();
    },
    // 获取 table数据
    async getTable() {
      this.tableLoading = true;
      let params = {
        "userId": getUserInfo().userId,
        "keyword": this.searchText,
        "sortBy": this.sortValue,
        "sortField": this.sortName,
        "pageNum": this.pageNum,
        "pageSize": this.pageSize,
        "searchScope": "1",
        "industriesType":[this.selIndustry],
        "announcementType":[this.selNotice],
        "isDelete": this.isDelete,
        "deleteId": this.isDelete === 1 ? this.deleteId : ''
      };
      await api.getCollectionsTable(params).then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          this.tableData = resData.data;
          this.tableName = resData.title;
          this.tableName.push({prop: "operation", label: "操作"})
          this.totalCount = resData.total;
          this.titleText = `共收藏 <span style="color:#1F5191">${this.totalCount}</span> 条标讯`;
          this.tableLoading = false;
        }
      }).catch(err=>{
        this.tableLoading = false;
        console.log(err);
      })
    },
    // 删除
    delData(data) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isDelete = 1;
        this.deleteId = data.id;
        this.getTable();
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 跳转标讯
    jumpBx() {
      this.$router.push('/bd/bx-search');
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  async created() {
    await this.getCode();
    if(!this.isShowNoData) {
      await this.getInstriesList();
      await this.getAnnouncementTypeList();
      await this.getTable();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/platform/bd/index-personal/my-collection";
</style>
