<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-11-11 09:28:51
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-07 09:28:29
 * @Description: 个人中心
-->
<template>
  <div class="personal-wrap">
    <el-container class="menu-body">
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
        <div class="content">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false,
      MENULIST: [
        {
          index: "/bd/index-personal/my-information",
          url: "/bd/index-personal/my-information",
          icon: "el-icon-user",
          title: "我的信息",
          children: [],
          disabled: false,
          iconCssClass: "",
          parentId: "0"
        },
        {
          index: "/bd/index-personal/my-subscriptions",
          url: "/bd/index-personal/my-subscriptions",
          icon: "el-icon-document",
          title: "我的订阅",
          children: [],
          disabled: false,
          iconCssClass: "",
          parentId: "1"
        },
        {
          index: "/bd/index-personal/my-collection",
          url: "/bd/index-personal/my-collection",
          icon: "el-icon-star-off",
          title: "我的收藏",
          children: [],
          disabled: false,
          iconCssClass: "",
          parentId: "2"
        }
      ] // 左侧菜单
    };
  },
  computed: {
    defaultActive() {
      if (this.$route.meta.parentPath) {
        return this.$route.meta.parentPath;
      } else {
        return this.$route.path;
      }
    }
  },
  methods: {
    // 菜单激活
    activeMenu(item) {
      if (this.$route.path !== item.url) {
        this.$router.replace({
          path: item.url,
        });
      }
    },
    // 折叠菜单
    Htarget(isTrue) {
      this.isCollapse = isTrue;
    }
  }
};
</script>
<style lang='scss' scoped>
@import "~@/assets/css/platform/bd/config.scss";

.personal-wrap {
  width: 100%;
  height: 100%;
  transition: width 0.3s ease;
}
.menu-body {
  height: 100%;
  overflow: hidden;
}
.lt-aside {
  position: relative;
  flex-direction: column;
  box-sizing: border-box;
  background: $lt_bg;
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
      // background: url(../assets/img/svg/fold.svg) no-repeat;
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
  // 左侧菜单icon
  .menu-icon-1 {
    display: inline-block;
    width: 25px;
    height: 18px;
    // background: url(../assets/img/svg/menu-icon-1.svg) no-repeat;
  }
  .menu-icon-2 {
    display: inline-block;
    width: 25px;
    height: 18px;
    // background: url(../assets/img/svg/menu-icon-2.svg) no-repeat;
  }
  .menu-icon-3 {
    display: inline-block;
    width: 25px;
    height: 18px;
    // background: url(../assets/img/svg/menu-icon-3.svg) no-repeat;
  }
  .menu-icon-4 {
    display: inline-block;
    width: 25px;
    height: 18px;
    // background: url(../assets/img/svg/menu-icon-4.svg) no-repeat;
  }
  .menu-icon-5 {
    display: inline-block;
    width: 25px;
    height: 18px;
    // background: url(../assets/img/svg/menu-icon-5.svg) no-repeat;
  }
  .menu-icon-6 {
    display: inline-block;
    width: 25px;
    height: 18px;
    // background: url(../assets/img/svg/menu-icon-6.svg) no-repeat;
  }
  .menu-icon-7 {
    display: inline-block;
    width: 25px;
    height: 18px;
    // background: url(../assets/img/svg/menu-icon-7.svg) no-repeat;
  }
}
.main {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  padding: 0 !important;
  background-color: $main_bg;
  .content {
    padding: 10px 12px 5px 10px;
    margin: 10px 0 10px 10px;
    min-width: 1300px;
    width: calc(100% - 20px);
    // height: calc(100% - 20px);
    min-height: 100%;
    box-sizing: border-box;
    overflow: auto;
    background: $main_content_bg;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  position: relative;
  z-index: 1;
  width: 180px;
  height: 46px;
}
</style>
