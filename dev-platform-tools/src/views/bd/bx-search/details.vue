<template>
  <div class="bx-search-detail">
    <el-row justify="start" align="top" :gutter="10">
      <el-col :span="24" :offset="0" :push="0" :pull="0">
        <span style="color:#999999">标讯查询 /</span>
        <span>{{articleTitle}}</span>
      </el-col>
    </el-row>
    <el-row class="bx-search-content" justify="start" align="top" :gutter="10">
      <el-col :span="24" :offset="0" :push="0" :pull="0">
        <el-row justify="start" align="top" :gutter="10">
          <el-col :span="24" :offset="0" :push="0" :pull="0">
            <p class="bx-search-title">
              {{articleTitle}}
            </p>
          </el-col>
        </el-row>
        <div class="bx-search-info">
          <div>
            <!-- <span>工程编号：F0SG202000316</span> -->
            <span>所在省市：{{area}}</span>
            <span>行业类型：{{industryType}}</span>
            <span>公告类型：{{announcementTypeName}}</span>
            <span>发布时间：{{releaseTime}}</span>
          </div>
          <el-button
              v-if="articleContent"
              @click="collection"
              class="el-icon-star-off"
              >
           {{isCollection==='0' ? '收藏' : '取消收藏'}}
          </el-button>
        </div>
      </el-col>
      <el-col class="bx-search-item">
        <div v-html="articleContent" v-if="articleContent && articleContent !== ''"></div>
        <!-- 无数据提示 -->
        <no-data-tip v-else >
          <h1 style="font-size: 18px;">抱歉！未找到相关的数据</h1>
        </no-data-tip>
      </el-col>
    </el-row>
    <!-- 对话框 -->
    <Dialog
      title="提示"
      dialogWidth="20%"
      class="dialog"
      :propsDialogVisible="dialogVisible"
      submitText="立即前往"
      @close="dialogVisible = false"
      @submit="jumpCollection">
      <div class="dialog-tip">
        <span class="el-icon-warning icon-warn"></span>
        <span>您的收藏已到达上限，可前往【我的收藏】 进行管理。</span>
      </div>
    </Dialog>
  </div>
</template>
<script>
import api from 'api'
import { getUserInfo } from '@/utils/common'
import Dialog from "@/components/bd/dialog"
import NoDataTip from '@/components/bd/no-data-tip'

export default {
  components: {
    NoDataTip,
    Dialog
  },
  data() {
    //这里存放数据
    return {
      dialogVisible: false,
      articleTitle: '',
      projectNumber: '',
      area: '',
      industryType: '',
      announcementTypeName: '',
      releaseTime: '',
      articleContent: '',
      isCollection: false,
      params:{}
    };
  },
  //方法集合
  methods: {
    // 获取公告标题
    getTitleContent() {
      let routerData = this.$route.query
      this.area = routerData.provinceName;
      this.industryType = routerData.industriesTypeName
      this.announcementTypeName = routerData.announcementTypeName;
      this.releaseTime = routerData.releaseTime
    },
    // 获取公告内容
    getBidDocDetail() {
      api.getBidDocDetail(this.params).then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          this.articleContent = resData.docContent;
          this.isCollection = resData.isUsable;
          this.articleTitle = resData.Title;
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    // 收藏
    collection() {
      api.actionCollect(this.params).then(res=>{
        if(res.data.code === 0) {
          let resData = res.data.data;
          if(resData.code === '3') {
            this.dialogVisible = true;
            return;
          }
          this.isCollection = resData.is_usable;
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 跳转我的收藏
    jumpCollection() {
      this.$router.push('/bd/index-personal/my-collection');
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    console.log();
    let routerData = this.$route.query;
    this.params = {
      "id": routerData.id,
      "userId": getUserInfo().userId
    };
    this.getTitleContent();
    this.getBidDocDetail();
  }
};
</script>
<style lang="scss" scoped>
@import '~@/assets/css/platform/bd/bx-search/details.scss';
</style>
