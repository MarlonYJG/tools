<!--
 * @Author: Marlon
 * @Date: 2020-02-18 16:21:32
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-03 16:40:28
 * @Description: header
 -->
 <template>
  <el-header class="header">
    <div class="logo">
      <div class="logo-big"></div>
      <div class="logo-title" v-show="!HisCollapse">
        <span>广联达公共资源交易大数据分析平台</span>
        <span>Glodon Smart Trading</span>
      </div>
    </div>
    <div class="menu">
      <ul class="menu-list">
        <li
          v-for="(item, index) in headerList"
          :key="index"
          @click="handleSelect(item.url)"
        >
          <span :style="activeIndex === item.url ? 'color: #fff;' : null">{{
            item.title
          }}</span>
          <span :style="activeIndex === item.url ? 'color: #fff;' : null">{{
            item.icon
          }}</span>
          <b v-show="activeIndex === item.url" class="is-active"></b>
        </li>
      </ul>
    </div>
    <ul class="user">
      <li>
        <i class="user_icon"></i>
        <span>{{ userInfo.userName || "" }}</span>
      </li>
      <li @click="userEdit('pwd')">
        <i class="pwd_icon"></i>
        <span>修改密码</span>
      </li>
      <li @click="userEdit('out')">
        <i class="out_icon"></i>
        <span>退出</span>
      </li>
    </ul>
  </el-header>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
// import moduleName from '@/assets/img/author.png'
import system from "@/config/system.config.js";
import { Session, setToken } from "utils/lib";
import API from "api";

const { PROJECTKEY, LOGIN_PAGE_NAME, PLATFORM} = system;

export default {
  props: {
    HisCollapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isCollapse: false,
      showUser: false,
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
      systemList: "systemList",
    }),
    headerList() {
      return this.systemList;
    },
    activeIndex() {
      if (this.headerList.length) {
        let system = this.headerList;
        for (let index = 0; index < system.length; index++) {
          if (system[index].system === PLATFORM) {
            return system[index].url;
          }
        }
      }
    },
  },
  watch: {
    HisCollapse: function (newVal) {
      this.isCollapse = newVal;
    },
  },
  methods: {
    ...mapActions({
      getSystemFn: "getSystemList",
    }),
    userEdit(type) {
      if (type === "pwd") {
      } else {
        API.__publicLogout()
          .then((res) => {
            setToken("");
            sessionStorage.clear();
            window.location.replace(location.origin);
          })
          .catch((err) => {
            setToken("");
            sessionStorage.clear();
            window.location.replace(location.origin);
          });
      }
    },
    handleIcon() {
      this.$emit("Htarget", !this.isCollapse);
    },
    handleSelect(key, keyPath) {
      let systemName = "";
      this.systemList.forEach((item) => {
        if (key === item.url) {
          systemName = item.system;
        }
      });
      window.location.href = key;
    },
  },
  mounted() {
    this.getSystemFn();
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.header {
  box-sizing: border-box;
  overflow: hidden;
  background: $header_bg;
  color: $header_color;
  padding: 0;
  .logo {
    position: relative;
    z-index: 1;
    float: left;
    height: 60px;
    overflow: hidden;
    margin: 0 5px 0 0;
    & > div {
      float: left;
    }
    &-big {
      box-sizing: border-box;
      width: 25px;
      height: 28px;
      border-radius: 5px;
      line-height: 28px;
      margin: 14px auto;
      margin-right: 5px;
      text-align: center;
      box-sizing: border-box;
      background: url(../../assets/img/svg/logo.svg) no-repeat;
    }
    &-title {
      position: relative;
      top: 2px;
      box-sizing: border-box;
      margin: 20px auto;
      color: $header_title;
      font-size: 16px;
      letter-spacing: 2px;
      margin-left: 10px;
      font-family: PingFang-SC-Regular;
      span {
        &:nth-child(1) {
          position: relative;
          top: -10px;
        }
        &:nth-child(2) {
          position: absolute;
          top: 10px;
          left: 0;
          font-size: 10px;
          font-family: PingFang-SC-Light;
          letter-spacing: -0.5px;
          color: #bbbbbb;
        }
      }
    }
  }
  .menu {
    float: left;
    overflow: hidden;
    position: relative;
    z-index: 1;
    .icon-menu {
      float: left;
      margin: 15px;
      height: 26px;
      width: 26px;
      line-height: 26px;
      text-align: center;
      font-size: 25px;
      cursor: pointer;
      i {
        transition: transform 1s ease;
      }
    }
    &-list {
      overflow: hidden;
      background: transparent;
      li {
        float: left;
        margin-left: 5px;
        font-size: 14px;
        height: 60px;
        width: 80px;
        cursor: pointer;
        text-align: center;
        &:hover {
          color: #fff;
        }
        span {
          &:nth-child(1) {
            height: 27px;
            line-height: 25px;
            position: relative;
            top: 10px;
            display: inline-block;
            overflow: hidden;
          }
          &:nth-child(2) {
            height: 15px;
            line-height: 13px;
            display: block;
            font-size: 10px;
            position: relative;
            top: 3px;
            padding: 0 10px;
          }
        }
        .is-active {
          position: relative;
          bottom: 1px;
          display: inline-block;
          width: 100%;
          border-bottom: 5px solid $lt_menu_bg_active;
        }
      }
    }
  }
  .user {
    position: absolute;
    right: 20px;
    float: right;
    height: 60px;
    box-sizing: border-box;
    overflow: hidden;
    transition: height 0.3s ease;
    li {
      float: left;
      height: 60px;
      line-height: 60px;
      margin-right: 20px;
      font-size: 14px;
      &:nth-child(1) {
        span {
          margin-left: 5px;
        }
      }
      &:nth-child(2) {
        cursor: pointer;
        span {
          margin-left: 5px;
        }
        &:hover {
          color: #fff;
        }
      }
      &:last-child {
        margin-right: 0;
        cursor: pointer;
        span {
          margin-left: 5px;
        }
        &:hover {
          color: #fff;
        }
      }
      // 用户信息
      .user_icon {
        position: relative;
        top: 2px;
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url(../../assets/img/login/admin@14_14.png) no-repeat;
      }
      .pwd_icon {
        position: relative;
        top: 2px;
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url(../../assets/img/login/pwd@12_14.png) no-repeat;
      }
      .out_icon {
        position: relative;
        top: 2px;
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url(../../assets/img/login/out@14_14.png) no-repeat;
      }
    }
  }
}
</style>
