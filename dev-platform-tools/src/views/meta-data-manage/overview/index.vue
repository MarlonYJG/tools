<!--
 * @Author: Marlon
 * @Date: 2020-02-18 10:42:42
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-08 14:36:08
 * @Description: 默认主页
 -->
 <template>
  <el-row :gutter="12" class="card">
    <el-col :span="6">
      <el-card shadow="always">
        <div class="card-icon-lt card-1" @click="handle({url:'/metaData/whole/statistics'})">
          <i class="el-icon-document card-icon"></i>
        </div>
        <div class="card-icon-rt" @click="handle({url:'/metaData/whole/statistics'})">
          <div>
            <countTo :startVal="0" :endVal="totalProjectCount" :duration="3000" :decimals="0"></countTo>
          </div>
          <span>总项目数</span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="always">
        <div class="card-icon-lt card-2" @click="handle({url:'/metaData/maintain/library'})">
          <i class="el-icon-document card-icon"></i>
        </div>
        <div class="card-icon-rt" @click="handle({url:'/metaData/maintain/library'})">
          <div>
            <countTo :startVal="0" :endVal="totalDbCount" :duration="3000" :decimals="0"></countTo>
          </div>
          <span>总数据库个数</span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="always">
        <div class="card-icon-lt card-3" @click="handle({url:'/metaData/maintain/table'})">
          <i class="el-icon-document card-icon"></i>
        </div>
        <div class="card-icon-rt" @click="handle({url:'/metaData/maintain/table'})">
          <div>
            <countTo :startVal="0" :endVal="totalTableCount" :duration="3000" :decimals="0"></countTo>
          </div>
          <span>总数据表个数</span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="always">
        <div class="card-icon-lt card-4" @click="handle({url:'/metaData/maintain/tableInfo'})">
          <i class="el-icon-document card-icon"></i>
        </div>
        <div class="card-icon-rt" @click="handle({url:'/metaData/maintain/tableInfo'})">
          <div>
            <countTo :startVal="0" :endVal="totalColumnCount" :duration="3000" :decimals="0"></countTo>
          </div>
          <span>总字段个数</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
 
 <script>
import countTo from "vue-count-to";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { cellJump } from "utils/jump";

export default {
  components: {
    countTo
  },
  data() {
    return {
      totalProjectCount: 0,
      totalDbCount: 0,
      totalTableCount: 0,
      totalColumnCount: 0
    };
  },
  methods: {
    handle({ url }) {
      cellJump(this, {
        TClickItem: [
          {
            link: url,
            jump: {
              type: "int",
              mode: "push"
            }
          }
        ]
      });
    }
  },
  mounted() {
    API.POverview()
      .then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if (Res) {
          this.totalProjectCount = Number(Res.totalProjectCount);
          this.totalDbCount = Number(Res.totalDbCount);
          this.totalTableCount = Number(Res.totalTableCount);
          this.totalColumnCount = Number(Res.totalColumnCount);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
};
</script>
 
<style lang="scss" scoped>
.card {
  /deep/ .el-card__body {
    height: 150px;
    cursor: pointer;
    display: flex;
  }
  &-icon-lt {
    float: left;
    width: 120px;
    text-align: center;
  }
  &-icon-rt {
    flex: 1;
    float: left;
    text-align: center;
    & > div {
      height: 110px;
      font-size: 25px;
      color: #515a6e;
      &::before {
        display: inline-block;
        content: "";
        height: 100%;
        vertical-align: middle;
      }
      span {
        font-size: 30px;
        position: relative;
        top: 15px;
        display: inline-block;
        width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    & > span {
      font-size: 16px;
      color: #515a6e;
    }
  }
  &-icon {
    font-size: 50px;
    margin: 50px 0;
    color: #fff;
  }
  // 颜色
  .card-1 {
    background: rgb(45, 140, 240);
  }
  .card-2 {
    background: rgb(25, 190, 107);
  }
  .card-3 {
    background: rgb(255, 153, 0);
  }
  .card-4 {
    background: rgb(154, 102, 228);
  }
}
</style>