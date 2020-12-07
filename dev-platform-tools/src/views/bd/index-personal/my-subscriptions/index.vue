<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-11-15 14:29:10
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-07 09:28:17
 * @Description: 我的订阅=》我的收藏
-->
<template>
  <div class="my-subscriptions">
    <!-- 订阅列表 -->
    <div class="list-subscriptions" v-if="isShowNoData">
      <el-row class="dy-btn">
        <el-col :span="4">
          <el-button
            class="add-Dy"
            icon="el-icon-circle-plus-outline"
            :disabled="isDisabled"
            @click="clickBtn('add')"
            >新增订阅</el-button
          >
          <el-button
            class="add-Dy"
            icon="el-icon-edit"
            :disabled="isDisabled"
            @click="clickBtn('edit')"
            >编辑订阅</el-button
          >
        </el-col>
        <el-col :span="4" class="dy-Num">
          注：剩余可创建<span>{{ dyNum }}</span
          >个订阅
        </el-col>
      </el-row>

      <!-- 标签页面 -->
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        closable
        @tab-remove="removeTab"
        @tab-click="tabClick"
      >
        <el-tab-pane
          v-for="item in editableTabs"
          :key="item.id"
          :label="item.subscribeGroupName"
          :name="item.id"
        >
          <el-row class="search-wrap">
            <el-col :span="3">
              关键词；<el-select
                v-model="value1"
                placeholder="请选择"
                class="search-select"
              >
                <el-option
                  v-for="item in options1"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              行业类型：<el-select
                v-model="value2"
                placeholder="请选择"
                class="search-select"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              公告类型：<el-select
                v-model="value3"
                placeholder="请选择"
                class="search-select"
              >
                <el-option
                  v-for="item in options3"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              所在省市：<el-cascader
                v-model="cityAll"
                :options="optionsCity"
                :props="defaultParams"
                clearable
                collapse-tags
                :collapse-tags-max-num="2"
              >
              </el-cascader>
            </el-col>
            <el-col :span="3">
              时间范围：<el-select
                v-model="value4"
                placeholder="请选择"
                class="search-select"
              >
                <el-option
                  v-for="item in timeTypeArr"
                  :key="item.scopeCode"
                  :label="item.scopeName"
                  :value="item.scopeCode"
                >
                </el-option>
              </el-select>
            </el-col>
            <!-- search -->
            <el-col :span="8">
              <div class="search-box">
                <el-input
                  placeholder="请输入标讯关键词"
                  v-model="searchText"
                  class="search-input"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="getStandardTable"
                    class="search-btn"
                  ></el-button>
                </el-input>
              </div>
            </el-col>
          </el-row>

          <tipTitle :contentText="titleText" />
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
            :sortProp="sortProp"
            @changePage="changePage"
          >
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 暂无订阅 -->
    <no-data-tip v-if="!isShowNoData" alignment="column">
      <div class="no-data-content">
        <h1>您未添加任何订阅！</h1>
        <h6>温馨提示：</h6>
        <p>
          设置订阅关键词及检索条件后，标道将动态为您监控订阅内容的<br />招投标信息，商机实时监控不错过。
        </p>
        <div>
          <el-button class="add-Dy" @click="clickBtn('add')">立即添加订阅</el-button>
        </div>
      </div>
    </no-data-tip>
    <!-- 弹框组件 -->
    <template v-if="dialogVisible">
      <dialog-subscriptions
        :optionsCity="optionsCity"
        :citiesIntypeArr="citiesIntypeArr"
        :citiesNoticeArr="citiesNoticeArr"
        :searchRangeArr="searchRangeArr"
        @changeComponent="getSubscribeGroup"
      ></dialog-subscriptions>
    </template>
  </div>
</template>
<script>
import { mapMutations, mapActions, mapGetters } from "vuex";

import API from "api";
import GldTable from "@/components/bd/table";
import TipTitle from "@/components/bd/tip-title";
import NoDataTip from "@/components/bd/no-data-tip";
import dialogSubscriptions from "./dialog-subscriptions";

export default {
  data() {
    return {
      /* 暂无订阅 */
      isShowNoData: false,
      /* 订阅-列表 */
      dyNum: 0,
      dyTotal: 5,
      isDisabled: false,
      // 标签页
      editableTabsValue: "",
      editableTabs: [],
      value1: "", // 关键词
      options1: [{ name: "全部", code: "" }],
      value2: "", // 行业类型
      options2: [{ name: "全部", code: "" }],
      value3: "", // 公告类型
      options3: [{ name: "全部", code: "" }],
      value4: "1", // 时间范围
      cityAll: [], //所在省市
      optionsCity_list: [],
      searchText: "", // 搜索框
      defaultParams: {
        value: "id",
        multiple: true
      },
      titleText: `为您搜索到以下符合条件的标讯：约为<span style="color:#1F5191">0</span>个`,
      // table表格
      soltName: ["title"],
      tableLoading: false,
      tableData: [],
      tableName: [],
      pageNum: 1,
      pageSize: 20,
      totalCount: 0,
      pagination: [20,30,40,50],
      sortProp: ["releaseTime"]
    };
  },
  computed: {
    ...mapGetters({
      dialogVisible: "dialogVisible_ter",
      optionsCity: "optionsCity",
      citiesIntypeArr: "citiesIntypeArr",
      citiesNoticeArr: "citiesNoticeArr",
      searchRangeArr: "searchRangeArr",
      timeTypeArr: "timeTypeArr"
    })
  },
  methods: {
    ...mapMutations(["DY_OPRN_DIALOG", "DY_DIALOG_RULEFORM"]),
    ...mapActions([
      "getprovinceCityList",
      "getInstriesList",
      "getAnnouncementTypeList",
      "getSearchScopeList",
      "getTimeType"
    ]),
    // 添加订阅、编辑
    clickBtn(type) {
      this.DY_OPRN_DIALOG({
        type: true,
        isReset: true,
        title: type == "add" ? "添加订阅" : "编辑订阅"
      });

      if(type == "edit") {
        this.DY_DIALOG_RULEFORM({
            dyName: "名", // 订阅名称
            importWord: ["aa0", 'aaa2'], // 关键词
            importWord1: "aaa",
            importWord2: "",
            importWord3: "ss",
            importWord4: "qq",
            importWord5: "",
            importWord6: "",
            cityAll: [], // 所在省市
            industryType: [], // 行业类型
            noticeType: [], // 公告类型
            searchRange: "1" // 搜索范围 默认1 全文 2 标题
        })
      }
    },
    // 移除Tab
    removeTab(targetName) {
      this.$confirm(`您确定取消"此订阅"吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //点击确定按钮的操作
          this.subscribeGroupDelete(targetName);
        })
        .catch(error => {
          console.error(error);
        });
    },
    // 删除订阅信息
    subscribeGroupDelete(id) {
      let strQuery = {
        id: Number(id)
      };
      API.subscribeGroupDelete(strQuery)
        .then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: res.data.message,
              type: "success"
            });

            this.getSubscribeGroup();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取订阅列表、判断用户有无订阅
    async getSubscribeGroup() {
      await API.getSubscribeGroup()
        .then(res => {
          if (res.data.code === 0) {
            let resData = res.data.data || [];

            if (resData.length) {
              this.isShowNoData = true;
              // id 转化字符串
              resData.map(res => {
                if (res.id) {
                  res.id = res.id.toString();
                }
              });
              this.editableTabs = resData;
              this.editableTabsValue = resData.length && resData[0].id;
              this.dyNum = this.dyTotal - resData.length;
              if (resData.length === this.dyTotal) {
                this.isDisabled = true;
              }

              this.tabClick({
                name: this.editableTabsValue
              });
            } else {
              this.isShowNoData = false;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 点击Tab
    async tabClick(e) {
      let strQuery = {
        subscribeGroupId: Number(e.name)
      };

      this.value1 = "";
      this.options1 = [{ name: "全部", code: "" }];

      this.value2 = "";
      this.options2 = [{ name: "全部", code: "" }];

      this.value3 = "";
      this.options3 = [{ name: "全部", code: "" }];

      this.value4 = "1";

      this.cityAll = [];
      this.optionsCity_list = [];

      this.subscribeGetSubscribe(strQuery);
      this.getStandardTable();
    },
    // 获取筛选条件 => 关键词、行业类型、公告类型、所在省市
    async subscribeGetSubscribe(strQuery) {
      await API.subscribeGetSubscribe(strQuery)
        .then(res => {
          if (res.data.code === 0) {
            let data = res.data.data;
            // optionType
            // 1：关键词。2：公告类型。3：行业类别。 5：省 6:市 8 搜索范围
            if (JSON.stringify(data) !== "{}") {
              for (let i in data) {
                let item = data[i];
                if (i == 1) {
                  item.map(item => {
                    item.name = item.options;
                    item.code = item.options;
                  });
                  this.options1 = this.options1.concat(item);
                } else if (i == 2) {
                  this.citiesNoticeArr.forEach(itemNotic => {
                    item.map(items => {
                      if (items.options == itemNotic.code) {
                        items.name = itemNotic.name;
                        items.code = itemNotic.code;
                      }
                    });
                  });
                  this.options3 = this.options3.concat(item);
                } else if (i == 3) {
                  this.citiesIntypeArr.forEach(itemCities => {
                    item.map(items => {
                      if (items.options == itemCities.code) {
                        items.name = itemCities.name;
                        items.code = itemCities.code;
                      }
                    });
                  });
                  this.options2 = this.options2.concat(item);
                } else if (i == 5) {
                } else if (i == 6) {
                }
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取列表
    async getStandardTable() {
      this.tableLoading = true;
      // let params = {
      //   keyword: this.value1, // 搜索框关键字
      //   industriesType: this.value2, // 行业类别
      //   announcementType: this.value3, // 公告类型
      //   timeScope: this.value4, // 时间范围
      //   searchScope: this.searchText.trim(), // 搜索范围
      //   cityCode: "", // 市区
      //   provinceCode: "", // 省
      //   pageNum: this.pageNum,
      //   pageSize: this.pageSize
      // };
      let params = {"provinceCode":[""],"cityCode":[""],"industriesType":[""],"announcementType":[""],"timeScope":"3","searchScope":"","keyword":"","pageNum":1,"pageSize":20,"sortBy":"ASC"};
      await API.getStandardTable(params)
        .then(res => {
          this.tableLoading = false;
          if (res.data.code === 0) {
            let resData = res.data.data;
            if (resData && resData.data && resData.data.length !== 0) {
              this.tableData = resData.data;
              this.tableName = resData.title;
              this.totalCount = resData.total;
              this.titleText = `为您搜索到以下符合条件的标讯：约为<span style="color:#1F5191">${this.totalCount}</span>个`;
            }
          }
        })
        .catch(err => {
          this.tableLoading = false;
          console.log(err);
        });
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
        query: {
          id: rowData.id,
          cityName: rowData.cityName,
          industriesTypeName: rowData.industriesTypeName,
          provinceName: rowData.provinceName,
          releaseTime: rowData.releaseTime,
          announcementTypeName: rowData.announcementTypeName
        },
        path: "/bd/bx-search-details"
      });
    },
    // 获取
    getListAll() {
      this.getprovinceCityList();
      this.getInstriesList();
      this.getAnnouncementTypeList();
      this.getSearchScopeList();
      this.getTimeType();
    }
  },
  created() {
    this.getSubscribeGroup();
    this.getListAll();
  },
  components: {
    dialogSubscriptions,
    NoDataTip,
    TipTitle,
    GldTable
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/platform/bd/config.scss";
$px_14: 14px;
$color_fff: #fff;
$color_999: #999;
$color_555: #555;

.my-subscriptions {
  width: 100%;
  height: 100%;
}

/* 订阅=》列表 */
.list-subscriptions {
  height: 100%;
  padding: 20px 20px 30px;
  box-sizing: border-box;
  font-family: PingFangSC-Regular, PingFang SC;

  /deep/ .el-tabs__item:hover {
    color: $main_color !important;
  }
  /deep/ .el-tabs__item.is-active {
    color: $color_555 !important;
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: 1px solid $main_color !important;
  }
  /deep/ .el-tabs--card > .el-tabs__header {
    border-bottom: 1px solid $main_color !important;
  }
  /deep/ .el-tabs--bottom .el-tab-pane,
  .el-tabs--top .el-tab-pane {
    overflow: visible;
  }
}
.search-wrap {
  margin: 20px 0 25px;
  .search-select {
    width: 118px;
  }
  .search-box {
    float: right;
    .search-input {
      width: 240px;
    }
    .search-btn {
      background: $main_color !important;
    }
  }
}
.dy-btn {
  margin-bottom: 10px;
}
.add-Dy {
  background: $main_color;
  border-radius: 2px;
  font-size: $px_14;
  color: $color_fff;
}
.dy-Num {
  line-height: 34px;
  font-size: 12px;
  font-weight: 400;
  color: $color_999;
}
.own-table {
  margin-top: 28px;
}

/* 订阅=》暂无订阅 */
.no-data-content {
  > h1 {
    font-weight: 500;
    color: $color_555;
    line-height: 28px;
    font-size: 20px;
    text-align: center;
  }
  > h6 {
    margin: 20px 0 10px;
    font-size: $px_14;
    color: $color_999;
    line-height: 21px;
  }
  > div {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  > div > .add-Dy {
    background: $main_color;
    border-radius: 2px;
    font-size: $px_14;
    color: $color_fff;
    margin-top: 30px;
  }
}
</style>