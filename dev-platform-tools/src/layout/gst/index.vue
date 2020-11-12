<!--
 * @Author: Marlon
 * @Date: 2020-02-18 10:02:32
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-03 16:39:30
 * @Description: layout
 -->
 <template>
  <el-container class="layout">
    <el-header class="header-l">
      <Header @Htarget="Htarget" :HisCollapse="isCollapse"></Header>
    </el-header>
    <el-container class="body">
      <!-- 左侧菜单 -->
      <el-aside :width="!MENULIST ? '240px' : 'auto'" class="lt-aside">
        <el-menu
          v-if="MENULIST && MENULIST.length !== 0"
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
        >
          <!-- 一级 -->
          <template v-for="item in MENULIST" :index="item.url">
            <el-submenu
              v-if="item.children && item.children.length"
              :key="item.index"
              :index="item.url"
            >
              <!-- 二级 -->
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <template v-for="items in item.children">
                <el-submenu
                  v-if="items.children && items.children.length"
                  :key="items.index"
                  :index="items.url"
                >
                  <!-- 三级 -->
                  <template slot="title">
                    <i :class="items.icon"></i>
                    <span>{{ items.title }}</span>
                  </template>
                  <template v-for="itemss in items.children">
                    <el-submenu
                      v-if="itemss.children && itemss.children.length"
                      :key="itemss.index"
                      :index="itemss.url"
                    >
                      <!-- 四级 -->
                      <template slot="title">
                        <i :class="itemss.icon"></i>
                        <span>{{ itemss.title }}</span>
                      </template>
                      <template v-for="itemsss in itemss.children">
                        <el-submenu
                          v-if="itemsss.children && itemsss.children.length"
                          :key="itemsss.index"
                          :index="itemsss.url"
                        >
                          <!-- 五级 -->
                          <template slot="title">
                            <i :class="itemsss.icon"></i>
                            <span>{{ itemsss.title }}</span>
                          </template>
                          <template v-for="itemssss in itemsss.children">
                            <el-submenu
                              v-if="
                                itemssss.children && itemssss.children.length
                              "
                              :key="itemssss.index"
                              :index="itemssss.url"
                            >
                              <template slot="title">
                                <i :class="itemssss.icon"></i>
                                <span>{{ itemssss.title }}</span>
                              </template>
                              <!--  -->
                            </el-submenu>
                            <el-menu-item
                              v-else
                              :index="itemssss.url"
                              :key="itemssss.index"
                              @click="activeMenu(itemssss)"
                            >
                              <i :class="itemssss.icon"></i>
                              <span slot="title">{{ itemssss.title }}</span>
                            </el-menu-item>
                          </template>
                        </el-submenu>
                        <el-menu-item
                          v-else
                          :index="itemsss.url"
                          :key="itemsss.index"
                          @click="activeMenu(itemsss)"
                        >
                          <i :class="itemsss.icon"></i>
                          <span slot="title">{{ itemsss.title }}</span>
                        </el-menu-item>
                      </template>
                    </el-submenu>
                    <el-menu-item
                      v-else
                      :index="itemss.url"
                      :key="itemss.index"
                      @click="activeMenu(itemss)"
                    >
                      <i :class="itemss.icon"></i>
                      <span slot="title">{{ itemss.title }}</span>
                    </el-menu-item>
                  </template>
                </el-submenu>
                <el-menu-item
                  v-else
                  :index="items.url"
                  :key="items.index"
                  @click="activeMenu(items)"
                >
                  <i :class="items.icon"></i>
                  <span slot="title">{{ items.title }}</span>
                </el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item
              v-else
              :index="item.url"
              :key="item.index"
              @click="activeMenu(item)"
            >
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
        <p class="lt-collapse">
          <span
            :class="!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
            @click="Htarget(!isCollapse)"
          ></span>
        </p>
      </el-aside>
      <!-- 主体区 -->
      <el-main class="main">
        <!-- 面包屑 -->
        <div class="breadcrumb">
          <el-breadcrumb separator="/" class="breadcrumb-list">
            <el-breadcrumb-item
              v-for="(item, index) in Breadcrumb"
              :key="index"
              :to="{ path: item.path }"
              >{{ item.title }}</el-breadcrumb-item
            >
          </el-breadcrumb>
        </div>
        <div class="content">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { breadcrumbList } from "utils";
import { openUrl } from "utils/jump";
import Header from "@/layout/components/header.vue";
import system from "@/config/system.config.js";

const { PROJECTKEY, PLATFORM,  NODE_ENV } = system;

export default {
  components: {
    Header,
  },
  data() {
    return {
      isCollapse: false,
      MENULIST: [], // 左侧菜单
    };
  },
  computed: {
    ...mapGetters({
      Menu: "menuList",
      Breadcrumb: "breadcrumbList",
      userInfo: "userInfo",
    }),
    defaultActive() {
      // 特殊处理
      if (
        "/discovery/card/cardDetails" === this.$route.path ||
        "/discovery/card/cardDetailsThree" === this.$route.path
      ) {
        let { roleCode } = JSON.parse(this.$route.query.itemInfo);
        switch (roleCode) {
          case "01":
            {
              return `/discovery/card/zbrCard`;
            }
            return;
          case "02":
            {
              return `/discovery/card/zbdlCard`;
            }
            return;
          case "03":
            {
              return `/discovery/card/tbrCard`;
            }
            return;
          case "04":
            {
              return `/discovery/card/cgrCard`;
            }
            return;
          case "05":
            {
              return `/discovery/card/cgdlCard`;
            }
            return;
          case "06":
            {
              return `/discovery/card/gysCard`;
            }
            return;
          default:
            break;
        }
      } else if (this.$route.meta.parentPath) {
        return this.$route.meta.parentPath;
      } else {
        return this.$route.path;
      }
    },
  },
  watch: {
    $route(to, from) {
      this.setBreadcrumb(breadcrumbList(to));
    },
    Menu: {
      handler(newVal) {
        // console.log(newVal, "==================本地菜单");
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions({
      setBreadcrumb: "getBreadcrumbList",
      getMenusList: "getMenuList",
    }),
    // 菜单激活
    activeMenu(item) {
      // 中台特殊处理
      if (item.resUrlPrefix && item.resUrlPrefix === location.pathname) {
        // 本系统内
        if (this.$route.path !== item.url) {
          this.$router.replace({
            path: item.url,
          });
        }
      } else {
        if (!NODE_ENV) {
          if (this.$route.path !== item.url) {
            this.$router.replace({
              path: item.url,
            });
          }
        } else {
          // 跨系统
          openUrl({
            type: "href",
            url: item.url,
          });
        }
      }
    },
    // 折叠菜单
    Htarget(isTrue) {
      this.isCollapse = isTrue;
    },
    // 菜单数据处理
    loop(arr) {
      if (arr && arr.length) {
        arr.forEach((item) => {
          item["index"] = item.resCode;
          item["icon"] = item.icon || "";
          item["title"] = item.resName;
          item["url"] = item.resUrl;
          if (!NODE_ENV) {
            if (item.resUrlPrefix) {
              if (item.resUrl.indexOf("#") !== -1) {
                item["url"] = item.resUrl; // 系统级菜单地址
              } else {
                item["url"] = "/" + item.resUrl.split("//")[1];
              }
            } else {
              item["url"] = item.resUrl;
            }
          } else {
            if (item.resUrlPrefix) {
              if (item.resUrlPrefix === location.pathname) {
                if (item.resUrl.indexOf("#") !== -1) {
                  item["url"] = item.resUrl; // 系统级菜单地址
                } else {
                  item["url"] = "/" + item.resUrl.split("//")[1];
                }
              } else {
                if (item.resUrl.indexOf("#") !== -1) {
                  item["url"] = item.resUrl; // 系统级菜单地址
                } else {
                  item["url"] =
                    item.resUrlPrefix + "#/" + item.resUrl.split("//")[1];
                }
              }
            } else {
              item["url"] = item.resUrl;
            }
          }

          if (item.children) {
            this.loop(item.children);
          }
        });
      }
    },
    // 菜单处理
    getMenus() {
      // console.log(this.userInfo, "============中控信息");
      let menuList = [];
      let systemList = [];
      if (this.userInfo && this.userInfo.menus) {
        systemList = this.userInfo.menus.children[0].children;
      }
      // 获取系统对应的菜单
      systemList.forEach((systemItem) => {
        if (PLATFORM === systemItem.resCode) {
          menuList = systemItem.children;
        }
      });

      // 数据处理
      this.loop(menuList);
      // console.log(menuList, "菜单数据处理");
      this.MENULIST = menuList;
    },
  },
  mounted() {
    this.getMenus();
    this.getMenusList();
    this.setBreadcrumb(breadcrumbList(this.$route));
  },
};
</script>
<style lang='scss'>
@import "~@/assets/css/platform/gst/config.scss";
.layout {
  width: 100%;
  height: 100%;
  transition: width 0.3s ease;
}
.header-l {
  background: $header_bg;
}
.body {
  height: 100%;
  overflow: hidden;
}
.lt-aside {
  position: relative;
  flex-direction: column;
  box-sizing: border-box;
  background: $lt_bg;
  // transition: width 0.3s ease;
  color: $lt_font;
  margin-bottom: 28px;
  overflow-x: hidden;
  .lt-collapse {
    position: fixed;
    overflow: hidden;
    bottom: 0;
    width: 240px;
    height: 30px;
    line-height: 28px;
    background: $lt_menu_collapse;
    z-index: 1;
    span {
      position: relative;
      top: 7px;
      left: 17px;
      display: inline-block;
      height: 100%;
      width: 20px;
      box-sizing: border-box;
      cursor: pointer;
      background: url(../../assets/img/svg/d.svg) no-repeat;
    }
  }
  /deep/ .el-menu {
    position: relative;
    z-index: 1;
    background-color: transparent;
    border-right: 0;
  }
  /deep/ .el-submenu__title {
    color: $lt_font;
    padding-left: 30px;
    &:hover {
      background-color: $lt_menu_bg;
      color: $lt_memu_color;
      i {
        color: $lt_memu_color;
      }
    }
  }
  /deep/ .el-menu-item {
    color: $lt_font;
    &:hover {
      background-color: $lt_menu_bg;
      color: $lt_memu_color;
    }
    &:focus {
      background-color: $lt_menu_bg_active;
      color: $lt_memu_color;
    }
  }
  /deep/ .el-menu-item.is-active {
    background-color: $lt_menu_bg_active;
    color: $lt_memu_color;
  }
}
.main {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  padding: 0 !important;
  background-color: $main_bg;
  .breadcrumb {
    width: 100%;
    height: 30px;
    box-sizing: border-box;
    &-list {
      margin: 7px 10px;
      margin-left: 10px;
      padding-left: 10px;
      line-height: 30px;
      background: $main_breadcrumb_bg;
    }
  }
  .content {
    padding: 10px 12px 5px 10px;
    margin: 10px 0 10px 10px;
    min-width: 1300px;
    width: calc(100% - 20px);
    height: calc(100% - 58px);
    box-sizing: border-box;
    overflow: auto;
    background: $main_breadcrumb_bg;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  position: relative;
  z-index: 1;
  width: 240px;
  height: 50px;
}
</style>