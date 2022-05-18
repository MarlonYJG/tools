<!--
 * @Author: Marlon
 * @Date: 2020-02-18 16:21:32
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-14 17:05:37
 * @Description: header
 -->
 <template>
  <el-header class="header">
    <div class="logo">
      <div class="logo-title" v-show="!HisCollapse">
        <span></span>
      </div>
    </div>

    <div class="menu">
      <ul class="menu-list">
        <li
          v-for="(item, index) in headerList"
          :key="index"
          @click="handleSelect(item.url)"
          :class="activeIndex === item.url ? 'active' : ''"
        >
          <span>{{ item.title }}</span>
        </li>
      </ul>
    </div>
    <div class="user">
      <ul class="user-name">
        <li @mouseover="handleUser(true)" @mouseleave="handleUser(false)">
          <i class="user_icon">
            <el-avatar
              size="medium"
              :src="authorImg"
              key="circleUrl"
            ></el-avatar>
          </i>
          <span>
            您好！{{
              userInfo && userInfo.userInfo && userInfo.userInfo.user
                ? userInfo.userInfo.user.name || ""
                : ""
            }}</span
          >
        </li>
      </ul>
    </div>
    <transition name="el-zoom-in-top">
      <ul
        class="user-info"
        v-show="showUser"
        @mouseover="handleUser(true)"
        @mouseleave="handleUser(false)"
      >
        <li @click="userEdit('user')">
          <i class="pwd_icon"></i>
          <span>个人中心</span>
        </li>
        <li @click="userEdit('out')">
          <i class="out_icon"></i>
          <span>退出</span>
        </li>
      </ul>
    </transition>
  </el-header>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
// import moduleName from '@/assets/img/author.png'
import system from "@/config/system.config.js";
import { Session, setToken } from "utils/lib";
import API from "api";
let author = require("../../assets/icon/author@40_40.png");
const { PROJECTKEY, LOGIN_PAGE_NAME, PLATFORM } = system;

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
      authorImg: author,
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
      systemList: "systemList",
      activeIndex: "activeHeader",
    }),
    headerList() {
      return [
        {
          system: "home",
          icon: "",
          title: "首页",
          url: "/bd/home",
        },
        {
          system: "bxcx",
          icon: "",
          title: "标讯查询",
          url: "/bd/bx-search/",
        },
        {
          system: "zbcx",
          icon: "",
          title: "指标查询",
          url: "/bd/index/",
        },
      ];
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
      this.handleUser(false);
      if (type === "user") {
        this.$router.push({
          path: "/bd/index-personal",
        });
      } else {
        API.__publicLogout()
          .then((res) => {
            setToken();
            sessionStorage.clear();
            window.location.replace(location.origin + location.pathname);
          })
          .catch((err) => {
            setToken();
            sessionStorage.clear();
            window.location.replace(location.origin + location.pathname);
          });
      }
    },
    handleIcon() {
      this.$emit("Htarget", !this.isCollapse);
    },
    handleSelect(key, keyPath) {
      console.log(key, this.systemList, this.activeIndex);
      let systemName = "";
      this.systemList.forEach((item) => {
        if (key === item.url) {
          systemName = item.system;
        }
      });
      localStorage.setItem("systemName", systemName);
      this.$router.push({
        path: key,
      });

      this.$store.commit("ACTIVE_HEADER", { activeHeader: `#${key}` });
    },
    handleUser(isTrue) {
      this.showUser = isTrue;
    },
  },
  mounted() {
    this.getSystemFn();
    this.$store.commit("ACTIVE_HEADER", { activeHeader: location.hash });
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/platform/bd/config.scss";
.header {
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  // background: $header_bg;
  // color: $header_color;
  padding: 0;
  .logo {
    flex: 1;
    height: 60px;
    line-height: 58px;
    overflow: hidden;
    margin: 0 5px 0 0;
    & > div {
      float: left;
    }

    &-title {
      box-sizing: border-box;
      height: 60px;
      line-height: 71px;
      font-size: 16px;
      letter-spacing: 2px;
      font-family: PingFang-SC-Regular;
      span {
        display: inline-block;
        width: 182px;
        height: 20px;
        background: url(../../assets/img/logo.png) no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .menu {
    position: relative;
    z-index: 1;
    width: 1200px;
    overflow: hidden;
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
        font-size: 15px;
        height: 60px;
        line-height: 58px;
        width: 80px;
        cursor: pointer;
        text-align: center;
        font-family: PingFang-SC-Light;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 0.678);
        padding: 0 35px;
        transition: background 0.3s ease;
        &:hover {
          color: #fff;
          font-weight: bolder;
        }
      }
      // 激活态
      .active {
        color: #fff;
        font-weight: bolder;
        // font-family: PingFang-SC-Medium;
        background: #093976;
      }
    }
  }
  .user {
    position: relative;
    z-index: 1;
    flex: 1;
    height: 60px;
    box-sizing: border-box;
    overflow: hidden;
    transition: height 0.3s ease;
    .user-name {
      float: right;
      overflow: hidden;
      li {
        float: right;
        height: 60px;
        line-height: 58px;
        font-size: 14px;
        cursor: pointer;
        .user_icon {
          position: relative;
          top: 10px;
          display: inline-block;
          height: 40px;
          /deep/ .el-avatar--medium {
            width: 40px;
            height: 40px;
            line-height: 40px;
          }
        }
        &:nth-child(1) {
          span {
            margin-left: 5px;
          }
        }
        & > span {
          position: relative;
          top: -5px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
        }
      }
    }
    &-info {
      position: absolute;
      top: 60px;
      right: 0;
      width: 213px;
      height: 85px;
      color: rgba(255, 255, 255, 0.6);
      z-index: 100;
      background: #1f5191;
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
      letter-spacing: 1px;
      li {
        height: 35px;
        line-height: 35px;
        text-align: center;
        font-size: 14px;
        margin: 2px 0;
        cursor: pointer;
        text-align: left;
        &:hover {
          background: #3175cb;
          color: #fff;
        }
        .pwd_icon {
          position: relative;
          left: 20px;
          top: 2px;
          display: inline-block;
          width: 14px;
          height: 14px;
          background: url(../../assets/icon/Man@14_14.png) no-repeat;
        }
        .out_icon {
          position: relative;
          left: 20px;
          top: 2px;
          display: inline-block;
          width: 14px;
          height: 14px;
          background: url(../../assets/icon/Power@14_14.png) no-repeat;
        }
        span {
          margin-left: 30px;
        }
      }
    }
  }
}
</style>
