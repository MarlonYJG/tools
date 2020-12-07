<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-11-03 10:49:08
 * @LastEditors: zhangxd-i
 * @LastEditTime: 2020-11-13 16:35:33
 * @Description: 个人中心=》我的信息
-->
<template>
  <div class="my-information">
    <!-- 个人信息 -->
    <div class="user-info">
      <div></div>
      <div>
        <p style="font-size: 16px">欢迎您，尊敬的标道用户！{{userName}}</p>
        <div class="bd-info">
          <div class="info-left">
            <p><span>所在企业：</span><b>{{userInfo.companyName}}</b></p>
            <p><span>统一社会代码：</span><b>{{userInfo.bidderCode}}</b></p>
            <p><span>姓名：</span><b>{{userInfo.trueName}}</b></p>
            <p><span>职务：</span><b>{{userInfo.position}}</b></p>
          </div>
          <div class="info-right" @click="openEditDig">编辑企业信息</div>
        </div>
      </div>
    </div>
    <div class="collection-subscribe">
      <!-- 我的收藏 -->
      <div>
        <div class="my-collection">
          <tip-title contentText="我的收藏"></tip-title>
          <span style="color: #1F5191; cursor: pointer;" v-if="!isCollectionNoData" @click="jumpCollection">查看更多</span>
        </div>
        <!-- table 表格 -->
        <div class="collection-table" v-show="!isCollectionNoData">
          <gld-table
              :isCardTable="true"
              :isShowBorder="false"
              :isShowPage="false"
              :tableLoading="tableLoading"
              :tableData="tableData"
              :tableName="tableName">
          </gld-table>
        </div>
        <!-- 无数据提示 -->
        <no-data-tip v-show="isCollectionNoData" alignment="column">
          <div class="no-data-content">
            <h1>您未收藏任何标讯！</h1>
            <el-button type="primary" @click="jumpBx">立即添加收藏</el-button>
          </div>
        </no-data-tip>
        
      </div>
      <!-- 我的订阅 -->
      <div>
        <div class="my-subscribe">
          <tip-title contentText="我的订阅"></tip-title>
          <span style="color: #1F5191; cursor: pointer;" v-if="!isSubscribeNoData" @click="jumpSubscribe">查看更多</span>
        </div>
        <div v-show="!isSubscribeNoData">
          <!-- 今日新增 -->
          <div class="total-add">
            <div class="total-add-item">
              <div>
                <span></span>
                <span>今日新增（条）</span>
              </div>
              <span @click="jumpSubscribe" style="cursor: pointer">{{subscribeData.todayAdd}}</span>
            </div>
          </div>
          <!-- 七日新增 -->
          <div class="day7-add">
            <div class="day7-add-item">
              <div>
                <span></span>
                <span>最近7日新增（条）</span>
              </div>
              <span @click="jumpSubscribe" style="cursor: pointer">{{subscribeData.sevendayAdd}}</span>
            </div>
          </div>
        </div>
        <!-- 无数据提示 -->
        <no-data-tip v-show="isSubscribeNoData" alignment="column">
          <div class="no-data-content">
            <h1>您未收藏任何标讯！</h1>
            <el-button type="primary" @click="jumpSubscribe">立即添加订阅</el-button>
          </div>
        </no-data-tip>
      </div>
    </div>
    <Dialog
      title="企业信息"
      :propsDialogVisible="dialogVisible"
      dialogWidth="709px"
      @close="closeDialog"
      @submit="getIndividualInfo">
      <el-form label-width="130px" :model="formData">
        <el-form-item label="企业名称：">
          <el-input v-model="formData.companyName" class="ui-w542"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码：">
          <el-input v-model="formData.bidderCode" class="ui-w542"></el-input>
        </el-form-item>
        <el-form-item label="职务：">
          <el-input v-model="formData.position" class="ui-w542"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名：">
          <el-input v-model="formData.trueName" class="ui-w542"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import api from 'api'
import { getUserInfo } from '@/utils/common'
import Dialog from "@/components/bd/dialog"
import TipTitle from "@/components/bd/tip-title"
import GldTable from '@/components/bd/table'
import NoDataTip from '@/components/bd/no-data-tip'
export default {
  components: {
    TipTitle,
    GldTable,
    Dialog,
    NoDataTip
  },
  data() {
    return {
      userName: '',
      tableData: [],
      tableName: [],
      tableLoading: false,
      userInfo: {},
      subscribeData: {},
      dialogVisible: false,
      formData: {
        "companyName": '',
        "bidderCode": '',
        "trueName": '',
        "position": ""
      },
      isEdit: "0",
      isCollectionNoData: false, // 我的收藏有无数据
      isSubscribeNoData: false // 我的订阅有无数据
    }
  },
  mounted() {
    this.getIndividualInfo();
  },
  methods: {
    // 个人信息
    getIndividualInfo() {
      let formData = this.formData;
      let params = {
         "userId": getUserInfo().userId,
         "isEdit": this.isEdit,
         "companyName": formData.companyName,
         "bidderCode": formData.bidderCode,
         "trueName": formData.trueName,
         "position": formData.position
      };
      api.individualInfo(params).then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          // 用户信息
          this.userInfo = {
            "companyName": resData.companyName && resData.companyName !== '' ? resData.companyName : '暂无',
            "bidderCode": resData.bidderCode && resData.bidderCode !== '' ? resData.bidderCode : '暂无',
            "trueName": resData.trueName && resData.trueName !== '' ? resData.trueName : '暂无',
            "position": resData.position && resData.position !== '' ? resData.position : '暂无'
          };
          this.userName = resData.name
          // 我的收藏
          if(resData.bidDocDetailDtos && resData.bidDocDetailDtos.length > 0) {
            this.tableData = resData.bidDocDetailDtos;
            this.tableName = resData.title;
            this.isCollectionNoData = false;
          }else {
            this.isCollectionNoData = true;
          }
          // 我的订阅
          if(resData.mySubscribe) {
            this.subscribeData = resData.mySubscribe;
            this.isSubscribeNoData = false;
          }else {
            this.isSubscribeNoData = true;
          }
          if(this.isEdit === '1') {
            this.$message({
              message: '编辑成功！',
              type: 'success'
            });
            this.dialogVisible = false;
          }
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    // 打开编辑弹框
    openEditDig() {
      this.dialogVisible = true;
      this.isEdit = "1";
      let userInfo = this.userInfo;
      this.formData = {
        "companyName": userInfo.companyName === '暂无' ? '' : userInfo.companyName,
        "bidderCode": userInfo.bidderCode === '暂无' ? '' : userInfo.bidderCode,
        "trueName": userInfo.trueName === '暂无' ? '' : userInfo.trueName,
        "position": userInfo.position === '暂无' ? '' : userInfo.position
      }
    },
    closeDialog() {
      this.isEdit = "0";
      this.dialogVisible = false;
    },
    // 跳转收藏
    jumpCollection() {
      this.$router.push('/bd/index-personal/my-collection');
    },
    // 跳转标讯
    jumpBx() {
      this.$router.push('/bd/bx-search')
    },
    // 跳转我的订阅
    jumpSubscribe() {
      this.$router.push('/bd/index-personal/my-subscriptions')
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/bd/index-personal/my-information";
</style>
