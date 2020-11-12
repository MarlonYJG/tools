<!--
 * @Author: Marlon
 * @Date: 2020-06-09 10:44:44
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-27 14:05:44
 * @Description: 指标地图 - 树
--> 
<template>
  <div class="chart-view">
    <div class="chart-view" :id="'chart_tree_'+this.elId"></div>
    <!-- 弹出框-信息 -->
    <SoltDialog
      :SoltDigShow="soltDigShow"
      :SoltDigTitle="soltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="900"
      @editBtnCb="editBtnCb"
    >
      <div slot="soltDigContent" class="tree-nodeInfo">
        <ul class="query">
          <li>
            <label for>选择维度：</label>
            <el-cascader
              v-model="dig_1_val"
              :options="tag_1_list"
              :props="{ multiple: true }"
              collapse-tags
              clearable
              size="small"
              style="width: 150px;"
              :show-all-levels="false"
            ></el-cascader>
          </li>
          <li>
            <label for>时间修饰词：</label>
            <el-select
              v-model="dig_2_val"
              filterable
              clearable
              placeholder="请选择"
              size="small"
              style="width: 125px;"
            >
              <el-option
                v-for="item in tag_2_list"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </li>
          <li>
            <label for>状态：</label>
            <el-select
              v-model="dig_3_val"
              filterable
              clearable
              placeholder="请选择"
              size="small"
              style="width: 95px;"
            >
              <el-option
                v-for="item in tag_3_list"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </li>
          <li>
            <el-input
              placeholder="请输入派生指标名称"
              v-model="dig_4_val"
              clearable
              size="small"
              style="width: 170px;"
            ></el-input>
          </li>
          <li>
            <el-button size="small" type="primary" @click="getList">查询</el-button>
          </li>
        </ul>
        <TableDefault
          :TId="TId"
          :THeight="400"
          :TIsShowIndex="TIsShowIndex"
          :TAlign="TAlign"
          :TLoading="TLoading"
          :TTitle="TTitle"
          :TData="TData"
          :TEdit="TEdit"
          :TIsShowPage="true"
          :TTotal="TPage.total"
          :TCurrentPage="TPage.index"
          :TPageSize="TPage.size"
          @clickCell="lickCell"
          @editBtnCb="editBtnCb"
          @changePage="changePage"
        ></TableDefault>
      </div>
    </SoltDialog>
  </div>
</template>
 
 <script>
import { fromJS } from "immutable";
import SoltDialog from "@/components/dialog/solt-dialog";
import mixin from "mixin";
import API from "api/index";
import { ResDatas, reqFormatDic } from "utils/res-format";
import { cellJump } from "utils/jump";
export default {
  mixins: [mixin],
  components: {
    SoltDialog,
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return [
          {
            name: "命令概览",
            children: [
              {
                name: "线上查询及帮助命令 (2 个)",
                children: [{ name: "man" }, { name: "help" }],
              },
              {
                name: "文件和目录操作命令 (18 个)",
                children: [
                  { name: "ls" },
                  { name: "cd" },
                  { name: "cp" },
                  { name: "find" },
                  { name: "mkdir" },
                  { name: "mv" },
                  { name: "pwd" },
                  { name: "rename" },
                  { name: "rm" },
                  { name: "rmdir" },
                  { name: "touch" },
                  { name: "tree" },
                  { name: "basename" },
                  { name: "dirname" },
                  { name: "chattr" },
                  { name: "lsattr" },
                  { name: "file" },
                  { name: "md5sum" },
                ],
              },
              {
                name: "查看文件及内容处理命令（21 个）",
                children: [
                  { name: "cat" },
                  { name: "tac" },
                  { name: "more" },
                  { name: "less" },
                  { name: "head" },
                  { name: "tail" },
                  { name: "cut" },
                  { name: "split" },
                  { name: "paste" },
                  { name: "sort" },
                  { name: "uniq" },
                  { name: "wc" },
                  { name: "iconv" },
                  { name: "dos2unix" },
                  { name: "diff" },
                  { name: "vimdiff" },
                  { name: "rev" },
                  { name: "grep/egrep" },
                  { name: "join" },
                  { name: "tr" },
                  { name: "vi/vim" },
                ],
              },
              {
                name: "文件压缩及解压缩命令（4 个）",
                children: [
                  { name: "tar" },
                  { name: "unzip" },
                  { name: "gzip" },
                  { name: "zip" },
                ],
              },
              {
                name: "信息显示命令（11 个）",
                children: [
                  { name: "uname" },
                  { name: "hostname" },
                  { name: "dmesg" },
                  { name: "uptime" },
                  { name: "stat" },
                  { name: "du" },
                  { name: "df" },
                  { name: "top" },
                  { name: "free" },
                  { name: "date" },
                  { name: "cal" },
                ],
              },
              {
                name: "搜索文件命令（4 个）",
                children: [
                  { name: "which" },
                  { name: "find" },
                  { name: "whereis" },
                  { name: "locate" },
                ],
              },
              {
                name: "用户管理命令（10 个）",
                children: [
                  { name: "useradd" },
                  { name: "usermod" },
                  { name: "userdel" },
                  { name: "groupadd" },
                  { name: "passwd" },
                  { name: "chage" },
                  { name: "id" },
                  { name: "su" },
                  { name: "visudo" },
                  { name: "sudo" },
                ],
              },
              {
                name: "基础网络操作命令（11 个）",
                children: [
                  { name: "telnet" },
                  { name: "ssh" },
                  { name: "scp" },
                  { name: "wget" },
                  { name: "ping" },
                  { name: "route" },
                  { name: "ifconfig" },
                  { name: "ifup" },
                  { name: "ifdown" },
                  { name: "netstat" },
                  { name: "ss" },
                ],
              },
              {
                name: "深入网络操作命令（9 个）",
                children: [
                  { name: "nmap" },
                  { name: "lsof" },
                  { name: "mail" },
                  { name: "mutt" },
                  { name: "nslookup" },
                  { name: "dig" },
                  { name: "host" },
                  { name: "traceroute" },
                  { name: "tcpdump" },
                ],
              },
              {
                name: "有关磁盘与文件系统的命令（16 个）",
                children: [
                  { name: "mount" },
                  { name: "umount" },
                  { name: "fsck" },
                  { name: "dd" },
                  { name: "dumpe2fs" },
                  { name: "dump" },
                  { name: "fdisk" },
                  { name: "parted" },
                  { name: "mkfs" },
                  { name: "partprobe" },
                  { name: "e2fsck" },
                  { name: "mkswap" },
                  { name: "swapon" },
                  { name: "swapoff" },
                  { name: "sync" },
                  { name: "resize2fs" },
                ],
              },
              {
                name: "系统权限及用户授权相关命令（4 个）",
                children: [
                  { name: "chmod" },
                  { name: "chown" },
                  { name: "chgrp" },
                  { name: "umask" },
                ],
              },
              {
                name: "查看系统用户登陆信息的命令（7 个）",
                children: [
                  { name: "whoami" },
                  { name: "who" },
                  { name: "w" },
                  { name: "last" },
                  { name: "lastlog" },
                  { name: "users" },
                  { name: "finger" },
                ],
              },
              {
                name: "内置命令及其它（19 个）",
                children: [
                  { name: "echo" },
                  { name: "printf" },
                  { name: "rpm" },
                  { name: "yum" },
                  { name: "watch" },
                  { name: "alias" },
                  { name: "unalias" },
                  { name: "date" },
                  { name: "clear" },
                  { name: "history" },
                  { name: "eject" },
                  { name: "time" },
                  { name: "nc" },
                  { name: "xargs" },
                  { name: "exec" },
                  { name: "export" },
                  { name: "unset" },
                  { name: "type" },
                  { name: "bc" },
                ],
              },
              {
                name: "系统管理与性能监视命令 (9 个)",
                children: [
                  { name: "chlconfig" },
                  { name: "vmstat" },
                  { name: "mpstat" },
                  { name: "iostat" },
                  { name: "sar" },
                  { name: "ipcs" },
                  { name: "ipcrm" },
                  { name: "strace" },
                  { name: "ltrace" },
                ],
              },
              {
                name: "关机/重启/注销和查看系统信息的命令（6 个）",
                children: [
                  { name: "shutdown" },
                  { name: "halt" },
                  { name: "poweroff" },
                  { name: "logout" },
                  { name: "exit" },
                  { name: "Ctrl+d" },
                  { name: "ltrace" },
                ],
              },
              {
                name: "进程管理相关命令（15 个）",
                children: [
                  { name: "bg" },
                  { name: "fg" },
                  { name: "jobs" },
                  { name: "kill" },
                  { name: "killall" },
                  { name: "pkill" },
                  { name: "crontab" },
                  { name: "ps" },
                  { name: "pstree" },
                  { name: "nice/renice" },
                  { name: "nohup" },
                  { name: "pgrep" },
                  { name: "runlevel" },
                  { name: "init" },
                  { name: "service" },
                ],
              },
            ],
          },
        ];
      },
    },
    elId: {
      type: String,
      default: "",
    },
    chartConfig: {
      type: Object,
      default: function () {
        return {
          tooltip: {
            trigger: "item",
            //    triggerOn: 'mousemove'
            //formatter: function (x) {
            //  return x.data.children.children.des;
            //     }，
          },
          legend: {
            top: "2%",
            left: "3%",
            orient: "vertical",
            data: [
              {
                name: "Total Command List",
                icon: "rectangle",
              },
            ],
            borderColor: "#c23531",
          },
          series: [
            {
              type: "tree",
              name: "Total Command List",
              data: [],
              top: "5%",
              left: "12%",
              bottom: "2%",
              right: "37%",
              symbolSize: 13,

              label: {
                normal: {
                  position: "left",
                  verticalAlign: "middle",
                  align: "right",
                  fontSize: 17,
                  fontWeight: "bolder",
                  fontStyle: "oblique",
                },
              },

              leaves: {
                label: {
                  normal: {
                    position: "right",
                    verticalAlign: "middle",
                    align: "left",
                  },
                },
              },

              expandAndCollapse: true,

              animationDuration: 550,
              animationDurationUpdate: 750,
            },
          ],
        };
      },
    },
  },
  data() {
    return {
      // 弹出框
      soltDigShow: false,
      soltDigTitle: "",
      soltDFootBtn: [],
      dig_1_val: [],
      tag_1_list: [],
      dig_2_val: "",
      tag_2_list: [],
      dig_3_val: "",
      tag_3_list: [],
      dig_4_val: "",

      // 表格
      TId: "tree_info",
      TIsShowIndex: {
        show: true,
        // fixed: "left"
      },
      TAlign: [
        {
          key: "left",
          item: [],
        },
      ],
      TLoading: false,
      TTitle: [{ prop: "name", label: "派生指标名称" }],
      TData: [],
      TEdit: {
        show: true,
        slot: false,
        type: "popover",
        title: "操作",
        width: 150,
        editTypes: [
          {
            label: "查看值",
            css: "text",
          },
          {
            label: "收藏",
            css: "text",
          },
        ],
      },
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      indicatorId_: "",
    };
  },
  watch: {
    data: {
      handler: function (newVal, oldVal) {
        setTimeout(() => {
          this.draw();
        }, 0);
      },
      deep: true,
      immediate: true,
    },
    soltDigShow: {
      handler(newVal) {
        if (newVal) {
          this.getList();
        }
      },
      immediate: true,
    },
  },
  methods: {
    draw() {
      let myChart = this.$echarts.init(
        document.getElementById(`chart_tree_${this.elId}`)
      );
      this.initEvent(myChart);
      // 绘制图表
      if (this.chartConfig && this.chartConfig.series) {
        if (this.data && this.data.length) {
          let self = this;
          this.chartConfig.series[0].data = this.data;
          //   const ImmuSourceConfig = fromJS(this.chartConfig);
          //   const newChartConfig = ImmuSourceConfig.updateIn(
          //     ["series"],
          //     seriesItem => {
          //       // TODO 待优化
          //       return seriesItem.update(0, dataItem => {
          //         return dataItem.updateIn(["data"], valItem => {
          //           return valItem.map(function(item, index) {
          //             return item.set("value", self.data[index]);
          //           });
          //         });
          //       });
          //     }
          //   );
          //   myChart.setOption(newChartConfig.toJS());
          myChart.setOption(this.chartConfig);
        } else {
          myChart.clear();
        }
      } else {
        myChart.clear();
      }
    },
    initEvent(myChart) {
      let $this = this;
      myChart.on("click", function (params) {
        if (params.data.id.split("_").indexOf("indicotor") !== -1) {
          if (
            params.data.id.split("_").indexOf("indicotor") !==
            params.data.id.split("_").length - 1
          ) {
            let arr__ = params.data.id.split("_");
            $this.indicatorId_ = params.data.id.split("_")[arr__.length - 1];
            $this.getDis(params.data.id.split("_")[2]);
            $this.nodeInfo(params);
          }
        }
        return;
      });
    },
    editBtnCb(editItem, tid, row) {
      if (editItem.label === "close") {
        this.soltDigShow = editItem.close;
        this.indicatorId_ = "";
        this.dig_4_val = "";
        this.dig_3_val = "";
        this.dig_2_val = "";
        this.TData = this.dig_1_val = this.soltDFootBtn = [];
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    // 单元格事件
    lickCell({ row, column, id }) {
      const { name } = row;
      switch (column.label) {
        case "查看值": {
          cellJump(this, {
            row,
            column,
            TClickItem: [
              {
                link: "/indicator/view/mapDetails",
                jump: {
                  type: "push",
                  mode: "int",
                },
              },
            ],
          });
          return;
        }
        case "收藏": {
          this.collect([row.id], name);
          return;
        }
        default:
          break;
      }
    },
    // 点击获取节点信息
    nodeInfo(node) {
      this.soltDigTitle = "查询";
      this.soltDigShow = true;
    },
    // 树数据处理
    loopTree(arr) {
      if (arr && arr.length) {
        arr.forEach((item) => {
          item["value"] = item.no;
          if (item.children && item.children.length) {
            this.loopTree(item.children);
          } else {
            delete item.children;
          }
        });
      }
    },

    /* 请求 */
    // 获取维度
    getDis(domainId) {
      API.getIndicatorDis({ domainId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          this.loopTree(Res);
          this.tag_1_list = Res;
        } else {
          this.tag_1_list = [];
        }
      });
    },
    // 获取时间
    getTime() {
      API.getIndicatorTime().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.tag_2_list = Res;
      });
    },
    // 获取状态
    getState() {
      API.getIndicatorState().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.tag_3_list = Res;
      });
    },
    // 查询
    getList() {
      if (this.indicatorId_) {
        this.TLoading = true;
        let dimensionList = [];
        this.dig_1_val.forEach((item) => {
          dimensionList.push({
            code: item[1],
            parentCode: item[0],
          });
        });
        let dimensionList__ = null;
        if (!dimensionList.length) {
          dimensionList__ = null;
        } else {
          dimensionList__ = dimensionList;
        }
        API.getIndicatorPsList({
          dimensionList: dimensionList__,
          indicatorId: this.indicatorId_,
          name: this.dig_4_val,
          pageNo: this.TPage.index,
          pageSize: this.TPage.size,
          status: this.dig_3_val,
          timeModifier: this.dig_2_val,
        }).then((res) => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "total",
                pageSize: "pageSize",
                index: "pageNo",
              },
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, total, pageSize, title, index } = Res.formatData();
            this.TTitle = title;
            this.TData = data;
            this.TPage = {
              total,
              size: pageSize,
              index,
            };
            if (!data.length) {
              this.soltDFootBtn = [
                {
                  label: "前往修改",
                  css: "",
                  cb: () => {
                    this.TLoading = false;
                  },
                },
                {
                  label: "新定义指标",
                  css: "",
                  cb: () => {
                    cellJump(this, {
                      TClickItem: [
                        {
                          link: "/indicator/management/derivedIndicators",
                          jump: {
                            type: "push",
                            mode: "int",
                          },
                        },
                      ],
                    });
                  },
                },
              ];
              this.$message({
                message: "很抱歉，无法查询符合条件的派生指标",
                type: "warning",
              });
            } else {
              this.soltDFootBtn = [
                {
                  label: "前往修改",
                  css: "",
                  cb: () => {
                    this.TLoading = false;
                  },
                },
              ];
            }
          } else {
            this.TData = [];
            this.TPage = {
              total: 0,
              size: 10,
              index: 1,
            };
          }
        });
      }
    },
    // 收藏接口
    collect(deriveIndicatorIds, name) {
      API.indicatorCollect({ deriveIndicatorIds }).then((res) => {
        if (res.data.code === 0) {
          this.$confirm(`该"${name}"收藏成功，可从我的收藏快速查询`, "提示", {
            confirmButtonText: "前往查看",
            cancelButtonText: "关闭",
            type: "warning",
          })
            .then(() => {
              cellJump(this, {
                TClickItem: [
                  {
                    link: "/indicator/view/collect",
                    jump: {
                      type: "push",
                      mode: "int",
                    },
                  },
                ],
              });
            })
            .catch(() => {});
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
          });
        }
      });
    },
  },
  mounted() {
    this.getTime();
    this.getState();
  },
};
</script>
 
<style lang="scss" scoped>
.chart-view {
  width: 100%;
  height: 2500px;
  .tree-nodeInfo {
    .query {
      overflow: hidden;
      li {
        float: left;
        margin-right: 10px;
        &:last-child {
          float: right;
          margin-right: 0;
        }
      }
    }
  }
}
</style>
